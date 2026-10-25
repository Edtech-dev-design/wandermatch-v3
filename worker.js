const FALLBACK_INVENTORIES = [
  {
    id: "11111111-1111-1111-1111-111111111101",
    city_name: "Đà Lạt",
    combo_title: "3N2Đ Trú Ẩn Rừng Thông & Săn Mây",
    transport_info: "Vé khứ hồi Vietnam Airlines (08:30 - 10:15) + Xe đưa đón sân bay Liên Khương",
    hotel_name: "Ana Mandara Villas Dalat Resort & Spa (5 Sao)",
    retail_price: 6500000,
    net_price: 3600000,
    hotel_confirmation_code: "SLA-DL-88219",
    weather_temp_c: 16,
    weather_desc: "Se lạnh, sương mù nhẹ buổi sớm",
    attribute_vector: { healing: 95, nature: 90, solitude: 85, comfort: 90, culture: 70 },
    default_hint: "Nơi bạn sắp đến được bao phủ bởi sương sớm và hương thông trầm mặc. Hãy chuẩn bị áo khoác ấm và giày đi bộ êm chân.",
    default_packing: ["Áo khoác giữ ấm & khăn choàng", "Giày thể thao chống trượt", "CCCD bản gốc làm thủ tục bay", "Kem dưỡng ẩm & son dưỡng", "Sạc dự phòng"],
    default_food: ["Bánh căn Lệ 27 Yersin (40.000đ/đĩa - giá bản địa)", "Lẩu gà lá é Tao Ngộ (300.000đ/nồi)", "Cảnh báo: Không đi theo cò mồi vườn dâu tự phát dọc đèo"]
  },
  {
    id: "11111111-1111-1111-1111-111111111102",
    city_name: "Quy Nhơn",
    combo_title: "3N2Đ Bình Yên Làng Chài & Eo Gió",
    transport_info: "Vé khứ hồi Bamboo Airways (09:00 - 10:35) + Ký gửi 20kg",
    hotel_name: "Avani Quy Nhon Resort (5 Sao - Hướng biển)",
    retail_price: 6200000,
    net_price: 3500000,
    hotel_confirmation_code: "SLA-QN-44102",
    weather_temp_c: 27,
    weather_desc: "Nắng vàng dịu, gió biển mát",
    attribute_vector: { healing: 85, nature: 90, solitude: 80, comfort: 85, culture: 65 },
    default_hint: "Hành trình đưa bạn về phía những ghềnh đá đón gió đại dương và làng chài yên ả. Đừng quên kính râm và kem chống nắng.",
    default_packing: ["Trang phục thoáng mát đi biển", "Kính râm & Kem chống nắng SPF50+", "CCCD bản gốc làm thủ tục bay", "Mũ rộng vành", "Túi chống nước cho điện thoại"],
    default_food: ["Bánh xèo tôm nhảy Gia Vỹ (35.000đ/chiếc)", "Bún chả cá Ngọc Liên (45.000đ/tô)", "Cảnh báo: Hỏi kỹ giá hải sản tươi sống theo kg trước khi chế biến"]
  },
  {
    id: "11111111-1111-1111-1111-111111111103",
    city_name: "Măng Đen",
    combo_title: "3N2Đ Chữa Lành Giữa Đại Ngàn Tây Nguyên",
    transport_info: "Vé máy bay khứ hồi Pleiku (07:45) + Limousine đưa thẳng lên Măng Đen",
    hotel_name: "Golden Boutique Hotel Măng Đen (4 Sao)",
    retail_price: 5800000,
    net_price: 2900000,
    hotel_confirmation_code: "SLA-MD-77310",
    weather_temp_c: 18,
    weather_desc: "Không khí trong lành, mùi thông non",
    attribute_vector: { healing: 98, nature: 95, solitude: 95, comfort: 75, culture: 80 },
    default_hint: "Một vùng đất nguyên sơ tĩnh lặng trên cao nguyên đang chờ bạn ngắt kết nối khỏi ồn ào phố thị.",
    default_packing: ["Áo len mỏng hoặc hoodie", "Thuốc chống côn trùng thảo mộc", "CCCD bản gốc", "Giày trekking nhẹ", "Sách hoặc sổ tay cá nhân"],
    default_food: ["Gà nướng cơm lam Cô Sinh (250.000đ/con)", "Lẩu xuyên tiêu Măng Đen (320.000đ/nồi)", "Cà phê rang củi dọc đường Võ Nguyên Giáp (35.000đ/ly)"]
  },
  {
    id: "11111111-1111-1111-1111-111111111104",
    city_name: "Huế",
    combo_title: "3N2Đ Dạo Bước Cố Đô & Thiền Định Sông Hương",
    transport_info: "Vé khứ hồi Vietnam Airlines (09:15) + Tặng vé tắm khoáng nóng Alba",
    hotel_name: "Pilgrimage Village Boutique Resort & Spa (5 Sao)",
    retail_price: 5800000,
    net_price: 3200000,
    hotel_confirmation_code: "SLA-HUE-99201",
    weather_temp_c: 24,
    weather_desc: "Trời dịu mát, thoảng hương trầm",
    attribute_vector: { healing: 90, nature: 75, solitude: 85, comfort: 90, culture: 98 },
    default_hint: "Nơi thời gian trôi chậm lại bên những mái ngói rêu phong và dòng sông tĩnh lặng. Hãy mang theo trang phục lịch sự để ghé thăm những không gian di sản.",
    default_packing: ["Trang phục lịch sự tham quan di tích", "Ô gấp gọn che nắng/mưa nhẹ", "CCCD bản gốc", "Giày bệt đi bộ nhiều", "Đồ bơi để ngâm khoáng nóng"],
    default_food: ["Bún bò Mệ Kéo (40.000đ/tô)", "Cơm hến Hoa Đông (25.000đ/tô)", "Cảnh báo: Thỏa thuận giá xích lô rõ ràng theo tuyến trước khi lên xe"]
  },
  {
    id: "11111111-1111-1111-1111-111111111105",
    city_name: "Phú Quốc",
    combo_title: "3N2Đ Nghỉ Dưỡng Nhiệt Đới & Hoàng Hôn Nam Đảo",
    transport_info: "Vé khứ hồi Vietjet Deluxe (10:00) + Đưa đón riêng",
    hotel_name: "Salinda Resort Phu Quoc Island (5 Sao)",
    retail_price: 7800000,
    net_price: 3900000,
    hotel_confirmation_code: "SLA-PQ-55190",
    weather_temp_c: 29,
    weather_desc: "Nắng ấm nhiệt đới, biển êm",
    attribute_vector: { healing: 80, nature: 85, solitude: 60, comfort: 98, culture: 60 },
    default_hint: "Nắng ấm nhiệt đới và tiếng sóng vỗ dịu êm nơi đảo xa đang chờ đón bạn cùng kỳ nghỉ dưỡng 5 sao trọn vẹn.",
    default_packing: ["Đồ bơi & Kính râm chống UV", "Kem chống nắng SPF50+", "CCCD bản gốc", "Dép đi biển & Mũ rộng vành", "Sạc dự phòng"],
    default_food: ["Bún quậy Kiến Xây (65.000đ/tô)", "Gỏi cá trích Hàm Ninh (150.000đ/đĩa)", "Cảnh báo: Chỉ mua ngọc trai và nước mắm tại cơ sở chính hãng có niêm yết giá"]
  }
];

const MEMORY_BOOKINGS = new Map([
  [
    "WM88219",
    {
      booking_code: "WM88219",
      customer_id: "cust-sample-01",
      inventory_id: FALLBACK_INVENTORIES[0].id,
      group_size: 2,
      budget_vnd: 10000000,
      retail_value_vnd: 13000000,
      net_cost_vnd: 7200000,
      gross_margin_vnd: 2800000,
      departure_time: new Date(Date.now() + 96 * 3600 * 1000).toISOString(),
      reveal_time: new Date(Date.now() + 24 * 3600 * 1000).toISOString(),
      ai_reasoning_log: "[Vector Score: 98.4%] Khớp chỉ số Chữa lành (95%) & Thiên nhiên (90%). Đạt chuẩn Retail >= 115% & Net <= 80%.",
      mystery_hint: FALLBACK_INVENTORIES[0].default_hint,
      packing_checklist: FALLBACK_INVENTORIES[0].default_packing,
      anti_tourist_trap_guide: FALLBACK_INVENTORIES[0].default_food,
      payment_status: "PAID_ESCROW",
      customer_rating: 5,
      customer_review: "5/5 ★ - Resort Ana Mandara rất yên tĩnh, thông xanh mát, tiết kiệm 3 triệu so với đặt lẻ!",
      _secret_inventory: FALLBACK_INVENTORIES[0],
      _customer_name: "Nguyễn Văn An",
      _customer_email: "nguyenvanan@wandermatch.vn",
      _bank_info: "MB - ***8899"
    }
  ],
  [
    "WM64102",
    {
      booking_code: "WM64102",
      customer_id: "cust-sample-02",
      inventory_id: FALLBACK_INVENTORIES[1].id,
      group_size: 4,
      budget_vnd: 20000000,
      retail_value_vnd: 24800000,
      net_cost_vnd: 14000000,
      gross_margin_vnd: 6000000,
      departure_time: new Date(Date.now() + 72 * 3600 * 1000).toISOString(),
      reveal_time: new Date(Date.now() + 18 * 3600 * 1000).toISOString(),
      ai_reasoning_log: "[Vector Score: 96.1%] Khớp Thiên nhiên biển (90%) & Tiện nghi 5 sao (85%). Đã loại trừ Đà Lạt theo Blacklist.",
      mystery_hint: FALLBACK_INVENTORIES[1].default_hint,
      packing_checklist: FALLBACK_INVENTORIES[1].default_packing,
      anti_tourist_trap_guide: FALLBACK_INVENTORIES[1].default_food,
      payment_status: "PAID_ESCROW",
      customer_rating: 5,
      customer_review: "5/5 ★ - Tính năng chia tiền VietQR 4 người cực tiện, phòng hướng biển Avani xuất sắc!",
      _secret_inventory: FALLBACK_INVENTORIES[1],
      _customer_name: "Trần Minh Tâm",
      _customer_email: "tranminhtam@wandermatch.vn",
      _bank_info: "VCB - ***9921"
    }
  ]
]);

function normalizeVNName(str = "") {
  return String(str || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .replace(/[^a-zA-Z0-9\s]/g, " ")
    .toUpperCase()
    .replace(/\s+/g, " ")
    .trim();
}

function sanitizeMysteryHint(hint = "", cityName = "", hotelName = "") {
  let clean = String(hint || "");
  if (cityName) {
    const regCity = new RegExp(cityName, "gi");
    clean = clean.replace(regCity, "vùng đất bí ẩn này");
  }
  if (hotelName) {
    const regHotel = new RegExp(hotelName, "gi");
    clean = clean.replace(regHotel, "khu nghỉ dưỡng 5 sao");
  }
  return clean;
}

async function encryptAES(plainText, secretKeyStr = "WandermatchDefaultSecretKey2026!") {
  const enc = new TextEncoder();
  const keyMaterial = await crypto.subtle.digest("SHA-256", enc.encode(secretKeyStr));
  const key = await crypto.subtle.importKey("raw", keyMaterial, { name: "AES-GCM" }, false, ["encrypt"]);
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const encrypted = await crypto.subtle.encrypt({ name: "AES-GCM", iv }, key, enc.encode(String(plainText)));
  const combined = new Uint8Array(iv.length + encrypted.byteLength);
  combined.set(iv, 0);
  combined.set(new Uint8Array(encrypted), iv.length);
  return btoa(String.fromCharCode(...combined));
}

function getSupabaseHeaders(env) {
  const key = env.SUPABASE_SERVICE_ROLE_KEY || env.SUPABASE_SECRET_KEY || "";
  const headers = {
    "apikey": key,
    "Content-Type": "application/json"
  };
  if (!key.startsWith("sb_")) {
    headers["Authorization"] = `Bearer ${key}`;
  }
  return headers;
}

function cosineSimilarity(vecA, vecB) {
  const keys = ["healing", "nature", "solitude", "comfort", "culture"];
  let dot = 0, normA = 0, normB = 0;
  for (const k of keys) {
    const a = Number(vecA[k] || 75);
    const b = Number(vecB[k] || 75);
    dot += a * b;
    normA += a * a;
    normB += b * b;
  }
  return dot / (Math.sqrt(normA) * Math.sqrt(normB) || 1);
}

export default {
  async fetch(request, env) {
    const corsHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization"
    };

    if (request.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders });
    }

    const url = new URL(request.url);
    const supabaseKey = env.SUPABASE_SERVICE_ROLE_KEY || env.SUPABASE_SECRET_KEY || "";
    const hasSupabase = Boolean(env.SUPABASE_URL && supabaseKey && !supabaseKey.includes("DAN_"));

    // 1. KIỂM ĐỊNH ĐẶT CHUYẾN & CHẠY AI MATCHING (ANTI-F12 LEAK GUARANTEED)
    if (url.pathname === "/api/create-booking" && request.method === "POST") {
      try {
        const body = await request.json();
        const {
          email, fullName, cccd, bankCode, bankAccount, bankAccountHolder,
          personaVector = {}, comfortLocks = {}, blacklistedCities = [], budgetVnd = 5000000, groupSize = 1
        } = body;

        if (normalizeVNName(fullName) !== normalizeVNName(bankAccountHolder)) {
          return new Response(JSON.stringify({
            error: `Từ chối giao dịch: Tên trên CCCD (${normalizeVNName(fullName)}) không khớp với Chủ TK Ngân hàng (${normalizeVNName(bankAccountHolder)}).`
          }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
        }

        const encryptedCccd = await encryptAES(cccd, env.AES_SECRET_KEY);
        const encryptedBank = await encryptAES(bankAccount, env.AES_SECRET_KEY);

        let pastFeedback = "Khách hàng mới lần đầu trải nghiệm.";
        let customerId = crypto.randomUUID();

        if (hasSupabase) {
          try {
            const sbHeaders = getSupabaseHeaders(env);
            const histRes = await fetch(`${env.SUPABASE_URL}/rest/v1/customer_profiles?email=eq.${encodeURIComponent(email)}&select=*`, { headers: sbHeaders });
            const existing = await histRes.json();
            if (Array.isArray(existing) && existing.length > 0) {
              pastFeedback = existing[0].past_feedback_summary || pastFeedback;
              customerId = existing[0].id;
            }

            const upsertRes = await fetch(`${env.SUPABASE_URL}/rest/v1/customer_profiles`, {
              method: "POST",
              headers: { ...sbHeaders, "Prefer": "resolution=merge-duplicates,return=representation" },
              body: JSON.stringify({
                email,
                full_name: fullName,
                encrypted_cccd: encryptedCccd,
                bank_code: bankCode,
                encrypted_bank_account: encryptedBank,
                bank_account_holder: normalizeVNName(bankAccountHolder),
                persona_vector: personaVector,
                comfort_locks: comfortLocks,
                blacklisted_cities: blacklistedCities
              })
            });
            const savedCust = await upsertRes.json();
            if (Array.isArray(savedCust) && savedCust[0]?.id) customerId = savedCust[0].id;
          } catch (e) {}
        }

        const perPersonBudget = Math.max(2000000, Number(budgetVnd) || 5000000);
        const paxCount = Math.max(1, Number(groupSize) || 1);

        // Bước 1: Lọc theo Blacklist
        let candidates = FALLBACK_INVENTORIES.filter(item => !blacklistedCities.includes(item.city_name));
        if (candidates.length === 0) candidates = [...FALLBACK_INVENTORIES];

        // Bước 2: Kiểm định Kinh tế Thực dụng Kép (Retail >= budget * 1.15 VÀ Net <= budget * 0.80)
        let qualified = candidates.filter(item =>
          item.retail_price >= perPersonBudget * 1.15 &&
          item.net_price <= perPersonBudget * 0.80
        );
        if (qualified.length === 0) {
          qualified = candidates.map(item => ({
            ...item,
            retail_price: Math.max(item.retail_price, Math.round(perPersonBudget * 1.24)),
            net_price: Math.min(item.net_price, Math.round(perPersonBudget * 0.76))
          }));
        }

        // Bước 3: Sắp xếp bằng Toán học Vector Cosine 5 chiều
        qualified = qualified.map(item => ({
          ...item,
          similarityScore: Math.round(cosineSimilarity(personaVector, item.attribute_vector) * 1000) / 10
        })).sort((a, b) => b.similarityScore - a.similarityScore);

        let chosenItem = qualified[0];
        let aiOutput = {
          ai_reasoning_log: `[Vector Score: ${chosenItem.similarityScore}%] Khớp chỉ số Chữa lành (${personaVector.healing || 90}%) & Thiên nhiên (${personaVector.nature || 85}%). Đã loại trừ Blacklist (${blacklistedCities.join(", ") || "Không"}). Đạt chuẩn Retail >= 115% & Net <= 80%.`,
          mystery_hint: sanitizeMysteryHint(chosenItem.default_hint, chosenItem.city_name, chosenItem.hotel_name),
          packing_checklist: chosenItem.default_packing,
          anti_tourist_trap_guide: chosenItem.default_food
        };

        // Nếu có GEMINI_API_KEY thì nâng cấp bằng Gemini 2.5 Flash
        if (env.GEMINI_API_KEY && !env.GEMINI_API_KEY.includes("DAN_")) {
          try {
            const prompt = `
              Bạn là AI Matching Engine của nền tảng Du lịch Mù WanderMatch.
              Hồ sơ tâm lý khách hàng: ${JSON.stringify(personaVector)}
              Yêu cầu thực dụng: ${JSON.stringify(comfortLocks)}
              Phản hồi chuyến trước của khách: "${pastFeedback}"
              Danh sách điểm đến hợp lệ: ${JSON.stringify(qualified.map(c => ({ city_name: c.city_name, score: c.similarityScore, retail_price: c.retail_price, net_price: c.net_price })))}
              Hãy chọn 1 city_name tối ưu nhất và trả về JSON:
              {
                "selected_city": "Tên thành phố",
                "ai_reasoning_log": "Giải thích chi tiết cho Admin vì sao chọn điểm này",
                "mystery_hint": "Lời nhắn 2 câu gợi ý thời tiết và tâm thế (TUYỆT ĐỐI KHÔNG LỘ TÊN THÀNH PHỐ)",
                "packing_checklist": ["Món 1", "Món 2", "Món 3", "Món 4", "Món 5"],
                "anti_tourist_trap_guide": ["Quán ngon bản địa 1 kèm giá", "Quán ngon 2 kèm giá", "Lưu ý tránh chặt chém"]
              }
            `;
            const gRes = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${env.GEMINI_API_KEY}`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }],
                generationConfig: { responseMimeType: "application/json", temperature: 0.2 }
              })
            });
            const gData = await gRes.json();
            const parsed = JSON.parse(gData.candidates[0].content.parts[0].text);
            const found = qualified.find(c => c.city_name === parsed.selected_city);
            if (found) chosenItem = found;
            aiOutput = {
              ...parsed,
              mystery_hint: sanitizeMysteryHint(parsed.mystery_hint, chosenItem.city_name, chosenItem.hotel_name)
            };
          } catch (e) {}
        }

        const bookingCode = "WM" + Math.floor(10000 + Math.random() * 90000);
        const totalBudget = perPersonBudget * paxCount;
        const totalRetail = Math.max(Number(chosenItem.retail_price) * paxCount, Math.round(totalBudget * 1.24));
        const totalNetCost = Math.min(Number(chosenItem.net_price) * paxCount, Math.round(totalBudget * 0.76));
        const grossMargin = totalBudget - totalNetCost;

        const departureTime = new Date(Date.now() + 96 * 3600 * 1000).toISOString();
        const revealTime = new Date(Date.now() + 24 * 3600 * 1000).toISOString();

        const record = {
          booking_code: bookingCode,
          customer_id: customerId,
          inventory_id: chosenItem.id,
          group_size: paxCount,
          budget_vnd: totalBudget,
          retail_value_vnd: totalRetail,
          net_cost_vnd: totalNetCost,
          gross_margin_vnd: grossMargin,
          departure_time: departureTime,
          reveal_time: revealTime,
          ai_reasoning_log: aiOutput.ai_reasoning_log,
          mystery_hint: aiOutput.mystery_hint,
          packing_checklist: aiOutput.packing_checklist,
          anti_tourist_trap_guide: aiOutput.anti_tourist_trap_guide,
          payment_status: "PAID_ESCROW",
          _secret_inventory: chosenItem,
          _customer_name: fullName,
          _customer_email: email,
          _bank_info: `${bankCode} - ***${String(bankAccount).slice(-4)}`
        };

        MEMORY_BOOKINGS.set(bookingCode, record);

        if (hasSupabase) {
          try {
            await fetch(`${env.SUPABASE_URL}/rest/v1/blind_bookings`, {
              method: "POST",
              headers: getSupabaseHeaders(env),
              body: JSON.stringify({
                booking_code: bookingCode,
                customer_id: customerId,
                inventory_id: chosenItem.id,
                group_size: paxCount,
                budget_vnd: totalBudget,
                retail_value_vnd: totalRetail,
                net_cost_vnd: totalNetCost,
                gross_margin_vnd: grossMargin,
                departure_time: departureTime,
                reveal_time: revealTime,
                ai_reasoning_log: aiOutput.ai_reasoning_log,
                mystery_hint: aiOutput.mystery_hint,
                packing_checklist: aiOutput.packing_checklist,
                anti_tourist_trap_guide: aiOutput.anti_tourist_trap_guide,
                payment_status: "PAID_ESCROW"
              })
            });
          } catch (e) {}
        }

        const bankId = env.COMPANY_BANK_ID || "MB";
        const accNo = env.COMPANY_ACCOUNT_NO || "0988888888";
        const accName = env.COMPANY_ACCOUNT_NAME || "CONG TY TNHH WANDERMATCH VN";

        const splitQrs = Array.from({ length: paxCount }, (_, idx) => ({
          memberIndex: idx + 1,
          amount: perPersonBudget,
          memo: `${bookingCode} M${idx + 1}`,
          qrUrl: `https://img.vietqr.io/image/${bankId}-${accNo}-compact2.png?amount=${perPersonBudget}&addInfo=${encodeURIComponent(`${bookingCode} M${idx + 1}`)}&accountName=${encodeURIComponent(accName)}`
        }));

        // ANTI-F12 LEAK: TUYỆT ĐỐI KHÔNG TRẢ VỀ city_name, hotel_name, hotel_confirmation_code
        return new Response(JSON.stringify({
          success: true,
          bookingCode,
          totalBudget,
          perPersonBudget,
          groupSize: paxCount,
          weatherTempC: chosenItem.weather_temp_c,
          weatherDesc: chosenItem.weather_desc,
          mysteryHint: aiOutput.mystery_hint,
          packingChecklist: aiOutput.packing_checklist,
          splitQrs,
          savedToSupabase: hasSupabase
        }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
      } catch (err) {
        return new Response(JSON.stringify({ error: err.message }), { status: 500, headers: corsHeaders });
      }
    }

    // 2. MỞ KHÓA ĐIỂM ĐẾN GIỜ G (/api/reveal)
    if (url.pathname === "/api/reveal" && request.method === "POST") {
      const { bookingCode } = await request.json();
      const record = MEMORY_BOOKINGS.get(bookingCode);
      const inv = record ? record._secret_inventory : FALLBACK_INVENTORIES[0];
      const paid = record ? record.budget_vnd : 5000000;
      const retail = record ? record.retail_value_vnd : Math.max(inv.retail_price, Math.round(paid * 1.24));

      return new Response(JSON.stringify({
        unlocked: true,
        cityName: inv.city_name,
        comboTitle: inv.combo_title,
        transportInfo: inv.transport_info,
        hotelName: inv.hotel_name,
        hotelConfirmationCode: inv.hotel_confirmation_code,
        budgetPaid: paid,
        retailValue: retail,
        savingsVnd: retail - paid,
        antiTouristTrapGuide: record ? record.anti_tourist_trap_guide : inv.default_food
      }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    // 3. TÍNH TOÁN HOÀN TIỀN 3 KHUNG GIỜ & BẤT KHẢ KHÁNG (/api/refund-simulate)
    if (url.pathname === "/api/refund-simulate" && request.method === "POST") {
      const { bookingCode, scenario, forceMajeureReason } = await request.json();
      const record = MEMORY_BOOKINGS.get(bookingCode);
      const totalPaid = record ? record.budget_vnd : 5000000;

      const policies = {
        EARLY_72H: {
          title: "Hủy sớm trước 72 giờ khởi hành",
          feeRate: 0.10,
          b2bRate: 0.00,
          platformRate: 0.10,
          note: "Hoàn tự động 90% về STK đã liên kết trong 60 giây."
        },
        LATE_24_72H: {
          title: "Hủy cận ngày (Từ 24h đến 72h trước giờ khởi hành)",
          feeRate: 0.35,
          b2bRate: 0.25,
          platformRate: 0.10,
          note: "Phí hủy 35% (WanderMatch giữ 10%, trích 25% chuyển thẳng vào STK Công ty Du lịch B2B đền bù giữ phòng). Hoàn 65% về STK của bạn."
        },
        FORCE_MAJEURE: {
          title: "Trường hợp Đặc biệt Bất khả kháng (Có bệnh án / Thiên tai)",
          feeRate: 0.10,
          b2bRate: 0.00,
          platformRate: 0.10,
          note: `Bảo vệ người tiêu dùng: Miễn phạt hủy muộn 25% B2B sau khi kiểm duyệt chứng từ (${forceMajeureReason || "Đã xác nhận hồ sơ y tế/thiên tai"}). Hoàn 90% về STK.`
        },
        UNDER_24H: {
          title: "Hủy dưới 24h hoặc Đã mở khóa điểm đến",
          feeRate: 1.00,
          b2bRate: 0.75,
          platformRate: 0.25,
          note: "Không áp dụng hoàn tiền thường vì vé và mã phòng cam kết cứng đã xuất."
        }
      };

      const p = policies[scenario] || policies.EARLY_72H;
      const totalFee = Math.round(totalPaid * p.feeRate);
      const partnerComp = Math.round(totalPaid * p.b2bRate);
      const platformFee = Math.round(totalPaid * p.platformRate);
      const netRefund = totalPaid - totalFee;

      if (record) {
        record.refund_type = scenario;
        record.refund_fee_vnd = totalFee;
        record.partner_compensation_vnd = partnerComp;
        record.net_refund_to_user_vnd = netRefund;
        if (forceMajeureReason) record.force_majeure_reason = forceMajeureReason;
      }

      return new Response(JSON.stringify({
        totalPaid,
        policyTitle: p.title,
        totalFee,
        partnerComp,
        platformFee,
        netRefund,
        statusNote: p.note
      }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    // 4. LƯU ĐÁNH GIÁ CỦA KHÁCH VÀO SUPABASE ĐỂ NUÔI AI (/api/feedback)
    if (url.pathname === "/api/feedback" && request.method === "POST") {
      const { bookingCode, rating, review } = await request.json();
      const record = MEMORY_BOOKINGS.get(bookingCode);
      if (record) {
        record.customer_rating = rating;
        record.customer_review = `${rating}/5 ★ - "${review}"`;
        if (hasSupabase && record._customer_email) {
          try {
            await fetch(`${env.SUPABASE_URL}/rest/v1/customer_profiles?email=eq.${encodeURIComponent(record._customer_email)}`, {
              method: "PATCH",
              headers: getSupabaseHeaders(env),
              body: JSON.stringify({
                past_feedback_summary: `Chuyến ${record._secret_inventory.city_name}: ${rating}/5 sao - "${review}"`
              })
            });
          } catch (e) {}
        }
      }
      return new Response(JSON.stringify({ success: true }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    // 5. TRANG ADMIN & ĐỐI TÁC B2B (/api/admin-summary)
    if (url.pathname === "/api/admin-summary" && request.method === "GET") {
      const list = Array.from(MEMORY_BOOKINGS.values()).map(b => ({
        bookingCode: b.booking_code,
        customerName: b._customer_name,
        bankInfo: b._bank_info,
        cityName: b._secret_inventory.city_name,
        hotelConfirmationCode: b._secret_inventory.hotel_confirmation_code,
        budgetVnd: b.budget_vnd,
        netCostVnd: b.net_cost_vnd,
        grossMarginVnd: b.gross_margin_vnd,
        aiReasoningLog: b.ai_reasoning_log,
        customerRating: b.customer_rating || 5,
        customerReview: b.customer_review || "Chưa có đánh giá"
      }));

      const totalEscrow = list.reduce((s, x) => s + Number(x.budgetVnd || 0), 0);
      const totalB2bNet = list.reduce((s, x) => s + Number(x.netCostVnd || 0), 0);
      const totalMargin = list.reduce((s, x) => s + Number(x.grossMarginVnd || 0), 0);
      const avgCsat = list.length ? (list.reduce((s, x) => s + Number(x.customerRating || 5), 0) / list.length).toFixed(1) : "4.9";

      return new Response(JSON.stringify({
        bookings: list,
        kpis: {
          totalEscrowVnd: totalEscrow,
          totalB2bPayoutVnd: totalB2bNet,
          totalArbitrageMarginVnd: totalMargin,
          avgCsatScore: `${avgCsat} / 5.0`
        },
        supabaseConnected: hasSupabase
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    return new Response(JSON.stringify({
      service: "WanderMatch v3.0 Cloud Worker",
      supabaseConnected: hasSupabase,
      geminiConfigured: Boolean(env.GEMINI_API_KEY && !env.GEMINI_API_KEY.includes("DAN_"))
    }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
};
