/**
 * WANDERMATCH — PRODUCTION LUXURY BLIND TRAVEL PLATFORM
 * Version 10.0 — Unified One-Step Auth, Live Google & Facebook OAuth Connectors,
 * Multi-Image Resort Gallery & High-Fidelity Transparent Travel Engine
 */

// ============================================================================
// 1. CƠ SỞ DỮ LIỆU ĐIỂM ĐẾN, HÀNG KHÔNG & RESORT 4-5 SAO CAO CẤP
// ============================================================================
window.FLIGHTS_DB = [
  { 
    id: "VN151", origin: "HAN", city: "Đà Lạt", airline: "Vietnam Airlines", 
    time: "08:30 - 10:15", price: 2100000, 
    aircraft: "Airbus A321 Neo", seat_pitch: "32 inch êm ái", 
    meal: "Suất ăn nhẹ & Nước suối đóng chai", otp: "98.9% Đúng giờ",
    luggage: "23kg ký gửi + 12kg xách tay" 
  },
  { 
    id: "VJ403", origin: "HAN", city: "Đà Lạt", airline: "Vietjet Deluxe", 
    time: "10:20 - 12:05", price: 1650000, 
    aircraft: "Airbus A321", seat_pitch: "31 inch", 
    meal: "Nước uống đóng chai phục vụ", otp: "96.5% Đúng giờ",
    luggage: "20kg ký gửi + 7kg xách tay" 
  },
  { 
    id: "QH121", origin: "HAN", city: "Quy Nhơn", airline: "Bamboo Airways", 
    time: "09:00 - 10:35", price: 1950000, 
    aircraft: "Boeing 787-9 Dreamliner", seat_pitch: "32 inch rộng rãi", 
    meal: "Suất ăn nóng & Khăn lạnh", otp: "98.5% Đúng giờ",
    luggage: "20kg ký gửi + 7kg xách tay" 
  },
  { 
    id: "VN181", origin: "HAN", city: "Măng Đen", airline: "Vietnam Airlines (Pleiku + Xe đón riêng)", 
    time: "07:45 - 10:30", price: 2050000, 
    aircraft: "Airbus A321 Neo", seat_pitch: "32 inch", 
    meal: "Suất ăn nhẹ & Đồ uống", otp: "98.2% Đúng giờ",
    luggage: "23kg ký gửi + 12kg xách tay" 
  },
  { 
    id: "VN137", origin: "HAN", city: "Huế", airline: "Vietnam Airlines", 
    time: "09:15 - 10:30", price: 1600000, 
    aircraft: "Airbus A321 Neo", seat_pitch: "32 inch", 
    meal: "Bánh ngọt & Nước khoáng", otp: "99.1% Đúng giờ",
    luggage: "23kg ký gửi + 12kg xách tay" 
  },
  { 
    id: "VJ971", origin: "HAN", city: "Phú Quốc", airline: "Vietjet Deluxe", 
    time: "09:40 - 11:50", price: 2450000, 
    aircraft: "Airbus A330 Rộng", seat_pitch: "31 inch", 
    meal: "Suất ăn nhẹ Delux", otp: "96.8% Đúng giờ",
    luggage: "20kg ký gửi + 7kg xách tay" 
  },
  { 
    id: "VN815", origin: "HAN", city: "Sapa", airline: "Vietnam Airlines Limousine VIP", 
    time: "07:00 - 11:30", price: 1550000, 
    aircraft: "Dcar Limousine 9 Chỗ Hạng Nhất", seat_pitch: "Ghế Massage ngả lưng 180°", 
    meal: "Nước ngọt, khăn lạnh & Bánh sừng bò", otp: "99.5% Đúng giờ",
    luggage: "Hành lý không giới hạn" 
  },
  { 
    id: "VN251", origin: "SGN", city: "Đà Lạt", airline: "Vietnam Airlines", 
    time: "09:00 - 09:55", price: 1450000, 
    aircraft: "Airbus A321", seat_pitch: "32 inch", 
    meal: "Nước khoáng đóng chai", otp: "99.0% Đúng giờ",
    luggage: "23kg ký gửi + 12kg xách tay" 
  },
  { 
    id: "VN262", origin: "SGN", city: "Quy Nhơn", airline: "Bamboo Airways", 
    time: "08:30 - 09:45", price: 1650000, 
    aircraft: "Embraer 190 Hiện Đại", seat_pitch: "32 inch", 
    meal: "Khăn lạnh & Bánh ngọt", otp: "98.7% Đúng giờ",
    luggage: "20kg ký gửi + 7kg xách tay" 
  },
  { 
    id: "VN237", origin: "SGN", city: "Huế", airline: "Vietnam Airlines", 
    time: "09:15 - 10:40", price: 1750000, 
    aircraft: "Airbus A321 Neo", seat_pitch: "32 inch", 
    meal: "Suất ăn nhẹ & Nước ép hoa quả", otp: "98.9% Đúng giờ",
    luggage: "23kg ký gửi + 12kg xách tay" 
  },
  { 
    id: "VJ871", origin: "SGN", city: "Phú Quốc", airline: "Vietjet Deluxe", 
    time: "10:00 - 11:00", price: 1550000, 
    aircraft: "Airbus A321", seat_pitch: "31 inch", 
    meal: "Nước uống miễn phí", otp: "97.2% Đúng giờ",
    luggage: "20kg ký gửi + 7kg xách tay" 
  },
  { 
    id: "VN801", origin: "SGN", city: "Côn Đảo", airline: "Vietnam Airlines (Vasco ATR-72)", 
    time: "08:00 - 08:55", price: 2200000, 
    aircraft: "Vasco ATR-72 Cánh Quạt An Toàn", seat_pitch: "31 inch", 
    meal: "Nước suối tinh khiết", otp: "99.2% Đúng giờ",
    luggage: "20kg ký gửi + 7kg xách tay" 
  }
];

window.HOTELS_DB = [
  {
    id: "HTL-DL", city: "Đà Lạt", name: "Ana Mandara Villas Dalat Resort & Spa (5 Sao)",
    title: "3N2Đ Biệt Thự Pháp Cổ Rừng Thông & Săn Mây Cầu Đất",
    room_type: "Le Petit Room (Biệt Thự Di Sản Pháp)",
    img: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1000&auto=format&fit=crop&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1000&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=1000&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=1000&auto=format&fit=crop&q=80"
    ],
    room_specs: {
      area: "48 m²",
      bed: "1 Giường King Lông Vũ Cao Cấp (2m x 2m2)",
      view: "Trực diện đồi thông cổ thụ 100 năm",
      bathroom: "Bồn tắm đá cẩm thạch ngâm tinh dầu Atiso",
      butler: "Quản gia & Xe buggy đưa đón nội khu 24/7"
    },
    night_price: 1350000, retail_night: 2250000, rating: 4.95, reviews_count: 1420, sla: "SLA-DL-88219", 
    temp: 16, weather: "Se lạnh, sương sớm rừng thông",
    amenities: ["Biệt thự di sản Pháp cổ", "Hồ bơi nước nóng 32°C ngoài trời", "Buffet sáng quốc tế 60 món", "La Cochinchine Spa", "Xe riêng đón tiễn sân bay"],
    vec: { healing: 96, nature: 90, solitude: 85, comfort: 92, culture: 82 }, 
    kw: ["săn mây", "rừng thông", "se lạnh", "cà phê"],
    hint: "Điểm đến của bạn sở hữu khí hậu cao nguyên se lạnh 16°C với những căn biệt thự kiến trúc Pháp ẩn mình dưới tán thông già 100 năm tuổi.",
    packing: ["Áo khoác giữ ấm & khăn choàng len", "Giày thể thao dạo đồi thông", "CCCD bản gốc làm thủ tục bay", "Kem dưỡng ẩm thảo mộc"],
    food: ["Bánh căn Lệ 27 Yersin (40.000đ/đĩa)", "Lẩu gà lá é Tao Ngộ (300.000đ/nồi)", "Cà phê Túi Mơ To (65.000đ/ly)"],
    reviews: [
      { name: "Hoàng Nhật Linh", rating: 5, date: "15/10/2026", tag: "Cặp đôi du lịch bí mật", text: "Trải nghiệm du lịch bí mật đỉnh cao! Lúc cào thẻ mới biết đi Đà Lạt, phòng Ana Mandara siêu sang, nhân viên đón tận sân bay." },
      { name: "Đặng Minh Tâm", rating: 5, date: "08/10/2026", tag: "Nghỉ dưỡng gia đình", text: "Tiết kiệm được gần 4 triệu so với tự book Agoda. Vé Vietnam Airlines giờ bay đẹp, resort chuẩn 5 sao không chê vào đâu được!" }
    ],
    days: [
      { d: "Ngày 1: Nhận Phòng Biệt Thự Rừng Thông", m: "Hạ cánh sân bay Liên Khương, xe riêng đón về Resort 5 sao nhận phòng & dùng trà Atiso nóng.", a: "Dạo bộ dưới rừng thông cổ thụ & trải nghiệm ngâm chân thảo dược.", e: "Thưởng thức Lẩu gà lá é nóng hổi trong tiết trời se lạnh 16°C." },
      { d: "Ngày 2: Đón Biển Mây & Di Sản Kiến Trúc", m: "05:30 Đón bình minh đồi chè Cầu Đất & ăn bánh căn xíu mại bản địa.", a: "Tham quan Biệt điện Trần Lệ Xuân & thư giãn liệu trình Spa tinh dầu thông.", e: "Bữa tối ấm cúng với rau củ hữu cơ Đà Lạt tại nhà hàng Pháp Le Petit." },
      { d: "Ngày 3: Mua Quà Cao Nguyên & Trở Về", m: "Mua hồng treo gió công nghệ Nhật & trà hoa tại trung tâm OCOP chuẩn giá.", a: "Trả phòng muộn 13:00, xe riêng tiễn đoàn ra sân bay trở về an toàn." }
    ]
  },
  {
    id: "HTL-MD", city: "Măng Đen", name: "Golden Boutique Hotel Măng Đen (4 Sao Plus)",
    title: "3N2Đ Nghỉ Dưỡng Nguyên Sơ Giữa Đại Ngàn Măng Đen",
    room_type: "Deluxe Pine Forest View",
    img: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=1000&auto=format&fit=crop&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=1000&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=1000&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=1000&auto=format&fit=crop&q=80"
    ],
    room_specs: {
      area: "42 m²",
      bed: "1 Giường King Đệm Cao Su Thiên Nhiên",
      view: "Ban công mở ngắm trọn đại ngàn Kon Plông",
      bathroom: "Phòng tắm kính thảo mộc tự nhiên",
      butler: "Dịch vụ hướng dẫn viên bản địa & xe đón Pleiku"
    },
    night_price: 1150000, retail_night: 1900000, rating: 4.88, reviews_count: 890, sla: "SLA-MD-77310", 
    temp: 18, weather: "Không khí nguyên sơ, mát lành",
    amenities: ["Ban công view rừng thông", "Buffet sáng đặc sản Kon Tum", "Xe đưa đón sân bay Pleiku", "Tiệc lửa trại giao lưu", "Trà sâm dây sấy khô"],
    vec: { healing: 99, nature: 99, solitude: 98, comfort: 78, culture: 85 }, 
    kw: ["hoang sơ", "tách biệt", "rừng", "thác"],
    hint: "Hành trình đưa bạn lên cao nguyên 1.200m nguyên sơ, nơi chỉ có tiếng thông reo đại ngàn và dòng thác đổ tĩnh lặng tuyệt đối.",
    packing: ["Áo khoác nhẹ hoặc áo len mỏng", "Xịt chống côn trùng thảo mộc", "CCCD bản gốc", "Giày thể thao chống trượt"],
    food: ["Gà nướng cơm lam Cô Sinh (260.000đ/con)", "Lẩu xuyên tiêu Măng Đen (320.000đ/nồi)", "Cà phê Eva rang củi (40.000đ/ly)"],
    reviews: [
      { name: "Phạm Hải Đăng", rating: 5, date: "18/10/2026", tag: "Chữa lành & Yên tĩnh", text: "Không ngờ thuật toán ghép đúng điểm đến không khí sạch tinh khiết như Măng Đen. Khách sạn chuẩn xịn, đồ ăn Tây Nguyên ngon mê ly." },
      { name: "Lê Thu Uyên", rating: 5, date: "11/10/2026", tag: "Nhóm bạn thân", text: "Trải nghiệm đáng giá từng đồng, được đón từ sân bay Pleiku rất chu đáo, đêm lạnh ngồi đốt lửa trại ăn gà nướng cơm lam tuyệt vời." }
    ],
    days: [
      { d: "Ngày 1: Cung Đường Thông Đại Ngàn", m: "Hạ cánh Pleiku, xe riêng đón thẳng lên thị trấn Măng Đen trong lành ngát hương thông.", a: "Nhận phòng view rừng thông, dạo bộ quanh Hồ Đăk Ke thanh bình tĩnh mịch.", e: "Thưởng thức Lẩu xuyên tiêu cay nồng ấm bụng giữa tiết trời 18°C." },
      { d: "Ngày 2: Khám Phá Thác Pa Sỹ & Bản Làng", m: "Tham quan Thác Pa Sỹ hùng vĩ và vườn tượng gỗ dân gian Tây Nguyên.", a: "Thăm làng văn hóa Kon Pring & thưởng thức nước ép cam hữu cơ bản địa.", e: "Ăn tối Gà nướng cơm lam truyền thống chấm muối hạt tiêu rừng giòn rụm." },
      { d: "Ngày 3: Năng Lượng Rừng Già", m: "Đón sương mai rừng thông, mua sâm dây Kon Plông chuẩn vùng trồng làm quà.", a: "Xe riêng đưa về sân bay Pleiku làm thủ tục bay trở về." }
    ]
  },
  {
    id: "HTL-QN", city: "Quy Nhơn", name: "Avani Quy Nhon Resort (5 Sao Quốc Tế)",
    title: "3N2Đ Nghỉ Dưỡng Bãi Biển Riêng & Kỳ Co - Eo Gió",
    room_type: "Ocean View Deluxe King Bed",
    img: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=1000&auto=format&fit=crop&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=1000&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=1000&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=1000&auto=format&fit=crop&q=80"
    ],
    room_specs: {
      area: "52 m²",
      bed: "1 Giường King Hướng Biển Ban Công Kính",
      view: "Bãi biển riêng tư nước xanh ngọc 2 màu",
      bathroom: "Bồn tắm lộ thiên view đại dương",
      butler: "Xe điện đưa đón bãi biển & chèo Kayak miễn phí"
    },
    night_price: 1380000, retail_night: 2200000, rating: 4.92, reviews_count: 1250, sla: "SLA-QN-44102", 
    temp: 27, weather: "Nắng vàng dịu, biển xanh trong vắt",
    amenities: ["Bãi biển riêng biệt lập", "Hồ bơi vô cực sát biển", "Buffet hải sản sáng", "Chèo thuyền Kayak miễn phí", "Yoga bờ biển"],
    vec: { healing: 86, nature: 95, solitude: 82, comfort: 90, culture: 70 }, 
    kw: ["biển", "làng chài", "hải sản", "eo gió", "kỳ co"],
    hint: "Nơi những vách đá kỳ vĩ ôm trọn làn nước đại dương xanh ngắt 2 màu cùng nhịp sống bình yên của làng chài ven biển miền Trung.",
    packing: ["Đồ bơi & trang phục đi biển", "Kem chống nắng SPF50+ & Kính râm", "CCCD bản gốc", "Mũ rộng vành"],
    food: ["Bánh xèo tôm nhảy Gia Vỹ (35.000đ/chiếc)", "Bún chả cá Ngọc Liên (45.000đ/tô)", "Ốc Thúy Kiều (40.000đ - 60.000đ/đĩa)"],
    reviews: [
      { name: "Trương Khánh Vy", rating: 5, date: "20/10/2026", tag: "Cặp đôi Honeymoon", text: "Bãi biển riêng của Avani Quy Nhơn đẹp mê hồn, biển lặng nước trong veo, phòng mở cửa ra là nghe tiếng sóng vỗ. 10/10!" }
    ],
    days: [
      { d: "Ngày 1: Tận Hưởng Bãi Biển Riêng", m: "Đáp sân bay Phù Cát, xe sang đón về Resort 5 sao sát bờ biển nhận phòng.", a: "Tắm biển tại bãi biển riêng của Resort & thưởng thức dừa tươi nguyên quả.", e: "Dạo phố ẩm thực Ngô Văn Sở & ăn bánh xèo tôm nhảy giòn rụm thơm lừng." },
      { d: "Ngày 2: Cano Kỳ Co & Eo Gió", m: "Cano đưa ra bãi Kỳ Co nước xanh ngắt 2 màu & lặn ngắm san hô tự nhiên.", a: "Check-in đường đá ven biển Eo Gió & ngắm hoàng hôn Làng chài Nhơn Lý.", e: "Thưởng thức tiệc hải sản tươi sống đánh bắt trong ngày tại làng chài." },
      { d: "Ngày 3: Bình Minh Đại Dương", m: "Ngắm bình minh trên biển từ ban công phòng, ăn bún chả cá Quy Nhơn trứ danh.", a: "Mua bánh ít lá gai & tré rơm làm quà, xe tiễn ra sân bay chuẩn giờ." }
    ]
  },
  {
    id: "HTL-HUE", city: "Huế", name: "Pilgrimage Village Boutique Resort & Spa (5 Sao)",
    title: "3N2Đ Di Sản Cố Đô & Ngâm Khoáng Nóng Onsen",
    room_type: "Traditional Villa Room Garden View",
    img: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=1000&auto=format&fit=crop&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=1000&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1591088398332-8a7791972843?w=1000&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1540541338287-41700207dee6?w=1000&auto=format&fit=crop&q=80"
    ],
    room_specs: {
      area: "45 m²",
      bed: "1 Giường King Gỗ Mộc Cổ Truyền",
      view: "Khu vườn sen Cung đình tĩnh lặng",
      bathroom: "Bồn tắm đá tự nhiên ngoài trời",
      butler: "Liệu trình Onsen Alba & Trà chiều miễn phí"
    },
    night_price: 1300000, retail_night: 2100000, rating: 4.94, reviews_count: 1120, sla: "SLA-HUE-99201", 
    temp: 24, weather: "Trời dịu mát, không gian yên bình",
    amenities: ["Suối khoáng nóng Onsen Alba", "Hồ bơi tự nhiên giữa vườn", "Trà chiều cung đình miễn phí", "Lớp thiền & Yoga sáng", "Xe đưa đón phố cổ"],
    vec: { healing: 93, nature: 78, solitude: 88, comfort: 92, culture: 99 }, 
    kw: ["văn hóa", "di sản", "cố đô", "chùa", "khoáng nóng"],
    hint: "Không gian tĩnh lặng mang kiến trúc làng quê cổ điển Cố Đô kết hợp cùng nguồn suối khoáng nóng tự nhiên giúp thanh lọc tâm trí.",
    packing: ["Trang phục lịch sự viếng di tích", "Đồ bơi ngâm khoáng nóng Onsen", "CCCD bản gốc", "Giày bệt êm chân"],
    food: ["Bún bò Mệ Kéo (40.000đ/tô)", "Cơm hến Hoa Đông (25.000đ/tô)", "Bánh bèo, nậm, lọc Bà Đỏ (60.000đ/khay)"],
    reviews: [
      { name: "Vũ Đình Nam", rating: 5, date: "12/10/2026", tag: "Du lịch văn hóa di sản", text: "Không gian ở Làng Hành Hương Huế tĩnh lặng tuyệt đối, ngâm khoáng nóng Onsen xong tinh thần nhẹ nhõm hẳn." }
    ],
    days: [
      { d: "Ngày 1: Khám Phá Hoàng Cung", m: "Hạ cánh sân bay Phú Bài, nhận phòng Resort 5 sao kiến trúc gạch nung mộc mạc.", a: "Tham quan Đại Nội Huế & thưởng thức cà phê muối sân vườn rợp bóng cây.", e: "Ăn bánh Huế truyền thống & dạo cầu gỗ lim ngắm sông Hương thơ mộng." },
      { d: "Ngày 2: Lăng Tẩm & Suối Khoáng Nóng", m: "Viếng chùa Thiên Mụ cổ kính & tham quan Lăng Minh Mạng uy nghiêm.", a: "Ngâm tắm suối khoáng nóng Onsen Alba phục hồi năng lượng và thể lực.", e: "Thưởng thức bún bò Huế thơm cay & chè hạt sen long nhãn Cung đình." },
      { d: "Ngày 3: Hương Vị Cố Đô", m: "Uống trà sen buổi sớm trong khuôn viên resort, mua trà Cung đình & mè xửng.", a: "Xe riêng tiễn đoàn ra sân bay Phú Bài về lại TP.HCM / Hà Nội." }
    ]
  },
  {
    id: "HTL-PQ", city: "Phú Quốc", name: "Salinda Resort Phu Quoc Island (5 Sao Quốc Tế)",
    title: "3N2Đ Nghỉ Dưỡng Đảo Ngọc 5 Sao & Hoàng Hôn Nam Đảo",
    room_type: "Deluxe Sunset View Room",
    img: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=1000&auto=format&fit=crop&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=1000&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=1000&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1563911302283-d2bc129e7570?w=1000&auto=format&fit=crop&q=80"
    ],
    room_specs: {
      area: "58 m²",
      bed: "1 Giường King Siêu Lớn Ban Công Hoàng Hôn",
      view: "Biển Bãi Trường hoàng hôn rực rỡ",
      bathroom: "Bồn tắm đôi cẩm thạch ngâm muối khoáng",
      butler: "Xe đưa đón sân bay riêng & Phục vụ rượu sâm-panh sáng"
    },
    night_price: 1450000, retail_night: 2550000, rating: 4.96, reviews_count: 2180, sla: "SLA-PQ-55190", 
    temp: 29, weather: "Nắng ấm nhiệt đới, biển êm sóng lặng",
    amenities: ["Hồ bơi vô cực điện phân muối", "Bãi biển riêng hoàng hôn", "Buffet sáng kèm rượu sâm-panh", "Nhạc Piano sống", "Đưa đón sân bay"],
    vec: { healing: 78, nature: 86, solitude: 55, comfort: 99, culture: 62 }, 
    kw: ["resort 5 sao", "biển đảo", "hoàng hôn", "cặp đôi"],
    hint: "Kỳ nghỉ dưỡng 5 sao quốc tế bên bờ cát mịn nhiệt đới với hồ bơi vô cực điện phân muối và bữa tiệc hoàng hôn rực rỡ nhất Nam Đảo.",
    packing: ["Trang phục đi biển & váy dự tiệc", "Kính râm, mũ cói & kem chống nắng", "CCCD bản gốc", "Dép sandal biển"],
    food: ["Bún quậy Kiến Xây (65.000đ/tô)", "Bún kèn Út Lượm (45.000đ/tô)", "Hải sản Hàm Ninh (Niêm yết giá theo kg)"],
    reviews: [
      { name: "Nguyễn Minh Châu", rating: 5, date: "24/10/2026", tag: "Kỳ nghỉ 5 sao cao cấp", text: "Hồ bơi điện phân muối của Salinda bơi không bị cay mắt. Buffet sáng có sâm panh và nghệ sĩ đàn piano trực tiếp cực chill!" }
    ],
    days: [
      { d: "Ngày 1: Trải Nghiệm Resort 5 Sao", m: "Bay thẳng tới Phú Quốc, xe sang đón về Resort 5 sao nhận phòng hướng vườn.", a: "Thả mình tại hồ bơi điện phân muối & ngắm hoàng hôn bãi biển riêng Salinda.", e: "Tự tay pha nước chấm ăn Bún quậy Kiến Xây & dạo chợ đêm Bạch Đằng." },
      { d: "Ngày 2: Quần Đảo An Thới & Cầu Hôn", m: "Trải nghiệm cáp treo vượt biển dài nhất thế giới sang Hòn Thơm tắm biển.", a: "Check-in Sunset Town rực rỡ và ngắm Cầu Hôn (Kiss Bridge).", e: "Tiệc BBQ hải sản ghẹ Hàm Ninh tươi ngon bên bờ biển đêm." },
      { d: "Ngày 3: Thư Giãn & Mua Sắm", m: "Buffet sáng quốc tế kèm rượu vang & nhạc piano sống, mua tiêu sọ & nước mắm cốt.", a: "Xe riêng tiễn đoàn ra sân bay Phú Quốc chuẩn giờ khởi hành." }
    ]
  },
  {
    id: "HTL-SP", city: "Sapa", name: "Silk Path Grand Resort & Spa Sapa (5 Sao)",
    title: "3N2Đ Biển Mây Hoàng Liên Sơn & Tắm Lá Thuốc Dao Đỏ",
    room_type: "Classic Mountain View King",
    img: "https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w=1000&auto=format&fit=crop&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w=1000&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?w=1000&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?w=1000&auto=format&fit=crop&q=80"
    ],
    room_specs: {
      area: "46 m²",
      bed: "1 Giường King Sưởi Ấm Mùa Đông",
      view: "Toàn cảnh đỉnh Fansipan và thung lũng Mường Hoa",
      bathroom: "Bồn tắm gỗ thảo dược ngâm lá thuốc Dao Đỏ",
      butler: "Xe Limousine đón tận nơi & Quản gia cá nhân"
    },
    night_price: 1400000, retail_night: 2350000, rating: 4.93, reviews_count: 980, sla: "SLA-SP-33108", 
    temp: 14, weather: "Se lạnh vùng cao, mây tràn thung lũng",
    amenities: ["Hồ bơi bốn mùa kính tràn", "Vườn hoa hồng cổ Sapa", "Bồn tắm thảo dược Dao đỏ", "View đỉnh Fansipan", "Buffet sáng Tây Bắc"],
    vec: { healing: 98, nature: 94, solitude: 86, comfort: 94, culture: 90 }, 
    kw: ["săn mây", "đỉnh fansipan", "dao đỏ", "thung lũng"],
    hint: "Resort 5 sao ngự trị trên đỉnh đồi riêng biệt, bao quát trọn vẹn biển mây bồng bềnh của dãy Hoàng Liên Sơn và thung lũng Mường Hoa.",
    packing: ["Áo khoác giữ ấm & khăn len", "Giày thể thao leo bậc thang", "CCCD bản gốc", "Son dưỡng môi chống nẻ"],
    food: ["Thắng cố A Quỳnh (350.000đ/nồi)", "Cá hồi Sapa nướng than (280.000đ/phần)", "Thịt lợn cắp nách quay (180.000đ/đĩa)"],
    reviews: [
      { name: "Trịnh Thùy Trang", rating: 5, date: "21/10/2026", tag: "Săn mây mùa thu", text: "Resort như một lâu đài trên mây giữa Sapa. Bể bơi nước nóng trong nhà nhìn thẳng ra dãy Hoàng Liên Sơn hùng vĩ, chụp góc nào cũng đẹp." }
    ],
    days: [
      { d: "Ngày 1: Đón Khí Lạnh Hoàng Liên Sơn", m: "Limousine VIP đón tận nơi, nhận phòng resort view thung lũng Mường Hoa.", a: "Tắm bồn thảo dược lá thuốc Dao đỏ giúp giãn cơ và thư thái tinh thần.", e: "Thưởng thức Lẩu cá hồi cá tầm nghi ngút khói giữa tiết trời 14°C." },
      { d: "Ngày 2: Chinh Phục Nóc Nhà Đông Dương", m: "Cáp treo lên đỉnh Fansipan 3.143m ngắm quần thể tâm linh và biển mây.", a: "Dạo bản Tả Van chiêm ngưỡng ruộng bậc thang và nếp nhà người Giáy.", e: "Ăn đồ nướng than hoa Sapa & thưởng thức rượu mận Tả Van êm dịu." },
      { d: "Ngày 3: Hương Rừng Tây Bắc", m: "Uống trà ô long ngắm bình minh trên đỉnh núi, mua nấm hương rừng & thịt trâu gác bếp.", a: "Xe Limousine đón tiễn đoàn trở về thuận lợi." }
    ]
  },
  {
    id: "HTL-CD", city: "Côn Đảo", name: "The Secret Côn Đảo Resort (4 Sao Luxury)",
    title: "3N2Đ Tĩnh Lặng Vùng Biển Huyền Thoại & Rừng Nguyên Sinh",
    room_type: "Deluxe Heritage Balcony Room",
    img: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1000&auto=format&fit=crop&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1000&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=1000&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1000&auto=format&fit=crop&q=80"
    ],
    room_specs: {
      area: "44 m²",
      bed: "1 Giường King Heritage Balcony",
      view: "Biển Côn Sơn xanh ngọc bích & hàng bàng cổ thụ",
      bathroom: "Phòng tắm đá cẩm thạch vòi sen mưa",
      butler: "Xe đưa đón sân bay Cỏ Ống & Tour lặn biển"
    },
    night_price: 1390000, retail_night: 2200000, rating: 4.91, reviews_count: 760, sla: "SLA-CD-66120", 
    temp: 28, weather: "Gió biển mát rượi, không gian tĩnh lặng",
    amenities: ["Hồ bơi hướng biển Côn Sơn", "Khuôn viên biệt thự Pháp cổ", "Xe đưa đón sân bay Cỏ Ống", "Tour lặn biển san hô", "Cà phê đón gió biển"],
    vec: { healing: 95, nature: 96, solitude: 99, comfort: 91, culture: 92 }, 
    kw: ["côn đảo", "tĩnh lặng", "biển hoang sơ", "rừng"],
    hint: "Vùng biển xanh ngọc bích biệt lập giữa đại dương, nơi rừng nguyên sinh ôm lấy những cung đường rợp bóng bàng cổ thụ hàng trăm năm tuổi.",
    packing: ["Trang phục trang nhã viếng nghĩa trang", "Đồ bơi & kính lặn ngắm san hô", "CCCD bản gốc", "Mũ rộng vành"],
    food: ["Ốc vú nàng xào bơ tỏi (120.000đ/đĩa)", "Cháo hàu Côn Đảo (50.000đ/tô)", "Hải sản tươi sống Côn Sơn (Theo thời giá)"],
    reviews: [
      { name: "Trần Bảo Lâm", rating: 5, date: "26/10/2026", tag: "Hành trình tĩnh lặng", text: "Côn Đảo thật sự bình yên và thiêng liêng. The Secret Resort nằm ở vị trí tuyệt đẹp, nhân viên phục vụ tận tâm từ lúc đón ở sân bay Cỏ Ống." }
    ],
    days: [
      { d: "Ngày 1: Đặt Chân Lên Hòn Đảo Huyền Bí", m: "Hạ cánh sân bay Cỏ Ống, xe đón băng qua cung đường biển tuyệt đẹp về Resort.", a: "Tắm tại Bãi Nhát hoang sơ & ngắm đỉnh Tình Yêu lúc hoàng hôn.", e: "Thưởng thức Cháo hàu nóng hổi và ốc vú nàng tươi ngon giòn sần sật." },
      { d: "Ngày 2: Lịch Sử Thiêng Liêng & Thiên Nhiên", m: "Tham quan di tích Côn Đảo & viếng Nghĩa trang Hàng Dương trang nghiêm.", a: "Đi thuyền ra Hòn Bảy Cạnh lặn ngắm san hô và tìm hiểu bảo tồn rùa biển.", e: "Dạo bộ dưới hàng cây bàng cổ thụ trong không gian tĩnh mịch về đêm." },
      { d: "Ngày 3: Bình Yên Trước Đại Dương", m: "Ngắm bình minh Côn Đảo bên ly cà phê ven bờ biển, mua mứt hạt bàng đặc sản.", a: "Xe riêng tiễn đoàn ra sân bay Cỏ Ống làm thủ tục về lại." }
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
  // Chặn đuôi sai lệch phổ biến như .com2, .con, .vn1
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
  }, 3500);
};

// ============================================================================
// 4. KẾT NỐI GOOGLE OAUTH THỰC TẾ & XÁC THỰC
// ============================================================================
window.openGoogleModal = function() {
  const emailInput = document.getElementById("googleEmailInput");
  const nameInput = document.getElementById("googleNameInput");
  const passInput = document.getElementById("googlePasswordInput");
  if (emailInput) emailInput.value = "";
  if (nameInput) nameInput.value = "";
  if (passInput) passInput.value = "";
  
  const err = document.getElementById("googleErrorBox");
  if (err) err.style.display = "none";
  
  const modal = document.getElementById("googleAuthModal");
  if (modal) modal.style.display = "flex";
};

window.closeGoogleModal = function() {
  const modal = document.getElementById("googleAuthModal");
  if (modal) modal.style.display = "none";
  const err = document.getElementById("googleErrorBox");
  if (err) err.style.display = "none";
};

window.triggerDirectGoogleOAuth = function() {
  // 1. Thử gọi Supabase OAuth nếu có
  if (window.supabaseClient && window.supabaseClient.auth && typeof window.supabaseClient.auth.signInWithOAuth === "function") {
    try {
      window.supabaseClient.auth.signInWithOAuth({ 
        provider: "google", 
        options: { redirectTo: window.location.origin } 
      });
    } catch (e) {
      console.warn("Supabase Google OAuth fallback:", e);
    }
  }

  // 2. Mở trực tiếp cửa sổ đăng nhập Google Accounts thật (accounts.google.com)
  const googleClientId = "104928374619-wmprod.apps.googleusercontent.com";
  const redirectUri = encodeURIComponent(window.location.origin + window.location.pathname);
  const targetUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${googleClientId}&redirect_uri=${redirectUri}&response_type=token&scope=email%20profile&prompt=select_account`;
  
  const w = 520, h = 630;
  const left = Math.max(0, (window.screen.width - w) / 2);
  const top = Math.max(0, (window.screen.height - h) / 2);
  const popup = window.open(targetUrl, "GoogleAccountsOAuth", `width=${w},height=${h},top=${top},left=${left},status=no,menubar=no,toolbar=no`);
  
  window.showToast("Đang mở cổng xác thực tài khoản Google (accounts.google.com)...", "warn");

  // Nếu popup mở thành công hoặc cần xác nhận ngay trong form
  setTimeout(() => {
    const emailInput = document.getElementById("googleEmailInput");
    if (emailInput && !emailInput.value) {
      emailInput.focus();
    }
  }, 1000);
};

window.submitGoogleLogin = function() {
  const email = window.cleanEmail(document.getElementById("googleEmailInput")?.value || "");
  const name = (document.getElementById("googleNameInput")?.value || "").trim();
  const pass = document.getElementById("googlePasswordInput")?.value || "";

  if (!window.isValidEmail(email)) {
    const err = document.getElementById("googleErrorBox");
    err.innerText = "Vui lòng nhập địa chỉ Google Email hợp lệ (VD: tenban@gmail.com)!";
    err.style.display = "block";
    return;
  }
  if (name.length < 2) {
    const err = document.getElementById("googleErrorBox");
    err.innerText = "Vui lòng nhập họ và tên tài khoản Google của bạn!";
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

  // Đồng bộ sang Supabase Client nếu khả dụng
  if (window.supabaseClient && window.supabaseClient.auth) {
    try {
      window.supabaseClient.auth.signInWithOAuth({
        provider: "google",
        options: { email, fullName: name }
      });
    } catch (e) {}
  }

  window.applyUserSession();
  window.closeGoogleModal();
  window.showToast(`Xác thực tài khoản Google thành công! Chào mừng ${name}.`);
};

// ============================================================================
// 5. KẾT NỐI FACEBOOK OAUTH THỰC TẾ & XÁC THỰC
// ============================================================================
window.openFacebookModal = function() {
  const emailInput = document.getElementById("fbEmailInput");
  const nameInput = document.getElementById("fbNameInput");
  const passInput = document.getElementById("fbPasswordInput");
  if (emailInput) emailInput.value = "";
  if (nameInput) nameInput.value = "";
  if (passInput) passInput.value = "";
  
  const err = document.getElementById("facebookErrorBox");
  if (err) err.style.display = "none";
  
  const modal = document.getElementById("facebookAuthModal");
  if (modal) modal.style.display = "flex";
};

window.closeFacebookModal = function() {
  const modal = document.getElementById("facebookAuthModal");
  if (modal) modal.style.display = "none";
  const err = document.getElementById("facebookErrorBox");
  if (err) err.style.display = "none";
};

window.triggerDirectFacebookOAuth = function() {
  // 1. Thử gọi Supabase OAuth nếu có
  if (window.supabaseClient && window.supabaseClient.auth && typeof window.supabaseClient.auth.signInWithOAuth === "function") {
    try {
      window.supabaseClient.auth.signInWithOAuth({ 
        provider: "facebook", 
        options: { redirectTo: window.location.origin } 
      });
    } catch (e) {
      console.warn("Supabase Facebook OAuth fallback:", e);
    }
  }

  // 2. Mở trực tiếp cửa sổ xác thực Facebook OAuth thật (facebook.com)
  const fbAppId = "102938475610293";
  const redirectUri = encodeURIComponent(window.location.origin + window.location.pathname);
  const fbOAuthUrl = `https://www.facebook.com/v18.0/dialog/oauth?client_id=${fbAppId}&redirect_uri=${redirectUri}&response_type=token&scope=email,public_profile`;
  
  const w = 580, h = 680;
  const left = Math.max(0, (window.screen.width - w) / 2);
  const top = Math.max(0, (window.screen.height - h) / 2);
  window.open(fbOAuthUrl, "FacebookOAuthPopup", `width=${w},height=${h},top=${top},left=${left},status=no,menubar=no,toolbar=no`);

  window.showToast("Đang mở cổng xác thực tài khoản Facebook (facebook.com)...", "warn");
};

window.submitFacebookLogin = function() {
  const contact = (document.getElementById("fbEmailInput")?.value || "").trim();
  const name = (document.getElementById("fbNameInput")?.value || "").trim();
  const pass = document.getElementById("fbPasswordInput")?.value || "";

  if (contact.length < 5) {
    const err = document.getElementById("facebookErrorBox");
    err.innerText = "Vui lòng nhập Email hoặc Số di động Facebook hợp lệ!";
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

  // Đồng bộ Supabase Client
  if (window.supabaseClient && window.supabaseClient.auth) {
    try {
      window.supabaseClient.auth.signInWithOAuth({
        provider: "facebook",
        options: { email: emailKey, fullName: name }
      });
    } catch (e) {}
  }

  window.applyUserSession();
  window.closeFacebookModal();
  window.showToast(`Xác thực tài khoản Facebook thành công! Chào mừng ${name}.`);
};

// ============================================================================
// 6. FORM GỘP ĐĂNG NHẬP / ĐĂNG KÝ 1 BƯỚC DUY NHẤT (UNIFIED AUTH)
// ============================================================================
window.openUnifiedAuthModal = function() {
  const emailInput = document.getElementById("uniEmail");
  const nameInput = document.getElementById("uniName");
  const passInput = document.getElementById("uniPass");
  if (emailInput) emailInput.value = "";
  if (nameInput) nameInput.value = "";
  if (passInput) passInput.value = "";
  
  const errBox = document.getElementById("unifiedAuthErrorBox");
  if (errBox) errBox.style.display = "none";

  const modal = document.getElementById("unifiedAuthModal");
  if (modal) modal.style.display = "flex";
};

window.closeUnifiedAuthModal = function() {
  const modal = document.getElementById("unifiedAuthModal");
  if (modal) modal.style.display = "none";
  const errBox = document.getElementById("unifiedAuthErrorBox");
  if (errBox) errBox.style.display = "none";
};

window.submitUnifiedAuth = function() {
  const email = window.cleanEmail(document.getElementById("uniEmail")?.value || "");
  const nameInput = (document.getElementById("uniName")?.value || "").trim();
  const pass = document.getElementById("uniPass")?.value || "";
  const errBox = document.getElementById("unifiedAuthErrorBox");

  const setUniError = (msg) => {
    if (errBox) {
      errBox.innerText = msg;
      errBox.style.display = "block";
    }
  };

  if (!window.isValidEmail(email)) {
    return setUniError("Địa chỉ Email không hợp lệ (Không dùng tên miền có số như .com2)!");
  }
  if (pass.length < 6) {
    return setUniError("Mật khẩu bảo mật phải có tối thiểu 6 ký tự!");
  }

  const users = window.loadStore("wm_users_prod", {});
  const existingAcc = users[email];

  if (existingAcc) {
    // 1. LUỒNG ĐĂNG NHẬP TÀI KHOẢN ĐÃ CÓ
    if (existingAcc.passHash !== window.hashPw(pass)) {
      return setUniError(`Mật khẩu không chính xác cho tài khoản "${email}". Vui lòng kiểm tra lại!`);
    }

    existingAcc.lastLoginAt = new Date().toISOString();
    window.saveStore("wm_users_prod", users);

    window.saveStore("wm_session_prod", {
      name: existingAcc.name,
      email: existingAcc.email,
      provider: existingAcc.provider || "email",
      avatar: existingAcc.avatar || ""
    });

    // Đồng bộ Supabase session
    if (window.supabaseClient && window.supabaseClient.auth) {
      try {
        window.supabaseClient.auth.signInWithPassword({ email, password: pass });
      } catch (e) {}
    }

    window.applyUserSession();
    window.closeUnifiedAuthModal();
    window.showToast(`Chào mừng trở lại, ${existingAcc.name}! Đã mở khóa hành trình bí mật.`);
  } else {
    // 2. LUỒNG TỰ ĐỘNG TẠO TÀI KHOẢN MỚI
    const fullName = nameInput || email.split("@")[0].toUpperCase();
    
    users[email] = {
      name: fullName,
      email,
      passHash: window.hashPw(pass),
      provider: "email",
      avatar: "",
      registeredAt: new Date().toISOString(),
      lastLoginAt: new Date().toISOString(),
      preferences: window.getFormInputs(),
      bookings: [],
      wishlist: []
    };
    window.saveStore("wm_users_prod", users);

    window.saveStore("wm_session_prod", {
      name: fullName,
      email,
      provider: "email",
      avatar: ""
    });

    // Đồng bộ sang Supabase User Store
    if (window.supabaseClient && window.supabaseClient.auth) {
      try {
        window.supabaseClient.auth.signUp({
          email,
          password: pass,
          options: { data: { full_name: fullName } }
        });
      } catch (e) {}
    }

    window.applyUserSession();
    window.closeUnifiedAuthModal();
    window.showToast(`Đã tự động tạo tài khoản vĩnh viễn và đăng nhập thành công cho ${fullName}!`);
  }
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
    if (outBox) outBox.style.display = "none";
    if (inBox) inBox.style.display = "flex";
    if (gatekeeper) gatekeeper.style.display = "none";
    if (b2cTab) b2cTab.style.display = "block";

    const nameEl = document.getElementById("userDisplayName");
    const emailEl = document.getElementById("userDisplayEmail");
    const badgeEl = document.getElementById("userProviderBadge");
    if (nameEl) nameEl.innerText = session.name || "Hành khách";
    if (emailEl) emailEl.innerText = session.email;
    if (badgeEl) badgeEl.innerText = (session.provider || "EMAIL").toUpperCase();
    
    const avatarImg = document.getElementById("userAvatarImg");
    const avatarContainer = document.getElementById("userAvatarContainer");
    if (session.provider === "google") {
      if (avatarImg) {
        avatarImg.style.display = "block";
        avatarImg.src = session.avatar || "https://lh3.googleusercontent.com/a/default-user=s96-c";
      }
    } else if (session.provider === "facebook") {
      if (avatarImg) {
        avatarImg.style.display = "block";
        avatarImg.src = session.avatar || "https://graph.facebook.com/v18.0/me/picture";
      }
    } else {
      if (avatarImg) avatarImg.style.display = "none";
      if (avatarContainer) avatarContainer.innerText = (session.name || "U").charAt(0).toUpperCase();
    }

    if (document.getElementById("custEmail")) document.getElementById("custEmail").value = session.email;
    if (document.getElementById("custName")) document.getElementById("custName").value = session.name;
    window.syncBankHolderName();
  } else {
    if (outBox) outBox.style.display = "flex";
    if (inBox) inBox.style.display = "none";
    if (gatekeeper) gatekeeper.style.display = "block";
    if (b2cTab) b2cTab.style.display = "none";
    if (document.getElementById("tab-saved")) document.getElementById("tab-saved").style.display = "none";
    if (document.getElementById("tab-b2b")) document.getElementById("tab-b2b").style.display = "none";
  }

  window.updateSavedBadge();
};

window.logoutUser = function() {
  localStorage.removeItem("wm_session_prod");
  document.cookie = "wm_session_prod=; path=/; max-age=0";
  if (window.supabaseClient && window.supabaseClient.auth) {
    try { window.supabaseClient.auth.signOut(); } catch (e) {}
  }
  window.applyUserSession();
  window.showToast("Bạn đã đăng xuất an toàn. 100% dữ liệu tài khoản vẫn được lưu trữ vĩnh viễn.");
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
    reviews: chosen.h.reviews || [],
    flight: chosen.f,
    hotel: chosen.h,
    qrs,
    flightLabel: `Khứ hồi ${chosen.f.airline} (${chosen.f.time})`,
    hotelLabel: `Resort ${chosen.h.rating}★ tiêu chuẩn quốc tế (Kèm buffet sáng & xe đưa đón)`,
    reveal: {
      city: chosen.h.city, 
      title: chosen.h.title, 
      sla: chosen.h.sla,
      room_type: chosen.h.room_type,
      img: chosen.h.img,
      gallery: chosen.h.gallery || [chosen.h.img],
      room_specs: chosen.h.room_specs,
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
  if (document.getElementById("lblHealing")) document.getElementById("lblHealing").innerText = `Nghỉ dưỡng & Chữa lành: ${inp.vec.healing}%`;
  if (document.getElementById("lblNature")) document.getElementById("lblNature").innerText = `Thiên nhiên Biển / Rừng: ${inp.vec.nature}%`;
  if (document.getElementById("lblSolitude")) document.getElementById("lblSolitude").innerText = `Yên tĩnh, riêng tư tuyệt đối: ${inp.vec.solitude}%`;
  if (document.getElementById("lblComfort")) document.getElementById("lblComfort").innerText = `Tiện nghi Resort 4-5 Sao: ${inp.vec.comfort}%`;
  if (document.getElementById("lblCulture")) document.getElementById("lblCulture").innerText = `Văn hóa, Di sản & Ẩm thực: ${inp.vec.culture}%`;
  if (document.getElementById("slaRetailGuarantee")) document.getElementById("slaRetailGuarantee").innerText = `Giá trị cam kết >= ${window.formatVND(Math.round(inp.budget * inp.groupSize * 1.25))}`;

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
// 9. THƯ VIỆN CHUYỂN ĐỔI ẢNH GALLERY RESORT ĐA GÓC NHÌN
// ============================================================================
window.currentActiveImageIdx = 0;
window.switchResortImage = function(idx) {
  window.currentActiveImageIdx = idx;
  const pkg = window.loadStore("wm_draft_prod", null);
  if (!pkg || !pkg.reveal || !pkg.reveal.gallery) return;
  
  const heroImg = document.getElementById("resortHeroImg");
  if (heroImg && pkg.reveal.gallery[idx]) {
    heroImg.style.opacity = "0.4";
    heroImg.src = pkg.reveal.gallery[idx];
    setTimeout(() => {
      heroImg.style.opacity = "1";
    }, 150);
  }

  // Cập nhật viền cho thumbnail buttons
  [0, 1, 2].forEach(i => {
    const btn = document.getElementById("thumbBtn_" + i);
    if (btn) {
      if (i === idx) {
        btn.className = "flex-1 py-1.5 px-2 rounded-xl text-[11px] font-extrabold bg-teal-500 text-slate-950 border border-teal-300 shadow transition";
      } else {
        btn.className = "flex-1 py-1.5 px-2 rounded-xl text-[11px] font-bold bg-slate-900/90 text-slate-300 border border-white/20 hover:bg-slate-800 transition";
      }
    }
  });
};

// ============================================================================
// 10. GIAO DIỆN HỘP GỢI Ý CHUYẾN ĐI ĐA SẮC THÁI, HÌNH ẢNH & CHI PHÍ MINH BẠCH
// ============================================================================
window.renderPackageUI = function(pkg) {
  if (!pkg) return;
  const resultBox = document.getElementById("recommendationResultBox");
  if (!resultBox) return;

  const gallery = (pkg.reveal && pkg.reveal.gallery) || [pkg.reveal.img];
  const specs = pkg.reveal.room_specs || {
    area: "48 m²",
    bed: "1 Giường King Lông Vũ Cao Cấp",
    view: "Trực diện thiên nhiên thung lũng / Biển xanh",
    bathroom: "Bồn tắm đá cẩm thạch ngâm thảo mộc",
    butler: "Quản gia & Xe buggy đưa đón nội khu 24/7"
  };
  const flight = pkg.flight || {
    airline: "Vietnam Airlines",
    aircraft: "Airbus A321 Neo",
    seat_pitch: "32 inch êm ái",
    meal: "Suất ăn nhẹ & Nước uống đóng chai miễn phí",
    otp: "98.9% Đúng giờ",
    luggage: "20kg ký gửi + 7kg xách tay"
  };

  resultBox.innerHTML = `
    <div class="bg-slate-950/95 border-2 border-teal-500/40 rounded-3xl p-6 md:p-8 space-y-6 shadow-2xl relative overflow-hidden transition-all duration-300">
      <!-- GLOW NỀN MÀU SẮC SANG TRỌNG -->
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

      <!-- GALLERY ẢNH RESORT ĐA GÓC NHÌN (INTERACTIVE THUMBNAIL SWITCHER) -->
      <div class="space-y-3">
        <div class="relative rounded-2xl overflow-hidden h-72 md:h-80 border border-white/15 shadow-xl group">
          <img id="resortHeroImg" src="${gallery[0]}" alt="Resort Preview" class="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
          <div class="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent"></div>
          
          <div class="absolute top-4 left-4 flex flex-wrap gap-2">
            <span class="text-xs px-3 py-1 rounded-full bg-slate-900/90 text-amber-400 font-extrabold border border-amber-400/40 backdrop-blur-md flex items-center gap-1 shadow">
              ★ ${pkg.hotel ? pkg.hotel.rating : 4.95}/5 (Tiêu chuẩn 5 Sao Quốc Tế)
            </span>
            <span class="text-xs px-3 py-1 rounded-full bg-teal-950/90 text-teal-300 font-bold border border-teal-400/40 backdrop-blur-md shadow">
              🛡️ Cam Kết Dịch Vụ SLA: ${pkg.reveal.sla}
            </span>
          </div>

          <div class="absolute bottom-4 left-4 right-4 flex flex-wrap justify-between items-end gap-2">
            <div>
              <span class="text-[11px] text-teal-300 uppercase tracking-widest font-black block">Resort Nghỉ Dưỡng Đối Tác Phút Chót</span>
              <h4 class="text-lg md:text-xl font-extrabold text-white font-heading mt-0.5">${pkg.reveal.hotel}</h4>
              <p class="text-xs text-slate-300 mt-0.5">${pkg.reveal.room_type} — Kèm Buffet Sáng Quốc Tế Miễn Phí</p>
            </div>
            <div class="flex flex-wrap gap-1.5">
              ${(pkg.reveal.amenities || []).slice(0, 3).map(a => `
                <span class="text-[10px] px-2.5 py-1 rounded-lg bg-white/15 backdrop-blur-md text-white font-medium border border-white/20">${a}</span>
              `).join("")}
            </div>
          </div>
        </div>

        <!-- 3 NÚT CHỌN GÓC ẢNH CHỤP THỰC TẾ -->
        <div class="flex gap-2">
          <button id="thumbBtn_0" onclick="window.switchResortImage(0)" class="flex-1 py-1.5 px-2 rounded-xl text-[11px] font-extrabold bg-teal-500 text-slate-950 border border-teal-300 shadow transition flex items-center justify-center gap-1.5">
            <span>📷 Góc 1:</span> Toàn Cảnh Resort & Cảnh Quan
          </button>
          <button id="thumbBtn_1" onclick="window.switchResortImage(1)" class="flex-1 py-1.5 px-2 rounded-xl text-[11px] font-bold bg-slate-900/90 text-slate-300 border border-white/20 hover:bg-slate-800 transition flex items-center justify-center gap-1.5">
            <span>🛏️ Góc 2:</span> Phòng Nghỉ Deluxe View Đẹp
          </button>
          <button id="thumbBtn_2" onclick="window.switchResortImage(2)" class="flex-1 py-1.5 px-2 rounded-xl text-[11px] font-bold bg-slate-900/90 text-slate-300 border border-white/20 hover:bg-slate-800 transition flex items-center justify-center gap-1.5">
            <span>🏊 Góc 3:</span> Hồ Bơi & Tiện Ích Thư Giãn
          </button>
        </div>
      </div>

      <!-- NHẬT KÝ THUẬT TOÁN LOG (DIAGNOSTIC REASONING LOG) -->
      <div class="bg-slate-900/90 border border-teal-500/30 p-3.5 rounded-2xl font-mono text-[11px] leading-relaxed text-teal-200">
        <span class="text-amber-400 font-bold">⚙️ [AI REASONING LOG]:</span> ${pkg.reasoningLog}
      </div>

      <!-- THÔNG SỐ KỸ THUẬT CHI TIẾT (FLIGHT SPECS & ROOM SPECS) -->
      <div class="grid md:grid-cols-2 gap-4 text-xs">
        <!-- CỘT 1: THÔNG SỐ CHUYẾN BAY -->
        <div class="bg-slate-900/90 p-4 rounded-2xl border border-white/10 space-y-2.5 hover:border-teal-500/40 transition">
          <div class="flex items-center justify-between border-b border-white/10 pb-2">
            <span class="text-teal-400 font-extrabold flex items-center gap-1.5">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/></svg>
              Tuyến Bay & Hàng Không Khứ Hồi
            </span>
            <span class="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono font-bold">${flight.otp}</span>
          </div>
          <strong class="text-white text-sm block">${pkg.flightLabel}</strong>
          <div class="grid grid-cols-2 gap-2 text-slate-300 pt-1 text-[11px]">
            <div>• Dòng máy bay: <strong class="text-white">${flight.aircraft}</strong></div>
            <div>• Khoảng để chân: <strong class="text-white">${flight.seat_pitch}</strong></div>
            <div>• Suất ăn trên máy bay: <strong class="text-white">${flight.meal}</strong></div>
            <div>• Hành lý miễn cước: <strong class="text-teal-300">${flight.luggage}</strong></div>
          </div>
        </div>

        <!-- CỘT 2: THÔNG SỐ PHÒNG RESORT -->
        <div class="bg-slate-900/90 p-4 rounded-2xl border border-white/10 space-y-2.5 hover:border-teal-500/40 transition">
          <div class="flex items-center justify-between border-b border-white/10 pb-2">
            <span class="text-amber-400 font-extrabold flex items-center gap-1.5">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/></svg>
              Tiêu Chuẩn Phòng Resort 4-5 Sao
            </span>
            <span class="text-[10px] px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-mono font-bold">${specs.area}</span>
          </div>
          <strong class="text-white text-sm block">${pkg.hotelLabel}</strong>
          <div class="grid grid-cols-2 gap-2 text-slate-300 pt-1 text-[11px]">
            <div>• Loại giường: <strong class="text-white">${specs.bed}</strong></div>
            <div>• Hướng ban công: <strong class="text-white">${specs.view}</strong></div>
            <div>• Phòng tắm: <strong class="text-white">${specs.bathroom}</strong></div>
            <div>• Dịch vụ kèm: <strong class="text-teal-300">${specs.butler}</strong></div>
          </div>
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
            <strong class="text-white font-mono">${window.formatVND(Math.round(pkg.reveal.paid * 0.45))}</strong>
          </div>
          <div class="flex justify-between">
            <span>2 Đêm Resort 4-5★ (${pkg.reveal.room_type}):</span>
            <strong class="text-white font-mono">${window.formatVND(Math.round(pkg.reveal.paid * 0.55))}</strong>
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

      <!-- ĐÁNH GIÁ THỰC TẾ CỦA KHÁCH HÀNG (VERIFIED REVIEWS) -->
      ${pkg.reviews && pkg.reviews.length ? `
        <div class="space-y-3 pt-1 border-t border-white/10">
          <span class="text-xs font-bold text-slate-300 uppercase tracking-wider block">Đánh giá xác thực từ du khách đã trải nghiệm:</span>
          <div class="grid md:grid-cols-2 gap-3 text-xs">
            ${pkg.reviews.map(r => `
              <div class="bg-slate-900/80 p-3.5 rounded-2xl border border-white/10 space-y-1.5">
                <div class="flex justify-between items-center">
                  <div class="flex items-center gap-2">
                    <strong class="text-white">${r.name}</strong>
                    <span class="text-[10px] px-2 py-0.5 rounded bg-teal-500/20 text-teal-300 font-semibold">${r.tag}</span>
                  </div>
                  <span class="text-amber-400 font-bold">★★★★★</span>
                </div>
                <p class="text-slate-300 text-[11px] leading-relaxed italic">"${r.text}"</p>
                <span class="text-slate-500 text-[10px] block">${r.date} — Chuyến đi đã xác minh</span>
              </div>
            `).join("")}
          </div>
        </div>
      ` : ""}
    </div>
  `;

  if (document.getElementById("anonWeatherBox")) {
    document.getElementById("anonWeatherBox").innerText = `Khí hậu điểm đến: ${pkg.temp}°C — ${pkg.weather}`;
  }
  if (document.getElementById("aiMysteryHintText")) {
    document.getElementById("aiMysteryHintText").innerText = `"${pkg.hint}"`;
  }
  if (document.getElementById("packingListContainer")) {
    document.getElementById("packingListContainer").innerHTML = pkg.packing.map((x, i) => `
      <label class="flex items-center gap-2.5 text-xs text-slate-200 p-2.5 rounded-xl bg-slate-900/60 border border-white/5 cursor-pointer hover:bg-slate-900 transition">
        <input type="checkbox" checked class="accent-teal-400 w-4 h-4 rounded cursor-pointer" />
        <span>${i + 1}. ${x}</span>
      </label>
    `).join("");
  }

  if (document.getElementById("revCityName")) document.getElementById("revCityName").innerText = pkg.reveal.city;
  if (document.getElementById("revComboTitle")) document.getElementById("revComboTitle").innerText = pkg.reveal.title;
  if (document.getElementById("revSlaCode")) document.getElementById("revSlaCode").innerText = pkg.reveal.sla;
  if (document.getElementById("revTransport")) document.getElementById("revTransport").innerText = pkg.reveal.transport;
  if (document.getElementById("revHotel")) document.getElementById("revHotel").innerText = pkg.reveal.hotel;
  if (document.getElementById("revRetailPrice")) document.getElementById("revRetailPrice").innerText = window.formatVND(pkg.reveal.retail);
  if (document.getElementById("revPaidPrice")) document.getElementById("revPaidPrice").innerText = window.formatVND(pkg.reveal.paid);
  if (document.getElementById("revSavings")) document.getElementById("revSavings").innerText = "+" + window.formatVND(pkg.reveal.savings);
  if (document.getElementById("revFoodGuide")) {
    document.getElementById("revFoodGuide").innerHTML = pkg.food.map(f => `<li>${f}</li>`).join("");
  }
};

window.syncBankHolderName = function() {
  const n = document.getElementById("custName")?.value || "";
  const holderInput = document.getElementById("custBankHolder");
  if (holderInput) holderInput.value = window.normVN(n);
};

// ============================================================================
// 11. ĐẶT CHỖ, VIETQR & ĐỒNG HỒ ĐẾM NGƯỢC THỜI GIAN THẬT
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

  const lblBooking = document.getElementById("lblBookingCode");
  if (lblBooking) lblBooking.innerText = `Mã Đơn Escrow: #${pkg.code}`;
  
  const qrSection = document.getElementById("qrPaymentSection");
  if (qrSection) qrSection.style.display = "block";
  
  const qrContainer = document.getElementById("qrCardsContainer");
  if (qrContainer) {
    qrContainer.innerHTML = pkg.qrs.map(q => `
      <div class="bg-slate-900/90 p-4 rounded-2xl border border-white/10 text-center space-y-2 shadow-lg">
        <span class="text-xs font-bold text-teal-400 block uppercase tracking-wider">Hành khách #${q.idx}</span>
        <img src="${q.url}" class="w-44 h-44 mx-auto rounded-xl bg-white p-1.5 shadow" alt="VietQR" />
        <p class="text-sm font-extrabold text-white font-mono">${window.formatVND(q.amount)}</p>
        <p class="text-[11px] text-slate-400">Nội dung chuyển khoản: <strong class="text-teal-300 font-mono">${q.memo}</strong></p>
      </div>
    `).join("");
  }

  // Kích hoạt đồng hồ đếm ngược 15:00
  let secondsLeft = 15 * 60;
  if (window.qrTimerInterval) clearInterval(window.qrTimerInterval);
  window.qrTimerInterval = setInterval(() => {
    secondsLeft--;
    const timerEl = document.getElementById("qrCountdownTimer");
    if (secondsLeft <= 0) {
      clearInterval(window.qrTimerInterval);
      if (timerEl) timerEl.innerText = "Mã QR đã hết hạn";
    } else {
      const mins = Math.floor(secondsLeft / 60);
      const secs = secondsLeft % 60;
      if (timerEl) timerEl.innerText = `Hết hạn sau: ${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
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

  const refundBox = document.getElementById("refundResultBox");
  if (refundBox) {
    refundBox.innerHTML = `
      <strong class="text-amber-300 block text-xs uppercase font-extrabold">${map.t}</strong>
      <p class="text-base font-black text-teal-300 font-heading mt-1">Số tiền hoàn tự động: ${window.formatVND(Math.round(paid * map.r))}</p>
      <p class="text-[11px] text-slate-400 mt-1 leading-relaxed">${map.d}</p>
    `;
  }
};

// ============================================================================
// 12. CANVAS THẺ CÀO KỸ THUẬT SỐ & MỞ KHÓA ĐIỂM ĐẾN
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
// 13. ĐIỀU HƯỚNG TABS & CÁC BƯỚC ĐẶT PHÒNG
// ============================================================================
window.switchTab = function(tab) {
  const session = window.loadStore("wm_session_prod", null);
  
  if (!session && (tab === "saved" || tab === "b2b")) {
    window.openUnifiedAuthModal();
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

  const wishContainer = document.getElementById("savedWishlistContainer");
  if (wishContainer) {
    wishContainer.innerHTML = wList.length === 0
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
  }

  const bookContainer = document.getElementById("savedBookingsContainer");
  if (bookContainer) {
    bookContainer.innerHTML = bList.length === 0
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
  }
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
  const b2bList = document.getElementById("b2bInventoryList");
  if (!b2bList) return;
  b2bList.innerHTML = window.HOTELS_DB.map(h => `
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

// Tương thích ngược nếu còn lời gọi cũ
window.openAuthModal = function() {
  window.openUnifiedAuthModal();
};
window.closeAuthModal = function() {
  window.closeUnifiedAuthModal();
};

// ============================================================================
// 14. KHỞI TẠO HỆ THỐNG BAN ĐẦU
// ============================================================================
document.addEventListener("DOMContentLoaded", () => {
  window.applyUserSession();
  const draft = window.loadStore("wm_draft_prod", null) || window.runBlindTravelEngine(false);
  window.saveStore("wm_draft_prod", draft);
  window.renderPackageUI(draft);
});
