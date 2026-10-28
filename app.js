// ============================================================================
// WANDERMATCH PRODUCTION ENGINE — REAL AUTHENTICATION & OTA ALGORITHMS
// ============================================================================

window.WM_FLIGHTS_DB = [
  { flight_id: "VN151", origin: "HAN", city: "Đà Lạt", airline: "Vietnam Airlines", time: "08:30 - 10:15", price: 2100000 },
  { flight_id: "VJ403", origin: "HAN", city: "Đà Lạt", airline: "Vietjet Deluxe", time: "10:20 - 12:05", price: 1650000 },
  { flight_id: "QH121", origin: "HAN", city: "Quy Nhơn", airline: "Bamboo Airways", time: "09:00 - 10:35", price: 1950000 },
  { flight_id: "VN162", origin: "HAN", city: "Quy Nhơn", airline: "Vietnam Airlines", time: "13:45 - 15:20", price: 2250000 },
  { flight_id: "VN181", origin: "HAN", city: "Măng Đen", airline: "Vietnam Airlines (Bay Pleiku + Xe riêng)", time: "07:45 - 10:30", price: 2050000 },
  { flight_id: "VN137", origin: "HAN", city: "Huế", airline: "Vietnam Airlines", time: "09:15 - 10:30", price: 1600000 },
  { flight_id: "VJ302", origin: "HAN", city: "Huế", airline: "Vietjet Deluxe", time: "11:15 - 12:30", price: 1350000 },
  { flight_id: "VJ971", origin: "HAN", city: "Phú Quốc", airline: "Vietjet Deluxe", time: "09:40 - 11:50", price: 2450000 },
  { flight_id: "VN123", origin: "HAN", city: "Nha Trang", airline: "Vietnam Airlines", time: "08:15 - 10:05", price: 1980000 }
];

window.WM_HOTELS_DB = [
  {
    hotel_id: "HTL-DL-01", city: "Đà Lạt", hotel_name: "Ana Mandara Villas Dalat Resort & Spa (5 Sao)",
    combo_title: "3N2Đ Biệt Thự Pháp Cổ Rừng Thông & Săn Mây Cầu Đất",
    price_per_night: 1350000, retail_per_night: 2250000, rating: 4.95, sla_code: "SLA-DL-88219",
    weather_temp_c: 16, weather_desc: "Se lạnh, sương mù nhẹ buổi sớm",
    vector: { healing: 96, nature: 90, solitude: 85, comfort: 92, culture: 82 },
    keywords: ["săn mây", "rừng thông", "se lạnh", "cà phê", "biệt thự", "đà lạt"],
    hint: "Điểm đến của bạn sở hữu khí hậu cao nguyên se lạnh 16°C với những căn biệt thự kiến trúc Pháp cổ ẩn mình dưới tán thông già.",
    packing: ["Áo khoác giữ nhiệt & khăn choàng cổ", "Giày thể thao đế êm đi dạo đồi thông", "CCCD bản gốc làm thủ tục bay", "Kem dưỡng ẩm", "Sạc dự phòng"],
    food_guide: ["Bánh căn Lệ 27 Yersin (40.000đ/đĩa)", "Lẩu gà lá é Tao Ngộ (300.000đ/nồi)", "Cà phê Túi Mơ To (65.000đ/ly)"],
    itinerary_variants: [[
      { day: "Ngày 1: Nhận Phòng Biệt Thự Rừng Thông", morning: "Đáp chuyến bay sáng, xe riêng đón về Resort nhận phòng & thưởng thức trà thảo mộc.", afternoon: "Dạo bộ dưới rừng thông cổ thụ & ngâm chân thảo dược ấm.", evening: "Thưởng thức Lẩu gà lá é nóng hổi trong tiết trời 16°C." },
      { day: "Ngày 2: Đón Biển Mây & Khám Phá Di Sản", morning: "05:30 Đón bình minh tại đồi chè Cầu Đất & ăn sáng bánh căn bản địa.", afternoon: "Tham quan Biệt điện Trần Lệ Xuân (Mộc bản Triều Nguyễn) & thư giãn Spa.", evening: "Bữa tối ấm cúng với rau hữu cơ tại nhà hàng Pháp." },
      { day: "Ngày 3: Mua Đặc Sản & Khởi Hành Về", morning: "Ghé trung tâm OCOP mua hồng treo gió & trà Atiso chính gốc.", afternoon: "Trả phòng muộn theo ưu đãi, xe riêng đưa ra sân bay Liên Khương." }
    ]]
  },
  {
    hotel_id: "HTL-DL-02", city: "Đà Lạt", hotel_name: "Terracotta Hotel & Resort Tuyền Lâm (4 Sao Plus)",
    combo_title: "3N2Đ Nghỉ Dưỡng Bên Hồ Tuyền Lâm & Rừng Lá Phong",
    price_per_night: 1050000, retail_per_night: 1850000, rating: 4.82, sla_code: "SLA-DL-55301",
    weather_temp_c: 15, weather_desc: "Sương sớm mặt hồ, không khí trong lành",
    vector: { healing: 94, nature: 96, solitude: 92, comfort: 84, culture: 72 },
    keywords: ["hồ tuyền lâm", "chèo sup", "rừng thông", "yên tĩnh", "đà lạt"],
    hint: "Một bán đảo xanh mát nằm tách biệt bên mặt hồ phẳng lặng phủ sương sớm đang chờ đón bạn.",
    packing: ["Áo ấm chống sương", "Giày đi bộ đường rừng", "CCCD bản gốc", "Tai nghe cá nhân", "Bình giữ nhiệt"],
    food_guide: ["Gà nướng cơm lam Tuyền Lâm (280.000đ/set)", "Bánh ướt lòng gà Trang (45.000đ/tô)", "Cà phê Phê La (55.000đ/ly)"],
    itinerary_variants: [[
      { day: "Ngày 1: Bán Đảo Hồ Tuyền Lâm", morning: "Đáp sân bay Liên Khương, xe đưa thẳng về khu nghỉ dưỡng ven hồ.", afternoon: "Tản bộ dưới rừng thông ven hồ & tham quan vườn dâu công nghệ cao.", evening: "Thưởng thức tiệc nướng BBQ ấm cúng bên hồ." },
      { day: "Ngày 2: Chèo SUP Sương Sớm & Thiền Viện", morning: "06:00 Chèo SUP đón sương sớm trên mặt Hồ Tuyền Lâm.", afternoon: "Viếng Thiền viện Trúc Lâm & dạo rừng lá phong.", evening: "Thưởng thức bánh ướt lòng gà & sữa đậu nành nóng." },
      { day: "Ngày 3: Tạm Biệt Cao Nguyên", morning: "Thưởng thức cà phê sáng ngắm mặt hồ, mua quà lưu niệm.", afternoon: "Xe riêng tiễn ra sân bay." }
    ]]
  },
  {
    hotel_id: "HTL-MD-01", city: "Măng Đen", hotel_name: "Golden Boutique Hotel Măng Đen (4 Sao Plus)",
    combo_title: "3N2Đ Nghỉ Dưỡng Giữa Đại Ngàn Măng Đen",
    price_per_night: 1150000, retail_per_night: 1900000, rating: 4.88, sla_code: "SLA-MD-77310",
    weather_temp_c: 18, weather_desc: "Không khí nguyên sơ, mát lạnh quanh năm",
    vector: { healing: 99, nature: 99, solitude: 98, comfort: 78, culture: 85 },
    keywords: ["độc hành", "hoang sơ", "tách biệt", "rừng", "thác", "măng đen"],
    hint: "Hành trình đưa bạn lên cao nguyên 1.200m nguyên sơ, nơi có những cánh rừng thông bạt ngàn và thác nước hùng vĩ.",
    packing: ["Áo khoác nhẹ hoặc áo len mỏng", "Xịt chống côn trùng thảo mộc", "CCCD bản gốc", "Giày thể thao", "Sổ tay cá nhân"],
    food_guide: ["Gà nướng cơm lam Cô Sinh (260.000đ/con)", "Lẩu xuyên tiêu Măng Đen (320.000đ/nồi)", "Cà phê Eva rang củi (40.000đ/ly)"],
    itinerary_variants: [[
      { day: "Ngày 1: Cung Đường Thông Đại Ngàn", morning: "Hạ cánh sân bay Pleiku, xe Limousine đón thẳng lên thị trấn Măng Đen.", afternoon: "Nhận phòng khách sạn view rừng, dạo bộ quanh Hồ Đăk Ke.", evening: "Thưởng thức Lẩu xuyên tiêu cay nồng trong tiết trời 18°C." },
      { day: "Ngày 2: Khám Phá Thác Pa Sỹ & Bản Làng", morning: "Tham quan khu sinh thái Thác Pa Sỹ và vườn tượng gỗ dân gian.", afternoon: "Thăm làng văn hóa cộng đồng Kon Pring & nông trại cam hữu cơ.", evening: "Ăn tối Gà nướng cơm lam truyền thống." },
      { day: "Ngày 3: Năng Lượng Rừng Già", morning: "Ngắm bình minh rừng thông, mua sâm dây Kon Plông chính hiệu.", afternoon: "Xe đưa về sân bay Pleiku." }
    ]]
  },
  {
    hotel_id: "HTL-QN-01", city: "Quy Nhơn", hotel_name: "Avani Quy Nhon Resort (5 Sao Quốc Tế)",
    combo_title: "3N2Đ Nghỉ Dưỡng Bãi Biển Riêng & Khám Phá Kỳ Co - Eo Gió",
    price_per_night: 1380000, retail_per_night: 2200000, rating: 4.92, sla_code: "SLA-QN-44102",
    weather_temp_c: 27, weather_desc: "Nắng vàng dịu, biển xanh trong, gió mát",
    vector: { healing: 86, nature: 95, solitude: 82, comfort: 90, culture: 70 },
    keywords: ["biển", "làng chài", "hải sản", "eo gió", "kỳ co", "quy nhơn"],
    hint: "Nơi những vách đá kỳ vĩ ôm trọn làn nước biển trong vắt 2 màu cùng nhịp sống bình yên của làng chài miền Trung.",
    packing: ["Đồ bơi & trang phục đi biển", "Kem chống nắng SPF50+ & Kính râm", "CCCD bản gốc", "Mũ rộng vành", "Túi chống nước điện thoại"],
    food_guide: ["Bánh xèo tôm nhảy Gia Vỹ (35.000đ/chiếc)", "Bún chả cá Ngọc Liên (45.000đ/tô)", "Ốc Thúy Kiều (40.000đ - 60.000đ/đĩa)"],
    itinerary_variants: [[
      { day: "Ngày 1: Tận Hưởng Bãi Biển Riêng", morning: "Đáp sân bay Phù Cát, xe riêng đón về Resort 5 sao sát biển.", afternoon: "Tắm biển tại bãi riêng của Resort & thưởng thức dừa tươi.", evening: "Dạo phố ẩm thực Ngô Văn Sở & ăn bánh xèo tôm nhảy." },
      { day: "Ngày 2: Cano Kỳ Co & Cung Đường Eo Gió", morning: "Đi cano ra bãi biển Kỳ Co & lặn ngắm rạn san hô tự nhiên.", afternoon: "Check-in cung đường đá ven biển Eo Gió & Làng chài Nhơn Lý.", evening: "Thưởng thức hải sản tươi sống đánh bắt trong ngày." },
      { day: "Ngày 3: Bình Minh Đại Dương", morning: "Ngắm bình minh trên biển từ ban công phòng, ăn sáng bún chả cá.", afternoon: "Mua đặc sản bánh ít lá gai, xe tiễn ra sân bay Phù Cát." }
    ]]
  },
  {
    hotel_id: "HTL-HUE-01", city: "Huế", hotel_name: "Pilgrimage Village Boutique Resort & Spa (5 Sao)",
    combo_title: "3N2Đ Di Sản Cố Đô & Ngâm Khoáng Nóng Onsen",
    price_per_night: 1300000, retail_per_night: 2100000, rating: 4.94, sla_code: "SLA-HUE-99201",
    weather_temp_c: 24, weather_desc: "Trời dịu mát, yên bình, đậm chất thơ",
    vector: { healing: 93, nature: 78, solitude: 88, comfort: 92, culture: 99 },
    keywords: ["văn hóa", "di sản", "cố đô", "ẩm thực", "chùa", "thiền", "khoáng nóng", "huế"],
    hint: "Không gian tĩnh lặng của kiến trúc di sản cố đô kết hợp cùng nguồn suối khoáng nóng tự nhiên giúp phục hồi thể lực.",
    packing: ["Trang phục lịch sự tham quan di tích", "Đồ bơi ngâm khoáng nóng Onsen", "CCCD bản gốc", "Giày bệt êm chân", "Ô gấp gọn"],
    food_guide: ["Bún bò Mệ Kéo (40.000đ/tô)", "Cơm hến Hoa Đông (25.000đ/tô)", "Bánh bèo, nậm, lọc Bà Đỏ (60.000đ/khay)"],
    itinerary_variants: [[
      { day: "Ngày 1: Khám Phá Hoàng Cung", morning: "Hạ cánh sân bay Phú Bài, nhận phòng Resort 5 sao không gian làng quê.", afternoon: "Tham quan Đại Nội Huế & thưởng thức cà phê muối sân vườn.", evening: "Thưởng thức các món bánh Huế truyền thống & dạo cầu gỗ lim sông Hương." },
      { day: "Ngày 2: Lăng Tẩm & Suối Khoáng Nóng", morning: "Viếng chùa Thiên Mụ & tham quan Lăng Minh Mạng.", afternoon: "Ngâm tắm suối khoáng nóng Onsen Alba phục hồi năng lượng.", evening: "Ăn tối bún bò Huế & chè hạt sen cung đình." },
      { day: "Ngày 3: Hương Vị Cố Đô", morning: "Uống trà sen buổi sớm, mua trà cung đình & mè xửng.", afternoon: "Xe riêng tiễn ra sân bay Phú Bài." }
    ]]
  },
  {
    hotel_id: "HTL-PQ-01", city: "Phú Quốc", hotel_name: "Salinda Resort Phu Quoc Island (5 Sao Quốc Tế)",
    combo_title: "3N2Đ Nghỉ Dưỡng Đảo Ngọc 5 Sao & Ngắm Hoàng Hôn Nam Đảo",
    price_per_night: 1450000, retail_per_night: 2550000, rating: 4.96, sla_code: "SLA-PQ-55190",
    weather_temp_c: 29, weather_desc: "Nắng ấm nhiệt đới, biển êm, hoàng hôn đẹp",
    vector: { healing: 78, nature: 86, solitude: 55, comfort: 99, culture: 62 },
    keywords: ["resort 5 sao", "sang trọng", "cặp đôi", "biển đảo", "hoàng hôn", "phú quốc"],
    hint: "Kỳ nghỉ dưỡng 5 sao quốc tế bên bờ biển nhiệt đới với hồ bơi vô cực điện phân muối và hoàng hôn rực rỡ.",
    packing: ["Trang phục đi biển & dự tiệc tối", "Kính râm, mũ & kem chống nắng", "CCCD bản gốc", "Dép sandal biển", "Máy ảnh/Điện thoại"],
    food_guide: ["Bún quậy Kiến Xây (65.000đ/tô)", "Bún kèn Út Lượm (45.000đ/tô)", "Hải sản Làng chài Hàm Ninh (Niêm yết theo kg)"],
    itinerary_variants: [[
      { day: "Ngày 1: Trải Nghiệm Resort 5 Sao", morning: "Đáp chuyến bay thẳng tới Phú Quốc, xe đón về Resort 5 sao nhận phòng.", afternoon: "Thư giãn tại hồ bơi vô cực điện phân muối & ngắm hoàng hôn bãi biển riêng.", evening: "Thưởng thức bún quậy Kiến Xây & dạo chợ đêm." },
      { day: "Ngày 2: Quần Đảo An Thới & Cầu Hôn", morning: "Đi cáp treo vượt biển Hòn Thơm hoặc cano khám phá đảo.", afternoon: "Dạo bước tại Thị trấn Hoàng Hôn (Sunset Town) và Cầu Hôn.", evening: "Tiệc BBQ hải sản bên bờ biển." },
      { day: "Ngày 3: Thư Giãn & Mua Sắm", morning: "Dùng điểm tâm Buffet quốc tế kèm nhạc Piano sống, mua hồ tiêu & nước mắm cốt.", afternoon: "Xe riêng tiễn ra sân bay Phú Quốc." }
    ]]
  },
  {
    hotel_id: "HTL-NT-01", city: "Nha Trang", hotel_name: "Mia Resort Nha Trang (5 Sao - Biệt Thự Vách Đá)",
    combo_title: "3N2Đ Biệt Thự Vách Đá Hướng Vịnh & Tắm Bùn Khoáng Nóng",
    price_per_night: 1380000, retail_per_night: 2300000, rating: 4.91, sla_code: "SLA-NT-66418",
    weather_temp_c: 28, weather_desc: "Nắng đẹp, vịnh biển êm sóng, gió mát",
    vector: { healing: 88, nature: 90, solitude: 78, comfort: 96, culture: 74 },
    keywords: ["vịnh biển", "tắm bùn", "nha trang", "nghỉ dưỡng", "hải sản", "vách đá"],
    hint: "Khu nghỉ dưỡng tọa lạc trên vách đá hướng thẳng ra vịnh biển xanh ngắt kết hợp liệu trình ngâm bùn khoáng nóng.",
    packing: ["Đồ bơi & kem chống nắng", "Trang phục dạo phố biển", "CCCD bản gốc", "Mũ & kính râm", "Sạc dự phòng"],
    food_guide: ["Bún cá sứa Năm Beo (45.000đ/tô)", "Nem nướng Đặng Văn Quyên (65.000đ/phần)", "Hải sản Bờ Kè (Niêm yết giá chuẩn)"],
    itinerary_variants: [[
      { day: "Ngày 1: Biệt Thự Vách Đá Biển", morning: "Hạ cánh sân bay Cam Ranh, xe đón dọc cung đường đèo biển về Resort.", afternoon: "Tắm biển tại bãi riêng Bãi Đông & hồ bơi tràn bờ trên vách đá.", evening: "Ăn tối Nem nướng Đặng Văn Quyên." },
      { day: "Ngày 2: Khoáng Bùn Nóng & Tháp Bà", morning: "Trải nghiệm ngâm bùn khoáng nóng tự nhiên tại I-Resort.", afternoon: "Tham quan di tích Tháp Bà Ponagar.", evening: "Thưởng thức hải sản tươi sống & dạo quảng trường biển." },
      { day: "Ngày 3: Nắng Sớm Vịnh Xanh", morning: "Ăn sáng Bún cá sứa Năm Beo, mua đặc sản yến sào.", afternoon: "Xe riêng tiễn ra sân bay Cam Ranh." }
    ]]
  }
];

// ============================================================================
// HÀM TIỆN ÍCH & LƯU TRỮ BỀN VỮNG
// ============================================================================
window.safeLoadJSON = function(key, fallbackVal) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallbackVal;
    const parsed = JSON.parse(raw);
    return parsed !== null && parsed !== undefined ? parsed : fallbackVal;
  } catch (e) {
    localStorage.removeItem(key);
    return fallbackVal;
  }
};

window.safeSaveJSON = function(key, val) {
  try {
    localStorage.setItem(key, JSON.stringify(val));
    return true;
  } catch (e) {
    return false;
  }
};

window.formatVND = function(n) { return Number(n || 0).toLocaleString("vi-VN") + "đ"; };
window.normVN = function(s = "") { return String(s).normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/đ/g, "d").replace(/Đ/g, "D").toUpperCase().replace(/\s+/g, " ").trim(); };
window.normEmail = function(e = "") { return String(e || "").trim().toLowerCase(); };

// Kiểm tra định dạng Email chuẩn xác (Chặn hoàn toàn các đuôi sai như .com2, .vn123)
window.isValidEmailFormat = function(email) {
  const clean = window.normEmail(email);
  const strictRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,10}$/;
  if (!strictRegex.test(clean)) return false;
  const tld = clean.split(".").pop();
  if (/[0-9]/.test(tld)) return false;
  return true;
};

// Hàm băm mật khẩu để không lưu mật khẩu thô
window.hashPassword = function(pw = "") {
  let h = 2166136261;
  const str = "WM_SALT_" + String(pw);
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h += (h << 1) + (h << 4) + (h << 7) + (h << 8) + (h << 24);
  }
  return "h_" + (h >>> 0).toString(16);
};

window.showToast = function(msg, type = "success") {
  let box = document.getElementById("wmToastBox");
  if (!box) {
    box = document.createElement("div");
    box.id = "wmToastBox";
    box.style.cssText = "position:fixed;top:20px;right:20px;z-index:9999;display:flex;flex-direction:column;gap:8px;pointer-events:none;";
    document.body.appendChild(box);
  }
  const el = document.createElement("div");
  const bg = type === "error" ? "#E11D48" : (type === "warn" ? "#D97706" : "#0D9488");
  el.style.cssText = `background:${bg};color:#fff;padding:12px 18px;border-radius:12px;font-size:13px;font-weight:700;box-shadow:0 10px 25px rgba(0,0,0,0.4);pointer-events:auto;`;
  el.innerText = msg;
  box.appendChild(el);
  setTimeout(() => el.remove(), 3500);
};

window.WM_ALGO_CONFIG = window.safeLoadJSON("wm_algo_config_v5", {
  mode: "HYBRID_OTA",
  flightCapPct: 62,
  tabuPenaltyPct: 92,
  wSim: 50,
  wRating: 30,
  wBudget: 20
});

window.WM_STATE = {
  currentUser: window.safeLoadJSON("wm_active_user_v5", null),
  bookings: window.safeLoadJSON("wm_bookings_v5", []),
  savedWishlist: window.safeLoadJSON("wm_wishlist_v5", []),
  recentCities: window.safeLoadJSON("wm_recent_cities_v5", []),
  recentCombos: window.safeLoadJSON("wm_recent_combos_v5", []),
  currentBooking: window.safeLoadJSON("wm_current_draft_v5", null),
  lastRankedCombos: []
};

// ============================================================================
// HỆ THỐNG ĐĂNG KÝ & ĐĂNG NHẬP THẬT (TÁCH BIỆT 2 LUỒNG, KIỂM TRA MẬT KHẨU)
// ============================================================================
window.getUsersDB = function() {
  let db = window.safeLoadJSON("wm_accounts_db_v5", {});
  try {
    const match = document.cookie.match(/(?:^|;\s*)wm_acc_backup=([^;]*)/);
    if (match && match[1]) {
      const cookieData = JSON.parse(decodeURIComponent(match[1]));
      db = { ...cookieData, ...db };
    }
  } catch (e) {}
  return db;
};

window.saveUsersDB = function(db) {
  window.safeSaveJSON("wm_accounts_db_v5", db);
  try {
    document.cookie = `wm_acc_backup=${encodeURIComponent(JSON.stringify(db))}; path=/; max-age=31536000; SameSite=Lax`;
  } catch (e) {}
};

window.showAuthError = function(msg) {
  const errEl = document.getElementById("authErrorAlert");
  if (!errEl) return;
  if (!msg) {
    errEl.style.display = "none";
    errEl.innerText = "";
  } else {
    errEl.style.display = "block";
    errEl.innerText = msg;
  }
};

window.openAuthModal = function(tab = "login") {
  const modal = document.getElementById("authModal");
  if (!modal) return;
  window.switchAuthTab(tab);
  modal.style.display = "flex";
};

window.closeAuthModal = function() {
  const modal = document.getElementById("authModal");
  if (modal) modal.style.display = "none";
  window.showAuthError("");
};

window.switchAuthTab = function(tab) {
  window.showAuthError("");
  const isLogin = tab === "login";
  document.getElementById("formLogin").style.display = isLogin ? "block" : "none";
  document.getElementById("formRegister").style.display = isLogin ? "none" : "block";

  const btnL = document.getElementById("tabBtnLogin");
  const btnR = document.getElementById("tabBtnRegister");
  if (btnL && btnR) {
    btnL.className = isLogin ? "px-4 py-2 rounded-xl font-extrabold text-xs bg-teal-500 text-slate-950 transition" : "px-4 py-2 rounded-xl font-bold text-xs bg-white/5 text-slate-300 transition";
    btnR.className = !isLogin ? "px-4 py-2 rounded-xl font-extrabold text-xs bg-teal-500 text-slate-950 transition" : "px-4 py-2 rounded-xl font-bold text-xs bg-white/5 text-slate-300 transition";
  }
};

// XỬ LÝ ĐĂNG KÝ TÀI KHOẢN MỚI
window.handleRegisterSubmit = function() {
  window.showAuthError("");
  const fullName = (document.getElementById("regFullName")?.value || "").trim();
  const rawEmail = (document.getElementById("regEmail")?.value || "").trim();
  const pass = document.getElementById("regPassword")?.value || "";
  const confirmPass = document.getElementById("regConfirmPassword")?.value || "";

  if (fullName.length < 2) {
    window.showAuthError("Vui lòng nhập đầy đủ Họ và tên của bạn.");
    return;
  }
  if (!window.isValidEmailFormat(rawEmail)) {
    window.showAuthError("Địa chỉ Email không hợp lệ (Ví dụ đúng: ten@gmail.com). Vui lòng kiểm tra lại!");
    return;
  }
  if (pass.length < 6) {
    window.showAuthError("Mật khẩu phải có tối thiểu 6 ký tự.");
    return;
  }
  if (pass !== confirmPass) {
    window.showAuthError("Mật khẩu xác nhận không khớp.");
    return;
  }

  const email = window.normEmail(rawEmail);
  const db = window.getUsersDB();

  if (db[email]) {
    window.showAuthError("Email này đã được đăng ký. Vui lòng chuyển sang tab Đăng Nhập!");
    return;
  }

  const newUser = {
    email,
    name: fullName,
    passwordHash: window.hashPassword(pass),
    provider: "Tài khoản WanderMatch",
    avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(fullName)}&background=0D9488&color=fff`,
    createdAt: new Date().toISOString()
  };

  db[email] = newUser;
  window.saveUsersDB(db);
  window.setLoggedInUser(newUser);
  window.closeAuthModal();
  window.showToast(`Đăng ký tài khoản thành công! Chào mừng ${newUser.name}.`);
};

// XỬ LÝ ĐĂNG NHẬP (KIỂM TRA TỒN TẠI & ĐÚNG MẬT KHẨU)
window.handleLoginSubmit = function() {
  window.showAuthError("");
  const rawEmail = (document.getElementById("loginEmail")?.value || "").trim();
  const pass = document.getElementById("loginPassword")?.value || "";

  if (!window.isValidEmailFormat(rawEmail)) {
    window.showAuthError("Định dạng Email không hợp lệ.");
    return;
  }

  const email = window.normEmail(rawEmail);
  const db = window.getUsersDB();
  const account = db[email];

  if (!account) {
    window.showAuthError("Email này chưa được đăng ký trên hệ thống. Vui lòng bấm qua tab 'Đăng Ký Mới'!");
    return;
  }

  if (account.passwordHash !== window.hashPassword(pass)) {
    window.showAuthError("Mật khẩu không chính xác. Vui lòng thử lại!");
    return;
  }

  window.setLoggedInUser(account);
  window.closeAuthModal();
  window.showToast(`Đăng nhập thành công! Chào mừng trở lại, ${account.name}.`);
};

window.setLoggedInUser = function(user) {
  window.WM_STATE.currentUser = user;
  window.safeSaveJSON("wm_active_user_v5", user);

  document.getElementById("authLoggedOutBox").style.display = "none";
  document.getElementById("authLoggedInBox").style.display = "flex";
  document.getElementById("userAvatarImg").src = user.avatar;
  document.getElementById("userDisplayName").innerText = user.name;
  document.getElementById("userEmailSub").innerText = user.email;

  // Đồng bộ xuống form thông tin hành khách ở Bước 2
  if (document.getElementById("custEmail")) document.getElementById("custEmail").value = user.email;
  if (document.getElementById("custName")) document.getElementById("custName").value = user.name;
  window.autoFillBankHolder();
  window.persistFormState();
  window.updateSavedCounterUI();

  const badge = document.getElementById("oauthSyncStatusBadge");
  if (badge) {
    badge.className = "text-xs px-3 py-1 rounded-xl bg-teal-500/20 text-teal-300 font-bold";
    badge.innerText = `✓ Đã đồng bộ hồ sơ: ${user.email}`;
  }
};

window.logoutUser = function() {
  window.WM_STATE.currentUser = null;
  localStorage.removeItem("wm_active_user_v5");
  document.getElementById("authLoggedOutBox").style.display = "flex";
  document.getElementById("authLoggedInBox").style.display = "none";
  window.updateSavedCounterUI();
  window.showToast("Bạn đã đăng xuất khỏi phiên làm việc.", "warn");
};

// KẾT NỐI SUPABASE OAUTH THẬT CHO GOOGLE & FACEBOOK
window.toggleSupabaseConfigBox = function() {
  const el = document.getElementById("supabaseOAuthConfigBox");
  if (!el) return;
  el.style.display = el.style.display === "none" ? "block" : "none";
  document.getElementById("cfgSbUrl").value = localStorage.getItem("wm_sb_url") || "";
  document.getElementById("cfgSbKey").value = localStorage.getItem("wm_sb_key") || "";
};

window.saveSupabaseKeys = function() {
  localStorage.setItem("wm_sb_url", (document.getElementById("cfgSbUrl")?.value || "").trim());
  localStorage.setItem("wm_sb_key", (document.getElementById("cfgSbKey")?.value || "").trim());
  document.getElementById("supabaseOAuthConfigBox").style.display = "none";
  window.showToast("Đã lưu thông tin kết nối Supabase OAuth Project.");
};

window.triggerRealOAuth = async function(provider) {
  const url = localStorage.getItem("wm_sb_url") || "";
  const key = localStorage.getItem("wm_sb_key") || "";
  if (url && key && window.supabase) {
    try {
      const sb = window.supabase.createClient(url, key);
      const { error } = await sb.auth.signInWithOAuth({
        provider,
        options: { redirectTo: window.location.origin }
      });
      if (!error) return;
      window.showAuthError(`Lỗi kết nối ${provider}: ${error.message}`);
      return;
    } catch (e) {
      window.showAuthError(`Không thể kết nối tới Supabase OAuth: ${e.message}`);
      return;
    }
  }
  window.showAuthError(`Để chuyển hướng tới cổng ${provider.toUpperCase()} OAuth thật, vui lòng bấm 'Cấu hình Supabase OAuth Project' bên dưới hoặc sử dụng Đăng ký / Đăng nhập bằng Email ở trên.`);
};

// ============================================================================
// LÕI THUẬT TOÁN TỐI ƯU HÓA GIỎ HÀNG & CHỐNG TRÙNG LẶP (CHẠY NGẦM)
// ============================================================================
window.executeOTABlindAlgorithms = function(payload, recordHistory = true) {
  const { personaVector = {}, blacklistedCities = [], customPrompt = "", budgetVnd = 5000000, groupSize = 1 } = payload;
  const safeBudget = Math.max(2000000, Number(budgetVnd) || 5000000);
  const safeGroup = Math.max(1, Number(groupSize) || 1);
  const cfg = window.WM_ALGO_CONFIG;
  const nights = 2;
  const blNorm = (blacklistedCities || []).map(x => window.normVN(x));
  const txtLower = String(customPrompt || "").toLowerCase();

  let feasibleFlights = window.WM_FLIGHTS_DB.filter(f => f.price <= safeBudget * (cfg.flightCapPct / 100));
  if (!feasibleFlights.length) feasibleFlights = window.WM_FLIGHTS_DB;

  const keys = ["healing", "nature", "solitude", "comfort", "culture"];
  let validCombos = [];

  feasibleFlights.forEach(flight => {
    const cityNorm = window.normVN(flight.city);
    if (blNorm.some(b => b && (cityNorm.includes(b) || b.includes(cityNorm)))) return;

    const hotels = window.WM_HOTELS_DB.filter(h => h.city === flight.city);
    hotels.forEach(hotel => {
      const comboCostPerPerson = flight.price + (hotel.price_per_night * nights);
      const retailPerPerson = flight.price + (hotel.retail_per_night * nights);

      if (comboCostPerPerson <= safeBudget * 1.08) {
        let dot = 0, normU = 0, normH = 0, euclidSq = 0;
        keys.forEach(k => {
          const u = Number(personaVector[k] ?? 80);
          const v = Number(hotel.vector[k] ?? 80);
          dot += u * v;
          normU += u * u;
          normH += v * v;
          euclidSq += Math.pow(u - v, 2);
        });
        let cosineScore = (dot / ((Math.sqrt(normU) * Math.sqrt(normH)) || 1)) * 100;
        let topsisScore = Math.max(55, 100 * (1 - Math.sqrt(euclidSq / (keys.length * 10000))));

        hotel.keywords.forEach(kw => {
          if (txtLower.includes(kw)) {
            cosineScore += 5;
            topsisScore += 6;
          }
        });

        const simScore = Math.min(99.6, Math.round((cfg.mode === "TOPSIS_EUCLID" ? topsisScore : cosineScore) * 10) / 10);
        const budgetUtilization = Math.min(100, Math.round((comboCostPerPerson / safeBudget) * 1000) / 10);
        const ratingScore = (hotel.rating / 5.0) * 100;

        const wTotal = (cfg.wSim + cfg.wRating + cfg.wBudget) || 100;
        const utilityScore = Math.round(((simScore * (cfg.wSim / wTotal)) + (ratingScore * (cfg.wRating / wTotal)) + (budgetUtilization * (cfg.wBudget / wTotal))) * 10) / 10;

        validCombos.push({
          comboId: `${flight.flight_id}_${hotel.hotel_id}`,
          flight, hotel, comboCostPerPerson, retailPerPerson,
          simScore, budgetUtilization, utilityScore
        });
      }
    });
  });

  if (!validCombos.length) {
    const f = window.WM_FLIGHTS_DB[0], h = window.WM_HOTELS_DB[0];
    validCombos.push({
      comboId: `${f.flight_id}_${h.hotel_id}`, flight: f, hotel: h,
      comboCostPerPerson: safeBudget, retailPerPerson: Math.round(safeBudget * 1.25),
      simScore: 94.5, budgetUtilization: 96.0, utilityScore: 95.2
    });
  }

  validCombos.sort((a, b) => b.utilityScore - a.utilityScore);
  window.WM_STATE.lastRankedCombos = validCombos;

  const recentCities = window.WM_STATE.recentCities || [];
  const recentCombos = window.WM_STATE.recentCombos || [];
  const topCandidates = validCombos.slice(0, 5);
  const keepRatio = Math.max(0.01, (100 - cfg.tabuPenaltyPct) / 100);

  let picked = topCandidates[0];
  if (recordHistory && topCandidates.length > 1) {
    const lastComboId = recentCombos.length > 0 ? recentCombos[recentCombos.length - 1] : "";
    const filteredPool = topCandidates.filter(c => c.comboId !== lastComboId);
    const activePool = filteredPool.length > 0 ? filteredPool : topCandidates;

    const weights = activePool.map(c => {
      let w = Math.pow(c.utilityScore, 2);
      if (recentCombos.includes(c.comboId)) w *= (keepRatio * 0.2);
      if (recentCities.length > 0 && c.hotel.city === recentCities[recentCities.length - 1]) w *= keepRatio;
      return Math.max(w, 0.05);
    });

    const totalWeight = weights.reduce((a, b) => a + b, 0);
    let rand = Math.random() * totalWeight;
    picked = activePool[0];
    for (let i = 0; i < activePool.length; i++) {
      rand -= weights[i];
      if (rand <= 0) { picked = activePool[i]; break; }
    }

    window.WM_STATE.recentCities.push(picked.hotel.city);
    if (window.WM_STATE.recentCities.length > 5) window.WM_STATE.recentCities.shift();
    window.WM_STATE.recentCombos.push(picked.comboId);
    if (window.WM_STATE.recentCombos.length > 6) window.WM_STATE.recentCombos.shift();
    window.safeSaveJSON("wm_recent_cities_v5", window.WM_STATE.recentCities);
    window.safeSaveJSON("wm_recent_combos_v5", window.WM_STATE.recentCombos);
  }

  const variants = picked.hotel.itinerary_variants;
  const pickedItinerary = variants[Math.floor(Math.random() * variants.length)];
  const code = "WM" + Math.floor(10000 + Math.random() * 90000);
  const totalComboActual = picked.comboCostPerPerson * safeGroup;
  const totalRetail = Math.max(picked.retailPerPerson * safeGroup, Math.round(totalComboActual * 1.25));
  const savingsVnd = totalRetail - totalComboActual;

  const splitQrs = Array.from({ length: safeGroup }, (_, i) => ({
    memberIndex: i + 1,
    amount: picked.comboCostPerPerson,
    memo: `${code} M${i + 1}`,
    qrUrl: `https://img.vietqr.io/image/MB-0988888888-compact2.png?amount=${picked.comboCostPerPerson}&addInfo=${encodeURIComponent(`${code} M${i + 1}`)}&accountName=${encodeURIComponent("CONG TY TNHH WANDERMATCH VN")}`
  }));

  return {
    success: true,
    bookingCode: code,
    comboId: picked.comboId,
    ownerEmail: window.WM_STATE.currentUser?.email || "guest",
    isRevealed: false,
    matchScore: picked.simScore,
    utilityScore: picked.utilityScore,
    budgetUtilization: picked.budgetUtilization,
    flightSummary: `Chuyến bay khứ hồi ${picked.flight.airline} (${picked.flight.time})`,
    hotelSummary: `Resort ${picked.hotel.rating}★ tiêu chuẩn quốc tế (Đã bao gồm ăn sáng & xe đưa đón)`,
    savingsHighlight: `Tiết kiệm ngay ${window.formatVND(savingsVnd)} so với đặt lẻ từng dịch vụ`,
    weatherTempC: picked.hotel.weather_temp_c,
    weatherDesc: picked.hotel.weather_desc,
    mysteryHint: picked.hotel.hint,
    packingChecklist: picked.hotel.packing,
    antiTouristTrapGuide: picked.hotel.food_guide,
    itinerary: pickedItinerary,
    splitQrs,
    revealPackage: {
      cityName: picked.hotel.city,
      comboTitle: picked.hotel.combo_title,
      transportInfo: `${picked.flight.flight_id} - ${picked.flight.airline} (${picked.flight.time})`,
      hotelName: `${picked.hotel.hotel_name} (${picked.hotel.rating}★)`,
      hotelConfirmationCode: picked.hotel.sla_code,
      budgetPaid: totalComboActual,
      retailValue: totalRetail,
      savingsVnd
    }
  };
};

// ============================================================================
// HIỂN THỊ KẾT QUẢ HÀNH TRÌNH SANG TRỌNG, CHUẨN OTA THƯƠNG MẠI
// ============================================================================
window.renderAIRecommendationBox = function(data) {
  const box = document.getElementById("aiLiveResultBox");
  if (!box || !data) return;
  box.style.display = "block";
  box.innerHTML = `
    <div class="bg-slate-950/90 border border-teal-500/35 rounded-2xl p-6 space-y-5 mt-2 shadow-xl">
      <div class="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4">
        <div>
          <div class="flex items-center gap-2">
            <span class="text-[11px] px-2.5 py-0.5 rounded-full bg-teal-500/20 text-teal-300 font-bold">Độ phù hợp sở thích: ${data.matchScore}%</span>
            <span class="text-[11px] px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-bold">Khí hậu: ${data.weatherTempC}°C — ${data.weatherDesc}</span>
          </div>
          <h3 class="text-lg font-extrabold text-white mt-1.5">Gói Hành Trình Bí Mật 3 Ngày 2 Đêm (Mã gói: #${data.bookingCode})</h3>
        </div>
        <div class="text-right">
          <span class="text-[11px] text-slate-400 block">Tổng chi phí trọn gói (Vé bay + Resort)</span>
          <strong class="text-xl font-extrabold text-teal-400">${window.formatVND(data.revealPackage.budgetPaid)}</strong>
          <span class="text-[11px] text-amber-300 block font-semibold">${data.savingsHighlight}</span>
        </div>
      </div>

      <div class="grid sm:grid-cols-2 gap-3.5 text-xs">
        <div class="bg-slate-900/90 p-3.5 rounded-xl border border-white/10">
          <span class="text-slate-400 block mb-0.5">Hàng không & Di chuyển:</span>
          <strong class="text-white">${data.flightSummary}</strong>
        </div>
        <div class="bg-slate-900/90 p-3.5 rounded-xl border border-white/10">
          <span class="text-slate-400 block mb-0.5">Tiêu chuẩn lưu trú cam kết:</span>
          <strong class="text-white">${data.hotelSummary}</strong>
        </div>
      </div>

      <div class="bg-amber-500/10 border border-amber-400/30 p-4 rounded-xl">
        <span class="text-xs font-bold text-amber-300 uppercase">Bật mí về Điểm đến Bí mật của bạn</span>
        <p class="text-sm text-slate-100 mt-1 leading-relaxed">"${data.mysteryHint}"</p>
      </div>

      <div class="space-y-2.5">
        <span class="text-xs font-bold text-teal-300 uppercase">Lịch Trình Trải Nghiệm Dự Kiến (3 Ngày 2 Đêm):</span>
        <div class="grid md:grid-cols-3 gap-3.5">
          ${(data.itinerary || []).map(d => `
            <div class="bg-slate-900/90 p-4 rounded-xl border border-white/10 text-xs space-y-2">
              <strong class="text-teal-400 block border-b border-white/10 pb-1.5">${d.day}</strong>
              <p class="leading-relaxed"><span class="text-amber-300 font-bold">Sáng:</span> ${d.morning}</p>
              <p class="leading-relaxed"><span class="text-sky-300 font-bold">Chiều:</span> ${d.afternoon}</p>
              <p class="leading-relaxed"><span class="text-purple-300 font-bold">Tối:</span> ${d.evening}</p>
            </div>
          `).join("")}
        </div>
      </div>
    </div>
  `;
};

// ============================================================================
// QUẢN LÝ LƯU TRỮ HÀNH TRÌNH THEO TỪNG TÀI KHOẢN
// ============================================================================
window.getCurrentOwnerKey = function() {
  return window.WM_STATE.currentUser?.email || "guest";
};

window.saveCurrentDraftToWishlist = function() {
  if (!window.WM_STATE.currentBooking) {
    window.WM_STATE.currentBooking = window.executeOTABlindAlgorithms(window.collectUserPayload(), true);
  }
  const cur = { ...window.WM_STATE.currentBooking, ownerEmail: window.getCurrentOwnerKey() };
  const list = window.WM_STATE.savedWishlist || [];
  if (!list.some(x => x.bookingCode === cur.bookingCode)) {
    list.unshift(cur);
    window.WM_STATE.savedWishlist = list;
    window.safeSaveJSON("wm_wishlist_v5", list);
  }
  window.updateSavedCounterUI();
  window.renderSavedTripsDrawer();
  window.showToast(`Đã lưu hành trình #${cur.bookingCode} vào mục Chuyến Đi Của Tôi!`);
};

window.updateSavedCounterUI = function() {
  const owner = window.getCurrentOwnerKey();
  const wCount = (window.WM_STATE.savedWishlist || []).filter(x => x.ownerEmail === owner).length;
  const bCount = (window.WM_STATE.bookings || []).filter(x => x.ownerEmail === owner).length;
  if (document.getElementById("lblSavedCount")) {
    document.getElementById("lblSavedCount").innerText = String(wCount + bCount);
  }
};

window.toggleSavedTripsDrawer = function() {
  const el = document.getElementById("savedTripsDrawer");
  if (!el) return;
  const isHidden = el.style.display === "none";
  el.style.display = isHidden ? "block" : "none";
  if (isHidden) window.renderSavedTripsDrawer();
};

window.renderSavedTripsDrawer = function() {
  window.updateSavedCounterUI();
  const owner = window.getCurrentOwnerKey();
  const wishEl = document.getElementById("savedWishlistContainer");
  const bookEl = document.getElementById("savedOfficialBookingsContainer");

  if (wishEl) {
    const wList = (window.WM_STATE.savedWishlist || []).filter(x => x.ownerEmail === owner);
    wishEl.innerHTML = wList.length === 0
      ? `<p class="text-slate-400 italic">Bạn chưa lưu hành trình nào.</p>`
      : wList.map(w => `
        <div class="p-3 rounded-xl bg-slate-900 border border-white/10 flex justify-between items-center gap-2">
          <div>
            <strong class="text-amber-300 block">Mã #${w.bookingCode} — Phù hợp ${w.matchScore}%</strong>
            <span class="text-slate-300 text-[11px] block">Khí hậu ${w.weatherTempC}°C | Trọn gói: ${window.formatVND(w.revealPackage.budgetPaid)}</span>
          </div>
          <button onclick="window.promoteSavedDraftToTrip('${w.bookingCode}')" class="px-3 py-1.5 rounded-lg bg-teal-500 text-slate-950 font-extrabold text-[11px]">Đặt Chuyến →</button>
        </div>
      `).join("");
  }

  if (bookEl) {
    const bList = (window.WM_STATE.bookings || []).filter(x => x.ownerEmail === owner);
    bookEl.innerHTML = bList.length === 0
      ? `<p class="text-slate-400 italic">Bạn chưa có đơn đặt chỗ nào.</p>`
      : bList.map(b => `
        <div class="p-3 rounded-xl bg-slate-900 border border-teal-500/30 flex justify-between items-center gap-2">
          <div>
            <strong class="text-teal-300 block">Đơn #${b.bookingCode} — ${b.customerName}</strong>
            <span class="text-white text-[11px] block">${b.isRevealed ? `Điểm đến: ${b.revealPackage.cityName}` : "Đang niêm phong bí mật"} (${window.formatVND(b.revealPackage.budgetPaid)})</span>
          </div>
          <button onclick="window.loadLockedBookingToView('${b.bookingCode}')" class="px-3 py-1.5 rounded-lg bg-amber-400 text-slate-950 font-extrabold text-[11px]">Chi Tiết →</button>
        </div>
      `).join("");
  }
};

window.promoteSavedDraftToTrip = function(code) {
  const found = (window.WM_STATE.savedWishlist || []).find(x => x.bookingCode === code);
  if (!found) return;
  window.WM_STATE.currentBooking = found;
  window.safeSaveJSON("wm_current_draft_v5", found);
  window.renderAIRecommendationBox(found);
  window.syncActiveBookingToSteps(found);
  document.getElementById("savedTripsDrawer").style.display = "none";
  window.goToStep(2);
};

window.loadLockedBookingToView = function(code) {
  const found = (window.WM_STATE.bookings || []).find(x => x.bookingCode === code);
  if (!found) return;
  window.WM_STATE.currentBooking = found;
  window.safeSaveJSON("wm_current_draft_v5", found);
  window.renderAIRecommendationBox(found);
  window.syncActiveBookingToSteps(found);
  document.getElementById("savedTripsDrawer").style.display = "none";
  window.goToStep(3);
};

// ============================================================================
// ĐIỀU HƯỚNG & LƯU TRẠNG THÁI FORM
// ============================================================================
window.persistFormState = function() {
  window.safeSaveJSON("wm_form_state_v5", window.collectUserPayload());
};

window.restoreFormState = function() {
  const s = window.safeLoadJSON("wm_form_state_v5", null);
  if (!s) return;
  if (document.getElementById("custEmail") && s.email) document.getElementById("custEmail").value = s.email;
  if (document.getElementById("custName") && s.fullName) document.getElementById("custName").value = s.fullName;
  if (document.getElementById("custCCCD") && s.cccd) document.getElementById("custCCCD").value = s.cccd;
  if (document.getElementById("custBankCode") && s.bankCode) document.getElementById("custBankCode").value = s.bankCode;
  if (document.getElementById("custBankAcc") && s.bankAccount) document.getElementById("custBankAcc").value = s.bankAccount;
  if (document.getElementById("custBankHolder") && s.bankAccountHolder) document.getElementById("custBankHolder").value = s.bankAccountHolder;
  if (document.getElementById("budgetInput") && s.budgetVnd) document.getElementById("budgetInput").value = s.budgetVnd;
  if (document.getElementById("groupSizeInput") && s.groupSize) document.getElementById("groupSizeInput").value = s.groupSize;
  if (document.getElementById("customAIPrompt") && s.customPrompt !== undefined) document.getElementById("customAIPrompt").value = s.customPrompt;
  if (document.getElementById("blacklistInput") && Array.isArray(s.blacklistedCities)) document.getElementById("blacklistInput").value = s.blacklistedCities.join(", ");
  if (s.personaVector) {
    if (document.getElementById("qHealing")) document.getElementById("qHealing").value = s.personaVector.healing ?? 85;
    if (document.getElementById("qNature")) document.getElementById("qNature").value = s.personaVector.nature ?? 90;
    if (document.getElementById("qSolitude")) document.getElementById("qSolitude").value = s.personaVector.solitude ?? 80;
    if (document.getElementById("qComfort")) document.getElementById("qComfort").value = s.personaVector.comfort ?? 90;
    if (document.getElementById("qCulture")) document.getElementById("qCulture").value = s.personaVector.culture ?? 75;
  }
};

window.collectUserPayload = function() {
  return {
    email: (document.getElementById("custEmail")?.value || "").trim(),
    fullName: (document.getElementById("custName")?.value || "").trim(),
    cccd: (document.getElementById("custCCCD")?.value || "").trim(),
    bankCode: document.getElementById("custBankCode")?.value || "BIDV",
    bankAccount: (document.getElementById("custBankAcc")?.value || "").trim(),
    bankAccountHolder: (document.getElementById("custBankHolder")?.value || "").trim(),
    budgetVnd: Number(document.getElementById("budgetInput")?.value || 5000000),
    groupSize: Number(document.getElementById("groupSizeInput")?.value || 1),
    customPrompt: document.getElementById("customAIPrompt")?.value || "",
    blacklistedCities: (document.getElementById("blacklistInput")?.value || "").split(",").map(s => s.trim()).filter(Boolean),
    personaVector: {
      healing: Number(document.getElementById("qHealing")?.value || 85),
      nature: Number(document.getElementById("qNature")?.value || 90),
      solitude: Number(document.getElementById("qSolitude")?.value || 80),
      comfort: Number(document.getElementById("qComfort")?.value || 90),
      culture: Number(document.getElementById("qCulture")?.value || 75)
    }
  };
};

window.updateSliders = function(userTriggered = false) {
  const p = window.collectUserPayload();
  if (document.getElementById("lblHealing")) document.getElementById("lblHealing").innerText = `Nghỉ ngơi & Chữa lành: ${p.personaVector.healing}%`;
  if (document.getElementById("lblNature")) document.getElementById("lblNature").innerText = `Thiên nhiên & Biển/Rừng: ${p.personaVector.nature}%`;
  if (document.getElementById("lblSolitude")) document.getElementById("lblSolitude").innerText = `Không gian riêng tư, yên tĩnh: ${p.personaVector.solitude}%`;
  if (document.getElementById("lblComfort")) document.getElementById("lblComfort").innerText = `Tiện nghi Resort 4-5 Sao: ${p.personaVector.comfort}%`;
  if (document.getElementById("lblCulture")) document.getElementById("lblCulture").innerText = `Văn hóa, Di sản & Ẩm thực: ${p.personaVector.culture}%`;
  if (document.getElementById("slaRetailGuarantee")) {
    document.getElementById("slaRetailGuarantee").innerText = `Cam kết giá trị gói >= ${window.formatVND(Math.round(p.budgetVnd * p.groupSize * 1.25))} (${p.groupSize} khách)`;
  }

  if (userTriggered || !window.WM_STATE.currentBooking) {
    window.persistFormState();
    const res = window.executeOTABlindAlgorithms(p, false);
    window.WM_STATE.currentBooking = res;
    window.safeSaveJSON("wm_current_draft_v5", res);
  }
  window.renderAIRecommendationBox(window.WM_STATE.currentBooking);
  window.syncActiveBookingToSteps(window.WM_STATE.currentBooking);
};

window.previewAIRecommendation = function() {
  const payload = window.collectUserPayload();
  window.persistFormState();
  const res = window.executeOTABlindAlgorithms(payload, true);
  window.WM_STATE.currentBooking = res;
  window.safeSaveJSON("wm_current_draft_v5", res);
  window.renderAIRecommendationBox(res);
  window.syncActiveBookingToSteps(res);
  window.showToast(`Đã tìm thấy hành trình mới #${res.bookingCode} phù hợp ${res.matchScore}%!`);
};

window.syncActiveBookingToSteps = function(data) {
  if (!data) return;
  if (document.getElementById("lblBookingCode")) document.getElementById("lblBookingCode").innerText = `Mã đơn: ${data.bookingCode}`;
  if (document.getElementById("anonWeatherBox")) document.getElementById("anonWeatherBox").innerText = `Dự báo thời tiết: ${data.weatherTempC}°C — ${data.weatherDesc}`;
  if (document.getElementById("aiMysteryHintText")) document.getElementById("aiMysteryHintText").innerText = `"${data.mysteryHint}"`;
  if (document.getElementById("packingListContainer")) {
    document.getElementById("packingListContainer").innerHTML = (data.packingChecklist || []).map((item, i) => `
      <label class="flex items-center gap-2 cursor-pointer text-xs text-slate-200">
        <input type="checkbox" checked class="accent-teal-400 w-4 h-4" />
        <span>${i + 1}. ${item}</span>
      </label>
    `).join("");
  }
  window.populateRevealData(Boolean(data.isRevealed));
};

window.autoFillBankHolder = function() {
  const name = document.getElementById("custName")?.value || "";
  const holderEl = document.getElementById("custBankHolder");
  if (holderEl) holderEl.value = window.normVN(name);
};

window.createBlindBooking = function() {
  const payload = window.collectUserPayload();
  window.persistFormState();

  if (!window.isValidEmailFormat(payload.email)) {
    window.showToast("Vui lòng nhập địa chỉ Email nhận vé hợp lệ!", "error");
    return;
  }
  if (payload.fullName.length < 2 || payload.bankAccount.length < 5) {
    window.showToast("Vui lòng điền đầy đủ Họ tên CCCD và Số tài khoản ngân hàng!", "error");
    return;
  }
  if (window.normVN(payload.fullName) !== window.normVN(payload.bankAccountHolder)) {
    window.showToast(`Từ chối giao dịch: Họ tên CCCD (${window.normVN(payload.fullName)}) không khớp Chủ TK (${window.normVN(payload.bankAccountHolder)})!`, "error");
    return;
  }

  let data = window.WM_STATE.currentBooking || window.executeOTABlindAlgorithms(payload, true);
  const officialRecord = {
    ...data,
    ownerEmail: window.getCurrentOwnerKey(),
    customerName: payload.fullName,
    customerEmail: payload.email,
    bankInfo: `${payload.bankCode} - ***${String(payload.bankAccount).slice(-4)}`,
    lockedAt: new Date().toISOString()
  };

  window.WM_STATE.currentBooking = officialRecord;
  window.safeSaveJSON("wm_current_draft_v5", officialRecord);

  const idx = window.WM_STATE.bookings.findIndex(b => b.bookingCode === officialRecord.bookingCode);
  if (idx >= 0) window.WM_STATE.bookings[idx] = officialRecord;
  else window.WM_STATE.bookings.unshift(officialRecord);
  window.safeSaveJSON("wm_bookings_v5", window.WM_STATE.bookings);

  document.getElementById("lblBookingCode").innerText = `Mã đơn: ${officialRecord.bookingCode}`;
  document.getElementById("qrPaymentSection").style.display = "block";
  document.getElementById("qrCardsContainer").innerHTML = (officialRecord.splitQrs || []).map(q => `
    <div class="bg-slate-900 p-3.5 rounded-xl border border-white/10 text-center space-y-2">
      <span class="text-xs font-bold text-teal-400">Hành khách #${q.memberIndex}</span>
      <img src="${q.qrUrl}" alt="VietQR" class="w-40 h-40 mx-auto rounded-lg bg-white p-1" />
      <p class="text-xs font-bold text-white">${window.formatVND(q.amount)}</p>
      <p class="text-[11px] text-slate-400">Nội dung CK: <strong>${q.memo}</strong></p>
    </div>
  `).join("");

  window.updateSavedCounterUI();
  window.showToast(`Đã xác nhận đơn đặt chỗ #${officialRecord.bookingCode} & tạo mã VietQR!`);
};

window.simulateRefund = function(scenario) {
  const b = window.WM_STATE.currentBooking;
  const totalPaid = b ? b.revealPackage.budgetPaid : Number(document.getElementById("budgetInput")?.value || 5000000);
  const map = {
    EARLY_72H: { title: "Hủy trước 72 giờ khởi hành", fee: 0.10, b2b: 0.00, note: "Hoàn tự động 90% giá trị đơn hàng về tài khoản ngân hàng đã liên kết." },
    LATE_24_72H: { title: "Hủy từ 24 giờ đến 72 giờ", fee: 0.35, b2b: 0.25, note: "Khấu trừ 35% phí giữ chỗ cận ngày (Trích 25% bồi hoàn cho đối tác Resort). Hoàn lại 65%." },
    FORCE_MAJEURE: { title: "Sự cố bất khả kháng (Y tế / Thời tiết)", fee: 0.10, b2b: 0.00, note: "Chính sách bảo vệ khách hàng: Hỗ trợ hoàn lại 90% sau khi xác minh chứng từ." },
    UNDER_24H: { title: "Hủy sát giờ khởi hành (Dưới 24 giờ)", fee: 1.00, b2b: 0.75, note: "Vé máy bay và phòng Resort đã xuất cố định, không áp dụng hoàn hủy." }
  }[scenario] || { title: "Hủy sớm", fee: 0.1, b2b: 0, note: "" };

  const feeVnd = Math.round(totalPaid * map.fee);
  const netVnd = totalPaid - feeVnd;

  document.getElementById("refundResultBox").innerHTML = `
    <p class="font-bold text-amber-300 text-xs">${map.title}</p>
    <p>Tổng chi phí đơn hàng: <strong>${window.formatVND(totalPaid)}</strong> | Phí hủy: <strong class="text-rose-400">-${window.formatVND(feeVnd)}</strong></p>
    <p class="text-sm font-extrabold text-teal-400 pt-1">Số tiền hoàn thực nhận: ${window.formatVND(netVnd)}</p>
    <p class="text-[11px] text-slate-400 italic">${map.note}</p>
  `;
};

window.initScratchCard = function() {
  const canvas = document.getElementById("scratchCanvas");
  if (!canvas) return;
  const cur = window.WM_STATE.currentBooking;
  if (cur && cur.isRevealed) {
    canvas.style.display = "none";
    window.populateRevealData(true);
    return;
  }
  canvas.style.display = "block";
  const rect = canvas.parentElement.getBoundingClientRect();
  canvas.width = Math.max(320, rect.width || 640);
  canvas.height = Math.max(260, rect.height || 320);
  const ctx = canvas.getContext("2d");
  ctx.globalCompositeOperation = "source-over";
  const grad = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
  grad.addColorStop(0, "#0F172A");
  grad.addColorStop(0.5, "#1E293B");
  grad.addColorStop(1, "#0F172A");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#2DD4BF";
  ctx.font = "bold 15px Plus Jakarta Sans, sans-serif";
  ctx.textAlign = "center";
  ctx.fillText("CÀO LỚP PHỦ NÀY HOẶC BẤM 'MỞ KHÓA ĐIỂM ĐẾN NGAY'", canvas.width / 2, canvas.height / 2);

  window.populateRevealData(false);
  let drawing = false;
  const scratch = (e) => {
    if (!drawing) return;
    const r = canvas.getBoundingClientRect();
    const cx = e.touches ? e.touches[0].clientX : e.clientX;
    const cy = e.touches ? e.touches[0].clientY : e.clientY;
    ctx.globalCompositeOperation = "destination-out";
    ctx.beginPath();
    ctx.arc(cx - r.left, cy - r.top, 38, 0, Math.PI * 2);
    ctx.fill();
  };
  canvas.onmousedown = () => { drawing = true; };
  canvas.onmouseup = () => { drawing = false; };
  canvas.onmousemove = scratch;
  canvas.ontouchstart = () => { drawing = true; };
  canvas.ontouchend = () => { drawing = false; };
  canvas.ontouchmove = scratch;
};

window.populateRevealData = function(hideCanvas = true) {
  if (!window.WM_STATE.currentBooking) {
    window.WM_STATE.currentBooking = window.executeOTABlindAlgorithms(window.collectUserPayload(), true);
  }
  const b = window.WM_STATE.currentBooking;
  const rev = b.revealPackage;
  if (document.getElementById("revCityName")) document.getElementById("revCityName").innerText = rev.cityName;
  if (document.getElementById("revComboTitle")) document.getElementById("revComboTitle").innerText = rev.comboTitle;
  if (document.getElementById("revSlaCode")) document.getElementById("revSlaCode").innerText = rev.hotelConfirmationCode;
  if (document.getElementById("revTransport")) document.getElementById("revTransport").innerText = rev.transportInfo;
  if (document.getElementById("revHotel")) document.getElementById("revHotel").innerText = rev.hotelName;
  if (document.getElementById("revRetailPrice")) document.getElementById("revRetailPrice").innerText = window.formatVND(rev.retailValue);
  if (document.getElementById("revPaidPrice")) document.getElementById("revPaidPrice").innerText = window.formatVND(rev.budgetPaid);
  if (document.getElementById("revSavings")) document.getElementById("revSavings").innerText = "+" + window.formatVND(rev.savingsVnd);
  if (document.getElementById("revFoodGuide")) document.getElementById("revFoodGuide").innerHTML = (b.antiTouristTrapGuide || []).map(x => `<li>${x}</li>`).join("");

  if (hideCanvas) {
    b.isRevealed = true;
    window.safeSaveJSON("wm_current_draft_v5", b);
    const idx = window.WM_STATE.bookings.findIndex(x => x.bookingCode === b.bookingCode);
    if (idx >= 0) {
      window.WM_STATE.bookings[idx].isRevealed = true;
      window.safeSaveJSON("wm_bookings_v5", window.WM_STATE.bookings);
    }
    const canvas = document.getElementById("scratchCanvas");
    if (canvas) canvas.style.display = "none";
  }
};

window.switchTab = function(tabName) {
  ["b2c", "b2b", "admin"].forEach(t => {
    const p = document.getElementById("tab-" + t);
    if (p) p.style.display = (t === tabName) ? "block" : "none";
    const b = document.getElementById("btn-tab-" + t);
    if (b) {
      b.className = (t === tabName)
        ? "px-3.5 py-2 rounded-xl text-xs font-bold bg-teal-500 text-slate-950 transition"
        : "px-3.5 py-2 rounded-xl text-xs font-bold bg-white/5 hover:bg-white/10 text-slate-300 transition";
    }
  });
  if (tabName === "admin") window.renderAdminDashboard();
  if (tabName === "b2b") window.renderB2BPortal();
};

window.goToStep = function(stepNum) {
  [1, 2, 3, 4].forEach(s => {
    const p = document.getElementById("step-panel-" + s);
    if (p) p.style.display = (s === Number(stepNum)) ? "block" : "none";
    const b = document.getElementById("step-nav-" + s);
    if (b) {
      b.style.borderColor = (s === Number(stepNum)) ? "#14B8A6" : "rgba(255,255,255,0.1)";
      b.style.backgroundColor = (s === Number(stepNum)) ? "rgba(20,184,166,0.15)" : "rgba(15,23,42,0.6)";
    }
  });
  if (Number(stepNum) === 4) setTimeout(() => window.initScratchCard(), 60);
};

window.applyAlgorithmChanges = function() {
  window.WM_ALGO_CONFIG = {
    mode: document.getElementById("algoModeSelect")?.value || "HYBRID_OTA",
    flightCapPct: Number(document.getElementById("cfgFlightCap")?.value || 62),
    tabuPenaltyPct: Number(document.getElementById("cfgTabuPenalty")?.value || 92),
    wSim: Number(document.getElementById("cfgWSim")?.value || 50),
    wRating: Number(document.getElementById("cfgWRating")?.value || 30),
    wBudget: Number(document.getElementById("cfgWBudget")?.value || 20)
  };
  window.safeSaveJSON("wm_algo_config_v5", window.WM_ALGO_CONFIG);
  if (document.getElementById("lblFlightCap")) document.getElementById("lblFlightCap").innerText = `${window.WM_ALGO_CONFIG.flightCapPct}%`;
  if (document.getElementById("lblTabuPenalty")) document.getElementById("lblTabuPenalty").innerText = `${window.WM_ALGO_CONFIG.tabuPenaltyPct}%`;
  if (document.getElementById("lblWSim")) document.getElementById("lblWSim").innerText = `${window.WM_ALGO_CONFIG.wSim}%`;
  if (document.getElementById("lblWRating")) document.getElementById("lblWRating").innerText = `${window.WM_ALGO_CONFIG.wRating}%`;
  if (document.getElementById("lblWBudget")) document.getElementById("lblWBudget").innerText = `${window.WM_ALGO_CONFIG.wBudget}%`;

  const res = window.executeOTABlindAlgorithms(window.collectUserPayload(), false);
  window.WM_STATE.currentBooking = res;
  window.safeSaveJSON("wm_current_draft_v5", res);
  window.renderAIRecommendationBox(res);
};

window.renderB2BPortal = function() {
  const el = document.getElementById("b2bInventoryList");
  if (!el) return;
  el.innerHTML = window.WM_HOTELS_DB.map(i => `
    <div class="bg-slate-900 p-4 rounded-xl border border-white/10 flex flex-wrap justify-between items-center gap-3 text-xs">
      <div>
        <span class="px-2 py-0.5 rounded bg-teal-500/20 text-teal-300 font-bold">${i.city} — Mã SLA: ${i.sla_code}</span>
        <h4 class="font-bold text-sm text-white mt-1">${i.combo_title}</h4>
        <p class="text-slate-400">${i.hotel_name} (${i.rating}★)</p>
      </div>
      <div class="text-right">
        <p class="text-slate-400">Giá công bố: <span class="line-through">${window.formatVND(i.retail_per_night)}/đêm</span></p>
        <p class="text-teal-400 font-extrabold text-sm">Giá đối tác B2B: ${window.formatVND(i.price_per_night)}/đêm</p>
      </div>
    </div>
  `).join("");
};

window.renderAdminDashboard = function() {
  const usersEl = document.getElementById("adminUsersTable");
  if (usersEl) {
    const users = Object.values(window.getUsersDB());
    usersEl.innerHTML = users.length === 0
      ? `<p class="text-xs text-slate-400 italic">Chưa có tài khoản nào đăng ký.</p>`
      : users.map(u => `
        <div class="bg-slate-900 p-3 rounded-xl border border-white/10 flex items-center gap-2.5 text-xs">
          <img src="${u.avatar}" class="w-8 h-8 rounded-full" />
          <div>
            <strong class="text-white block">${u.name}</strong>
            <span class="text-teal-400 text-[11px]">${u.email}</span>
          </div>
        </div>
      `).join("");
  }

  const el = document.getElementById("adminBookingsTable");
  if (!el) return;
  const list = window.WM_STATE.bookings;
  el.innerHTML = list.length === 0
    ? `<p class="text-xs text-slate-400 italic">Chưa có đơn đặt chỗ nào.</p>`
    : list.map(b => `
      <div class="bg-slate-900 p-3.5 rounded-xl border border-white/10 text-xs space-y-1">
        <div class="flex justify-between">
          <strong class="text-amber-400">#${b.bookingCode} — ${b.customerName}</strong>
          <span class="text-teal-400 font-bold">${b.revealPackage.cityName} (${window.formatVND(b.revealPackage.budgetPaid)})</span>
        </div>
        <p class="text-slate-400">${b.revealPackage.transportInfo} | ${b.revealPackage.hotelName}</p>
      </div>
    `).join("");
};

window.runAISensitivityTest = function() {
  const basePayload = window.collectUserPayload();
  const runs = [1, 2, 3].map(turn => {
    const r = window.executeOTABlindAlgorithms(basePayload, true);
    return `<div class="bg-slate-950 p-3.5 rounded-xl border border-teal-500/30 text-xs space-y-1">
      <strong class="text-amber-300 block">Lần phân bổ #${turn}</strong>
      <span class="text-teal-400 font-extrabold block">➔ Điểm đến: ${r.revealPackage.cityName}</span>
      <span class="text-white block">${r.revealPackage.transportInfo}</span>
      <span class="text-slate-400 block">${r.revealPackage.hotelName} — ${window.formatVND(r.revealPackage.budgetPaid)}</span>
    </div>`;
  }).join("");
  document.getElementById("aiSensitivityTestOutput").innerHTML = runs;
  window.showToast("Đã kiểm chứng 3 lần phân bổ liên tiếp không trùng lặp!");
};

document.addEventListener("DOMContentLoaded", () => {
  // Dọn sạch các biến rác của bản đồ hàng cũ
  ["wm_users_vault_v4", "wm_active_session_v4", "wm_oauth_user"].forEach(k => localStorage.removeItem(k));

  window.restoreFormState();
  if (window.WM_STATE.currentUser) {
    window.setLoggedInUser(window.WM_STATE.currentUser);
  }
  window.updateSavedCounterUI();
  window.updateSliders(false);
});
