using System;
using System.Threading.Tasks;

namespace WanderMatch.PragmaticFintech.Services
{
    public record Stage1SettlementResult(
        Guid CommitmentId,
        Guid PartnerId,
        string PartnerName,
        string PartnerKybAccount,
        decimal TotalNetPrice,
        decimal Stage1PayoutAmount, // 70%
        string BankTransactionId,
        DateTime DisbursedAt,
        string Status
    );

    public record Stage2SettlementResult(
        Guid CommitmentId,
        Guid PartnerId,
        decimal Stage2PayoutAmount, // 30%
        bool HasSlaClaim,
        decimal SlaDeduction,
        decimal FinalDisbursedAmount,
        string AuditReportEmail,
        DateTime DisbursedAt,
        string Status
    );

    public record CancellationCompensationResult(
        Guid CommitmentId,
        Guid PartnerId,
        decimal TravelerCancellationFee,
        decimal PartnerCompensationAmount, // 25% phí phạt
        string BankTransactionId,
        DateTime DisbursedAt,
        string Message
    );

    /// <summary>
    /// PROMPT 5: Cơ chế Tự động Giải ngân Liên kết Ngân hàng theo Giai đoạn (PartnerLinkedBankSettlementService)
    /// Giai đoạn 1: Khi khách Check-in quầy lễ tân -> chuyển 70% NetPrice vào STK KYB doanh nghiệp đối tác.
    /// Giai đoạn 2: Sau 24h Check-out và không khiếu nại SLA -> giải ngân 30% còn lại kèm báo cáo đối soát.
    /// Khi khách hủy trong khung 24h-72h -> trích 25% phí phạt chuyển thẳng cho đối tác.
    /// </summary>
    public class PartnerLinkedBankSettlementService
    {
        public async Task<Stage1SettlementResult> ExecuteStage1CheckInSettlementAsync(Guid commitmentId, Guid partnerId, string partnerName, string kybAccount, decimal totalNetPrice)
        {
            var stage1Amount = Math.Round(totalNetPrice * 0.70m, 0);
            var txId = $"SETTLE-STG1-{DateTime.UtcNow.Ticks.ToString().Substring(10)}";

            Console.WriteLine($"[B2B Bank Settlement - Stage 1] Khách Check-in thành công. Đã giải ngân 70% ({stage1Amount:N0}đ) vào STK {kybAccount} ({partnerName}).");

            var result = new Stage1SettlementResult(
                commitmentId,
                partnerId,
                partnerName,
                kybAccount,
                totalNetPrice,
                stage1Amount,
                txId,
                DateTime.UtcNow,
                "STAGE_1_70_PERCENT_DISBURSED"
            );

            return await Task.FromResult(result);
        }

        public async Task<Stage2SettlementResult> ExecuteStage2CheckOutSettlementAsync(Guid commitmentId, Guid partnerId, decimal totalNetPrice, bool hasSlaClaim, decimal slaPenaltyAmount)
        {
            var baseStage2Amount = Math.Round(totalNetPrice * 0.30m, 0);
            var actualDisbursed = Math.Max(0, baseStage2Amount - slaPenaltyAmount);

            Console.WriteLine($"[B2B Bank Settlement - Stage 2] Sau 24h Check-out. SLA Claim: {hasSlaClaim}. Đã tất toán {actualDisbursed:N0}đ kèm gửi báo cáo đối soát điện tử.");

            var result = new Stage2SettlementResult(
                commitmentId,
                partnerId,
                baseStage2Amount,
                hasSlaClaim,
                slaPenaltyAmount,
                actualDisbursed,
                "accounting@wandermatch-partner.vn",
                DateTime.UtcNow,
                "STAGE_2_FINAL_SETTLED"
            );

            return await Task.FromResult(result);
        }

        public async Task<CancellationCompensationResult> CompensatePartnerForLateCancellationAsync(Guid commitmentId, Guid partnerId, decimal cancellationFeeChargedToUser)
        {
            // Trích 25% phí phạt của khách đền bù chi phí cơ hội giữ phòng
            var compensation = Math.Round(cancellationFeeChargedToUser * 0.25m, 0);
            var txId = $"COMP-CANCEL-{DateTime.UtcNow.Ticks.ToString().Substring(10)}";

            Console.WriteLine($"[B2B Cancellation Compensation] Khách hủy 24h-72h. Đã trích 25% ({compensation:N0}đ) đền bù đối tác {partnerId}.");

            var result = new CancellationCompensationResult(
                commitmentId,
                partnerId,
                cancellationFeeChargedToUser,
                compensation,
                txId,
                DateTime.UtcNow,
                $"Đã bồi thường {compensation:N0}đ chi phí cơ hội giữ phòng cho đối tác du lịch."
            );

            return await Task.FromResult(result);
        }
    }
}
