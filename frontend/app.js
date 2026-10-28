// ============================================================================
// WANDERMATCH PRODUCTION ENGINE — CLEAN ARCHITECTURE FOR FLASH IDE
// ============================================================================

window.FLIGHTS_DB = [
  { id: "VN151", origin: "HAN", city: "Đà Lạt", airline: "Vietnam Airlines", time: "08:30 - 10:15", price: 2100000 },
  { id: "VJ403", origin: "HAN", city: "Đà Lạt", airline: "Vietjet Deluxe", time: "10:20 - 12:05", price: 1650000 },
  { id: "QH121", origin: "HAN", city: "Quy Nhơn", airline: "Bamboo Airways", time: "09:00 - 10:35", price: 1950000 },
  { id: "VN181", origin: "HAN", city: "Măng Đen", airline: "Vietnam Airlines (Pleiku + Xe riêng)", time: "07:45 - 10:30", price: 2050000 },
  { id: "VN137", origin: "HAN", city: "Huế", airline: "Vietnam Airlines", time: "09:15 - 10:30", price: 1600000 },
  { id: "VJ971", origin: "HAN", city: "Phú Quốc", airline: "Vietjet Deluxe", time: "09:40 - 11:50", price: 2450000 },
  { id: "VN123", origin: "HAN", city: "Nha Trang", airline: "Vietnam Airlines", time: "08:15 - 10:05", price: 1980000 },
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
    packing: ["Áo khoác giữ nhiệt & khăn choàng cổ", "Giày thể thao đi bộ đồi thông", "CCCD bản gốc làm thủ tục bay", "Kem dưỡng ẩm"],
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
    packing: ["Áo khoác nhẹ hoặc áo len mỏng", "Xịt chống côn trùng thảo mộc", "CCCD bản gốc", "Giày thể thao"],
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

// TIỆN ÍCH CỐT LÕI
window.loadStore = function(k, def) { try { const r = localStorage.getItem(k); return r ? JSON.parse(r) : def; } catch (e) { return def; } };
window.saveStore = function(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} };
window.formatVND = function(n) { return Number(n || 0).toLocaleString("vi-VN") + "đ"; };
window.normVN = function(s = "") { return String(s).normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/đ/g, "d").replace(/Đ/g, "D").toUpperCase().replace(/\s+/g, " ").trim(); };
window.cleanEmail = function(e = "") { return String(e || "").trim().toLowerCase(); };

// KIỂM TRA ĐỊNH DẠNG EMAIL NGHIÊM NGẶT (CHẶN .com2, .vn123)
window.isValidEmail = function(email) {
  const e = window.cleanEmail(email);
  if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,8}$/.test(e)) return false;
  const tld = e.split(".").pop();
  return !/[0-9]/.test(tld);
};

window.hashPw = function(pw = "") {
  let h = 5381;
  const s = "WM_PROD_" + String(pw);
  for (let i = 0; i < s.length; i++) h = ((h << 5) + h) + s.charCodeAt(i);
  return "pw_" + (h >>> 0).toString(16);
};

window.showToast = function(msg, type = "success") {
  let box = document.getElementById("wmToastBox");
  if (!box) {
    box = document.createElement("div");
    box.id = "wmToastBox";
    box.style.cssText = "position:fixed;top:20px;right:20px;z-index:9999;display:flex;flex-direction:column;gap:8px;";
    document.body.appendChild(box);
  }
  const el = document.createElement("div");
  const bg = type === "error" ? "#E11D48" : (type === "warn" ? "#D97706" : "#0D9488");
  el.style.cssText = `background:${bg};color:#fff;padding:12px 18px;border-radius:12px;font-size:12px;font-weight:700;box-shadow:0 10px 25px rgba(0,0,0,0.4);`;
  el.innerText = msg;
  box.appendChild(el);
  setTimeout(() => el.remove(), 3200);
};

// ============================================================================
// 1. QUẢN LÝ ĐĂNG KÝ & ĐĂNG NHẬP CHUẨN THƯƠNG MẠI (KHÔNG DỰNG SẴN TÀI KHOẢN GIẢ)
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
  document.getElementById("tabBtnLogin").className = isLogin ? "px-4 py-2 rounded-xl font-extrabold bg-teal-500 text-slate-950" : "px-4 py-2 rounded-xl font-bold bg-white/5 text-slate-300";
  document.getElementById("tabBtnRegister").className = !isLogin ? "px-4 py-2 rounded-xl font-extrabold bg-teal-500 text-slate-950" : "px-4 py-2 rounded-xl font-bold bg-white/5 text-slate-300";
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
  if (!window.isValidEmail(email)) return window.setAuthError("Định dạng Email không hợp lệ (Không dùng đuôi chứa số như .com2)!");
  if (pass.length < 6) return window.setAuthError("Mật khẩu phải có tối thiểu 6 ký tự.");
  if (pass !== confirm) return window.setAuthError("Mật khẩu nhập lại không khớp.");

  const users = window.loadStore("wm_users_prod", {});
  if (users[email]) return window.setAuthError("Email này đã được đăng ký. Vui lòng chuyển sang tab Đăng Nhập!");

  const newUser = { name, email, passHash: window.hashPw(pass), createdAt: new Date().toISOString() };
  users[email] = newUser;
  window.saveStore("wm_users_prod", users);
  window.saveStore("wm_session_prod", { name, email });
  window.applyUserSession();
  window.closeAuthModal();
  window.showToast(`Đăng ký thành công! Chào mừng ${name}.`);
};

window.submitLogin = function() {
  const email = window.cleanEmail(document.getElementById("loginEmail")?.value || "");
  const pass = document.getElementById("loginPass")?.value || "";

  if (!window.isValidEmail(email)) return window.setAuthError("Địa chỉ Email không đúng định dạng.");
  const users = window.loadStore("wm_users_prod", {});
  const acc = users[email];

  if (!acc) return window.setAuthError("Email này chưa được đăng ký! Vui lòng bấm sang tab 'Đăng Ký Tài Khoản'.");
  if (acc.passHash !== window.hashPw(pass)) return window.setAuthError("Mật khẩu không chính xác. Vui lòng kiểm tra lại!");

  window.saveStore("wm_session_prod", { name: acc.name, email: acc.email });
  window.applyUserSession();
  window.closeAuthModal();
  window.showToast(`Chào mừng trở lại, ${acc.name}!`);
};

window.applyUserSession = function() {
  const session = window.loadStore("wm_session_prod", null);
  const outBox = document.getElementById("authLoggedOutBox");
  const inBox = document.getElementById("authLoggedInBox");
  if (session && session.email) {
    outBox.style.display = "none";
    inBox.style.display = "flex";
    document.getElementById("userDisplayName").innerText = session.name;
    document.getElementById("userDisplayEmail").innerText = session.email;
    if (document.getElementById("custEmail")) document.getElementById("custEmail").value = session.email;
    if (document.getElementById("custName")) document.getElementById("custName").value = session.name;
    window.syncBankHolderName();
  } else {
    outBox.style.display = "flex";
    inBox.style.display = "none";
  }
  window.updateSavedBadge();
};

window.logoutUser = function() {
  localStorage.removeItem("wm_session_prod");
  window.applyUserSession();
  window.showToast("Đã đăng xuất. Tài khoản và chuyến đi của bạn vẫn được lưu an toàn.", "warn");
};

// ============================================================================
// 2. BỘ MÁY 4 THUẬT TOÁN DU LỊCH MÙ & CHỐNG TRÙNG LẶP
// ============================================================================
window.getFormInputs = function() {
  return {
    origin: document.getElementById("originInput")?.value || "HAN",
    groupSize: Math.max(1, Number(document.getElementById("groupSizeInput")?.value || 1)),
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

  // Thuật toán 1: Lọc chuyến bay theo điểm đi & trần ngân sách
  let flights = window.FLIGHTS_DB.filter(f => f.origin === inp.origin && f.price <= inp.budget * 0.65);
  if (!flights.length) flights = window.FLIGHTS_DB;

  let combos = [];
  const keys = ["healing", "nature", "solitude", "comfort", "culture"];

  flights.forEach(f => {
    const cityNorm = window.normVN(f.city);
    if (inp.blacklist.some(b => cityNorm.includes(b) || b.includes(cityNorm))) return;

    window.HOTELS_DB.filter(h => h.city === f.city).forEach(h => {
      const unitCost = f.price + (h.night_price * 2);
      const unitRetail = f.price + (h.retail_night * 2);
      if (unitCost <= inp.budget * 1.08) {
        // Thuật toán 2: Cosine Similarity
        let dot = 0, nU = 0, nH = 0;
        keys.forEach(k => { dot += inp.vec[k] * h.vec[k]; nU += inp.vec[k] ** 2; nH += h.vec[k] ** 2; });
        let sim = (dot / (Math.sqrt(nU) * Math.sqrt(nH))) * 100;
        h.kw.forEach(w => { if (inp.prompt.includes(w)) sim += 4; });
        sim = Math.min(99.5, Math.round(sim * 10) / 10);

        // Thuật toán 3: Tối ưu Cái túi (Knapsack)
        const util = Math.round(((sim * 0.55) + ((h.rating / 5) * 100 * 0.25) + (Math.min(100, (unitCost / inp.budget) * 100) * 0.20)) * 10) / 10;
        combos.push({ comboId: `${f.id}_${h.id}`, f, h, unitCost, unitRetail, sim, util });
      }
    });
  });

  if (!combos.length) {
    const f = window.FLIGHTS_DB[0], h = window.HOTELS_DB[0];
    combos.push({ comboId: `${f.id}_${h.id}`, f, h, unitCost: inp.budget, unitRetail: Math.round(inp.budget * 1.28), sim: 95.0, util: 94.5 });
  }
  combos.sort((a, b) => b.util - a.util);

  // Thuật toán 4: Chống trùng lặp lịch sử
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
    owner: window.loadStore("wm_session_prod", null)?.email || "guest",
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

// ============================================================================
// 3. HIỂN THỊ GIAO DIỆN & ĐIỀU HƯỚNG 4 BƯỚC
// ============================================================================
window.onFormChange = function() {
  const inp = window.getFormInputs();
  document.getElementById("lblHealing").innerText = `Nghỉ dưỡng & Chữa lành: ${inp.vec.healing}%`;
  document.getElementById("lblNature").innerText = `Thiên nhiên Biển / Rừng: ${inp.vec.nature}%`;
  document.getElementById("lblSolitude").innerText = `Không gian yên tĩnh, riêng tư: ${inp.vec.solitude}%`;
  document.getElementById("lblComfort").innerText = `Tiện nghi Resort 4-5 Sao: ${inp.vec.comfort}%`;
  document.getElementById("lblCulture").innerText = `Văn hóa, Di sản & Ẩm thực: ${inp.vec.culture}%`;
  document.getElementById("slaRetailGuarantee").innerText = `Giá trị thực >= ${window.formatVND(Math.round(inp.budget * inp.groupSize * 1.25))}`;

  const pkg = window.runBlindTravelEngine(false);
  window.saveStore("wm_draft_prod", pkg);
  window.renderPackageUI(pkg);
};

window.generateNewRecommendation = function() {
  const pkg = window.runBlindTravelEngine(true);
  window.saveStore("wm_draft_prod", pkg);
  window.renderPackageUI(pkg);
  window.showToast(`Đã tìm thấy gói hành trình mới #${pkg.code} (Phù hợp ${pkg.matchScore}%)!`);
};

window.renderPackageUI = function(pkg) {
  if (!pkg) return;
  const box = document.getElementById("recommendationResultBox");
  box.innerHTML = `
    <div class="bg-slate-950/90 border border-teal-500/35 rounded-2xl p-6 space-y-5 shadow-xl">
      <div class="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4">
        <div>
          <div class="flex items-center gap-2">
            <span class="text-[11px] px-2.5 py-0.5 rounded-full bg-teal-500/20 text-teal-300 font-bold">Độ phù hợp: ${pkg.matchScore}%</span>
            <span class="text-[11px] px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-bold">Thời tiết điểm đến: ${pkg.temp}°C — ${pkg.weather}</span>
          </div>
          <h3 class="text-lg font-extrabold text-white mt-1.5">Gói Hành Trình Bí Mật 3 Ngày 2 Đêm (Mã: #${pkg.code})</h3>
        </div>
        <div class="text-right">
          <span class="text-[11px] text-slate-400 block">Tổng chi phí trọn gói (Vé bay + Resort)</span>
          <strong class="text-xl font-extrabold text-teal-400">${window.formatVND(pkg.reveal.paid)}</strong>
          <span class="text-[11px] text-amber-300 block font-semibold">Tiết kiệm ${window.formatVND(pkg.reveal.savings)} so với giá đặt lẻ</span>
        </div>
      </div>

      <div class="grid sm:grid-cols-2 gap-3.5 text-xs">
        <div class="bg-slate-900 p-3.5 rounded-xl border border-white/10"><span class="text-slate-400 block">Chuyến bay khứ hồi:</span><strong class="text-white">${pkg.flightLabel}</strong></div>
        <div class="bg-slate-900 p-3.5 rounded-xl border border-white/10"><span class="text-slate-400 block">Lưu trú cam kết:</span><strong class="text-white">${pkg.hotelLabel}</strong></div>
      </div>

      <div class="bg-amber-500/10 border border-amber-400/30 p-4 rounded-xl">
        <span class="text-xs font-bold text-amber-300 uppercase">Bật mí về Điểm đến Bí mật của bạn</span>
        <p class="text-sm text-slate-100 mt-1">"${pkg.hint}"</p>
      </div>

      <div class="grid md:grid-cols-3 gap-3.5 text-xs">
        ${pkg.days.map(d => `
          <div class="bg-slate-900 p-4 rounded-xl border border-white/10 space-y-1.5">
            <strong class="text-teal-400 block border-b border-white/10 pb-1">${d.d}</strong>
            <p><span class="text-amber-300 font-bold">Sáng:</span> ${d.m}</p>
            <p><span class="text-sky-300 font-bold">Chiều:</span> ${d.a}</p>
            <p><span class="text-purple-300 font-bold">Tối:</span> ${d.e}</p>
          </div>
        `).join("")}
      </div>
    </div>
  `;

  // Đồng bộ sang Bước 3 và Bước 4
  document.getElementById("anonWeatherBox").innerText = `Khí hậu điểm đến: ${pkg.temp}°C — ${pkg.weather}`;
  document.getElementById("aiMysteryHintText").innerText = `"${pkg.hint}"`;
  document.getElementById("packingListContainer").innerHTML = pkg.packing.map((x, i) => `
    <label class="flex items-center gap-2 text-xs text-slate-200"><input type="checkbox" checked class="accent-teal-400 w-4 h-4" /><span>${i + 1}. ${x}</span></label>
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

  if (!window.isValidEmail(email)) return window.showToast("Vui lòng nhập địa chỉ Email hợp lệ!", "error");
  if (name.length < 2 || acc.length < 5) return window.showToast("Vui lòng nhập đầy đủ Họ tên CCCD và Số tài khoản!", "error");
  if (window.normVN(name) !== window.normVN(holder)) return window.showToast("Họ tên CCCD và Chủ tài khoản ngân hàng phải khớp nhau!", "error");

  let pkg = window.loadStore("wm_draft_prod", null) || window.runBlindTravelEngine(true);
  pkg.isLocked = true;
  pkg.customerName = name;
  pkg.owner = window.loadStore("wm_session_prod", null)?.email || email;
  window.saveStore("wm_draft_prod", pkg);

  const saved = window.loadStore("wm_saved_prod", []);
  const idx = saved.findIndex(x => x.code === pkg.code);
  if (idx >= 0) saved[idx] = pkg; else saved.unshift(pkg);
  window.saveStore("wm_saved_prod", saved);

  document.getElementById("lblBookingCode").innerText = `Mã đơn: #${pkg.code}`;
  document.getElementById("qrPaymentSection").style.display = "block";
  document.getElementById("qrCardsContainer").innerHTML = pkg.qrs.map(q => `
    <div class="bg-slate-900 p-3.5 rounded-xl border border-white/10 text-center space-y-2">
      <span class="text-xs font-bold text-teal-400">Hành khách #${q.idx}</span>
      <img src="${q.url}" class="w-40 h-40 mx-auto rounded-lg bg-white p-1" />
      <p class="text-xs font-bold text-white">${window.formatVND(q.amount)}</p>
      <p class="text-[11px] text-slate-400">Nội dung: <strong>${q.memo}</strong></p>
    </div>
  `).join("");

  window.updateSavedBadge();
  window.showToast(`Đã xác nhận đơn đặt chỗ #${pkg.code} & xuất mã VietQR!`);
};

window.saveCurrentToWishlist = function() {
  let pkg = window.loadStore("wm_draft_prod", null) || window.runBlindTravelEngine(true);
  pkg.owner = window.loadStore("wm_session_prod", null)?.email || "guest";
  const saved = window.loadStore("wm_saved_prod", []);
  if (!saved.some(x => x.code === pkg.code)) {
    saved.unshift(pkg);
    window.saveStore("wm_saved_prod", saved);
  }
  window.updateSavedBadge();
  window.showToast(`Đã lưu hành trình #${pkg.code} vào Chuyến Đi Của Tôi!`);
};

window.updateSavedBadge = function() {
  const saved = window.loadStore("wm_saved_prod", []);
  document.getElementById("lblSavedCount").innerText = String(saved.length);
};

window.simulateRefund = function(type) {
  const pkg = window.loadStore("wm_draft_prod", null);
  const paid = pkg ? pkg.reveal.paid : 5000000;
  const map = {
    EARLY_72H: { t: "Hủy trước 72 giờ khởi hành", r: 0.90, d: "Hoàn trả tự động 90% về tài khoản ngân hàng đã liên kết." },
    LATE_24_72H: { t: "Hủy từ 24 giờ đến 72 giờ", r: 0.65, d: "Hoàn trả 65% (Khấu trừ 35% phí giữ phòng Resort cận ngày)." },
    FORCE_MAJEURE: { t: "Sự cố bất khả kháng", r: 0.90, d: "Hỗ trợ hoàn trả 90% sau khi xác minh chứng từ." },
    UNDER_24H: { t: "Hủy dưới 24 giờ trước giờ bay", r: 0.00, d: "Vé máy bay và phòng Resort đã xuất cố định, không áp dụng hoàn hủy." }
  }[type];
  document.getElementById("refundResultBox").innerHTML = `
    <strong class="text-amber-300 block">${map.t}</strong>
    <p class="text-sm font-extrabold text-teal-400 mt-1">Số tiền hoàn nhận về STK: ${window.formatVND(Math.round(paid * map.r))}</p>
    <p class="text-[11px] text-slate-400 mt-0.5">${map.d}</p>
  `;
};

window.initScratchCanvas = function() {
  const c = document.getElementById("scratchCanvas");
  const pkg = window.loadStore("wm_draft_prod", null);
  if (!c) return;
  if (pkg && pkg.isRevealed) { c.style.display = "none"; return; }
  c.style.display = "block";
  c.width = c.parentElement.offsetWidth || 600;
  c.height = c.parentElement.offsetHeight || 320;
  const ctx = c.getContext("2d");
  ctx.fillStyle = "#0F172A";
  ctx.fillRect(0, 0, c.width, c.height);
  ctx.fillStyle = "#2DD4BF";
  ctx.font = "bold 15px Plus Jakarta Sans, sans-serif";
  ctx.textAlign = "center";
  ctx.fillText("CÀO LỚP PHỦ NÀY HOẶC BẤM 'MỞ KHÓA NGAY'", c.width / 2, c.height / 2);
  let draw = false;
  c.onmousedown = () => { draw = true; };
  c.onmouseup = () => { draw = false; };
  c.onmousemove = (e) => {
    if (!draw) return;
    const r = c.getBoundingClientRect();
    ctx.globalCompositeOperation = "destination-out";
    ctx.beginPath();
    ctx.arc(e.clientX - r.left, e.clientY - r.top, 35, 0, Math.PI * 2);
    ctx.fill();
  };
};

window.revealDestinationNow = function() {
  const c = document.getElementById("scratchCanvas");
  if (c) c.style.display = "none";
  const pkg = window.loadStore("wm_draft_prod", null);
  if (pkg) {
    pkg.isRevealed = true;
    window.saveStore("wm_draft_prod", pkg);
    window.showToast(`Điểm đến chính thức của bạn là: ${pkg.reveal.city}!`);
  }
};

window.switchTab = function(tab) {
  ["b2c", "saved", "b2b"].forEach(t => {
    document.getElementById("tab-" + t).style.display = (t === tab) ? "block" : "none";
    document.getElementById("btn-tab-" + t).className = (t === tab)
      ? "px-3.5 py-2 rounded-xl text-xs font-bold bg-teal-500 text-slate-950"
      : "px-3.5 py-2 rounded-xl text-xs font-bold bg-white/5 text-slate-300";
  });
  if (tab === "saved") window.renderSavedTab();
  if (tab === "b2b") window.renderB2BTab();
};

window.goToStep = function(s) {
  [1, 2, 3, 4].forEach(n => {
    document.getElementById("step-panel-" + n).style.display = (n === s) ? "block" : "none";
    document.getElementById("step-nav-" + n).className = (n === s)
      ? "p-3.5 rounded-2xl border border-teal-400 bg-teal-500/15 text-left"
      : "p-3.5 rounded-2xl border border-white/10 bg-slate-900/60 text-left";
  });
  if (s === 4) setTimeout(() => window.initScratchCanvas(), 50);
};

window.renderSavedTab = function() {
  const list = window.loadStore("wm_saved_prod", []);
  const wList = list.filter(x => !x.isLocked);
  const bList = list.filter(x => x.isLocked);

  document.getElementById("savedWishlistContainer").innerHTML = wList.length === 0
    ? `<p class="text-slate-400 italic">Chưa có hành trình yêu thích nào.</p>`
    : wList.map(x => `
      <div class="p-3.5 rounded-xl bg-slate-900 border border-white/10 flex justify-between items-center">
        <div><strong class="text-amber-300 block">Gói #${x.code} (Phù hợp ${x.matchScore}%)</strong><span class="text-slate-400">${window.formatVND(x.reveal.paid)} — Khí hậu ${x.temp}°C</span></div>
        <button onclick="window.openSavedItem('${x.code}', 2)" class="px-3 py-1.5 rounded-lg bg-teal-500 text-slate-950 font-bold">Đặt Ngay →</button>
      </div>
    `).join("");

  document.getElementById("savedBookingsContainer").innerHTML = bList.length === 0
    ? `<p class="text-slate-400 italic">Chưa có đơn đặt chỗ nào.</p>`
    : bList.map(x => `
      <div class="p-3.5 rounded-xl bg-slate-900 border border-teal-500/30 flex justify-between items-center">
        <div><strong class="text-teal-300 block">Đơn #${x.code} — ${x.customerName}</strong><span class="text-white">${x.isRevealed ? x.reveal.city : "Đang niêm phong"} (${window.formatVND(x.reveal.paid)})</span></div>
        <button onclick="window.openSavedItem('${x.code}', 4)" class="px-3 py-1.5 rounded-lg bg-amber-400 text-slate-950 font-bold">Xem Vé →</button>
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
    <div class="bg-slate-900 p-4 rounded-xl border border-white/10 flex justify-between items-center text-xs">
      <div><span class="text-teal-400 font-bold">${h.city} (${h.sla})</span><h4 class="font-bold text-white text-sm mt-0.5">${h.name}</h4></div>
      <div class="text-right"><span class="line-through text-slate-400 block">${window.formatVND(h.retail_night)}/đêm</span><strong class="text-teal-400 text-sm">Giá B2B: ${window.formatVND(h.night_price)}/đêm</strong></div>
    </div>
  `).join("");
};

document.addEventListener("DOMContentLoaded", () => {
  // Xóa sạch bộ nhớ "đồ hàng" cũ để tránh xung đột
  ["wm_users_vault_v4", "wm_active_session_v4", "wm_oauth_user"].forEach(k => localStorage.removeItem(k));
  window.applyUserSession();
  const draft = window.loadStore("wm_draft_prod", null) || window.runBlindTravelEngine(false);
  window.saveStore("wm_draft_prod", draft);
  window.renderPackageUI(draft);
});
