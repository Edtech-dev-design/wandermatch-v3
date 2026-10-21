using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WanderMatch.PragmaticFintech.Services
{
    public record CreateGroupSessionDto(
        Guid CreatorUserId,
        decimal TotalTripBudget,
        int TotalMembers,
        string TripTitle,
        List<GroupMemberRegistrationDto> Members
    );

    public record GroupMemberRegistrationDto(
        int MemberIndex,
        string FullName,
        string NapasBankCode,
        string NapasAccountNumber,
        string NationalIdNumber
    );

    public record GroupMemberPaymentStatus(
        int MemberIndex,
        string FullName,
        string NapasBankCode,
        string NapasAccountNumber,
        decimal AmountDue,
        string VietQrMemo,
        string DynamicQrPayload,
        bool IsPaid,
        DateTime? PaidAt,
        string PayoutRefundStatus
    );

    public record GroupBookingSessionResult(
        Guid SessionId,
        string GroupCode,
        decimal TotalAmount,
        decimal AmountPerMember,
        int TotalMembers,
        int PaidCount,
        DateTime ExpiresAt,
        string CorporateAccountNo,
        string CorporateBankCode,
        string Status,
        List<GroupMemberPaymentStatus> MembersStatus
    );

    /// <summary>
    /// PROMPT 3: Dịch vụ Chia tiền Nhóm thông qua Mã VietQR Công ty (GroupSplitBillVietQrService)
    /// Đảm bảo tính minh bạch, giữ chỗ 30 phút, tất cả QR trỏ về STK MBBank Công ty WanderMatch.
    /// Nếu đủ người -> kích hoạt AutoBookingSagaService. Nếu thiếu người -> tự động hoàn tiền 100%.
    /// </summary>
    public class GroupSplitBillVietQrService
    {
        private static readonly ConcurrentDictionary<string, GroupBookingSessionResult> _sessions = new();
        private const string CorporateBank = "MB";
        private const string CorporateAccount = "990812348888";
        private const string CorporateName = "CONG TY CP CONG NGHE DU LICH WANDERMATCH";

        public async Task<GroupBookingSessionResult> CreateGroupSessionAsync(CreateGroupSessionDto dto)
        {
            if (dto.TotalMembers < 2 || dto.TotalMembers > 10)
                throw new ArgumentException("Số thành viên nhóm phải từ 2 đến 10 người.");

            var groupCode = "G" + Random.Shared.Next(1000, 9999);
            var sessionId = Guid.NewGuid();
            var perMember = Math.Round(dto.TotalTripBudget / dto.TotalMembers, 0);
            var expiresAt = DateTime.UtcNow.AddMinutes(30);

            var membersStatus = new List<GroupMemberPaymentStatus>();
            for (int i = 0; i < dto.TotalMembers; i++)
            {
                var memberIndex = i + 1;
                var memberInfo = dto.Members != null && dto.Members.Count > i
                    ? dto.Members[i]
                    : new GroupMemberRegistrationDto(memberIndex, $"Thành viên {memberIndex}", "MB", $"0900{memberIndex}1234", $"07920100{memberIndex}99");

                var memo = $"WM {groupCode} M{memberIndex}";
                var qrPayload = GenerateDynamicVietQrString(CorporateBank, CorporateAccount, perMember, memo);

                membersStatus.Add(new GroupMemberPaymentStatus(
                    memberIndex,
                    memberInfo.FullName,
                    memberInfo.NapasBankCode,
                    memberInfo.NapasAccountNumber,
                    perMember,
                    memo,
                    qrPayload,
                    false,
                    null,
                    "NONE"
                ));
            }

            var session = new GroupBookingSessionResult(
                sessionId,
                groupCode,
                dto.TotalTripBudget,
                perMember,
                dto.TotalMembers,
                0,
                expiresAt,
                CorporateAccount,
                CorporateBank,
                "WAITING_MEMBERS",
                membersStatus
            );

            _sessions[groupCode] = session;
            return await Task.FromResult(session);
        }

        public async Task<GroupBookingSessionResult> ProcessMemberPaymentWebhookAsync(string groupCode, int memberIndex, decimal amountPaid)
        {
            if (!_sessions.TryGetValue(groupCode, out var session))
                throw new KeyNotFoundException($"Không tìm thấy phiên đặt nhóm: {groupCode}");

            if (session.ExpiresAt < DateTime.UtcNow && session.Status == "WAITING_MEMBERS")
            {
                await TriggerAutomaticFullRefundSagaAsync(groupCode);
                throw new InvalidOperationException("Phiên đặt phòng đã hết hạn 30 phút. Hệ thống tự động hoàn tiền 100% cho thành viên đã đóng.");
            }

            var updatedMembers = session.MembersStatus.Select(m =>
            {
                if (m.MemberIndex == memberIndex)
                {
                    return m with { IsPaid = true, PaidAt = DateTime.UtcNow };
                }
                return m;
            }).ToList();

            var paidCount = updatedMembers.Count(m => m.IsPaid);
            var newStatus = session.Status;

            if (paidCount == session.TotalMembers)
            {
                newStatus = "FULLY_PAID_CONFIRMED";
                // Trigger AutoBookingSagaService
                await TriggerAutoBookingSagaAsync(session);
            }

            var updatedSession = session with
            {
                PaidCount = paidCount,
                Status = newStatus,
                MembersStatus = updatedMembers
            };

            _sessions[groupCode] = updatedSession;
            return updatedSession;
        }

        public async Task<GroupBookingSessionResult> TriggerAutomaticFullRefundSagaAsync(string groupCode)
        {
            if (!_sessions.TryGetValue(groupCode, out var session))
                throw new KeyNotFoundException($"Không tìm thấy phiên {groupCode}");

            // Loop through all paid members and issue 100% refund via Napas 247 Payout API
            var refundedMembers = session.MembersStatus.Select(m =>
            {
                if (m.IsPaid && m.PayoutRefundStatus != "REFUNDED_100_PERCENT")
                {
                    // Simulated Instant Payout 247
                    return m with { PayoutRefundStatus = "REFUNDED_100_PERCENT" };
                }
                return m;
            }).ToList();

            var updatedSession = session with
            {
                Status = "EXPIRED_REFUNDED_ALL",
                MembersStatus = refundedMembers
            };

            _sessions[groupCode] = updatedSession;
            return await Task.FromResult(updatedSession);
        }

        private Task TriggerAutoBookingSagaAsync(GroupBookingSessionResult session)
        {
            // Lock room commitments and notify group
            Console.WriteLine($"[AutoBookingSagaService] Nhóm {session.GroupCode} đã đóng đủ 100% ({session.PaidCount}/{session.TotalMembers}). Đang khóa phòng B2B cứng và xuất PNR.");
            return Task.CompletedTask;
        }

        private static string GenerateDynamicVietQrString(string bankCode, string accountNo, decimal amount, string memo)
        {
            return $"00020101021238580010A000000727012600069704220112{accountNo}0208QRIBFTTA5303704540{amount}5802VN62140810{memo}6304";
        }
    }
}
