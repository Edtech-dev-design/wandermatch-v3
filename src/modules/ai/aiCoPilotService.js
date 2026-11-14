// ============================================================================
// WANDERMATCH V4.1 — INDEPENDENT AI CO-PILOT SERVICE (BOUNDED RETRY & HONEST FALLBACK)
// Handles DNS/Upstream failures (including daily-cloudcode-pa.googleapis.com or
// Gemini/Workers AI timeouts) gracefully without breaking booking/payment APIs
// and NEVER claims deterministic fallback output is live AI output.
// ============================================================================

import { sanitizePreRevealText } from "../../utils/sanitizePreReveal.js";

async function fetchWithBoundedRetry(url, options, { timeoutMs = 2500, maxRetries = 1 } = {}) {
  let lastError = null;
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);
    try {
      const res = await fetch(url, { ...options, signal: controller.signal });
      clearTimeout(timer);
      if (res.status >= 500 && attempt < maxRetries) {
        continue;
      }
      return res;
    } catch (err) {
      clearTimeout(timer);
      lastError = err;
      if (attempt >= maxRetries) break;
    }
  }
  throw lastError || new Error("AI upstream request failed after bounded retries.");
}

export async function executeResilientDualAICoPilot(pkgRecord, userPayload, env) {
  const timeoutPromise = new Promise((resolve) =>
    setTimeout(() => resolve({ timedOut: true }), 3500)
  );

  const diagnostics = {
    cfWorkersAiStatus: "NOT_CONFIGURED",
    geminiApiStatus: "NOT_CONFIGURED",
    errors: []
  };

  const dualTask = (async () => {
    const budgetStr = Number(userPayload.budgetVnd || 5000000).toLocaleString("vi-VN") + "đ";
    const cityName = pkgRecord.secretRevealPackage.cityName;
    const weather = `${pkgRecord.weatherTempC}°C, ${pkgRecord.weatherDesc}`;
    const userPrompt = userPayload.customPrompt || "Muốn nghỉ ngơi, phục hồi năng lượng và tận hưởng cảnh đẹp";

    const cfTastePrompt = `Bạn là Chuyên gia Tâm lý Du lịch (Travel Taste Profiler).
Hành khách chọn: Ngân sách ${budgetStr}, Đi đoàn: ${userPayload.groupSize || 2} người, Gợi ý mong muốn: "${userPrompt}".
Thời tiết điểm đến bí mật: ${weather}.
Hãy phân tích thị hiếu hành khách và trả về ĐÚNG định dạng JSON sau:
{
  "archetype": "Tên nhóm tính cách du lịch ngắn gọn (VD: The Mindful Seeker - Kẻ Đi Tìm An Yên)",
  "vibe_match_score": 96,
  "psychographic_analysis": "Nhận định ngắn gọn 1-2 câu về gu du lịch và nhịp độ nghỉ dưỡng phù hợp nhất."
}`;

    const geminiCuratorPrompt = `Bạn là Giám tuyển Hành trình Du lịch Mù (Blind Travel Curator) hàng đầu theo tiêu chuẩn quốc tế.
Điểm đến bí mật được chọn ngầm là: "${cityName}" (Resort: ${pkgRecord.secretRevealPackage.hotelName}, Thời tiết: ${weather}).
TUYỆT ĐỐI KHÔNG ĐƯỢC NÊU TRỰC TIẾP TÊN THÀNH PHỐ "${cityName}" HOẶC TÊN RESORT TRONG LỜI GỢI Ý.
Hãy sáng tạo 3 manh mối gợi mở và 1 câu thơ/câu đố gợi cảm hứng.
Trả về ĐÚNG định dạng JSON sau:
{
  "mystery_riddle": "1 câu thơ hoặc câu đố ngắn khơi gợi sự tò mò về vùng đất này",
  "clue_climate": "Gợi ý về tiết trời, ánh sáng hoặc địa hình",
  "clue_taste": "Gợi ý về hương vị ẩm thực hoặc phong vị địa phương",
  "clue_experience": "Gợi ý về khoảnh khắc kỳ diệu đang đón chờ",
  "packing_tip": "Lời khuyên chuẩn bị hành trang bí mật"
}`;

    let tasteProfile = null;
    let cfLiveSucceeded = false;

    if (env && env.AI && typeof env.AI.run === "function") {
      try {
        const cfRes = await env.AI.run("@cf/meta/llama-3.1-8b-instruct", {
          messages: [
            { role: "system", content: "You are an expert travel psychologist. Respond with valid JSON only in Vietnamese." },
            { role: "user", content: cfTastePrompt }
          ],
          max_tokens: 350
        });
        const match = (cfRes?.response || "").match(/\{[\s\S]*\}/);
        if (match) {
          const parsed = JSON.parse(match[0]);
          if (parsed && typeof parsed.archetype === "string") {
            tasteProfile = {
              archetype: sanitizePreRevealText(parsed.archetype),
              vibe_match_score: Number(parsed.vibe_match_score) || 95,
              psychographic_analysis: sanitizePreRevealText(parsed.psychographic_analysis || ""),
              source: "LIVE_CF_WORKERS_AI"
            };
            cfLiveSucceeded = true;
            diagnostics.cfWorkersAiStatus = "LIVE_SUCCESS";
          }
        }
      } catch (e) {
        diagnostics.cfWorkersAiStatus = "UPSTREAM_ERROR";
        diagnostics.errors.push(`cf_ai: ${e.message || "error"}`);
      }
    }

    let mysteryCuration = null;
    let geminiLiveSucceeded = false;
    let geminiKey = (env && (env.AI_API_KEY || env.GEMINI_API_KEY)) || "";
    if (geminiKey && !geminiKey.startsWith("AQ.")) {
      try { geminiKey = atob(geminiKey); } catch (_) {}
    }

    if (geminiKey) {
      try {
        const headers = { "Content-Type": "application/json" };
        if (geminiKey.startsWith("AQ.")) headers["Authorization"] = `Bearer ${geminiKey}`;
        const gRes = await fetchWithBoundedRetry(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${geminiKey}`,
          {
            method: "POST",
            headers,
            body: JSON.stringify({
              contents: [{ parts: [{ text: geminiCuratorPrompt }] }],
              generationConfig: { responseMimeType: "application/json" }
            })
          },
          { timeoutMs: 2500, maxRetries: 1 }
        );
        if (gRes.ok) {
          const gData = await gRes.json();
          const gText = gData?.candidates?.[0]?.content?.parts?.[0]?.text;
          if (gText) {
            const parsed = JSON.parse(gText);
            if (parsed && typeof parsed.mystery_riddle === "string") {
              mysteryCuration = {
                mystery_riddle: sanitizePreRevealText(parsed.mystery_riddle),
                clue_climate: sanitizePreRevealText(parsed.clue_climate || ""),
                clue_taste: sanitizePreRevealText(parsed.clue_taste || ""),
                clue_experience: sanitizePreRevealText(parsed.clue_experience || ""),
                packing_tip: sanitizePreRevealText(parsed.packing_tip || ""),
                source: "LIVE_GEMINI_API"
              };
              geminiLiveSucceeded = true;
              diagnostics.geminiApiStatus = "LIVE_SUCCESS";
            }
          }
        } else {
          diagnostics.geminiApiStatus = `HTTP_${gRes.status}`;
        }
      } catch (e) {
        diagnostics.geminiApiStatus = "UPSTREAM_ERROR";
        diagnostics.errors.push(`gemini_ai: ${e.message || "network_or_dns_error"}`);
      }
    }

    if (!tasteProfile) {
      tasteProfile = {
        archetype: "The Soul Healer (Kẻ Đi Tìm Sự An Yên & Chữa Lành)",
        vibe_match_score: 97,
        psychographic_analysis: "Ưa chuộng không gian tĩnh lặng, hòa mình với cỏ cây và tránh xa áp lực thường nhật.",
        source: "DETERMINISTIC_FALLBACK"
      };
    }

    if (!mysteryCuration) {
      mysteryCuration = {
        mystery_riddle: "Nơi sương mai dệt thành vạt mây bồng, tiếng thông ru bình yên từng khoảnh khắc.",
        clue_climate: `Nhiệt độ ${weather}, sáng dịu mát, ngập tràn không khí nguyên sơ`,
        clue_taste: "Phong vị nóng ấm đậm đà bản địa hòa quyện cùng trà thảo mộc",
        clue_experience: "Đón bình minh tại ban công resort nép mình giữa thiên nhiên thanh khiết",
        packing_tip: "Nên mang 1 chiếc áo khoác nhẹ, giày dạo bộ êm ái và trái tim sẵn sàng đón nhận bất ngờ!",
        source: "DETERMINISTIC_FALLBACK"
      };
    }

    const aiStatus = (cfLiveSucceeded && geminiLiveSucceeded)
      ? "LIVE_DUAL_AI"
      : (cfLiveSucceeded || geminiLiveSucceeded)
        ? "PARTIAL_AI_WITH_FALLBACK"
        : "DETERMINISTIC_FALLBACK";

    const dualEngineLabel = (cfLiveSucceeded && geminiLiveSucceeded)
      ? "Cloudflare Llama-3.1 Profiler + Gemini 2.5 Flash Storyteller (Live)"
      : cfLiveSucceeded
        ? "Cloudflare Llama-3.1 Profiler (Live) + Deterministic Storyteller Fallback"
        : geminiLiveSucceeded
          ? "Deterministic Profiler Fallback + Gemini 2.5 Flash Storyteller (Live)"
          : "Deterministic Rule-Based Curator (AI Upstream Fallback Mode)";

    return {
      aiStatus,
      aiFallbackUsed: !(cfLiveSucceeded && geminiLiveSucceeded),
      dualEngine: dualEngineLabel,
      tasteProfile,
      mysteryCuration,
      diagnostics
    };
  })();

  const result = await Promise.race([dualTask, timeoutPromise]);
  if (!result || result.timedOut) {
    return {
      aiStatus: "DETERMINISTIC_FALLBACK",
      aiFallbackUsed: true,
      dualEngine: "Deterministic Rule-Based Curator (AI Timeout Fallback)",
      tasteProfile: {
        archetype: "The Soul Healer (Kẻ Đi Tìm Sự An Yên & Chữa Lành)",
        vibe_match_score: 97,
        psychographic_analysis: "Ưa chuộng không gian tĩnh lặng, hòa mình với cỏ cây và tránh xa áp lực thường nhật.",
        source: "DETERMINISTIC_FALLBACK"
      },
      mysteryCuration: {
        mystery_riddle: "Nơi sương mai dệt thành vạt mây bồng, tiếng thông ru bình yên từng khoảnh khắc.",
        clue_climate: `Nhiệt độ ${pkgRecord.weatherTempC}°C, sáng dịu mát`,
        clue_taste: "Phong vị nóng ấm đậm đà bản địa hòa quyện cùng trà thảo mộc",
        clue_experience: "Đón bình minh tại ban công resort nép mình giữa thiên nhiên thanh khiết",
        packing_tip: "Nên mang 1 chiếc áo khoác nhẹ và giày dạo bộ êm ái.",
        source: "DETERMINISTIC_FALLBACK"
      },
      diagnostics: { cfWorkersAiStatus: "TIMEOUT", geminiApiStatus: "TIMEOUT", errors: ["timeout_3500ms"] }
    };
  }
  return result;
}

