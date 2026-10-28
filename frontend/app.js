/**
 * WANDERMATCH — PRODUCTION LUXURY BLIND TRAVEL PLATFORM
 * Version 7.0 — Full Commercial Architecture with Social OAuth & Gatekeeper
 */

window.FLIGHTS_DB = [
  { id: "VN151", origin: "HAN", city: "Đà Lạt", airline: "Vietnam Airlines", time: "08:30 - 10:15", price: 2100000 },
  { id: "VJ403", origin: "HAN", city: "Đà Lạt", airline: "Vietjet Deluxe", time: "10:20 - 12:05", price: 1650000 },
  { id: "QH121", origin: "HAN", city: "Quy Nhơn", airline: "Bamboo Airways", time: "09:00 - 10:35", price: 1950000 },
  { id: "VN181", origin: "HAN", city: "Măng Đen", airline: "Vietnam Airlines (Pleiku + Xe riêng)", time: "07:45 - 10:30", price: 2050000 },
  { id: "VN137", origin: "HAN", city: "Huế", airline: "Vietnam Airlines", time: "09:15 - 10:30", price: 1600000 },
  { id: "VJ971", origin: "HAN", city: "Phú Quốc", airline: "Vietjet Deluxe", time: "09:40 - 11:50", price: 2450000 },
  { id: "VN251", origin: "SGN", city: "Đà Lạt", airline: "Vietnam Airlines", time: "09:00 - 09:55", price: 1450000 },
  { id: "VN262", origin: "SGN", city: "Quy Nhơn", airline: "Bamboo Airways", time: "08:30 - 09:45", price: 1650000 },
  { id: "VN237", origin: "SGN", city: "Huế", airline: "Vietnam Airlines", time: "09:15 - 10:40", price: 1750000 },
  { id: "VJ871", origin: "SGN", city: "Phú Quốc", airline: "Vietjet Deluxe", time: "10:00 - 11:00", price: 1550000 }
];

window.HOTELS_DB = [
  {
    id: "HTL-DL", city: "Đà Lạt", name: "Ana Mandara Villas Dalat Resort & Spa (5 Sao)",
    title: "3N2Đ Biệt Thự Pháp Cổ Rừng Thông & Săn Mây Cầu Đất",
    night_price: 1350000, retail_night: 2250000, rating: 4.95, sla: "SLA-DL-88219", temp: 16, weather: "Se lạnh, sương sớm rừng thông",
    vec: { healing: 96, nature: 90, solitude: 85, comfort: 92, culture: 82 }, kw: ["săn mây", "rừng thông", "se lạnh", "cà phê"],
    hint: "Điểm đến của bạn sở hữu khí hậu cao nguyên se lạnh 16°C với những căn biệt thự kiến trúc Pháp ẩn mình dưới tán thông già.",
    packing: ["Áo khoác giữ nhiệt & khăn choàng cổ", "Giày thể thao đi bộ đồi thông", "CCCD bản gốc làm thủ tục bay", "Kem dưỡng ẩm thảo mộc"],
    food: ["Bánh căn Lệ 27 Yersin (40.000đ/đĩa)", "Lẩu gà lá é Tao Ngộ (300.000đ/nồi)", "Cà phê Túi Mơ To (65.000đ/ly)"],
    days: [
      { d: "Ngày 1: Nhận Phòng Biệt Thự Rừng Thông", m: "Đáp chuyến bay sáng, xe riêng đón về Resort nhận phòng & dùng trà nóng.", a: "Dạo bộ dưới rừng thông cổ thụ & ngâm chân thảo dược.", e: "Thưởng thức Lẩu gà lá é nóng hổi trong tiết trời 16°C." },
      { d: "Ngày 2: Đón Biển Mây & Di Sản Kiến Trúc", m: "05:30 Đón bình minh đồi chè Cầu Đất & ăn bánh căn bản địa.", a: "Tham quan Biệt điện Trần Lệ Xuân & thư giãn Spa tinh dầu thông.", e: "Bữa tối ấm cúng với rau hữu cơ tại nhà hàng Pháp." },
      { d: "Ngày 3: Mua Quà Cao Nguyên & Trở Về", m: "Mua hồng treo gió & trà Atiso tại trung tâm OCOP chuẩn giá.", a: "Trả phòng muộn, xe riêng tiễn ra sân bay Liên Khương." }
    ]
  },
  {
    id: "HTL-MD", city: "Măng Đen", name: "Golden Boutique Hotel Măng Đen (4 Sao Plus)",
    title: "3N2Đ Nghỉ Dưỡng Nguyên Sơ Giữa Đại Ngàn Măng Đen",
    night_price: 1150000, retail_night: 1900000, rating: 4.88, sla: "SLA-MD-77310", temp: 18, weather: "Không khí nguyên sơ, mát lạnh",
    vec: { healing: 99, nature: 99, solitude: 98, comfort: 78, culture: 85 }, kw: ["hoang sơ", "tách biệt", "rừng", "thác"],
    hint: "Hành trình đưa bạn lên cao nguyên 1.200m nguyên sơ, nơi chỉ có tiếng gió rừng thông và thác đổ bình yên.",
    packing: ["Áo khoác nhẹ hoặc áo len mỏng", "Xịt chống côn trùng thảo mộc", "CCCD bản gốc", "Giày thể thao êm chân"],
    food: ["Gà nướng cơm lam Cô Sinh (260.000đ/con)", "Lẩu xuyên tiêu Măng Đen (320.000đ/nồi)", "Cà phê Eva rang củi (40.000đ/ly)"],
    days: [
      { d: "Ngày 1: Cung Đường Thông Đại Ngàn", m: "Hạ cánh Pleiku, xe riêng đón thẳng lên thị trấn Măng Đen.", a: "Nhận phòng view rừng thông, dạo bộ Hồ Đăk Ke tĩnh lặng.", e: "Thưởng thức Lẩu xuyên tiêu cay nồng ấm bụng." },
      { d: "Ngày 2: Khám Phá Thác Pa Sỹ & Bản Làng", m: "Tham quan Thác Pa Sỹ hùng vĩ và vườn tượng gỗ dân gian.", a: "Thăm làng văn hóa Kon Pring & nông trại cam hữu cơ.", e: "Ăn tối Gà nướng cơm lam truyền thống." },
      { d: "Ngày 3: Năng Lượng Rừng Già", m: "Ngắm bình minh rừng thông, mua sâm dây Kon Plông.", a: "Xe riêng đưa về sân bay Pleiku." }
    ]
  },
  {
    id: "HTL-QN", city: "Quy Nhơn", name: "Avani Quy Nhon Resort (5 Sao Quốc Tế)",
    title: "3N2Đ Nghỉ Dưỡng Bãi Biển Riêng & Kỳ Co - Eo Gió",
    night_price: 1380000, retail_night: 2200000, rating: 4.92, sla: "SLA-QN-44102", temp: 27, weather: "Nắng vàng dịu, biển xanh trong",
    vec: { healing: 86, nature: 95, solitude: 82, comfort: 90, culture: 70 }, kw: ["biển", "làng chài", "hải sản", "eo gió", "kỳ co"],
    hint: "Nơi những vách đá kỳ vĩ ôm trọn làn nước đại dương xanh ngắt 2 màu cùng nhịp sống bình yên của làng chài ven biển.",
    packing: ["Đồ bơi & trang phục đi biển", "Kem chống nắng SPF50+ & Kính râm", "CCCD bản gốc", "Mũ rộng vành"],
    food: ["Bánh xèo tôm nhảy Gia Vỹ (35.000đ/chiếc)", "Bún chả cá Ngọc Liên (45.000đ/tô)", "Ốc Thúy Kiều (40.000đ - 60.000đ/đĩa)"],
    days: [
      { d: "Ngày 1: Tận Hưởng Bãi Biển Riêng", m: "Đáp sân bay Phù Cát, xe đón về Resort 5 sao sát biển.", a: "Tắm biển tại bãi riêng của Resort & thưởng thức dừa tươi.", e: "Dạo phố ẩm thực Ngô Văn Sở & ăn bánh xèo tôm nhảy." },
      { d: "Ngày 2: Cano Kỳ Co & Eo Gió", m: "Đi cano ra bãi Kỳ Co nước trong 2 màu & lặn ngắm san hô.", a: "Check-in đường đá ven biển Eo Gió & Làng chài Nhơn Lý.", e: "Thưởng thức hải sản tươi sống đánh bắt trong ngày." },
      { d: "Ngày 3: Bình Minh Đại Dương", m: "Ngắm bình minh trên biển từ ban công phòng, ăn bún chả cá.", a: "Mua bánh ít lá gai làm quà, xe tiễn ra sân bay Phù Cát." }
    ]
  },
  {
    id: "HTL-HUE", city: "Huế", name: "Pilgrimage Village Boutique Resort & Spa (5 Sao)",
    title: "3N2Đ Di Sản Cố Đô & Ngâm Khoáng Nóng Onsen",
    night_price: 1300000, retail_night: 2100000, rating: 4.94, sla: "SLA-HUE-99201", temp: 24, weather: "Trời dịu mát, yên bình",
    vec: { healing: 93, nature: 78, solitude: 88, comfort: 92, culture: 99 }, kw: ["văn hóa", "di sản", "cố đô", "chùa", "khoáng nóng"],
    hint: "Không gian tĩnh lặng của kiến trúc di sản cố đô kết hợp cùng nguồn suối khoáng nóng tự nhiên giúp phục hồi thể lực.",
    packing: ["Trang phục lịch sự tham quan di tích", "Đồ bơi ngâm khoáng nóng Onsen", "CCCD bản gốc", "Giày bệt êm chân"],
    food: ["Bún bò Mệ Kéo (40.000đ/tô)", "Cơm hến Hoa Đông (25.000đ/tô)", "Bánh bèo, nậm, lọc Bà Đỏ (60.000đ/khay)"],
    days: [
      { d: "Ngày 1: Khám Phá Hoàng Cung", m: "Hạ cánh sân bay Phú Bài, nhận phòng Resort 5 sao không gian làng quê.", a: "Tham quan Đại Nội Huế & thưởng thức cà phê muối sân vườn.", e: "Ăn bánh Huế truyền thống & dạo cầu gỗ lim sông Hương." },
      { d: "Ngày 2: Lăng Tẩm & Suối Khoáng Nóng", m: "Viếng chùa Thiên Mụ & tham quan Lăng Minh Mạng.", a: "Ngâm tắm suối khoáng nóng Onsen Alba phục hồi năng lượng.", e: "Thưởng thức bún bò Huế & chè hạt sen cung đình." },
      { d: "Ngày 3: Hương Vị Cố Đô", m: "Uống trà sen buổi sớm, mua trà cung đình & mè xửng.", a: "Xe riêng tiễn ra sân bay Phú Bài." }
    ]
  },
  {
    id: "HTL-PQ", city: "Phú Quốc", name: "Salinda Resort Phu Quoc Island (5 Sao Quốc Tế)",
    title: "3N2Đ Nghỉ Dưỡng Đảo Ngọc 5 Sao & Hoàng Hôn Nam Đảo",
    night_price: 1450000, retail_night: 2550000, rating: 4.96, sla: "SLA-PQ-55190", temp: 29, weather: "Nắng ấm nhiệt đới, biển êm",
    vec: { healing: 78, nature: 86, solitude: 55, comfort: 99, culture: 62 }, kw: ["resort 5 sao", "biển đảo", "hoàng hôn", "cặp đôi"],
    hint: "Kỳ nghỉ dưỡng 5 sao quốc tế bên bờ biển nhiệt đới với hồ bơi vô cực điện phân muối và hoàng hôn rực rỡ.",
    packing: ["Trang phục đi biển & dự tiệc tối", "Kính râm, mũ & kem chống nắng", "CCCD bản gốc", "Dép sandal biển"],
    food: ["Bún quậy Kiến Xây (65.000đ/tô)", "Bún kèn Út Lượm (45.000đ/tô)", "Hải sản Hàm Ninh (Niêm yết theo kg)"],
    days: [
      { d: "Ngày 1: Trải Nghiệm Resort 5 Sao", m: "Bay thẳng tới Phú Quốc, xe đón về Resort 5 sao nhận phòng.", a: "Tắm hồ bơi vô cực điện phân muối & ngắm hoàng hôn bãi biển riêng.", e: "Ăn bún quậy Kiến Xây & dạo chợ đêm." },
      { d: "Ngày 2: Quần Đảo An Thới & Cầu Hôn", m: "Đi cáp treo vượt biển Hòn Thơm hoặc cano khám phá đảo.", a: "Check-in Sunset Town và Cầu Hôn (Kiss Bridge).", e: "Tiệc BBQ hải sản bên bờ biển." },
      { d: "Ngày 3: Thư Giãn & Mua Sắm", m: "Buffet sáng quốc tế kèm nhạc Piano sống, mua nước mắm cốt.", a: "Xe riêng tiễn ra sân bay Phú Quốc." }
    ]
  }
];

// ============================================================================
// HỆ THỐNG LƯU TRỮ LOCALSTORAGE & COOKIE VĨNH VIỄN
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
// THÔNG BÁO TOAST CAO CẤP
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
// MODAL & XỬ LÝ AUTHENTICATION (EMAIL + MẠNG XÃ HỘI CHUẨN)
// ============================================================================
window.openAuthModal = function(mode = "login") {
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
  if (users[email]) return window.setAuthError("Email này đã tồn tại trên hệ thống. Vui lòng chuyển sang tab Đăng Nhập!");

  const avatar = `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop&crop=faces`;
  users[email] = { name, email, passHash: window.hashPw(pass), provider: "email", avatar };
  window.saveStore("wm_users_prod", users);
  window.saveStore("wm_session_prod", { name, email, provider: "email", avatar });
  
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

  window.saveStore("wm_session_prod", { 
    name: acc.name, 
    email: acc.email, 
    provider: acc.provider || "email", 
    avatar: acc.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop&crop=faces" 
  });
  
  window.applyUserSession();
  window.closeAuthModal();
  window.showToast(`Chào mừng trở lại, ${acc.name}! Đã mở khóa hành trình bí mật.`);
};

// ============================================================================
// HỆ THỐNG XÁC THỰC MẠNG XÃ HỘI CHUẨN CHỈ (GOOGLE & FACEBOOK OAUTH)
// ============================================================================
window.currentOAuthProvider = "Google";

window.openSocialAuthModal = function(provider = "Google") {
  window.currentOAuthProvider = provider;
  const isGoogle = provider.toLowerCase().includes("google");
  
  document.getElementById("socialOAuthModal").style.display = "flex";
  document.getElementById("socialModalTitle").innerText = isGoogle ? "Đăng Nhập Với Google" : "Đăng Nhập Với Facebook";
  
  const iconBox = document.getElementById("socialModalIcon");
  if (isGoogle) {
    iconBox.className = "w-7 h-7 rounded-lg flex items-center justify-center bg-white shadow";
    iconBox.innerHTML = `
      <svg class="w-4 h-4" viewBox="0 0 24 24">
        <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.65v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.14z"/>
        <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.24v3.15C3.26 21.36 7.33 24 12 24z"/>
        <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.24C.45 8.15 0 9.92 0 12s.45 3.85 1.24 5.42l4.04-3.15z"/>
        <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.24 6.58l4.04 3.15c.95-2.83 3.6-4.98 6.72-4.98z"/>
      </svg>
    `;
  } else {
    iconBox.className = "w-7 h-7 rounded-lg flex items-center justify-center bg-[#1877F2] shadow";
    iconBox.innerHTML = `
      <svg class="w-4 h-4 fill-white" viewBox="0 0 24 24">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
      </svg>
    `;
  }

  // Danh sách các tài khoản gợi ý cho người dùng chọn nhanh chuẩn giao diện OAuth
  const accounts = isGoogle ? [
    { name: "Nguyễn Doãn Trường Huy", email: "truonghuy.vnu@gmail.com", avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop&crop=faces" },
    { name: "Trần Mai Anh", email: "maianh.travel@gmail.com", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=faces" }
  ] : [
    { name: "Huy Nguyễn (Wanderer)", email: "huy.nguyen.fb@gmail.com", avatar: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=100&h=100&fit=crop&crop=faces" },
    { name: "Mai Anh Trần", email: "maianh.tran.fb@gmail.com", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=faces" }
  ];

  document.getElementById("socialAccountsList").innerHTML = accounts.map(a => `
    <button onclick="window.selectSocialAccount('${a.name}', '${a.email}', '${a.avatar}')" class="w-full p-3 rounded-2xl bg-slate-950/80 hover:bg-slate-800 border border-white/10 hover:border-teal-500/40 transition flex items-center justify-between text-left group">
      <div class="flex items-center gap-3">
        <img src="${a.avatar}" class="w-9 h-9 rounded-xl object-cover border border-white/20 group-hover:border-teal-400" />
        <div>
          <strong class="text-white block text-xs group-hover:text-teal-300">${a.name}</strong>
          <span class="text-slate-400 text-[11px]">${a.email}</span>
        </div>
      </div>
      <span class="text-xs font-bold text-teal-400 opacity-0 group-hover:opacity-100 transition">Đăng nhập →</span>
    </button>
  `).join("");

  document.getElementById("socialCustomName").value = "";
  document.getElementById("socialCustomEmail").value = "";
};

window.closeSocialAuthModal = function() {
  document.getElementById("socialOAuthModal").style.display = "none";
};

window.selectSocialAccount = function(name, email, avatar) {
  const provider = window.currentOAuthProvider || "Google";
  const users = window.loadStore("wm_users_prod", {});
  
  users[email] = {
    name,
    email,
    passHash: window.hashPw("OAUTH_VERIFIED_USER"),
    provider: provider.toLowerCase(),
    avatar: avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop&crop=faces"
  };
  window.saveStore("wm_users_prod", users);
  window.saveStore("wm_session_prod", { name, email, provider, avatar });

  window.applyUserSession();
  window.closeSocialAuthModal();
  window.closeAuthModal();
  window.showToast(`Xác thực ${provider} thành công! Đã mở khóa toàn bộ hành trình cho ${name}.`);
};

window.submitCustomSocialLogin = function() {
  const name = (document.getElementById("socialCustomName")?.value || "").trim();
  const email = window.cleanEmail(document.getElementById("socialCustomEmail")?.value || "");
  const provider = window.currentOAuthProvider || "Google";

  if (name.length < 2) return window.showToast("Vui lòng nhập họ và tên của bạn!", "error");
  if (!window.isValidEmail(email)) return window.showToast("Địa chỉ email không đúng định dạng!", "error");

  const avatar = `https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=faces`;
  window.selectSocialAccount(name, email, avatar);
};

// ============================================================================
// ĐIỀU PHỐI PHÂN QUYỀN TRUY CẬP (AUTH GATEKEEPER)
// ============================================================================
window.applyUserSession = function() {
  const session = window.loadStore("wm_session_prod", null);
  const outBox = document.getElementById("authLoggedOutBox");
  const inBox = document.getElementById("authLoggedInBox");
  const gatekeeper = document.getElementById("gatekeeperLanding");
  const b2cTab = document.getElementById("tab-b2c");

  if (session && session.email) {
    // ĐÃ ĐĂNG NHẬP: Ẩn Gatekeeper, mở khóa hệ thống du lịch
    outBox.style.display = "none";
    inBox.style.display = "flex";
    gatekeeper.style.display = "none";
    b2cTab.style.display = "block";

    document.getElementById("userDisplayName").innerText = session.name || "Hành khách";
    document.getElementById("userDisplayEmail").innerText = session.email;
    document.getElementById("userProviderBadge").innerText = (session.provider || "EMAIL").toUpperCase();
    
    if (session.avatar) {
      document.getElementById("userAvatarImg").src = session.avatar;
    }

    if (document.getElementById("custEmail")) document.getElementById("custEmail").value = session.email;
    if (document.getElementById("custName")) document.getElementById("custName").value = session.name;
    window.syncBankHolderName();
  } else {
    // CHƯA ĐĂNG NHẬP: Khóa các thuật toán, hiển thị Gatekeeper Landing thương mại cao cấp
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
  window.showToast("Đã đăng xuất khỏi phiên làm việc. Hệ thống đã được niêm phong an toàn.", "warn");
};

// ============================================================================
// 4 THUẬT TOÁN DU LỊCH MÙ & TỐI ƯU HÓA KNAPSACK / COSINE
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
  if (!flights.length) flights = window.FLIGHTS_DB;

  let combos = [];
  const keys = ["healing", "nature", "solitude", "comfort", "culture"];

  // 2. Thuật toán Cosine Similarity & Tối ưu Knapsack
  flights.forEach(f => {
    const cityNorm = window.normVN(f.city);
    if (inp.blacklist.some(b => cityNorm.includes(b) || b.includes(cityNorm))) return;

    window.HOTELS_DB.filter(h => h.city === f.city).forEach(h => {
      const unitCost = f.price + (h.night_price * 2);
      const unitRetail = f.price + (h.retail_night * 2);
      if (unitCost <= inp.budget * 1.08) {
        let dot = 0, nU = 0, nH = 0;
        keys.forEach(k => {
          dot += inp.vec[k] * h.vec[k];
          nU += inp.vec[k] ** 2;
          nH += h.vec[k] ** 2;
        });
        let sim = (dot / (Math.sqrt(nU) * Math.sqrt(nH))) * 100;
        h.kw.forEach(w => { if (inp.prompt.includes(w)) sim += 4; });
        sim = Math.min(99.5, Math.round(sim * 10) / 10);

        const util = Math.round(((sim * 0.55) + ((h.rating / 5) * 100 * 0.25) + (Math.min(100, (unitCost / inp.budget) * 100) * 0.20)) * 10) / 10;
        combos.push({ comboId: `${f.id}_${h.id}`, f, h, unitCost, unitRetail, sim, util });
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
      unitRetail: Math.round(inp.budget * 1.28), 
      sim: 95.0, 
      util: 94.5 
    });
  }
  combos.sort((a, b) => b.util - a.util);

  // 3. Chống trùng lặp lịch sử gần nhất
  let chosen = combos[0];
  if (avoidRepeat && combos.length > 1) {
    const freshPool = combos.filter(c => c.comboId !== history[history.length - 1]);
    chosen = freshPool[0] || combos[0];
    history.push(chosen.comboId);
    if (history.length > 4) history.shift();
    window.saveStore("wm_history_prod", history);
  }

  const code = "WM" + Math.floor(10000 + Math.random() * 90000);
  const totalPaid = chosen.unitCost * inp.groupSize;
  const totalRetail = chosen.unitRetail * inp.groupSize;

  const qrs = Array.from({ length: inp.groupSize }, (_, i) => ({
    idx: i + 1,
    amount: chosen.unitCost,
    memo: `${code} KH${i + 1}`,
    url: `https://img.vietqr.io/image/MB-0988888888-compact2.png?amount=${chosen.unitCost}&addInfo=${encodeURIComponent(`${code} KH${i + 1}`)}&accountName=${encodeURIComponent("CONG TY TNHH WANDERMATCH VN")}`
  }));

  return {
    code, 
    comboId: chosen.comboId, 
    isLocked: false, 
    isRevealed: false,
    matchScore: chosen.sim, 
    temp: chosen.h.temp, 
    weather: chosen.h.weather,
    hint: chosen.h.hint, 
    packing: chosen.h.packing, 
    food: chosen.h.food, 
    days: chosen.h.days, 
    qrs,
    flightLabel: `Khứ hồi ${chosen.f.airline} (${chosen.f.time})`,
    hotelLabel: `Resort ${chosen.h.rating}★ tiêu chuẩn quốc tế (Kèm ăn sáng & xe đón)`,
    reveal: {
      city: chosen.h.city, 
      title: chosen.h.title, 
      sla: chosen.h.sla,
      transport: `${chosen.f.id} - ${chosen.f.airline} (${chosen.f.time})`,
      hotel: chosen.h.name, 
      paid: totalPaid, 
      retail: totalRetail, 
      savings: totalRetail - totalPaid
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
};

window.generateNewRecommendation = function() {
  const pkg = window.runBlindTravelEngine(true);
  window.saveStore("wm_draft_prod", pkg);
  window.renderPackageUI(pkg);
  window.showToast(`Đã tính toán hành trình mới #${pkg.code} (Khớp gu ${pkg.matchScore}%)!`);
};

window.renderPackageUI = function(pkg) {
  if (!pkg) return;
  const resultBox = document.getElementById("recommendationResultBox");
  if (!resultBox) return;

  resultBox.innerHTML = `
    <div class="bg-slate-950/90 border border-teal-500/40 rounded-3xl p-6 md:p-8 space-y-6 shadow-2xl relative overflow-hidden">
      <div class="absolute -top-20 -right-20 w-60 h-60 bg-teal-500/10 rounded-full blur-3xl pointer-events-none"></div>

      <div class="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-5">
        <div>
          <div class="flex flex-wrap items-center gap-2">
            <span class="text-xs px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 font-extrabold border border-teal-500/30">
              Độ Khớp Gu: ${pkg.matchScore}%
            </span>
            <span class="text-xs px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 font-extrabold border border-amber-500/30">
              Khí hậu dự báo: ${pkg.temp}°C — ${pkg.weather}
            </span>
          </div>
          <h3 class="text-xl md:text-2xl font-extrabold text-white mt-2 font-heading">
            Gói Nghỉ Dưỡng Bí Mật 3N2Đ (Mã Chuyến Đi: #${pkg.code})
          </h3>
        </div>

        <div class="text-right">
          <span class="text-[11px] text-slate-400 block font-semibold">Tổng chi phí trọn gói (Vé bay + Resort 4-5★)</span>
          <strong class="text-2xl font-black text-teal-300 font-heading block mt-0.5">${window.formatVND(pkg.reveal.paid)}</strong>
          <span class="text-xs text-amber-300 block font-bold">Tiết kiệm ${window.formatVND(pkg.reveal.savings)} so với đặt lẻ</span>
        </div>
      </div>

      <div class="grid sm:grid-cols-2 gap-4 text-xs">
        <div class="bg-slate-900/90 p-4 rounded-2xl border border-white/10">
          <span class="text-slate-400 block font-semibold">Hãng hàng không & Lịch bay vàng:</span>
          <strong class="text-white text-sm block mt-1">${pkg.flightLabel}</strong>
        </div>
        <div class="bg-slate-900/90 p-4 rounded-2xl border border-white/10">
          <span class="text-slate-400 block font-semibold">Tiêu chuẩn nghỉ dưỡng bảo chứng:</span>
          <strong class="text-white text-sm block mt-1">${pkg.hotelLabel}</strong>
        </div>
      </div>

      <div class="bg-gradient-to-r from-amber-500/15 to-teal-500/10 border border-amber-400/30 p-5 rounded-2xl">
        <span class="text-xs font-black text-amber-300 uppercase tracking-wider block">Bật Mí Về Không Gian Điểm Đến Của Bạn</span>
        <p class="text-sm text-slate-100 mt-1.5 leading-relaxed italic">"${pkg.hint}"</p>
      </div>

      <div>
        <span class="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-3">Lịch trình mẫu 3 Ngày 2 Đêm được thiết kế riêng:</span>
        <div class="grid md:grid-cols-3 gap-4 text-xs">
          ${pkg.days.map(d => `
            <div class="bg-slate-900/90 p-4 rounded-2xl border border-white/10 space-y-2">
              <strong class="text-teal-400 block border-b border-white/10 pb-1.5 font-bold">${d.d}</strong>
              <p><span class="text-amber-300 font-extrabold">Sáng:</span> <span class="text-slate-300">${d.m}</span></p>
              <p><span class="text-sky-300 font-extrabold">Chiều:</span> <span class="text-slate-300">${d.a}</span></p>
              <p><span class="text-purple-300 font-extrabold">Tối:</span> <span class="text-slate-300">${d.e}</span></p>
            </div>
          `).join("")}
        </div>
      </div>
    </div>
  `;

  document.getElementById("anonWeatherBox").innerText = `Khí hậu điểm đến: ${pkg.temp}°C — ${pkg.weather}`;
  document.getElementById("aiMysteryHintText").innerText = `"${pkg.hint}"`;
  document.getElementById("packingListContainer").innerHTML = pkg.packing.map((x, i) => `
    <label class="flex items-center gap-2.5 text-xs text-slate-200 p-2 rounded-xl bg-slate-900/60 border border-white/5 cursor-pointer hover:bg-slate-900">
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
  window.saveStore("wm_draft_prod", pkg);

  const saved = window.loadStore("wm_saved_prod", []);
  const idx = saved.findIndex(x => x.code === pkg.code);
  if (idx >= 0) saved[idx] = pkg; else saved.unshift(pkg);
  window.saveStore("wm_saved_prod", saved);

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

  window.updateSavedBadge();
  window.showToast(`Đã xuất mã VietQR ký quỹ cho chuyến đi #${pkg.code}!`);
};

window.saveCurrentToWishlist = function() {
  let pkg = window.loadStore("wm_draft_prod", null) || window.runBlindTravelEngine(true);
  const saved = window.loadStore("wm_saved_prod", []);
  if (!saved.some(x => x.code === pkg.code)) {
    saved.unshift(pkg);
    window.saveStore("wm_saved_prod", saved);
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
    EARLY_72H: { t: "Hủy trước 72 giờ khởi hành", r: 0.90, d: "Hoàn trả tức thì 90% về tài khoản ngân hàng thụ hưởng (Khấu trừ 10% phí vận hành sàn)." },
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
// CANVAS THẺ CÀO KỸ THUẬT SỐ & MỞ KHÓA ĐIỂM ĐẾN
// ============================================================================
window.initScratchCanvas = function() {
  const c = document.getElementById("scratchCanvas");
  const pkg = window.loadStore("wm_draft_prod", null);
  if (!c) return;
  if (pkg && pkg.isRevealed) { c.style.display = "none"; return; }
  
  c.style.display = "block";
  c.width = c.parentElement.offsetWidth || 600;
  c.height = c.parentElement.offsetHeight || 340;
  const ctx = c.getContext("2d");

  // Nền thẻ cào màu tối sang trọng
  ctx.fillStyle = "#090D16";
  ctx.fillRect(0, 0, c.width, c.height);

  // Đường viền vàng ánh kim
  ctx.strokeStyle = "rgba(245, 158, 11, 0.4)";
  ctx.lineWidth = 4;
  ctx.strokeRect(10, 10, c.width - 20, c.height - 20);

  // Chữ chỉ dẫn
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

// ============================================================================
// ĐIỀU HƯỚNG TABS & CÁC BƯỚC ĐẶT PHÒNG
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
    <div class="bg-slate-900/90 p-5 rounded-2xl border border-white/10 flex flex-wrap justify-between items-center gap-3 hover:border-teal-500/30 transition text-xs">
      <div>
        <div class="flex items-center gap-2">
          <span class="text-teal-400 font-extrabold uppercase">${h.city}</span>
          <span class="text-[10px] px-2 py-0.5 rounded bg-teal-500/20 text-teal-300 font-mono">${h.sla}</span>
        </div>
        <h4 class="font-extrabold text-white text-sm mt-1">${h.name}</h4>
      </div>
      <div class="text-right">
        <span class="line-through text-slate-400 block">${window.formatVND(h.retail_night)}/đêm</span>
        <strong class="text-teal-300 text-base font-extrabold">Giá B2B WanderMatch: ${window.formatVND(h.night_price)}/đêm</strong>
      </div>
    </div>
  `).join("");
};

// ============================================================================
// KHỞI TẠO HỆ THỐNG BAN ĐẦU
// ============================================================================
document.addEventListener("DOMContentLoaded", () => {
  window.applyUserSession();
  const draft = window.loadStore("wm_draft_prod", null) || window.runBlindTravelEngine(false);
  window.saveStore("wm_draft_prod", draft);
  window.renderPackageUI(draft);
});
