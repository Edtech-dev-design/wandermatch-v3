/**
 * WANDERMATCH — PRODUCTION LUXURY BLIND TRAVEL PLATFORM
 * Version 9.0 — End-to-End Cohesive Architecture & Rich Visual Engine
 */

// ============================================================================
// 1. CƠ SỞ DỮ LIỆU ĐIỂM ĐẾN, HÀNG KHÔNG & RESORT CAO CẤP (KÈM HÌNH ẢNH CHÂN THỰC)
// ============================================================================
window.FLIGHTS_DB = [
  { id: "VN151", origin: "HAN", city: "Đà Lạt", airline: "Vietnam Airlines", time: "08:30 - 10:15", price: 2100000, luggage: "23kg ký gửi + 12kg xách tay" },
  { id: "VJ403", origin: "HAN", city: "Đà Lạt", airline: "Vietjet Deluxe", time: "10:20 - 12:05", price: 1650000, luggage: "20kg ký gửi + 7kg xách tay" },
  { id: "QH121", origin: "HAN", city: "Quy Nhơn", airline: "Bamboo Airways", time: "09:00 - 10:35", price: 1950000, luggage: "20kg ký gửi + 7kg xách tay" },
  { id: "VN181", origin: "HAN", city: "Măng Đen", airline: "Vietnam Airlines (Pleiku + Xe đón riêng)", time: "07:45 - 10:30", price: 2050000, luggage: "23kg ký gửi + 12kg xách tay" },
  { id: "VN137", origin: "HAN", city: "Huế", airline: "Vietnam Airlines", time: "09:15 - 10:30", price: 1600000, luggage: "23kg ký gửi + 12kg xách tay" },
  { id: "VJ971", origin: "HAN", city: "Phú Quốc", airline: "Vietjet Deluxe", time: "09:40 - 11:50", price: 2450000, luggage: "20kg ký gửi + 7kg xách tay" },
  { id: "VN815", origin: "HAN", city: "Sapa", airline: "Vietnam Airlines Limousine VIP", time: "07:00 - 11:30", price: 1550000, luggage: "Hành lý không giới hạn" },
  { id: "VN251", origin: "SGN", city: "Đà Lạt", airline: "Vietnam Airlines", time: "09:00 - 09:55", price: 1450000, luggage: "23kg ký gửi + 12kg xách tay" },
  { id: "VN262", origin: "SGN", city: "Quy Nhơn", airline: "Bamboo Airways", time: "08:30 - 09:45", price: 1650000, luggage: "20kg ký gửi + 7kg xách tay" },
  { id: "VN237", origin: "SGN", city: "Huế", airline: "Vietnam Airlines", time: "09:15 - 10:40", price: 1750000, luggage: "23kg ký gửi + 12kg xách tay" },
  { id: "VJ871", origin: "SGN", city: "Phú Quốc", airline: "Vietjet Deluxe", time: "10:00 - 11:00", price: 1550000, luggage: "20kg ký gửi + 7kg xách tay" },
  { id: "VN801", origin: "SGN", city: "Côn Đảo", airline: "Vietnam Airlines (Vasco ATR-72)", time: "08:00 - 08:55", price: 2200000, luggage: "20kg ký gửi + 7kg xách tay" }
];

window.HOTELS_DB = [
  {
    id: "HTL-DL", city: "Đà Lạt", name: "Ana Mandara Villas Dalat Resort & Spa (5 Sao)",
    title: "3N2Đ Biệt Thự Pháp Cổ Rừng Thông & Săn Mây Cầu Đất",
    room_type: "Le Petit Room (Biệt Thự Di Sản Pháp)",
    img: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&auto=format&fit=crop&q=80",
    night_price: 1350000, retail_night: 2250000, rating: 4.95, reviews_count: 1420, sla: "SLA-DL-88219", 
    temp: 16, weather: "Se lạnh, sương sớm rừng thông",
    amenities: ["Biệt thự cổ điển Pháp", "Hồ bơi nước ấm nước nóng ngoài trời", "Buffet sáng quốc tế", "Spa tinh dầu thông", "Xe riêng đưa đón"],
    vec: { healing: 96, nature: 90, solitude: 85, comfort: 92, culture: 82 }, 
    kw: ["săn mây", "rừng thông", "se lạnh", "cà phê"],
    hint: "Điểm đến của bạn sở hữu khí hậu cao nguyên se lạnh 16°C với những căn biệt thự kiến trúc Pháp ẩn mình dưới tán thông già 100 năm tuổi.",
    packing: ["Áo khoác giữ ấm & khăn choàng len", "Giày thể thao dạo đồi thông", "CCCD bản gốc làm thủ tục bay", "Kem dưỡng ẩm thảo mộc"],
    food: ["Bánh căn Lệ 27 Yersin (40.000đ/đĩa)", "Lẩu gà lá é Tao Ngộ (300.000đ/nồi)", "Cà phê Túi Mơ To (65.000đ/ly)"],
    days: [
      { d: "Ngày 1: Nhận Phòng Biệt Thự Rừng Thông", m: "Hạ cánh sân bay, xe riêng đón về Resort 5 sao nhận phòng & dùng trà Atiso nóng.", a: "Dạo bộ dưới rừng thông cổ thụ & trải nghiệm ngâm chân thảo dược.", e: "Thưởng thức Lẩu gà lá é nóng hổi trong tiết trời se lạnh 16°C." },
      { d: "Ngày 2: Đón Biển Mây & Di Sản Kiến Trúc", m: "05:30 Đón bình minh đồi chè Cầu Đất & ăn bánh căn xíu mại bản địa.", a: "Tham quan Biệt điện Trần Lệ Xuân & thư giãn liệu trình Spa tinh dầu thông.", e: "Bữa tối ấm cúng với rau củ hữu cơ Đà Lạt tại nhà hàng Pháp." },
      { d: "Ngày 3: Mua Quà Cao Nguyên & Trở Về", m: "Mua hồng treo gió công nghệ Nhật & trà hoa tại trung tâm OCOP chuẩn giá.", a: "Trả phòng muộn, xe riêng tiễn đoàn ra sân bay trở về." }
    ]
  },
  {
    id: "HTL-MD", city: "Măng Đen", name: "Golden Boutique Hotel Măng Đen (4 Sao Plus)",
    title: "3N2Đ Nghỉ Dưỡng Nguyên Sơ Giữa Đại Ngàn Măng Đen",
    room_type: "Deluxe Pine Forest View",
    img: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&auto=format&fit=crop&q=80",
    night_price: 1150000, retail_night: 1900000, rating: 4.88, reviews_count: 890, sla: "SLA-MD-77310", 
    temp: 18, weather: "Không khí nguyên sơ, mát lành",
    amenities: ["Ban công view rừng thông", "Buffet sáng đặc sản Kon Tum", "Xe đưa đón sân bay Pleiku", "Tiệc lửa trại giao lưu"],
    vec: { healing: 99, nature: 99, solitude: 98, comfort: 78, culture: 85 }, 
    kw: ["hoang sơ", "tách biệt", "rừng", "thác"],
    hint: "Hành trình đưa bạn lên cao nguyên 1.200m nguyên sơ, nơi chỉ có tiếng thông reo đại ngàn và dòng thác đổ tĩnh lặng tuyệt đối.",
    packing: ["Áo khoác nhẹ hoặc áo len mỏng", "Xịt chống côn trùng thảo mộc", "CCCD bản gốc", "Giày thể thao chống trượt"],
    food: ["Gà nướng cơm lam Cô Sinh (260.000đ/con)", "Lẩu xuyên tiêu Măng Đen (320.000đ/nồi)", "Cà phê Eva rang củi (40.000đ/ly)"],
    days: [
      { d: "Ngày 1: Cung Đường Thông Đại Ngàn", m: "Hạ cánh Pleiku, xe riêng đón thẳng lên thị trấn Măng Đen trong lành.", a: "Nhận phòng view rừng thông, dạo bộ quanh Hồ Đăk Ke thanh bình.", e: "Thưởng thức Lẩu xuyên tiêu cay nồng ấm bụng giữa sương lạnh." },
      { d: "Ngày 2: Khám Phá Thác Pa Sỹ & Bản Làng", m: "Tham quan Thác Pa Sỹ hùng vĩ và vườn tượng gỗ dân gian Tây Nguyên.", a: "Thăm làng văn hóa Kon Pring & thưởng thức nước ép cam hữu cơ bản địa.", e: "Ăn tối Gà nướng cơm lam truyền thống chấm muối hạt tiêu rừng." },
      { d: "Ngày 3: Năng Lượng Rừng Già", m: "Đón sương mai rừng thông, mua sâm dây Kon Plông chuẩn vùng trồng.", a: "Xe riêng đưa về sân bay Pleiku làm thủ tục bay." }
    ]
  },
  {
    id: "HTL-QN", city: "Quy Nhơn", name: "Avani Quy Nhon Resort (5 Sao Quốc Tế)",
    title: "3N2Đ Nghỉ Dưỡng Bãi Biển Riêng & Kỳ Co - Eo Gió",
    room_type: "Ocean View Deluxe King Bed",
    img: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=800&auto=format&fit=crop&q=80",
    night_price: 1380000, retail_night: 2200000, rating: 4.92, reviews_count: 1250, sla: "SLA-QN-44102", 
    temp: 27, weather: "Nắng vàng dịu, biển xanh trong vắt",
    amenities: ["Bãi biển riêng biệt lập", "Hồ bơi vô cực sát biển", "Buffet hải sản sáng", "Chèo thuyền Kayak miễn phí", "Yoga bờ biển"],
    vec: { healing: 86, nature: 95, solitude: 82, comfort: 90, culture: 70 }, 
    kw: ["biển", "làng chài", "hải sản", "eo gió", "kỳ co"],
    hint: "Nơi những vách đá kỳ vĩ ôm trọn làn nước đại dương xanh ngắt 2 màu cùng nhịp sống bình yên của làng chài ven biển miền Trung.",
    packing: ["Đồ bơi & trang phục đi biển", "Kem chống nắng SPF50+ & Kính râm", "CCCD bản gốc", "Mũ rộng vành"],
    food: ["Bánh xèo tôm nhảy Gia Vỹ (35.000đ/chiếc)", "Bún chả cá Ngọc Liên (45.000đ/tô)", "Ốc Thúy Kiều (40.000đ - 60.000đ/đĩa)"],
    days: [
      { d: "Ngày 1: Tận Hưởng Bãi Biển Riêng", m: "Đáp sân bay Phù Cát, xe sang đón về Resort 5 sao sát bờ biển.", a: "Tắm biển tại bãi biển riêng của Resort & thưởng thức dừa tươi nguyên quả.", e: "Dạo phố ẩm thực Ngô Văn Sở & ăn bánh xèo tôm nhảy giòn rụm." },
      { d: "Ngày 2: Cano Kỳ Co & Eo Gió", m: "Cano đưa ra bãi Kỳ Co nước xanh ngắt 2 màu & lặn ngắm san hô tự nhiên.", a: "Check-in đường đá ven biển Eo Gió & ngắm hoàng hôn Làng chài Nhơn Lý.", e: "Thưởng thức tiệc hải sản tươi sống đánh bắt trong ngày tại làng chài." },
      { d: "Ngày 3: Bình Minh Đại Dương", m: "Ngắm bình minh trên biển từ ban công phòng, ăn bún chả cá Quy Nhơn.", a: "Mua bánh ít lá gai & tré rơm làm quà, xe tiễn ra sân bay." }
    ]
  },
  {
    id: "HTL-HUE", city: "Huế", name: "Pilgrimage Village Boutique Resort & Spa (5 Sao)",
    title: "3N2Đ Di Sản Cố Đô & Ngâm Khoáng Nóng Onsen",
    room_type: "Traditional Villa Room Garden View",
    img: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&auto=format&fit=crop&q=80",
    night_price: 1300000, retail_night: 2100000, rating: 4.94, reviews_count: 1120, sla: "SLA-HUE-99201", 
    temp: 24, weather: "Trời dịu mát, không gian yên bình",
    amenities: ["Suối khoáng nóng Onsen Alba", "Hồ bơi tự nhiên giữa vườn", "Trà chiều cung đình miễn phí", "Lớp thiền & Yoga sáng"],
    vec: { healing: 93, nature: 78, solitude: 88, comfort: 92, culture: 99 }, 
    kw: ["văn hóa", "di sản", "cố đô", "chùa", "khoáng nóng"],
    hint: "Không gian tĩnh lặng mang kiến trúc làng quê cổ điển Cố Đô kết hợp cùng nguồn suối khoáng nóng tự nhiên giúp thanh lọc tâm trí.",
    packing: ["Trang phục lịch sự viếng di tích", "Đồ bơi ngâm khoáng nóng Onsen", "CCCD bản gốc", "Giày bệt êm chân"],
    food: ["Bún bò Mệ Kéo (40.000đ/tô)", "Cơm hến Hoa Đông (25.000đ/tô)", "Bánh bèo, nậm, lọc Bà Đỏ (60.000đ/khay)"],
    days: [
      { d: "Ngày 1: Khám Phá Hoàng Cung", m: "Hạ cánh sân bay Phú Bài, nhận phòng Resort 5 sao kiến trúc gạch nung mộc mạc.", a: "Tham quan Đại Nội Huế & thưởng thức cà phê muối sân vườn rợp bóng cây.", e: "Ăn bánh Huế truyền thống & dạo cầu gỗ lim ngắm sông Hương thơ mộng." },
      { d: "Ngày 2: Lăng Tẩm & Suối Khoáng Nóng", m: "Viếng chùa Thiên Mụ cổ kính & tham quan Lăng Minh Mạng uy nghiêm.", a: "Ngâm tắm suối khoáng nóng Onsen Alba phục hồi năng lượng và thể lực.", e: "Thưởng thức bún bò Huế thơm cay & chè hạt sen long nhãn Cung đình." },
      { d: "Ngày 3: Hương Vị Cố Đô", m: "Uống trà sen buổi sớm trong khuôn viên resort, mua trà Cung đình & mè xửng.", a: "Xe riêng tiễn đoàn ra sân bay Phú Bài." }
    ]
  },
  {
    id: "HTL-PQ", city: "Phú Quốc", name: "Salinda Resort Phu Quoc Island (5 Sao Quốc Tế)",
    title: "3N2Đ Nghỉ Dưỡng Đảo Ngọc 5 Sao & Hoàng Hôn Nam Đảo",
    room_type: "Deluxe Sunset View Room",
    img: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&auto=format&fit=crop&q=80",
    night_price: 1450000, retail_night: 2550000, rating: 4.96, reviews_count: 2180, sla: "SLA-PQ-55190", 
    temp: 29, weather: "Nắng ấm nhiệt đới, biển êm sóng lặng",
    amenities: ["Hồ bơi vô cực điện phân muối", "Bãi biển riêng hoàng hôn", "Buffet sáng kèm rượu sâm-panh", "Nhạc Piano sống", "Đưa đón sân bay"],
    vec: { healing: 78, nature: 86, solitude: 55, comfort: 99, culture: 62 }, 
    kw: ["resort 5 sao", "biển đảo", "hoàng hôn", "cặp đôi"],
    hint: "Kỳ nghỉ dưỡng 5 sao quốc tế bên bờ cát mịn nhiệt đới với hồ bơi vô cực điện phân muối và bữa tiệc hoàng hôn rực rỡ nhất Nam Đảo.",
    packing: ["Trang phục đi biển & váy dự tiệc", "Kính râm, mũ cói & kem chống nắng", "CCCD bản gốc", "Dép sandal biển"],
    food: ["Bún quậy Kiến Xây (65.000đ/tô)", "Bún kèn Út Lượm (45.000đ/tô)", "Hải sản Hàm Ninh (Niêm yết giá theo kg)"],
    days: [
      { d: "Ngày 1: Trải Nghiệm Resort 5 Sao", m: "Bay thẳng tới Phú Quốc, xe sang đón về Resort 5 sao nhận phòng hướng vườn.", a: "Thả mình tại hồ bơi điện phân muối & ngắm hoàng hôn bãi biển riêng Salinda.", e: "Tự tay pha nước chấm ăn Bún quậy Kiến Xây & dạo chợ đêm Bạch Đằng." },
      { d: "Ngày 2: Quần Đảo An Thới & Cầu Hôn", m: "Trải nghiệm cáp treo vượt biển dài nhất thế giới sang Hòn Thơm tắm biển.", a: "Check-in Sunset Town rực rỡ và ngắm Cầu Hôn (Kiss Bridge).", e: "Tiệc BBQ hải sản ghẹ Hàm Ninh tươi ngon bên bờ biển đêm." },
      { d: "Ngày 3: Thư Giãn & Mua Sắm", m: "Buffet sáng quốc tế kèm rượu vang & nhạc piano sống, mua tiêu sọ & nước mắm cốt.", a: "Xe riêng tiễn đoàn ra sân bay Phú Quốc." }
    ]
  },
  {
    id: "HTL-SP", city: "Sapa", name: "Silk Path Grand Resort & Spa Sapa (5 Sao)",
    title: "3N2Đ Biển Mây Hoàng Liên Sơn & Tắm Lá Thuốc Dao Đỏ",
    room_type: "Classic Mountain View King",
    img: "https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w=800&auto=format&fit=crop&q=80",
    night_price: 1400000, retail_night: 2350000, rating: 4.93, reviews_count: 980, sla: "SLA-SP-33108", 
    temp: 14, weather: "Se lạnh vùng cao, mây tràn thung lũng",
    amenities: ["Hồ bơi bốn mùa kính tràn", "Vườn hoa hồng cổ Sapa", "Bồn tắm thảo dược Dao đỏ", "View đỉnh Fansipan", "Buffet sáng Tây Bắc"],
    vec: { healing: 98, nature: 94, solitude: 86, comfort: 94, culture: 90 }, 
    kw: ["săn mây", "đỉnh fansipan", "dao đỏ", "thung lũng"],
    hint: "Resort 5 sao ngự trị trên đỉnh đồi riêng biệt, bao quát trọn vẹn biển mây bồng bềnh của dãy Hoàng Liên Sơn và thung lũng Mường Hoa.",
    packing: ["Áo khoác giữ ấm & khăn len", "Giày thể thao leo bậc thang", "CCCD bản gốc", "Son dưỡng môi chống nẻ"],
    food: ["Thắng cố A Quỳnh (350.000đ/nồi)", "Cá hồi Sapa nướng than (280.000đ/phần)", "Thịt lợn cắp nách quay (180.000đ/đĩa)"],
    days: [
      { d: "Ngày 1: Đón Khí Lạnh Hoàng Liên Sơn", m: "Limousine VIP đón tận nơi, nhận phòng resort view thung lũng Mường Hoa.", a: "Tắm bồn thảo dược lá thuốc Dao đỏ giúp giãn cơ và thư thái tinh thần.", e: "Thưởng thức Lẩu cá hồi cá tầm nghi ngút khói giữa tiết trời 14°C." },
      { d: "Ngày 2: Chinh Phục Nóc Nhà Đông Dương", m: "Cáp treo lên đỉnh Fansipan 3.143m ngắm quần thể tâm linh và biển mây.", a: "Dạo bản Tả Van chiêm ngưỡng ruộng bậc thang và nếp nhà người Giáy.", e: "Ăn đồ nướng than hoa Sapa & thưởng thức rượu mận Tả Van." },
      { d: "Ngày 3: Hương Rừng Tây Bắc", m: "Uống trà ô long ngắm bình minh trên đỉnh núi, mua nấm hương rừng & thịt trâu gác bếp.", a: "Xe Limousine đón tiễn đoàn trở về." }
    ]
  },
  {
    id: "HTL-CD", city: "Côn Đảo", name: "The Secret Côn Đảo Resort (4 Sao Luxury)",
    title: "3N2Đ Tĩnh Lặng Vùng Biển Huyền Thoại & Rừng Nguyên Sinh",
    room_type: "Deluxe Heritage Balcony Room",
    img: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop&q=80",
    night_price: 1390000, retail_night: 2200000, rating: 4.91, reviews_count: 760, sla: "SLA-CD-66120", 
    temp: 28, weather: "Gió biển mát rượi, không gian tĩnh lặng",
    amenities: ["Hồ bơi hướng biển Côn Sơn", "Khuôn viên biệt thự Pháp cổ", "Xe đưa đón sân bay Cỏ Ống", "Tour lặn biển san hô"],
    vec: { healing: 95, nature: 96, solitude: 99, comfort: 91, culture: 92 }, 
    kw: ["côn đảo", "tĩnh lặng", "biển hoang sơ", "rừng"],
    hint: "Vùng biển xanh ngọc bích biệt lập giữa đại dương, nơi rừng nguyên sinh ôm lấy những cung đường rợp bóng bàng cổ thụ hàng trăm năm tuổi.",
    packing: ["Trang phục trang nhã viếng nghĩa trang", "Đồ bơi & kính lặn ngắm san hô", "CCCD bản gốc", "Mũ rộng vành"],
    food: ["Ốc vú nàng xào bơ tỏi (120.000đ/đĩa)", "Cháo hàu Côn Đảo (50.000đ/tô)", "Hải sản tươi sống Côn Sơn (Theo thời giá)"],
    days: [
      { d: "Ngày 1: Đặt Chân Lên Hòn Đảo Huyền Bí", m: "Hạ cánh sân bay Cỏ Ống, xe đón băng qua cung đường biển tuyệt đẹp về Resort.", a: "Tắm tại Bãi Nhát hoang sơ & ngắm đỉnh Tình Yêu lúc hoàng hôn.", e: "Thưởng thức Cháo hàu nóng hổi và ốc vú nàng tươi ngon." },
      { d: "Ngày 2: Lịch Sử Thiêng Liêng & Thiên Nhiên", m: "Tham quan di tích Côn Đảo & viếng Nghĩa trang Hàng Dương trang nghiêm.", a: "Đi thuyền ra Hòn Bảy Cạnh lặn ngắm san hô và tìm hiểu bảo tồn rùa biển.", e: "Dạo bộ dưới hàng cây bàng cổ thụ trong không gian tĩnh mịch." },
      { d: "Ngày 3: Bình Yên Trước Đại Dương", m: "Ngắm bình minh Côn Đảo bên ly cà phê ven bờ biển, mua mứt hạt bàng đặc sản.", a: "Xe riêng tiễn đoàn ra sân bay Cỏ Ống." }
    ]
  }
];

// ============================================================================
// 2. HỆ THỐNG LƯU TRỮ LOCALSTORAGE & COOKIE VĨNH VIỄN
// ============================================================================
window.loadStore = function(k, def) {
  try {
    const r = localStorage.getItem(k);
    if (r) return JSON.parse(r);
    const m = document.cookie.match(new RegExp("(?:^|;\\s*)" + k + "=([^;]*)"));
    if (m && m[1]) return JSON.parse(decodeURIComponent(m[1]));
    return def;
  } catch (e) { return def; }
};

window.saveStore = function(k, v) {
  try {
    const s = JSON.stringify(v);
    localStorage.setItem(k, s);
    if (k === "wm_users_prod" || k === "wm_session_prod") {
      document.cookie = `${k}=${encodeURIComponent(s)}; path=/; max-age=31536000; SameSite=Lax`;
    }
  } catch (e) {}
};

window.formatVND = function(n) { return Number(n || 0).toLocaleString("vi-VN") + "đ"; };
window.normVN = function(s = "") {
  return String(s || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .toUpperCase()
    .replace(/\s+/g, " ")
    .trim();
};
window.cleanEmail = function(e = "") { return String(e || "").trim().toLowerCase(); };

window.isValidEmail = function(email) {
  const e = window.cleanEmail(email);
  if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,8}$/.test(e)) return false;
  return !/[0-9]/.test(e.split(".").pop());
};

window.hashPw = function(pw = "") {
  let h = 5381, s = "WM_PROD_" + String(pw);
  for (let i = 0; i < s.length; i++) h = ((h << 5) + h) + s.charCodeAt(i);
  return "pw_" + (h >>> 0).toString(16);
};

// ============================================================================
// 3. THÔNG BÁO TOAST CAO CẤP
// ============================================================================
window.showToast = function(msg, type = "success") {
  let box = document.getElementById("wmToastBox");
  if (!box) {
    box = document.createElement("div");
    box.id = "wmToastBox";
    box.style.cssText = "position:fixed;top:24px;right:24px;z-index:9999;display:flex;flex-direction:column;gap:10px;";
    document.body.appendChild(box);
  }
  const el = document.createElement("div");
  const bg = type === "error" 
    ? "linear-gradient(135deg, #E11D48 0%, #BE123C 100%)" 
    : (type === "warn" 
      ? "linear-gradient(135deg, #D97706 0%, #B45309 100%)" 
      : "linear-gradient(135deg, #0D9488 0%, #0F766E 100%)");
  
  el.style.cssText = `background:${bg};color:#fff;padding:14px 20px;border-radius:14px;font-size:12px;font-weight:700;box-shadow:0 12px 30px rgba(0,0,0,0.5);border:1px solid rgba(255,255,255,0.2);display:flex;align-items:center;gap:8px;animation:fadeIn 0.3s ease;`;
  el.innerHTML = `<span>${type === "error" ? "✕" : (type === "warn" ? "⚠️" : "✓")}</span><span>${msg}</span>`;
  box.appendChild(el);
  setTimeout(() => {
    el.style.opacity = "0";
    el.style.transform = "translateX(30px)";
    el.style.transition = "all 0.3s ease";
    setTimeout(() => el.remove(), 300);
  }, 3200);
};

// ============================================================================
// 4. HỆ THỐNG XÁC THỰC GOOGLE OAUTH RIÊNG BIỆT
// ============================================================================
window.openGoogleModal = function() {
  document.getElementById("googleEmailInput").value = "";
  document.getElementById("googleNameInput").value = "";
  document.getElementById("googlePasswordInput").value = "";
  document.getElementById("googleErrorBox").style.display = "none";
  document.getElementById("googleAuthModal").style.display = "flex";
};

window.closeGoogleModal = function() {
  document.getElementById("googleAuthModal").style.display = "none";
  document.getElementById("googleErrorBox").style.display = "none";
};

window.submitGoogleLogin = function() {
  const email = window.cleanEmail(document.getElementById("googleEmailInput")?.value || "");
  const name = (document.getElementById("googleNameInput")?.value || "").trim();
  const pass = document.getElementById("googlePasswordInput")?.value || "";

  if (!window.isValidEmail(email)) {
    const err = document.getElementById("googleErrorBox");
    err.innerText = "Vui lòng nhập địa chỉ Google Email hợp lệ!";
    err.style.display = "block";
    return;
  }
  if (name.length < 2) {
    const err = document.getElementById("googleErrorBox");
    err.innerText = "Vui lòng nhập họ và tên của bạn!";
    err.style.display = "block";
    return;
  }
  if (pass.length < 6) {
    const err = document.getElementById("googleErrorBox");
    err.innerText = "Mật khẩu bảo mật phải tối thiểu 6 ký tự!";
    err.style.display = "block";
    return;
  }

  const users = window.loadStore("wm_users_prod", {});
  const existing = users[email] || {};
  
  users[email] = {
    ...existing,
    name,
    email,
    provider: "google",
    avatar: "https://lh3.googleusercontent.com/a/default-user=s96-c",
    passHash: window.hashPw(pass),
    lastLoginAt: new Date().toISOString(),
    registeredAt: existing.registeredAt || new Date().toISOString(),
    preferences: existing.preferences || window.getFormInputs()
  };
  window.saveStore("wm_users_prod", users);

  window.saveStore("wm_session_prod", {
    name,
    email,
    provider: "google",
    avatar: "https://lh3.googleusercontent.com/a/default-user=s96-c"
  });

  window.applyUserSession();
  window.closeGoogleModal();
  window.showToast(`Xác thực tài khoản Google thành công! Chào mừng ${name}.`);
};

// ============================================================================
// 5. HỆ THỐNG XÁC THỰC FACEBOOK OAUTH RIÊNG BIỆT
// ============================================================================
window.openFacebookModal = function() {
  document.getElementById("fbEmailInput").value = "";
  document.getElementById("fbNameInput").value = "";
  document.getElementById("fbPasswordInput").value = "";
  document.getElementById("facebookErrorBox").style.display = "none";
  document.getElementById("facebookAuthModal").style.display = "flex";
};

window.closeFacebookModal = function() {
  document.getElementById("facebookAuthModal").style.display = "none";
  document.getElementById("facebookErrorBox").style.display = "none";
};

window.submitFacebookLogin = function() {
  const contact = (document.getElementById("fbEmailInput")?.value || "").trim();
  const name = (document.getElementById("fbNameInput")?.value || "").trim();
  const pass = document.getElementById("fbPasswordInput")?.value || "";

  if (contact.length < 5) {
    const err = document.getElementById("facebookErrorBox");
    err.innerText = "Vui lòng nhập Email hoặc Số điện thoại Facebook hợp lệ!";
    err.style.display = "block";
    return;
  }
  if (name.length < 2) {
    const err = document.getElementById("facebookErrorBox");
    err.innerText = "Vui lòng nhập Tên trên Facebook của bạn!";
    err.style.display = "block";
    return;
  }
  if (pass.length < 6) {
    const err = document.getElementById("facebookErrorBox");
    err.innerText = "Mật khẩu Facebook phải tối thiểu 6 ký tự!";
    err.style.display = "block";
    return;
  }

  const emailKey = contact.includes("@") ? window.cleanEmail(contact) : `${contact.replace(/[^0-9]/g, "")}@facebook.user.vn`;
  const users = window.loadStore("wm_users_prod", {});
  const existing = users[emailKey] || {};

  users[emailKey] = {
    ...existing,
    name,
    email: emailKey,
    phoneOrEmail: contact,
    provider: "facebook",
    avatar: "https://graph.facebook.com/v18.0/me/picture",
    passHash: window.hashPw(pass),
    lastLoginAt: new Date().toISOString(),
    registeredAt: existing.registeredAt || new Date().toISOString(),
    preferences: existing.preferences || window.getFormInputs()
  };
  window.saveStore("wm_users_prod", users);

  window.saveStore("wm_session_prod", {
    name,
    email: emailKey,
    provider: "facebook",
    avatar: "https://graph.facebook.com/v18.0/me/picture"
  });

  window.applyUserSession();
  window.closeFacebookModal();
  window.showToast(`Xác thực tài khoản Facebook thành công! Chào mừng ${name}.`);
};

// ============================================================================
// 6. FORM ĐĂNG NHẬP / ĐĂNG KÝ EMAIL RIÊNG BIỆT
// ============================================================================
window.openAuthModal = function(mode = "login") {
  document.getElementById("loginEmail").value = "";
  document.getElementById("loginPass").value = "";
  document.getElementById("regName").value = "";
  document.getElementById("regEmail").value = "";
  document.getElementById("regPass").value = "";
  document.getElementById("regPassConfirm").value = "";
  document.getElementById("authErrorBox").style.display = "none";
  document.getElementById("authModal").style.display = "flex";
  window.switchAuthMode(mode);
};

window.closeAuthModal = function() {
  document.getElementById("authModal").style.display = "none";
  document.getElementById("authErrorBox").style.display = "none";
};

window.switchAuthMode = function(mode) {
  const isLogin = mode === "login";
  document.getElementById("authErrorBox").style.display = "none";
  document.getElementById("formLogin").style.display = isLogin ? "block" : "none";
  document.getElementById("formRegister").style.display = isLogin ? "none" : "block";
  document.getElementById("tabBtnLogin").className = isLogin 
    ? "px-4 py-2 rounded-xl font-extrabold bg-teal-500 text-slate-950 transition" 
    : "px-4 py-2 rounded-xl font-bold bg-white/5 text-slate-300 transition";
  document.getElementById("tabBtnRegister").className = !isLogin 
    ? "px-4 py-2 rounded-xl font-extrabold bg-teal-500 text-slate-950 transition" 
    : "px-4 py-2 rounded-xl font-bold bg-white/5 text-slate-300 transition";
};

window.setAuthError = function(msg) {
  const box = document.getElementById("authErrorBox");
  box.innerText = msg;
  box.style.display = "block";
};

window.submitRegister = function() {
  const name = (document.getElementById("regName")?.value || "").trim();
  const email = window.cleanEmail(document.getElementById("regEmail")?.value || "");
  const pass = document.getElementById("regPass")?.value || "";
  const confirm = document.getElementById("regPassConfirm")?.value || "";

  if (name.length < 2) return window.setAuthError("Vui lòng nhập đầy đủ Họ và tên.");
  if (!window.isValidEmail(email)) return window.setAuthError("Địa chỉ Email không hợp lệ (Không dùng tên miền có số như .com2)!");
  if (pass.length < 6) return window.setAuthError("Mật khẩu phải có tối thiểu 6 ký tự.");
  if (pass !== confirm) return window.setAuthError("Mật khẩu xác nhận không trùng khớp.");

  const users = window.loadStore("wm_users_prod", {});
  if (users[email]) return window.setAuthError("Email này đã được đăng ký. Vui lòng chuyển sang tab Đăng Nhập!");

  users[email] = {
    name,
    email,
    passHash: window.hashPw(pass),
    provider: "email",
    avatar: "",
    registeredAt: new Date().toISOString(),
    lastLoginAt: new Date().toISOString(),
    preferences: window.getFormInputs()
  };
  window.saveStore("wm_users_prod", users);
  window.saveStore("wm_session_prod", { name, email, provider: "email", avatar: "" });
  
  window.applyUserSession();
  window.closeAuthModal();
  window.showToast(`Chào mừng ${name}! Tài khoản của bạn đã được tạo thành công.`);
};

window.submitLogin = function() {
  const email = window.cleanEmail(document.getElementById("loginEmail")?.value || "");
  const pass = document.getElementById("loginPass")?.value || "";

  if (!window.isValidEmail(email)) return window.setAuthError("Địa chỉ Email không đúng định dạng chuẩn.");
  const users = window.loadStore("wm_users_prod", {});
  const acc = users[email];

  if (!acc) return window.setAuthError("Email này chưa đăng ký tài khoản! Vui lòng chọn tab 'Đăng Ký Mới'.");
  if (acc.passHash !== window.hashPw(pass)) return window.setAuthError("Mật khẩu không chính xác. Vui lòng kiểm tra lại!");

  acc.lastLoginAt = new Date().toISOString();
  window.saveStore("wm_users_prod", users);

  window.saveStore("wm_session_prod", { 
    name: acc.name, 
    email: acc.email, 
    provider: acc.provider || "email", 
    avatar: acc.avatar || "" 
  });
  
  window.applyUserSession();
  window.closeAuthModal();
  window.showToast(`Chào mừng trở lại, ${acc.name}! Đã mở khóa hành trình bí mật.`);
};

// ============================================================================
// 7. ĐIỀU PHỐI PHÂN QUYỀN TRUY CẬP (AUTH GATEKEEPER)
// ============================================================================
window.applyUserSession = function() {
  const session = window.loadStore("wm_session_prod", null);
  const outBox = document.getElementById("authLoggedOutBox");
  const inBox = document.getElementById("authLoggedInBox");
  const gatekeeper = document.getElementById("gatekeeperLanding");
  const b2cTab = document.getElementById("tab-b2c");

  if (session && session.email) {
    outBox.style.display = "none";
    inBox.style.display = "flex";
    gatekeeper.style.display = "none";
    b2cTab.style.display = "block";

    document.getElementById("userDisplayName").innerText = session.name || "Hành khách";
    document.getElementById("userDisplayEmail").innerText = session.email;
    document.getElementById("userProviderBadge").innerText = (session.provider || "EMAIL").toUpperCase();
    
    const avatarImg = document.getElementById("userAvatarImg");
    const avatarContainer = document.getElementById("userAvatarContainer");
    if (session.provider === "google") {
      avatarImg.style.display = "block";
      avatarImg.src = session.avatar || "https://lh3.googleusercontent.com/a/default-user=s96-c";
    } else if (session.provider === "facebook") {
      avatarImg.style.display = "block";
      avatarImg.src = session.avatar || "https://graph.facebook.com/v18.0/me/picture";
    } else {
      avatarImg.style.display = "none";
      avatarContainer.innerText = (session.name || "U").charAt(0).toUpperCase();
    }

    if (document.getElementById("custEmail")) document.getElementById("custEmail").value = session.email;
    if (document.getElementById("custName")) document.getElementById("custName").value = session.name;
    window.syncBankHolderName();
  } else {
    outBox.style.display = "flex";
    inBox.style.display = "none";
    gatekeeper.style.display = "block";
    b2cTab.style.display = "none";
    document.getElementById("tab-saved").style.display = "none";
    document.getElementById("tab-b2b").style.display = "none";
  }

  window.updateSavedBadge();
};

window.logoutUser = function() {
  localStorage.removeItem("wm_session_prod");
  document.cookie = "wm_session_prod=; path=/; max-age=0";
  window.applyUserSession();
  window.showToast("Đã đăng xuất an toàn. Hệ thống đã được niêm phong bảo mật.", "warn");
};

// ============================================================================
// 8. THUẬT TOÁN DU LỊCH MÙ & TỐI ƯU HÓA KNAPSACK / COSINE ĐA SẮC THÁI
// ============================================================================
window.getFormInputs = function() {
  return {
    origin: document.getElementById("originInput")?.value || "HAN",
    groupSize: Math.max(1, Number(document.getElementById("groupSizeInput")?.value || 2)),
    budget: Math.max(2500000, Number(document.getElementById("budgetInput")?.value || 5000000)),
    blacklist: (document.getElementById("blacklistInput")?.value || "").split(",").map(s => window.normVN(s)).filter(Boolean),
    prompt: (document.getElementById("customPromptInput")?.value || "").toLowerCase(),
    vec: {
      healing: Number(document.getElementById("qHealing")?.value || 85),
      nature: Number(document.getElementById("qNature")?.value || 90),
      solitude: Number(document.getElementById("qSolitude")?.value || 80),
      comfort: Number(document.getElementById("qComfort")?.value || 90),
      culture: Number(document.getElementById("qCulture")?.value || 75)
    }
  };
};

window.runBlindTravelEngine = function(avoidRepeat = true) {
  const inp = window.getFormInputs();
  const history = window.loadStore("wm_history_prod", []);

  // 1. Lọc tuyến bay
  let flights = window.FLIGHTS_DB.filter(f => f.origin === inp.origin && f.price <= inp.budget * 0.65);
  if (!flights.length) flights = window.FLIGHTS_DB.filter(f => f.origin === inp.origin) || window.FLIGHTS_DB;

  let combos = [];
  const keys = ["healing", "nature", "solitude", "comfort", "culture"];

  // 2. Thuật toán Cosine Similarity 5 chiều & Tối ưu hóa Knapsack
  flights.forEach(f => {
    const cityNorm = window.normVN(f.city);
    if (inp.blacklist.some(b => cityNorm.includes(b) || b.includes(cityNorm))) return;

    window.HOTELS_DB.filter(h => h.city === f.city).forEach(h => {
      const unitCost = f.price + (h.night_price * 2);
      const unitRetail = f.price + (h.retail_night * 2);
      
      if (unitCost <= inp.budget * 1.10) {
        let dot = 0, nU = 0, nH = 0;
        keys.forEach(k => {
          dot += inp.vec[k] * h.vec[k];
          nU += inp.vec[k] ** 2;
          nH += h.vec[k] ** 2;
        });
        let sim = (dot / (Math.sqrt(nU) * Math.sqrt(nH))) * 100;
        h.kw.forEach(w => { if (inp.prompt.includes(w)) sim += 4.5; });
        sim = Math.min(99.6, Math.round(sim * 10) / 10);

        const knapsackRatio = Math.min(100, Math.round((unitCost / inp.budget) * 1000) / 10);
        const util = Math.round(((sim * 0.50) + ((h.rating / 5) * 100 * 0.25) + (knapsackRatio * 0.25)) * 10) / 10;
        
        combos.push({ 
          comboId: `${f.id}_${h.id}`, 
          f, 
          h, 
          unitCost, 
          unitRetail, 
          sim, 
          util,
          knapsackRatio
        });
      }
    });
  });

  if (!combos.length) {
    const f = window.FLIGHTS_DB[0], h = window.HOTELS_DB[0];
    combos.push({ 
      comboId: `${f.id}_${h.id}`, 
      f, 
      h, 
      unitCost: inp.budget, 
      unitRetail: Math.round(inp.budget * 1.30), 
      sim: 96.0, 
      util: 95.0,
      knapsackRatio: 100.0
    });
  }
  combos.sort((a, b) => b.util - a.util);

  // 3. Chống trùng lặp lịch sử
  let chosen = combos[0];
  if (avoidRepeat && combos.length > 1) {
    const freshPool = combos.filter(c => c.comboId !== history[history.length - 1]);
    chosen = freshPool[0] || combos[0];
    history.push(chosen.comboId);
    if (history.length > 5) history.shift();
    window.saveStore("wm_history_prod", history);
  }

  const code = "WM" + Math.floor(10000 + Math.random() * 90000);
  const totalPaid = chosen.unitCost * inp.groupSize;
  const totalRetail = chosen.unitRetail * inp.groupSize;
  const savings = totalRetail - totalPaid;

  const qrs = Array.from({ length: inp.groupSize }, (_, i) => ({
    idx: i + 1,
    amount: chosen.unitCost,
    memo: `${code} KH${i + 1}`,
    url: `https://img.vietqr.io/image/MB-0988888888-compact2.png?amount=${chosen.unitCost}&addInfo=${encodeURIComponent(`${code} KH${i + 1}`)}&accountName=${encodeURIComponent("CONG TY TNHH WANDERMATCH VN")}`
  }));

  const reasoningLog = `[Thuật toán Knapsack + Cosine Matching]: Đã tối ưu gói ngân sách ${window.formatVND(inp.budget)}/khách ➔ Khớp cặp vé máy bay khứ hồi ${chosen.f.id} (${chosen.f.airline}) + 2 đêm nghỉ dưỡng tại ${chosen.h.rating}★ ${chosen.h.name}. Điểm Utility đạt ${chosen.util}/100, hệ số tương thích 5 chiều cảm xúc đạt ${chosen.sim}%. Tiết kiệm ngay ${window.formatVND(savings)} so với giá bán lẻ thị trường.`;

  return {
    code, 
    comboId: chosen.comboId, 
    isLocked: false, 
    isRevealed: false,
    matchScore: chosen.sim, 
    utilityScore: chosen.util,
    knapsackRatio: chosen.knapsackRatio,
    reasoningLog,
    temp: chosen.h.temp, 
    weather: chosen.h.weather,
    hint: chosen.h.hint, 
    packing: chosen.h.packing, 
    food: chosen.h.food, 
    days: chosen.h.days, 
    qrs,
    flightLabel: `Khứ hồi ${chosen.f.airline} (${chosen.f.time})`,
    hotelLabel: `Resort ${chosen.h.rating}★ tiêu chuẩn quốc tế (Kèm buffet sáng & xe đưa đón)`,
    reveal: {
      city: chosen.h.city, 
      title: chosen.h.title, 
      sla: chosen.h.sla,
      room_type: chosen.h.room_type,
      img: chosen.h.img,
      amenities: chosen.h.amenities,
      transport: `${chosen.f.id} - ${chosen.f.airline} (${chosen.f.time})`,
      hotel: chosen.h.name, 
      paid: totalPaid, 
      retail: totalRetail, 
      savings
    }
  };
};

window.onFormChange = function() {
  const inp = window.getFormInputs();
  document.getElementById("lblHealing").innerText = `Nghỉ dưỡng & Chữa lành: ${inp.vec.healing}%`;
  document.getElementById("lblNature").innerText = `Thiên nhiên Biển / Rừng: ${inp.vec.nature}%`;
  document.getElementById("lblSolitude").innerText = `Yên tĩnh, riêng tư tuyệt đối: ${inp.vec.solitude}%`;
  document.getElementById("lblComfort").innerText = `Tiện nghi Resort 4-5 Sao: ${inp.vec.comfort}%`;
  document.getElementById("lblCulture").innerText = `Văn hóa, Di sản & Ẩm thực: ${inp.vec.culture}%`;
  document.getElementById("slaRetailGuarantee").innerText = `Giá trị cam kết >= ${window.formatVND(Math.round(inp.budget * inp.groupSize * 1.25))}`;

  const pkg = window.runBlindTravelEngine(false);
  window.saveStore("wm_draft_prod", pkg);
  window.renderPackageUI(pkg);

  const session = window.loadStore("wm_session_prod", null);
  if (session && session.email) {
    const users = window.loadStore("wm_users_prod", {});
    if (users[session.email]) {
      users[session.email].preferences = inp;
      window.saveStore("wm_users_prod", users);
    }
  }
};

window.generateNewRecommendation = function() {
  const pkg = window.runBlindTravelEngine(true);
  window.saveStore("wm_draft_prod", pkg);
  window.renderPackageUI(pkg);
  window.showToast(`Đã tính toán hành trình mới #${pkg.code} (Khớp gu ${pkg.matchScore}%)!`);
};

// ============================================================================
// 9. GIAO DIỆN HỘP GỢI Ý CHUYẾN ĐI ĐA SẮC THÁI, HÌNH ẢNH & CHI PHÍ MINH BẠCH
// ============================================================================
window.renderPackageUI = function(pkg) {
  if (!pkg) return;
  const resultBox = document.getElementById("recommendationResultBox");
  if (!resultBox) return;

  resultBox.innerHTML = `
    <div class="bg-slate-950/95 border-2 border-teal-500/40 rounded-3xl p-6 md:p-8 space-y-6 shadow-2xl relative overflow-hidden transition-all duration-300">
      <!-- GLOW NỀN -->
      <div class="absolute -top-24 -right-24 w-72 h-72 bg-gradient-to-br from-teal-500/15 to-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
      <div class="absolute -bottom-24 -left-24 w-72 h-72 bg-gradient-to-tr from-amber-500/15 to-rose-500/10 rounded-full blur-3xl pointer-events-none"></div>

      <!-- HEADER HỘP GỢI Ý ĐA SẮC THÁI -->
      <div class="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-5">
        <div>
          <div class="flex flex-wrap items-center gap-2">
            <span class="text-xs px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 font-extrabold border border-teal-500/40 shadow-sm flex items-center gap-1.5">
              <span class="w-2 h-2 rounded-full bg-teal-400 animate-pulse"></span>
              Độ Khớp Gu: ${pkg.matchScore}%
            </span>
            <span class="text-xs px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 font-extrabold border border-amber-500/40 shadow-sm">
              Khí hậu: ${pkg.temp}°C — ${pkg.weather}
            </span>
            <span class="text-xs px-3 py-1 rounded-full bg-sky-500/20 text-sky-300 font-bold border border-sky-500/40 font-mono">
              Knapsack: ${pkg.knapsackRatio}% ngân sách
            </span>
          </div>
          <h3 class="text-xl md:text-2xl font-extrabold text-white mt-2 font-heading tracking-tight flex items-center gap-2">
            <span>Gói Nghỉ Dưỡng Bí Mật 3N2Đ</span>
            <span class="text-xs px-2.5 py-1 rounded-lg bg-white/10 text-amber-400 font-mono border border-amber-400/30">Mã: #${pkg.code}</span>
          </h3>
        </div>

        <div class="text-right">
          <span class="text-[11px] text-slate-400 block font-semibold">Tổng chi phí trọn gói (Vé bay + Resort 4-5★)</span>
          <strong class="text-2xl md:text-3xl font-black text-teal-300 font-heading block mt-0.5">${window.formatVND(pkg.reveal.paid)}</strong>
          <span class="text-xs text-amber-300 block font-bold mt-0.5">Tiết kiệm ${window.formatVND(pkg.reveal.savings)} so với thị trường</span>
        </div>
      </div>

      <!-- BANNER HÌNH ẢNH RESORT CAO CẤP -->
      <div class="relative rounded-2xl overflow-hidden h-64 md:h-72 border border-white/15 shadow-xl group">
        <img src="${pkg.reveal.img}" alt="Resort Preview" class="w-full h-full object-cover group-hover:scale-105 transition duration-700" />
        <div class="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent"></div>
        
        <div class="absolute top-4 left-4 flex flex-wrap gap-2">
          <span class="text-xs px-3 py-1 rounded-full bg-slate-900/90 text-amber-400 font-extrabold border border-amber-400/40 backdrop-blur-md flex items-center gap-1 shadow">
            ★ 4.95/5 (Tiêu chuẩn 5 Sao Quốc Tế)
          </span>
          <span class="text-xs px-3 py-1 rounded-full bg-teal-950/90 text-teal-300 font-bold border border-teal-400/40 backdrop-blur-md shadow">
            🛡️ Cam Kết Dịch Vụ SLA
          </span>
        </div>

        <div class="absolute bottom-4 left-4 right-4 flex flex-wrap justify-between items-end gap-2">
          <div>
            <span class="text-[11px] text-teal-300 uppercase tracking-widest font-black block">Resort Nghỉ Dưỡng Đối Tác Phút Chót</span>
            <h4 class="text-lg md:text-xl font-extrabold text-white font-heading mt-0.5">${pkg.reveal.hotel}</h4>
            <p class="text-xs text-slate-300 mt-0.5">${pkg.reveal.room_type} — Kèm Buffet Sáng Miễn Phí</p>
          </div>
          <div class="flex flex-wrap gap-1.5">
            ${(pkg.reveal.amenities || []).slice(0, 3).map(a => `
              <span class="text-[10px] px-2.5 py-1 rounded-lg bg-white/15 backdrop-blur-md text-white font-medium border border-white/20">${a}</span>
            `).join("")}
          </div>
        </div>
      </div>

      <!-- NHẬT KÝ THUẬT TOÁN LOG (DIAGNOSTIC REASONING LOG) -->
      <div class="bg-slate-900/90 border border-teal-500/30 p-3.5 rounded-2xl font-mono text-[11px] leading-relaxed text-teal-200">
        <span class="text-amber-400 font-bold">⚙️ [AI REASONING LOG]:</span> ${pkg.reasoningLog}
      </div>

      <!-- 2 CỘT CHI TIẾT DỊCH VỤ -->
      <div class="grid sm:grid-cols-2 gap-4 text-xs">
        <div class="bg-slate-900/90 p-4 rounded-2xl border border-white/10 hover:border-teal-500/40 transition">
          <div class="flex items-center gap-2 text-teal-400 font-bold mb-1">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/></svg>
            <span>Hàng Không & Tuyến Bay Khứ Hồi:</span>
          </div>
          <strong class="text-white text-sm block mt-1">${pkg.flightLabel}</strong>
          <span class="text-[11px] text-slate-400 block mt-1">Đã bao gồm 20kg hành lý ký gửi + 7kg xách tay.</span>
        </div>

        <div class="bg-slate-900/90 p-4 rounded-2xl border border-white/10 hover:border-teal-500/40 transition">
          <div class="flex items-center gap-2 text-amber-400 font-bold mb-1">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/></svg>
            <span>Tiêu Chuẩn Lưu Trú Bảo Chứng:</span>
          </div>
          <strong class="text-white text-sm block mt-1">${pkg.hotelLabel}</strong>
          <span class="text-[11px] text-slate-400 block mt-1">Phòng Deluxe view đẹp + Miễn phí sử dụng hồ bơi & phòng Gym.</span>
        </div>
      </div>

      <!-- BẢNG BÓC TÁCH CHI PHÍ TRỌN GÓI MINH BẠCH -->
      <div class="bg-slate-900/90 p-5 rounded-2xl border border-white/10 space-y-3 text-xs">
        <h4 class="font-extrabold text-white text-sm flex items-center justify-between border-b border-white/10 pb-2">
          <span>Bóc Tách Chi Phí Minh Bạch & Giá Trị Tiết Kiệm</span>
          <span class="text-teal-400 font-mono text-xs">OTA Wholesale Deal</span>
        </h4>
        <div class="space-y-1.5 text-slate-300">
          <div class="flex justify-between">
            <span>Vé máy bay khứ hồi (Hãng hàng không quốc gia):</span>
            <strong class="text-white font-mono">${window.formatVND(pkg.reveal.paid * 0.45)}</strong>
          </div>
          <div class="flex justify-between">
            <span>2 Đêm Resort 4-5★ (${pkg.reveal.room_type}):</span>
            <strong class="text-white font-mono">${window.formatVND(pkg.reveal.paid * 0.55)}</strong>
          </div>
          <div class="flex justify-between text-slate-400">
            <span>Thuế VAT, Phí bảo trì sân bay & Bảo hiểm du lịch:</span>
            <span class="text-emerald-400 font-bold">ĐÃ BAO GỒM (0đ)</span>
          </div>
          <div class="flex justify-between text-slate-400">
            <span>Giá thị trường nếu tự đặt lẻ từng dịch vụ:</span>
            <span class="line-through font-mono">${window.formatVND(pkg.reveal.retail)}</span>
          </div>
          <div class="flex justify-between pt-2 border-t border-white/10 text-sm font-extrabold">
            <span class="text-white">Tổng số tiền bạn thanh toán:</span>
            <span class="text-teal-300 font-mono text-base">${window.formatVND(pkg.reveal.paid)}</span>
          </div>
        </div>
      </div>

      <!-- BỨC THƯ BẬT MÍ KHÔNG GIAN BÍ MẬT -->
      <div class="bg-gradient-to-r from-amber-500/15 via-teal-500/10 to-indigo-500/15 border-2 border-amber-400/40 p-5 rounded-3xl relative">
        <div class="flex items-center gap-2 text-amber-300 font-extrabold text-xs uppercase tracking-wider">
          <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"/><path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"/></svg>
          <span>Thư Gợi Ý Không Gian Điểm Đến Bí Mật (Đã Niêm Phong Tên Thành Phố)</span>
        </div>
        <p class="text-sm md:text-base text-white mt-2 leading-relaxed italic font-serif">
          "${pkg.hint}"
        </p>
      </div>

      <!-- LỊCH TRÌNH MẪU 3 NGÀY 2 ĐÊM ĐA SẮC THÁI -->
      <div class="space-y-3">
        <span class="text-xs font-bold text-slate-300 uppercase tracking-wider block">Lịch trình mẫu 3 Ngày 2 Đêm được thiết kế riêng:</span>
        <div class="grid md:grid-cols-3 gap-4 text-xs">
          ${pkg.days.map(d => `
            <div class="bg-slate-900/90 p-4 rounded-2xl border border-white/10 space-y-2.5 hover:border-teal-500/40 transition">
              <strong class="text-teal-400 block border-b border-white/10 pb-2 font-bold text-sm">${d.d}</strong>
              <p class="leading-relaxed"><span class="px-1.5 py-0.5 rounded bg-amber-400/20 text-amber-300 font-black mr-1 text-[11px]">SÁNG</span> <span class="text-slate-200">${d.m}</span></p>
              <p class="leading-relaxed"><span class="px-1.5 py-0.5 rounded bg-sky-400/20 text-sky-300 font-black mr-1 text-[11px]">CHIỀU</span> <span class="text-slate-200">${d.a}</span></p>
              <p class="leading-relaxed"><span class="px-1.5 py-0.5 rounded bg-purple-400/20 text-purple-300 font-black mr-1 text-[11px]">TỐI</span> <span class="text-slate-200">${d.e}</span></p>
            </div>
          `).join("")}
        </div>
      </div>
    </div>
  `;

  document.getElementById("anonWeatherBox").innerText = `Khí hậu điểm đến: ${pkg.temp}°C — ${pkg.weather}`;
  document.getElementById("aiMysteryHintText").innerText = `"${pkg.hint}"`;
  document.getElementById("packingListContainer").innerHTML = pkg.packing.map((x, i) => `
    <label class="flex items-center gap-2.5 text-xs text-slate-200 p-2.5 rounded-xl bg-slate-900/60 border border-white/5 cursor-pointer hover:bg-slate-900 transition">
      <input type="checkbox" checked class="accent-teal-400 w-4 h-4 rounded cursor-pointer" />
      <span>${i + 1}. ${x}</span>
    </label>
  `).join("");

  document.getElementById("revCityName").innerText = pkg.reveal.city;
  document.getElementById("revComboTitle").innerText = pkg.reveal.title;
  document.getElementById("revSlaCode").innerText = pkg.reveal.sla;
  document.getElementById("revTransport").innerText = pkg.reveal.transport;
  document.getElementById("revHotel").innerText = pkg.reveal.hotel;
  document.getElementById("revRetailPrice").innerText = window.formatVND(pkg.reveal.retail);
  document.getElementById("revPaidPrice").innerText = window.formatVND(pkg.reveal.paid);
  document.getElementById("revSavings").innerText = "+" + window.formatVND(pkg.reveal.savings);
  document.getElementById("revFoodGuide").innerHTML = pkg.food.map(f => `<li>${f}</li>`).join("");
};

window.syncBankHolderName = function() {
  const n = document.getElementById("custName")?.value || "";
  document.getElementById("custBankHolder").value = window.normVN(n);
};

// ============================================================================
// 10. ĐẶT CHỖ, VIETQR & ĐỒNG HỒ ĐẾM NGƯỢC THỜI GIAN THẬT
// ============================================================================
window.qrTimerInterval = null;

window.confirmAndLockBooking = function() {
  const email = (document.getElementById("custEmail")?.value || "").trim();
  const name = (document.getElementById("custName")?.value || "").trim();
  const acc = (document.getElementById("custBankAcc")?.value || "").trim();
  const holder = (document.getElementById("custBankHolder")?.value || "").trim();

  if (!window.isValidEmail(email)) return window.showToast("Vui lòng nhập địa chỉ Email hợp lệ để nhận vé!", "error");
  if (name.length < 2 || acc.length < 5) return window.showToast("Vui lòng điền đầy đủ Họ tên trên CCCD và Số tài khoản ngân hàng!", "error");
  if (window.normVN(name) !== window.normVN(holder)) return window.showToast("Họ tên CCCD và Chủ tài khoản ngân hàng phải khớp nhau!", "error");

  let pkg = window.loadStore("wm_draft_prod", null) || window.runBlindTravelEngine(true);
  pkg.isLocked = true;
  pkg.customerName = name;
  pkg.customerEmail = email;
  pkg.bankAccount = acc;
  pkg.bankHolder = holder;
  window.saveStore("wm_draft_prod", pkg);

  const saved = window.loadStore("wm_saved_prod", []);
  const idx = saved.findIndex(x => x.code === pkg.code);
  if (idx >= 0) saved[idx] = pkg; else saved.unshift(pkg);
  window.saveStore("wm_saved_prod", saved);

  const session = window.loadStore("wm_session_prod", null);
  if (session && session.email) {
    const users = window.loadStore("wm_users_prod", {});
    if (users[session.email]) {
      users[session.email].bookings = users[session.email].bookings || [];
      users[session.email].bookings.unshift(pkg);
      window.saveStore("wm_users_prod", users);
    }
  }

  document.getElementById("lblBookingCode").innerText = `Mã Đơn Escrow: #${pkg.code}`;
  document.getElementById("qrPaymentSection").style.display = "block";
  document.getElementById("qrCardsContainer").innerHTML = pkg.qrs.map(q => `
    <div class="bg-slate-900/90 p-4 rounded-2xl border border-white/10 text-center space-y-2 shadow-lg">
      <span class="text-xs font-bold text-teal-400 block uppercase tracking-wider">Hành khách #${q.idx}</span>
      <img src="${q.url}" class="w-44 h-44 mx-auto rounded-xl bg-white p-1.5 shadow" alt="VietQR" />
      <p class="text-sm font-extrabold text-white font-mono">${window.formatVND(q.amount)}</p>
      <p class="text-[11px] text-slate-400">Nội dung chuyển khoản: <strong class="text-teal-300 font-mono">${q.memo}</strong></p>
    </div>
  `).join("");

  // Kích hoạt đồng hồ đếm ngược 15:00
  let secondsLeft = 15 * 60;
  if (window.qrTimerInterval) clearInterval(window.qrTimerInterval);
  window.qrTimerInterval = setInterval(() => {
    secondsLeft--;
    if (secondsLeft <= 0) {
      clearInterval(window.qrTimerInterval);
      document.getElementById("qrCountdownTimer").innerText = "Mã QR đã hết hạn";
    } else {
      const mins = Math.floor(secondsLeft / 60);
      const secs = secondsLeft % 60;
      document.getElementById("qrCountdownTimer").innerText = `Hết hạn sau: ${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    }
  }, 1000);

  window.updateSavedBadge();
  window.showToast(`Đã xuất mã VietQR ký quỹ cho chuyến đi #${pkg.code}!`);
};

window.simulatePaymentSuccess = function() {
  const pkg = window.loadStore("wm_draft_prod", null);
  if (!pkg) return;
  pkg.isPaid = true;
  window.saveStore("wm_draft_prod", pkg);
  
  window.showToast(`Napas 24/7: Đã xác nhận nhận tiền ký quỹ thành công cho đơn #${pkg.code}!`, "success");
  setTimeout(() => {
    window.goToStep(3);
  }, 1200);
};

window.saveCurrentToWishlist = function() {
  let pkg = window.loadStore("wm_draft_prod", null) || window.runBlindTravelEngine(true);
  const saved = window.loadStore("wm_saved_prod", []);
  if (!saved.some(x => x.code === pkg.code)) {
    saved.unshift(pkg);
    window.saveStore("wm_saved_prod", saved);
  }

  const session = window.loadStore("wm_session_prod", null);
  if (session && session.email) {
    const users = window.loadStore("wm_users_prod", {});
    if (users[session.email]) {
      users[session.email].wishlist = users[session.email].wishlist || [];
      users[session.email].wishlist.unshift(pkg);
      window.saveStore("wm_users_prod", users);
    }
  }

  window.updateSavedBadge();
  window.showToast(`Đã lưu hành trình #${pkg.code} vào danh sách chuyến đi của bạn!`);
};

window.updateSavedBadge = function() {
  const saved = window.loadStore("wm_saved_prod", []);
  const el = document.getElementById("lblSavedCount");
  if (el) el.innerText = String(saved.length);
};

window.simulateRefund = function(type) {
  const pkg = window.loadStore("wm_draft_prod", null);
  const paid = pkg ? pkg.reveal.paid : 5000000;
  const map = {
    EARLY_72H: { t: "Hủy trước 72 giờ khởi hành", r: 0.90, d: "Hoàn trả tức thì 90% về tài khoản ngân hàng thụ hưởng (Khấu trừ 10% chi phí vận hành sàn)." },
    LATE_24_72H: { t: "Hủy từ 24 giờ đến 72 giờ", r: 0.65, d: "Hoàn trả 65% (Khấu trừ 35% phí giữ phòng Resort cận ngày theo cam kết SLA)." },
    FORCE_MAJEURE: { t: "Sự cố thời tiết / Bất khả kháng", r: 0.90, d: "Bảo hiểm hỗ trợ hoàn trả 90% sau khi xác minh thông báo từ Cảng vụ hàng không." },
    UNDER_24H: { t: "Hủy dưới 24 giờ trước giờ bay", r: 0.00, d: "Vé máy bay và phòng Resort đã xuất định danh cố định, không hỗ trợ hoàn tiền." }
  }[type];

  document.getElementById("refundResultBox").innerHTML = `
    <strong class="text-amber-300 block text-xs uppercase font-extrabold">${map.t}</strong>
    <p class="text-base font-black text-teal-300 font-heading mt-1">Số tiền hoàn tự động: ${window.formatVND(Math.round(paid * map.r))}</p>
    <p class="text-[11px] text-slate-400 mt-1 leading-relaxed">${map.d}</p>
  `;
};

// ============================================================================
// 11. CANVAS THẺ CÀO KỸ THUẬT SỐ & MỞ KHÓA ĐIỂM ĐẾN
// ============================================================================
window.initScratchCanvas = function() {
  const c = document.getElementById("scratchCanvas");
  const pkg = window.loadStore("wm_draft_prod", null);
  if (!c) return;
  if (pkg && pkg.isRevealed) { c.style.display = "none"; return; }
  
  c.style.display = "block";
  c.width = c.parentElement.offsetWidth || 600;
  c.height = c.parentElement.offsetHeight || 360;
  const ctx = c.getContext("2d");

  ctx.fillStyle = "#080C16";
  ctx.fillRect(0, 0, c.width, c.height);

  ctx.strokeStyle = "rgba(245, 158, 11, 0.4)";
  ctx.lineWidth = 4;
  ctx.strokeRect(10, 10, c.width - 20, c.height - 20);

  ctx.fillStyle = "#2DD4BF";
  ctx.font = "bold 15px 'Plus Jakarta Sans', sans-serif";
  ctx.textAlign = "center";
  ctx.fillText("✦ CÀO LỚP PHỦ NÀY ĐỂ MỞ KHÓA ĐIỂM ĐẾN BÍ MẬT ✦", c.width / 2, c.height / 2 - 10);
  
  ctx.fillStyle = "#94A3B8";
  ctx.font = "12px 'Plus Jakarta Sans', sans-serif";
  ctx.fillText("Hoặc bấm nút 'Mở Khóa Ngay' ở góc trên", c.width / 2, c.height / 2 + 18);

  let draw = false;
  const scratch = (e) => {
    if (!draw) return;
    const r = c.getBoundingClientRect();
    const x = (e.clientX || (e.touches && e.touches[0].clientX)) - r.left;
    const y = (e.clientY || (e.touches && e.touches[0].clientY)) - r.top;
    ctx.globalCompositeOperation = "destination-out";
    ctx.beginPath();
    ctx.arc(x, y, 36, 0, Math.PI * 2);
    ctx.fill();
  };

  c.onmousedown = () => { draw = true; };
  c.onmouseup = () => { draw = false; };
  c.onmousemove = scratch;
  c.ontouchstart = () => { draw = true; };
  c.ontouchend = () => { draw = false; };
  c.ontouchmove = scratch;
};

window.revealDestinationNow = function() {
  const c = document.getElementById("scratchCanvas");
  if (c) c.style.display = "none";
  const pkg = window.loadStore("wm_draft_prod", null);
  if (pkg) {
    pkg.isRevealed = true;
    window.saveStore("wm_draft_prod", pkg);
    window.showToast(`Chúc mừng! Điểm đến bí mật của bạn là: ${pkg.reveal.city}!`);
  }
};

window.printVoucher = function() {
  window.print();
};

// ============================================================================
// 12. ĐIỀU HƯỚNG TABS & CÁC BƯỚC ĐẶT PHÒNG
// ============================================================================
window.switchTab = function(tab) {
  const session = window.loadStore("wm_session_prod", null);
  
  if (!session && (tab === "saved" || tab === "b2b")) {
    window.openAuthModal("login");
    return window.showToast("Vui lòng đăng nhập để truy cập khu vực này!", "warn");
  }

  ["b2c", "saved", "b2b"].forEach(t => {
    const el = document.getElementById("tab-" + t);
    const btn = document.getElementById("btn-tab-" + t);
    if (el) el.style.display = (t === tab) ? "block" : "none";
    if (btn) {
      btn.className = (t === tab)
        ? "px-4 py-2 rounded-xl font-bold bg-teal-500 text-slate-950 transition shadow"
        : "px-4 py-2 rounded-xl text-slate-300 hover:text-white transition";
    }
  });

  if (tab === "saved") window.renderSavedTab();
  if (tab === "b2b") window.renderB2BTab();
};

window.goToStep = function(s) {
  [1, 2, 3, 4].forEach(n => {
    const panel = document.getElementById("step-panel-" + n);
    const nav = document.getElementById("step-nav-" + n);
    if (panel) panel.style.display = (n === s) ? "block" : "none";
    if (nav) {
      nav.className = (n === s)
        ? "p-4 rounded-2xl border border-teal-400/50 bg-teal-500/15 text-left transition relative overflow-hidden group shadow-lg"
        : "p-4 rounded-2xl border border-white/10 bg-slate-900/60 text-left transition relative overflow-hidden group";
      
      const bar = nav.querySelector("div");
      if (bar) bar.className = (n === s) ? "absolute bottom-0 left-0 right-0 h-1 bg-teal-400" : "absolute bottom-0 left-0 right-0 h-1 bg-transparent group-hover:bg-teal-500/50";
    }
  });

  if (s === 4) setTimeout(() => window.initScratchCanvas(), 60);
};

window.renderSavedTab = function() {
  const list = window.loadStore("wm_saved_prod", []);
  const wList = list.filter(x => !x.isLocked);
  const bList = list.filter(x => x.isLocked);

  document.getElementById("savedWishlistContainer").innerHTML = wList.length === 0
    ? `<p class="text-slate-400 italic p-4 text-center">Chưa có hành trình yêu thích nào được lưu.</p>`
    : wList.map(x => `
      <div class="p-4 rounded-2xl bg-slate-900 border border-white/10 flex justify-between items-center hover:border-teal-500/40 transition">
        <div>
          <strong class="text-amber-300 block text-sm font-heading">Gói #${x.code} (Khớp gu ${x.matchScore}%)</strong>
          <span class="text-slate-400 text-xs">${window.formatVND(x.reveal.paid)} — Khí hậu ${x.temp}°C</span>
        </div>
        <button onclick="window.openSavedItem('${x.code}', 2)" class="px-4 py-2 rounded-xl bg-teal-500 text-slate-950 font-extrabold hover:bg-teal-400 transition">
          Đặt Ngay →
        </button>
      </div>
    `).join("");

  document.getElementById("savedBookingsContainer").innerHTML = bList.length === 0
    ? `<p class="text-slate-400 italic p-4 text-center">Chưa có đơn đặt chỗ ký quỹ nào.</p>`
    : bList.map(x => `
      <div class="p-4 rounded-2xl bg-slate-900 border border-teal-500/30 flex justify-between items-center hover:border-teal-400 transition">
        <div>
          <strong class="text-teal-300 block text-sm font-heading">Đơn #${x.code} — ${x.customerName}</strong>
          <span class="text-white text-xs">${x.isRevealed ? x.reveal.city : "Điểm đến đang niêm phong"} (${window.formatVND(x.reveal.paid)})</span>
        </div>
        <button onclick="window.openSavedItem('${x.code}', 4)" class="px-4 py-2 rounded-xl btn-glow-gold text-slate-950 font-extrabold transition">
          Xem Vé & Mở Khóa →
        </button>
      </div>
    `).join("");
};

window.openSavedItem = function(code, step) {
  const found = window.loadStore("wm_saved_prod", []).find(x => x.code === code);
  if (!found) return;
  window.saveStore("wm_draft_prod", found);
  window.renderPackageUI(found);
  window.switchTab("b2c");
  window.goToStep(step);
};

window.renderB2BTab = function() {
  document.getElementById("b2bInventoryList").innerHTML = window.HOTELS_DB.map(h => `
    <div class="bg-slate-900/90 rounded-2xl border border-white/10 overflow-hidden hover:border-teal-500/30 transition text-xs shadow-xl flex flex-col justify-between">
      <div class="relative h-44 overflow-hidden">
        <img src="${h.img}" alt="${h.name}" class="w-full h-full object-cover" />
        <span class="absolute top-2.5 left-2.5 px-2.5 py-1 rounded-full bg-slate-950/80 text-amber-400 font-bold backdrop-blur-md">
          ★ ${h.rating} (${h.reviews_count} đánh giá)
        </span>
        <span class="absolute top-2.5 right-2.5 px-2 py-0.5 rounded bg-teal-500/20 text-teal-300 font-mono font-bold backdrop-blur-md">
          ${h.sla}
        </span>
      </div>
      <div class="p-4 space-y-3">
        <div>
          <span class="text-teal-400 font-extrabold uppercase text-[10px] tracking-wider">${h.city}</span>
          <h4 class="font-extrabold text-white text-sm mt-0.5">${h.name}</h4>
          <p class="text-slate-400 text-[11px] mt-0.5">${h.room_type}</p>
        </div>
        <div class="pt-2 border-t border-white/10 flex justify-between items-end">
          <div>
            <span class="line-through text-slate-400 block text-[11px]">${window.formatVND(h.retail_night)}/đêm</span>
            <span class="text-slate-300 text-[10px]">Giá bán lẻ OTA</span>
          </div>
          <div class="text-right">
            <strong class="text-teal-300 text-sm font-extrabold block">${window.formatVND(h.night_price)}/đêm</strong>
            <span class="text-amber-400 text-[10px] font-bold">Giá B2B Phút Chót</span>
          </div>
        </div>
      </div>
    </div>
  `).join("");
};

// ============================================================================
// 13. KHỞI TẠO HỆ THỐNG BAN ĐẦU
// ============================================================================
document.addEventListener("DOMContentLoaded", () => {
  window.applyUserSession();
  const draft = window.loadStore("wm_draft_prod", null) || window.runBlindTravelEngine(false);
  window.saveStore("wm_draft_prod", draft);
  window.renderPackageUI(draft);
});
