# WANDERMATCH V4.3 — PERFORMANCE REPORT

**Date:** 2026-11-14  
**Measured Worker Target:** `https://wandermatch-api-staging.vannong20182018.workers.dev`  
**Metrics Artifact:** `scratch/v4_3_perf_metrics.json` (`2026-11-14T08:51:56.547Z`), plus E2E latency summaries from `scratch/v4_3_local_e2e.json` & `scratch/v4_3_live_staging_e2e.json`.

---

## 1. Staging Worker Edge Latencies (5 Samples per Probe)

> **Note:** Sample #1 reflects cold TCP/TLS + Worker/Supabase warm-up; Samples #2–#5 reflect warm edge execution.

| Endpoint | HTTP | Min (ms) | p50 (ms) | p95 / Max (ms) | Avg (ms) | Samples (ms) |
| :--- | :---: | ---: | ---: | ---: | ---: | :--- |
| `GET /api/v4/health` | `200` | 147.07 | 231.43 | 1112.43 | 384.55 | `[1112.43, 276.78, 231.43, 147.07, 155.05]` |
| `GET /api/v4/discovery/catalog` | `200` | 155.69 | 169.04 | 1070.00 | 372.07 | `[1070, 159.62, 305.99, 169.04, 155.69]` |
| `GET /api/v4/reviews?limit=10` | `200` | 155.44 | 189.44 | 1084.88 | 378.53 | `[1084.88, 174.07, 288.83, 155.44, 189.44]` |
| `GET /api/v4/recommendations` *(route expects POST; unauthenticated GET returns 404)* | `404` | 156.10 | 319.12 | 594.44 | 340.45 | `[473.21, 594.44, 159.4, 319.12, 156.1]` |

---

## 2. Full-Stack E2E Execution Latency Summary

| Suite | Count | Avg (ms) | p50 (ms) | p95 (ms) | Slowest Operation (Live Staging) |
| :--- | :---: | ---: | ---: | ---: | :--- |
| **Local (`local:src/index.js`)** | 24 | 10.49 | 3.08 | 42.64 | `E2E-02` Register (`49.66ms` — PBKDF2 hashing) |
| **Live Cloud Staging (`--live-staging`)** | 24 | 472.01 | 290.73 | 1542.39 | `E2E-04` Forgot/Reset Password (`2527.47ms` — multi-hop GoTrue REST round-trips), `E2E-20` Admin Multi-Step (`1542.39ms`) |

---

## 3. Worker & Frontend Asset Payload Footprint

- **Cloudflare Worker Bundle (`wandermatch-api-staging`, `src/index.js`):**
  - Total Upload: **`353.46 KiB`** raw / **`77.19 KiB`** gzip (`wrangler deploy src/index.js --env staging`).
- **Static Frontend Assets (`16` measured files under `frontend/`):**
  - **Total Raw:** **`396,209 bytes`** (~386.9 KiB)
  - **Total Gzip:** **`101,810 bytes`** (~99.4 KiB)

| File | Raw Bytes | Gzip Bytes |
| :--- | ---: | ---: |
| `frontend/index.html` | 105,794 | 22,672 |
| `frontend/app.js` | 255,554 | 66,174 |
| `frontend/core/bootstrapV4.js` | 4,043 | 1,293 |
| `frontend/core/appCore.js` | 1,350 | 636 |
| `frontend/config/environments.js` | 5,011 | 1,630 |
| `frontend/services/apiClient.js` | 4,090 | 1,525 |
| `frontend/modules/auth/authModule.js` | 3,143 | 1,059 |
| `frontend/modules/profile/profileModule.js` | 1,868 | 710 |
| `frontend/modules/discovery/discoveryModule.js` | 3,593 | 1,316 |
| `frontend/modules/ai/aiRecommendationModule.js` | 2,405 | 984 |
| `frontend/modules/blind-booking/blindBookingModule.js` | 2,549 | 999 |
| `frontend/modules/booking/bookingModule.js` | 1,353 | 570 |
| `frontend/modules/payment/paymentModule.js` | 1,709 | 728 |
| `frontend/modules/reviews/reviewsModule.js` | 1,454 | 607 |
| `frontend/modules/notifications/notificationsModule.js` | 1,174 | 481 |
| `frontend/modules/admin/adminModule.js` | 1,119 | 426 |
| **Total (16 files)** | **396,209** | **101,810** |
