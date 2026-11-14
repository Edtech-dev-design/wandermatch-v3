# BÁO CÁO TỔNG HỢP WANDERMATCH V4.2

**Ngày hoàn thành:** 2026-11-14  
**Nhánh làm việc:** `feat/v4-architecture` (`Edtech-dev-design/wandermatch-v3`)  
**Điểm sao lưu (Backup Point):** `backup/pre-v4-2-recovery` (`480b114aee183e4dad37a5028817791266f663cf`)  
**Mục tiêu:** Khôi phục, tái cấu trúc kiến trúc mô-đun, cô lập môi trường nghiêm ngặt, kiểm thử E2E thực tế trên Staging và giữ nguyên hoàn toàn Production.

---

## 1. TỔNG QUAN TRẠNG THÁI 4 NỀN TẢNG (STAGING VS PRODUCTION)

| Nền tảng | Môi trường Staging (Đích triển khai V4.2) | Trạng thái Staging | Môi trường Production (Bất khả xâm phạm) |
|---|---|---|---|
| **GitHub** | Nhánh `feat/v4-architecture` (CI Run `43574887677` @ `ab86e91`, CI Run `43574663629` @ `104f38d`) | Đã push & CI **PASS** | Nhánh `main` @ `673b7bc682db0c91ff8f75c1af6a8ded774c6124` (Không đụng chạm — `VERIFIED_PRODUCTION_READ_ONLY`) |
| **Supabase (PostgreSQL)** | `wandermatch-v4-staging` (`hpwtdlffidfircparanl`) | Đã áp dụng **7 / 7 migrations** (`20261025000001` .. `20261114000005`) | `wandermatch-v3` (`iwuehabwpihnpahuhqki`) (Không kết nối, không chạy migration) |
| **Cloudflare Workers** | `wandermatch-api-staging` (`https://wandermatch-api-staging.vannong20182018.workers.dev`) | Đang chạy entrypoint `src/index.js`, Version ID **`e284cf25-163c-43dc-9528-77d44878c509`** | Worker `wandermatch-api` không tồn tại trên tài khoản Cloudflare hiện tại (`code: 10007`, không deploy) |
| **Vercel Frontend** | Preview URL `https://wandermatch-v3-git-feat-v4-architecture-hoinguoitroi.vercel.app` (`outputDirectory: "frontend"`) | `BLOCKED_BY_VERCEL_SSO` khi kiểm tra tự động chưa đăng nhập (Cần đăng nhập Vercel Team để UAT giao diện) | Vercel Production tắt auto-deploy từ `main` (`vercel.json`) |

---

## 2. CÁC VẤN ĐỀ NGHIÊM TRỌNG ĐÃ KHẮC PHỤC TỪ V4.0/V4.1 LÊN V4.2

1. **Hợp nhất Entrypoint & Kiến trúc Backend (`src/index.js`):**
   - Trước V4.2: `wrangler.toml` và `worker/wrangler.toml` có nguy cơ trỏ rời rạc; V4.2 đã thống nhất `main = "src/index.js"` (và `../src/index.js`), đi qua pipeline chuẩn: `enforceEnvironmentIsolation` -> `resolveCorsHeaders` -> `checkRateLimit` -> `withStorageLock` -> `dispatchV4Route` (`src/router/apiRouter.js`, giữ đủ 11 route `V41_ROUTE_REGISTRY` và mở rộng 25 route `V42_ROUTE_REGISTRY`) -> tương thích ngược `worker.js`.
   - Tách rõ các controller miền: `auth`, `users`, `discovery`, `ai`, `blind-booking`, `booking`, `payment`, `reviews`, `notifications`, `admin`.

2. **Chốt chặn Cô lập Môi trường Fail-Closed (`Environment Isolation Guard`):**
   - `src/middleware/envIsolationGuard.js`: Bắt buộc khai báo tường minh `ENVIRONMENT` (`development` | `staging` | `production`), chặn ngay trước khi chạm DB (`503 ENV_ISOLATION_VIOLATION`) nếu thiếu biến môi trường, nếu Staging kết nối nhầm ref Production (`iwuehabwpihnpahuhqki`), hoặc nếu phát hiện JWT key của Production bên trong Staging (`PRODUCTION_KEY_IN_STAGING_BLOCKED`).
   - `frontend/config/environments.js`: Phân tách 3 tầng (`development` / `staging` / `production`), cấm `service_role` key trong trình duyệt (`FRONTEND_SERVICE_ROLE_KEY_FORBIDDEN`), không fallback âm thầm sang Production.

3. **Sửa lỗi Đồng bộ User Auth -> Profile & Quỹ phòng/vé theo Ngày Tương lai (`Migration 20261114000005`):**
   - Tạo trigger `trg_on_auth_user_created_v4` (`handle_new_auth_user_v4`) trên `auth.users` tự động tạo `public.profiles`, `public.user_roles` và `public.user_preferences`, kèm backfill user cũ để triệt tiêu lỗi khóa ngoại `23503` (`recommendation_sessions_user_id_fkey`).
   - Tạo RPC `ensure_user_profile_v4` và `ensure_inventory_for_date_v4` giúp cấp phát tồn kho động cho mọi ngày khởi hành trong tương lai (đã kiểm chứng thực tế với `2026-12-20` và `2026-12-22`).
   - Bổ sung 3 RPC bảo mật cho đánh giá và thông báo (`submit_review_v4`, `get_my_notifications_v4`, `mark_notification_read_v4`) và thu hồi quyền `EXECUTE` hàm `is_admin` / `is_super_admin` khỏi `PUBLIC` và `anon`.

4. **Sửa lỗi Ánh xạ HTTP Status cho PostgREST `P0001` (`src/services/supabase/postgresRpcClient.js`):**
   - Khi kiểm thử trực tiếp trên Staging (`LIVE-06`), PostgREST trả HTTP `400` cho các lỗi nghiệp vụ `ERRCODE = 'P0001'`. Đã sửa `invokePostgresRpc` để ánh xạ chuẩn sang HTTP `402` (`PAYMENT_REQUIRED:`, `PAYMENT_RECONCILIATION_FAILED:`), HTTP `409` (`HOLD_CONFLICT:`, `INSUFFICIENT_INVENTORY:`, `CONFLICT:`, `RECONCILIATION_LOCKED:`) và HTTP `410` (`GONE:`). Đã redeploy Worker Staging lên `e284cf25-163c-43dc-9528-77d44878c509` và xác minh `LIVE-06` trả `402`.

5. **Tích hợp Thật 10 Mô-đun Frontend (`frontend/core/bootstrapV4.js`):**
   - Tải `<script type="module" src="core/bootstrapV4.js"></script>` trong `frontend/index.html`, khởi tạo đầy đủ 10 mô-đun (`auth`, `profile`, `discovery`, `ai`, `blindBooking`, `booking`, `payment`, `reviews`, `notifications`, `admin`) lên `window.WM_V4`.
   - Vá lỗ hổng thiếu header xác thực ở `submitSlaRefundTicket` trong `frontend/app.js` bằng `window.getAuthHeaders()`.

---

## 3. TỔNG HỢP KẾT QUẢ KIỂM THỬ (PHÂN LOẠI TRUNG THỰC)

### A. Kiểm thử Cục bộ (`VERIFIED_LOCAL`) — **100% ĐẠT**
- `npm run build`: **PASS** (kiểm tra cú pháp toàn bộ JS backend + frontend).
- `npm run verify:env`: **PASS** (`wrangler.toml`, `worker/wrangler.toml`, `supabase/config.toml` trỏ đúng Staging, không rò Production ref).
- `npm test`: **36 / 36 tests PASS** (0 fail, 0 skipped, 0 cancelled — gồm V4.0 `T-01`..`T-20`, V4.1 Isolation, V4.2 `V4.2-01`..`V4.2-05`).

### B. Kiểm thử Sống trên Staging Cloud (`VERIFIED_STAGING`) — **13 / 13 KỊCH BẢN PASS**
Chạy trực tiếp vào `https://wandermatch-api-staging.vannong20182018.workers.dev` và PostgreSQL `hpwtdlffidfircparanl`:
- `LIVE-01`: `/api/v4/health` xác nhận `environment: "staging"`, `projectRef: "hpwtdlffidfircparanl"`, `rpcMode: "POSTGRES_REST_RPC"`.
- `LIVE-02`: Xác thực JWT GoTrue & tự động đồng bộ profile từ PostgreSQL (`profileSource: "supabase_postgres"`).
- `LIVE-03`: Gợi ý AI cho ngày tương lai `2026-12-20` tạo `3` gói mù, **0 rò rỉ** trường bí mật `secret_*`.
- `LIVE-04`: Kiểm tra trực tiếp PostgREST `/rest/v1/`:
  - `user_sensitive_pii`: `401` (`anon`) / `403` (`authenticated`).
  - `outbox_events` & `packages`: `401` (`anon`) / `200 []` (0 dòng do RLS chặn non-admin).
  - `rpc/is_admin` & `rpc/is_super_admin`: `401` (`anon`).
- `LIVE-05`: Tạo giữ chỗ atomic booking `WM20260017` (`PENDING_PAYMENT`, `12,000,000 VND`, `is_revealed: false`).
- `LIVE-06`: Gọi reveal trước khi thanh toán bị chặn với HTTP **`402`**.
- `LIVE-07`: Webhook giả mạo chữ ký HMAC bị chặn với HTTP **`401`**.
- `LIVE-08`: Webhook HMAC hợp lệ chuyển trạng thái `PAID`; phát lại trùng lặp trả `200` (`idempotent_replay: true`), không cộng trùng tiền.
- `LIVE-09`: User B truy cập status/reveal booking của User A bị chặn với HTTP **`403`**.
- `LIVE-10`: Reveal hợp lệ sau thanh toán trả về điểm đến bí mật `"Nha Trang"`.
- `LIVE-11`: Gửi review sau reveal (`APPROVED`), đọc notifications (`200`), đọc danh mục điểm đến (`9` điểm).
- `LIVE-12`: Đua lệnh đồng thời (`Promise.all`) tạo đúng **1** booking `WM20260018`, User B tranh chấp bị chặn **`403`**.
- `LIVE-13`: Non-admin gọi endpoint admin bị chặn **`403`**; Admin duyệt hoàn tiền (`payout_status: "SUCCEEDED"`); đối soát tài chính toàn hệ thống **`total_discrepancies: 0`**.

### C. Hạng mục Bị chặn / Ghi chú Vận hành (`BLOCKED` & Lưu ý)
1. **Vercel Preview (`BLOCKED_BY_VERCEL_SSO`):** URL `https://wandermatch-v3-git-feat-v4-architecture-hoinguoitroi.vercel.app` đang bật **Vercel Standard Deployment Protection (SSO)** nên truy cập tự động chưa đăng nhập bị chuyển hướng về `https://vercel.com/login?...`. Cần mở trực tiếp bằng tài khoản trình duyệt thuộc Vercel Team để kiểm tra giao diện UAT.
2. **Hạn mức Email Supabase GoTrue (`429`):** Khi tạo nhiều tài khoản test liên tiếp qua `/api/v4/auth/register`, Supabase GoTrue free-tier giới hạn gửi email (`429 email rate limit exceeded`). Đã kiểm chứng luồng tạo user & OTP thành công; khuyến nghị cấu hình Custom SMTP trước khi kiểm thử tải đăng ký mới.
3. **Vệ sinh Bí mật:** File tạm chứa webhook secret phục vụ E2E (`.staging_webhook_secret`) đã được xóa sạch và kiểm tra `Test-Path` = `False`.

### D. Xác nhận Production Không Bị Tác Động (`VERIFIED_PRODUCTION_READ_ONLY`)
- `git rev-parse main` = `git ls-remote origin refs/heads/main` = `673b7bc682db0c91ff8f75c1af6a8ded774c6124`.
- `supabase/.temp/project-ref` = `hpwtdlffidfircparanl`.
- Job GitHub Actions Production (`main`) luôn ở trạng thái `skipped` trên nhánh `feat/v4-architecture`.

---

## 4. HỆ THỐNG BÁO CÁO CHI TIẾT V4.2 ĐÃ XUẤT BẢN

1. **Báo cáo Kiến trúc:** `WANDERMATCH_V4_2_ARCHITECTURE_REPORT.md`
2. **Báo cáo Kiểm toán Bảo mật:** `WANDERMATCH_V4_2_SECURITY_AUDIT.md`
3. **Báo cáo Triển khai Staging:** `WANDERMATCH_V4_2_STAGING_DEPLOYMENT_REPORT.md`
4. **Báo cáo Kết quả Kiểm thử:** `WANDERMATCH_V4_2_TEST_RESULTS.md`
5. **Kế hoạch Rollback khẩn cấp:** `WANDERMATCH_V4_2_ROLLBACK_PLAN.md`
6. **Nhật ký Thay đổi chi tiết:** `WANDERMATCH_V4_2_CHANGELOG.md`
