using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace WanderMatch.PragmaticFintech.Services
{
    public record B2BInventorySubmissionDto(
        Guid PartnerId,
        string PartnerName,
        string DestinationCode,
        string HotelName,
        int StarRating,
        decimal DeclaredRetailPrice,
        decimal WholesaleNetPrice,
        int TotalRoomsAllocated,
        decimal PartnerEscrowDepositBalance,
        string BedType,
        bool HasWorkDesk,
        int WifiMbps
    );

    public record QualityGateValidationResult(
        bool IsApproved,
        string StatusCode,
        decimal MarketBenchmarkPrice,
        decimal DiscountPercentage,
        decimal RequiredEscrowDeposit,
        decimal ActualEscrowDeposit,
        List<string> RejectionReasons,
        string VerdictMessage
    );

    /// <summary>
    /// PROMPT 5: Bộ lọc Chặn "Hàng Rác" khi Đối tác Đẩy phòng (InventoryQualityGateValidator)
    /// Chặn nâng khống giá ảo (Fake Discount), kiểm tra chiết khấu Net >= 25%,
    /// kiểm tra Quỹ ký quỹ đảm bảo SLA >= 30%.
    /// </summary>
    public class InventoryQualityGateValidator
    {
        // Destination retail price benchmarks (per room night, 4-star standard)
        private static readonly Dictionary<string, decimal> MarketBenchmarks = new()
        {
            { "hochiminh", 2200000m },
            { "dalat", 1500000m },
            { "danang", 1800000m },
            { "phuquoc", 2500000m }
        };

        public async Task<QualityGateValidationResult> ValidateInventorySubmissionAsync(B2BInventorySubmissionDto submission)
        {
            var reasons = new List<string>();
            var dest = submission.DestinationCode.ToLower();
            var benchmark = MarketBenchmarks.TryGetValue(dest, out var val) ? val : 1600000m;

            // 1. Kiểm tra nâng khống giá bán lẻ (Fake Discount Anti-Inflated Price)
            if (submission.DeclaredRetailPrice > benchmark * 1.35m)
            {
                reasons.Add($"Giá bán lẻ khai báo ({submission.DeclaredRetailPrice:N0}đ) vượt quá 135% giá thị trường tham chiếu ({benchmark:N0}đ). Cảnh báo kê khống giá ảo.");
            }

            // 2. Bắt buộc mức chiết khấu NetPrice phải thấp hơn giá thị trường tối thiểu 25%
            var discountPct = Math.Round(((benchmark - submission.WholesaleNetPrice) / benchmark) * 100m, 1);
            if (discountPct < 25.0m)
            {
                reasons.Add($"Chiết khấu giá sỉ Net ({discountPct}%) chưa đạt mức tối thiểu 25% so với giá thị trường tham chiếu ({benchmark:N0}đ). Không đủ điều kiện vào Last-Minute Arbitrage Pool.");
            }

            // 3. Kiểm tra quỹ ký quỹ đảm bảo (EscrowSecurityDeposit >= 30% tổng giá trị lô phòng)
            var totalBatchNetValue = submission.WholesaleNetPrice * submission.TotalRoomsAllocated;
            var requiredEscrow = totalBatchNetValue * 0.30m;
            if (submission.PartnerEscrowDepositBalance < requiredEscrow)
            {
                reasons.Add($"Số dư Quỹ ký quỹ đối tác ({submission.PartnerEscrowDepositBalance:N0}đ) thấp hơn mức yêu cầu 30% bảo lãnh SLA ({requiredEscrow:N0}đ). Vui lòng nạp thêm ký quỹ.");
            }

            // 4. Tiêu chuẩn sao tối thiểu >= 3-4 sao
            if (submission.StarRating < 4)
            {
                reasons.Add("WanderMatch chỉ duyệt khách sạn từ 4 sao trở lên hoặc boutique có điểm đánh giá công khai >= 8.2.");
            }

            var isApproved = reasons.Count == 0;
            var status = isApproved ? "APPROVED_FOR_ARBITRAGE_POOL" : "REJECTED_QUALITY_BASELINE";
            var verdict = isApproved
                ? "Lô phòng đạt chuẩn chất lượng thực dụng. Đã đưa vào rổ ghép cặp tự động."
                : $"Từ chối duyệt: Có {reasons.Count} tiêu chí vi phạm tiêu chuẩn chất lượng cứng.";

            var result = new QualityGateValidationResult(
                isApproved,
                status,
                benchmark,
                discountPct,
                requiredEscrow,
                submission.PartnerEscrowDepositBalance,
                reasons,
                verdict
            );

            return await Task.FromResult(result);
        }
    }
}
