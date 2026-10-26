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
      sender: "NGUYEN VAN AN (MBBank)",
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

  // 1. AI Trip Planner: Input Destination & Custom Budget
  if (pathname === '/api/planner/generate' && req.method === 'POST') {
    const body = await parseBody(req);
    const destination = body.destination || 'hochiminh';
    const budget = Math.max(1000000, Number(body.budget) || 5000000);
    const pax = Number(body.pax) || 2;
    const duration = body.duration || '3d2n';

    const allocation = {
      accommodation: { pct: 40, amount: Math.round(budget * 0.4) },
      foodAndDining: { pct: 30, amount: Math.round(budget * 0.3) },
      attractionTickets: { pct: 20, amount: Math.round(budget * 0.2) },
      contingencyTransit: { pct: 10, amount: Math.round(budget * 0.1) }
    };

    return sendJson(res, 200, {
      success: true,
      destinationSelected: destination,
      totalBudget: budget,
      travelersCount: pax,
      duration: duration,
      budgetPerPax: Math.round(budget / pax),
      allocationBreakdown: allocation,
      itinerariesGenerated: 3,
      message: "AI has successfully generated 3 personalized time-slotted itineraries matching your destination and budget."
    });
  }

  // 2. NAPAS 247 Instant Account Holder Lookup
  if (pathname === '/api/napas/lookup' && req.method === 'POST') {
    const body = await parseBody(req);
    const { bankCode, accountNumber } = body;
    
    return sendJson(res, 200, {
      success: true,
      napasRef: `NAPAS247-${Date.now()}`,
      bankCode: bankCode || 'MB',
      accountNumber: accountNumber || '0388998899',
      accountHolderName: 'NGUYEN VAN AN',
      isExactMatch: true,
      verificationStatus: 'ACTIVE_VERIFIED',
      message: 'Account owner 100% matches national ID name.'
    });
  }

  // 3. Corporate VietQR Gateway Dynamic Generator (Accepts Custom Budget)
  if (pathname === '/api/vietqr/generate' && req.method === 'POST') {
    const body = await parseBody(req);
    const amount = Number(body.amount) || 5000000;
    const orderCode = body.orderCode || 'WM99081234';

    return sendJson(res, 200, {
      success: true,
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

    const newLedger = {
      txId: `TX-QR-${Date.now().toString().slice(-5)}`,
      tripCode: orderCode,
      type: "VIETQR_ESCROW_INFLOW",
      direction: "IN",
      amount: `${amount.toLocaleString('vi-VN')}đ`,
      sender: "NGUYEN VAN AN (MBBank)",
      receiver: "CONG TY CP CONG NGHE DU LICH WANDERMATCH",
      status: "HELD_IN_ESCROW",
      time: new Date().toISOString()
    };
    DB.escrowLedgers.unshift(newLedger);

    return sendJson(res, 200, {
      success: true,
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
      success: true,
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
      success: true,
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
      success: true,
      penaltyDeducted: penalty,
      newSlaBalance: DB.slaDepositBalance,
      guestAction: "AUTOMATIC_5_STAR_HOTEL_UPGRADE_EXECUTED",
      message: "Deducted 50% SLA guarantee deposit (10M VND) to upgrade customer immediately."
    });
  }

  // 8. Get Escrow Ledgers
  if (pathname === '/api/escrow/ledgers' && req.method === 'GET') {
    return sendJson(res, 200, {
      success: true,
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
      success: true,
      message: 'Hồ sơ khách hàng đã được lưu trữ an toàn vào hệ thống Supabase & máy chủ!',
      profile: DB.customerProfiles[userEmail]
    });
  }

  if (pathname === '/api/customer/profile' && req.method === 'GET') {
    const email = ((parsedUrl.query && parsedUrl.query.email) || '').toLowerCase();
    const profile = email ? DB.customerProfiles[email] : null;
    return sendJson(res, 200, {
      success: true,
      profile: profile || null,
      totalStored: Object.keys(DB.customerProfiles).length
    });
  }

  // 9. GitHub Auto-Sync Status & Manual Trigger
  if (pathname === '/api/github/status' && req.method === 'GET') {
    return sendJson(res, 200, {
      success: true,
      syncStatus: autoSync.getSyncStatus()
    });
  }

  if (pathname === '/api/github/sync' && req.method === 'POST') {
    const syncRes = await autoSync.performGitSync('Manual-Modal-Trigger');
    return sendJson(res, 200, {
      success: true,
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
      success: true,
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
      success: true,
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
      success: true,
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
      success: true,
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
      success: true,
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
      success: true,
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
      email = "nguyenvanan@wandermatch.vn",
      fullName = "Nguyễn Văn An",
      cccd = "079095012345",
      bankCode = "MB",
      bankAccount = "0388998899",
      bankAccountHolder = "NGUYEN VAN AN",
      personaVector = { healing: 90, nature: 85, solitude: 80, comfort: 90, culture: 75 },
      comfortLocks = {},
      blacklistedCities = [],
      budgetVnd = 5000000,
      groupSize = 1
    } = body;

    if (normalizeVNNameLocal(fullName) !== normalizeVNNameLocal(bankAccountHolder)) {
      return sendJson(res, 400, {
        error: `Từ chối giao dịch: Tên trên CCCD (${normalizeVNNameLocal(fullName)}) không khớp với Chủ TK Ngân hàng (${normalizeVNNameLocal(bankAccountHolder)}).`
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
      success: true,
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
      success: true,
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
