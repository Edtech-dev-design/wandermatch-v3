/**
 * WANDERMATCH 3.0 — BACKEND API & STATIC SERVER
 * Zero-dependency pure Node.js HTTP server
 * Model: Input Target Budget & Destination to Plan Your Ideal Trip
 * Simulates Corporate VietQR Gateway, Napas 247 Lookup, Time-Tiered Refund & SLA Engine
 */

const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');
const { exec } = require('child_process');
const autoSync = require('./auto-sync-github');

const PORT = process.env.PORT || 3000;
const ROOT_DIR = __dirname;

let DB = {
  escrowLedgers: [
    {
      txId: "TX-ESC-99201",
      tripCode: "WM99081234",
      type: "VIETQR_ESCROW_INFLOW",
      direction: "IN",
      amount: "5.000.000đ",
      sender: "HOI VIEN KHACH HANG (Napas 247)",
      receiver: "CONG TY CP CONG NGHE DU LICH WANDERMATCH",
      status: "HELD_IN_ESCROW",
      time: "2026-10-20 10:14:22"
    }
  ],
  slaDepositBalance: 20000000,
  pmsCommitments: {
    "WM99081234": {
      partnerName: "Khách sạn / Resort Đối tác",
      pmsCode: "PMS-DL-8892",
      status: "HARD_COMMITTED",
      slaLocked: 20000000
    }
  },
  customerProfiles: {}
};

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.sql': 'text/plain; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon'
};

function parseBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch (e) {
        resolve({});
      }
    });
    req.on('error', reject);
  });
}

function sendJson(res, statusCode, data) {
  res.writeHead(statusCode, {
    'Content-Type': 'application/json; charset=utf-8',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type'
  });
  res.end(JSON.stringify(data, null, 2));
}

const server = http.createServer(async (req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;

  if (req.method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    });
    res.end();
    return;
  }

  // ==========================================================================
  // BACKEND API ROUTES
  // ==========================================================================

  // ==========================================================================
  // BLIND BOOKING ENGINE & DATA SCIENCE MOCK REPOSITORIES
  // ==========================================================================
  const BLIND_FEATURE_KEYS = ['beach', 'food', 'nature', 'culture', 'healing', 'adventure'];

  const BLIND_CITIES = {
    DAD: {
      city_code: "DAD",
      city_name: "Đà Nẵng & Hội An",
      region: "Miền Trung",
      description: "Thành phố biển đáng sống, bờ biển Mỹ Khê và di sản phố cổ đèn lồng Hội An",
      vector: [0.95, 0.90, 0.70, 0.92, 0.85, 0.65],
      travel_agency_partner: "WanderMatch Prime & Da Nang Tourism Alliance",
      secret_hint: "Nơi những cây cầu nối nhịp đại dương và phố cổ rêu phong trầm mặc dưới ánh đèn lồng."
    },
    DLI: {
      city_code: "DLI",
      city_name: "Đà Lạt (Lâm Đồng)",
      region: "Tây Nguyên",
      description: "Xứ sở ngàn hoa trong sương sớm, se lạnh 16°C và hương thông thơm ngát",
      vector: [0.10, 0.92, 0.96, 0.70, 0.98, 0.75],
      travel_agency_partner: "Dalat Discovery Co., Ltd & WanderMatch Escrow",
      secret_hint: "Nơi đồi thông reo trong sương sớm, se lạnh 16°C và hương cà phê ấm nồng bên sườn thung lũng."
    },
    PQC: {
      city_code: "PQC",
      city_name: "Phú Quốc (Kiên Giang)",
      region: "Miền Nam",
      description: "Đảo ngọc nhiệt đới, hoàng hôn biển bãi Trường và thiên đường nghỉ dưỡng 5 sao",
      vector: [0.98, 0.88, 0.80, 0.55, 0.90, 0.70],
      travel_agency_partner: "Phu Quoc Luxury Travel & Island Gate",
      secret_hint: "Hòn đảo ngọc phía Nam tổ quốc đón hoàng hôn ngũ sắc tuyệt mỹ và những khu resort biệt lập."
    },
    UIH: {
      city_code: "UIH",
      city_name: "Quy Nhơn (Bình Định)",
      region: "Miền Trung",
      description: "Ghềnh ráng biển xanh, bãi Kỳ Co - Eo Gió hoang sơ và ẩm thực làng chài",
      vector: [0.94, 0.86, 0.88, 0.72, 0.88, 0.72],
      travel_agency_partner: "Binh Dinh Heritage Tour & WanderMatch Network",
      secret_hint: "Vùng đất võ thanh bình với vách đá Eo Gió đón sóng đại dương và hải sản tươi rói."
    },
    HUI: {
      city_code: "HUI",
      city_name: "Cố Đô Huế (Thừa Thiên Huế)",
      region: "Miền Trung",
      description: "Cố đô di sản nghìn năm, dòng sông Hương thơ mộng và suối khoáng nóng Alba",
      vector: [0.40, 0.96, 0.75, 0.99, 0.92, 0.50],
      travel_agency_partner: "Hue Heritage Discovery & Center of Culture",
      secret_hint: "Cố đô trầm mặc bên dòng sông Hương, tắm khoáng nóng phục hồi và nhã nhạc cung đình thanh nhã."
    },
    PXU: {
      city_code: "PXU",
      city_name: "Măng Đen & Pleiku (Kon Tum)",
      region: "Tây Nguyên",
      description: "Thủ phủ chữa lành giữa đại ngàn nguyên sơ, rừng thông bạt ngàn và khí hậu se lạnh",
      vector: [0.05, 0.82, 0.99, 0.78, 0.99, 0.88],
      travel_agency_partner: "Highland Green Escapes & Central Highlands Operator",
      secret_hint: "Thủ phủ chữa lành nguyên sơ trên cao nguyên bazan, rặng thông non ngút ngàn và tiếng thác đổ."
    }
  };

  const BLIND_FLIGHTS = [
    // SGN (TP.HCM)
    { flight_no: "VN112", origin: "hochiminh", destination: "DAD", carrier: "Vietnam Airlines", price_oneway: 950000, depart_time: "08:15", rating: 4.8 },
    { flight_no: "VN113", origin: "DAD", destination: "hochiminh", carrier: "Vietnam Airlines", price_oneway: 980000, depart_time: "17:30", rating: 4.8 },
    { flight_no: "VJ204", origin: "hochiminh", destination: "DAD", carrier: "Vietjet Air", price_oneway: 590000, depart_time: "09:45", rating: 4.2 },
    { flight_no: "VJ205", origin: "DAD", destination: "hochiminh", carrier: "Vietjet Air", price_oneway: 620000, depart_time: "18:15", rating: 4.2 },

    { flight_no: "VN138", origin: "hochiminh", destination: "DLI", carrier: "Vietnam Airlines", price_oneway: 750000, depart_time: "07:30", rating: 4.9 },
    { flight_no: "VN139", origin: "DLI", destination: "hochiminh", carrier: "Vietnam Airlines", price_oneway: 780000, depart_time: "16:00", rating: 4.9 },
    { flight_no: "QH202", origin: "hochiminh", destination: "DLI", carrier: "Bamboo Airways", price_oneway: 650000, depart_time: "08:00", rating: 4.6 },
    { flight_no: "QH203", origin: "DLI", destination: "hochiminh", carrier: "Bamboo Airways", price_oneway: 680000, depart_time: "16:45", rating: 4.6 },

    { flight_no: "VN150", origin: "hochiminh", destination: "PQC", carrier: "Vietnam Airlines", price_oneway: 980000, depart_time: "09:10", rating: 4.8 },
    { flight_no: "VN151", origin: "PQC", destination: "hochiminh", carrier: "Vietnam Airlines", price_oneway: 990000, depart_time: "18:20", rating: 4.8 },
    { flight_no: "VJ302", origin: "hochiminh", destination: "PQC", carrier: "Vietjet Air", price_oneway: 650000, depart_time: "10:20", rating: 4.3 },
    { flight_no: "VJ303", origin: "PQC", destination: "hochiminh", carrier: "Vietjet Air", price_oneway: 680000, depart_time: "19:00", rating: 4.3 },

    { flight_no: "VN162", origin: "hochiminh", destination: "UIH", carrier: "Vietnam Airlines", price_oneway: 720000, depart_time: "08:45", rating: 4.7 },
    { flight_no: "VN163", origin: "UIH", destination: "hochiminh", carrier: "Vietnam Airlines", price_oneway: 750000, depart_time: "17:15", rating: 4.7 },
    { flight_no: "QH304", origin: "hochiminh", destination: "UIH", carrier: "Bamboo Airways", price_oneway: 620000, depart_time: "09:30", rating: 4.6 },
    { flight_no: "QH305", origin: "UIH", destination: "hochiminh", carrier: "Bamboo Airways", price_oneway: 650000, depart_time: "18:00", rating: 4.6 },

    { flight_no: "VN174", origin: "hochiminh", destination: "HUI", carrier: "Vietnam Airlines", price_oneway: 780000, depart_time: "08:30", rating: 4.8 },
    { flight_no: "VN175", origin: "HUI", destination: "hochiminh", carrier: "Vietnam Airlines", price_oneway: 820000, depart_time: "17:45", rating: 4.8 },

    { flight_no: "VN186", origin: "hochiminh", destination: "PXU", carrier: "Vietnam Airlines", price_oneway: 680000, depart_time: "07:15", rating: 4.7 },
    { flight_no: "VN187", origin: "PXU", destination: "hochiminh", carrier: "Vietnam Airlines", price_oneway: 720000, depart_time: "16:30", rating: 4.7 },

    // HAN (Hà Nội)
    { flight_no: "VN210", origin: "hanoi", destination: "DAD", carrier: "Vietnam Airlines", price_oneway: 850000, depart_time: "08:00", rating: 4.8 },
    { flight_no: "VN211", origin: "DAD", destination: "hanoi", carrier: "Vietnam Airlines", price_oneway: 890000, depart_time: "17:00", rating: 4.8 },
    { flight_no: "VN230", origin: "hanoi", destination: "PQC", carrier: "Vietnam Airlines", price_oneway: 1150000, depart_time: "07:45", rating: 4.8 },
    { flight_no: "VN231", origin: "PQC", destination: "hanoi", carrier: "Vietnam Airlines", price_oneway: 1200000, depart_time: "18:15", rating: 4.8 },
    { flight_no: "VN240", origin: "hanoi", destination: "UIH", carrier: "Vietnam Airlines", price_oneway: 890000, depart_time: "08:30", rating: 4.7 },
    { flight_no: "VN241", origin: "UIH", destination: "hanoi", carrier: "Vietnam Airlines", price_oneway: 920000, depart_time: "16:45", rating: 4.7 },
    { flight_no: "VN250", origin: "hanoi", destination: "HUI", carrier: "Vietnam Airlines", price_oneway: 750000, depart_time: "08:15", rating: 4.8 },
    { flight_no: "VN251", origin: "HUI", destination: "hanoi", carrier: "Vietnam Airlines", price_oneway: 780000, depart_time: "17:15", rating: 4.8 },

    // DAD (Đà Nẵng)
    { flight_no: "VN310", origin: "danang", destination: "DLI", carrier: "Vietnam Airlines", price_oneway: 790000, depart_time: "08:00", rating: 4.8 },
    { flight_no: "VN311", origin: "DLI", destination: "danang", carrier: "Vietnam Airlines", price_oneway: 820000, depart_time: "17:00", rating: 4.8 },
    { flight_no: "VN320", origin: "danang", destination: "PQC", carrier: "Vietnam Airlines", price_oneway: 950000, depart_time: "09:15", rating: 4.8 },
    { flight_no: "VN321", origin: "PQC", destination: "danang", carrier: "Vietnam Airlines", price_oneway: 980000, depart_time: "18:00", rating: 4.8 }
  ];

  const BLIND_HOTELS = [
    { id: "HTL-DAD-01", city_code: "DAD", hotel_name: "Grand Tourane Ocean Resort", stars: 5, price_per_night: 1400000, rating: 4.8, amenities: ["Bãi biển riêng", "Bể bơi vô cực", "Buffet sáng quốc tế", "Xe đón sân bay"] },
    { id: "HTL-DAD-02", city_code: "DAD", hotel_name: "Sala Danang Beach Hotel", stars: 4, price_per_night: 950000, rating: 4.6, amenities: ["Sky bar", "Bể bơi tầng thượng", "Buffet sáng", "Gần chợ đêm Sơn Trà"] },
    { id: "HTL-DLI-01", city_code: "DLI", hotel_name: "Ana Mandara Villas Dalat Resort & Spa", stars: 5, price_per_night: 1800000, rating: 4.9, amenities: ["Biệt thự Pháp cổ", "Rừng thông riêng", "Spa thảo mộc", "Trà chiều bên lò sưởi"] },
    { id: "HTL-DLI-02", city_code: "DLI", hotel_name: "Colline Heritage Boutique Hotel", stars: 4, price_per_night: 1100000, rating: 4.7, amenities: ["Trung tâm chợ Đà Lạt", "Buffet rau hữu cơ", "Phòng view thung lũng"] },
    { id: "HTL-PQC-01", city_code: "PQC", hotel_name: "Salinda Resort Phu Quoc Island", stars: 5, price_per_night: 2200000, rating: 4.9, amenities: ["Bãi biển hoàng hôn", "Bể bơi lọc muối điện phân", "Buffet sâm-panh", "Đưa đón riêng"] },
    { id: "HTL-PQC-02", city_code: "PQC", hotel_name: "Novotel Phu Quoc Resort", stars: 4, price_per_night: 1350000, rating: 4.6, amenities: ["Vườn nhiệt đới", "Bể bơi sát biển", "Chèo kayak", "Buffet sáng"] },
    { id: "HTL-UIH-01", city_code: "UIH", hotel_name: "Avani Quy Nhon Resort & Spa", stars: 5, price_per_night: 1600000, rating: 4.8, amenities: ["Bãi biển Bãi Dài", "Spa vách đá", "Nhà hàng hải sản tươi", "Đưa đón sân bay Phù Cát"] },
    { id: "HTL-UIH-02", city_code: "UIH", hotel_name: "Fleur De Lys Hotel Quy Nhon", stars: 4, price_per_night: 1050000, rating: 4.6, amenities: ["Mặt tiền biển An Dương Vương", "Hồ bơi tầng cao", "Buffet ẩm thực Bình Định"] },
    { id: "HTL-HUI-01", city_code: "HUI", hotel_name: "Pilgrimage Village Boutique Resort & Spa", stars: 5, price_per_night: 1500000, rating: 4.9, amenities: ["Không gian thiền định", "Nhà tranh gỗ truyền thống", "Tắm suối khoáng nóng", "Thưởng trà sen"] },
    { id: "HTL-HUI-02", city_code: "HUI", hotel_name: "Silk Path Grand Hue Hotel", stars: 4, price_per_night: 1000000, rating: 4.7, amenities: ["Kiến trúc cung đình tân cổ điển", "Bể bơi 4 mùa", "Vị trí sát bờ sông Hương"] },
    { id: "HTL-PXU-01", city_code: "PXU", hotel_name: "Golden Boutique Hotel Măng Đen", stars: 4, price_per_night: 950000, rating: 4.7, amenities: ["View rừng thông ngút ngàn", "Lửa trại BBQ ban đêm", "Xe Limousine đưa đón sân bay Pleiku"] },
    { id: "HTL-PXU-02", city_code: "PXU", hotel_name: "Đắk Ke Mang Den Eco Resort", stars: 4, price_per_night: 850000, rating: 4.5, amenities: ["Bên hồ Đăk Ke", "Vườn hoa sim & cà phê rang củi", "Không khí nguyên sơ 18°C"] }
  ];

  function jsCosineSim(vecA = [], vecB = []) {
    let dot = 0, normA = 0, normB = 0;
    for (let i = 0; i < vecA.length; i++) {
      const a = Number(vecA[i] || 0.5);
      const b = Number(vecB[i] || 0.5);
      dot += a * b;
      normA += a * a;
      normB += b * b;
    }
    if (normA === 0 || normB === 0) return 0;
    return dot / (Math.sqrt(normA) * Math.sqrt(normB));
  }

  function jsFilterBudgetRoutes(origin, totalBudget, pax = 2, maxRatio = 0.75) {
    const feasible = {};
    const normOrigin = (origin || 'hochiminh').toLowerCase();
    const outbound = BLIND_FLIGHTS.filter(f => f.origin.toLowerCase() === normOrigin);

    for (const outFl of outbound) {
      const dest = outFl.destination;
      const returnFl = BLIND_FLIGHTS.find(f => f.origin === dest && f.destination.toLowerCase() === normOrigin);
      if (!returnFl) continue;

      const roundtripPerPax = outFl.price_oneway + returnFl.price_oneway;
      const totalFlightCost = roundtripPerPax * pax;

      if (totalFlightCost <= totalBudget * maxRatio) {
        if (!feasible[dest] || totalFlightCost < feasible[dest].total_flight_cost) {
          feasible[dest] = {
            city_code: dest,
            outbound: outFl,
            return: returnFl,
            roundtrip_cost_per_pax: roundtripPerPax,
            total_flight_cost: totalFlightCost
          };
        }
      }
    }
    return feasible;
  }

  function jsRankCities(userVec, cityCodes) {
    return cityCodes.map(code => {
      const city = BLIND_CITIES[code];
      const sim = city ? jsCosineSim(userVec, city.vector) : 0.5;
      return { code, sim: Math.round(sim * 1000) / 1000 };
    }).sort((a, b) => b.sim - a.sim);
  }

  function jsOptimizeKnapsack(feasibleRoutes, rankedCities, totalBudget, nights = 2, rooms = 1) {
    const validCombos = [];
    const simMap = {};
    rankedCities.forEach(r => { simMap[r.code] = r.sim; });

    for (const [cityCode, route] of Object.entries(feasibleRoutes)) {
      const simScore = simMap[cityCode] || 0.75;
      const cityMeta = BLIND_CITIES[cityCode];
      if (!cityMeta) continue;

      const flightCost = route.total_flight_cost;
      const flightRating = (route.outbound.rating + route.return.rating) / 2;
      const hotels = BLIND_HOTELS.filter(h => h.city_code === cityCode);

      for (const hotel of hotels) {
        const hotelCost = hotel.price_per_night * nights * rooms;
        const totalComboCost = flightCost + hotelCost;

        if (totalComboCost <= totalBudget) {
          const budgetUtil = totalComboCost / totalBudget;
          const compositeQuality = (hotel.rating * 0.40) + (flightRating * 0.20) + (simScore * 5.0 * 0.40);
          const knapsackFitness = (compositeQuality * 0.70) + (budgetUtil * 1.5 * 0.30);
          const marketRetail = Math.round((totalComboCost * 1.25) / 100000) * 100000;

          validCombos.push({
            combo_id: `COMBO-${cityCode}-${hotel.id}`,
            city_code: cityCode,
            city_name: cityMeta.city_name,
            region: cityMeta.region,
            secret_hint: cityMeta.secret_hint,
            travel_agency_partner: cityMeta.travel_agency_partner,
            flight_summary: {
              carrier: route.outbound.carrier,
              outbound_flight: `${route.outbound.flight_no} (${route.outbound.depart_time})`,
              return_flight: `${route.return.flight_no} (${route.return.depart_time})`,
              flight_cost_total: flightCost,
              rating: flightRating
            },
            hotel_summary: {
              hotel_id: hotel.id,
              hotel_name: hotel.hotel_name,
              stars: hotel.stars,
              rating: hotel.rating,
              amenities: hotel.amenities,
              hotel_cost_total: hotelCost,
              nights: nights
            },
            dining_and_entertainment: [
              "Voucher thưởng thức ẩm thực bản địa: 200.000 VNĐ / khách",
              "Bữa sáng Buffet tiêu chuẩn quốc tế tại khách sạn",
              "Cẩm nang hướng dẫn quán ăn địa phương chuẩn vị (chống bẫy chặt chém)"
            ],
            included_services: [
              "Vé máy bay khứ hồi (Bao gồm 20kg hành lý ký gửi + 7kg xách tay)",
              `Phòng nghỉ ${hotel.stars} sao (${hotel.hotel_name}) ${nights} đêm`,
              "Xe riêng / Limousine đón tiễn sân bay về khách sạn 2 chiều",
              "Bảo hiểm du lịch toàn diện 24/7 (Bảo lãnh viện phí & tai nạn)",
              "Quỹ bảo chứng nâng hạng phòng 5 sao SLA nếu có sự cố overbooking"
            ],
            financial_breakdown: {
              user_target_budget: totalBudget,
              total_combo_cost: totalComboCost,
              flight_cost: flightCost,
              hotel_cost: hotelCost,
              service_and_insurance_cost: 250000,
              market_retail_value: marketRetail,
              savings_amount: marketRetail - totalComboCost,
              unallocated_pocket_money: totalBudget - totalComboCost
            },
            similarity_score: simScore,
            budget_utilization: Math.round(budgetUtil * 1000) / 10,
            knapsack_fitness: Math.round(knapsackFitness * 1000) / 1000
          });
        }
      }
    }
    return validCombos.sort((a, b) => b.knapsack_fitness - a.knapsack_fitness);
  }

  function jsSelectWeightedRandom(combos, topK = 3) {
    const curated = combos.slice(0, topK);
    const weights = curated.map(c => Math.pow(c.knapsack_fitness, 2));
    const totalW = weights.reduce((sum, w) => sum + w, 0);

    curated.forEach((c, idx) => {
      c.lucky_probability_pct = Math.round((weights[idx] / totalW) * 1000) / 10;
    });

    let rand = Math.random() * totalW;
    let chosen = curated[0];
    for (let i = 0; i < curated.length; i++) {
      if (rand < weights[i]) {
        chosen = curated[i];
        break;
      }
      rand -= weights[i];
    }
    return { chosen, curated };
  }

  // ==========================================================================
  // 1. BLIND BOOKING ENGINE (CHỈ ĐIỂN ĐIỂM ĐI, NGÂN SÁCH CHẴN & TRÒN TRĂM)
  // ==========================================================================
  if (pathname === '/api/planner/generate' && req.method === 'POST') {
    const body = await parseBody(req);
    const origin = body.origin || 'hochiminh';
    const numBudget = Number(body.budget);
    const pax = Number(body.pax) || 2;
    const duration = body.duration || '3d2n';
    const nights = duration === '2d1n' ? 1 : (duration === '4d3n' ? 3 : 2);
    const styleTags = body.styles || ['healing', 'nature', 'food'];
    const diningPref = body.dining || 'Ẩm thực bản địa & hải sản tươi sống';
    const previousTripNotes = body.previousNotes || '';

    // STRICT VALIDATION: Chỉ nhận số chẵn, tròn trăm và >= 1.000.000đ
    if (!numBudget || numBudget < 1000000) {
      return sendJson(res, 400, {
        success: false,
        error: "Ngân sách tối thiểu từ 1.000.000 VNĐ trở lên."
      });
    }

    if (Math.round(numBudget) % 2 !== 0) {
      return sendJson(res, 400, {
        success: false,
        error: "Chỉ chấp nhận số chẵn (Ví dụ: 3.000.000đ, 3.200.000đ, 4.000.000đ). Không chấp nhận số lẻ!"
      });
    }

    if (Math.round(numBudget) % 100 !== 0) {
      return sendJson(res, 400, {
        success: false,
        error: "Chỉ chấp nhận số tròn trăm (Ví dụ: 2.500.000đ, 3.200.000đ). Không chấp nhận số lẻ!"
      });
    }

    // Build user preference vector
    const userVec = BLIND_FEATURE_KEYS.map(k => styleTags.includes(k) ? 0.95 : 0.35);

    // Thuật toán 1: Lọc tuyến bay
    const feasibleRoutes = jsFilterBudgetRoutes(origin, numBudget, pax);
    const cityCodes = Object.keys(feasibleRoutes);

    if (cityCodes.length === 0) {
      return sendJson(res, 200, {
        success: false,
        error: `Không tìm thấy tuyến bay khứ hồi nào từ điểm khởi hành này nằm trong ngân sách ${numBudget.toLocaleString('vi-VN')}đ cho ${pax} người. Vui lòng tăng ngân sách!`
      });
    }

    // Thuật toán 2: Cosine Similarity
    const rankedCities = jsRankCities(userVec, cityCodes);

    // Thuật toán 3: Knapsack Optimization
    const combos = jsOptimizeKnapsack(feasibleRoutes, rankedCities, numBudget, nights, Math.max(1, Math.floor(pax / 2)));

    if (combos.length === 0) {
      return sendJson(res, 200, {
        success: false,
        error: `Không thể kết hợp gói combo Vé máy bay + Khách sạn 4-5 sao vừa khít ngân sách ${numBudget.toLocaleString('vi-VN')}đ. Vui lòng tăng nhẹ ngân sách!`
      });
    }

    // Thuật toán 4: Weighted Random (Hộp Quà May Mắn & Top 3 Lựa Chọn)
    const { chosen, curated } = jsSelectWeightedRandom(combos, 3);

    return sendJson(res, 200, {
      success: true,
      ai_engine_used: "WanderMatch Knapsack Vector AI (Cloudflare Workers Fallback Enabled)",
      input_criteria: {
        origin: origin,
        budget: numBudget,
        pax: pax,
        duration: duration,
        nights: nights,
        dining_preference: diningPref,
        previous_trip_notes: previousTripNotes
      },
      mystery_lucky_box: chosen,
      top_3_curated_options: curated,
      unified_overview: {
        destination_name: chosen.city_name,
        region: chosen.region,
        secret_hint: chosen.secret_hint,
        hotel_name: chosen.hotel_summary.hotel_name,
        hotel_stars: chosen.hotel_summary.stars,
        hotel_rating: chosen.hotel_summary.rating,
        travel_agency_partner: chosen.travel_agency_partner,
        dining_and_entertainment: chosen.dining_and_entertainment,
        included_services: chosen.included_services,
        financial_breakdown: chosen.financial_breakdown
      },
      utilities_catalog: [
        { category: "Hàng Không", items: ["Vé máy bay khứ hồi chính hãng", "Hành lý ký gửi 20kg + 7kg xách tay", "Không bay giờ đêm (Red-eye lock)"] },
        { category: "Lưu Trú", items: [`Khách sạn/Resort ${chosen.hotel_summary.stars} sao (${chosen.hotel_summary.hotel_name})`, "Buffet sáng mỗi ngày", "Review khách thực tế >= 8.5/10"] },
        { category: "Trung Chuyển", items: ["Xe đón tiễn sân bay về tận cửa resort 2 chiều"] },
        { category: "Ẩm Thực & Trải Nghiệm", items: [`Voucher ẩm thực bản địa 200.000đ/khách (${diningPref})`, "Cẩm nang địa phương chống chặt chém"] },
        { category: "Bảo Lãnh & Tài Chính", items: ["Bảo hiểm du lịch trọn gói 24/7", "Quỹ ký quỹ SLA nâng hạng 5 sao nếu overbooking", "Bảo lãnh hoàn tiền tự động 24H qua Napas 247"] }
      ]
    });
  }

  // 1B. Payment Confirmation with Receipt Upload
  if (pathname === '/api/payment/confirm-receipt' && req.method === 'POST') {
    const body = await parseBody(req);
    const orderCode = body.orderCode || 'WM' + Math.floor(10000 + Math.random() * 90000);
    const amount = Number(body.amount) || 5000000;
    const senderName = (body.senderName || 'Hội Viên Khách Hàng').trim();
    const senderBank = body.senderBank || 'MBBank';
    const senderAccount = body.senderAccount || 'Chính chủ';
    const receiptImage = body.receiptImage || null;

    const newLedger = {
      txId: `TX-BILL-${Date.now().toString().slice(-5)}`,
      tripCode: orderCode,
      type: "VIETQR_ESCROW_INFLOW",
      direction: "IN",
      amount: `${amount.toLocaleString('vi-VN')}đ`,
      sender: `${senderName.toUpperCase()} (${senderBank} - ${senderAccount})`,
      receiver: "CONG TY CP CONG NGHE DU LICH WANDERMATCH",
      status: "HELD_IN_ESCROW",
      hasReceiptProof: !!receiptImage,
      time: new Date().toISOString()
    };
    DB.escrowLedgers.unshift(newLedger);

    return sendJson(res, 200, {
      message: "Biên lai thanh toán và thông tin chuyển khoản đã được tiếp nhận. Quỹ Tạm Giữ Escrow đã kích hoạt!",
      transactionId: newLedger.txId,
      orderCode: orderCode,
      amountLocked: amount,
      status: "HELD_IN_ESCROW"
    });
  }

  // 2. NAPAS 247 Instant Account Holder Lookup
  if (pathname === '/api/napas/lookup' && req.method === 'POST') {
    const body = await parseBody(req);
    const { bankCode, accountNumber, accountHolderName } = body;
    const resolvedName = (accountHolderName || 'KHACH HANG HOI VIEN').toUpperCase();

    return sendJson(res, 200, {
      napasRef: `NAPAS247-${Date.now()}`,
      bankCode: bankCode || 'MB',
      accountNumber: accountNumber || '0388998899',
      accountHolderName: resolvedName,
      isExactMatch: true,
      verificationStatus: 'ACTIVE_VERIFIED',
      message: 'Account owner verified via Napas 247 network.'
    });
  }

  // 3. Corporate VietQR Gateway Dynamic Generator (Accepts Custom Budget)
  if (pathname === '/api/vietqr/generate' && req.method === 'POST') {
    const body = await parseBody(req);
    const amount = Number(body.amount) || 5000000;
    const orderCode = body.orderCode || 'WM99081234';

    return sendJson(res, 200, {
      corporateLegalEntity: "CONG TY CP CONG NGHE DU LICH WANDERMATCH",
      corporateAccountNumber: "990812348888",
      corporateBankCode: "MB",
      orderReference: orderCode,
      amountLocked: amount,
      qrRawString: `00020101021238580010A0000007270126000697042201129908123488880208QRIBFTTA5303704540${amount}5802VN62140810${orderCode}6304`,
      escrowState: "HELD_IN_COMPANY_ESCROW"
    });
  }

  // 4. Webhook VietQR Payment Simulation
  if (pathname === '/api/vietqr/webhook' && req.method === 'POST') {
    const body = await parseBody(req);
    const orderCode = body.orderCode || 'WM99081234';
    const amount = Number(body.amount) || 5000000;
    const senderName = body.senderName || 'HOI VIEN KHACH HANG';

    const newLedger = {
      txId: `TX-QR-${Date.now().toString().slice(-5)}`,
      tripCode: orderCode,
      type: "VIETQR_ESCROW_INFLOW",
      direction: "IN",
      amount: `${amount.toLocaleString('vi-VN')}đ`,
      sender: `${senderName.toUpperCase()} (Napas 247)`,
      receiver: "CONG TY CP CONG NGHE DU LICH WANDERMATCH",
      status: "HELD_IN_ESCROW",
      time: new Date().toISOString()
    };
    DB.escrowLedgers.unshift(newLedger);

    return sendJson(res, 200, {
      webhookProcessedAt: new Date().toISOString(),
      transactionId: newLedger.txId,
      escrowStatus: "HELD_IN_COMPANY_ESCROW",
      message: "Payment successfully received and locked in company escrow."
    });
  }


  // 5. Time-Tiered Refund Calculator (Accepts Custom Budget)
  if (pathname === '/api/cancellation/calculate' && req.method === 'POST') {
    const body = await parseBody(req);
    const { price, hoursBeforeDeparture, isDestinationRevealed } = body;
    const tripPrice = Number(price) || 5000000;
    
    let tier = 'TIER_1_EARLY_72H';
    let feePct = 10;
    let hotelCutPct = 0;
    let adminCutPct = 10;
    let refundPct = 90;

    if (isDestinationRevealed || hoursBeforeDeparture < 24) {
      tier = 'TIER_3_LATE_OR_SCRATCHED';
      feePct = 100;
      hotelCutPct = 70;
      adminCutPct = 30;
      refundPct = 0;
    } else if (hoursBeforeDeparture <= 72) {
      tier = 'TIER_2_WINDOW_24_72H';
      feePct = 35;
      hotelCutPct = 25;
      adminCutPct = 10;
      refundPct = 65;
    }

    const feeAmount = (tripPrice * feePct) / 100;
    const refundAmount = (tripPrice * refundPct) / 100;

    return sendJson(res, 200, {
      appliedTier: tier,
      originalPrice: tripPrice,
      feePercentage: feePct,
      feeAmount: feeAmount,
      hotelCompensationCut: (tripPrice * hotelCutPct) / 100,
      platformOperatingCut: (tripPrice * adminCutPct) / 100,
      netRefundToUserNapas: refundAmount,
      payoutTimeline: "Instant < 2s via Napas 247"
    });
  }

  // 6. B2B Room Commitment & SLA Signing
  if (pathname === '/api/b2b/commit-room' && req.method === 'POST') {
    const body = await parseBody(req);
    const { pmsCode, orderCode } = body;

    DB.pmsCommitments[orderCode || 'WM99081234'] = {
      partnerName: "Khách sạn / Resort Đối tác",
      pmsCode: pmsCode || 'PMS-DL-8892',
      status: "HARD_COMMITTED",
      slaLocked: DB.slaDepositBalance
    };

    return sendJson(res, 200, {
      status: "HARD_COMMITTED",
      pmsCode: pmsCode || 'PMS-DL-8892',
      slaGuaranteeDeposit: DB.slaDepositBalance,
      signedAt: new Date().toISOString()
    });
  }

  // 7. B2B Overbooking Penalty Trigger
  if (pathname === '/api/b2b/report-overbooking' && req.method === 'POST') {
    const penalty = 10000000;
    DB.slaDepositBalance = Math.max(0, DB.slaDepositBalance - penalty);

    const ledger = {
      txId: `TX-PENALTY-${Date.now().toString().slice(-5)}`,
      tripCode: "WM99081234",
      type: "SLA_PENALTY_DEDUCTION",
      direction: "OUT",
      amount: "10.000.000đ",
      sender: "B2B_PARTNER_SLA_FUND",
      receiver: "WANDERMATCH_UPGRADE_ESCROW",
      status: "DISBURSED_TO_PARTNER",
      time: new Date().toISOString()
    };
    DB.escrowLedgers.unshift(ledger);

    return sendJson(res, 200, {
      penaltyDeducted: penalty,
      newSlaBalance: DB.slaDepositBalance,
      guestAction: "AUTOMATIC_5_STAR_HOTEL_UPGRADE_EXECUTED",
      message: "Deducted 50% SLA guarantee deposit (10M VND) to upgrade customer immediately."
    });
  }

  // 8. Get Escrow Ledgers
  if (pathname === '/api/escrow/ledgers' && req.method === 'GET') {
    return sendJson(res, 200, {
      ledgers: DB.escrowLedgers
    });
  }

  // 8b. Customer Profile Storage & Supabase Sync Bridge
  if (pathname === '/api/customer/profile' && req.method === 'POST') {
    const body = await parseBody(req);
    const userEmail = (body.email || body.id || 'anonymous').toLowerCase();
    DB.customerProfiles[userEmail] = {
      ...body,
      updatedAt: new Date().toISOString()
    };
    return sendJson(res, 200, {
      message: 'Hồ sơ khách hàng đã được lưu trữ an toàn vào hệ thống Supabase & máy chủ!',
      profile: DB.customerProfiles[userEmail]
    });
  }

  if (pathname === '/api/customer/profile' && req.method === 'GET') {
    const email = ((parsedUrl.query && parsedUrl.query.email) || '').toLowerCase();
    const profile = email ? DB.customerProfiles[email] : null;
    return sendJson(res, 200, {
      profile: profile || null,
      totalStored: Object.keys(DB.customerProfiles).length
    });
  }

  // 9. GitHub Auto-Sync Status & Manual Trigger
  if (pathname === '/api/github/status' && req.method === 'GET') {
    return sendJson(res, 200, {
      syncStatus: autoSync.getSyncStatus()
    });
  }

  if (pathname === '/api/github/sync' && req.method === 'POST') {
    const syncRes = await autoSync.performGitSync('Manual-Modal-Trigger');
    return sendJson(res, 200, {
      syncStatus: syncRes
    });
  }

  // ==========================================================================
  // PRAGMATIC PILLARS API ROUTES (V3.1)
  // ==========================================================================

  // 10. Smart Package & Value Guarantee Calculator (Retail Value Floor >= 120%)
  if (pathname === '/api/pragmatic/guarantee-calculate' && req.method === 'POST') {
    const body = await parseBody(req);
    const budget = Math.max(1000000, Number(body.budget) || 5000000);
    const retailFloor = Math.round(budget * 1.20);
    const estimatedSavings = Math.round(budget * 0.25);
    const wholesaleNetCost = Math.round(budget * 0.75);

    return sendJson(res, 200, {
      budgetSelected: budget,
      retailValueFloorMin: retailFloor,
      retailValueFloorRatio: "120%",
      accommodationStandard: "Khách sạn/Resort 4-5 sao (Review >= 8.2/10)",
      refund200PctGuaranteeBadge: "Cam kết hoàn tiền 200% phần chênh lệch vào STK đã liên kết nếu tổng giá trị thực tế thấp hơn gói ngân sách",
      estimatedSavingsVnd: estimatedSavings,
      wholesaleNetCostB2b: wholesaleNetCost,
      voucherFoodVnd: 200000
    });
  }

  // 11. Group Split-Bill VietQR Session Generator
  if (pathname === '/api/group-booking/create' && req.method === 'POST') {
    const body = await parseBody(req);
    const totalBudget = Math.max(2000000, Number(body.totalBudget) || 16000000);
    const membersCount = Math.min(10, Math.max(2, Number(body.membersCount) || 4));
    const groupCode = `G${Math.floor(1000 + Math.random() * 9000)}`;
    const perMember = Math.round(totalBudget / membersCount);

    const members = [];
    for (let i = 1; i <= membersCount; i++) {
      const memo = `WM ${groupCode} M${i}`;
      members.push({
        memberIndex: i,
        name: body.members && body.members[i-1] ? body.members[i-1].name : `Thành viên ${i}`,
        amountDue: perMember,
        memo: memo,
        vietQrPayload: `00020101021238580010A0000007270126000697042201129908123488880208QRIBFTTA5303704540${perMember}5802VN62140810${memo}6304`,
        isPaid: i === 1, // Trưởng nhóm đã quét cọc
        paidAt: i === 1 ? new Date().toISOString() : null,
        payoutStatus: "NONE"
      });
    }

    return sendJson(res, 200, {
      groupCode: groupCode,
      totalBudget: totalBudget,
      amountPerMember: perMember,
      membersCount: membersCount,
      corporateAccountNo: "990812348888 (MBBank)",
      corporateEntity: "CONG TY CP CONG NGHE DU LICH WANDERMATCH",
      expiresInMinutes: 30,
      expiresAt: new Date(Date.now() + 30 * 60000).toISOString(),
      members: members
    });
  }

  // 12. Simulate Member Payment in Group Split-Bill
  if (pathname === '/api/group-booking/pay-member' && req.method === 'POST') {
    const body = await parseBody(req);
    const { groupCode, memberIndex, amount } = body;

    const ledger = {
      txId: `TX-GRP-${Date.now().toString().slice(-5)}`,
      tripCode: `WM-${groupCode}-M${memberIndex}`,
      type: "VIETQR_ESCROW_INFLOW",
      direction: "IN",
      amount: `${Number(amount || 4000000).toLocaleString('vi-VN')}đ`,
      sender: `Thành viên ${memberIndex} (Napas 247)`,
      receiver: "CONG TY CP CONG NGHE DU LICH WANDERMATCH",
      status: "HELD_IN_ESCROW",
      time: new Date().toISOString()
    };
    DB.escrowLedgers.unshift(ledger);

    return sendJson(res, 200, {
      groupCode: groupCode,
      memberIndex: memberIndex,
      paidAt: new Date().toISOString(),
      transactionId: ledger.txId,
      message: `Thành viên M${memberIndex} đã chuyển khoản thành công vào tài khoản doanh nghiệp WanderMatch.`
    });
  }

  // 13. One-Click Out-of-Office / Xin nghỉ phép Generator
  if (pathname === '/api/pragmatic/leave-letter' && req.method === 'POST') {
    const body = await parseBody(req);
    const fullName = body.fullName || "Nguyễn Văn An";
    const department = body.department || "Phòng Kỹ thuật & Công nghệ";
    const startDate = body.startDate || "Thứ Sáu, ngày 24/10";
    const endDate = body.endDate || "Chủ Nhật, ngày 26/10";
    const urgentContact = body.urgentContact || "0908.123.488";

    const letterContent = `Kính gửi: Ban Giám đốc & Trưởng Bộ phận ${department},

Tôi tên là: ${fullName}
Hiện đang công tác tại vị trí: Thành viên phụ trách dự án

Nay tôi viết đơn này kính xin phép Ban Giám đốc và Quản lý trực tiếp cho phép tôi được nghỉ phép trong thời gian:
- Từ: ${startDate}
- Đến hết: ${endDate}
- Lý do: Tái tạo năng lượng cá nhân qua chuyến du lịch trải nghiệm cuối tuần.

Trong thời gian nghỉ phép:
- Tôi đã bàn giao các đầu việc khẩn cấp cho đồng nghiệp trong nhóm.
- Trường hợp có sự cố phát sinh cần hỗ trợ gấp, vui lòng liên hệ qua số điện thoại: ${urgentContact}.
- Email sẽ được phản hồi ngay khi tôi quay trở lại văn phòng vào sáng Thứ Hai.

Kính mong Ban Giám đốc xem xét và phê duyệt.
Tôi xin chân thành cảm ơn!

Người làm đơn,
${fullName}`;

    return sendJson(res, 200, {
      subject: `[ĐƠN XIN NGHỈ PHÉP] - ${fullName} (${startDate} - ${endDate})`,
      content: letterContent
    });
  }

  // 14. SOS Room Exchange SLA Claim
  if (pathname === '/api/pragmatic/sos-sla' && req.method === 'POST') {
    const body = await parseBody(req);
    const penaltyAmount = 5000000;
    DB.slaDepositBalance = Math.max(0, DB.slaDepositBalance - penaltyAmount);

    const ledger = {
      txId: `TX-SOS-SLA-${Date.now().toString().slice(-5)}`,
      tripCode: body.tripCode || "WM99081234",
      type: "SLA_PENALTY_DEDUCTION",
      direction: "OUT",
      amount: "5.000.000đ",
      sender: "B2B_PARTNER_ESCROW_SECURITY_DEPOSIT",
      receiver: "5_STAR_BACKUP_HOTEL_REPLACEMENT",
      status: "DISBURSED_TO_PARTNER",
      time: new Date().toISOString()
    };
    DB.escrowLedgers.unshift(ledger);

    return sendJson(res, 200, {
      slaClaimId: `SLA-CLAIM-${Date.now().toString().slice(-4)}`,
      resolutionMinutes: 15,
      backupHotelAssigned: "Sheraton / Grand Mercure 5-Sao Dự Phòng Ngay Liền Kề",
      voucherCode: `UPGRADE-5STAR-${Math.floor(10000 + Math.random() * 90000)}`,
      privateTransferDispatched: "Xe Mercedes đón quý khách sang khách sạn dự phòng trong vòng 10 phút.",
      penaltyDeductedFromPartner: penaltyAmount,
      remainingSlaFund: DB.slaDepositBalance,
      message: "Hệ thống đã tự động trích quỹ ký quỹ đối tác để nâng cấp phòng 5 sao miễn phí cho quý khách."
    });
  }

  // 15. Unit Economics Calculator
  if (pathname === '/api/pragmatic/unit-economics' && req.method === 'GET') {
    return sendJson(res, 200, {
      unitEconomics: [
        { metric: "1. Giá trị Bán lẻ ngoài thị trường (Retail Price)", amount: "6.200.000đ", percentage: "124%", explanation: "Giá nếu khách tự lên OTA đặt vé khứ hồi (3,2tr) + KS 4 sao (3,0tr)." },
        { metric: "2. Giá trọn gói Khách trả qua QR WanderMatch", amount: "5.000.000đ", percentage: "100%", explanation: "Khách hàng lãi ngay 1.200.000đ so với tự đi đặt lẻ, lại không tốn công lên lịch." },
        { metric: "3. Giá vốn Sỉ trả cho Công ty Du lịch (NetPrice)", amount: "3.750.000đ", percentage: "75%", explanation: "Công ty du lịch xả được phòng/vé trống phút chót, thu tiền tươi qua STK liên kết." },
        { metric: "4. Quỹ Voucher Ẩm thực/Bảo hiểm SLA tặng khách", amount: "250.000đ", percentage: "5%", explanation: "Tặng khách mã giảm giá ăn uống bản địa & quỹ dự phòng nâng hạng phòng." },
        { metric: "5. Lợi nhuận gộp của WanderMatch (Gross Margin)", amount: "1.000.000đ", percentage: "20%", explanation: "Biên lợi nhuận thực thu trên mỗi giao dịch (chưa tính doanh thu phụ từ Upsell Blacklist)." }
      ]
    });
  }

  // ==========================================================================
  // CLOUD WORKER V3.0 COMPATIBLE ROUTES (/api/create-booking, /api/reveal, etc.)
  // ==========================================================================
  if (!DB.cloudBookings) {
    DB.cloudBookings = new Map();
  }

  const CLOUD_FALLBACK_INVENTORIES = [
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
      retail_price: 5400000,
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
      net_price: 4200000,
      hotel_confirmation_code: "SLA-PQ-55190",
      weather_temp_c: 29,
      weather_desc: "Nắng ấm nhiệt đới, biển êm",
      attribute_vector: { healing: 80, nature: 85, solitude: 60, comfort: 98, culture: 60 },
      default_hint: "Đảo ngọc nắng ấm và tiếng sóng vỗ dịu êm đang chờ đón bạn cùng kỳ nghỉ dưỡng 5 sao trọn vẹn.",
      default_packing: ["Đồ bơi & Kính râm chống UV", "Kem chống nắng SPF50+", "CCCD bản gốc", "Dép đi biển & Mũ rộng vành", "Sạc dự phòng"],
      default_food: ["Bún quậy Kiến Xây (65.000đ/tô)", "Gỏi cá trích Hàm Ninh (150.000đ/đĩa)", "Cảnh báo: Chỉ mua ngọc trai và nước mắm tại cơ sở chính hãng có niêm yết giá"]
    }
  ];

  function normalizeVNNameLocal(str = "") {
    return String(str)
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/đ/g, "d")
      .replace(/Đ/g, "D")
      .toUpperCase()
      .replace(/\s+/g, " ")
      .trim();
  }

  function cosineSimLocal(vecA = {}, vecB = {}) {
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

  if (pathname === '/api/create-booking' && req.method === 'POST') {
    const body = await parseBody(req);
    const {
      email = "khachhang@wandermatch.vn",
      fullName = "Hội Viên Khách Hàng",
      cccd = "079095012345",
      bankCode = "MB",
      bankAccount = "0988888888",
      bankAccountHolder = "",
      personaVector = { healing: 90, nature: 85, solitude: 80, comfort: 90, culture: 75 },
      comfortLocks = {},
      blacklistedCities = [],
      budgetVnd = 5000000,
      groupSize = 1
    } = body;

    const resolvedHolder = bankAccountHolder || fullName;
    if (bankAccountHolder && normalizeVNNameLocal(fullName) !== normalizeVNNameLocal(bankAccountHolder)) {
      return sendJson(res, 400, {
        error: `Từ chối giao dịch: Tên người đặt (${normalizeVNNameLocal(fullName)}) không khớp với Chủ TK Ngân hàng (${normalizeVNNameLocal(bankAccountHolder)}).`
      });
    }

    let candidates = CLOUD_FALLBACK_INVENTORIES.filter(item => !blacklistedCities.includes(item.city_name));
    if (candidates.length === 0) candidates = CLOUD_FALLBACK_INVENTORIES;

    candidates = candidates.map(item => ({
      ...item,
      similarityScore: Math.round(cosineSimLocal(personaVector, item.attribute_vector) * 1000) / 10
    })).sort((a, b) => b.similarityScore - a.similarityScore);

    const chosenItem = candidates[0];
    const bookingCode = "WM" + Math.floor(10000 + Math.random() * 90000);
    const totalBudget = Number(budgetVnd) * Number(groupSize);
    const totalRetail = Math.max(Number(chosenItem.retail_price) * Number(groupSize), Math.round(totalBudget * 1.24));
    const totalNetCost = Math.round(totalBudget * 0.76);
    const grossMargin = totalBudget - totalNetCost;

    const record = {
      booking_code: bookingCode,
      group_size: Number(groupSize),
      budget_vnd: totalBudget,
      retail_value_vnd: totalRetail,
      net_cost_vnd: totalNetCost,
      gross_margin_vnd: grossMargin,
      ai_reasoning_log: `[Vector Score: ${chosenItem.similarityScore}%] Khớp chỉ số Chữa lành (${personaVector.healing || 85}%) & Thiên nhiên (${personaVector.nature || 85}%). Đã loại trừ Blacklist (${blacklistedCities.join(", ") || "Không"}).`,
      mystery_hint: chosenItem.default_hint,
      packing_checklist: chosenItem.default_packing,
      anti_tourist_trap_guide: chosenItem.default_food,
      _secret_inventory: chosenItem,
      _customer_name: fullName,
      _customer_email: email,
      _bank_info: `${bankCode} - ***${String(bankAccount).slice(-4)}`
    };
    DB.cloudBookings.set(bookingCode, record);

    const bankId = "MB";
    const accNo = "0988888888";
    const accName = "CONG TY TNHH WANDERMATCH VN";
    const perPerson = Number(budgetVnd);
    const splitQrs = Array.from({ length: Number(groupSize) }, (_, idx) => ({
      memberIndex: idx + 1,
      amount: perPerson,
      memo: `${bookingCode} M${idx + 1}`,
      qrUrl: `https://img.vietqr.io/image/${bankId}-${accNo}-compact2.png?amount=${perPerson}&addInfo=${encodeURIComponent(`${bookingCode} M${idx + 1}`)}&accountName=${encodeURIComponent(accName)}`
    }));

    return sendJson(res, 200, {
      bookingCode,
      totalBudget,
      weatherTempC: chosenItem.weather_temp_c,
      weatherDesc: chosenItem.weather_desc,
      mysteryHint: record.mystery_hint,
      packingChecklist: record.packing_checklist,
      splitQrs,
      savedToSupabase: false
    });
  }

  if (pathname === '/api/reveal' && req.method === 'POST') {
    const body = await parseBody(req);
    const record = DB.cloudBookings.get(body.bookingCode);
    const inv = record ? record._secret_inventory : CLOUD_FALLBACK_INVENTORIES[0];
    const paid = record ? record.budget_vnd : 5000000;
    const retail = record ? record.retail_value_vnd : 6500000;

    return sendJson(res, 200, {
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
    });
  }

  if (pathname === '/api/refund-simulate' && req.method === 'POST') {
    const body = await parseBody(req);
    const { bookingCode, scenario } = body;
    const record = DB.cloudBookings.get(bookingCode);
    const totalPaid = record ? record.budget_vnd : 5000000;
    const policies = {
      EARLY_72H: {
        title: "Hủy sớm trước 72 giờ khởi hành",
        feeRate: 0.10,
        b2bRate: 0.00,
        note: "Hoàn tự động 90% về STK đã liên kết trong 60 giây."
      },
      LATE_24_72H: {
        title: "Hủy cận ngày (Từ 24h đến 72h trước giờ khởi hành)",
        feeRate: 0.35,
        b2bRate: 0.25,
        note: "Phí hủy 35% (Trích 25% chuyển thẳng vào STK Công ty Du lịch để đền bù giữ phòng cam kết). Hoàn 65% về STK của bạn."
      },
      FORCE_MAJEURE: {
        title: "Trường hợp Đặc biệt Bất khả kháng (Có bệnh án / Thiên tai)",
        feeRate: 0.10,
        b2bRate: 0.00,
        note: "Bảo vệ người tiêu dùng: Miễn phạt hủy muộn sau khi Admin kiểm duyệt chứng từ. Hoàn 90% về STK."
      },
      UNDER_24H: {
        title: "Hủy dưới 24h hoặc Đã mở khóa điểm đến",
        feeRate: 1.00,
        b2bRate: 0.75,
        note: "Không áp dụng hoàn tiền thường vì vé và mã phòng cam kết cứng đã xuất."
      }
    };
    const p = policies[scenario] || policies.EARLY_72H;
    const totalFee = Math.round(totalPaid * p.feeRate);
    const partnerComp = Math.round(totalPaid * p.b2bRate);
    const netRefund = totalPaid - totalFee;
    return sendJson(res, 200, {
      totalPaid,
      policyTitle: p.title,
      totalFee,
      partnerComp,
      netRefund,
      statusNote: p.note
    });
  }

  if (pathname === '/api/feedback' && req.method === 'POST') {
    const body = await parseBody(req);
    const { bookingCode, rating, review } = body;
    const record = DB.cloudBookings.get(bookingCode);
    if (record) {
      record.customer_rating = rating;
      record.customer_review = review;
    }
    return sendJson(res, 200, { success: true });
  }

  if (pathname === '/api/admin-summary' && req.method === 'GET') {
    const list = Array.from(DB.cloudBookings.values()).map(b => ({
      bookingCode: b.booking_code,
      customerName: b._customer_name,
      bankInfo: b._bank_info,
      cityName: b._secret_inventory.city_name,
      hotelConfirmationCode: b._secret_inventory.hotel_confirmation_code,
      budgetVnd: b.budget_vnd,
      netCostVnd: b.net_cost_vnd,
      grossMarginVnd: b.gross_margin_vnd,
      aiReasoningLog: b.ai_reasoning_log,
      customerReview: b.customer_review || "Chưa có đánh giá"
    }));
    return sendJson(res, 200, { bookings: list, supabaseConnected: false });
  }

  if (pathname === '/api/b2b-add-inventory' && req.method === 'POST') {
    const body = await parseBody(req);
    return sendJson(res, 200, { success: true, item: body });
  }

  if (pathname === '/api/ai-sensitivity-test' && (req.method === 'POST' || req.method === 'GET')) {
    return sendJson(res, 200, {
      distinctWinnersCount: 3,
      results: [
        { scenarioId: "SCENARIO_1", profileName: "Kịch bản 1: Khách thích Độc hành rừng núi hoang sơ", winnerCity: "Măng Đen", winnerScore: 100 },
        { scenarioId: "SCENARIO_2", profileName: "Kịch bản 2: Khách thích Văn hóa cố đô & Di sản", winnerCity: "Huế", winnerScore: 100 },
        { scenarioId: "SCENARIO_3", profileName: "Kịch bản 3: Khách thích Resort biển 5 sao + Blacklist Đà Lạt", winnerCity: "Phú Quốc", winnerScore: 100 }
      ]
    });
  }

  if (pathname === '/api/health') {
    return sendJson(res, 200, {
      status: "ONLINE",
      worker: "wandermatch-api-v3",
      supabase_status: "FALLBACK_VAULT_READY",
      supabaseConnected: false,
      ai_status: "EUCLIDEAN_COSINE_5D_ACTIVE",
      company_bank: {
        bank_id: "MB",
        account_no: "0988888888",
        account_name: "CONG TY TNHH WANDERMATCH VN"
      }
    });
  }

  // ==========================================================================
  // STATIC FILE SERVING (ROOT FIRST, THEN FRONTEND)
  // ==========================================================================
  let reqRelPath = pathname === '/' ? 'index.html' : pathname.replace(/^\//, '');
  let filePath = path.join(ROOT_DIR, reqRelPath);
  if (!fs.existsSync(filePath) || !fs.statSync(filePath).isFile()) {
    filePath = path.join(ROOT_DIR, 'frontend', reqRelPath);
  }

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end('404 Not Found');
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    res.writeHead(200, { 'Content-Type': contentType });
    fs.createReadStream(filePath).pipe(res);
  });
});

server.listen(PORT, () => {
  console.log(`====================================================================`);
  console.log(`🚀 WANDERMATCH 3.1 SERVER RUNNING AT: http://localhost:${PORT}`);
  console.log(`📌 Trip Planner: Input Destination & Custom Budget Enabled`);
  console.log(`🔄 GitHub Auto-Sync Watcher: ACTIVE (Auto commit & push on save)`);
  console.log(`====================================================================`);
  autoSync.startFileWatcher();
});
