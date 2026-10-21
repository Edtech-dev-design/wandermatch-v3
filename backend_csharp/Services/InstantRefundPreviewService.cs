using System;
using System.Threading.Tasks;

namespace WanderMatch.PragmaticFintech.Services
{
    public record RefundSimulationResult(
        Guid TripId,
        string TripCode,
        decimal OriginalTripPrice,
        DateTime DepartureTime,
        TimeSpan RemainingHoursUntilDeparture,
        string TierCategory,
        decimal PlatformServiceFeePct,
        decimal PlatformServiceFeeAmount,
        decimal HotelOpportunityCompensationPct,
        decimal HotelOpportunityCompensationAmount,
        decimal NetRefundToUser,
        decimal RefundPercentage,
        string LinkedBankAccountMasked,
        string CountdownNotice,
        bool IsInstantPayoutEligible
    );

    public record ExecuteInstantRefundRequest(
        Guid TripId,
        string OtpCode,
        string Reason
    );

    public record InstantRefundExecutionResult(
        bool Success,
        string TransactionReference,
        decimal AmountTransferred,
        string BeneficiaryAccount,
        int TransferDurationSeconds,
        string InventoryReleaseStatus,
        DateTime ProcessedAt,
        string Message
    );

    /// <summary>
    /// PROMPT 3: Dịch vụ Tính Phí Hủy Minh Bạch & Hoàn Tiền Thực Tức Thời (InstantRefundPreviewService)
    /// Xóa bỏ nỗi sợ thủ tục hoàn tiền rườm rà. Hiển thị đồng hồ đếm ngược, bóc tách dòng tiền,
    /// chuyển tiền về STK Napas 247 trong 60s và lập tức giải phóng phòng B2B.
    /// </summary>
    public class InstantRefundPreviewService
    {
        public async Task<RefundSimulationResult> GetRefundSimulationAsync(Guid tripId, decimal tripPrice, DateTime departureTime)
        {
            var now = DateTime.UtcNow;
            var remaining = departureTime - now;
            var remainingHours = remaining.TotalHours;

            string tier;
            decimal platformPct;
            decimal hotelPct;
            decimal refundPct;

            if (remainingHours >= 72)
            {
                tier = "TIER_1_EARLY_72H";
                platformPct = 10m;
                hotelPct = 0m;
                refundPct = 90m;
            }
            else if (remainingHours >= 24)
            {
                tier = "TIER_2_WINDOW_24_72H";
                platformPct = 15m;
                hotelPct = 25m; // Đền bù chi phí cơ hội giữ phòng cho đối tác du lịch
                refundPct = 60m;
            }
            else
            {
                tier = "TIER_3_LATE_UNDER_24H";
                platformPct = 20m;
                hotelPct = 60m;
                refundPct = 20m;
            }

            var platformAmount = Math.Round(tripPrice * (platformPct / 100m), 0);
            var hotelAmount = Math.Round(tripPrice * (hotelPct / 100m), 0);
            var netRefund = tripPrice - platformAmount - hotelAmount;

            var hoursLeft = Math.Max(0, (int)remaining.TotalHours);
            var minutesLeft = Math.Max(0, remaining.Minutes);
            var notice = remainingHours >= 72
                ? $"Bạn còn {hoursLeft} giờ {minutesLeft} phút để hủy chuyến với mức phí ưu đãi chỉ 10% (Nhận lại ngay {netRefund:N0}đ về STK Napas 247)."
                : $"Khung hủy trong 24h-72h: Nhận lại ngay {netRefund:N0}đ ({refundPct}%). Đối tác du lịch nhận 25% đền bù giữ phòng.";

            var result = new RefundSimulationResult(
                tripId,
                $"WM-{tripId.ToString().Substring(0, 8).ToUpper()}",
                tripPrice,
                departureTime,
                remaining,
                tier,
                platformPct,
                platformAmount,
                hotelPct,
                hotelAmount,
                netRefund,
                refundPct,
                "Vietcombank (***8899 - NGUYEN VAN AN)",
                notice,
                true
            );

            return await Task.FromResult(result);
        }

        public async Task<InstantRefundExecutionResult> ExecuteInstantPayoutRefundAsync(ExecuteInstantRefundRequest request, decimal netRefundAmount)
        {
            // Simulate Napas 247 Direct Payout in 60s
            var txRef = $"PAYOUT-NP-{DateTime.UtcNow.Ticks.ToString().Substring(10)}";

            // Release room inventory back to B2B Last-Minute Arbitrage Pool
            await ReleaseRoomInventoryToB2bPoolAsync(request.TripId);

            var result = new InstantRefundExecutionResult(
                Success: true,
                TransactionReference: txRef,
                AmountTransferred: netRefundAmount,
                BeneficiaryAccount: "MBBank / NGUYEN VAN AN (0388998899)",
                TransferDurationSeconds: 45,
                InventoryReleaseStatus: "INVENTORY_RETURNED_TO_B2B_POOL",
                ProcessedAt: DateTime.UtcNow,
                Message: $"Đã hoàn trả {netRefundAmount:N0}đ về STK ngân hàng thành công qua Napas 247 trong 45 giây. Phòng đã được mở bán lại trên cổng B2B."
            );

            return await Task.FromResult(result);
        }

        private Task ReleaseRoomInventoryToB2bPoolAsync(Guid tripId)
        {
            Console.WriteLine($"[B2B Inventory Pool] Đã mở khóa lại phòng của chuyến {tripId} vào rổ thanh lý giờ chót cho khách khác.");
            return Task.CompletedTask;
        }
    }
}
