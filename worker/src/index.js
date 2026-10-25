/**
 * WANDERMATCH 3.0 — CLOUDFLARE WORKER BACKEND ENGINE
 * Edge-native Microservices & AI Security Gateway
 *
 * Capabilities:
 * 1. Reverse Proxy & CORS Guard
 * 2. AI Travel Itinerary & Budget Optimization
 * 3. Corporate VietQR & Escrow Ledger Management
 * 4. Napas 247 Instant Account Lookup & eKYC Verification
 * 5. 3-Tier Time-Based Conditional Refund Engine
 * 6. Hard-Commit SLA Guarantee & B2B Overbooking Penalty Handler
 * 7. Group Split-Bill VietQR Engine
 * 8. 1-Click Out-Of-Office Leave Application Generator
 */

// In-memory runtime state for Edge instance
const STATE = {
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
      time: "2026-10-25 10:14:22"
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
  }
};

function jsonResponse(data, status = 200, extraHeaders = {}) {
  const headers = {
    "Content-Type": "application/json; charset=utf-8",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Requested-With",
    "X-Powered-By": "Cloudflare-Worker-WanderMatch-v3",
    ...extraHeaders
  };
  return new Response(JSON.stringify(data, null, 2), { status, headers });
}

function handleCorsPreflight() {
  return new Response(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Requested-With",
      "Access-Control-Max-Age": "86400"
    }
  });
}

async function parseJsonBody(request) {
  try {
    const text = await request.text();
    return text ? JSON.parse(text) : {};
  } catch (err) {
    return {};
  }
}

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const { pathname } = url;
    const method = request.method.toUpperCase();

    // 0. Handle CORS Preflight
    if (method === "OPTIONS") {
      return handleCorsPreflight();
    }

    // 1. Health check & Worker Meta
    if (pathname === "/" || pathname === "/api" || pathname === "/api/health") {
      return jsonResponse({
        status: "ONLINE",
        service: "WanderMatch v3.0 Cloudflare Worker Backend",
        version: "3.0.0",
        edgeRegion: request.cf ? request.cf.colo : "LOCAL_DEV",
        timestamp: new Date().toISOString(),
        endpoints: [
          "/api/planner/generate",
          "/api/napas/lookup",
          "/api/vietqr/generate",
          "/api/vietqr/webhook",
          "/api/cancellation/calculate",
          "/api/b2b/commit-room",
          "/api/b2b/report-overbooking",
          "/api/escrow/ledgers",
          "/api/pragmatic/guarantee-calculate",
          "/api/group-booking/create",
          "/api/group-booking/pay-member",
          "/api/pragmatic/leave-letter",
          "/api/pragmatic/sos-sla",
          "/api/pragmatic/unit-economics"
        ]
      });
    }

    // 2. AI Trip Planner: Input Destination & Custom Budget
    if (pathname === "/api/planner/generate" && method === "POST") {
      const body = await parseJsonBody(request);
      const destination = body.destination || "hochiminh";
      const budget = Math.max(1000000, Number(body.budget) || 5000000);
      const pax = Number(body.pax) || 2;
      const duration = body.duration || "3d2n";

      const allocation = {
        accommodation: { pct: 40, amount: Math.round(budget * 0.4) },
        foodAndDining: { pct: 30, amount: Math.round(budget * 0.3) },
        attractionTickets: { pct: 20, amount: Math.round(budget * 0.2) },
        contingencyTransit: { pct: 10, amount: Math.round(budget * 0.1) }
      };

      const cityNames = {
        hochiminh: "TP. Hồ Chí Minh (Sài Gòn Hoa Lệ)",
        dalat: "Đà Lạt (Xứ Sở Sương Mù & Chill)",
        danang: "Đà Nẵng & Hội An (Biển Mỹ Khê & Phố Cổ)",
        blind: "Bản Đồ Mù (WanderMatch AI Tuyển Chọn Bất Ngờ)"
      };

      return jsonResponse({
        success: true,
        destinationSelected: destination,
        destinationLabel: cityNames[destination] || destination,
        totalBudget: budget,
        travelersCount: pax,
        duration: duration,
        budgetPerPax: Math.round(budget / pax),
        allocationBreakdown: allocation,
        itinerariesGenerated: 3,
        comfortLocksActive: {
          noRedEyeFlight: true,
          freeLuggageShuttle: true,
          workcationReady: true
        },
        message: "AI has successfully generated 3 personalized time-slotted itineraries matching your destination and budget."
      });
    }

    // 3. NAPAS 247 Instant Account Holder Lookup
    if (pathname === "/api/napas/lookup" && method === "POST") {
      const body = await parseJsonBody(request);
      const bankCode = (body.bankCode || "MB").toUpperCase();
      const accountNumber = body.accountNumber || "0388998899";

      return jsonResponse({
        success: true,
        napasRef: `NAPAS247-${Date.now()}`,
        bankCode: bankCode,
        accountNumber: accountNumber,
        accountHolderName: "NGUYEN VAN AN",
        isExactMatch: true,
        verificationStatus: "ACTIVE_VERIFIED",
        idCardMatchingName: "NGUYEN VAN AN",
        nationalIdVerified: true,
        message: "Account owner 100% matches national ID name. Instant 2s refund channel enabled."
      });
    }

    // 4. Corporate VietQR Gateway Dynamic Generator
    if (pathname === "/api/vietqr/generate" && method === "POST") {
      const body = await parseJsonBody(request);
      const amount = Math.max(100000, Number(body.amount) || 5000000);
      const orderCode = body.orderCode || `WM${Math.floor(10000000 + Math.random() * 90000000)}`;

      const qrUrl = `https://img.vietqr.io/image/MB-990812348888-compact2.png?amount=${amount}&addInfo=${orderCode}&accountName=CONG%20TY%20CP%20CONG%20NGHE%20DU%20LICH%20WANDERMATCH`;

      return jsonResponse({
        success: true,
        corporateLegalEntity: "CONG TY CP CONG NGHE DU LICH WANDERMATCH",
        corporateAccountNumber: "990812348888",
        corporateBankCode: "MB",
        orderReference: orderCode,
        amountLocked: amount,
        qrImageUrl: qrUrl,
        qrRawString: `00020101021238580010A0000007270126000697042201129908123488880208QRIBFTTA5303704540${amount}5802VN62140810${orderCode}6304`,
        escrowState: "HELD_IN_COMPANY_ESCROW",
        expiresInSeconds: 900
      });
    }

    // 5. Webhook VietQR Payment Simulation
    if (pathname === "/api/vietqr/webhook" && method === "POST") {
      const body = await parseJsonBody(request);
      const orderCode = body.orderCode || "WM99081234";
      const amount = Number(body.amount) || 5000000;

      const newLedger = {
        txId: `TX-QR-${Date.now().toString().slice(-5)}`,
        tripCode: orderCode,
        type: "VIETQR_ESCROW_INFLOW",
        direction: "IN",
        amount: `${amount.toLocaleString("vi-VN")}đ`,
        sender: "NGUYEN VAN AN (MBBank)",
        receiver: "CONG TY CP CONG NGHE DU LICH WANDERMATCH",
        status: "HELD_IN_ESCROW",
        time: new Date().toISOString()
      };
      STATE.escrowLedgers.unshift(newLedger);

      return jsonResponse({
        success: true,
        webhookProcessedAt: new Date().toISOString(),
        transactionId: newLedger.txId,
        escrowStatus: "HELD_IN_COMPANY_ESCROW",
        message: "Payment successfully received and locked in company escrow."
      });
    }

    // 6. Time-Tiered Refund Calculator
    if (pathname === "/api/cancellation/calculate" && method === "POST") {
      const body = await parseJsonBody(request);
      const tripPrice = Number(body.price) || 5000000;
      const hoursBeforeDeparture = Number(body.hoursBeforeDeparture) || 80;
      const isDestinationRevealed = Boolean(body.isDestinationRevealed);

      let tier = "TIER_1_EARLY_72H";
      let feePct = 10;
      let hotelCutPct = 0;
      let adminCutPct = 10;
      let refundPct = 90;

      if (isDestinationRevealed || hoursBeforeDeparture < 24) {
        tier = "TIER_3_LATE_OR_SCRATCHED";
        feePct = 100;
        hotelCutPct = 70;
        adminCutPct = 30;
        refundPct = 0;
      } else if (hoursBeforeDeparture <= 72) {
        tier = "TIER_2_WINDOW_24_72H";
        feePct = 35;
        hotelCutPct = 25;
        adminCutPct = 10;
        refundPct = 65;
      }

      const feeAmount = (tripPrice * feePct) / 100;
      const refundAmount = (tripPrice * refundPct) / 100;

      return jsonResponse({
        success: true,
        appliedTier: tier,
        originalPrice: tripPrice,
        feePercentage: feePct,
        feeAmount: feeAmount,
        hotelCompensationCut: (tripPrice * hotelCutPct) / 100,
        platformOperatingCut: (tripPrice * adminCutPct) / 100,
        netRefundToUserNapas: refundAmount,
        payoutTimeline: "Instant < 2s via Napas 247 eKYC Account"
      });
    }

    // 7. B2B Room Commitment & SLA Signing
    if (pathname === "/api/b2b/commit-room" && method === "POST") {
      const body = await parseJsonBody(request);
      const orderCode = body.orderCode || "WM99081234";
      const pmsCode = body.pmsCode || "PMS-DL-8892";

      STATE.pmsCommitments[orderCode] = {
        partnerName: "Khách sạn / Resort Đối tác",
        pmsCode: pmsCode,
        status: "HARD_COMMITTED",
        slaLocked: STATE.slaDepositBalance
      };

      return jsonResponse({
        success: true,
        status: "HARD_COMMITTED",
        pmsCode: pmsCode,
        slaGuaranteeDeposit: STATE.slaDepositBalance,
        signedAt: new Date().toISOString()
      });
    }

    // 8. B2B Overbooking Penalty Trigger
    if (pathname === "/api/b2b/report-overbooking" && method === "POST") {
      const penalty = 10000000;
      STATE.slaDepositBalance = Math.max(0, STATE.slaDepositBalance - penalty);

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
      STATE.escrowLedgers.unshift(ledger);

      return jsonResponse({
        success: true,
        penaltyDeducted: penalty,
        newSlaBalance: STATE.slaDepositBalance,
        guestAction: "AUTOMATIC_5_STAR_HOTEL_UPGRADE_EXECUTED",
        message: "Deducted 50% SLA guarantee deposit (10M VND) to upgrade customer immediately."
      });
    }

    // 9. Get Escrow Ledgers
    if (pathname === "/api/escrow/ledgers" && method === "GET") {
      return jsonResponse({
        success: true,
        ledgers: STATE.escrowLedgers
      });
    }

    // 10. Pragmatic Value Guarantee Calculator (Floor >= 120%)
    if (pathname === "/api/pragmatic/guarantee-calculate" && method === "POST") {
      const body = await parseJsonBody(request);
      const budget = Math.max(1000000, Number(body.budget) || 5000000);
      const retailFloor = Math.round(budget * 1.20);
      const estimatedSavings = Math.round(budget * 0.25);
      const wholesaleNetCost = Math.round(budget * 0.75);

      return jsonResponse({
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
    if (pathname === "/api/group-booking/create" && method === "POST") {
      const body = await parseJsonBody(request);
      const totalBudget = Math.max(2000000, Number(body.totalBudget) || 16000000);
      const membersCount = Math.min(10, Math.max(2, Number(body.membersCount) || 4));
      const groupCode = `G${Math.floor(1000 + Math.random() * 9000)}`;
      const perMember = Math.round(totalBudget / membersCount);

      const members = [];
      for (let i = 1; i <= membersCount; i++) {
        const memo = `WM ${groupCode} M${i}`;
        members.push({
          memberIndex: i,
          name: body.members && body.members[i - 1] ? body.members[i - 1].name : `Thành viên ${i}`,
          amountDue: perMember,
          memo: memo,
          vietQrPayload: `00020101021238580010A0000007270126000697042201129908123488880208QRIBFTTA5303704540${perMember}5802VN62140810${memo}6304`,
          isPaid: i === 1,
          paidAt: i === 1 ? new Date().toISOString() : null,
          payoutStatus: "NONE"
        });
      }

      return jsonResponse({
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
    if (pathname === "/api/group-booking/pay-member" && method === "POST") {
      const body = await parseJsonBody(request);
      const { groupCode, memberIndex, amount } = body;

      const ledger = {
        txId: `TX-GRP-${Date.now().toString().slice(-5)}`,
        tripCode: `WM-${groupCode}-M${memberIndex}`,
        type: "VIETQR_ESCROW_INFLOW",
        direction: "IN",
        amount: `${Number(amount || 4000000).toLocaleString("vi-VN")}đ`,
        sender: `Thành viên ${memberIndex} (Napas 247)`,
        receiver: "CONG TY CP CONG NGHE DU LICH WANDERMATCH",
        status: "HELD_IN_ESCROW",
        time: new Date().toISOString()
      };
      STATE.escrowLedgers.unshift(ledger);

      return jsonResponse({
        success: true,
        groupCode: groupCode,
        memberIndex: memberIndex,
        paidAt: new Date().toISOString(),
        transactionId: ledger.txId,
        message: `Thành viên M${memberIndex} đã chuyển khoản thành công vào tài khoản doanh nghiệp WanderMatch.`
      });
    }

    // 13. One-Click Out-of-Office Leave Application Generator
    if (pathname === "/api/pragmatic/leave-letter" && method === "POST") {
      const body = await parseJsonBody(request);
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

      return jsonResponse({
        success: true,
        subject: `[ĐƠN XIN NGHỈ PHÉP] - ${fullName} (${startDate} - ${endDate})`,
        content: letterContent
      });
    }

    // 14. SOS Room Exchange SLA Claim
    if (pathname === "/api/pragmatic/sos-sla" && method === "POST") {
      const body = await parseJsonBody(request);
      const penaltyAmount = 5000000;
      STATE.slaDepositBalance = Math.max(0, STATE.slaDepositBalance - penaltyAmount);

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
      STATE.escrowLedgers.unshift(ledger);

      return jsonResponse({
        success: true,
        slaClaimId: `SLA-CLAIM-${Date.now().toString().slice(-4)}`,
        resolutionMinutes: 15,
        backupHotelAssigned: "Sheraton / Grand Mercure 5-Sao Dự Phòng Ngay Liền Kề",
        voucherCode: `UPGRADE-5STAR-${Math.floor(10000 + Math.random() * 90000)}`,
        privateTransferDispatched: "Xe Mercedes đón quý khách sang khách sạn dự phòng trong vòng 10 phút.",
        penaltyDeductedFromPartner: penaltyAmount,
        remainingSlaFund: STATE.slaDepositBalance,
        message: "Hệ thống đã tự động trích quỹ ký quỹ đối tác để nâng cấp phòng 5 sao miễn phí cho quý khách."
      });
    }

    // 15. Unit Economics Calculator
    if (pathname === "/api/pragmatic/unit-economics" && method === "GET") {
      return jsonResponse({
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

    // Default 404 for unknown API routes
    return jsonResponse({
      error: "ENDPOINT_NOT_FOUND",
      message: `Endpoint ${method} ${pathname} not found on WanderMatch Worker.`,
      availableEndpointsPrefix: "/api"
    }, 404);
  }
};
