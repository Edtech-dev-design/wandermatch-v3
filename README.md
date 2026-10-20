# WANDERMATCH (BẢN ĐỒ MÙ) — PHIÊN BẢN 3.0
### Corporate VietQR, Conditional Refund, Hard-Commit SLA & AI Smart Arrival Concierge

---

## 🌟 TỔNG QUAN HỆ THỐNG
**WanderMatch 3.0** là nền tảng khởi nghiệp du lịch ẩn trình (Blind Travel Platform) thế hệ mới, giải quyết triệt để 3 bài toán lớn nhất của mô hình du lịch bí mật truyền thống:
1. **Minh bạch dòng tiền & Pháp nhân Doanh nghiệp:** Cổng thanh toán **Corporate VietQR** khóa cứng quỹ tạm giữ **Escrow**, chỉ giải ngân cho khách sạn đối tác khi khách check-in thành công.
2. **Cam kết phòng cứng không hủy (Hard-Commit SLA):** Đối tác khách sạn ký số mã PMS và đặt cọc quỹ bảo lãnh **20.000.000 VNĐ**. Nếu đối tác để xảy ra tình trạng overbooking, hệ thống tự động trừ 50% quỹ (10 triệu) để nâng hạng ngay khách sạn 5 sao cho khách.
3. **Bộ máy Hoàn tiền 3 Khung giờ & Bất khả kháng:** Tự động hoàn tiền trong 2 giây về tài khoản **Napas 247** đã được đối soát eKYC với CCCD, chống hành vi "cào thẻ xem điểm đến xong hủy vé".
4. **Trợ lý Điểm đến Thông minh Khi Khách Đến Nơi (AI Smart Arrival Concierge):** Tự động tạo **3 phương án lịch trình chi tiết theo khung giờ**, bộ sưu tập ẩm thực đặc sản / điểm vui chơi kèm **giá vé rõ ràng**, và hệ thống **Verified Traveler Reviews** cho phép đánh giá & tự động tính toán lại điểm sao theo thời gian thực.
5. **Đa ngôn ngữ Toàn diện (i18n):** Hỗ trợ chuyển đổi mượt mà giữa 4 ngôn ngữ: **Tiếng Việt 🇻🇳, English 🇬🇧, 한국어 🇰🇷, 日本語 🇯🇵**.

---

## 🏗️ CẤU TRÚC DỰ ÁN
```text
c:\Web du lịch HCM/
├── index.html               # Ứng dụng Web Single Page hoàn chỉnh (HTML5, Tailwind CSS, Dark Glassmorphism)
├── styles.css               # Hệ thống Token thiết kế, hiệu ứng kính mờ, thanh cào Canvas, Animations
├── app.js                   # State Machine, từ điển i18n 4 thứ tiếng, thuật toán tính hoàn tiền, xử lý Review & Canvas
├── server.js                # Backend API Server chuẩn Node.js (Mock VietQR, Napas 247, SLA Penalty)
├── package.json             # Cấu hình dự án Node.js
└── database/
    └── schema_v3.sql        # 12 bảng PostgreSQL/Supabase DDL chuẩn hóa, Index, Triggers & Seed Data
```

---

## 🗄️ CƠ SỞ DỮ LIỆU CHUẨN HÓA (12 BẢNG POSTGRESQL / SUPABASE)
Tệp `database/schema_v3.sql` bao gồm đầy đủ 12 bảng chuẩn quan hệ:
1. `users`: Lưu trữ thông tin khách hàng, số CCCD/Hộ chiếu, họ tên in hoa không dấu (`full_name_unaccented`), số dư ví.
2. `linked_bank_accounts`: Tài khoản ngân hàng Napas 247 dùng để nhận hoàn tiền, xác thực trạng thái `ACTIVE_VERIFIED`.
3. `b2b_partner_profiles`: Hồ sơ pháp nhân khách sạn/resort B2B, số tài khoản nhận payout và Quỹ bảo lãnh SLA 20.000.000đ.
4. `destinations`: Danh mục các thành phố điểm đến bí mật (Đà Lạt, Sa Pa, Ninh Bình...) kèm đa ngôn ngữ JSONB.
5. `b2b_inventories`: Kho phòng trống PMS kết nối thời gian thực, giá rack và giá net hợp đồng B2B.
6. `blind_trips`: Chuyến đi ẩn trình, mã đơn hàng (`WM99081234`), gói ngân sách, mã PNR, kết quả trắc nghiệm Persona và cờ thẻ cào.
7. `b2b_room_commitments`: Hợp đồng cam kết giữ phòng cứng ký số PMS (`HARD_COMMITTED`), quản lý phạt vi phạm overbooking.
8. `escrow_payment_ledgers`: Sổ cái toàn vẹn dòng tiền VietQR Doanh nghiệp (Inflow, Outflow, Escrow Status, Webhook).
9. `cancellation_refund_requests`: Hồ sơ hoàn tiền theo 3 khung giờ và phê duyệt Bất khả kháng (Cấp độ A & B).
10. `destination_pois`: Danh mục món ăn đặc sản, điểm vui chơi, khung giá vé / chi phí bình quân (`ticket_or_avg_cost_min/max`), hình ảnh sắc nét.
11. `ai_generated_itineraries`: 1–3 phương án lịch trình AI chi tiết theo khung giờ (`timeline_slots` JSONB) và cờ kích hoạt của khách.
12. `poi_reviews`: Đánh giá của khách đã đi (điểm sao 1-5, nhãn kết luận `verdict_badge`, chi phí thực tế, trigger tự động cập nhật trung bình sao).

---

## 🚀 HƯỚNG DẪN CHẠY VÀ TRẢI NGHIỆM

### Cách 1: Khởi chạy Máy chủ Node.js Full-Stack (Khuyên dùng)
Chạy lệnh sau tại thư mục gốc:
```bash
node server.js
```
Truy cập trình duyệt: **`http://localhost:3000`**

### Cách 2: Mở trực tiếp trên Trình duyệt
Bạn có thể mở trực tiếp file `index.html` bằng bất kỳ trình duyệt nào (Chrome, Edge, Safari, Firefox). Ứng dụng đã được đóng gói độc lập và hoạt động trơn tru 100%.

---

## 🧭 CÁC KỊCH BẢN THỬ NGHIỆM (TEST CASES)

1. **Thử nghiệm Đổi Ngôn ngữ Thời gian Thực:**
   - Bấm các cờ trên Header: `🇻🇳 VI`, `🇬🇧 EN`, `🇰🇷 KO`, `🇯🇵 JA`. Toàn bộ giao diện, nội dung 3 lịch trình AI, món ăn đặc sản, giá vé và điều khoản hủy tự động dịch tương ứng.
2. **Thử nghiệm Đánh Giá Địa Điểm (Verified Traveler Reviews):**
   - Vào thẻ "Lẩu Gà Lá É Tao Ngộ" hoặc "Máng Trượt Datanla", bấm nút **"💬 Xem tất cả & Viết Đánh Giá"**.
   - Modal mở ra: Chấm 5 sao, chọn nhãn `✅ Rất đáng tiền - Nên đi`, nhập chi phí thực tế `150000`, viết nhận xét và bấm **Gửi Đánh Giá Ngay**.
   - Hệ thống lập tức cập nhật điểm trung bình, số lượng review và hiển thị ngay đánh giá mới trên đầu danh sách!
3. **Thử nghiệm Thẻ Cào Canvas Mở Khóa Điểm Đến:**
   - Chuyển sang tab **"🎟️ Thẻ Cào & Phí Hủy"**.
   - Dùng chuột/ngón tay cào lớp phủ bạc trên thẻ. Khi cào đạt trên 45%, điểm đến Đà Lạt, Resort Ana Mandara và mã PNR sẽ bung mở cùng nút truy cập trực tiếp vào Smart Concierge.
4. **Thử nghiệm Bộ Máy Tính Phí Hủy 3 Khung Giờ:**
   - Bấm chuyển đổi giữa **Khung 1 (>72h)**, **Khung 2 (24h-72h)**, và **Khung 3 (<24h hoặc Đã cào thẻ)**.
   - Quan sát công thức trừ phí: Khung 1 hoàn 90%, Khung 2 hoàn 65% (trong đó trích 25% đền bù khách sạn + 10% phí sàn), Khung 3 hoàn 0 VNĐ.
   - Bấm **"⚡ Thực Thi Hoàn Tiền Ngay"** để xem giao dịch lập tức được ghi vào Sổ Cái Escrow.
5. **Thử nghiệm Cổng B2B & Phạt Vi Phạm SLA:**
   - Chuyển sang tab **"🏨 Đối Tác B2B & Sổ Cái"**.
   - Bấm nút **"⚠️ Giả Lập Đối Tác Báo Hết Phòng"**: Hệ thống tự động trừ 10.000.000đ từ quỹ bảo lãnh SLA của đối tác và ghi nhận lệnh nâng hạng khách sạn 5 sao cho khách hàng.
