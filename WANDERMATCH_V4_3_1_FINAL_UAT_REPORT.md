# BÁO CÁO TỔNG HỢP DUY NHẤT — WANDERMATCH V4.3.1 FINAL UAT & STAGING VERIFICATION

- **Ngày hoàn tất kiểm thử:** 2026-11-14 (`17:20 +07:00`)
- **Môi trường mục tiêu:** Staging Only (`feat/v4-architecture` + Supabase Staging `hpwtdlffidfircparanl` + Cloudflare Worker `wandermatch-api-staging` + Vercel Preview)
- **Kết luận phát hành (Verdict):** **`FULL_STAGING_UAT_PASS`** *(đã thực thi trực tiếp toàn bộ 15 hạng mục Browser UAT trên Vercel Preview qua Desktop/Tablet/Mobile, sửa 5 lỗi tích hợp phát hiện thực tế và tái kiểm định PASS; Production hoàn toàn bất biến)*

---

## 1. TÓM TẮT ĐIỀU HÀNH & KHÓA BẢO VỆ PRODUCTION

Nhiệm vụ V4.3.1 hoàn thiện kiểm thử hệ thống đầu-cuối (bao gồm **Frontend Browser UAT trực tiếp trên Vercel Preview** sau khi phiên đăng nhập SSO hợp lệ được thiết lập), đối chiếu phiên bản Cloudflare Worker Staging đang phục vụ thực tế, rà soát ngữ nghĩa `E2E-24`, và mở rộng đo hiệu năng Live Staging lên **`N = 50` samples/endpoint** (`200` requests thực tế, tỷ lệ lỗi `0%`).

| Thành phần Production (Bất biến) | Trạng thái xác minh | Bằng chứng / Định danh |
| :--- | :--- | :--- |
| **Git Branch `main`** | **LOCKED / UNTOUCHED** | Commit giữ nguyên `673b7bc682db0c91ff8f75c1af6a8ded774c6124` |
| **Backup Point V4.2** | **PRESERVED** | `backup/pre-v4-2-recovery` -> `480b114aee183e4dad37a5028817791266f663cf` |
| **Supabase Production** | **LOCKED / UNTOUCHED** | Ref `iwuehabwpihnpahuhqki` — không có trong cấu hình Wrangler Staging (`npm run verify:env` exit `0`) |
| **Cloudflare Worker Production** | **UNTOUCHED** | Chỉ chạy `npm run deploy:staging` (`wandermatch-api-staging`) |
| **Vercel Production** | **UNTOUCHED** | [vercel.json](file:///c:/Web du lịch HCM/vercel.json) khóa `git.deploymentEnabled.main = false` |

---

## 2. XÁC MINH TRẠNG THÁI SAU V4.3 & ĐỐI CHIẾU WORKER / CI/CD / VERCEL

### 2.1 Chuỗi Commit trên nhánh `feat/v4-architecture`
- `df9349b` (`df9349b8ee8cdd51ca0044ed1acaaf189a5e1ffc`): code V4.3 + hardening & 24 kịch bản E2E.
- `96dac28` (`96dac28fc074ca5193b80c9dee345d38f800c0e9`): hợp nhất 10 báo cáo V4.3 thành 1 báo cáo master.
- `bde8721` (`bde872165765ea6d7976cb31a46881490247afe1`): vá schema `vercel.json`, thêm `normalizeItineraryDays` chống lỗi `d.d.split`, và proxy `/api/*` từ Vercel Preview tới Staging Worker.
- `3aa449b` (`3aa449bf14f7f9c3c0abcd49676d6e4f473330c4`): vá CORS preflight cho phép `PUT, PATCH, DELETE` trên Worker Staging và map chuẩn `package_id` / `booking_code` V4 qua toàn bộ luồng chọn ứng viên & giữ chỗ.

### 2.2 Đối chiếu Cloudflare Worker Staging thực tế
Truy vấn trực tiếp bằng `npx wrangler deployments list --env staging` và `GET https://wandermatch-api-staging.vannong20182018.workers.dev/api/v4/health`:

1. **Trước khi vá CORS trong V4.3.1** (sau chuỗi deploy V4.3):
   - Version ghi nhận trong báo cáo V4.3 cũ (`e284cf25-163c-43dc-9528-77d44878c509`, `08:06:48Z`) đã được kế nhiệm bởi bản upload code từ `df9349b` (`d6a36b9e-1738-4a64-8648-45f57013435b`, `08:58:33Z`) và bản cập nhật secrets lúc `2026-11-14T08:58:54.712Z` là **`b2724c13-08a1-4ac4-8ae5-78510a7fdced`**.
2. **Sau khi vá `Access-Control-Allow-Methods` và deploy Staging (`npm run deploy:staging`)**:
   - **Active Version ID (100% traffic):** **`04c7f317-d101-4ee2-ab19-f0ab8bf8aa42`**
   - **Created Timestamp:** `2026-11-14T10:13:08.204Z` (`Author: vannong20182018@gmail.com`)
   - **Entrypoint:** `src/index.js` (`Total Upload: 353.49 KiB / gzip: 77.22 KiB`)
   - **Environment:** `staging` | **Supabase Project Ref:** `hpwtdlffidfircparanl`
   - **Live `/api/v4/health`:** `status = "HEALTHY"`, `rpcMode = "POSTGRES_REST_RPC"`, `restConnected = true`, `status = "CONNECTED"`, `jwtVerificationMode = "INDEPENDENT_HMAC_AND_GOTRUE_REST"`, `flights_count = 34`, `hotels_count = 6`.
   - **Live CORS Preflight (`OPTIONS /api/v4/users/profile` từ Vercel Preview Origin):** HTTP `204`, `Access-Control-Allow-Origin: https://wandermatch-v3-git-feat-v4-architecture-hoinguoitroi.vercel.app`, `Access-Control-Allow-Methods: GET, POST, PUT, PATCH, DELETE, OPTIONS`.

### 2.3 Đối chiếu GitHub Actions & Vercel Deployment
| Pipeline / Deployment | Commit SHA | Kết quả thực tế | Ghi chú kỹ thuật |
| :--- | :--- | :--- | :--- |
| **CI Run `43579409588`** | `96dac28` | **SUCCESS** | Job 1 PASS; Job 2B (`132400788332`) PASS: bước deploy Worker chạy nhánh fallback `SKIPPED_NO_GITHUB_SECRET` do `CLOUDFLARE_API_TOKEN` chưa cấu hình trong GitHub Secrets (`Sync Optional Worker Staging Secrets: skipped`), bước Verify Live Worker Health PASS. |
| **CI Run `43582292401`** | `bde8721` | **SUCCESS** | Job 1 (`132409391417`) PASS; Job 2B (`132409472290`) PASS (Live Worker health verified). |
| **CI Run `43584281483`** | `3aa449b` | **SUCCESS** | Job 1 (`132415331820`) PASS; Job 2B (`132415401959`) PASS; Job `2A`/`3` skipped đúng quy tắc nhánh. |
| **Vercel Preview (trước V4.3.1)** | `4eac22b`..`96dac28` | **FAILURE (1s)** | Bị schema `https://openapi.vercel.sh/vercel.json` từ chối vì thuộc tính không hợp lệ `"public": true`, khiến Preview alias bị kẹt ở bản V3 `05a2e2b` (`app.js?v=14.0`). |
| **Vercel Preview `bde8721`** | `bde8721` | **SUCCESS** | Build & Deploy hoàn tất, phục vụ frontend V4.3 (`window.WM_V4`). |
| **Vercel Preview `3aa449b`** | `3aa449b` | **SUCCESS** | Build & Deploy hoàn tất (`Deployment has completed`), tái kiểm định UAT PASS toàn phần. |

---

## 3. KẾT QUẢ VERCEL BROWSER UAT (15 HẠNG MỤC + RESPONSIVE VIEWPORTS)

URL kiểm thử trực tiếp trên trình duyệt: `https://wandermatch-v3-git-feat-v4-architecture-hoinguoitroi.vercel.app` (`blocked_origins: none`, đã xác thực phiên Vercel Team SSO hợp lệ của người dùng).
Tài khoản Staging test sử dụng trên trình duyệt: `uat_browser_v431_1794650056527@wandermatch.vn`.

### 3.1 Kết quả chi tiết 0–15 trên Live DOM
| Hạng mục | Thao tác thực tế trên trình duyệt | Endpoint & Phản hồi quan sát | Trạng thái |
| :--- | :--- | :--- | :--- |
| **0. Bootstrap V4 & Assets** | Hard reload `/?v=4.3.1` & `/?v=4.3.1-r2`, kiểm tra `window.WM_V4` và console | Toàn bộ 10 module scripts (`auth`..`admin`), `bootstrapV4.js`, `environments.js` HTTP `200`; `0` JS startup errors | **PASS** |
| **1. Landing Page** | Kiểm tra hero, thanh điều hướng, CTA, badge escrow | Render sắc nét, không vỡ layout | **PASS** |
| **2. Đăng ký (`Register`)** | Mở Auth modal -> tab Đăng ký -> nhập họ tên, email, mật khẩu -> submit | `POST /api/v4/auth/register` thành công, hiển thị banner xác nhận & chuyển form Đăng nhập | **PASS** |
| **3. Đăng nhập (`Login`)** | Đăng nhập bằng `uat_browser_v431_1794650056527@wandermatch.vn`, reload trang | `POST /api/v4/auth/login` -> `200 OK`; badge `#authLoggedInBox` duy trì phiên sau reload | **PASS** |
| **4. Khôi phục mật khẩu** | Bấm `#btnAuthForgotLink`, gửi email khôi phục, kiểm tra UI OTP `#authFieldGroup_Otp` | `POST /api/v4/auth/forgot-password` -> `200 OK`; form đặt lại mật khẩu hiển thị đúng và chuyển lại login sạch | **PASS** |
| **5. Hồ sơ cá nhân (`Profile`)** | *(Vòng 1 phát hiện lỗi CORS `PUT`)* -> Sau bản vá `3aa449b` & Worker `04c7f317`: đổi tên thành `"UAT Tester V431 Verified"` & SĐT `"0901234567"`, bấm lưu, reload kiểm tra persistence | `OPTIONS` -> `204`, `PUT /api/v4/users/profile` -> **`200 OK`**, `0` CORS error, dữ liệu giữ nguyên sau hard reload | **PASS** *(sau tái kiểm định)* |
| **6. Discovery (`Quỹ Phòng B2B`)** | Mở `#btn-tab-b2b`, thử bộ lọc khí hậu `"Cao Nguyên Sương Mù"` và ô tìm kiếm từ khóa | Lọc chính xác 3/6 resort vùng cao; tên khách sạn giữ trạng thái niêm phong SLA | **PASS** |
| **7. AI Recommendation** | Nhập ngày `2026-11-28`, ngân sách `5.500.000đ`, `2` khách -> submit | `POST /api/v4/recommendations` -> `200 OK`; Radar 5D, Top-3 ứng viên và tab Ngày 1/2/3 render không lỗi `split` | **PASS** |
| **8. Blind Booking** | Bấm chọn **Ứng viên #2** (`selectBlindTravelCandidate(1)`) -> kiểm tra store & UI | `wm_draft_prod.v4PackageId` map đúng UUID `da0326b3-01d2-4353-9c91-61bc64d776bf`; tên resort & sân bay vẫn niêm phong | **PASS** *(sau tái kiểm định)* |
| **9. Booking** | Nhập CCCD & số tài khoản -> tạo đơn giữ chỗ | `POST /api/v4/bookings` -> **`200 OK`**, sinh mã chuẩn V4 **`WM20260035`** (`booking_id: 71ecff69-63ff-4e78-95a2-5b96791d227b`, `PENDING_PAYMENT`, `10.000.000đ`), QR memo `WM20260035 KH1`/`KH2` & timer `14:59` | **PASS** *(sau tái kiểm định)* |
| **10. Payment (`Kiểm tra thanh toán`)** | Bấm `#btnVerifyPayment` kiểm tra giao dịch VietQR | `GET /api/v4/bookings/status?bookingCode=WM20260035` -> **`200 OK`** (`PENDING_PAYMENT`); `0` request `404` fallback; UI báo trung thực chưa nhận tiền ngân hàng | **PASS** *(sau tái kiểm định)* |
| **11. Reveal Destination (`Cổng mở khóa`)** | Bấm `#btnRevealDestination` khi đơn `WM20260035` chưa thanh toán | `POST /api/v4/bookings/reveal` -> **`402 Payment Required`** (`0` legacy fallback); điểm đến giữ nguyên niêm phong 100% | **PASS** *(sau tái kiểm định; luồng sau thanh toán xác minh qua `V4.2-03` & `E2E-14..16`)* |
| **12. Reviews** | Tải feed đánh giá công khai & thử gửi review cho đơn chưa mở khóa | `GET /api/v4/reviews` -> `200 OK`; `POST /api/v4/reviews` cho đơn chưa mở khóa bị từ chối đúng quy tắc | **PASS** *(sau mở khóa xác minh qua `E2E-17`)* |
| **13. Notifications** | Bấm `#navNotificationsBtn` mở hộp thư thông báo | `GET /api/v4/notifications?limit=20` -> `200 OK`, modal mở mượt | **PASS** |
| **14. User Dashboard (`Hành Trình Của Tôi`)** | Bấm `#btn-tab-saved` xem hộ chiếu du lịch cá nhân | Đơn `#WM20260035` hiển thị trạng thái `CHỜ QUÉT VIETQR`, `10.000.000đ`, `UAT Tester V431 Verified`, niêm phong điểm đến | **PASS** *(sau tái kiểm định)* |
| **15. Admin Dashboard & RBAC** | Kiểm tra ẩn nút Admin `#navAdminBtn` với user thường & kiểm tra từ chối đối soát không có quyền | Nút Admin ẩn với user thường; gọi đối soát trả về **`403 Forbidden`** (`RBAC_FORBIDDEN`) | **PASS** *(thao tác Admin hợp lệ xác minh qua `E2E-20` & `npm test`)* |

> **Minh bạch kỹ thuật đối với luồng Payment -> Post-Reveal Review & Admin Approve trên Live Browser:** Trong kiến trúc bảo mật V4, trình duyệt người dùng không được phép tự xác nhận thanh toán nếu không có bank webhook ký HMAC (`PAYMENT_WEBHOOK_SECRET`), và user thường không có quyền Admin (`403`). Do đó, trình duyệt Staging trực tiếp xác minh tạo đơn thật `WM20260035`, đối soát trạng thái chưa thanh toán (`200`), cổng chặn mở khóa sớm (`402`), cổng chặn review đơn chưa mở khóa, và cổng chặn RBAC (`403`); trong khi các bước nhận webhook bank hợp lệ (`PAID`) -> `REVEALED` -> `POST /api/v4/reviews` -> `POST /api/v4/refunds/approve` đã được xác minh đầy đủ qua test tích hợp `npm test` (`V4.2-03`, `V4.3-02`, `T-04`, `T-07`) và `npm run test:e2e` (`E2E-14`..`E2E-17`, `E2E-20`).

### 3.2 Kiểm tra Responsive Viewports & Overflow
| Viewport | Kích thước khung (`innerWidth x innerHeight`) | Chiều rộng nội dung (`Body / ScrollWidth`) | Tràn ngang (`Overflow`) | Quan sát thực tế & Ghi chú giao diện |
| :--- | :--- | :--- | :--- | :--- |
| **Desktop** | `1440 x 900` | `1432px <= 1440px` | **Không (`0px`)** | Grid 3 cột B2B & thanh điều hướng 1 hàng hiển thị cân đối. |
| **Tablet** | `768 x 1024` | `760px <= 768px` | **Không (`0px`)** | Grid tự co giãn hợp lý; ghi nhận 1 điểm thẩm mỹ nhỏ không chặn vận hành: ở độ rộng `768px`, badge `★ 4.95` trên góc card B2B chạm nhẹ mép pill `SLA-DL-88219`. |
| **Mobile** | `375 x 812` | `367.2px <= 375px` | **Không (`0px`)** | Navbar tự xếp 2 tầng, KPI xếp grid 2x2 và card xếp 1 cột gọn gàng, không trượt ngang. |

Bằng chứng ảnh chụp màn hình đã lưu tại thư mục artifact:
- `C:\Users\admin\.gemini\antigravity\brain\bbb99220-6baa-4453-866c-e6d07fd1915b\browser_evidence\step_246_shot_1_uat_desktop_1440x900.png`
- `C:\Users\admin\.gemini\antigravity\brain\bbb99220-6baa-4453-866c-e6d07fd1915b\browser_evidence\step_246_shot_2_uat_tablet_768x1024.png`
- `C:\Users\admin\.gemini\antigravity\brain\bbb99220-6baa-4453-866c-e6d07fd1915b\browser_evidence\step_246_shot_3_uat_mobile_375x812.png`
- `C:\Users\admin\.gemini\antigravity\brain\bbb99220-6baa-4453-866c-e6d07fd1915b\browser_evidence\final_step_289.png` (và `step_289_shot_1_step_final_reverification_v431_r2.png`)

---

## 4. RÀ SOÁT 24 KỊCH BẢN E2E & PHÂN TÍCH NGỮ NGHĨA `E2E-24`

### 4.1 Kết quả chạy sau lần chỉnh sửa cuối cùng
- **`npm run build`:** Exit `0` (kiểm tra cú pháp 27 tệp JS frontend + backend).
- **`npm run verify:env`:** Exit `0` (`Environment configuration verified: Staging targets strictly isolated from Production.`).
- **`npm test`:** **`40/40 passed`**, `0 fail`, `0 skipped` (`4124.60ms`) — bao gồm V4.0 (`T-01`..`T-20`), V4.1 (`V4.1-01`..`04`), V4.2 (`V4.2-01`..`05`), V4.3 (`V4.3-01`..`03`), và các test hợp đồng cốt lõi.
- **`npm run test:e2e` ([v4-3-e2e-24-scenarios.mjs](file:///c:/Web du lịch HCM/tests/v4-3-e2e-24-scenarios.mjs)):** **`24/24 PASS_LOCAL`**, `failed = 0`, `blocked = 0`, `p50 = 2.95ms`, `p95 = 48.67ms`:
  - `E2E-09`..`E2E-16`: Booking hold, owner status/list, cross-tenant `403`, early reveal block `402`, invalid webhook HMAC `401`, valid HMAC webhook -> `PAID` (`200`), webhook replay idempotency (không cộng tiền kép), và authorized reveal sau thanh toán đều `PASS_LOCAL`.
  - `E2E-17`..`E2E-20`: Submit verified review + public feed, notifications fetch/mark-read, non-admin `403` block, admin reconciliation & refund approve (`200 OK`) đều `PASS_LOCAL`.
  - `E2E-21`: Concurrent booking lock serialization chống double allocation `PASS_LOCAL`.
  - `E2E-23`: Invalid/expired JWT trả về `401` và xóa session phía client `PASS_LOCAL`.
  - `E2E-24`: Timeout & HTTP `500` normalization `PASS_LOCAL`.

### 4.2 Phân tích chuyên sâu câu hỏi kiến trúc về `E2E-24`
Kiểm tra trực tiếp [apiClient.js](file:///c:/Web du lịch HCM/frontend/services/apiClient.js#L13-L85) và [v4-3-e2e-24-scenarios.mjs](file:///c:/Web du lịch HCM/tests/v4-3-e2e-24-scenarios.mjs#L699-L739):

1. **Timeout phát sinh ở Client hay Backend?**
   - `E2E-24` kiểm tra **cả hai trường hợp riêng biệt**:
     - Nhánh `24A` là **Client-side timeout**: [apiClient.js](file:///c:/Web du lịch HCM/frontend/services/apiClient.js#L13-L85) sử dụng `AbortController` ở tầng trình duyệt (mặc định `12,000ms`, test đặt `timeoutMs: 25ms` đối với endpoint bị treo `hangMs`) để ngắt kết nối khi upstream phản hồi quá chậm.
     - Nhánh `24B` mô phỏng **Backend upstream crash** trả về `HTTP 500` trên route giả lập `/api/v4/crash`.
2. **HTTP `500` là kết quả mong đợi hay lỗi?**
   - Trong `E2E-24B`, đích `/api/v4/crash` cố tình ném lỗi nội bộ `500`, nên việc `apiClient` nhận và chuẩn hóa `status = 500`, `code = "API_ERROR"` (kèm `requestId` thay vì làm văng unhandled exception ở UI) là **hành vi mong đợi của bài test resilience**. Trên backend thật ([apiRouter.js](file:///c:/Web du lịch HCM/src/router/apiRouter.js#L74-L90)), các lỗi nghiệp vụ/xác thực đã được ánh xạ rõ về `400`, `401`, `402`, `403`, `404`, `409`, `422`; chỉ sự cố hệ thống ngoài dự kiến mới trả `500`.
3. **Có cần ánh xạ thành `408` hoặc `504` không?**
   - **Không cần sửa lại status code** vì [apiClient.js](file:///c:/Web du lịch HCM/frontend/services/apiClient.js) **đã ánh xạ sẵn `AbortError` thành `status = 504` (`code = "REQUEST_TIMEOUT"`)** ở tầng client (gateway timeout semantics), trong khi lỗi backend thật giữ nguyên `status = 500` (`API_ERROR`) để không che giấu lỗi hệ thống thực tế dưới mã timeout.
4. **Có nguy cơ retry gây thực hiện giao dịch trùng lặp không?**
   - **Không có nguy cơ auto-retry mù ở client:** [apiClient.js](file:///c:/Web du lịch HCM/frontend/services/apiClient.js) chỉ thực hiện **đúng 1 lần `fetch` duy nhất** mỗi lệnh gọi, hoàn toàn không có vòng lặp retry tự động khi gặp `504` hoặc `500`.
   - **Lớp bảo vệ thứ hai ở DB/RPC:** Ngay cả khi người dùng bấm gửi lại thủ công sau timeout trên các thao tác giao dịch trọng yếu, RPC `create_booking_with_hold_v4` ([20261105000003_v4_atomic_rpcs.sql](file:///c:/Web du lịch HCM/supabase/migrations/20261105000003_v4_atomic_rpcs.sql#L145-L163)) khóa theo `(package_id, user_id)` / `booking_code` để replay idempotent (`idempotent_replay: true`), và webhook thanh toán (`process_payment_webhook_v4`, xác minh bởi `E2E-15` & `T-04`) chống trùng lặp bằng `UNIQUE(payment_provider, external_transaction_id)`.

---

## 5. ĐO HIỆU NĂNG LIVE STAGING (`N = 50` SAMPLES / ENDPOINT)

Dữ liệu đo thực tế từ `C:\Users\admin\.gemini\antigravity\brain\bbb99220-6baa-4453-866c-e6d07fd1915b\scratch\v4_3_1_perf_50_samples.json` (thực thi lúc `2026-11-14T09:50:12.691Z`, `timeout = 12,000ms`, tổng cộng `200` requests trực tiếp tới `https://wandermatch-api-staging.vannong20182018.workers.dev`):

| Endpoint Live Staging | `N` | `min` (ms) | `p50` (ms) | `p95` (ms) | `p99` (ms) | `max` (ms) | `avg` (ms) | `errorRate` | `timeoutRate` | HTTP Status |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :--- |
| `GET /api/v4/health` | `50` | `107.77` | `132.41` | `201.67` | `632.60` | `632.60` | `156.46` | **`0%`** | **`0%`** | `200` (`50/50`) |
| `GET /api/v4/discovery/catalog` | `50` | `106.01` | `125.19` | `166.31` | `424.48` | `424.48` | `135.11` | **`0%`** | **`0%`** | `200` (`50/50`) |
| `GET /api/v4/reviews?limit=10` | `50` | `116.63` | `142.86` | `173.54` | `734.21` | `734.21` | `161.53` | **`0%`** | **`0%`** | `200` (`50/50`) |
| `POST /api/v4/recommendations` *(Auth JWT)* | `50` | `176.04` | `201.54` | `517.71` | `739.48` | `739.48` | `240.63` | **`0%`** | **`0%`** | `200` (`50/50`) |

---

## 6. CÁC LỖI THỰC TẾ ĐÃ PHÁT HIỆN & KHẮC PHỤC TRONG V4.3.1

| STT | Mức độ | Lỗi phát hiện từ kiểm thử thực tế | Nguyên nhân gốc | Cách khắc phục & Xác minh lại |
| :---: | :---: | :--- | :--- | :--- |
| **1** | **CRITICAL** | Vercel Preview bị kẹt ở bản V3 `05a2e2b` (`app.js?v=14.0`, `/api/auth/register` lỗi `500`) từ commit `4eac22b`. | [vercel.json](file:///c:/Web du lịch HCM/vercel.json) chứa `"public": true`, `"name"`, `"env"` vi phạm schema nghiêm ngặt (`additionalProperties: false`) của Vercel. | Chuẩn hóa [vercel.json](file:///c:/Web du lịch HCM/vercel.json) trong commit `bde8721`; Vercel chuyển sang `state: "success"`. |
| **2** | **HIGH** | Lỗi `TypeError: Cannot read properties of undefined (reading 'split')` trong `renderPackageUI`. | Backend `/api/ai-recommend` trả `itinerary` dạng `{ day, morning, afternoon, evening }` trong khi frontend gọi `d.d.split(':')`. | Thêm `window.normalizeItineraryDays` tại [frontend/app.js](file:///c:/Web du lịch HCM/frontend/app.js#L1562-L1582) và [app.js](file:///c:/Web du lịch HCM/app.js#L1562-L1582); `0` JS errors trên trình duyệt. |
| **3** | **HIGH** | Request `/api/*` tương đối trên domain `*.vercel.app` đi qua Serverless Function V3 thay vì Worker Staging. | Trên Vercel, tệp [api/index.js](file:///c:/Web du lịch HCM/api/index.js) (`api/[...path].js`) được ưu tiên trước `rewrites`. | Cập nhật [api/index.js](file:///c:/Web du lịch HCM/api/index.js#L7-L76) chuyển tiếp mọi host non-production sang `wandermatch-api-staging.vannong20182018.workers.dev`. |
| **4** | **HIGH** | `PUT /api/v4/users/profile` bị trình duyệt chặn CORS Preflight (`[Điểm 5]`). | `Access-Control-Allow-Methods` trong [corsMiddleware.js](file:///c:/Web du lịch HCM/src/middleware/corsMiddleware.js#L37) và [worker.js](file:///c:/Web du lịch HCM/worker.js#L1225) chỉ liệt kê `GET, POST, OPTIONS`. | Bổ sung `PUT, PATCH, DELETE`, deploy Worker Staging `04c7f317-d101-4ee2-ab19-f0ab8bf8aa42`; tái kiểm tra trình duyệt đạt `OPTIONS 204` -> `PUT 200 OK`. |
| **5** | **HIGH** | Chuyển ứng viên #2 (`[Điểm 8]`) làm mất `v4PackageId`, rơi về mã legacy `#WM45016` và kích hoạt fallback `404` ở `/api/payment/check-status`. | `applyServerRecommendationData` đọc `topPkg.id` thay vì `topPkg.package_id`, và `selectBlindTravelCandidate` không mang `v4PackageId` từ `window.v4Packages`. | Map `topPkg.package_id || topPkg.id` và lưu `window.v4Packages` + đồng bộ QR theo mã `booking_code` V4 tại [frontend/app.js](file:///c:/Web du lịch HCM/frontend/app.js#L1587-L1626) và [app.js](file:///c:/Web du lịch HCM/app.js#L1587-L1626); tái kiểm tra trình duyệt tạo mã `WM20260035`, `GET /api/v4/bookings/status` `200`, `POST /api/v4/bookings/reveal` `402`. |

---

## 7. ĐÁNH GIÁ MỨC ĐỘ SẴN SÀNG PHÁT HÀNH (RELEASE READINESS)

- **Trạng thái Staging V4.3.1:** **`FULL_STAGING_UAT_PASS`**
- **Các điểm vận hành cần lưu ý (không chặn Staging, cần theo dõi trước khi mở Production theo quyết định riêng):**
  1. **GitHub Actions Secret `CLOUDFLARE_API_TOKEN`:** Hiện chưa khai báo trên repository GitHub nên CI bước `Deploy Worker Staging` chạy nhánh skip an toàn (còn triển khai thực tế đã thực hiện trực tiếp qua `npm run deploy:staging` -> version `04c7f317-d101-4ee2-ab19-f0ab8bf8aa42`). Nếu muốn tự động hóa deploy Worker Staging từ CI mỗi lần push, cần bổ sung `CLOUDFLARE_API_TOKEN` scoped Staging vào GitHub Repository Secrets.
  2. **Thẩm mỹ giao diện Tablet (`768px`):** Badge `★ 4.95` chạm nhẹ mép pill `SLA-DL-88219` trong lưới 3 cột B2B tại độ rộng `768px`; nên tinh chỉnh breakpoint card grid (`lg:grid-cols-3 md:grid-cols-2`) ở đợt polish UI tiếp theo.
  3. **Production Lock vẫn giữ hiệu lực tuyệt đối:** Báo cáo này xác nhận mức sẵn sàng của nhánh `feat/v4-architecture` trên toàn bộ tầng Staging; mọi thao tác hợp nhất vào `main` hoặc triển khai Production vẫn bị khóa chờ quyết định phê duyệt riêng.
