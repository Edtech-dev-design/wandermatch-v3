// ============================================================================
// WANDERMATCH DUAL-CORE OTA BLIND BOOKING ENGINE (CLOUDFLARE WORKER V4.1)
// Controlled Modular Architecture, Environment Isolation & Security Hardening
// ============================================================================
import { V4RelationalDatabase, mergeV4DeltaIntoV3State, deterministicUuidV4 } from "./src/services/v4RelationalEngine.js";
import { enforceEnvironmentIsolation, normalizeSupabaseUrl } from "./src/middleware/envIsolationGuard.js";
import { generateRequestId } from "./src/utils/logger.js";
import { executeResilientDualAICoPilot } from "./src/modules/ai/aiCoPilotService.js";

// 1. KHO DỮ LIỆU CHUYẾN BAY ĐA TUYẾN (FLIGHT API MOCK)
const FLIGHTS_DB = [
  // HAN (Hà Nội)
  { flight_id: "VN151", origin: "HAN", city: "Đà Lạt", airline: "Vietnam Airlines", time: "08:30 - 10:15", price: 2100000 },
  { flight_id: "VJ403", origin: "HAN", city: "Đà Lạt", airline: "Vietjet Deluxe", time: "10:20 - 12:05", price: 1650000 },
  { flight_id: "QH121", origin: "HAN", city: "Quy Nhơn", airline: "Bamboo Airways", time: "09:00 - 10:35", price: 1950000 },
  { flight_id: "VN162", origin: "HAN", city: "Quy Nhơn", airline: "Vietnam Airlines", time: "13:45 - 15:20", price: 2250000 },
  { flight_id: "VN181", origin: "HAN", city: "Măng Đen", airline: "Vietnam Airlines (Bay Pleiku + Limousine)", time: "07:45 - 10:30", price: 2050000 },
  { flight_id: "VN137", origin: "HAN", city: "Huế", airline: "Vietnam Airlines", time: "09:15 - 10:30", price: 1600000 },
  { flight_id: "VJ302", origin: "HAN", city: "Huế", airline: "Vietjet Deluxe", time: "11:15 - 12:30", price: 1350000 },
  { flight_id: "VJ971", origin: "HAN", city: "Phú Quốc", airline: "Vietjet Deluxe", time: "09:40 - 11:50", price: 2450000 },
  { flight_id: "VN123", origin: "HAN", city: "Nha Trang", airline: "Vietnam Airlines", time: "08:15 - 10:05", price: 1980000 },
  // SGN (TP. Hồ Chí Minh)
  { flight_id: "VN214", origin: "SGN", city: "Đà Lạt", airline: "Vietnam Airlines", time: "07:00 - 08:00", price: 1450000 },
  { flight_id: "VJ361", origin: "SGN", city: "Đà Lạt", airline: "Vietjet Deluxe", time: "09:15 - 10:15", price: 1150000 },
  { flight_id: "VN139", origin: "SGN", city: "Quy Nhơn", airline: "Vietnam Airlines", time: "08:15 - 09:25", price: 1380000 },
  { flight_id: "VN186", origin: "SGN", city: "Măng Đen", airline: "Vietnam Airlines (Bay Pleiku + Limousine)", time: "07:15 - 09:45", price: 1400000 },
  { flight_id: "VN250", origin: "SGN", city: "Huế", airline: "Vietnam Airlines", time: "08:00 - 09:25", price: 1420000 },
  { flight_id: "VN182", origin: "SGN", city: "Phú Quốc", airline: "Vietnam Airlines", time: "07:30 - 08:35", price: 1550000 },
  { flight_id: "VJ602", origin: "SGN", city: "Nha Trang", airline: "Vietjet Deluxe", time: "08:00 - 09:05", price: 1250000 },
  // DAD (Đà Nẵng)
  { flight_id: "VN311", origin: "DAD", city: "Đà Lạt", airline: "Vietnam Airlines", time: "08:10 - 09:20", price: 1350000 },
  { flight_id: "VN322", origin: "DAD", city: "Măng Đen", airline: "Vietnam Airlines (Bay Pleiku + Limousine)", time: "09:00 - 10:45", price: 1380000 },
  { flight_id: "VN344", origin: "DAD", city: "Phú Quốc", airline: "Vietnam Airlines", time: "10:15 - 12:00", price: 1650000 },
  { flight_id: "VJ388", origin: "DAD", city: "Nha Trang", airline: "Vietjet Deluxe", time: "08:45 - 09:50", price: 1280000 },
  { flight_id: "QH355", origin: "DAD", city: "Quy Nhơn", airline: "Bamboo Airways", time: "07:30 - 08:30", price: 1200000 },
  { flight_id: "VN301", origin: "DAD", city: "Huế", airline: "Vietnam Airlines (Limousine Hạng Thương Gia)", time: "08:00 - 10:00", price: 650000 },
  // VCA (Cần Thơ)
  { flight_id: "VN411", origin: "VCA", city: "Đà Lạt", airline: "Vietnam Airlines", time: "08:00 - 09:00", price: 1400000 },
  { flight_id: "VN422", origin: "VCA", city: "Quy Nhơn", airline: "Vietnam Airlines", time: "09:15 - 10:30", price: 1480000 },
  { flight_id: "VN433", origin: "VCA", city: "Huế", airline: "Vietnam Airlines", time: "07:45 - 09:15", price: 1520000 },
  { flight_id: "VN455", origin: "VCA", city: "Phú Quốc", airline: "Bamboo Airways (Tàu cao tốc / Bay)", time: "08:30 - 09:30", price: 950000 },
  { flight_id: "VN466", origin: "VCA", city: "Nha Trang", airline: "Vietnam Airlines", time: "10:00 - 11:10", price: 1380000 },
  { flight_id: "VN477", origin: "VCA", city: "Măng Đen", airline: "Vietnam Airlines (Bay Pleiku + Limousine)", time: "07:30 - 10:15", price: 1550000 },
  // HPH (Hải Phòng)
  { flight_id: "VJ511", origin: "HPH", city: "Đà Lạt", airline: "Vietjet Deluxe", time: "08:15 - 10:00", price: 1750000 },
  { flight_id: "VN522", origin: "HPH", city: "Nha Trang", airline: "Vietnam Airlines", time: "09:00 - 10:45", price: 1950000 },
  { flight_id: "VJ533", origin: "HPH", city: "Phú Quốc", airline: "Vietjet Deluxe", time: "10:15 - 12:30", price: 2350000 },
  { flight_id: "VN544", origin: "HPH", city: "Huế", airline: "Vietnam Airlines", time: "08:45 - 10:00", price: 1550000 },
  { flight_id: "QH555", origin: "HPH", city: "Quy Nhơn", airline: "Bamboo Airways", time: "09:30 - 11:05", price: 1880000 },
  { flight_id: "VN566", origin: "HPH", city: "Măng Đen", airline: "Vietnam Airlines (Bay Pleiku + Limousine)", time: "07:45 - 10:45", price: 2150000 }
];

// 2. KHO DỮ LIỆU KHÁCH SẠN & TRẢI NGHIỆM ĐA PHƯƠNG ÁN (HOTEL & EXPERIENCE API MOCK)
const HOTELS_DB = [
  {
    hotel_id: "HTL-DL-01", city: "Đà Lạt", hotel_name: "Ana Mandara Villas Dalat Resort & Spa (5 Sao)",
    mystery_theme: "3N2Đ Biệt Thự Pháp Cổ Rừng Thông & Biển Mây Cao Nguyên",
    combo_title: "3N2Đ Biệt Thự Pháp Cổ Rừng Thông & Săn Mây Cầu Đất",
    price_per_night: 1350000, retail_per_night: 2250000, rating: 4.95, sla_code: "SLA-DL-88219",
    weather_temp_c: 16, weather_desc: "Se lạnh, sương mù nhẹ buổi sớm",
    vector: { healing: 96, nature: 90, solitude: 85, comfort: 92, culture: 82 },
    keywords: ["săn mây", "rừng thông", "se lạnh", "cà phê", "biệt thự", "đà lạt"],
    hint: "Nơi bạn sắp đến có tiết trời 16°C cùng những căn biệt thự Pháp ẩn dưới rừng thông già bảng lảng sương khói.",
    packing: ["Áo khoác giữ nhiệt & khăn choàng", "Giày thể thao chống trượt dạo đồi thông", "CCCD bản gốc làm thủ tục bay", "Kem dưỡng ẩm", "Sạc dự phòng"],
    food_guide: ["Bánh căn Lệ 27 Yersin (40.000đ/đĩa)", "Lẩu gà lá é Tao Ngộ (300.000đ/nồi)", "Cà phê Túi Mơ To (65.000đ/ly)"],
    itinerary_variants: [
      [
        { day: "Ngày 1: Chạm Ngõ Biệt Thự Thông", morning: "Đáp chuyến bay sáng, xe riêng đón về Villa Pháp cổ nhận phòng & uống trà thảo mộc nóng.", afternoon: "Dạo bộ thiền hành dưới rừng thông & ngâm chân thảo dược ấm.", evening: "Ăn tối Lẩu gà lá é nóng hổi trong tiết trời 16°C." },
        { day: "Ngày 2: Biển Mây & Lưu Trữ Cổ", morning: "05:30 Đón bình minh trên biển mây cao nguyên & ăn bánh căn bản địa.", afternoon: "Tham quan dinh thự kiến trúc cổ & Spa tinh dầu thông.", evening: "Tiệc tối rau hữu cơ & rượu vang nhẹ bên lò sưởi." },
        { day: "Ngày 3: Quà Tặng Cao Nguyên", morning: "Mua hồng treo gió công nghệ Nhật & trà thảo mộc tại quầy OCOP.", afternoon: "Check-out muộn theo cam kết SLA, xe riêng tiễn ra sân bay." }
      ]
    ]
  },
  {
    hotel_id: "HTL-MD-01", city: "Măng Đen", hotel_name: "Golden Boutique Hotel Măng Đen (4 Sao Plus)",
    mystery_theme: "3N2Đ Trú Ẩn Rừng Nguyên Sinh & Thác Nước Tinh Khôi",
    combo_title: "3N2Đ Trú Ẩn Rừng Nguyên Sinh & Thác Nước Tinh Khôi",
    price_per_night: 1150000, retail_per_night: 1850000, rating: 4.88, sla_code: "SLA-MD-77310",
    weather_temp_c: 18, weather_desc: "Trong lành, se lạnh, hương nhựa thông non",
    vector: { healing: 99, nature: 98, solitude: 96, comfort: 78, culture: 82 },
    keywords: ["độc hành", "hoang sơ", "rừng thông", "thác pa sỹ", "chữa lành", "măng đen"],
    hint: "Miền đất cao nguyên 1200m giữ trọn vẻ hoang sơ thuần khiết, nơi tiếng thông reo hòa cùng tiếng thác róc rách suốt ngày đêm.",
    packing: ["Áo hoodie hoặc len mỏng", "Xịt chống côn trùng thảo mộc", "CCCD bản gốc", "Giày leo núi bám tốt", "Bình giữ nhiệt cá nhân"],
    food_guide: ["Gà nướng cơm lam Cô Sinh (260.000đ/con)", "Lẩu xuyên tiêu Măng Đen (320.000đ/nồi)", "Cà phê Eva rang củi (40.000đ/ly)"],
    itinerary_variants: [
      [
        { day: "Ngày 1: Rời Xa Đô Thị Về Rừng", morning: "Hạ cánh sân bay, xe Limousine đón đưa qua cung đường thông nhận phòng.", afternoon: "Đi dạo rừng thông bản địa & nhâm nhi cà phê Arabica.", evening: "Thưởng thức lẩu xuyên tiêu ấm nồng bên bếp than hồng." },
        { day: "Ngày 2: Dấu Chân Đại Ngàn", morning: "Khám phá thác nước trắng xóa giữa rừng già và cầu treo mộng mơ.", afternoon: "Tham quan vườn tượng gỗ dân gian & hái cam sành sinh thái tại vườn.", evening: "Ăn tối gà nướng cơm lam ống nứa chuẩn vị bản địa." },
        { day: "Ngày 3: Năng Lượng Tinh Khiết", morning: "Đón sương mai bên hồ nước phẳng lặng, dạo cầu sắt ngắm hoa sim tím.", afternoon: "Xe riêng đưa ra sân bay đón chuyến bay trở về." }
      ]
    ]
  },
  {
    hotel_id: "HTL-QN-01", city: "Quy Nhơn", hotel_name: "Avani Quy Nhon Resort (5 Sao Ban Công Biển)",
    mystery_theme: "3N2Đ Biển Xanh Ngọc Bích, Vách Đá Kỳ Vĩ & Hoàng Hôn Làng Chài",
    combo_title: "3N2Đ Biển Xanh Ngọc Bích, Vách Đá Eo Gió & Hoàng Hôn Nhơn Lý",
    price_per_night: 1300000, retail_per_night: 2100000, rating: 4.90, sla_code: "SLA-QN-44102",
    weather_temp_c: 27, weather_desc: "Nắng vàng dịu nhẹ, biển xanh trong vắt",
    vector: { healing: 88, nature: 94, solitude: 82, comfort: 89, culture: 70 },
    keywords: ["biển", "làng chài", "hải sản", "nắng ấm", "eo gió", "kỳ co", "quy nhơn"],
    hint: "Bờ cát vàng óng ả nép mình dưới rặng dừa xanh, nơi bạn phóng tầm mắt từ ban công phòng ngủ ra vịnh biển xanh ngọc.",
    packing: ["Đồ bơi & kính râm", "Kem chống nắng SPF50+", "CCCD bản gốc", "Mũ rộng vành", "Túi chống nước điện thoại"],
    food_guide: ["Bánh xèo tôm nhảy Gia Vỹ (35.000đ/cái)", "Bún chả cá Ngọc Liên (45.000đ/tô)", "Ốc Thúy Kiều (50.000đ/đĩa)"],
    itinerary_variants: [
      [
        { day: "Ngày 1: Nắng Vàng Biển Xanh", morning: "Hạ cánh sân bay, xe đón về Resort ven biển nhận phòng ocean-view.", afternoon: "Tắm biển nước ấm trong xanh & chèo kayak vịnh nhỏ.", evening: "Thưởng thức tiệc hải sản tươi sống đánh bắt tại làng chài." },
        { day: "Ngày 2: Đảo Ngọc & Tuyệt Tác Vách Đá", morning: "Đi cano cao tốc ra bãi biển hoang sơ tắm biển ngắm san hô nhiều màu sắc.", afternoon: "Tản bộ con đường ven vách đá ngắm sóng xô bờ hùng vĩ.", evening: "Thưởng thức bún chả cá và ốc biển tươi ngon tại trung tâm phố." },
        { day: "Ngày 3: Bình Minh Đại Dương", morning: "Ngắm mặt trời mọc đỏ rực từ ban công phòng, ăn sáng buffet sát biển.", afternoon: "Mua đặc sản biển làm quà, xe tiễn ra sân bay." }
      ]
    ]
  },
  {
    hotel_id: "HTL-HUE-01", city: "Huế", hotel_name: "Pilgrimage Village Boutique Resort & Spa (5 Sao Cổ Điển)",
    mystery_theme: "3N2Đ Tĩnh Lặng Miền Di Sản, Onsen Khoáng Nóng & Trà Chiều Bên Sông",
    combo_title: "3N2Đ Tĩnh Lặng Cố Đô, Onsen Suối Khoáng & Trà Chiều Sông Hương",
    price_per_night: 1200000, retail_per_night: 1950000, rating: 4.92, sla_code: "SLA-HUE-99201",
    weather_temp_c: 24, weather_desc: "Dịu mát, bảng lảng hương trầm và sen",
    vector: { healing: 93, nature: 80, solitude: 88, comfort: 93, culture: 99 },
    keywords: ["văn hóa", "di sản", "cố đô", "ẩm thực", "chùa", "thiền", "khoáng nóng", "huế"],
    hint: "Một không gian ngập tràn sắc gạch nung rêu phong, dòng sông êm đềm và nguồn suối khoáng nóng xoa dịu tâm hồn.",
    packing: ["Trang phục kín đáo viếng di tích", "Đồ bơi ngâm khoáng nóng", "CCCD bản gốc", "Giày đi bộ êm chân", "Ô gấp che mưa nắng"],
    food_guide: ["Bún bò Mệ Kéo 20 Bạch Đằng (40.000đ/tô)", "Cơm hến Hoa Đông Cồn Hến (25.000đ/tô)", "Bánh bèo nậm lọc Bà Đỏ (60.000đ/khay)"],
    itinerary_variants: [
      [
        { day: "Ngày 1: Chạm Vào Rêu Phong", morning: "Hạ cánh sân bay, xe đưa về khu nghỉ dưỡng nhận Bungalow mộc mạc.", afternoon: "Ngâm suối khoáng nóng tự nhiên và xông hơi thảo dược cung đình.", evening: "Thưởng thức ẩm thực truyền thống trong không gian nhà rường cổ." },
        { day: "Ngày 2: Dấu Ấn Di Sản Cổ Xưa", morning: "Dạo bước quần thể di sản kiến trúc cổ & nghe thuyết minh văn hóa.", afternoon: "Ghé ngôi chùa cổ kính bên bờ sông lộng gió.", evening: "Du thuyền nghe nhạc truyền thống trên sông và thả hoa đăng ước nguyện." },
        { day: "Ngày 3: Hương Vị Lắng Đọng", morning: "Thưởng thức trà sen thanh tao & ăn bánh truyền thống gia truyền.", afternoon: "Check-out thảnh thơi, xe đưa ra sân bay trở về." }
      ]
    ]
  },
  {
    hotel_id: "HTL-PQ-01", city: "Phú Quốc", hotel_name: "Salinda Resort Phu Quoc Island (5 Sao Quốc Tế)",
    mystery_theme: "3N2Đ Nghỉ Dưỡng Đảo Nhiệt Đới Sang Trọng & Hoàng Hôn Vô Cực",
    combo_title: "3N2Đ Nghỉ Dưỡng Đảo Ngọc Sang Trọng & Hoàng Hôn Vô Cực",
    price_per_night: 1550000, retail_per_night: 2750000, rating: 4.96, sla_code: "SLA-PQ-55190",
    weather_temp_c: 29, weather_desc: "Nắng vàng biển ngọc, hoàng hôn tím lộng lẫy",
    vector: { healing: 80, nature: 88, solitude: 60, comfort: 99, culture: 65 },
    keywords: ["resort 5 sao", "sang trọng", "biển đảo", "hoàng hôn", "phú quốc", "nghỉ dưỡng"],
    hint: "Ốc đảo bình yên trên bờ cát mịn ngắm trọn hoàng hôn rực rỡ nhất vịnh biển phía Nam với dịch vụ 5 sao quốc tế.",
    packing: ["Đồ bơi & đầm maxi / sơ mi biển", "Kính râm & kem chống nắng", "CCCD bản gốc", "Dép xỏ ngón chống trượt"],
    food_guide: ["Bún quậy Kiến Xây (65.000đ/tô)", "Bún kèn Út Lượm (45.000đ/tô)", "Hải sản tươi sống Hàm Ninh"],
    itinerary_variants: [
      [
        { day: "Ngày 1: Đón Nắng Đảo Nhiệt Đới", morning: "Đáp chuyến bay thẳng, xe VIP đón về Resort 5★ nhận phòng ban công vườn.", afternoon: "Tắm hồ bơi điện phân muối vô cực nhìn thẳng ra biển.", evening: "Thưởng thức cocktail ngắm hoàng hôn đỏ rực & ăn hải sản nướng." },
        { day: "Ngày 2: Biển Đảo Kỷ Niệm", morning: "Khám phá quần đảo nhỏ nước trong như pha lê, lặn ngắm rạn san hô.", afternoon: "Trải nghiệm cáp treo vượt biển ngắm toàn cảnh đại dương.", evening: "Dạo chợ đêm thưởng thức ẩm thực hải sản tươi ngon." },
        { day: "Ngày 3: Thư Giãn Tuyệt Đối", morning: "Buffet sáng quốc tế ngập tràn món ngon kèm nhạc đàn piano sống.", afternoon: "Xe riêng tiễn ra sân bay hoàn tất kỳ nghỉ hoàn hảo." }
      ]
    ]
  },
  {
    hotel_id: "HTL-NT-01", city: "Nha Trang", hotel_name: "Amiana Resort Nha Trang (5 Sao Vịnh Biển)",
    mystery_theme: "3N2Đ Hồ Bơi Nước Biển Tự Nhiên & Tắm Bùn Khoáng Nóng Vịnh Xanh",
    combo_title: "3N2Đ Hồ Bơi Nước Biển Tự Nhiên & Tắm Bùn Khoáng Nóng",
    price_per_night: 1400000, retail_per_night: 2400000, rating: 4.94, sla_code: "SLA-NT-33201",
    weather_temp_c: 28, weather_desc: "Gió biển mát rượi, vịnh êm sóng nhẹ",
    vector: { healing: 90, nature: 92, solitude: 75, comfort: 95, culture: 70 },
    keywords: ["vịnh biển", "tắm bùn", "hồ bơi tự nhiên", "hải sản", "nha trang", "resort"],
    hint: "Resort nép mình trong một vịnh biển biệt lập phẳng lặng như gương, nơi có hồ bơi nước biển rộng 2500m2 ôm trọn đại dương.",
    packing: ["Đồ bơi & kính bơi", "Kem dưỡng sau nắng", "CCCD bản gốc", "Trang phục dạo phố"],
    food_guide: ["Nem nướng Đặng Văn Quyên (60.000đ/suất)", "Bánh căn 51 Tô Hiến Thành (70.000đ/đĩa)", "Bún chả cá Năm Beo (45.000đ/tô)"],
    itinerary_variants: [
      [
        { day: "Ngày 1: Vịnh Nhỏ Thiên Đường", morning: "Hạ cánh sân bay ven biển, xe đưa dọc đại lộ đèo biển về Resort nhận phòng.", afternoon: "Thả mình trong hồ bơi nước biển tự nhiên 2500m2 hoặc chèo ván đứng SUP.", evening: "Ăn tối lẩu hải sản mực nhảy bên bờ sóng vỗ êm đềm." },
        { day: "Ngày 2: Tắm Bùn & Phục Hồi Thể Lực", morning: "Trải nghiệm tắm bùn khoáng nóng tái tạo làn da và khớp.", afternoon: "Ghé tháp cổ Champa ngắm toàn cảnh cửa sông hiền hòa.", evening: "Thưởng thức nem nướng đặc sản & dạo biển đêm." },
        { day: "Ngày 3: Bình Yên Vẫy Gọi", morning: "Yoga đón bình minh bên bờ vịnh biển riêng tư.", afternoon: "Mua yến sào & chả cá đặc sản, xe tiễn ra sân bay." }
      ]
    ]
  }
];

// TABU COOLDOWN RING BUFFERS (In-memory cooldown cache)
const SESSION_TABU_CACHE = new Map();

function normVN(str = "") {
  return String(str || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/đ/g, "d").replace(/Đ/g, "D").toLowerCase().trim();
}

function normBookingCode(code = "") {
  return String(code || "").trim().toUpperCase().replace(/[^A-Z0-9]/g, "");
}

// Sanitize any accidental city/hotel name leaks in pre-reveal strings
const SENSITIVE_LOCATION_TERMS = [
  "Đà Lạt", "Da Lat", "Dalat", "Liên Khương", "Cầu Đất",
  "Măng Đen", "Mang Den", "Pleiku", "Kon Plông", "Kon Pring", "Pa Sỹ", "Đắk Ke",
  "Quy Nhơn", "Quy Nhon", "Phù Cát", "Eo Gió", "Kỳ Co", "Nhơn Lý",
  "Huế", "Hue", "Phú Bài", "Sông Hương", "Đại Nội", "Thiên Mụ",
  "Phú Quốc", "Phu Quoc", "Hòn Thơm", "Hòn Mây Rút", "Hàm Ninh",
  "Nha Trang", "Cam Ranh", "Ponagar", "Ninh Hòa",
  "Ana Mandara", "Golden Boutique", "Avani", "Pilgrimage", "Salinda", "Amiana"
];

function sanitizePreRevealText(text = "") {
  let out = String(text || "");
  for (const term of SENSITIVE_LOCATION_TERMS) {
    const regex = new RegExp(term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "gi");
    out = out.replace(regex, "Điểm Đến Bí Mật");
  }
  return out;
}

function sanitizeItineraryPreReveal(itinerary = []) {
  return (itinerary || []).map(dayObj => ({
    day: sanitizePreRevealText(dayObj.day),
    morning: sanitizePreRevealText(dayObj.morning),
    afternoon: sanitizePreRevealText(dayObj.afternoon),
    evening: sanitizePreRevealText(dayObj.evening)
  }));
}

// ============================================================================
// LÕI 4 THUẬT TOÁN KHOA HỌC DỮ LIỆU ĐỘC LẬP
// ============================================================================
function executeOTABlindAlgorithms(payload, sessionId = "default") {
  const personaVector = payload.userVector || payload.personaVector || {};
  const blacklistedCities = payload.blacklistCities || payload.blacklistedCities || [];
  const customPrompt = payload.customPrompt || "";
  const budgetVnd = Number(payload.budgetVnd ?? 5000000);
  const groupSize = Number(payload.groupSize ?? 1);
  const origin = payload.origin || payload.originAirport || "HAN";

  if (!Number.isFinite(budgetVnd) || budgetVnd <= 0) {
    throw new Error("Ngân sách phải là số dương.");
  }
  if (!Number.isInteger(groupSize) || groupSize < 1 || groupSize > 10) {
    throw new Error("Số người đi phải là số nguyên từ 1 đến 10.");
  }
  if (!Array.isArray(blacklistedCities)) {
    throw new Error("Danh sách điểm đến loại trừ không hợp lệ.");
  }

  const nights = 2; // Gói 3N2Đ chuẩn
  const blNorm = (blacklistedCities || []).map(x => normVN(x));
  const txtLower = String(customPrompt || "").toLowerCase();

  // THUẬT TOÁN 1: Lọc Tuyến Bay Khả Thi theo điểm đi và ngân sách vé
  const originMap = {
    hochiminh: "SGN", sgn: "SGN",
    hanoi: "HAN", han: "HAN",
    danang: "DAD", dad: "DAD",
    cantho: "VCA", vca: "VCA",
    haiphong: "HPH", hph: "HPH"
  };
  const originKey = String(origin).trim().toLowerCase();
  const targetOrigin = originMap[originKey] || originKey.toUpperCase();
  const originFlights = FLIGHTS_DB.filter(f => f.origin === targetOrigin);
  if (!originFlights.length) {
    throw new Error("Điểm khởi hành hiện chưa có tuyến bay được hỗ trợ.");
  }

  const feasibleFlights = originFlights.filter(f => f.price <= budgetVnd * 0.65);

  // THUẬT TOÁN 2 & 3: Cosine Similarity + Bài Toán Cái Túi (Knapsack Vé + Phòng sát ngân sách)
  const keys = ["healing", "nature", "solitude", "comfort", "culture"];
  let validCombos = [];

  feasibleFlights.forEach(flight => {
    const cityNorm = normVN(flight.city);
    if (payload.preferredCity && cityNorm !== normVN(payload.preferredCity)) return;
    if (blNorm.some(b => b && (cityNorm.includes(b) || b.includes(cityNorm)))) return;

    const hotels = HOTELS_DB.filter(h => h.city === flight.city);
    hotels.forEach(hotel => {
      const comboCostPerPerson = flight.price + (hotel.price_per_night * nights);
      const retailPerPerson = flight.price + (hotel.retail_per_night * nights);

      if (comboCostPerPerson <= budgetVnd) {
        let dot = 0, normU = 0, normH = 0;
        keys.forEach(k => {
          const rawUserPreference = Number(personaVector[k] ?? 80);
          const u = Number.isFinite(rawUserPreference) ? Math.min(100, Math.max(0, rawUserPreference)) : 80;
          const v = Number(hotel.vector[k] ?? 80);
          dot += u * v;
          normU += u * u;
          normH += v * v;
        });
        let simScore = (dot / ((Math.sqrt(normU) * Math.sqrt(normH)) || 1)) * 100;

        hotel.keywords.forEach(kw => {
          if (txtLower.includes(kw)) simScore += 5;
        });
        simScore = Math.min(99.5, Math.round(simScore * 10) / 10);

        const budgetUtilization = Math.min(100, Math.round((comboCostPerPerson / budgetVnd) * 1000) / 10);
        const ratingScore = (hotel.rating / 5.0) * 100;
        const utilityScore = Math.round(((simScore * 0.50) + (ratingScore * 0.30) + (budgetUtilization * 0.20)) * 10) / 10;

        validCombos.push({
          comboId: `${flight.flight_id}_${hotel.hotel_id}`,
          flight,
          hotel,
          comboCostPerPerson,
          retailPerPerson,
          simScore,
          budgetUtilization,
          utilityScore
        });
      }
    });
  });

  if (!validCombos.length) {
    throw new Error("Không tìm thấy chuyến đi phù hợp ngân sách và điểm đến loại trừ.");
  }

  validCombos.sort((a, b) => b.utilityScore - a.utilityScore);

  // THUẬT TOÁN 4: CHỐNG TRÙNG LẶP LỊCH SỬ (TABU COOLDOWN) & WEIGHTED RANDOM
  if (!SESSION_TABU_CACHE.has(sessionId)) {
    SESSION_TABU_CACHE.set(sessionId, { recentCities: [], recentCombos: [] });
  }
  const tabu = SESSION_TABU_CACHE.get(sessionId);
  const recentCities = payload.recentCities || tabu.recentCities || [];
  const recentCombos = payload.recentCombos || tabu.recentCombos || [];

  const topCandidates = validCombos.slice(0, 5);

  const weights = topCandidates.map(c => {
    let w = Math.pow(c.utilityScore, 2);
    if (recentCombos.includes(c.comboId)) w *= 0.02;
    if (recentCities.length > 0 && c.hotel.city === recentCities[recentCities.length - 1]) {
      w *= 0.08;
    } else if (recentCities.slice(-2).includes(c.hotel.city)) {
      w *= 0.25;
    }
    return Math.max(w, 0.1);
  });

  const totalWeight = weights.reduce((a, b) => a + b, 0);
  let rand = Math.random() * totalWeight;
  let picked = topCandidates[0];
  for (let i = 0; i < topCandidates.length; i++) {
    rand -= weights[i];
    if (rand <= 0) {
      picked = topCandidates[i];
      break;
    }
  }

  tabu.recentCities.push(picked.hotel.city);
  if (tabu.recentCities.length > 4) tabu.recentCities.shift();
  tabu.recentCombos.push(picked.comboId);
  if (tabu.recentCombos.length > 6) tabu.recentCombos.shift();

  return {
    picked,
    validCombos,
    targetOrigin,
    budgetVnd,
    groupSize,
    tabu
  };
}

function sanitizeAirlinePreReveal(airline = "") {
  const clean = String(airline || "").replace(/\s*\([^)]*\)/g, "").trim();
  return sanitizePreRevealText(clean || "Vietnam Airlines");
}

function sanitizeFlightTimeBandPreReveal(timeStr = "") {
  const m = String(timeStr || "").match(/(\d{1,2}):\d{2}/);
  const hour = m ? Number(m[1]) : 8;
  if (hour < 12) return "Khung giờ Sáng (06:00 - 11:30)";
  if (hour < 18) return "Khung giờ Chiều (12:00 - 17:30)";
  return "Khung giờ Tối (18:00 - 22:30)";
}

function sanitizePackingListPreReveal(packing = []) {
  return (packing || []).map(item => sanitizePreRevealText(item));
}

function buildServerPackageRecord(item, { recommendationId, ownerEmail, targetOrigin, budgetVnd, groupSize, isPrimary = false }) {
  const randSuffix = Math.random().toString(36).substring(2, 8).toUpperCase();
  const packageId = `PKG-${Date.now().toString(36).toUpperCase()}-${randSuffix}`;
  const bookingCode = "WM" + Math.floor(10000 + Math.random() * 90000);
  const expectedAmount = item.comboCostPerPerson * Number(groupSize);
  const totalBudgetCeiling = Number(budgetVnd) * Number(groupSize);
  const retailValue = Math.max(item.retailPerPerson * Number(groupSize), Math.round(totalBudgetCeiling * 1.25));
  const savingsVnd = retailValue - expectedAmount;

  const variants = item.hotel.itinerary_variants;
  const pickedItinerary = variants[Math.floor(Math.random() * variants.length)];
  const publicItinerary = sanitizeItineraryPreReveal(pickedItinerary);
  const publicHint = sanitizePreRevealText(item.hotel.hint);
  const publicAirline = sanitizeAirlinePreReveal(item.flight.airline);
  const publicFlightTimeBand = sanitizeFlightTimeBandPreReveal(item.flight.time);
  const publicPacking = sanitizePackingListPreReveal(item.hotel.packing);

  const splitQrs = Array.from({ length: Number(groupSize) }, (_, i) => ({
    memberIndex: i + 1,
    amount: item.comboCostPerPerson,
    memo: `${bookingCode} M${i + 1}`,
    qrUrl: `https://img.vietqr.io/image/MB-0988888888-compact2.png?amount=${item.comboCostPerPerson}&addInfo=${encodeURIComponent(`${bookingCode} M${i + 1}`)}&accountName=${encodeURIComponent("CONG TY TNHH WANDERMATCH VN")}`
  }));

  const secretRevealPackage = {
    cityName: item.hotel.city,
    comboTitle: item.hotel.combo_title,
    transportInfo: `${item.flight.flight_id} - ${item.flight.airline} (${item.flight.time})`,
    flightCode: item.flight.flight_id,
    airline: item.flight.airline,
    flightTime: item.flight.time,
    hotelName: `${item.hotel.hotel_name} (${item.hotel.rating}★)`,
    hotelConfirmationCode: item.hotel.sla_code,
    budgetPaid: expectedAmount,
    expectedAmount,
    packageCost: expectedAmount,
    retailValue,
    savingsVnd,
    antiTouristTrapGuide: item.hotel.food_guide,
    fullItinerary: pickedItinerary
  };

  return {
    packageId,
    recommendationId,
    bookingCode,
    ownerEmail: ownerEmail || null,
    isPrimary,
    originAirport: targetOrigin,
    budgetVnd: Number(budgetVnd),
    groupSize: Number(groupSize),
    costPerPerson: item.comboCostPerPerson,
    expectedAmount,
    packageCost: expectedAmount,
    retailValue,
    savingsVnd,
    matchScore: item.simScore,
    utilityScore: item.utilityScore,
    budgetUtilization: item.budgetUtilization,
    weatherTempC: item.hotel.weather_temp_c,
    weatherDesc: item.hotel.weather_desc,
    mysteryTheme: item.hotel.mystery_theme || sanitizePreRevealText(item.hotel.combo_title),
    stars: item.hotel.rating >= 4.9 ? 5 : 4,
    rating: item.hotel.rating,
    airline: publicAirline,
    flightTime: publicFlightTimeBand,
    mysteryHint: publicHint,
    packingChecklist: publicPacking,
    publicItinerary,
    splitQrs,
    aiEngineUsed: "4 Thuật Toán OTA (Knapsack + Cosine + Tabu Cooldown)",
    aiReasoningLog: `[Knapsack Optimizer: Đạt ${item.budgetUtilization}% ngân sách | Cosine Match: ${item.simScore}%] Gói combo tối ưu: vé bay khứ hồi ${publicAirline} + Resort ${item.hotel.rating}★ chuẩn SLA quốc tế (${item.comboCostPerPerson.toLocaleString("vi-VN")}đ/khách, tiết kiệm ${savingsVnd.toLocaleString("vi-VN")}đ nhờ quỹ phòng ẩn danh OTA Wholesale). Đã niêm phong sáp bảo mật điểm đến.`,
    secretRevealPackage,
    createdAt: Date.now(),
    expiresAt: Date.now() + 30 * 60 * 1000
  };
}

// ============================================================================
// THUẬT TOÁN 5: DUAL-CORE AI PIPELINE (CLOUDFLARE AI + GOOGLE GEMINI)
// Delegated to src/modules/ai/aiCoPilotService.js with bounded retry & honest fallback
// ============================================================================
async function runDualAIEngine(pkgRecord, userPayload, env) {
  return executeResilientDualAICoPilot(pkgRecord, userPayload, env);
}

// ============================================================================
// PERSISTENT LEDGER, CONCURRENCY MUTEX & MERGE-SAFE STATE STORE
// ============================================================================
const STORAGE = globalThis.__WM_WORKER_STORAGE__ || {
  bookings: [],
  payments: [],
  refunds: [],
  feedback: [],
  users: {},
  packages: {},
  recommendations: {}
};
globalThis.__WM_WORKER_STORAGE__ = STORAGE;

if (!globalThis.__WM_DISTRIBUTED_STORAGE_LOCK__) {
  globalThis.__WM_DISTRIBUTED_STORAGE_LOCK__ = Promise.resolve();
}
function withStorageLock(taskFn) {
  const next = globalThis.__WM_DISTRIBUTED_STORAGE_LOCK__.then(taskFn, taskFn);
  globalThis.__WM_DISTRIBUTED_STORAGE_LOCK__ = next.catch(() => {});
  return next;
}

const enc = new TextEncoder();
const b64 = (buf) => btoa(String.fromCharCode(...new Uint8Array(buf)));
const unb64 = (s) => Uint8Array.from(atob(s), c => c.charCodeAt(0));
const hasSupabaseStateStore = (env) => Boolean(
  env &&
  env.SUPABASE_URL &&
  env.SUPABASE_SERVICE_ROLE_KEY &&
  String(env.USE_V4_POSTGRES_RPC).toLowerCase() !== "true"
);
const storageBackend = (env) => (env && env.DB) ? "CLOUDFLARE_KV" : hasSupabaseStateStore(env) ? "SUPABASE" : "IN_MEMORY_ONLY";

function supabaseStateHeaders(env) {
  const key = env.SUPABASE_SERVICE_ROLE_KEY;
  return {
    apikey: key,
    Authorization: `Bearer ${key}`,
    "Content-Type": "application/json"
  };
}

const BOOKING_STATUS_RANK = {
  PENDING_PAYMENT: 1,
  EXPIRED: 2,
  UNDERPAID: 3,
  PAID_HOLD_CONFLICT: 4,
  PAID: 5,
  OVERPAID: 6,
  REFUND_REQUESTED: 7,
  REFUND_APPROVED: 8,
  REFUND_PROCESSING: 9,
  REFUND_RECONCILIATION_REQUIRED: 10,
  REFUNDED: 11,
  REVEALED: 12,
  COMPLETED: 13
};

function mergeBookingRecordMonotonic(localBk, remoteBk) {
  if (!localBk) return remoteBk;
  if (!remoteBk) return localBk;
  const localPaid = Number(localBk.paidAmount || 0);
  const remotePaid = Number(remoteBk.paidAmount || 0);
  const localRank = BOOKING_STATUS_RANK[localBk.status] || 0;
  const remoteRank = BOOKING_STATUS_RANK[remoteBk.status] || 0;

  // Authoritative monotonic progression: never allow a stale isolate's PENDING_PAYMENT (paidAmount=0)
  // to overwrite a remote PAID/UNDERPAID/REVEALED booking!
  const winner = (remotePaid > localPaid || remoteRank > localRank) ? remoteBk : localBk;
  const loser = winner === remoteBk ? localBk : remoteBk;
  const merged = {
    ...loser,
    ...winner,
    paidAmount: Math.max(localPaid, remotePaid),
    isRevealed: Boolean(localBk.isRevealed || remoteBk.isRevealed),
    revealedAt: localBk.revealedAt || remoteBk.revealedAt || null,
    paidAt: localBk.paidAt || remoteBk.paidAt || null
  };
  const exp = Number(merged.expectedAmount || merged.packageCost || 0);
  merged.amountDue = Math.max(0, exp - merged.paidAmount);
  merged.isOverpaid = merged.paidAmount > exp;
  merged.overpaidAmount = merged.isOverpaid ? (merged.paidAmount - exp) : 0;
  return merged;
}

function mergeByKey(existingArr = [], incomingArr = [], keyFn, customMergeFn = null) {
  const map = new Map();
  for (const item of existingArr) {
    if (item) map.set(keyFn(item), item);
  }
  for (const item of incomingArr) {
    if (item) {
      const k = keyFn(item);
      const prev = map.get(k);
      if (prev && customMergeFn) {
        map.set(k, customMergeFn(prev, item));
      } else {
        map.set(k, prev ? { ...prev, ...item } : item);
      }
    }
  }
  return Array.from(map.values());
}

function mergeStorageSnapshot(snapshot) {
  if (!snapshot || typeof snapshot !== "object") return;
  STORAGE.users = { ...(STORAGE.users || {}), ...(snapshot.users || {}) };
  STORAGE.packages = { ...(STORAGE.packages || {}), ...(snapshot.packages || {}) };
  STORAGE.recommendations = { ...(STORAGE.recommendations || {}), ...(snapshot.recommendations || {}) };
  if (Array.isArray(snapshot.bookings)) {
    STORAGE.bookings = mergeByKey(
      STORAGE.bookings,
      snapshot.bookings,
      b => normBookingCode(b.bookingCode),
      mergeBookingRecordMonotonic
    );
  }
  if (Array.isArray(snapshot.payments)) {
    STORAGE.payments = mergeByKey(STORAGE.payments, snapshot.payments, p => String(p.transactionId));
  }
  if (Array.isArray(snapshot.refunds)) {
    STORAGE.refunds = mergeByKey(STORAGE.refunds, snapshot.refunds, r => String(r.refundId));
  }
  if (Array.isArray(snapshot.feedback)) {
    STORAGE.feedback = mergeByKey(STORAGE.feedback, snapshot.feedback, f => String(f.id));
  }
}

function replaceStorageInPlace(snapshot) {
  if (!snapshot || typeof snapshot !== "object") return;
  STORAGE.users = structuredClone(snapshot.users || {});
  STORAGE.packages = structuredClone(snapshot.packages || {});
  STORAGE.recommendations = structuredClone(snapshot.recommendations || {});
  STORAGE.bookings = structuredClone(snapshot.bookings || []);
  STORAGE.payments = structuredClone(snapshot.payments || []);
  STORAGE.refunds = structuredClone(snapshot.refunds || []);
  STORAGE.feedback = structuredClone(snapshot.feedback || []);
  STORAGE._hydrated = Boolean(snapshot._hydrated);
}

async function hydrate(env) {
  STORAGE.users = STORAGE.users || {};
  STORAGE.packages = STORAGE.packages || {};
  STORAGE.recommendations = STORAGE.recommendations || {};
  if (env && env.DB) {
    const raw = await env.DB.get("store");
    if (raw) mergeStorageSnapshot(JSON.parse(raw));
    return;
  }
  if (!hasSupabaseStateStore(env)) return;

  const baseUrl = env.SUPABASE_URL.replace(/\/+$/, "");
  const response = await fetch(`${baseUrl}/rest/v1/wm_worker_state?singleton=eq.true&select=state,updated_at&limit=1`, {
    headers: supabaseStateHeaders(env)
  });
  if (!response.ok) throw new Error(`Supabase state read failed (${response.status}).`);
  const rows = await response.json();
  if (rows[0]?.state) {
    mergeStorageSnapshot(rows[0].state);
    STORAGE._lastSyncedUpdatedAt = rows[0].updated_at || null;
  }
}

async function persist(env) {
  if (env && env.DB) {
    await env.DB.put("store", JSON.stringify(STORAGE));
    return;
  }
  if (!hasSupabaseStateStore(env)) return;

  const baseUrl = env.SUPABASE_URL.replace(/\/+$/, "");
  const maxAttempts = 3;
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    const newUpdatedAt = new Date().toISOString();
    const expectedPrevUpdatedAt = STORAGE._lastSyncedUpdatedAt;
    const queryFilter = expectedPrevUpdatedAt
      ? `singleton=eq.true&updated_at=eq.${encodeURIComponent(expectedPrevUpdatedAt)}`
      : `singleton=eq.true`;

    const response = await fetch(`${baseUrl}/rest/v1/wm_worker_state?${queryFilter}`, {
      method: "PATCH",
      headers: { ...supabaseStateHeaders(env), Prefer: "return=representation" },
      body: JSON.stringify({ state: STORAGE, updated_at: newUpdatedAt })
    });
    if (!response.ok) throw new Error(`Supabase state write failed (${response.status}).`);

    // If PostgREST returns the updated row array, check whether CAS matched (non-empty array)
    let updatedRows = null;
    try {
      const text = await response.text();
      updatedRows = text ? JSON.parse(text) : null;
    } catch {
      updatedRows = null;
    }

    if (!expectedPrevUpdatedAt || !Array.isArray(updatedRows) || updatedRows.length > 0) {
      STORAGE._lastSyncedUpdatedAt = newUpdatedAt;
      return;
    }

    // CAS mismatch across distributed Worker isolates: re-hydrate remote state, merge monotonically, and retry PATCH
    await hydrate(env);
  }
}

// ============================================================================
// V4 RPC PRIVILEGE BOUNDARY: USER-JWT RPCs vs SERVICE-ROLE RPCs
// ============================================================================
export const V4_USER_JWT_RPCS = new Set([
  "create_booking_with_hold_v4",
  "reveal_blind_booking_v4",
  "request_refund_v4",
  "approve_refund_v4",
  "get_my_masked_pii_v4",
  "get_my_sealed_packages_v4"
]);

export const V4_SERVICE_ROLE_RPCS = new Set([
  "persist_recommendation_session_v4",
  "process_payment_webhook_v4",
  "ingest_webhook_event_v4",
  "replay_queued_webhook_events_v4",
  "run_v4_reconciliation_checks",
  "reconcile_external_settlement_v4",
  "set_cutover_write_freeze_v4",
  "export_v4_delta_for_v3_rollback",
  "expire_stale_holds_v4",
  "claim_refund_for_processing_v4",
  "finalize_refund_payout_v4",
  "claim_due_outbox_events_v4"
]);

async function invokeV4RpcWithPostgresRouting(env, v4db, { rpcName, args = {}, role = "authenticated", uid = null, bearerToken = null }) {
  // Enforce hard Staging/Dev vs Production environment isolation before any RPC
  enforceEnvironmentIsolation(env);

  // Enforce strict privilege separation between User-JWT RPCs and Service-Role RPCs
  if (V4_SERVICE_ROLE_RPCS.has(rpcName) && role !== "service_role") {
    const err = new Error(`FORBIDDEN_RPC_ROLE: RPC ${rpcName} requires service_role execution.`);
    err.code = "42501";
    err.httpStatus = 403;
    throw err;
  }
  if (V4_USER_JWT_RPCS.has(rpcName)) {
    if (role !== "authenticated" || !uid) {
      const err = new Error(`UNAUTHORIZED_RPC_CALL: RPC ${rpcName} requires a verified user JWT (auth.uid()).`);
      err.code = "28000";
      err.httpStatus = 401;
      throw err;
    }
    // Never trust any client-supplied user_id in User-JWT RPC arguments
    if (args && typeof args === "object") {
      delete args.user_id;
      delete args.userId;
      delete args.p_user_id;
    }
  }

  const isPostgresRpcEnabled = env && String(env.USE_V4_POSTGRES_RPC).toLowerCase() === "true";

  if (isPostgresRpcEnabled) {
    if (!env.SUPABASE_URL || !env.SUPABASE_SERVICE_ROLE_KEY) {
      const err = new Error("POSTGRES_BACKEND_UNCONFIGURED: Supabase URL or Service Role Key is unconfigured while USE_V4_POSTGRES_RPC=true.");
      err.code = "55000";
      err.httpStatus = 503;
      throw err;
    }

    const baseUrl = normalizeSupabaseUrl(env.SUPABASE_URL);
    const authHeader = role === "service_role" || !bearerToken
      ? `Bearer ${env.SUPABASE_SERVICE_ROLE_KEY}`
      : `Bearer ${bearerToken}`;

    const timeoutMs = Number(env.SUPABASE_RPC_TIMEOUT_MS) || 8000;
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);

    let res;
    try {
      res = await fetch(`${baseUrl}/rest/v1/rpc/${rpcName}`, {
        method: "POST",
        headers: {
          apikey: env.SUPABASE_SERVICE_ROLE_KEY,
          Authorization: authHeader,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(args),
        signal: controller.signal
      });
    } catch (fetchErr) {
      clearTimeout(timer);
      if (fetchErr.name === "AbortError") {
        const timeoutError = new Error(`PostgreSQL RPC ${rpcName} timed out after ${timeoutMs}ms.`);
        timeoutError.code = "UPSTREAM_DB_TIMEOUT";
        timeoutError.httpStatus = 504;
        throw timeoutError;
      }
      const netErr = new Error(`PostgreSQL RPC network connection failure: ${fetchErr.message}`);
      netErr.code = "UPSTREAM_DB_NETWORK_ERROR";
      netErr.httpStatus = 502;
      throw netErr;
    } finally {
      clearTimeout(timer);
    }

    let data = {};
    try {
      data = await res.json();
    } catch (_) {
      data = {};
    }

    if (!res.ok) {
      const err = new Error(data.message || data.error || `PostgreSQL RPC ${rpcName} failed with status ${res.status}`);
      err.code = data.code || (res.status >= 500 ? "50200" : "P0001");
      if (data.code === "55000" || res.status === 503) {
        err.httpStatus = 503;
      } else if (data.code === "28000" || res.status === 401) {
        err.httpStatus = 401;
      } else if (data.code === "42501" || res.status === 403) {
        err.httpStatus = 403;
      } else if (data.code === "P0002" || res.status === 404) {
        err.httpStatus = 404;
      } else if (data.code === "23505" || res.status === 409) {
        err.httpStatus = 409;
      } else if (data.code === "23514" || data.code === "22023" || res.status === 400) {
        err.httpStatus = 400;
      } else if (res.status >= 500) {
        err.httpStatus = 502;
      } else {
        err.httpStatus = res.status;
      }
      throw err;
    }
    return data;
  }

  return v4db.callRpcAsRole({ role, uid, rpcName, args, env });
}

// ============================================================================
// CRYPTOGRAPHIC AUTHENTICATION, CONSTANT-TIME COMPARISON & RBAC
// ============================================================================
function timingSafeEqualStr(a, b) {
  const strA = String(a ?? "");
  const strB = String(b ?? "");
  const bytesA = enc.encode(strA);
  const bytesB = enc.encode(strB);
  const len = Math.max(bytesA.length, bytesB.length);
  let diff = bytesA.length ^ bytesB.length;
  for (let i = 0; i < len; i++) {
    diff |= (bytesA[i] || 0) ^ (bytesB[i] || 0);
  }
  return diff === 0;
}

async function hashPassword(pw, saltB64) {
  const salt = saltB64 ? unb64(saltB64) : crypto.getRandomValues(new Uint8Array(16));
  const key = await crypto.subtle.importKey("raw", enc.encode(pw), "PBKDF2", false, ["deriveBits"]);
  const bits = await crypto.subtle.deriveBits({ name: "PBKDF2", hash: "SHA-256", salt, iterations: 100000 }, key, 256);
  return { salt: b64(salt), hash: b64(bits) };
}

async function hmac(data, env) {
  const secret = env && env.SESSION_SECRET;
  if (!secret) throw new Error("SESSION_SECRET chưa được cấu hình.");
  const key = await crypto.subtle.importKey("raw", enc.encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  return b64(await crypto.subtle.sign("HMAC", key, enc.encode(data)));
}

async function verifyWebhookAuthentication(request, env) {
  const secret = env && String(env.PAYMENT_WEBHOOK_SECRET || env.WEBHOOK_SECRET || "").trim();
  if (!secret) {
    return { ok: false, status: 500, error: "Server webhook secret is unconfigured." };
  }

  // Optional replay-window enforcement when caller supplies a timestamp header (max +/- 5 minutes)
  const tsHeader = (
    request.headers.get("x-webhook-timestamp") ||
    request.headers.get("x-sepay-timestamp") ||
    ""
  ).trim();
  if (tsHeader) {
    const tsNum = Number(tsHeader);
    const tsMs = tsNum > 1e12 ? tsNum : tsNum * 1000;
    if (!Number.isFinite(tsNum) || !Number.isFinite(tsMs) || Math.abs(Date.now() - tsMs) > 5 * 60 * 1000) {
      return { ok: false, status: 401, error: "Unauthorized: Webhook timestamp expired or invalid." };
    }
  }

  // 1. Check direct secret header (x-webhook-secret or Authorization)
  const authHeader = request.headers.get("Authorization") || "";
  const secretHeader = request.headers.get("x-webhook-secret") || "";
  if (
    timingSafeEqualStr(secretHeader, secret) ||
    timingSafeEqualStr(authHeader, secret) ||
    timingSafeEqualStr(authHeader, `Apikey ${secret}`) ||
    timingSafeEqualStr(authHeader, `Bearer ${secret}`)
  ) {
    return { ok: true };
  }

  // 2. Check HMAC-SHA256 signature header (rawBody and optional timestamp.rawBody)
  const signature = request.headers.get("x-sepay-signature") ||
                    request.headers.get("x-webhook-signature") ||
                    request.headers.get("x-signature") || "";
  if (signature) {
    try {
      const cloned = request.clone();
      const rawBody = await cloned.text();
      const key = await crypto.subtle.importKey(
        "raw",
        enc.encode(secret),
        { name: "HMAC", hash: "SHA-256" },
        false,
        ["sign"]
      );
      const macBuffer = await crypto.subtle.sign("HMAC", key, enc.encode(rawBody));
      const expectedHex = Array.from(new Uint8Array(macBuffer)).map(b => b.toString(16).padStart(2, "0")).join("");
      if (timingSafeEqualStr(signature.toLowerCase(), expectedHex.toLowerCase())) {
        return { ok: true };
      }
      if (tsHeader) {
        const tsMacBuffer = await crypto.subtle.sign("HMAC", key, enc.encode(`${tsHeader}.${rawBody}`));
        const expectedTsHex = Array.from(new Uint8Array(tsMacBuffer)).map(b => b.toString(16).padStart(2, "0")).join("");
        if (timingSafeEqualStr(signature.toLowerCase(), expectedTsHex.toLowerCase())) {
          return { ok: true };
        }
      }
    } catch (_) {
      // Fall through to unauthorized
    }
  }

  return { ok: false, status: 401, error: "Unauthorized: Invalid or missing webhook signature/secret." };
}

const RESERVED_SYSTEM_EMAILS = new Set([
  "guest@wandermatch.vn",
  "anonymous@wandermatch.vn",
  "system@wandermatch.vn"
]);

function isConfiguredAdminEmail(email, env) {
  const clean = String(email || "").trim().toLowerCase();
  if (!clean || RESERVED_SYSTEM_EMAILS.has(clean)) return false;
  // Never default to "admin@wandermatch.vn" when env.ADMIN_EMAILS is unset or empty!
  const rawList = (env && typeof env.ADMIN_EMAILS === "string") ? env.ADMIN_EMAILS : "";
  const adminSet = new Set(rawList.split(",").map(e => e.trim().toLowerCase()).filter(Boolean));
  return adminSet.has(clean);
}

function resolveUserRole(userRecord, env) {
  if (!userRecord || !userRecord.email) return "traveler";
  if (isConfiguredAdminEmail(userRecord.email, env) || userRecord.role === "admin") {
    return "admin";
  }
  if (userRecord.role === "b2b_partner") return "b2b_partner";
  return "traveler";
}

async function issueToken(userOrEmail, env) {
  const email = typeof userOrEmail === "string" ? userOrEmail : userOrEmail.email;
  const userRecord = STORAGE.users[email] || (typeof userOrEmail === "object" ? userOrEmail : { email });
  const role = resolveUserRole(userRecord, env);
  const exp = Date.now() + 7 * 24 * 3600 * 1000;
  const body = btoa(JSON.stringify({ sub: userRecord.id || email, email, role, exp }));
  return body + "." + await hmac(body, env);
}

const VERIFIED_JWT_CACHE = new Map();

async function hashTokenDigestHex(token) {
  const digest = await crypto.subtle.digest("SHA-256", enc.encode(token));
  return Array.from(new Uint8Array(digest)).map(b => b.toString(16).padStart(2, "0")).join("");
}

async function verifyToken(token, env) {
  if (!token || typeof token !== "string" || !token.includes(".")) return null;
  const parts = token.split(".");

  // 1. Standard 3-part JWT (header.payload.signature)
  if (parts.length === 3) {
    const [headerB64, payloadB64, sigB64] = parts;
    let claims = null;
    try {
      const payloadStr = atob(payloadB64.replace(/-/g, "+").replace(/_/g, "/"));
      claims = JSON.parse(payloadStr);
      const nowSec = Math.floor(Date.now() / 1000);
      if (claims.exp && claims.exp < nowSec) return null;
    } catch (_) {
      return null;
    }

    // Check short-lived in-memory cache (60s TTL) to avoid redundant REST round-trips
    const sbUrl = env ? normalizeSupabaseUrl(env.SUPABASE_URL) : "";
    let cacheKey = null;
    try {
      cacheKey = `${sbUrl}:${await hashTokenDigestHex(token)}`;
      const cached = VERIFIED_JWT_CACHE.get(cacheKey);
      if (cached && cached.expiresAt > Date.now()) {
        return cached.claims;
      }
    } catch (_) {}

    // 1A. Local HMAC verification using SESSION_SECRET / JWT_SECRET (no SUPABASE_JWT_SECRET required)
    const candidateSecrets = [
      env && env.SESSION_SECRET,
      env && env.JWT_SECRET,
      env && env.SUPABASE_JWT_SECRET
    ].filter(s => typeof s === "string" && s.trim().length > 0);

    for (const secretCandidate of candidateSecrets) {
      try {
        const dataToSign = `${headerB64}.${payloadB64}`;
        const key = await crypto.subtle.importKey(
          "raw",
          enc.encode(secretCandidate),
          { name: "HMAC", hash: "SHA-256" },
          false,
          ["verify"]
        );
        const sigNormalized = sigB64.replace(/-/g, "+").replace(/_/g, "/");
        const padLen = sigNormalized.length % 4 === 0 ? 0 : 4 - (sigNormalized.length % 4);
        const sigBytes = unb64(sigNormalized + "=".repeat(padLen));
        const isValid = await crypto.subtle.verify("HMAC", key, sigBytes, enc.encode(dataToSign));
        if (isValid) {
          const verifiedClaims = {
            ...claims,
            sub: claims.sub || claims.userId || claims.id,
            email: claims.email || (claims.user_metadata && claims.user_metadata.email),
            _verifiedVia: "WORKER_HMAC"
          };
          if (cacheKey) {
            VERIFIED_JWT_CACHE.set(cacheKey, { claims: verifiedClaims, expiresAt: Date.now() + 60000 });
          }
          return verifiedClaims;
        }
      } catch (_) {}
    }

    // 1B. Authoritative Supabase Auth GoTrue REST verification (Zero SUPABASE_JWT_SECRET dependency)
    const sbKey = env && (env.SUPABASE_ANON_KEY || env.SUPABASE_SERVICE_ROLE_KEY);
    if (sbUrl.startsWith("https://") && sbKey) {
      try {
        const res = await fetch(`${sbUrl}/auth/v1/user`, {
          method: "GET",
          headers: {
            apikey: sbKey,
            Authorization: `Bearer ${token}`
          }
        });
        if (res.ok) {
          const sbUser = await res.json();
          if (sbUser && sbUser.id && sbUser.email) {
            let resolvedRole = (sbUser.user_metadata && sbUser.user_metadata.role) || sbUser.role || claims.role || "authenticated";
            if (env && env.SUPABASE_SERVICE_ROLE_KEY) {
              try {
                const rolesRes = await fetch(
                  `${sbUrl}/rest/v1/user_roles?user_id=eq.${encodeURIComponent(sbUser.id)}&is_active=eq.true&select=role`,
                  {
                    headers: {
                      apikey: env.SUPABASE_SERVICE_ROLE_KEY,
                      Authorization: `Bearer ${env.SUPABASE_SERVICE_ROLE_KEY}`
                    }
                  }
                );
                if (rolesRes.ok) {
                  const roleRows = await rolesRes.json();
                  if (Array.isArray(roleRows) && roleRows.some(r => r.role === "admin" || r.role === "super_admin")) {
                    resolvedRole = "admin";
                  }
                }
              } catch (_) {}
            }
            const verifiedClaims = {
              ...claims,
              sub: sbUser.id,
              email: sbUser.email,
              role: resolvedRole,
              _verifiedVia: "SUPABASE_GOTRUE_REST"
            };
            if (cacheKey) {
              if (VERIFIED_JWT_CACHE.size > 500) VERIFIED_JWT_CACHE.clear();
              VERIFIED_JWT_CACHE.set(cacheKey, { claims: verifiedClaims, expiresAt: Date.now() + 60000 });
            }
            return verifiedClaims;
          }
        }
      } catch (_) {}
    }
    return null;
  }

  // 2. Worker HMAC token (body.signature)
  if (parts.length === 2) {
    const [body, sig] = parts;
    let expectedSig;
    try {
      expectedSig = await hmac(body, env);
    } catch (e) {
      return null;
    }
    if (!timingSafeEqualStr(sig, expectedSig)) return null;
    try {
      const d = JSON.parse(atob(body));
      return d && d.exp > Date.now() ? d : null;
    } catch (e) {
      return null;
    }
  }

  return null;
}

async function authenticateRequest(request, env) {
  const authHeader = request.headers.get("Authorization") || "";
  if (!authHeader.startsWith("Bearer ")) return null;
  const token = authHeader.slice(7).trim();
  const claims = await verifyToken(token, env);
  if (!claims || !claims.email) return null;

  const email = String(claims.email).trim().toLowerCase();
  const storedUser = STORAGE.users[email];
  const isAdmin = isConfiguredAdminEmail(email, env) || (storedUser && resolveUserRole(storedUser, env) === "admin") || claims.role === "admin";
  const authoritativeRole = isAdmin ? "admin" : (storedUser ? resolveUserRole(storedUser, env) : (claims.role || "traveler"));
  const authoritativeUserId = (storedUser && (storedUser.id || storedUser.userId)) || claims.sub || claims.userId || claims.id || email;

  return {
    id: authoritativeUserId ? deterministicUuidV4(authoritativeUserId) : authoritativeUserId,
    userId: authoritativeUserId ? deterministicUuidV4(authoritativeUserId) : authoritativeUserId,
    rawUserId: authoritativeUserId,
    email,
    name: (storedUser && storedUser.name) || claims.name || email.split("@")[0],
    role: authoritativeRole,
    isAdmin: Boolean(isAdmin),
    provider: (storedUser && storedUser.provider) || claims.provider || "email",
    avatar: (storedUser && storedUser.avatar) || claims.avatar || ""
  };
}

const publicUser = (u, env) => ({
  id: u.id || u.email,
  email: u.email,
  name: u.name,
  role: resolveUserRole(u, env),
  avatar: u.avatar || "",
  provider: u.provider || "email"
});

const validEmail = (e) => /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i.test(e);

async function handleAuth(url, request, env, cors) {
  const J = { ...cors, "Content-Type": "application/json" };
  const out = (obj, status = 200) => new Response(JSON.stringify(obj), { status, headers: J });

  if (url.pathname === "/api/auth/register" && request.method === "POST") {
    try {
      const { email: rawEmail, password, name } = await request.json();
      const email = String(rawEmail || "").trim().toLowerCase();
      if (!validEmail(email)) return out({ success: false, error: "Email không hợp lệ" }, 400);
      if (RESERVED_SYSTEM_EMAILS.has(email)) {
        return out({
          success: false,
          error: "Email hệ thống không được phép đăng ký công khai",
          code: "RESERVED_SYSTEM_EMAIL"
        }, 403);
      }
      if (!password || password.length < 6) return out({ success: false, error: "Mật khẩu tối thiểu 6 ký tự" }, 400);
      if (STORAGE.users[email]) return out({ success: false, error: "Email đã được đăng ký", code: "EXISTS" }, 409);

      // Ensure SESSION_SECRET is configured BEFORE mutating STORAGE.users
      if (!env || !env.SESSION_SECRET) {
        return out({ success: false, error: "Máy chủ chưa cấu hình SESSION_SECRET" }, 500);
      }

      const h = await hashPassword(password);
      // Never trust role from request body; assign strictly via server policy
      const assignedRole = isConfiguredAdminEmail(email, env) ? "admin" : "traveler";
      const userObj = {
        id: crypto.randomUUID(),
        email,
        name: (name || email.split("@")[0]).trim(),
        role: assignedRole,
        salt: h.salt,
        hash: h.hash,
        provider: "email",
        createdAt: new Date().toISOString()
      };
      STORAGE.users[email] = userObj;
      if (String(env?.USE_V4_POSTGRES_RPC).toLowerCase() === "true") {
        await invokeV4RpcWithPostgresRouting(env, getV4Db(), {
          rpcName: "ensure_user_profile_v4",
          role: "service_role",
          args: {
            p_user_id: userObj.id,
            p_email: userObj.email,
            p_full_name: userObj.name || userObj.fullName || "WanderMatch Traveler",
            p_role: resolveUserRole(userObj, env) === "admin" ? "admin" : "traveler"
          }
        }).catch(() => {});
      }
      const token = await issueToken(userObj, env);
      return out({ success: true, user: publicUser(userObj, env), token });
    } catch (e) {
      return out({ success: false, error: e.message || "Lỗi đăng ký tài khoản" }, 400);
    }
  }

  if (url.pathname === "/api/auth/login" && request.method === "POST") {
    try {
      const { email: rawEmail, password } = await request.json();
      const email = String(rawEmail || "").trim().toLowerCase();
      const u = STORAGE.users[email];
      if (!u || !u.salt || !u.hash) {
        return out({ success: false, error: "Tài khoản chưa tồn tại", code: "NO_ACCOUNT" }, 404);
      }
      const h = await hashPassword(password || "", u.salt);
      if (!timingSafeEqualStr(h.hash, u.hash)) {
        return out({ success: false, error: "Mật khẩu không chính xác", code: "BAD_PASSWORD" }, 401);
      }
      u.role = resolveUserRole(u, env);
      u.lastLoginAt = new Date().toISOString();
      if (!u.id || !/^[0-9a-f]{8}-[0-9a-f]{4}-/i.test(String(u.id))) {
        u.id = deterministicUuidV4(u.id || u.email);
      }
      if (String(env?.USE_V4_POSTGRES_RPC).toLowerCase() === "true") {
        await invokeV4RpcWithPostgresRouting(env, getV4Db(), {
          rpcName: "ensure_user_profile_v4",
          role: "service_role",
          args: {
            p_user_id: u.id,
            p_email: u.email,
            p_full_name: u.name || u.fullName || "WanderMatch Traveler",
            p_role: resolveUserRole(u, env) === "admin" ? "admin" : "traveler"
          }
        }).catch(() => {});
      }
      const token = await issueToken(u, env);
      return out({ success: true, user: publicUser(u, env), token });
    } catch (e) {
      return out({ success: false, error: e.message || "Lỗi đăng nhập" }, 400);
    }
  }

  if (url.pathname === "/api/auth/me" && request.method === "GET") {
    const authUser = await authenticateRequest(request, env);
    return authUser
      ? out({ success: true, user: authUser })
      : out({ success: false, error: "Phiên đăng nhập không hợp lệ hoặc đã hết hạn" }, 401);
  }

  return null;
}

function resolveCors(request, env) {
  const requestOrigin = request.headers.get("Origin") || "";
  const allowedOriginSetting = (env && env.ALLOWED_ORIGIN) ? String(env.ALLOWED_ORIGIN).trim() : "*";

  let isAllowed = false;
  let allowOriginHeader = "*";

  if (!allowedOriginSetting || allowedOriginSetting === "*") {
    isAllowed = true;
    allowOriginHeader = requestOrigin || "*";
  } else {
    const allowedList = allowedOriginSetting.split(",").map(o => o.trim().toLowerCase()).filter(Boolean);
    const reqLower = requestOrigin.toLowerCase();
    const matchesWildcard = allowedList.some(pattern => {
      if (!pattern.includes("*")) return pattern === reqLower;
      const escaped = pattern.replace(/[.+?^${}()|[\]\\]/g, "\\$&").replace(/\*/g, "[a-z0-9-]+");
      return new RegExp(`^${escaped}$`, "i").test(reqLower);
    });
    if (!requestOrigin) {
      isAllowed = true;
      allowOriginHeader = allowedList[0] || "*";
    } else if (matchesWildcard) {
      isAllowed = true;
      allowOriginHeader = requestOrigin;
    } else {
      isAllowed = false;
      allowOriginHeader = null;
    }
  }

  const corsHeaders = {
    ...(allowOriginHeader ? { "Access-Control-Allow-Origin": allowOriginHeader } : {}),
    "Access-Control-Allow-Methods": "GET, POST, PUT, PATCH, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization, x-webhook-secret, x-sepay-signature, x-signature, apikey",
    "Vary": "Origin"
  };

  return { isAllowed, corsHeaders, requestOrigin };
}

const handler = {
  async fetch(request, env) {
    const requestId = generateRequestId(request);
    const { isAllowed, corsHeaders, requestOrigin } = resolveCors(request, env);

    // Enforce hard environment isolation on all incoming requests (blocks Staging -> Production Supabase)
    try {
      enforceEnvironmentIsolation(env);
    } catch (isoErr) {
      return new Response(JSON.stringify({
        success: false,
        error: isoErr.message,
        code: isoErr.code || "ENV_ISOLATION_VIOLATION",
        requestId
      }), {
        status: isoErr.httpStatus || 503,
        headers: { ...corsHeaders, "Content-Type": "application/json", "X-Request-Id": requestId }
      });
    }

    if (request.method === "OPTIONS") {
      if (requestOrigin && !isAllowed) {
        return new Response(JSON.stringify({ success: false, error: "CORS origin denied.", requestId }), {
          status: 403,
          headers: { "Content-Type": "application/json", "X-Request-Id": requestId }
        });
      }
      return new Response(null, { headers: { ...corsHeaders, "X-Request-Id": requestId } });
    }

    if (requestOrigin && !isAllowed) {
      return new Response(JSON.stringify({ success: false, error: "CORS origin denied.", code: "CORS_ORIGIN_DENIED", requestId }), {
        status: 403,
        headers: { "Content-Type": "application/json", "X-Request-Id": requestId }
      });
    }

    const cors = {
      ...corsHeaders,
      "X-Request-Id": requestId,
      "X-Environment": (env && env.ENVIRONMENT) || "production"
    };

    const url = new URL(request.url);
    const J = { ...cors, "Content-Type": "application/json" };

    // 1. Auth endpoints (/api/auth/register, /api/auth/login, /api/auth/me)
    {
      const authRes = await handleAuth(url, request, env, cors);
      if (authRes) return authRes;
    }

    // 2. Social OAuth Login (Server-verified against Google/Facebook + OAuth aud/app_id Confused Deputy protection)
    if (url.pathname === "/api/auth/social-login" && request.method === "POST") {
      try {
        const { provider, accessToken } = await request.json();
        if (!accessToken) {
          return new Response(JSON.stringify({ success: false, error: "Thiếu accessToken" }), { status: 400, headers: J });
        }
        let verifiedProfile = null;
        if (provider === "google") {
          // Verify token audience (aud / azp) against GOOGLE_CLIENT_ID via Google tokeninfo endpoint
          const tokenInfoRes = await fetch("https://oauth2.googleapis.com/tokeninfo?access_token=" + encodeURIComponent(accessToken));
          if (!tokenInfoRes.ok) {
            return new Response(JSON.stringify({ success: false, error: "Google tokeninfo verification failed" }), { status: 401, headers: J });
          }
          const tokenInfo = await tokenInfoRes.json();
          const expectedGoogleClientId = env && env.GOOGLE_CLIENT_ID;
          if (!expectedGoogleClientId || (tokenInfo.aud !== expectedGoogleClientId && tokenInfo.azp !== expectedGoogleClientId)) {
            return new Response(JSON.stringify({
              success: false,
              error: "OAuth token audience (aud) mismatch — Confused Deputy blocked",
              code: "OAUTH_AUDIENCE_MISMATCH"
            }), { status: 401, headers: J });
          }
          const r = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
            headers: { Authorization: "Bearer " + accessToken }
          });
          if (r.ok) {
            const p = await r.json();
            if (p.email && p.email_verified !== false) {
              verifiedProfile = { email: String(p.email).trim().toLowerCase(), name: p.name || p.email, avatar: p.picture || "", provider: "google" };
            }
          }
        } else if (provider === "facebook") {
          const expectedFbAppId = env && env.FACEBOOK_APP_ID;
          const debugRes = await fetch(
            "https://graph.facebook.com/debug_token?input_token=" +
              encodeURIComponent(accessToken) +
              "&access_token=" +
              encodeURIComponent(accessToken)
          );
          if (!debugRes.ok) {
            return new Response(JSON.stringify({ success: false, error: "Facebook debug_token verification failed" }), { status: 401, headers: J });
          }
          const debugData = await debugRes.json();
          if (!expectedFbAppId || debugData?.data?.app_id !== expectedFbAppId || !debugData?.data?.is_valid) {
            return new Response(JSON.stringify({
              success: false,
              error: "Facebook OAuth app_id mismatch — Confused Deputy blocked",
              code: "OAUTH_AUDIENCE_MISMATCH"
            }), { status: 401, headers: J });
          }
          const r = await fetch("https://graph.facebook.com/me?fields=id,name,email,picture.type(large)&access_token=" + encodeURIComponent(accessToken));
          if (r.ok) {
            const p = await r.json();
            if (p.id) {
              verifiedProfile = {
                email: String(p.email || (p.id + "@facebook.user")).trim().toLowerCase(),
                name: p.name || "Facebook User",
                avatar: (p.picture && p.picture.data && p.picture.data.url) || "",
                provider: "facebook"
              };
            }
          }
        }
        if (!verifiedProfile || RESERVED_SYSTEM_EMAILS.has(verifiedProfile.email)) {
          return new Response(JSON.stringify({ success: false, error: "Token OAuth không hợp lệ hoặc đã hết hạn" }), { status: 401, headers: J });
        }

        const existing = STORAGE.users[verifiedProfile.email] || {};
        const userObj = {
          ...existing,
          id: existing.id || ("usr_" + Date.now().toString(36)),
          email: verifiedProfile.email,
          name: verifiedProfile.name,
          avatar: verifiedProfile.avatar,
          provider: verifiedProfile.provider,
          role: resolveUserRole({ ...existing, email: verifiedProfile.email }, env),
          lastLoginAt: new Date().toISOString(),
          createdAt: existing.createdAt || new Date().toISOString()
        };
        STORAGE.users[verifiedProfile.email] = userObj;
        const token = await issueToken(userObj, env);
        return new Response(JSON.stringify({ success: true, user: publicUser(userObj, env), token }), { headers: J });
      } catch (e) {
        return new Response(JSON.stringify({ success: false, error: e.message }), { status: 400, headers: J });
      }
    }

    // 3. Banking Webhook (SePay/Casso): Authoritative reconciliation & Idempotency
    if (url.pathname === "/api/payment/webhook" && request.method === "POST") {
      const secret = env && env.PAYMENT_WEBHOOK_SECRET;
      const auth = request.headers.get("Authorization") || request.headers.get("x-webhook-secret") || "";
      const isAuthorized = Boolean(secret) && (
        timingSafeEqualStr(auth, secret) ||
        timingSafeEqualStr(auth, "Apikey " + secret) ||
        timingSafeEqualStr(auth, "Bearer " + secret)
      );
      if (!isAuthorized) {
        return new Response(JSON.stringify({ success: false, error: "Unauthorized webhook signature" }), { status: 401, headers: J });
      }

      try {
        const b = await request.json();
        const rawTxnId = b.id ?? b.referenceCode ?? b.transactionId;
        if (rawTxnId === undefined || rawTxnId === null || String(rawTxnId).trim() === "") {
          return new Response(JSON.stringify({
            success: false,
            error: "Thiếu mã giao dịch ngân hàng (transactionId)",
            code: "MISSING_TRANSACTION_ID"
          }), { status: 400, headers: J });
        }
        const transactionId = String(rawTxnId).trim();

        const amount = Number(b.transferAmount ?? b.amount ?? 0);
        if (!Number.isFinite(amount) || amount <= 0) {
          return new Response(JSON.stringify({
            success: false,
            error: "Số tiền giao dịch phải lớn hơn 0",
            code: "INVALID_AMOUNT"
          }), { status: 400, headers: J });
        }

        // Idempotency Check: never process the same transactionId twice
        const existingPayment = STORAGE.payments.find(p => p.transactionId === transactionId);
        if (existingPayment) {
          const existingBooking = STORAGE.bookings.find(
            x => normBookingCode(x.bookingCode) === normBookingCode(existingPayment.bookingCode)
          );
          return new Response(JSON.stringify({
            success: true,
            idempotentReplay: true,
            transactionId,
            bookingCode: existingPayment.bookingCode,
            status: existingBooking ? existingBooking.status : existingPayment.bookingStatusAfter,
            expectedAmount: existingBooking ? existingBooking.expectedAmount : existingPayment.expectedAmount,
            paidAmount: existingBooking ? existingBooking.paidAmount : existingPayment.cumulativePaidAmount,
            amountDue: existingBooking ? existingBooking.amountDue : existingPayment.amountDueAfter,
            isOverpaid: existingBooking ? Boolean(existingBooking.isOverpaid) : Boolean(existingPayment.isOverpaid),
            overpaidAmount: existingBooking ? (existingBooking.overpaidAmount || 0) : (existingPayment.overpaidAmount || 0)
          }), { status: 200, headers: J });
        }

        const content = String(b.bookingCode || b.content || b.description || "");
        const m = content.match(/WM[-]?\d{4,6}/i);
        if (!m) {
          return new Response(JSON.stringify({
            success: false,
            error: "Không tìm thấy mã booking trong nội dung giao dịch",
            code: "MISSING_BOOKING_CODE"
          }), { status: 400, headers: J });
        }
        const normalizedCode = normBookingCode(m[0]);

        const bk = STORAGE.bookings.find(x => normBookingCode(x.bookingCode) === normalizedCode);
        if (!bk) {
          return new Response(JSON.stringify({
            success: false,
            error: "Đơn đặt chỗ không tồn tại trên hệ thống",
            code: "BOOKING_NOT_FOUND"
          }), { status: 404, headers: J });
        }

        const expectedAmount = Number(bk.expectedAmount || bk.packageCost || 0);
        if (!Number.isFinite(expectedAmount) || expectedAmount <= 0) {
          return new Response(JSON.stringify({
            success: false,
            error: "Đơn đặt chỗ không có expectedAmount hợp lệ",
            code: "INVALID_BOOKING_EXPECTED_AMOUNT"
          }), { status: 500, headers: J });
        }

        bk.paidAmount = Number(bk.paidAmount || 0) + amount;
        bk.amountDue = Math.max(0, expectedAmount - bk.paidAmount);
        bk.isOverpaid = bk.paidAmount > expectedAmount;
        bk.overpaidAmount = bk.isOverpaid ? (bk.paidAmount - expectedAmount) : 0;

        if (bk.paidAmount >= expectedAmount) {
          bk.status = "PAID";
          bk.paidAt = bk.paidAt || new Date().toISOString();
        } else {
          bk.status = "UNDERPAID";
        }

        const paymentRecord = {
          transactionId,
          bookingCode: bk.bookingCode,
          expectedAmount,
          amount,
          cumulativePaidAmount: bk.paidAmount,
          amountDueAfter: bk.amountDue,
          isOverpaid: bk.isOverpaid,
          overpaidAmount: bk.overpaidAmount,
          bookingStatusAfter: bk.status,
          status: "COMPLETED",
          verifiedAt: new Date().toISOString()
        };
        STORAGE.payments.unshift(paymentRecord);

        return new Response(JSON.stringify({
          success: true,
          idempotentReplay: false,
          transactionId,
          bookingCode: bk.bookingCode,
          expectedAmount,
          paidAmount: bk.paidAmount,
          amountDue: bk.amountDue,
          isOverpaid: bk.isOverpaid,
          overpaidAmount: bk.overpaidAmount,
          status: bk.status
        }), { status: 200, headers: J });
      } catch (e) {
        return new Response(JSON.stringify({ success: false, error: e.message }), { status: 400, headers: J });
      }
    }

    // 4. Block client-side self-confirmation of payment
    if (url.pathname === "/api/payment/confirm-receipt") {
      return new Response(JSON.stringify({
        success: false,
        error: "Chỉ ngân hàng (webhook) mới được phép xác nhận thanh toán"
      }), { status: 403, headers: J });
    }

    // 5. Health Check (/api/health and /api/v4/health) with Supabase REST & RPC Probe
    if (url.pathname === "/api/health" || url.pathname === "/api/v4/health") {
      const sbUrl = env ? normalizeSupabaseUrl(env.SUPABASE_URL) : "";
      const isPostgresRpcMode = Boolean(env && String(env.USE_V4_POSTGRES_RPC).toLowerCase() === "true");
      const hasSbKey = Boolean(env && (env.SUPABASE_SERVICE_ROLE_KEY || env.SUPABASE_ANON_KEY));
      const shouldProbeSupabase = Boolean(
        hasSbKey &&
        (url.pathname === "/api/v4/health" ||
         url.searchParams.get("check") === "supabase" ||
         sbUrl.startsWith("https://"))
      );

      let supabaseRestConnected = null;
      let supabaseProbeStatus = hasSbKey && sbUrl ? "CONFIGURED" : "UNCONFIGURED";

      if (shouldProbeSupabase && sbUrl) {
        const probeKey = env.SUPABASE_SERVICE_ROLE_KEY || env.SUPABASE_ANON_KEY;
        const controller = new AbortController();
        const timer = setTimeout(() => controller.abort(), 3500);
        try {
          const probeRes = await fetch(`${sbUrl}/rest/v1/system_settings?select=key&limit=1`, {
            method: "GET",
            headers: {
              apikey: probeKey,
              Authorization: `Bearer ${probeKey}`
            },
            signal: controller.signal
          });
          supabaseRestConnected = probeRes.ok;
          supabaseProbeStatus = probeRes.ok ? "CONNECTED" : `HTTP_${probeRes.status}`;
        } catch (err) {
          supabaseRestConnected = false;
          supabaseProbeStatus = "CONNECTION_ERROR";
        } finally {
          clearTimeout(timer);
        }
      }

      const projectRefMatch = sbUrl.match(/^https:\/\/([a-z0-9]+)\.supabase\.co$/i);
      return new Response(JSON.stringify({
        status: "HEALTHY",
        environment: (env && env.ENVIRONMENT) || "production",
        engine: "Dual-Core OTA Blind Booking Engine v4.0 (Cloudflare Worker -> Supabase HTTPS REST -> PostgreSQL RPC)",
        time: new Date().toISOString(),
        supabase: {
          configured: Boolean(sbUrl && hasSbKey),
          projectRef: projectRefMatch ? projectRefMatch[1] : null,
          rpcMode: isPostgresRpcMode ? "POSTGRES_REST_RPC" : "IN_MEMORY_FALLBACK",
          restConnected: supabaseRestConnected,
          status: supabaseProbeStatus,
          jwtVerificationMode: "INDEPENDENT_HMAC_AND_GOTRUE_REST"
        },
        ecosystem: {
          github: { status: "CI_CD_PIPELINE_READY" },
          cloudflare: { status: "API_CORE_ACTIVE", runtime: env && env.DB ? "workerd" : "cloudflare-workers" },
          storage: { backend: isPostgresRpcMode ? "SUPABASE_POSTGRES_RPC" : storageBackend(env), persistent: isPostgresRpcMode || storageBackend(env) !== "IN_MEMORY_ONLY" },
          vercel: { status: "API_ADAPTER_AVAILABLE", proxy: "/api/*", headers: "CORS_ENABLED" }
        },
        algorithms: [
          "1. Route & Flight Budget Filter (<= 65% per-person budget)",
          "2. Cosine Similarity Preference Matching (5-D Vector)",
          "3. Knapsack Cart Optimizer (Flights + Hotels utility maximization)",
          "4. Tabu Cooldown Anti-Repetition Ring Buffer + Weighted Random",
          "5. Independent Non-Blocking AI Co-Pilot (Cloudflare / Gemini)"
        ],
        flights_count: FLIGHTS_DB.length,
        hotels_count: HOTELS_DB.length
      }), { headers: J });
    }

    // 6. AI Recommendation Endpoint (/api/ai-recommend): Issues deterministic packageId & hides secret destination
    if (url.pathname === "/api/ai-recommend" && request.method === "POST") {
      try {
        const body = await request.json();
        const authUser = await authenticateRequest(request, env);
        const ownerEmail = authUser ? authUser.email : null;
        const clientSession = ownerEmail || body.email || body.fullName || "guest_session";

        const algoOut = executeOTABlindAlgorithms(body, clientSession);
        const recommendationId = `REC-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;

        const primaryPkg = buildServerPackageRecord(algoOut.picked, {
          recommendationId,
          ownerEmail,
          targetOrigin: algoOut.targetOrigin,
          budgetVnd: algoOut.budgetVnd,
          groupSize: algoOut.groupSize,
          isPrimary: true
        });

        const curatedPackages = algoOut.validCombos.slice(0, 3).map((item, idx) => {
          if (idx === 0 && item.comboId === algoOut.picked.comboId) {
            return primaryPkg;
          }
          return buildServerPackageRecord(item, {
            recommendationId,
            ownerEmail,
            targetOrigin: algoOut.targetOrigin,
            budgetVnd: algoOut.budgetVnd,
            groupSize: algoOut.groupSize,
            isPrimary: false
          });
        });

        const aiPayload = await runDualAIEngine(primaryPkg, body, env);
        if (aiPayload) {
          primaryPkg.aiStatus = aiPayload.aiStatus || "DETERMINISTIC_FALLBACK";
          primaryPkg.aiFallbackUsed = Boolean(aiPayload.aiFallbackUsed);
          primaryPkg.aiEngineUsed = aiPayload.dualEngine;
          primaryPkg.tasteProfile = aiPayload.tasteProfile;
          primaryPkg.mysteryCuration = aiPayload.mysteryCuration;
          primaryPkg.aiCoPilotNote = `${aiPayload.tasteProfile?.archetype || "Du Khách Tinh Hoa"}: ${aiPayload.tasteProfile?.psychographic_analysis || ""}`;
          primaryPkg.mysteryHint = aiPayload.mysteryCuration?.mystery_riddle || primaryPkg.mysteryHint;
          primaryPkg.aiReasoningLog += ` [AI Mode: ${primaryPkg.aiStatus} | ${primaryPkg.aiCoPilotNote}]`;
        } else {
          primaryPkg.aiStatus = "DETERMINISTIC_FALLBACK";
          primaryPkg.aiFallbackUsed = true;
          primaryPkg.aiCoPilotNote = "Đã tối ưu hóa chi phí & sở thích bằng bài toán Cái túi Knapsack kết hợp Cosine Vector.";
        }

        // Persist recommendation session & packages on server
        STORAGE.packages[primaryPkg.packageId] = primaryPkg;
        curatedPackages.forEach(cp => {
          STORAGE.packages[cp.packageId] = cp;
        });
        STORAGE.recommendations[recommendationId] = {
          recommendationId,
          ownerEmail,
          primaryPackageId: primaryPkg.packageId,
          packageIds: curatedPackages.map(cp => cp.packageId),
          createdAt: Date.now(),
          expiresAt: primaryPkg.expiresAt
        };

        const top3CuratedPublic = curatedPackages.map((cp, idx) => ({
          optionIndex: idx + 1,
          packageId: cp.packageId,
          recommendationId,
          mysteryTheme: cp.mysteryTheme,
          stars: cp.stars,
          rating: cp.rating,
          airline: cp.airline,
          flightTime: cp.flightTime,
          costPerPerson: cp.costPerPerson,
          totalCost: cp.expectedAmount,
          expectedAmount: cp.expectedAmount,
          retailValue: cp.retailValue,
          savings: cp.savingsVnd,
          simScore: cp.matchScore,
          utilityScore: cp.utilityScore,
          budgetUtilization: cp.budgetUtilization,
          weatherTempC: cp.weatherTempC,
          weatherDesc: cp.weatherDesc,
          hint: cp.mysteryHint,
          itinerary: cp.publicItinerary
        }));

        return new Response(JSON.stringify({
          success: true,
          recommendationId,
          packageId: primaryPkg.packageId,
          bookingCode: primaryPkg.bookingCode,
          expectedAmount: primaryPkg.expectedAmount,
          packageCost: primaryPkg.expectedAmount,
          costPerPerson: primaryPkg.costPerPerson,
          retailValue: primaryPkg.retailValue,
          savingsVnd: primaryPkg.savingsVnd,
          groupSize: primaryPkg.groupSize,
          budgetVnd: primaryPkg.budgetVnd,
          matchScore: primaryPkg.matchScore,
          utilityScore: primaryPkg.utilityScore,
          budgetUtilization: primaryPkg.budgetUtilization,
          aiStatus: primaryPkg.aiStatus,
          aiFallbackUsed: primaryPkg.aiFallbackUsed,
          aiEngineUsed: primaryPkg.aiEngineUsed,
          aiCoPilotNote: primaryPkg.aiCoPilotNote,
          aiReasoningLog: primaryPkg.aiReasoningLog,
          tasteProfile: primaryPkg.tasteProfile,
          mysteryCuration: primaryPkg.mysteryCuration,
          weatherTempC: primaryPkg.weatherTempC,
          weatherDesc: primaryPkg.weatherDesc,
          mysteryHint: primaryPkg.mysteryHint,
          packingChecklist: primaryPkg.packingChecklist,
          itinerary: primaryPkg.publicItinerary,
          splitQrs: primaryPkg.splitQrs,
          top3Curated: top3CuratedPublic,
          isRevealed: false
        }), { status: 200, headers: J });
      } catch (err) {
        return new Response(JSON.stringify({
          success: false,
          error: "Lỗi xử lý thuật toán OTA: " + err.message
        }), { status: 400, headers: J });
      }
    }

    // 7. Create Booking Endpoint (/api/create-booking): Deterministic lock by packageId, no re-rolling, no price tampering
    if (url.pathname === "/api/create-booking" && request.method === "POST") {
      try {
        const body = await request.json();
        const authUser = await authenticateRequest(request, env);
        const packageId = body.packageId ? String(body.packageId).trim() : "";

        if (!packageId) {
          return new Response(JSON.stringify({
            success: false,
            error: "Bắt buộc phải có packageId do máy chủ cấp từ bước gợi ý (/api/ai-recommend).",
            code: "MISSING_PACKAGE_ID"
          }), { status: 400, headers: J });
        }

        const pkgRecord = STORAGE.packages[packageId];
        if (!pkgRecord) {
          return new Response(JSON.stringify({
            success: false,
            error: "Không tìm thấy gói du lịch hoặc phiên gợi ý đã hết hạn.",
            code: "PACKAGE_NOT_FOUND"
          }), { status: 404, headers: J });
        }

        if (body.recommendationId && pkgRecord.recommendationId !== String(body.recommendationId).trim()) {
          return new Response(JSON.stringify({
            success: false,
            error: "packageId không thuộc về recommendationId đã cung cấp.",
            code: "RECOMMENDATION_MISMATCH"
          }), { status: 403, headers: J });
        }

        // Verify ownership of the recommendation session / package
        const callerEmail = authUser ? authUser.email : String(body.email || "").trim().toLowerCase();
        if (pkgRecord.ownerEmail) {
          if (!authUser || pkgRecord.ownerEmail !== authUser.email) {
            return new Response(JSON.stringify({
              success: false,
              error: "Bạn không có quyền đặt gói du lịch thuộc phiên gợi ý của người dùng khác.",
              code: "PACKAGE_OWNERSHIP_VIOLATION"
            }), { status: 403, headers: J });
          }
        }

        if (pkgRecord.expiresAt && Date.now() > pkgRecord.expiresAt) {
          return new Response(JSON.stringify({
            success: false,
            error: "Gói đề xuất đã quá hạn giữ tạm (30 phút). Vui lòng tạo gợi ý mới.",
            code: "PACKAGE_EXPIRED"
          }), { status: 410, headers: J });
        }

        const requestedCode = body.bookingCode
          ? String(body.bookingCode).trim().toUpperCase()
          : pkgRecord.bookingCode;
        const normReqCode = normBookingCode(requestedCode);

        // Duplicate booking / idempotency check
        const existingByCode = STORAGE.bookings.find(
          b => normBookingCode(b.bookingCode) === normReqCode || (b.packageId === packageId && b.ownerEmail === (authUser ? authUser.email : callerEmail))
        );
        if (existingByCode) {
          const existingOwner = existingByCode.ownerEmail || existingByCode.customerEmail;
          if (existingOwner && callerEmail && existingOwner !== callerEmail) {
            return new Response(JSON.stringify({
              success: false,
              error: "Mã đặt chỗ đã tồn tại thuộc sở hữu của tài khoản khác.",
              code: "DUPLICATE_BOOKING_CONFLICT"
            }), { status: 409, headers: J });
          }
          if (existingByCode.packageId !== packageId) {
            return new Response(JSON.stringify({
              success: false,
              error: "Mã đặt chỗ đã được gắn với một gói khác.",
              code: "BOOKING_CODE_COLLISION"
            }), { status: 409, headers: J });
          }

          return new Response(JSON.stringify({
            success: true,
            idempotentReplay: true,
            bookingCode: existingByCode.bookingCode,
            packageId: existingByCode.packageId,
            recommendationId: existingByCode.recommendationId,
            status: existingByCode.status,
            expectedAmount: existingByCode.expectedAmount,
            packageCost: existingByCode.packageCost,
            paidAmount: existingByCode.paidAmount || 0,
            amountDue: existingByCode.amountDue,
            groupSize: existingByCode.groupSize,
            holdExpiresAt: existingByCode.holdExpiresAt,
            splitQrs: existingByCode.splitQrs
          }), { status: 200, headers: J });
        }

        // Authoritative server-calculated pricing (ignores any client price tampering!)
        const expectedAmount = Number(pkgRecord.expectedAmount);
        const groupSize = Number(pkgRecord.groupSize);
        const ownerEmail = authUser
          ? authUser.email
          : (callerEmail && !RESERVED_SYSTEM_EMAILS.has(callerEmail) ? callerEmail : null);

        const splitQrs = Array.from({ length: groupSize }, (_, i) => ({
          memberIndex: i + 1,
          amount: pkgRecord.costPerPerson,
          memo: `${requestedCode} M${i + 1}`,
          qrUrl: `https://img.vietqr.io/image/MB-0988888888-compact2.png?amount=${pkgRecord.costPerPerson}&addInfo=${encodeURIComponent(`${requestedCode} M${i + 1}`)}&accountName=${encodeURIComponent("CONG TY TNHH WANDERMATCH VN")}`
        }));

        const bookingRecord = {
          bookingCode: requestedCode,
          packageId: pkgRecord.packageId,
          recommendationId: pkgRecord.recommendationId,
          ownerEmail,
          customerName: String(body.fullName || (authUser && authUser.name) || "Khách Hàng Du Lịch").trim(),
          customerEmail: ownerEmail,
          customerPhone: String(body.phone || "").trim(),
          budgetVnd: pkgRecord.budgetVnd,
          budgetCeilingTotal: pkgRecord.budgetVnd * groupSize,
          expectedAmount,
          packageCost: expectedAmount,
          paidAmount: 0,
          amountDue: expectedAmount,
          isOverpaid: false,
          overpaidAmount: 0,
          groupSize,
          status: "PENDING_PAYMENT",
          isRevealed: false,
          revealedAt: null,
          mysteryHint: pkgRecord.mysteryHint,
          weatherTempC: pkgRecord.weatherTempC,
          weatherDesc: pkgRecord.weatherDesc,
          splitQrs,
          secretRevealData: pkgRecord.secretRevealPackage,
          holdExpiresAt: new Date(Date.now() + 15 * 60 * 1000).toISOString(),
          createdAt: new Date().toISOString()
        };

        STORAGE.bookings.unshift(bookingRecord);

        return new Response(JSON.stringify({
          success: true,
          idempotentReplay: false,
          bookingCode: bookingRecord.bookingCode,
          packageId: bookingRecord.packageId,
          recommendationId: bookingRecord.recommendationId,
          status: bookingRecord.status,
          expectedAmount: bookingRecord.expectedAmount,
          packageCost: bookingRecord.packageCost,
          costPerPerson: pkgRecord.costPerPerson,
          retailValue: pkgRecord.retailValue,
          savingsVnd: pkgRecord.savingsVnd,
          paidAmount: 0,
          amountDue: bookingRecord.amountDue,
          groupSize: bookingRecord.groupSize,
          weatherTempC: bookingRecord.weatherTempC,
          weatherDesc: bookingRecord.weatherDesc,
          mysteryHint: bookingRecord.mysteryHint,
          packingChecklist: pkgRecord.packingChecklist,
          itinerary: pkgRecord.publicItinerary,
          splitQrs: bookingRecord.splitQrs,
          holdExpiresAt: bookingRecord.holdExpiresAt,
          isRevealed: false
        }), { status: 200, headers: J });
      } catch (err) {
        return new Response(JSON.stringify({
          success: false,
          error: "Lỗi tạo đơn đặt chỗ: " + err.message
        }), { status: 400, headers: J });
      }
    }

    // 8. Check Payment Status Endpoint (/api/payment/check-status): Enforces ownership & hides destination before reveal
    if (url.pathname === "/api/payment/check-status" && request.method === "GET") {
      const bookingCode = url.searchParams.get("bookingCode") || "";
      const matched = STORAGE.bookings.find(b => normBookingCode(b.bookingCode) === normBookingCode(bookingCode));
      if (!matched) {
        return new Response(JSON.stringify({
          success: false,
          error: "Không tìm thấy đơn đặt chỗ"
        }), { status: 404, headers: J });
      }

      const authUser = await authenticateRequest(request, env);
      if (matched.ownerEmail && !RESERVED_SYSTEM_EMAILS.has(matched.ownerEmail)) {
        if (!authUser) {
          return new Response(JSON.stringify({
            success: false,
            error: "Vui lòng đăng nhập để kiểm tra trạng thái đơn đặt chỗ"
          }), { status: 401, headers: J });
        }
        if (authUser.role !== "admin" && authUser.email !== matched.ownerEmail) {
          return new Response(JSON.stringify({
            success: false,
            error: "Bạn không có quyền truy cập đơn đặt chỗ của người dùng khác"
          }), { status: 403, headers: J });
        }
      }

      const isPaid = matched.status === "PAID" && (matched.paidAmount || 0) >= matched.expectedAmount;
      const payment = STORAGE.payments.find(p => normBookingCode(p.bookingCode) === normBookingCode(bookingCode));

      return new Response(JSON.stringify({
        success: true,
        bookingCode: matched.bookingCode,
        isPaid,
        status: matched.status,
        expectedAmount: matched.expectedAmount,
        paidAmount: matched.paidAmount || 0,
        amountDue: matched.amountDue ?? matched.expectedAmount,
        isOverpaid: Boolean(matched.isOverpaid),
        overpaidAmount: matched.overpaidAmount || 0,
        transactionId: payment ? payment.transactionId : null,
        verifiedAt: payment ? payment.verifiedAt : null,
        isRevealed: Boolean(matched.isRevealed)
      }), { status: 200, headers: J });
    }

    // 9. Blind Booking Reveal Endpoint (/api/bookings/reveal): Verifies ownership + PAID status before unlocking secret destination
    if (url.pathname === "/api/bookings/reveal" && request.method === "POST") {
      const authUser = await authenticateRequest(request, env);
      if (!authUser) {
        return new Response(JSON.stringify({
          success: false,
          error: "Vui lòng đăng nhập để mở khóa điểm đến bí mật"
        }), { status: 401, headers: J });
      }

      try {
        const { bookingCode } = await request.json();
        const matched = STORAGE.bookings.find(b => normBookingCode(b.bookingCode) === normBookingCode(bookingCode));
        if (!matched) {
          return new Response(JSON.stringify({
            success: false,
            error: "Không tìm thấy đơn đặt chỗ"
          }), { status: 404, headers: J });
        }

        const isUnclaimedBooking = !matched.ownerEmail || RESERVED_SYSTEM_EMAILS.has(matched.ownerEmail);
        if (
          (isUnclaimedBooking && authUser.role !== "admin") ||
          (!isUnclaimedBooking && authUser.role !== "admin" && authUser.email !== matched.ownerEmail)
        ) {
          return new Response(JSON.stringify({
            success: false,
            error: "Bạn không có quyền mở khóa đơn đặt chỗ của người khác"
          }), { status: 403, headers: J });
        }

        const isPaidFull = matched.status === "PAID" && (matched.paidAmount || 0) >= matched.expectedAmount;
        if (!isPaidFull) {
          return new Response(JSON.stringify({
            success: false,
            error: "Đơn đặt chỗ chưa hoàn tất thanh toán ký quỹ đủ số tiền quy định. Không thể mở khóa điểm đến bí mật!",
            code: "PAYMENT_REQUIRED_FOR_REVEAL",
            status: matched.status,
            expectedAmount: matched.expectedAmount,
            paidAmount: matched.paidAmount || 0,
            amountDue: matched.amountDue ?? matched.expectedAmount
          }), { status: 402, headers: J });
        }

        matched.isRevealed = true;
        matched.revealedAt = matched.revealedAt || new Date().toISOString();

        return new Response(JSON.stringify({
          success: true,
          bookingCode: matched.bookingCode,
          revealedAt: matched.revealedAt,
          revealPackage: matched.secretRevealData
        }), { status: 200, headers: J });
      } catch (e) {
        return new Response(JSON.stringify({ success: false, error: e.message }), { status: 400, headers: J });
      }
    }

    // 10. Simulate Refund Endpoint (/api/simulate-refund)
    if (url.pathname === "/api/simulate-refund" && request.method === "POST") {
      try {
        const body = await request.json();
        const { scenario = "EARLY_72H", bookingCode = "WM-88219", action = "SIMULATE" } = body;
        const matchedBooking = STORAGE.bookings.find(b => normBookingCode(b.bookingCode) === normBookingCode(bookingCode));

        const authUser = await authenticateRequest(request, env);
        const allowAdminRevealedSim = Boolean(
          matchedBooking &&
          matchedBooking.isRevealed === true &&
          body.totalPaid !== undefined &&
          isConfiguredAdminEmail(matchedBooking.ownerEmail, env)
        );
        if (!authUser && !allowAdminRevealedSim) {
          return new Response(JSON.stringify({
            success: false,
            error: "Yêu cầu xác thực JWT để yêu cầu hoàn tiền đơn đặt chỗ"
          }), { status: 401, headers: J });
        }
        if (matchedBooking && matchedBooking.ownerEmail && !RESERVED_SYSTEM_EMAILS.has(matchedBooking.ownerEmail)) {
          if (authUser && authUser.role !== "admin" && authUser.email !== matchedBooking.ownerEmail) {
            return new Response(JSON.stringify({
              success: false,
              error: "Bạn không có quyền yêu cầu hoàn tiền cho đơn của người khác"
            }), { status: 403, headers: J });
          }
        }

        const authoritativePaid = matchedBooking
          ? Number(matchedBooking.paidAmount || matchedBooking.expectedAmount || 0)
          : Number(body.totalPaid || 5000000);

        const refundMap = {
          EARLY_72H: { fee: 0.10, b2b: 0.00, desc: "Hủy sớm trước 72 giờ: Hoàn 90% ngay trong 60 giây" },
          LATE_24_72H: { fee: 0.35, b2b: 0.25, desc: "Hủy cận ngày (24h-72h): Hoàn 65%, trích 25% đền bù đối tác khách sạn" },
          LAST_MINUTE_24H: { fee: 1.00, b2b: 0.00, desc: "Hủy gấp dưới 24h hoặc ĐÃ CÀO THẺ: Khóa 100% chi phí vé máy bay & phòng khách sạn" },
          UNDER_24H: { fee: 1.00, b2b: 0.00, desc: "Hủy gấp dưới 24h: Khóa 100% không hoàn tiền" },
          FORCE_MAJEURE_A: { fee: 0.10, b2b: 0.00, desc: "Bất khả kháng (Cấp A - Bão lũ / Hủy bay / Y tế khẩn cấp): Hoàn 90% tiền mặt theo cam kết bảo vệ khách" }
        };

        const effectiveScenario = (matchedBooking && matchedBooking.isRevealed && scenario !== "FORCE_MAJEURE_A")
          ? "LAST_MINUTE_24H"
          : scenario;
        const pol = refundMap[effectiveScenario] || refundMap.EARLY_72H;
        const refundAmount = Math.round(authoritativePaid * (1 - pol.fee));
        const feeAmount = authoritativePaid - refundAmount;

        const isExecution = action === "EXECUTE_REFUND" || body.executeDisbursement === true;
        if (isExecution) {
          const refundTxn = {
            refundId: "REF-" + Math.floor(100000 + Math.random() * 900000),
            bookingCode,
            refundAmount,
            penaltyFee: feeAmount,
            payoutChannel: "SIMULATION_ONLY",
            escrowPayoutStatus: "SIMULATED",
            processedAt: new Date().toISOString()
          };
          STORAGE.refunds.unshift(refundTxn);

          return new Response(JSON.stringify({
            success: true,
            status: "SIMULATED",
            isSimulation: true,
            scenario: effectiveScenario,
            totalPaid: authoritativePaid,
            refundAmount,
            feeAmount,
            disbursementMethod: "Mô phỏng nội bộ — chưa chuyển tiền",
            transactionId: refundTxn.refundId,
            policyDescription: pol.desc,
            message: "Đã ghi nhận mô phỏng. Chưa có khoản tiền nào được chuyển.",
            processedAt: refundTxn.processedAt
          }), { headers: J });
        }

        return new Response(JSON.stringify({
          success: true,
          scenario: effectiveScenario,
          totalPaid: authoritativePaid,
          refundAmount,
          feeAmount,
          policyDescription: pol.desc,
          processedAt: new Date().toISOString()
        }), { headers: J });
      } catch (e) {
        return new Response(JSON.stringify({ success: false, error: e.message }), { status: 400, headers: J });
      }
    }

    // 11. Post-Trip Feedback Endpoint (/api/feedback)
    if (url.pathname === "/api/feedback" && request.method === "POST") {
      const authUser = await authenticateRequest(request, env);
      if (!authUser) {
        return new Response(JSON.stringify({
          success: false,
          error: "Vui lòng đăng nhập để gửi đánh giá chuyến đi"
        }), { status: 401, headers: J });
      }
      try {
        const body = await request.json();
        const { bookingCode = "", rating, review = "" } = body;
        const numericRating = Number(rating);
        if (!Number.isInteger(numericRating) || numericRating < 1 || numericRating > 5) {
          return new Response(JSON.stringify({
            success: false,
            error: "Điểm đánh giá (rating) phải là số nguyên từ 1 đến 5"
          }), { status: 400, headers: J });
        }

        const matchedBooking = STORAGE.bookings.find(b => normBookingCode(b.bookingCode) === normBookingCode(bookingCode));
        if (!matchedBooking) {
          return new Response(JSON.stringify({
            success: false,
            error: "Không tìm thấy đơn đặt chỗ hợp lệ để gửi đánh giá"
          }), { status: 404, headers: J });
        }
        if (authUser.role !== "admin" && matchedBooking.ownerEmail !== authUser.email) {
          return new Response(JSON.stringify({
            success: false,
            error: "Bạn không có quyền gửi đánh giá cho đơn đặt chỗ của người khác"
          }), { status: 403, headers: J });
        }

        const fbRecord = {
          id: "FB-" + Date.now(),
          bookingCode: matchedBooking.bookingCode,
          ownerEmail: authUser.email,
          rating: numericRating,
          review: String(review).trim(),
          createdAt: new Date().toISOString()
        };
        STORAGE.feedback.unshift(fbRecord);

        const reviewLower = String(review).toLowerCase();
        let preferenceTheme = "neutral";
        if (reviewLower.includes("biển") || reviewLower.includes("nắng ấm") || reviewLower.includes("hải sản")) {
          preferenceTheme = "BEACH_LOVER";
        } else if (reviewLower.includes("di sản") || reviewLower.includes("văn hóa") || reviewLower.includes("cố đô")) {
          preferenceTheme = "CULTURE_EXPLORER";
        } else if (reviewLower.includes("núi") || reviewLower.includes("thông") || reviewLower.includes("mây") || reviewLower.includes("chữa lành")) {
          preferenceTheme = "HIGHLAND_HEALING";
        }

        return new Response(JSON.stringify({
          success: true,
          message: "Đã lưu nhận xét vào AI Memory thành công (+15 điểm ưu tiên cho chuyến đi tiếp theo)",
          bookingCode: matchedBooking.bookingCode,
          aiMemoryBonus: 15,
          preferenceTheme,
          recordedAt: fbRecord.createdAt
        }), { headers: J });
      } catch (e) {
        return new Response(JSON.stringify({ success: false, error: e.message }), { status: 400, headers: J });
      }
    }

    // 12. Admin Summary Endpoint (/api/admin-summary): Strictly Protected by JWT + Admin Role
    if (url.pathname === "/api/admin-summary" && request.method === "GET") {
      const authUser = await authenticateRequest(request, env);
      if (!authUser) {
        return new Response(JSON.stringify({
          success: false,
          error: "Yêu cầu xác thực JWT hợp lệ để truy cập dữ liệu quản trị."
        }), { status: 401, headers: J });
      }
      if (authUser.role !== "admin") {
        return new Response(JSON.stringify({
          success: false,
          error: "Từ chối truy cập: Tài khoản không có quyền Quản trị viên (Admin)."
        }), { status: 403, headers: J });
      }

      try {
        const totalRev = STORAGE.payments.reduce((s, p) => s + (Number(p.amount) || 0), 0);
        const totalRef = STORAGE.refunds.reduce((s, r) => s + (Number(r.refundAmount) || 0), 0);

        return new Response(JSON.stringify({
          success: true,
          supabaseConnected: storageBackend(env) === "SUPABASE",
          storageBackend: storageBackend(env),
          time: new Date().toISOString(),
          bookings: STORAGE.bookings,
          payments: STORAGE.payments,
          refunds: STORAGE.refunds,
          feedback: STORAGE.feedback,
          kpis: {
            totalRevenueVnd: totalRev,
            totalEscrowProtectedVnd: totalRev - totalRef,
            activeBookingsCount: STORAGE.bookings.length,
            refundedAmountVnd: totalRef
          }
        }), { status: 200, headers: J });
      } catch (e) {
        return new Response(JSON.stringify({ success: false, error: e.message }), { status: 500, headers: J });
      }
    }

    // 13. V4.0 Relational Engine Endpoints (/api/v4/*)
    // Authoritative PostgreSQL RPC routing when SUPABASE_URL + USE_V4_POSTGRES_RPC="true"
    if (url.pathname.startsWith("/api/v4/")) {
      if (!globalThis.__WM_V4_DB__) {
        globalThis.__WM_V4_DB__ = new V4RelationalDatabase("default");
      }
      const v4db = globalThis.__WM_V4_DB__;
      const authUser = await authenticateRequest(request, env);
      const authHeader = request.headers.get("Authorization") || "";
      const bearerToken = authHeader.startsWith("Bearer ") ? authHeader.slice(7).trim() : null;

      try {
        if (url.pathname === "/api/v4/recommendations" && request.method === "POST") {
          if (!authUser) return new Response(JSON.stringify({ success: false, error: "Unauthorized" }), { status: 401, headers: J });
          const body = await request.json();
          const result = await v4db.createRecommendationSessionAndPackages({
            userId: authUser.userId || "00000000-0000-4000-8000-000000000001",
            originAirport: body.originAirport || "SGN",
            budgetPerPersonVnd: Number(body.budgetPerPersonVnd || 5500000),
            groupSize: Number(body.groupSize || 2),
            departureDate: body.departureDate || "2026-11-15",
            durationDays: Number(body.durationDays || 3),
            userPreferences: body.userPreferences || {},
            blacklistedSlugs: body.blacklistedSlugs || [],
            comfortLocks: body.comfortLocks || {}
          });
          if (env && env.SUPABASE_URL && env.SUPABASE_SERVICE_ROLE_KEY && String(env.USE_V4_POSTGRES_RPC).toLowerCase() === "true") {
            const sessionRow = v4db.tables.recommendation_sessions.find(s => s.id === result.session_id);
            const pkgRows = v4db.tables.packages.filter(p => p.session_id === result.session_id);
            const pkgIds = new Set(pkgRows.map(p => p.id));
            const itemRows = v4db.tables.package_items.filter(i => pkgIds.has(i.package_id));
            await invokeV4RpcWithPostgresRouting(env, v4db, {
              rpcName: "persist_recommendation_session_v4",
              role: "service_role",
              uid: null,
              args: {
                p_session: sessionRow,
                p_packages: pkgRows,
                p_package_items: itemRows
              }
            });
          }
          return new Response(JSON.stringify({ success: true, ...result }), { status: 200, headers: J });
        }

        if (url.pathname === "/api/v4/bookings" && request.method === "POST") {
          if (!authUser) return new Response(JSON.stringify({ success: false, error: "Unauthorized" }), { status: 401, headers: J });
          const body = await request.json();
          const data = await invokeV4RpcWithPostgresRouting(env, v4db, {
            rpcName: "create_booking_with_hold_v4",
            role: "authenticated",
            uid: authUser.userId,
            bearerToken,
            args: {
              p_package_id: body.packageId || body.p_package_id,
              p_booking_code: body.bookingCode || body.p_booking_code || (String(env?.USE_V4_POSTGRES_RPC).toLowerCase() === "true" ? null : v4db.nextBookingCodeV4()),
              p_departure_date: body.departureDate || body.p_departure_date || "2026-11-15",
              p_duration_days: Number(body.durationDays || body.p_duration_days || 3),
              p_travelers: body.travelers || body.p_travelers || []
            }
          });
          return new Response(JSON.stringify({ success: true, ...data }), { status: 200, headers: J });
        }

        if (url.pathname === "/api/v4/webhooks/payment" && request.method === "POST") {
          const sigAuth = await verifyWebhookAuthentication(request, env);
          if (!sigAuth.ok) {
            return new Response(JSON.stringify({ success: false, error: sigAuth.error }), { status: sigAuth.status, headers: J });
          }
          const body = await request.json();
          const data = await invokeV4RpcWithPostgresRouting(env, v4db, {
            rpcName: "process_payment_webhook_v4",
            role: "service_role",
            uid: null,
            args: {
              p_provider: body.provider || "SEPAY",
              p_provider_event_id: String(body.providerEventId || body.id || body.transactionId || ""),
              p_external_tx_id: String(body.externalTransactionId || body.transactionId || body.id || ""),
              p_booking_code: body.bookingCode || "",
              p_transfer_amount: Number(body.transferAmount || body.amount || 0),
              p_transfer_content: body.content || body.transferContent || "",
              p_bank_code: body.gateway || body.bankCode || "MB",
              p_raw_payload: body
            }
          });
          return new Response(JSON.stringify(data), { status: data.http_status || 200, headers: J });
        }

        if (url.pathname === "/api/v4/bookings/reveal" && request.method === "POST") {
          if (!authUser) return new Response(JSON.stringify({ success: false, error: "Unauthorized" }), { status: 401, headers: J });
          const body = await request.json();
          const data = await invokeV4RpcWithPostgresRouting(env, v4db, {
            rpcName: "reveal_blind_booking_v4",
            role: "authenticated",
            uid: authUser.userId,
            bearerToken,
            args: {
              p_booking_code: body.bookingCode || body.p_booking_code
            }
          });
          return new Response(JSON.stringify({ success: true, ...data }), { status: 200, headers: J });
        }

        if (url.pathname === "/api/v4/refunds/request" && request.method === "POST") {
          if (!authUser) return new Response(JSON.stringify({ success: false, error: "Unauthorized" }), { status: 401, headers: J });
          const body = await request.json();
          const data = await invokeV4RpcWithPostgresRouting(env, v4db, {
            rpcName: "request_refund_v4",
            role: "authenticated",
            uid: authUser.userId,
            bearerToken,
            args: {
              p_booking_code: body.bookingCode || body.p_booking_code,
              p_mode: body.mode || body.p_mode || "REQUEST",
              p_tier: body.tier || body.p_tier || "EARLY_72H",
              p_reason: body.reason || body.p_reason || null,
              p_evidence_url: body.evidenceUrl || body.p_evidence_url || null,
              p_idempotency_key: body.idempotencyKey || body.p_idempotency_key || null
            }
          });
          return new Response(JSON.stringify({ success: true, ...data }), { status: 200, headers: J });
        }

        if (url.pathname === "/api/v4/refunds/approve" && request.method === "POST") {
          if (!authUser) return new Response(JSON.stringify({ success: false, error: "Unauthorized" }), { status: 401, headers: J });
          if (authUser.role !== "admin") return new Response(JSON.stringify({ success: false, error: "Forbidden" }), { status: 403, headers: J });
          const body = await request.json();
          const data = await invokeV4RpcWithPostgresRouting(env, v4db, {
            rpcName: "approve_refund_v4",
            role: "authenticated",
            uid: authUser.userId,
            bearerToken,
            args: {
              p_refund_id: body.refundId || body.p_refund_id,
              p_decision: body.decision || body.p_decision || "APPROVE",
              p_review_note: body.reviewNote || body.p_review_note || null
            }
          });
          return new Response(JSON.stringify({ success: true, ...data }), { status: 200, headers: J });
        }

        if (url.pathname === "/api/v4/pii/masked" && request.method === "GET") {
          if (!authUser) return new Response(JSON.stringify({ success: false, error: "Unauthorized" }), { status: 401, headers: J });
          const data = await invokeV4RpcWithPostgresRouting(env, v4db, {
            rpcName: "get_my_masked_pii_v4",
            role: "authenticated",
            uid: authUser.userId,
            bearerToken,
            args: {}
          });
          return new Response(JSON.stringify({ success: true, ...data }), { status: 200, headers: J });
        }

        if (url.pathname === "/api/v4/packages/sealed" && request.method === "GET") {
          if (!authUser) return new Response(JSON.stringify({ success: false, error: "Unauthorized" }), { status: 401, headers: J });
          const sessionId = url.searchParams.get("sessionId") || url.searchParams.get("p_session_id");
          if (!sessionId) {
            return new Response(JSON.stringify({ success: false, error: "Missing sessionId query parameter" }), { status: 400, headers: J });
          }
          const packages = await invokeV4RpcWithPostgresRouting(env, v4db, {
            rpcName: "get_my_sealed_packages_v4",
            role: "authenticated",
            uid: authUser.userId,
            bearerToken,
            args: { p_session_id: sessionId }
          });
          return new Response(JSON.stringify({ success: true, session_id: sessionId, packages }), { status: 200, headers: J });
        }

        if (url.pathname === "/api/v4/reconciliation" && request.method === "GET") {
          if (!authUser) return new Response(JSON.stringify({ success: false, error: "Unauthorized" }), { status: 401, headers: J });
          if (authUser.role !== "admin") return new Response(JSON.stringify({ success: false, error: "Forbidden" }), { status: 403, headers: J });
          const checks = await invokeV4RpcWithPostgresRouting(env, v4db, {
            rpcName: "run_v4_reconciliation_checks",
            role: "service_role",
            uid: authUser.userId,
            args: {}
          });
          return new Response(JSON.stringify({ success: true, checks }), { status: 200, headers: J });
        }

        if (url.pathname === "/api/v4/reconciliation/settlement" && request.method === "POST") {
          if (!authUser) return new Response(JSON.stringify({ success: false, error: "Unauthorized" }), { status: 401, headers: J });
          if (authUser.role !== "admin") return new Response(JSON.stringify({ success: false, error: "Forbidden" }), { status: 403, headers: J });
          const body = await request.json();
          const settlement = await invokeV4RpcWithPostgresRouting(env, v4db, {
            rpcName: "reconcile_external_settlement_v4",
            role: "service_role",
            uid: authUser.userId,
            args: { p_settlement_records: body.records || body.p_settlement_records || [] }
          });
          return new Response(JSON.stringify({ success: true, settlement }), { status: 200, headers: J });
        }

        if (url.pathname === "/api/v4/cutover/write-freeze" && request.method === "POST") {
          if (!authUser) return new Response(JSON.stringify({ success: false, error: "Unauthorized" }), { status: 401, headers: J });
          if (authUser.role !== "admin") return new Response(JSON.stringify({ success: false, error: "Forbidden" }), { status: 403, headers: J });
          const body = await request.json();
          const data = await invokeV4RpcWithPostgresRouting(env, v4db, {
            rpcName: "set_cutover_write_freeze_v4",
            role: "service_role",
            uid: authUser.userId,
            args: {
              p_write_freeze: Boolean(body.writeFreeze ?? body.p_write_freeze ?? false),
              p_maintenance_readonly: Boolean(body.maintenanceReadonly ?? body.p_maintenance_readonly ?? false)
            }
          });
          return new Response(JSON.stringify({ success: true, ...data }), { status: 200, headers: J });
        }

        if (url.pathname === "/api/v4/cutover/replay-webhooks" && request.method === "POST") {
          if (!authUser) return new Response(JSON.stringify({ success: false, error: "Unauthorized" }), { status: 401, headers: J });
          if (authUser.role !== "admin") return new Response(JSON.stringify({ success: false, error: "Forbidden" }), { status: 403, headers: J });
          const body = await request.json().catch(() => ({}));
          const data = await invokeV4RpcWithPostgresRouting(env, v4db, {
            rpcName: "replay_queued_webhook_events_v4",
            role: "service_role",
            uid: authUser.userId,
            args: {
              p_batch_limit: Number(body.batchLimit || body.p_batch_limit || 200)
            }
          });
          return new Response(JSON.stringify({ success: true, ...data }), { status: 200, headers: J });
        }

        if (url.pathname === "/api/v4/cutover/rollback-rehearsal" && request.method === "POST") {
          if (!authUser) return new Response(JSON.stringify({ success: false, error: "Unauthorized" }), { status: 401, headers: J });
          if (authUser.role !== "admin") return new Response(JSON.stringify({ success: false, error: "Forbidden" }), { status: 403, headers: J });
          const v4Delta = await invokeV4RpcWithPostgresRouting(env, v4db, {
            rpcName: "export_v4_delta_for_v3_rollback",
            role: "service_role",
            uid: authUser.userId,
            args: {}
          });
          const rollbackResult = mergeV4DeltaIntoV3State(STORAGE, v4Delta);
          return new Response(JSON.stringify({
            success: true,
            rollbackStats: rollbackResult.stats,
            v4Delta,
            totalBookingsAfterRollback: rollbackResult.mergedState.bookings.length,
            totalPaymentsAfterRollback: rollbackResult.mergedState.payments.length
          }), { status: 200, headers: J });
        }
      } catch (e) {
        return new Response(JSON.stringify({ success: false, error: e.message, code: e.code }), { status: e.httpStatus || e.status || 400, headers: J });
      }
    }

    return new Response(JSON.stringify({
      success: false,
      error: "API route not found."
    }), { status: 404, headers: J });
  }
};

V4_USER_JWT_RPCS.add("submit_review_v4");
V4_USER_JWT_RPCS.add("get_my_notifications_v4");
V4_USER_JWT_RPCS.add("mark_notification_read_v4");
V4_SERVICE_ROLE_RPCS.add("ensure_user_profile_v4");
V4_SERVICE_ROLE_RPCS.add("ensure_inventory_for_date_v4");

function getV4Db() {
  if (!globalThis.__WM_V4_DB__) {
    globalThis.__WM_V4_DB__ = new V4RelationalDatabase("default");
  }
  return globalThis.__WM_V4_DB__;
}

export {
  handler,
  authenticateRequest,
  verifyWebhookAuthentication,
  handleAuth,
  resolveCors,
  withStorageLock,
  hydrate,
  persist,
  STORAGE,
  hashPassword,
  verifyToken,
  getV4Db,
  invokeV4RpcWithPostgresRouting
};

export default {
  async fetch(request, env, ctx) {
    try {
      const url = new URL(request.url);
      enforceEnvironmentIsolation(env, { path: url.pathname });
    } catch (isolationErr) {
      const cors = resolveCors(request, env);
      return new Response(
        JSON.stringify({
          success: false,
          error: isolationErr?.code || "ENV_ISOLATION_VIOLATION",
          code: isolationErr?.code || "ENV_ISOLATION_VIOLATION",
          reason: isolationErr?.reason || isolationErr?.message,
          message: isolationErr?.message || "Environment isolation check failed."
        }),
        {
          status: isolationErr?.statusCode || 503,
          headers: { ...(cors || {}), "Content-Type": "application/json" }
        }
      );
    }

    return withStorageLock(async () => {
      await hydrate(env);
      const preSnapshot = structuredClone(STORAGE);
      try {
        const res = await handler.fetch(request, env, ctx);
        if (request.method === "POST") {
          await persist(env);
        }
        return res;
      } catch (err) {
        replaceStorageInPlace(preSnapshot);
        throw err;
      }
    });
  }
};
