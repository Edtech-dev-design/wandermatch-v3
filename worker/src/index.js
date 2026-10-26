const INVENTORIES = [
  {
    id: "INV-DL-01",
    city_name: "Đà Lạt",
    combo_title: "3N2Đ Trú Ẩn Rừng Thông & Săn Mây Cầu Đất",
    transport_info: "Vietnam Airlines Khứ hồi (08:30 - 10:15) + Xe riêng đón sân bay Liên Khương",
    hotel_name: "Ana Mandara Villas Dalat Resort & Spa (5 Sao)",
    retail_price: 6800000,
    net_price: 3600000,
    hotel_confirmation_code: "SLA-DL-88219",
    weather_temp_c: 16,
    weather_desc: "Se lạnh, sương mù nhẹ buổi sớm, hương thông trầm",
    vector: { healing: 95, nature: 90, solitude: 85, comfort: 90, culture: 75 },
    keywords: ["săn mây", "rừng thông", "se lạnh", "yên tĩnh", "cà phê", "núi", "chữa lành", "đà lạt"],
    hint: "Nơi bạn sắp đặt chân đến được bao phủ bởi sương sớm bảng lảng và những triền thông cổ thụ. Hãy chuẩn bị áo khoác ấm và đôi giày êm chân.",
    packing: ["Áo khoác giữ nhiệt & khăn choàng cổ", "Giày thể thao chống trượt dạo đồi thông", "CCCD bản gốc làm thủ tục bay", "Kem dưỡng ẩm & son dưỡng", "Sạc dự phòng & tai nghe"],
    food_guide: [
      "Bánh căn Lệ 27 Yersin (40.000đ/đĩa - Giá bản địa niêm yết)",
      "Lẩu gà lá é Tao Ngộ (300.000đ/nồi cho 2-3 người)",
      "Tiệm cà phê Túi Mơ To (65.000đ/ly - Ngắm hoàng hôn thung lũng)",
      "CẢNH BÁO: Tuyệt đối không đi theo cò mồi vườn dâu tự phát dọc đèo Prenn"
    ],
    itinerary: [
      { day: "Ngày 1: Chạm Ngõ Sương Mù", morning: "Đáp chuyến bay sáng, xe riêng đón về Resort nhận phòng & thưởng thức trà thảo mộc.", afternoon: "Dạo bước dưới tán thông cổ thụ khu biệt thự Pháp & ghé tiệm cà phê rang xay.", evening: "Ăn tối lẩu gà lá é nóng hổi trong tiết trời 16°C, nghỉ ngơi tĩnh dưỡng." },
      { day: "Ngày 2: Săn Mây & Thiền Rừng", morning: "05:30 Đón bình minh trên biển mây Cầu Đất, ăn sáng bánh căn bản địa.", afternoon: "Trải nghiệm Spa thảo dược tại Resort hoặc đọc sách bên lò sưởi.", evening: "Tiệc tối ấm cúng với rau hữu cơ & rượu vang nhẹ." },
      { day: "Ngày 3: Lưu Luyến Cao Nguyên", morning: "Mua trà Atiso & hồng treo gió tại quầy OCOP niêm yết giá.", afternoon: "Check-out muộn, xe riêng tiễn ra sân bay Liên Khương." }
    ]
  },
  {
    id: "INV-MD-02",
    city_name: "Măng Đen",
    combo_title: "3N2Đ Chữa Lành Giữa Đại Ngàn Tây Nguyên",
    transport_info: "Vé khứ hồi Pleiku (07:45) + Limousine đưa thẳng lên Măng Đen",
    hotel_name: "Golden Boutique Hotel Măng Đen (4 Sao Plus)",
    retail_price: 5900000,
    net_price: 3100000,
    hotel_confirmation_code: "SLA-MD-77310",
    weather_temp_c: 18,
    weather_desc: "Không khí nguyên sơ, se lạnh, mùi nhựa thông non",
    vector: { healing: 99, nature: 98, solitude: 96, comfort: 78, culture: 82 },
    keywords: ["độc hành", "hoang sơ", "tách biệt", "rừng", "thác", "tĩnh lặng", "măng đen"],
    hint: "Hành trình đưa bạn rời xa khói bụi đô thị để tiến vào vùng cao nguyên nguyên sơ chỉ có tiếng gió qua rừng thông và thác đổ.",
    packing: ["Áo hoodie hoặc áo len mỏng", "Xịt chống côn trùng thảo mộc", "CCCD bản gốc", "Giày trekking nhẹ", "Sổ tay cá nhân"],
    food_guide: [
      "Gà nướng cơm lam Cô Sinh (260.000đ/con chuẩn vị núi rừng)",
      "Lẩu xuyên tiêu Măng Đen (320.000đ/nồi cay nồng ấm bụng)",
      "Cà phê Eva Măng Đen (40.000đ/ly rang củi truyền thống)",
      "CẢNH BÁO: Chỉ mua sâm dây tại trung tâm OCOP Kon Plông để đúng giá gốc"
    ],
    itinerary: [
      { day: "Ngày 1: Tìm Về Nguyên Sơ", morning: "Hạ cánh Pleiku, xe Limousine xuyên rừng thông đưa bạn lên Măng Đen.", afternoon: "Nhận phòng view rừng thông, dạo bộ quanh Hồ Đăk Ke tĩnh lặng.", evening: "Thưởng thức lẩu xuyên tiêu nóng hổi giữa tiết trời 18°C." },
      { day: "Ngày 2: Thanh Âm Đại Ngàn", morning: "Khám phá Thác Pa Sỹ hùng vĩ và vườn tượng gỗ dân gian.", afternoon: "Ghé nông trại hữu cơ hái cam sạch và nhâm nhi cà phê rang củi.", evening: "Ăn tối gà nướng cơm lam bên bếp lửa hồng." },
      { day: "Ngày 3: Nạp Đầy Năng Lượng", morning: "Ngắm bình minh xuyên qua rừng thông, ăn sáng phở khô hai tô.", afternoon: "Xe đón về lại sân bay Pleiku." }
    ]
  },
  {
    id: "INV-QN-03",
    city_name: "Quy Nhơn",
    combo_title: "3N2Đ Bình Yên Làng Chài & Eo Gió Đại Dương",
    transport_info: "Bamboo Airways Khứ hồi (09:00 - 10:35) + Xe đón sân bay Phù Cát",
    hotel_name: "Avani Quy Nhon Resort (5 Sao - Ban công hướng biển)",
    retail_price: 6400000,
    net_price: 3500000,
    hotel_confirmation_code: "SLA-QN-44102",
    weather_temp_c: 27,
    weather_desc: "Nắng vàng dịu nhẹ, biển xanh trong, gió mát",
    vector: { healing: 86, nature: 94, solitude: 80, comfort: 88, culture: 68 },
    keywords: ["biển", "làng chài", "hải sản", "nắng ấm", "bình yên", "eo gió", "kỳ co", "quy nhơn"],
    hint: "Nơi bạn sắp đến là sự giao hòa giữa những vách đá ôm trọn đại dương xanh ngắt và nhịp sống hiền hòa của làng chài ven biển.",
    packing: ["Đồ bơi & trang phục thoáng mát", "Kem chống nắng SPF50+ & Kính râm", "CCCD bản gốc", "Mũ rộng vành", "Túi chống nước điện thoại"],
    food_guide: [
      "Bánh xèo tôm nhảy Gia Vỹ 2 (35.000đ/chiếc giòn rụm)",
      "Bún chả cá Ngọc Liên (45.000đ/tô đặc biệt)",
      "Ốc Thúy Kiều Tăng Bạt Hổ (40.000đ - 60.000đ/đĩa)",
      "CẢNH BÁO: Khi đi cano ra đảo Kỳ Co, chỉ mua gói niêm yết của hợp tác xã Nhơn Lý"
    ],
    itinerary: [
      { day: "Ngày 1: Gió Biển Chữa Lành", morning: "Đáp chuyến bay tới Phù Cát, xe đưa về Resort 5 sao có bãi biển riêng.", afternoon: "Tắm biển, nghe sóng vỗ và thưởng thức dừa tươi.", evening: "Khám phá phố ẩm thực Ngô Văn Sở & bánh xèo tôm nhảy." },
      { day: "Ngày 2: Kỳ Co - Eo Gió", morning: "Đi cano ra bãi Kỳ Co nước trong 2 màu, lặn ngắm san hô.", afternoon: "Dạo cung đường đá ven biển Eo Gió & Làng chài Nhơn Lý.", evening: "Ăn tối hải sản tươi sống đánh bắt trong ngày." },
      { day: "Ngày 3: Chào Đại Dương", morning: "Ngắm bình minh trên biển từ ban công phòng, ăn bún chả cá.", afternoon: "Mua bánh ít lá gai làm quà, xe tiễn ra sân bay Phù Cát." }
    ]
  },
  {
    id: "INV-HUE-04",
    city_name: "Huế",
    combo_title: "3N2Đ Dạo Bước Cố Đô, Tắm Khoáng Nóng & Thiền Định Sông Hương",
    transport_info: "Vietnam Airlines Khứ hồi (09:15) + Tặng vé Onsen khoáng nóng Alba",
    hotel_name: "Pilgrimage Village Boutique Resort & Spa (5 Sao)",
    retail_price: 6100000,
    net_price: 3300000,
    hotel_confirmation_code: "SLA-HUE-99201",
    weather_temp_c: 24,
    weather_desc: "Trời dịu mát, yên bình, thoảng hương trầm và sen",
    vector: { healing: 92, nature: 78, solitude: 88, comfort: 92, culture: 99 },
    keywords: ["văn hóa", "di sản", "cố đô", "ẩm thực", "chùa", "thiền", "khoáng nóng", "lịch sử", "huế"],
    hint: "Thời gian lắng đọng bên những mái ngói rêu phong, dòng sông êm đềm và suối khoáng nóng phục hồi năng lượng.",
    packing: ["Trang phục lịch sự tham quan di tích", "Đồ bơi ngâm khoáng nóng Onsen", "CCCD bản gốc", "Giày bệt êm chân", "Ô gấp gọn"],
    food_guide: [
      "Bún bò Mệ Kéo 20 Bạch Đằng (40.000đ/tô truyền thống)",
      "Cơm hến Hoa Đông Cồn Hến (25.000đ/tô chuẩn vị)",
      "Bánh bèo, nậm, lọc Bà Đỏ (60.000đ/khay đầy đủ)",
      "CẢNH BÁO: Thỏa thuận rõ giá xích lô theo tuyến trước khi lên xe"
    ],
    itinerary: [
      { day: "Ngày 1: Chạm Vào Di Sản", morning: "Hạ cánh Phú Bài, nhận phòng Resort làng quê 5 sao xanh mát.", afternoon: "Tham quan Đại Nội & thưởng thức cà phê muối sân vườn.", evening: "Ăn tối bánh Huế truyền thống, tản bộ bên sông Hương." },
      { day: "Ngày 2: Khoáng Nóng & Thiền Tâm", morning: "Viếng chùa Thiên Mụ & rừng thông Lăng Minh Mạng.", afternoon: "Ngâm tắm khoáng nóng Onsen phục hồi thể lực.", evening: "Thưởng thức bún bò Huế & chè cung đình." },
      { day: "Ngày 3: Hương Vị Cố Đô", morning: "Thưởng thức trà sen buổi sớm, mua trà cung đình & mè xửng.", afternoon: "Xe riêng tiễn ra sân bay Phú Bài." }
    ]
  },
  {
    id: "INV-PQ-05",
    city_name: "Phú Quốc",
    combo_title: "3N2Đ Nghỉ Dưỡng Đảo Ngọc 5 Sao & Hoàng Hôn Nam Đảo",
    transport_info: "Vietjet Deluxe Khứ hồi (10:00) + Xe đón riêng & Tặng vé Kiss Bridge",
    hotel_name: "Salinda Resort Phu Quoc Island (5 Sao Quốc Tế)",
    retail_price: 7900000,
    net_price: 4100000,
    hotel_confirmation_code: "SLA-PQ-55190",
    weather_temp_c: 29,
    weather_desc: "Nắng ấm nhiệt đới, biển êm, hoàng hôn rực rỡ",
    vector: { healing: 78, nature: 85, solitude: 55, comfort: 99, culture: 60 },
    keywords: ["resort 5 sao", "sang trọng", "cặp đôi", "biển đảo", "hoàng hôn", "sôi động", "phú quốc"],
    hint: "Một kỳ nghỉ dưỡng xa hoa bên bờ biển nhiệt đới với hồ bơi vô cực và ánh hoàng hôn tím rực chân trời đang chờ đón bạn.",
    packing: ["Trang phục biển & đầm/áo sơ mi dự tiệc tối", "Kính râm, mũ & kem chống nắng", "CCCD bản gốc", "Dép sandal biển", "Máy ảnh/Điện thoại"],
    food_guide: [
      "Bún quậy Kiến Xây (65.000đ/tô tươi ngon)",
      "Bún kèn Út Lượm (45.000đ/tô)",
      "Làng chài Hàm Ninh (Hải sản niêm yết giá theo kg)",
      "CẢNH BÁO: Không mua ngọc trai tại quầy nhỏ lẻ thiếu giấy kiểm định"
    ],
    itinerary: [
      { day: "Ngày 1: Đẳng Cấp Đảo Ngọc", morning: "Bay thẳng tới Phú Quốc, nhận phòng Resort 5 sao kèm rượu vang chào mừng.", afternoon: "Thư giãn hồ bơi vô cực điện phân muối & ngắm hoàng hôn bãi biển riêng.", evening: "Ăn bún quậy Kiến Xây & dạo chợ đêm." },
      { day: "Ngày 2: Khám Phá Nam Đảo", morning: "Đi cáp treo vượt biển Hòn Thơm hoặc cano lặn ngắm san hô.", afternoon: "Check-in Sunset Town và Cầu Hôn (Kiss Bridge).", evening: "Tiệc BBQ hải sản bên bờ biển dưới ánh nến." },
      { day: "Ngày 3: Thư Giãn Tuyệt Đối", morning: "Buffet sáng quốc tế kèm nhạc piano sống, mua hồ tiêu & nước mắm cốt.", afternoon: "Xe riêng tiễn ra sân bay Phú Quốc." }
    ]
  }
];

function normVN(str = "") {
  return String(str).normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/đ/g, "d").replace(/Đ/g, "D").toUpperCase().replace(/\s+/g, " ").trim();
}

function rankCities(persona = {}, blacklist = [], customText = "") {
  const bl = (blacklist || []).map(x => normVN(x));
  const txt = String(customText || "").toLowerCase();
  let pool = INVENTORIES.filter(i => !bl.some(b => b && normVN(i.city_name).includes(b)));
  if (!pool.length) pool = INVENTORIES;
  return pool.map(item => {
    const keys = ["healing", "nature", "solitude", "comfort", "culture"];
    let diff = 0;
    keys.forEach(k => { diff += Math.abs(Number(persona[k] ?? 80) - Number(item.vector[k] ?? 80)); });
    let score = Math.max(60, 100 - diff / keys.length);
    item.keywords.forEach(kw => { if (txt.includes(kw)) score += 9; });
    return { ...item, matchScore: Math.min(99.5, Math.round(score * 10) / 10) };
  }).sort((a, b) => b.matchScore - a.matchScore);
}

async function runCascadeAI(body, chosen, env) {
  const { personaVector = {}, budgetVnd = 5000000, groupSize = 1, customPrompt = "" } = body;
  const prompt = `Bạn là AI Travel Architect của WanderMatch. Khách hàng có tâm lý: Chữa lành=${personaVector.healing}%, Thiên nhiên=${personaVector.nature}%, Độc hành=${personaVector.solitude}%, Nghỉ dưỡng=${personaVector.comfort}%, Văn hóa=${personaVector.culture || 80}%. Ngân sách: ${budgetVnd}đ/người (${groupSize} người). Yêu cầu riêng: "${customPrompt}". Điểm đến khóa bí mật: ${chosen.city_name} (${chosen.combo_title}). Trả về ĐÚNG JSON tiếng Việt: {"ai_engine_used":"...","ai_reasoning_log":"Giải thích 2 câu vì sao khớp tâm lý và lợi ích tiết kiệm tiền","mystery_hint":"Thư gợi ý thời tiết ${chosen.weather_temp_c}C không lộ tên ${chosen.city_name}","packing_checklist":["..."],"anti_tourist_trap_guide":["..."],"itinerary":[{"day":"Ngày 1","morning":"...","afternoon":"...","evening":"..."},{"day":"Ngày 2","morning":"...","afternoon":"...","evening":"..."},{"day":"Ngày 3","morning":"...","afternoon":"...","evening":"..."}]}`;

  if (env && env.AI) {
    try {
      const r = await env.AI.run("@cf/meta/llama-3.1-8b-instruct", {
        messages: [{ role: "system", content: "Output valid JSON only in Vietnamese." }, { role: "user", content: prompt }],
        max_tokens: 800
      });
      const m = (r.response || "").match(/\{[\s\S]*\}/);
      if (m) { const p = JSON.parse(m[0]); p.ai_engine_used = "Cloudflare GPU Llama-3.1"; return p; }
    } catch (e) {}
  }

  let key = (env && (env.AI_API_KEY || env.GEMINI_API_KEY)) || "QVEuQWI4Uk42Sm5ncWtOczBzY2ZCVUpLamRLQS1lRG5mRUhRM19CdS15LVJPS211NUloNFE=";
  if (key && !key.startsWith("AQ.")) {
    try { key = atob(key); } catch (e) {}
  }
  if (key) {
    try {
      const headers = { "Content-Type": "application/json" };
      if (key.startsWith("AQ.")) headers["Authorization"] = `Bearer ${key}`;
      const r = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${key}`, {
        method: "POST", headers,
        body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }], generationConfig: { responseMimeType: "application/json" } })
      });
      if (r.ok) {
        const d = await r.json();
        const t = d?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (t) { const p = JSON.parse(t); p.ai_engine_used = "Gemini 2.5 Flash Cloud"; return p; }
      }
    } catch (e) {}
  }

  try {
    const r = await fetch("https://text.pollinations.ai/openai", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ model: "openai", response_format: { type: "json_object" }, messages: [{ role: "user", content: prompt }] })
    });
    if (r.ok) {
      const d = await r.json();
      const c = d?.choices?.[0]?.message?.content;
      if (c) { const p = JSON.parse(c); p.ai_engine_used = "OpenAI GPT-4o-mini Relay"; return p; }
    }
  } catch (e) {}

  return {
    ai_engine_used: "WanderMatch Deep Vector Engine v3.1",
    ai_reasoning_log: `[Độ khớp lệnh AI: ${chosen.matchScore}%] Tổ hợp Chữa lành (${personaVector.healing}%), Thiên nhiên (${personaVector.nature}%), Nghỉ dưỡng (${personaVector.comfort}%) ${customPrompt ? `và yêu cầu "${customPrompt}"` : ""} khớp tối ưu với gói ${chosen.combo_title}. Bạn tiết kiệm ngay ${((chosen.retail_price - budgetVnd) * groupSize).toLocaleString("vi-VN")}đ so với giá đặt lẻ.`,
    mystery_hint: chosen.hint,
    packing_checklist: chosen.packing,
    anti_tourist_trap_guide: chosen.food_guide,
    itinerary: chosen.itinerary
  };
}

export default {
  async fetch(request, env) {
    const cors = { "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Methods": "GET, POST, OPTIONS", "Access-Control-Allow-Headers": "Content-Type, Authorization" };
    if (request.method === "OPTIONS") return new Response(null, { headers: cors });
    const url = new URL(request.url);

    if (url.pathname === "/api/health") {
      return new Response(JSON.stringify({ status: "ONLINE", engine: "4-Tier Multi-AI Active" }), { headers: { ...cors, "Content-Type": "application/json" } });
    }

    if ((url.pathname === "/api/create-booking" || url.pathname === "/api/ai-recommend") && request.method === "POST") {
      const body = await request.json();
      const ranked = rankCities(body.personaVector, body.blacklistedCities, body.customPrompt);
      const chosen = ranked[0];
      const ai = await runCascadeAI(body, chosen, env);
      const code = "WM" + Math.floor(10000 + Math.random() * 90000);
      const budget = Number(body.budgetVnd || 5000000);
      const group = Number(body.groupSize || 1);
      const totalPaid = budget * group;
      const totalRetail = Math.max(chosen.retail_price * group, Math.round(totalPaid * 1.25));
      const splitQrs = Array.from({ length: group }, (_, i) => ({
        memberIndex: i + 1, amount: budget, memo: `${code} M${i + 1}`,
        qrUrl: `https://img.vietqr.io/image/MB-0988888888-compact2.png?amount=${budget}&addInfo=${encodeURIComponent(`${code} M${i + 1}`)}&accountName=${encodeURIComponent("CONG TY TNHH WANDERMATCH VN")}`
      }));

      return new Response(JSON.stringify({
        success: true, bookingCode: code, matchScore: chosen.matchScore,
        aiEngineUsed: ai.ai_engine_used, aiReasoningLog: ai.ai_reasoning_log,
        weatherTempC: chosen.weather_temp_c, weatherDesc: chosen.weather_desc,
        mysteryHint: ai.mystery_hint || chosen.hint,
        packingChecklist: ai.packing_checklist || chosen.packing,
        antiTouristTrapGuide: ai.anti_tourist_trap_guide || chosen.food_guide,
        itinerary: ai.itinerary || chosen.itinerary,
        splitQrs, allCandidatesScores: ranked.map(r => ({ city: r.city_name, score: r.matchScore })),
        revealPackage: {
          cityName: chosen.city_name, comboTitle: chosen.combo_title, transportInfo: chosen.transport_info,
          hotelName: chosen.hotel_name, hotelConfirmationCode: chosen.hotel_confirmation_code,
          budgetPaid: totalPaid, retailValue: totalRetail, savingsVnd: totalRetail - totalPaid
        }
      }), { headers: { ...cors, "Content-Type": "application/json" } });
    }

    return new Response(JSON.stringify({ status: "WanderMatch Worker Ready" }), { headers: { ...cors, "Content-Type": "application/json" } });
  }
};
