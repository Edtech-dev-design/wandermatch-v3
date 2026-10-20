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
  }
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

  // ==========================================================================
  // STATIC FILE SERVING
  // ==========================================================================
  let filePath = path.join(ROOT_DIR, pathname === '/' ? 'index.html' : pathname);

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
  console.log(`🚀 WANDERMATCH 3.0 SERVER RUNNING AT: http://localhost:${PORT}`);
  console.log(`📌 Trip Planner: Input Destination & Custom Budget Enabled`);
  console.log(`====================================================================`);
});
