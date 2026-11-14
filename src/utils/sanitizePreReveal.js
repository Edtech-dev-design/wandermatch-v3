// ============================================================================
// WANDERMATCH V4.1 — PRE-REVEAL DESTINATION SECRECY SANITIZER
// Strips any accidental destination, resort, or landmark identifiers pre-reveal
// ============================================================================

export const SENSITIVE_LOCATION_TERMS = Object.freeze([
  "Đà Lạt", "Da Lat", "Dalat", "Liên Khương", "Cầu Đất",
  "Măng Đen", "Mang Den", "Pleiku", "Kon Plông", "Kon Pring", "Pa Sỹ", "Đắk Ke",
  "Quy Nhơn", "Quy Nhon", "Phù Cát", "Eo Gió", "Kỳ Co", "Nhơn Lý",
  "Huế", "Hue", "Phú Bài", "Sông Hương", "Đại Nội", "Thiên Mụ",
  "Phú Quốc", "Phu Quoc", "Hòn Thơm", "Hòn Mây Rút", "Hàm Ninh",
  "Nha Trang", "Cam Ranh", "Ponagar", "Ninh Hòa",
  "Ana Mandara", "Golden Boutique", "Avani", "Pilgrimage", "Salinda", "Amiana"
]);

export function sanitizePreRevealText(text = "") {
  let out = String(text || "");
  for (const term of SENSITIVE_LOCATION_TERMS) {
    const regex = new RegExp(term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "gi");
    out = out.replace(regex, "Điểm Đến Bí Mật");
  }
  return out;
}

export function sanitizeItineraryPreReveal(itinerary = []) {
  return (itinerary || []).map(dayObj => ({
    day: sanitizePreRevealText(dayObj.day),
    morning: sanitizePreRevealText(dayObj.morning),
    afternoon: sanitizePreRevealText(dayObj.afternoon),
    evening: sanitizePreRevealText(dayObj.evening)
  }));
}

export function sanitizeAirlinePreReveal(airline = "") {
  const clean = String(airline || "").replace(/\s*\([^)]*\)/g, "").trim();
  return sanitizePreRevealText(clean || "Vietnam Airlines");
}

export function sanitizeFlightTimeBandPreReveal(timeStr = "") {
  const m = String(timeStr || "").match(/(\d{1,2}):\d{2}/);
  const hour = m ? Number(m[1]) : 8;
  if (hour < 12) return "Khung giờ Sáng (06:00 - 11:30)";
  if (hour < 18) return "Khung giờ Chiều (12:00 - 17:30)";
  return "Khung giờ Tối (18:00 - 22:30)";
}

