// ============================================================================
// WANDERMATCH V4.1 — EXTERNAL SERVICES (VIETQR & OAUTH VERIFIER)
// ============================================================================

export function buildSplitVietQrs({ bookingCode, groupSize, costPerPerson, env = {} }) {
  const bankId = env?.COMPANY_BANK_ID || "MB";
  const accountNo = env?.COMPANY_ACCOUNT_NO || "0988888888";
  const accountName = env?.COMPANY_ACCOUNT_NAME || "CONG TY TNHH WANDERMATCH VN";

  return Array.from({ length: Number(groupSize) }, (_, i) => ({
    memberIndex: i + 1,
    amount: costPerPerson,
    memo: `${bookingCode} M${i + 1}`,
    qrUrl: `https://img.vietqr.io/image/${bankId}-${accountNo}-compact2.png?amount=${costPerPerson}&addInfo=${encodeURIComponent(`${bookingCode} M${i + 1}`)}&accountName=${encodeURIComponent(accountName)}`
  }));
}

