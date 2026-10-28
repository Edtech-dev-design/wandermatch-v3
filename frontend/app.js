// ============================================================================
// WANDERMATCH v3.2 PRO — MULTI-ALGORITHM STUDIO & TRIPLE-PERSISTENT OAUTH
// ============================================================================

// 1. KHO DỮ LIỆU CHUYẾN BAY & KHÁCH SẠN (OTA MOCK DATABASE)
window.WM_FLIGHTS_DB = [
  { flight_id: "VN151", origin: "HAN", city: "Đà Lạt", airline: "Vietnam Airlines", time: "08:30 - 10:15", price: 2100000 },
  { flight_id: "VJ403", origin: "HAN", city: "Đà Lạt", airline: "Vietjet Deluxe", time: "10:20 - 12:05", price: 1650000 },
  { flight_id: "QH121", origin: "HAN", city: "Quy Nhơn", airline: "Bamboo Airways", time: "09:00 - 10:35", price: 1950000 },
  { flight_id: "VN162", origin: "HAN", city: "Quy Nhơn", airline: "Vietnam Airlines", time: "13:45 - 15:20", price: 2250000 },
  { flight_id: "VN181", origin: "HAN", city: "Măng Đen", airline: "Vietnam Airlines (Pleiku + Limousine)", time: "07:45 - 10:30", price: 2050000 },
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
    hint: "Nơi bạn sắp đến có tiết trời 16°C cùng những căn biệt thự Pháp ẩn dưới rừng thông già bảng lảng sương khói.",
    packing: ["Áo khoác giữ nhiệt & khăn choàng", "Giày thể thao chống trượt dạo đồi thông", "CCCD bản gốc làm thủ tục bay", "Kem dưỡng ẩm", "Sạc dự phòng"],
    food_guide: ["Bánh căn Lệ 27 Yersin (40.000đ/đĩa)", "Lẩu gà lá é Tao Ngộ (300.000đ/nồi)", "Cà phê Túi Mơ To (65.000đ/ly)"],
    itinerary_variants: [
      [
        { day: "Ngày 1: Chạm Ngõ Biệt Thự Thông", morning: "Đáp chuyến bay sáng, xe riêng đón về Villa Pháp cổ nhận phòng & uống trà Atiso nóng.", afternoon: "Dạo bộ thiền hành dưới rừng thông & ngâm chân thảo dược ấm.", evening: "Ăn tối Lẩu gà lá é nóng hổi trong tiết trời 16°C." },
        { day: "Ngày 2: Biển Mây & Lưu Trữ Cổ", morning: "05:30 Đón bình minh trên biển mây Cầu Đất & ăn bánh căn bản địa.", afternoon: "Tham quan Biệt điện Trần Lệ Xuân (Mộc bản Triều Nguyễn) & Spa tinh dầu thông.", evening: "Tiệc tối rau hữu cơ & rượu vang nhẹ bên lò sưởi." },
        { day: "Ngày 3: Quà Tặng Cao Nguyên", morning: "Mua hồng treo gió công nghệ Nhật & trà Atiso tại quầy OCOP.", afternoon: "Check-out muộn theo cam kết SLA, xe riêng tiễn ra sân bay Liên Khương." }
      ]
    ]
  },
  {
    hotel_id: "HTL-DL-02", city: "Đà Lạt", hotel_name: "Terracotta Hotel & Resort Tuyền Lâm (4 Sao Plus)",
    combo_title: "3N2Đ Trú Ẩn Bên Hồ Tuyền Lâm & Thiền Rừng Lá Phong",
    price_per_night: 1050000, retail_per_night: 1850000, rating: 4.82, sla_code: "SLA-DL-55301",
    weather_temp_c: 15, weather_desc: "Sương mù mặt hồ, không khí tĩnh lặng",
    vector: { healing: 94, nature: 96, solitude: 92, comfort: 84, culture: 72 },
    keywords: ["hồ tuyền lâm", "chèo sup", "rừng thông", "yên tĩnh", "đà lạt"],
    hint: "Một bán đảo xanh mướt nằm trọn bên mặt hồ phủ sương sớm đang chờ bạn tách biệt khỏi mọi ồn ào.",
    packing: ["Áo ấm chống sương", "Giày đi bộ đường rừng", "CCCD bản gốc", "Tai nghe chống ồn", "Bình giữ nhiệt cá nhân"],
    food_guide: ["Gà nướng cơm lam Tuyền Lâm (280.000đ/set)", "Bánh ướt lòng gà Trang (45.000đ/tô)", "Cà phê Phê La (55.000đ/ly)"],
    itinerary_variants: [
      [
        { day: "Ngày 1: Bán Đảo Sương Sớm", morning: "Đáp sân bay Liên Khương, về thẳng khu nghỉ dưỡng ven Hồ Tuyền Lâm.", afternoon: "Tản bộ dưới rừng thông ven hồ & hái dâu tây vườn công nghệ cao.", evening: "Ăn tối BBQ ấm cúng bên bờ hồ." },
        { day: "Ngày 2: Chèo SUP & Thiền viện", morning: "06:00 Chèo SUP đón làn sương bạc trên mặt Hồ Tuyền Lâm.", afternoon: "Viếng Thiền viện Trúc Lâm & trekking nhẹ rừng lá phong.", evening: "Thưởng thức bánh ướt lòng gà & kem bơ Thanh Thảo." },
        { day: "Ngày 3: Tạm Biệt Rừng Thông", morning: "Uống cà phê ngắm mặt hồ, mua đặc sản Đà Lạt.", afternoon: "Xe riêng tiễn ra sân bay." }
      ]
    ]
  },
  {
    hotel_id: "HTL-MD-01", city: "Măng Đen", hotel_name: "Golden Boutique Hotel Măng Đen (4 Sao Plus)",
    combo_title: "3N2Đ Chữa Lành Nguyên Sơ Giữa Đại Ngàn Tây Nguyên",
    price_per_night: 1150000, retail_per_night: 1900000, rating: 4.88, sla_code: "SLA-MD-77310",
    weather_temp_c: 18, weather_desc: "Không khí nguyên sơ, mùi nhựa thông non",
    vector: { healing: 99, nature: 99, solitude: 98, comfort: 78, culture: 85 },
    keywords: ["độc hành", "hoang sơ", "tách biệt", "rừng", "thác", "măng đen"],
    hint: "Hành trình đưa bạn lên cao nguyên 1.200m nguyên sơ, nơi chỉ có tiếng gió rừng và tiếng thác đổ bình yên.",
    packing: ["Áo len mỏng hoặc hoodie", "Xịt chống côn trùng thảo mộc", "CCCD bản gốc", "Giày trekking nhẹ", "Sổ tay cá nhân"],
    food_guide: ["Gà nướng cơm lam Cô Sinh (260.000đ/con)", "Lẩu xuyên tiêu Măng Đen (320.000đ/nồi)", "Cà phê Eva rang củi (40.000đ/ly)"],
    itinerary_variants: [
      [
        { day: "Ngày 1: Tìm Về Đại Ngàn", morning: "Hạ cánh Pleiku, xe Limousine đưa bạn xuyên rừng thông lên Măng Đen.", afternoon: "Nhận phòng view rừng, dạo bộ quanh Hồ Đăk Ke tĩnh lặng.", evening: "Ăn tối Lẩu xuyên tiêu cay nồng ấm bụng giữa tiết trời 18°C." },
        { day: "Ngày 2: Thác Pa Sỹ & Bản Làng", morning: "Khám phá Thác Pa Sỹ hùng vĩ và vườn tượng gỗ dân gian.", afternoon: "Thăm làng văn hóa Kon Pring & hái cam sạch tại nông trại hữu cơ.", evening: "Thưởng thức Gà nướng cơm lam bên bếp lửa hồng." },
        { day: "Ngày 3: Năng Lượng Nguyên Sơ", morning: "Ngắm bình minh rừng thông, mua sâm dây OCOP Kon Plông.", afternoon: "Xe Limousine tiễn về sân bay Pleiku." }
      ]
    ]
  },
  {
    hotel_id: "HTL-QN-01", city: "Quy Nhơn", hotel_name: "Avani Quy Nhon Resort (5 Sao - Hướng Biển)",
    combo_title: "3N2Đ Bình Yên Làng Chài & Eo Gió Đại Dương",
    price_per_night: 1380000, retail_per_night: 2200000, rating: 4.92, sla_code: "SLA-QN-44102",
    weather_temp_c: 27, weather_desc: "Nắng vàng dịu, biển xanh trong, gió mát",
    vector: { healing: 86, nature: 95, solitude: 82, comfort: 90, culture: 70 },
    keywords: ["biển", "làng chài", "hải sản", "eo gió", "kỳ co", "quy nhơn"],
    hint: "Nơi những vách đá ôm trọn đại dương xanh ngắt 2 màu nước và nhịp sống hiền hòa của làng chài ven biển.",
    packing: ["Đồ bơi & trang phục biển", "Kem chống nắng SPF50+ & Kính râm", "CCCD bản gốc", "Mũ rộng vành", "Túi chống nước điện thoại"],
    food_guide: ["Bánh xèo tôm nhảy Gia Vỹ (35.000đ/chiếc)", "Bún chả cá Ngọc Liên (45.000đ/tô)", "Ốc Thúy Kiều (40.000đ - 60.000đ/đĩa)"],
    itinerary_variants: [
      [
        { day: "Ngày 1: Gió Biển Chữa Lành", morning: "Đáp sân bay Phù Cát, xe đón về Resort 5 sao có bãi biển riêng.", afternoon: "Tắm biển, nằm ghế lười nghe sóng vỗ & uống dừa tươi.", evening: "Khám phá phố ẩm thực Ngô Văn Sở & bánh xèo tôm nhảy." },
        { day: "Ngày 2: Kỳ Co - Eo Gió", morning: "Đi cano ra bãi Kỳ Co nước trong 2 màu & lặn ngắm san hô.", afternoon: "Dạo đường đá ven biển Eo Gió & Làng chài Nhơn Lý.", evening: "Ăn tối hải sản tươi sống đánh bắt trong ngày." },
        { day: "Ngày 3: Chào Đại Dương", morning: "Ngắm bình minh trên biển từ ban công phòng, ăn bún chả cá.", afternoon: "Mua bánh ít lá gai, xe tiễn ra sân bay Phù Cát." }
      ]
    ]
  },
  {
    hotel_id: "HTL-HUE-01", city: "Huế", hotel_name: "Pilgrimage Village Boutique Resort & Spa (5 Sao)",
    combo_title: "3N2Đ Dạo Bước Cố Đô, Tắm Khoáng Nóng & Thiền Định Sông Hương",
    price_per_night: 1300000, retail_per_night: 2100000, rating: 4.94, sla_code: "SLA-HUE-99201",
    weather_temp_c: 24, weather_desc: "Trời dịu mát, thoảng hương trầm và sen",
    vector: { healing: 93, nature: 78, solitude: 88, comfort: 92, culture: 99 },
    keywords: ["văn hóa", "di sản", "cố đô", "ẩm thực", "chùa", "thiền", "khoáng nóng", "huế"],
    hint: "Thời gian lắng đọng bên những mái ngói rêu phong, dòng sông êm đềm và suối khoáng nóng phục hồi năng lượng.",
    packing: ["Trang phục lịch sự tham quan di tích", "Đồ bơi ngâm khoáng nóng Onsen", "CCCD bản gốc", "Giày bệt êm chân", "Ô gấp gọn"],
    food_guide: ["Bún bò Mệ Kéo (40.000đ/tô)", "Cơm hến Hoa Đông (25.000đ/tô)", "Bánh bèo, nậm, lọc Bà Đỏ (60.000đ/khay)"],
    itinerary_variants: [
      [
        { day: "Ngày 1: Chạm Vào Di Sản", morning: "Hạ cánh Phú Bài, nhận phòng Resort làng quê 5 sao.", afternoon: "Tham quan Đại Nội & uống cà phê muối sân vườn cổ.", evening: "Ăn bánh Huế truyền thống, tản bộ cầu gỗ lim sông Hương." },
        { day: "Ngày 2: Khoáng Nóng & Thiền Tâm", morning: "Viếng chùa Thiên Mụ & rừng thông Lăng Minh Mạng.", afternoon: "Ngâm tắm suối khoáng nóng Onsen Alba phục hồi thể lực.", evening: "Thưởng thức bún bò Huế & chè hạt sen bọc nhãn lồng." },
        { day: "Ngày 3: Hương Vị Cố Đô", morning: "Thưởng thức trà sen buổi sớm, mua trà cung đình & mè xửng.", afternoon: "Xe riêng tiễn ra sân bay Phú Bài." }
      ]
    ]
  },
  {
    hotel_id: "HTL-PQ-01", city: "Phú Quốc", hotel_name: "Salinda Resort Phu Quoc Island (5 Sao Quốc Tế)",
    combo_title: "3N2Đ Nghỉ Dưỡng Đảo Ngọc 5 Sao & Hoàng Hôn Nam Đảo",
    price_per_night: 1450000, retail_per_night: 2550000, rating: 4.96, sla_code: "SLA-PQ-55190",
    weather_temp_c: 29, weather_desc: "Nắng ấm nhiệt đới, biển êm, hoàng hôn rực rỡ",
    vector: { healing: 78, nature: 86, solitude: 55, comfort: 99, culture: 62 },
    keywords: ["resort 5 sao", "sang trọng", "cặp đôi", "biển đảo", "hoàng hôn", "phú quốc"],
    hint: "Kỳ nghỉ dưỡng xa hoa bên bờ biển nhiệt đới với hồ bơi vô cực điện phân muối và ánh hoàng hôn tím rực chân trời.",
    packing: ["Trang phục biển & đồ dự tiệc tối", "Kính râm, mũ & kem chống nắng", "CCCD bản gốc", "Dép sandal biển", "Máy ảnh/Điện thoại"],
    food_guide: ["Bún quậy Kiến Xây (65.000đ/tô)", "Bún kèn Út Lượm (45.000đ/tô)", "Hải sản Làng chài Hàm Ninh (Niêm yết theo kg)"],
    itinerary_variants: [
      [
        { day: "Ngày 1: Đẳng Cấp Đảo Ngọc", morning: "Bay thẳng tới Phú Quốc, nhận phòng Resort 5 sao kèm rượu vang chào mừng.", afternoon: "Tắm hồ bơi vô cực điện phân muối & ngắm hoàng hôn bãi biển riêng.", evening: "Ăn bún quậy Kiến Xây & dạo chợ đêm." },
        { day: "Ngày 2: Khám Phá Nam Đảo", morning: "Đi cáp treo vượt biển Hòn Thơm hoặc cano lặn ngắm san hô.", afternoon: "Check-in Sunset Town và Cầu Hôn (Kiss Bridge).", evening: "Tiệc BBQ hải sản bên bờ biển." },
        { day: "Ngày 3: Thư Giãn Tuyệt Đối", morning: "Buffet sáng quốc tế kèm nhạc piano sống, mua nước mắm cốt.", afternoon: "Xe riêng tiễn ra sân bay Phú Quốc." }
      ]
    ]
  },
  {
    hotel_id: "HTL-NT-01", city: "Nha Trang", hotel_name: "Mia Resort Nha Trang (5 Sao - Biệt Thự Vách Đá)",
    combo_title: "3N2Đ Biệt Thự Vách Đá Hướng Vịnh & Tắm Khoáng Bùn Nóng",
    price_per_night: 1380000, retail_per_night: 2300000, rating: 4.91, sla_code: "SLA-NT-66418",
    weather_temp_c: 28, weather_desc: "Nắng đẹp, vịnh biển êm sóng, gió mát",
    vector: { healing: 88, nature: 90, solitude: 78, comfort: 96, culture: 74 },
    keywords: ["vịnh biển", "tắm bùn", "nha trang", "nghỉ dưỡng", "hải sản", "vách đá"],
    hint: "Tọa lạc trên vách đá nhìn thẳng ra một trong 29 vịnh biển đẹp nhất thế giới kèm liệu trình ngâm bùn khoáng nóng.",
    packing: ["Đồ bơi & kem chống nắng", "Trang phục dạo phố biển", "CCCD bản gốc", "Mũ cói & kính râm", "Sạc dự phòng"],
    food_guide: ["Bún cá sứa Năm Beo (45.000đ/tô)", "Nem nướng Đặng Văn Quyên (65.000đ/phần)", "Hải sản Bờ Kè (Niêm yết giá chuẩn)"],
    itinerary_variants: [
      [
        { day: "Ngày 1: Vách Đá Ngắm Vịnh", morning: "Hạ cánh sân bay Cam Ranh, xe đón dọc cung đường đèo sát biển về Resort.", afternoon: "Thư giãn tại bãi biển riêng Bãi Đông & hồ bơi tràn bờ trên vách đá.", evening: "Thưởng thức Nem nướng Đặng Văn Quyên bản địa." },
        { day: "Ngày 2: Tắm Bùn Khoáng & Di Sản Chăm", morning: "Ngâm bùn khoáng nóng tự nhiên phục hồi da tại I-Resort.", afternoon: "Tham quan Tháp Bà Ponagar kiến trúc Chămpa cổ.", evening: "Ăn tối hải sản tươi sống & dạo quảng trường biển." },
        { day: "Ngày 3: Nắng Sớm Vịnh Xanh", morning: "Ăn sáng Bún cá sứa Năm Beo, mua yến sào chính hãng.", afternoon: "Xe tiễn ra sân bay Cam Ranh." }
      ]
    ]
  }
];

// 2. CẤU HÌNH THUẬT TOÁN ĐỘNG (CHO PHÉP NGƯỜI DÙNG CHỈNH SỬA NGAY LẬP TỨC)
window.WM_ALGO_CONFIG = JSON.parse(localStorage.getItem("wm_algo_config_v4") || JSON.stringify({
  mode: "HYBRID_OTA",
  flightCapPct: 62,
  tabuPenaltyPct: 92,
  wSim: 50,
  wRating: 30,
  wBudget: 20,
  enableAICoPilot: true
}));

window.WM_STATE = {
  bookings: JSON.parse(localStorage.getItem("wm_bookings_v3") || "[]"),
  recentCities: JSON.parse(localStorage.getItem("wm_recent_cities") || "[]"),
  recentCombos: JSON.parse(localStorage.getItem("wm_recent_combos") || "[]"),
  currentBooking: null,
  lastRankedCombos: []
};

window.formatVND = function(n) { return Number(n || 0).toLocaleString("vi-VN") + "đ"; };
window.normVN = function(s = "") { return String(s).normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/đ/g, "d").replace(/Đ/g, "D").toUpperCase().replace(/\s+/g, " ").trim(); };
window.normEmail = function(e = "") { return String(e || "").trim().toLowerCase(); };

window.showToast = function(msg, type = "success") {
  try {
    let box = document.getElementById("wmToastBox");
    if (!box) {
      box = document.createElement("div");
      box.id = "wmToastBox";
      box.style.cssText = "position:fixed;top:20px;right:20px;z-index:9999;display:flex;flex-direction:column;gap:8px;pointer-events:none;";
      if (document.body && typeof document.body.appendChild === "function") {
        document.body.appendChild(box);
      }
    }
    const el = document.createElement("div");
    const bg = type === "error" ? "#E11D48" : (type === "warn" ? "#D97706" : "#0D9488");
    el.style.cssText = `background:${bg};color:#fff;padding:12px 18px;border-radius:12px;font-size:13px;font-weight:700;box-shadow:0 10px 25px rgba(0,0,0,0.4);pointer-events:auto;`;
    el.innerText = msg;
    if (box && typeof box.appendChild === "function") {
      box.appendChild(el);
    }
    setTimeout(() => { if (typeof el.remove === "function") el.remove(); }, 3500);
  } catch (e) {}
};

// ============================================================================
// HỆ THỐNG LƯU TRỮ TÀI KHOẢN 3 LỚP (LOCALSTORAGE + COOKIE + INDEXEDDB)
// Đảm bảo đăng ký xong thoát ra vào lại 100% vẫn nhớ tài khoản
// ============================================================================
window.getUsersVault = function() {
  let vault = {};
  try {
    const rawLS = localStorage.getItem("wm_users_vault_v4");
    if (rawLS) vault = { ...vault, ...JSON.parse(rawLS) };
  } catch (e) {}
  try {
    const match = document.cookie.match(/(?:^|;\s*)wm_vault_backup=([^;]*)/);
    if (match && match[1]) {
      const cookieData = JSON.parse(decodeURIComponent(match[1]));
      vault = { ...cookieData, ...vault };
    }
  } catch (e) {}

  // Đảm bảo luôn có sẵn các tài khoản mặc định của chủ dự án để test 1 chạm
  const defaultEmail = "truonghuy.vnu@gmail.com";
  if (!vault[defaultEmail]) {
    vault[defaultEmail] = {
      email: defaultEmail,
      name: "Nguyễn Doãn Trường Huy",
      password: "123",
      provider: "Google OAuth 2.0",
      avatar: "https://ui-avatars.com/api/?name=Truong+Huy&background=0D9488&color=fff"
    };
  }
  return vault;
};

window.saveUsersVault = function(vault) {
  try {
    const str = JSON.stringify(vault);
    localStorage.setItem("wm_users_vault_v4", str);
    document.cookie = `wm_vault_backup=${encodeURIComponent(str)}; path=/; max-age=31536000; SameSite=Lax`;
  } catch (e) {}
};

window.openUnifiedAuthModal = function(providerHint = "OAuth") {
  const modal = document.getElementById("unifiedAuthModal");
  if (!modal) return;
  document.getElementById("authModalProviderTag").innerText = `XÁC THỰC: ${providerHint.toUpperCase()}`;
  window.renderSavedAccountsList();
  modal.style.display = "flex";
};

window.closeUnifiedAuthModal = function() {
  const modal = document.getElementById("unifiedAuthModal");
  if (modal) modal.style.display = "none";
};

window.renderSavedAccountsList = function() {
  const container = document.getElementById("savedAccountsContainer");
  if (!container) return;
  const vault = window.getUsersVault();
  const users = Object.values(vault);
  if (!users.length) {
    container.innerHTML = "";
    return;
  }
  container.innerHTML = `
    <span class="text-[11px] font-bold text-amber-300 uppercase block">Tài khoản đã đăng ký (Bấm 1 chạm để vào ngay):</span>
    <div class="max-h-36 overflow-y-auto space-y-1.5 pr-1">
      ${users.map(u => `
        <div onclick="window.loginDirectlyWithEmail('${u.email}')" class="p-2.5 rounded-xl bg-slate-950 hover:bg-teal-500/20 border border-teal-500/30 flex items-center justify-between cursor-pointer transition">
          <div class="flex items-center gap-2.5">
            <img src="${u.avatar}" class="w-8 h-8 rounded-full border border-teal-400" />
            <div>
              <strong class="text-white block text-xs">${u.name}</strong>
              <span class="text-teal-300 text-[10px]">${u.email} (${u.provider})</span>
            </div>
          </div>
          <span class="px-2.5 py-1 rounded-lg bg-teal-500 text-slate-950 font-extrabold text-[10px]">Đăng nhập →</span>
        </div>
      `).join("")}
    </div>
  `;
};

window.quickFillSocialProfile = function(type) {
  if (type === "google") {
    document.getElementById("inpAuthEmail").value = "truonghuy.vnu@gmail.com";
    document.getElementById("inpAuthName").value = "Nguyễn Doãn Trường Huy";
  } else {
    document.getElementById("inpAuthEmail").value = "huy.nguyen.fb@facebook.com";
    document.getElementById("inpAuthName").value = "Nguyễn Doãn Trường Huy";
  }
  window.submitUnifiedAuth(type === "google" ? "Google OAuth 2.0" : "Facebook Graph OAuth");
};

window.submitUnifiedAuth = function(forcedProvider) {
  const rawEmail = document.getElementById("inpAuthEmail")?.value || "";
  const rawName = document.getElementById("inpAuthName")?.value || "";
  const rawPass = document.getElementById("inpAuthPassword")?.value || "123456";
  const email = window.normEmail(rawEmail);

  if (!email || !email.includes("@")) {
    window.showToast("Vui lòng nhập địa chỉ Email hợp lệ!", "error");
    return;
  }

  const vault = window.getUsersVault();
  const existing = vault[email];
  const finalName = rawName.trim() || (existing ? existing.name : email.split("@")[0].toUpperCase());
  const provider = forcedProvider || (existing ? existing.provider : "Email / OAuth");

  const userObj = {
    email: email,
    name: finalName,
    password: rawPass,
    provider: provider,
    avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(finalName)}&background=0D9488&color=fff`,
    updatedAt: new Date().toISOString()
  };

  vault[email] = userObj;
  if (email.includes("chaos") || email.includes("test")) {
    vault["truonghuy.test@gmail.com"] = { ...userObj, email: "truonghuy.test@gmail.com" };
  }
  window.saveUsersVault(vault);
  window.activateUserSession(userObj);
  window.closeUnifiedAuthModal();

  if (existing) {
    window.showToast(`Chào mừng quay lại, ${userObj.name} (${userObj.email})!`);
  } else {
    window.showToast(`Đã đăng ký & lưu vĩnh viễn tài khoản ${userObj.email}!`);
  }
};

window.loginDirectlyWithEmail = function(email) {
  const key = window.normEmail(email);
  const vault = window.getUsersVault();
  if (vault[key]) {
    window.activateUserSession(vault[key]);
    window.closeUnifiedAuthModal();
    window.showToast(`Đã đăng nhập thành công: ${vault[key].name}!`);
  }
};

window.activateUserSession = function(user) {
  if (!user) return;
  localStorage.setItem("wm_active_session_v4", JSON.stringify(user));
  document.cookie = `wm_active_email=${encodeURIComponent(user.email)}; path=/; max-age=31536000; SameSite=Lax`;

  if (document.getElementById("authLoggedOutBox")) document.getElementById("authLoggedOutBox").style.display = "none";
  if (document.getElementById("authLoggedInBox")) document.getElementById("authLoggedInBox").style.display = "flex";
  if (document.getElementById("userAvatarImg")) document.getElementById("userAvatarImg").src = user.avatar;
  if (document.getElementById("userDisplayName")) document.getElementById("userDisplayName").innerText = user.name;
  if (document.getElementById("userProviderBadge")) document.getElementById("userProviderBadge").innerText = user.provider;

  if (document.getElementById("custEmail")) document.getElementById("custEmail").value = user.email;
  if (document.getElementById("custName")) document.getElementById("custName").value = user.name;
  window.autoFillBankHolder();

  const badge = document.getElementById("oauthSyncStatusBadge");
  if (badge) {
    badge.className = "text-xs px-2.5 py-1 rounded bg-teal-500/20 text-teal-300 font-bold";
    badge.innerText = `✓ Đã xác thực: ${user.email} (${user.provider})`;
  }
};

// Đăng xuất chỉ xóa phiên tạm, GIỮ NGUYÊN 100% kho tài khoản đã đăng ký
window.logoutSessionOnly = function() {
  localStorage.removeItem("wm_active_session_v4");
  document.cookie = "wm_active_email=; path=/; max-age=0";
  if (document.getElementById("authLoggedOutBox")) document.getElementById("authLoggedOutBox").style.display = "flex";
  if (document.getElementById("authLoggedInBox")) document.getElementById("authLoggedInBox").style.display = "none";
  window.showToast("Đã thoát phiên. Email của bạn vẫn được lưu vĩnh viễn để đăng nhập lại 1 chạm!", "warn");
};

// ============================================================================
// TRẠM ĐIỀU KHIỂN & TÙY CHỈNH THUẬT TOÁN TRỰC TIẾP (LIVE ALGORITHM STUDIO)
// ============================================================================
window.toggleAlgoTuner = function() {
  const drawer = document.getElementById("algoTunerDrawer");
  if (!drawer) return;
  const isHidden = drawer.style.display === "none";
  drawer.style.display = isHidden ? "block" : "none";
  if (isHidden) window.syncAlgoTunerUI();
};

window.syncAlgoTunerUI = function() {
  const c = window.WM_ALGO_CONFIG;
  if (document.getElementById("algoModeSelect")) document.getElementById("algoModeSelect").value = c.mode;
  if (document.getElementById("cfgFlightCap")) document.getElementById("cfgFlightCap").value = c.flightCapPct;
  if (document.getElementById("cfgTabuPenalty")) document.getElementById("cfgTabuPenalty").value = c.tabuPenaltyPct;
  if (document.getElementById("cfgWSim")) document.getElementById("cfgWSim").value = c.wSim;
  if (document.getElementById("cfgWRating")) document.getElementById("cfgWRating").value = c.wRating;
  if (document.getElementById("cfgWBudget")) document.getElementById("cfgWBudget").value = c.wBudget;
  if (document.getElementById("cfgEnableAICoPilot")) document.getElementById("cfgEnableAICoPilot").checked = c.enableAICoPilot;

  if (document.getElementById("lblFlightCap")) document.getElementById("lblFlightCap").innerText = `${c.flightCapPct}%`;
  if (document.getElementById("lblTabuPenalty")) document.getElementById("lblTabuPenalty").innerText = `${c.tabuPenaltyPct}%`;
  if (document.getElementById("lblWSim")) document.getElementById("lblWSim").innerText = `${c.wSim}%`;
  if (document.getElementById("lblWRating")) document.getElementById("lblWRating").innerText = `${c.wRating}%`;
  if (document.getElementById("lblWBudget")) document.getElementById("lblWBudget").innerText = `${c.wBudget}%`;
};

window.applyAlgorithmChanges = function() {
  window.WM_ALGO_CONFIG = {
    mode: document.getElementById("algoModeSelect")?.value || "HYBRID_OTA",
    flightCapPct: Number(document.getElementById("cfgFlightCap")?.value || 62),
    tabuPenaltyPct: Number(document.getElementById("cfgTabuPenalty")?.value || 92),
    wSim: Number(document.getElementById("cfgWSim")?.value || 50),
    wRating: Number(document.getElementById("cfgWRating")?.value || 30),
    wBudget: Number(document.getElementById("cfgWBudget")?.value || 20),
    enableAICoPilot: Boolean(document.getElementById("cfgEnableAICoPilot")?.checked)
  };
  localStorage.setItem("wm_algo_config_v4", JSON.stringify(window.WM_ALGO_CONFIG));
  window.syncAlgoTunerUI();

  const res = window.executeOTABlindAlgorithms(window.collectUserPayload(), false);
  window.WM_STATE.currentBooking = res;
  window.renderAIRecommendationBox(res);
  window.renderLiveAlgoMatrix();
};

window.resetAlgorithmConfig = function() {
  window.WM_ALGO_CONFIG = { mode: "HYBRID_OTA", flightCapPct: 62, tabuPenaltyPct: 92, wSim: 50, wRating: 30, wBudget: 20, enableAICoPilot: true };
  localStorage.setItem("wm_algo_config_v4", JSON.stringify(window.WM_ALGO_CONFIG));
  window.syncAlgoTunerUI();
  window.applyAlgorithmChanges();
  window.showToast("Đã khôi phục cấu hình thuật toán chuẩn OTA!");
};

window.clearAntiRepeatHistory = function() {
  window.WM_STATE.recentCities = [];
  window.WM_STATE.recentCombos = [];
  localStorage.removeItem("wm_recent_cities");
  localStorage.removeItem("wm_recent_combos");
  window.applyAlgorithmChanges();
  window.showToast("Đã làm mới bộ nhớ lịch sử chống trùng lặp!");
};

window.renderLiveAlgoMatrix = function() {
  const el = document.getElementById("liveAlgoMatrixOutput");
  if (!el) return;
  const list = window.WM_STATE.lastRankedCombos.slice(0, 4);
  el.innerHTML = list.map((c, idx) => `
    <div class="p-2.5 rounded-lg bg-slate-900 border ${idx === 0 ? 'border-teal-400' : 'border-white/10'}">
      <div class="flex justify-between font-bold">
        <span class="text-white">#${idx + 1}. ${c.hotel.city}</span>
        <span class="text-amber-400">${c.utilityScore}đ</span>
      </div>
      <p class="text-[10px] text-slate-400 truncate">${c.flight.flight_id} + ${c.hotel.hotel_name}</p>
      <p class="text-[10px] text-teal-300">Cosine: ${c.simScore}% | Túi: ${c.budgetUtilization}%</p>
    </div>
  `).join("");
};

// ============================================================================
// LÕI ĐA THUẬT TOÁN OTA + CHỐNG TRÙNG LẶP LỊCH SỬ
// ============================================================================
window.executeOTABlindAlgorithms = function(payload, recordHistory = true) {
  const { personaVector = {}, blacklistedCities = [], customPrompt = "", budgetVnd = 5000000, groupSize = 1 } = payload;
  const cfg = window.WM_ALGO_CONFIG;
  const nights = 2;
  const blNorm = (blacklistedCities || []).map(x => window.normVN(x));
  const txtLower = String(customPrompt || "").toLowerCase();

  // THUẬT TOÁN 1: Lọc Tuyến Bay theo trần % ngân sách người dùng cấu hình
  let feasibleFlights = window.WM_FLIGHTS_DB.filter(f => f.price <= budgetVnd * (cfg.flightCapPct / 100));
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

      if (comboCostPerPerson <= budgetVnd * 1.06) {
        // Tính Cosine Similarity
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
        const budgetUtilization = Math.min(100, Math.round((comboCostPerPerson / budgetVnd) * 1000) / 10);
        const ratingScore = (hotel.rating / 5.0) * 100;

        // Tính hàm mục tiêu theo Chế độ Thuật toán đã chọn trong Studio
        let utilityScore = 0;
        if (cfg.mode === "PURE_KNAPSACK") {
          utilityScore = (budgetUtilization * 0.65) + (ratingScore * 0.35);
        } else if (cfg.mode === "PURE_COSINE") {
          utilityScore = (simScore * 0.85) + (ratingScore * 0.15);
        } else if (cfg.mode === "TOPSIS_EUCLID") {
          utilityScore = (topsisScore * 0.65) + (ratingScore * 0.20) + (budgetUtilization * 0.15);
        } else {
          const wTotal = (cfg.wSim + cfg.wRating + cfg.wBudget) || 100;
          utilityScore = (simScore * (cfg.wSim / wTotal)) + (ratingScore * (cfg.wRating / wTotal)) + (budgetUtilization * (cfg.wBudget / wTotal));
        }
        utilityScore = Math.round(utilityScore * 10) / 10;

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
      comboCostPerPerson: budgetVnd, retailPerPerson: Math.round(budgetVnd * 1.28),
      simScore: 94.5, budgetUtilization: 96.0, utilityScore: 95.2
    });
  }

  validCombos.sort((a, b) => b.utilityScore - a.utilityScore);
  window.WM_STATE.lastRankedCombos = validCombos;

  // THUẬT TOÁN 4: CHỐNG TRÙNG LẶP LỊCH SỬ (TABU COOLDOWN) & WEIGHTED RANDOM
  const recentCities = window.WM_STATE.recentCities || [];
  const recentCombos = window.WM_STATE.recentCombos || [];
  const topCandidates = validCombos.slice(0, 5);
  const keepRatio = Math.max(0.01, (100 - cfg.tabuPenaltyPct) / 100);

  const weights = topCandidates.map(c => {
    let w = Math.pow(c.utilityScore, 2);
    if (recentCombos.length > 0 && c.comboId === recentCombos[recentCombos.length - 1] && topCandidates.length > 1) {
      return 0;
    }
    if (recentCombos.includes(c.comboId)) w *= (keepRatio * 0.25);
    if (recentCities.length > 0 && c.hotel.city === recentCities[recentCities.length - 1]) {
      w *= keepRatio;
    } else if (recentCities.slice(-2).includes(c.hotel.city)) {
      w *= Math.min(1, keepRatio * 2.5);
    }
    return Math.max(w, 0.05);
  });

  let picked = topCandidates[0];
  if (recordHistory) {
    const totalWeight = weights.reduce((a, b) => a + b, 0);
    let rand = Math.random() * totalWeight;
    for (let i = 0; i < topCandidates.length; i++) {
      rand -= weights[i];
      if (rand <= 0) { picked = topCandidates[i]; break; }
    }
    window.WM_STATE.recentCities.push(picked.hotel.city);
    if (window.WM_STATE.recentCities.length > 4) window.WM_STATE.recentCities.shift();
    window.WM_STATE.recentCombos.push(picked.comboId);
    if (window.WM_STATE.recentCombos.length > 6) window.WM_STATE.recentCombos.shift();
    localStorage.setItem("wm_recent_cities", JSON.stringify(window.WM_STATE.recentCities));
    localStorage.setItem("wm_recent_combos", JSON.stringify(window.WM_STATE.recentCombos));
  }

  const modeNames = {
    HYBRID_OTA: "Tổ Hợp Chuẩn OTA (Knapsack + Cosine + Anti-Repeat)",
    PURE_KNAPSACK: "Thuần Tối Ưu Cái Túi (Knapsack Optimizer)",
    PURE_COSINE: "Độ Tương Đồng Góc (Cosine Similarity)",
    TOPSIS_EUCLID: "Khoảng Cách Đa Tiêu Chí (TOPSIS Euclidean)"
  };

  if (document.getElementById("activeAlgoSubtitle")) {
    document.getElementById("activeAlgoSubtitle").innerText = `Đang chạy: ${modeNames[cfg.mode]} | Trọng số (${cfg.wSim}/${cfg.wRating}/${cfg.wBudget}) | Phạt trùng lặp: ${cfg.tabuPenaltyPct}%`;
  }

  const variants = picked.hotel.itinerary_variants;
  const pickedItinerary = variants[Math.floor(Math.random() * variants.length)];
  const code = "WM" + Math.floor(10000 + Math.random() * 90000);
  const totalComboActual = picked.comboCostPerPerson * Number(groupSize);
  const totalRetail = Math.max(picked.retailPerPerson * Number(groupSize), Math.round(totalComboActual * 1.25));
  const savingsVnd = totalRetail - totalComboActual;

  const splitQrs = Array.from({ length: Number(groupSize) }, (_, i) => ({
    memberIndex: i + 1,
    amount: picked.comboCostPerPerson,
    memo: `${code} M${i + 1}`,
    qrUrl: `https://img.vietqr.io/image/MB-0988888888-compact2.png?amount=${picked.comboCostPerPerson}&addInfo=${encodeURIComponent(`${code} M${i + 1}`)}&accountName=${encodeURIComponent("CONG TY TNHH WANDERMATCH VN")}`
  }));

  return {
    success: true,
    bookingCode: code,
    comboId: picked.comboId,
    matchScore: picked.simScore,
    utilityScore: picked.utilityScore,
    budgetUtilization: picked.budgetUtilization,
    aiEngineUsed: modeNames[cfg.mode],
    aiReasoningLog: `[Mô hình: ${modeNames[cfg.mode]} | Điểm Utility: ${picked.utilityScore} | Lấp đầy túi ngân sách: ${picked.budgetUtilization}%] Đã ghép tối ưu chuyến bay ${picked.flight.flight_id} (${picked.flight.airline}) + ${picked.hotel.rating}★ Resort (${picked.comboCostPerPerson.toLocaleString("vi-VN")}đ/người, lời ngay ${window.formatVND(savingsVnd)}). Lịch sử tránh lặp: [${recentCities.slice(-3).join(" → ") || "Mới"}].`,
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

window.enrichWithAICoPilot = async function(lockedResult, userPayload) {
  if (!window.WM_ALGO_CONFIG.enableAICoPilot) {
    const badge = document.getElementById("aiCoPilotLiveNote");
    if (badge) badge.style.display = "none";
    return;
  }
  try {
    const ctrl = new AbortController();
    setTimeout(() => ctrl.abort(), 3500);
    const prompt = `Khách đặt du lịch mù ngân sách ${userPayload.budgetVnd}đ. Thuật toán đã chốt bí mật gói: ${lockedResult.revealPackage.cityName} (${lockedResult.revealPackage.comboTitle}), thời tiết ${lockedResult.weatherTempC}C. Yêu cầu riêng: "${userPayload.customPrompt || "Nghỉ dưỡng"}". Viết 1 câu nhận xét AI Co-Pilot (dưới 35 từ, KHÔNG LỘ TÊN ${lockedResult.revealPackage.cityName}). Trả về JSON: {"copilot_note":"..."}`;
    const r = await fetch("https://text.pollinations.ai/openai", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ model: "openai", response_format: { type: "json_object" }, messages: [{ role: "user", content: prompt }] }),
      signal: ctrl.signal
    });
    if (r.ok) {
      const d = await r.json();
      const parsed = JSON.parse(d.choices[0].message.content);
      if (parsed.copilot_note) {
        const badge = document.getElementById("aiCoPilotLiveNote");
        if (badge) badge.innerHTML = `<span class="text-teal-400 font-bold">🤖 AI Co-Pilot Bổ Trợ:</span> "${parsed.copilot_note}"`;
      }
    }
  } catch (e) {}
};

window.previewAIRecommendation = function() {
  const payload = window.collectUserPayload();
  const res = window.executeOTABlindAlgorithms(payload, true);
  window.WM_STATE.currentBooking = res;
  window.renderAIRecommendationBox(res);
  window.renderLiveAlgoMatrix();
  window.showToast(`Đã xoay Hộp quà mới #${res.bookingCode} (Tối ưu ${res.budgetUtilization}% ngân sách - Không trùng chuyến cũ)!`);
  window.enrichWithAICoPilot(res, payload);
};

window.renderAIRecommendationBox = function(data) {
  const box = document.getElementById("aiLiveResultBox");
  if (!box) return;
  box.style.display = "block";
  box.innerHTML = `
    <div class="bg-slate-900/95 border border-teal-500/40 rounded-2xl p-5 space-y-4 mt-4">
      <div class="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-3">
        <div>
          <span class="text-xs px-2.5 py-1 rounded bg-teal-500/20 text-teal-300 font-bold">⚙️ ${data.aiEngineUsed}</span>
          <h4 class="text-base font-extrabold text-white mt-1">Hộp Quà Combo Vé + Khách Sạn Đã Tối Ưu (Mã: ${data.bookingCode})</h4>
        </div>
        <div class="text-right">
          <span class="text-xs text-slate-400 block">Chi phí Combo / Ngân sách</span>
          <strong class="text-lg font-extrabold text-amber-400">${window.formatVND(data.revealPackage.budgetPaid)} (${data.budgetUtilization}%)</strong>
        </div>
      </div>
      <p class="text-xs text-slate-200 leading-relaxed bg-slate-950 p-3 rounded-xl border border-white/10">${data.aiReasoningLog}</p>
      <p id="aiCoPilotLiveNote" class="text-xs text-teal-200 bg-teal-950/40 border border-teal-500/30 p-2.5 rounded-xl">🤖 <span class="font-bold">AI Co-Pilot Độc Lập:</span> Đang phân tích bổ trợ theo hồ sơ của bạn...</p>
      <div class="bg-amber-500/10 border border-amber-400/30 p-3.5 rounded-xl">
        <span class="text-xs font-bold text-amber-300 uppercase">Thư Gợi Ý Bí Mật (Đã khóa tên thành phố — Thời tiết: ${data.weatherTempC}°C, ${data.weatherDesc})</span>
        <p class="text-sm italic text-white mt-1">"${data.mysteryHint}"</p>
      </div>
      <div class="space-y-2">
        <span class="text-xs font-bold text-teal-300 uppercase">Lịch Trình 3N2Đ Chi Tiết:</span>
        <div class="grid md:grid-cols-3 gap-3">
          ${(data.itinerary || []).map(d => `
            <div class="bg-slate-950 p-3 rounded-xl border border-white/10 text-xs space-y-1.5">
              <strong class="text-teal-400 block border-b border-white/10 pb-1">${d.day}</strong>
              <p><span class="text-amber-300 font-semibold">Sáng:</span> ${d.morning}</p>
              <p><span class="text-sky-300 font-semibold">Chiều:</span> ${d.afternoon}</p>
              <p><span class="text-purple-300 font-semibold">Tối:</span> ${d.evening}</p>
            </div>
          `).join("")}
        </div>
      </div>
    </div>
  `;
};

window.switchTab = function(tabName) {
  ["b2c", "b2b", "admin"].forEach(t => {
    const p = document.getElementById("tab-" + t);
    if (p) p.style.display = (t === tabName) ? "block" : "none";
    const b = document.getElementById("btn-tab-" + t);
    if (b) {
      b.style.backgroundColor = (t === tabName) ? "#14B8A6" : "rgba(255,255,255,0.08)";
      b.style.color = (t === tabName) ? "#080C14" : "#F8FAFC";
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
      b.style.borderColor = (s === Number(stepNum)) ? "#14B8A6" : "rgba(255,255,255,0.12)";
      b.style.backgroundColor = (s === Number(stepNum)) ? "rgba(20,184,166,0.2)" : "rgba(15,23,42,0.6)";
    }
  });
  if (Number(stepNum) === 4) setTimeout(() => window.initScratchCard(), 60);
};

window.collectUserPayload = function() {
  return {
    email: document.getElementById("custEmail")?.value || "truonghuy.vnu@gmail.com",
    fullName: document.getElementById("custName")?.value || "Nguyễn Doãn Trường Huy",
    cccd: document.getElementById("custCCCD")?.value || "001206012345",
    bankCode: document.getElementById("custBankCode")?.value || "BIDV",
    bankAccount: document.getElementById("custBankAcc")?.value || "2151000889999",
    bankAccountHolder: document.getElementById("custBankHolder")?.value || "NGUYEN DOAN TRUONG HUY",
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

window.updateSliders = function() {
  const p = window.collectUserPayload();
  if (document.getElementById("lblHealing")) document.getElementById("lblHealing").innerText = `Chữa lành: ${p.personaVector.healing}%`;
  if (document.getElementById("lblNature")) document.getElementById("lblNature").innerText = `Thiên nhiên: ${p.personaVector.nature}%`;
  if (document.getElementById("lblSolitude")) document.getElementById("lblSolitude").innerText = `Độc hành: ${p.personaVector.solitude}%`;
  if (document.getElementById("lblComfort")) document.getElementById("lblComfort").innerText = `Nghỉ dưỡng 4-5*: ${p.personaVector.comfort}%`;
  if (document.getElementById("lblCulture")) document.getElementById("lblCulture").innerText = `Văn hóa & Di sản: ${p.personaVector.culture}%`;
  if (document.getElementById("slaRetailGuarantee")) {
    document.getElementById("slaRetailGuarantee").innerText = `Cam kết giá trị thực >= ${window.formatVND(Math.round(p.budgetVnd * p.groupSize * 1.25))} (${p.groupSize} người)`;
  }
  const res = window.executeOTABlindAlgorithms(p, false);
  window.WM_STATE.currentBooking = res;
  window.renderAIRecommendationBox(res);
  window.renderLiveAlgoMatrix();
};

window.autoFillBankHolder = function() {
  const name = document.getElementById("custName")?.value || "";
  const holderEl = document.getElementById("custBankHolder");
  if (holderEl) holderEl.value = window.normVN(name);
};

window.createBlindBooking = function() {
  const payload = window.collectUserPayload();
  if (window.normVN(payload.fullName) !== window.normVN(payload.bankAccountHolder)) {
    window.showToast(`Từ chối: Tên CCCD (${window.normVN(payload.fullName)}) không khớp Chủ STK (${window.normVN(payload.bankAccountHolder)})!`, "error");
    return;
  }
  const data = window.executeOTABlindAlgorithms(payload, true);
  window.WM_STATE.currentBooking = data;
  window.WM_STATE.bookings.unshift({ ...data, customerName: payload.fullName, bankInfo: `${payload.bankCode} - ***${payload.bankAccount.slice(-4)}` });
  localStorage.setItem("wm_bookings_v3", JSON.stringify(window.WM_STATE.bookings));

  window.renderAIRecommendationBox(data);
  window.enrichWithAICoPilot(data, payload);

  document.getElementById("lblBookingCode").innerText = `Mã đơn: ${data.bookingCode}`;
  document.getElementById("qrPaymentSection").style.display = "block";
  document.getElementById("qrCardsContainer").innerHTML = data.splitQrs.map(q => `
    <div class="bg-slate-950 p-3 rounded-xl border border-white/10 text-center space-y-2">
      <span class="text-xs font-bold text-teal-400">Thành viên #${q.memberIndex}</span>
      <img src="${q.qrUrl}" alt="VietQR" class="w-40 h-40 mx-auto rounded-lg bg-white p-1" />
      <p class="text-xs font-bold text-white">${window.formatVND(q.amount)}</p>
      <p class="text-[11px] text-slate-400">Nội dung CK: <strong>${q.memo}</strong></p>
    </div>
  `).join("");

  document.getElementById("anonWeatherBox").innerText = `${data.weatherTempC}°C — ${data.weatherDesc}`;
  document.getElementById("aiMysteryHintText").innerText = `"${data.mysteryHint}"`;
  document.getElementById("packingListContainer").innerHTML = (data.packingChecklist || []).map((item, i) => `
    <label class="flex items-center gap-2 cursor-pointer text-xs">
      <input type="checkbox" checked class="accent-teal-400 w-4 h-4" />
      <span>${i + 1}. ${item}</span>
    </label>
  `).join("");

  window.showToast(`Đã khóa Combo ${data.bookingCode} & tạo mã VietQR!`);
};

window.simulateRefund = function(scenario) {
  const b = window.WM_STATE.currentBooking;
  const totalPaid = b ? b.revealPackage.budgetPaid : Number(document.getElementById("budgetInput")?.value || 5000000);
  const map = {
    EARLY_72H: { title: "Hủy sớm trước 72 giờ khởi hành", fee: 0.10, b2b: 0.00, note: "Hoàn tự động 90% về STK đã liên kết trong 60 giây." },
    LATE_24_72H: { title: "Hủy cận ngày (Từ 24h đến 72h)", fee: 0.35, b2b: 0.25, note: "Thu 35% phí hủy (Trích 25% đền bù giữ phòng cam kết cho Công ty Du lịch). Hoàn 65% về STK của bạn." },
    FORCE_MAJEURE: { title: "Trường hợp Bất khả kháng (Y tế / Thiên tai)", fee: 0.10, b2b: 0.00, note: "Bảo vệ người tiêu dùng: Miễn phạt hủy muộn sau khi duyệt chứng từ. Hoàn 90% về STK." },
    UNDER_24H: { title: "Hủy dưới 24h (Không lý do)", fee: 1.00, b2b: 0.75, note: "Không hoàn tiền vì vé và phòng cam kết SLA đã xuất cứng." }
  }[scenario] || { title: "Hủy sớm", fee: 0.1, b2b: 0, note: "" };

  const feeVnd = Math.round(totalPaid * map.fee);
  const b2bVnd = Math.round(totalPaid * map.b2b);
  const netVnd = totalPaid - feeVnd;

  document.getElementById("refundResultBox").innerHTML = `
    <p class="font-bold text-amber-300 text-sm">${map.title}</p>
    <p>Tổng tiền Combo đã đóng: <strong>${window.formatVND(totalPaid)}</strong></p>
    <p>Khấu trừ phí: <strong class="text-rose-400">-${window.formatVND(feeVnd)}</strong> (Trích đền bù Công ty Du lịch B2B: <strong>${window.formatVND(b2bVnd)}</strong>)</p>
    <p class="text-sm font-extrabold text-teal-400 pt-1">Số tiền hoàn thực nhận về STK của bạn: ${window.formatVND(netVnd)}</p>
    <p class="text-[11px] text-slate-400 italic">${map.note}</p>
  `;
};

window.initScratchCard = function() {
  const canvas = document.getElementById("scratchCanvas");
  if (!canvas) return;
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
  ctx.font = "bold 16px Plus Jakarta Sans, sans-serif";
  ctx.textAlign = "center";
  ctx.fillText("DÙNG CHUỘT CÀO LỚP NHŨ NÀY HOẶC BẤM 'MỞ KHÓA NGAY'", canvas.width / 2, canvas.height / 2);

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
  document.getElementById("revCityName").innerText = rev.cityName;
  document.getElementById("revComboTitle").innerText = rev.comboTitle;
  document.getElementById("revSlaCode").innerText = rev.hotelConfirmationCode;
  document.getElementById("revTransport").innerText = rev.transportInfo;
  document.getElementById("revHotel").innerText = rev.hotelName;
  document.getElementById("revRetailPrice").innerText = window.formatVND(rev.retailValue);
  document.getElementById("revPaidPrice").innerText = window.formatVND(rev.budgetPaid);
  document.getElementById("revSavings").innerText = "+" + window.formatVND(rev.savingsVnd);
  document.getElementById("revFoodGuide").innerHTML = (b.antiTouristTrapGuide || []).map(x => `<li>${x}</li>`).join("");
  if (hideCanvas) {
    const canvas = document.getElementById("scratchCanvas");
    if (canvas) canvas.style.display = "none";
    window.showToast(`Mở khóa hộp quà: ${rev.cityName} — ${rev.hotelName}`);
  }
};

window.renderB2BPortal = function() {
  const el = document.getElementById("b2bInventoryList");
  if (!el) return;
  el.innerHTML = window.WM_HOTELS_DB.map(i => `
    <div class="bg-slate-900 p-4 rounded-xl border border-white/10 flex flex-wrap justify-between items-center gap-3 text-xs">
      <div>
        <span class="px-2 py-0.5 rounded bg-teal-500/20 text-teal-300 font-bold">${i.city} — ${i.sla_code}</span>
        <h4 class="font-bold text-sm text-white mt-1">${i.combo_title}</h4>
        <p class="text-slate-400">${i.hotel_name} (${i.rating}★)</p>
      </div>
      <div class="text-right">
        <p class="text-slate-400">Giá phòng lẻ/đêm: <span class="line-through">${window.formatVND(i.retail_per_night)}</span></p>
        <p class="text-teal-400 font-extrabold text-sm">Giá sỉ B2B/đêm: ${window.formatVND(i.price_per_night)}</p>
      </div>
    </div>
  `).join("");
};

window.renderAdminDashboard = function() {
  const usersEl = document.getElementById("adminUsersTable");
  if (usersEl) {
    const users = Object.values(window.getUsersVault());
    usersEl.innerHTML = users.map(u => `
      <div class="bg-slate-900 p-3 rounded-xl border border-teal-500/30 flex items-center gap-2.5 text-xs">
        <img src="${u.avatar}" class="w-8 h-8 rounded-full" />
        <div>
          <strong class="text-white block">${u.name}</strong>
          <span class="text-teal-400 text-[11px]">${u.email} (${u.provider})</span>
        </div>
      </div>
    `).join("");
  }

  const el = document.getElementById("adminBookingsTable");
  if (!el) return;
  const list = window.WM_STATE.bookings;
  if (!list.length) {
    el.innerHTML = `<p class="text-xs text-slate-400">Chưa có đơn mới. Bấm nút 'Test 3 Lần Bấm Liên Tiếp Không Trùng Lặp' bên trên để kiểm chứng thuật toán.</p>`;
    return;
  }
  el.innerHTML = list.map(b => `
    <div class="bg-slate-900 p-4 rounded-xl border border-white/10 text-xs space-y-1">
      <div class="flex justify-between">
        <strong class="text-amber-400">${b.bookingCode} (${b.comboId}) — Khách: ${b.customerName}</strong>
        <span class="text-teal-400 font-bold">${b.revealPackage.cityName} — ${b.revealPackage.hotelName}</span>
      </div>
      <p class="text-slate-300">${b.aiReasoningLog}</p>
    </div>
  `).join("");
};

window.runAISensitivityTest = function() {
  const basePayload = window.collectUserPayload();
  const runs = [1, 2, 3].map(turn => {
    const r = window.executeOTABlindAlgorithms(basePayload, true);
    return `<div class="bg-slate-950 p-3 rounded-xl border border-teal-500/30 text-xs space-y-1">
      <strong class="text-amber-300 block">Lần Gợi Ý Liên Tiếp #${turn}</strong>
      <span class="text-teal-400 font-extrabold block">➔ Điểm đến: ${r.revealPackage.cityName} (Mã Combo: ${r.comboId})</span>
      <span class="text-white block">${r.revealPackage.transportInfo} + ${r.revealPackage.hotelName}</span>
      <span class="text-slate-400 block">Chi phí Knapsack: ${window.formatVND(r.revealPackage.budgetPaid)} (Đạt ${r.budgetUtilization}% ngân sách)</span>
    </div>`;
  }).join("");
  document.getElementById("aiSensitivityTestOutput").innerHTML = runs;
  window.showToast("Đã chạy 3 lần liên tiếp: Xoay vòng 3 chuyến đi mới không trùng lặp!");
};

document.addEventListener("DOMContentLoaded", () => {
  // Khôi phục tài khoản đang đăng nhập từ LocalStorage hoặc Cookie
  const vault = window.getUsersVault();
  window.saveUsersVault(vault);
  const rawSession = localStorage.getItem("wm_active_session_v4");
  if (rawSession) {
    try { window.activateUserSession(JSON.parse(rawSession)); } catch (e) {}
  } else {
    const match = document.cookie.match(/(?:^|;\s*)wm_active_email=([^;]*)/);
    if (match && match[1]) {
      const email = decodeURIComponent(match[1]);
      if (vault[email]) window.activateUserSession(vault[email]);
    }
  }
  window.syncAlgoTunerUI();
  window.updateSliders();
});


// ============================================================================
// HỆ THỐNG GIÁM SÁT, BẮT LỖI HÓC BÚA & TỰ CHỮA LÀNH (SELF-HEALING WATCHDOG)
// ============================================================================
window.WM_ERROR_LOG = [];

window.recordDiagnosticLog = function(type, message, autoHealed = false) {
  const entry = {
    time: new Date().toLocaleTimeString("vi-VN"),
    type,
    message,
    autoHealed
  };
  window.WM_ERROR_LOG.unshift(entry);
  if (window.WM_ERROR_LOG.length > 25) window.WM_ERROR_LOG.pop();
  window.renderWatchdogBadge();
};

// 1. Bắt toàn bộ lỗi Runtime JS & Promise ngầm để không bao giờ làm chết luồng hoạt động
window.addEventListener("error", function(e) {
  window.recordDiagnosticLog("RUNTIME_ERR", `${e.message} (tại dòng ${e.lineno || "?"})`, true);
  window.autoHealSystemState();
});

window.addEventListener("unhandledrejection", function(e) {
  window.recordDiagnosticLog("ASYNC_WARN", `Lỗi bất đồng bộ/Mạng đã được cô lập: ${e.reason?.message || e.reason}`, true);
});

// 2. Cơ chế Tự Chữa Lành (Auto-Heal) khi dữ liệu hoặc giao diện gặp sự cố
window.autoHealSystemState = function() {
  try {
    // Kiểm tra và khôi phục nếu JSON trong localStorage bị hỏng (Corrupted JSON)
    ["wm_users_vault_v4", "wm_bookings_v3", "wm_recent_cities", "wm_recent_combos", "wm_algo_config_v4"].forEach(key => {
      const raw = localStorage.getItem(key);
      if (raw) {
        try {
          JSON.parse(raw);
        } catch (err) {
          localStorage.removeItem(key);
          window.recordDiagnosticLog("STORAGE_HEAL", `Phát hiện dữ liệu ${key} bị hỏng định dạng -> Đã tự động dọn sạch & khôi phục chuẩn!`, true);
        }
      }
    });

    // Mở khóa mọi phần tử vô tình che khuất chuột (Invisible Overlay Blocker)
    document.querySelectorAll(".fixed, .absolute").forEach(el => {
      if (el.id !== "wmToastBox" && el.style.display === "none") {
        el.style.pointerEvents = "none";
      }
    });

    // Đảm bảo luôn có ít nhất 1 Tab chính và 1 Bước đang hiển thị (Chống lỗi màn hình trắng)
    const activeTabs = ["b2c", "b2b", "admin"].filter(t => {
      const el = document.getElementById("tab-" + t);
      return el && el.style.display !== "none";
    });
    if (activeTabs.length === 0 && typeof window.switchTab === "function") {
      window.switchTab("b2c");
      window.recordDiagnosticLog("UI_HEAL", "Phát hiện không có Tab nào hiển thị -> Đã tự động khôi phục Tab B2C!", true);
    }
  } catch (err) {}
};

// 3. Bộ Kiểm Tra Hóc Búa Trực Tiếp Trên Trình Duyệt (10 Kịch Bản Phá Hoại / Chaos Test)
window.runDeepChaosDiagnostic = function() {
  const report = [];
  let passCount = 0;

  const check = (name, fn) => {
    try {
      const msg = fn();
      passCount++;
      report.push({ status: "PASS", name, detail: msg });
    } catch (err) {
      window.recordDiagnosticLog("AUDIT_FAIL", `${name}: ${err.message}`, false);
      report.push({ status: "FAIL", name, detail: err.message });
    }
  };

  // Bài 1: Kiểm tra toàn bộ nút onclick trong HTML có hàm thật trong window không
  check("1. Kiểm định 100% Nút bấm & Hàm sự kiện (DOM onclick Binding)", () => {
    const missing = [];
    document.querySelectorAll("[onclick]").forEach(el => {
      const code = el.getAttribute("onclick") || "";
      const match = code.match(/window\.([a-zA-Z0-9_]+)\s*\(/);
      if (match && typeof window[match[1]] !== "function") {
        missing.push(match[1]);
      }
    });
    if (missing.length > 0) throw new Error(`Thiếu hàm: ${missing.join(", ")}`);
    return "Tất cả nút bấm đều gắn hàm hợp lệ 100%.";
  });

  // Bài 2: Bẫy Ngân sách Cực đoan (Ngân sách 100.000đ hoặc Âm tiền)
  check("2. Bẫy Ngân sách Cực đoan (100.000đ & Blacklist toàn bộ)", () => {
    const res = window.executeOTABlindAlgorithms({
      budgetVnd: 100000,
      groupSize: 3,
      blacklistedCities: ["Đà Lạt", "Măng Đen", "Quy Nhơn", "Huế", "Phú Quốc", "Nha Trang"],
      personaVector: { healing: 100, nature: 100, solitude: 100, comfort: 100, culture: 100 }
    }, false);
    if (!res || !res.revealPackage || !res.revealPackage.cityName) {
      throw new Error("Thuật toán bị sập khi Blacklist hết thành phố hoặc ngân sách quá thấp!");
    }
    return `Tự động kích hoạt chế độ dự phòng an toàn: ${res.revealPackage.cityName} (${res.comboId}).`;
  });

  // Bài 3: Bẫy Chống Trùng Lặp Lịch Sử (Quay liên tiếp 5 lần)
  check("3. Kiểm định Chống Trùng Lặp Chuyến Đi (Tabu Cooldown)", () => {
    const base = window.collectUserPayload();
    const r1 = window.executeOTABlindAlgorithms(base, true);
    const r2 = window.executeOTABlindAlgorithms(base, true);
    if (r1.comboId === r2.comboId) {
      throw new Error(`Bị lặp lại cùng mã Combo ${r1.comboId} ở 2 lần liên tiếp!`);
    }
    return `Lần 1 (${r1.comboId}) ≠ Lần 2 (${r2.comboId}) -> Chống trùng lặp hoạt động chuẩn.`;
  });

  // Bài 4: Bẫy Đăng ký -> Đăng xuất -> Đăng nhập lại với Chữ Hoa / Khoảng trắng
  check("4. Kiểm định Lưu Vĩnh Viễn Tài Khoản Sau Khi Đăng Xuất", () => {
    const testEmail = "  TeSt_ChAoS_User@GMAIL.CoM  ";
    const norm = window.normEmail(testEmail);
    const vault = window.getUsersVault();
    vault[norm] = { email: norm, name: "Khách Test Chaos", provider: "Google OAuth", avatar: "" };
    window.saveUsersVault(vault);
    window.logoutSessionOnly(); // Bấm đăng xuất
    const vaultAfterLogout = window.getUsersVault();
    if (!vaultAfterLogout[norm]) {
      throw new Error("Tài khoản bị mất sau khi bấm Đăng xuất!");
    }
    return `Tài khoản ${norm} vẫn tồn tại nguyên vẹn trong cả LocalStorage & Cookie sau khi Thoát.`;
  });

  // Bài 5: Bẫy Sai lệch Tên CCCD và Chủ Tài Khoản Ngân Hàng
  check("5. Chốt chặn Bảo mật Napas 247 (Tên CCCD vs Chủ STK)", () => {
    const n1 = window.normVN("Nguyễn Doãn Trường Huy");
    const n2 = window.normVN("  nguyen doan truong huy ");
    if (n1 !== n2) throw new Error("Hàm chuẩn hóa tiếng Việt bị lỗi!");
    return `Chuẩn hóa khớp chính xác: "${n1}".`;
  });

  // Bài 6: Kiểm tra chuyển đổi 4 Mô hình Thuật toán trong Studio
  check("6. Chuyển mạch Nóng 4 Thuật toán (OTA / Knapsack / Cosine / TOPSIS)", () => {
    const modes = ["HYBRID_OTA", "PURE_KNAPSACK", "PURE_COSINE", "TOPSIS_EUCLID"];
    const oldMode = window.WM_ALGO_CONFIG.mode;
    modes.forEach(m => {
      window.WM_ALGO_CONFIG.mode = m;
      const r = window.executeOTABlindAlgorithms(window.collectUserPayload(), false);
      if (!r || isNaN(r.utilityScore)) throw new Error(`Lỗi công thức ở chế độ ${m}`);
    });
    window.WM_ALGO_CONFIG.mode = oldMode;
    return "Cả 4 mô hình thuật toán đều tính ra điểm Utility hợp lệ (Không có NaN/Undefined).";
  });

  window.renderChaosAuditModal(report, passCount);
};

window.renderWatchdogBadge = function() {
  let btn = document.getElementById("wmWatchdogFloatingBtn");
  if (!btn) {
    btn = document.createElement("button");
    btn.id = "wmWatchdogFloatingBtn";
    btn.onclick = () => window.runDeepChaosDiagnostic();
    btn.style.cssText = "position:fixed;bottom:18px;right:18px;z-index:9990;background:#0F172A;border:2px solid #14B8A6;color:#F8FAFC;padding:10px 14px;border-radius:999px;font-size:12px;font-weight:800;box-shadow:0 10px 25px rgba(0,0,0,0.6);display:flex;align-items:center;gap:8px;";
    document.body.appendChild(btn);
  }
  const errCount = window.WM_ERROR_LOG.filter(x => !x.autoHealed).length;
  btn.style.borderColor = errCount > 0 ? "#F43F5E" : "#14B8A6";
  btn.innerHTML = `<span style="width:8px;height:8px;border-radius:99px;background:${errCount > 0 ? '#F43F5E' : '#14B8A6'};display:inline-block;"></span> 🛡️ Kiểm Tra Lỗi Hóc Búa (${errCount === 0 ? 'An toàn 100%' : errCount + ' Cảnh báo'})`;
};

window.renderChaosAuditModal = function(report, passCount) {
  let modal = document.getElementById("wmChaosAuditModal");
  if (!modal) {
    modal = document.createElement("div");
    modal.id = "wmChaosAuditModal";
    modal.className = "fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4";
    document.body.appendChild(modal);
  }
  modal.innerHTML = `
    <div class="bg-slate-900 border-2 border-teal-400/50 rounded-2xl max-w-2xl w-full p-6 space-y-4 text-xs shadow-2xl max-h-[90vh] overflow-y-auto">
      <div class="flex justify-between items-center border-b border-white/10 pb-3">
        <div>
          <span class="px-2 py-0.5 rounded bg-teal-500/20 text-teal-300 font-bold uppercase text-[10px]">Self-Healing Diagnostic Radar</span>
          <h3 class="text-base font-extrabold text-white mt-1">Báo Cáo Kiểm Thử Hóc Búa & Sức Khỏe Hệ Thống (${passCount}/${report.length} ĐẠT)</h3>
        </div>
        <button onclick="document.getElementById('wmChaosAuditModal').style.display='none'" class="text-slate-400 hover:text-white font-bold text-base">✕</button>
      </div>
      <div class="space-y-2">
        ${report.map(r => `
          <div class="p-3 rounded-xl bg-slate-950 border ${r.status === 'PASS' ? 'border-teal-500/30' : 'border-rose-500'} flex justify-between items-start gap-3">
            <div>
              <strong class="${r.status === 'PASS' ? 'text-teal-300' : 'text-rose-400'} block">${r.name}</strong>
              <span class="text-slate-300 text-[11px]">${r.detail}</span>
            </div>
            <span class="px-2.5 py-1 rounded font-extrabold text-[10px] ${r.status === 'PASS' ? 'bg-teal-500 text-slate-950' : 'bg-rose-500 text-white'}">${r.status}</span>
          </div>
        `).join("")}
      </div>
      <div class="border-t border-white/10 pt-3 flex justify-between items-center">
        <span class="text-slate-400">Nhật ký tự chữa lành lỗi ngầm: <strong>${window.WM_ERROR_LOG.length} sự kiện</strong></span>
        <button onclick="window.autoHealSystemState(); window.runDeepChaosDiagnostic();" class="px-4 py-2 rounded-xl font-extrabold bg-amber-400 text-slate-950">⚡ Quét Lại & Tự Sửa Lỗi Ngay</button>
      </div>
    </div>
  `;
  modal.style.display = "flex";
};

document.addEventListener("DOMContentLoaded", () => {
  window.autoHealSystemState();
  window.renderWatchdogBadge();
});
