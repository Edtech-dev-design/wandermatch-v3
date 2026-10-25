-- ============================================================================
-- WANDERMATCH (BẢN ĐỒ MÙ) — PHIÊN BẢN 3.0
-- MODEL: NHẬP SỐ TIỀN & ĐỊA ĐIỂM MUỐN ĐẾN ĐỂ LÊN KẾ HOẠCH ĐI CHƠI
-- CORPORATE VIETQR, CONDITIONAL REFUND, HARD-COMMIT SLA & AI SMART CONCIERGE
-- PostgreSQL / Supabase Comprehensive Normalized Schema (12 Tables)
-- ============================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================================
-- 1. ENUMS & DOMAINS
-- ============================================================================

CREATE TYPE user_role_enum AS ENUM ('traveler', 'b2b_hotel_partner', 'admin_operator', 'finance_auditor');
CREATE TYPE bank_verification_status AS ENUM ('UNVERIFIED', 'NAPAS_PENDING', 'ACTIVE_VERIFIED', 'NAME_MISMATCH', 'REJECTED');
CREATE TYPE trip_mode_enum AS ENUM ('CUSTOM_DESTINATION_PLANNER', 'BLIND_MAP_SURPRISE');
CREATE TYPE trip_package_tier AS ENUM ('BUDGET_SAVER', 'STANDARD_EXPERIENCE', 'PREMIUM_COMFORT', 'LUXURY_RETREAT');
CREATE TYPE trip_lifecycle_status AS ENUM (
    'DRAFT_SURVEY',
    'PLAN_GENERATED',
    'AWAITING_VIETQR_PAYMENT',
    'HELD_IN_COMPANY_ESCROW',
    'HARD_COMMITTED_NO_CANCEL',
    'READY_FOR_REVEAL',
    'DESTINATION_UNLOCKED',
    'ARRIVED_CONCIERGE_ACTIVE',
    'COMPLETED',
    'CANCELLATION_REQUESTED',
    'REFUNDED_CONDITIONAL',
    'REFUNDED_FORCE_MAJEURE'
);
CREATE TYPE room_commitment_status AS ENUM ('PENDING_PARTNER_SIGN', 'HARD_COMMITTED', 'OVERBOOKED_VIOLATION', 'FULFILLED', 'FORCE_MAJEURE_RELEASED');
CREATE TYPE ledger_transaction_type AS ENUM ('VIETQR_ESCROW_INFLOW', 'B2B_PARTNER_PAYOUT', 'REFUND_TIER_1', 'REFUND_TIER_2', 'REFUND_FORCE_MAJEURE', 'SLA_PENALTY_DEDUCTION');
CREATE TYPE refund_tier_category AS ENUM ('TIER_1_EARLY_72H', 'TIER_2_WINDOW_24_72H', 'TIER_3_LATE_OR_SCRATCHED', 'FORCE_MAJEURE_LEVEL_A', 'FORCE_MAJEURE_LEVEL_B');
CREATE TYPE poi_category_enum AS ENUM ('SPECIALTY_FOOD', 'ATTRACTION_TICKET', 'CAFE_SUNSET_CHILL', 'NIGHTLIFE_ACOUSTIC');
CREATE TYPE verdict_badge_enum AS ENUM ('VERY_WORTH_IT', 'TASTY_FAIR_PRICE', 'CROWDED_BUT_BEAUTIFUL', 'PRICEY_CONSIDER', 'MUST_TRY');

-- ============================================================================
-- 2. BẢNG 1: users (Người dùng & Khách du lịch)
-- ============================================================================
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    full_name VARCHAR(120) NOT NULL,
    full_name_unaccented VARCHAR(120) NOT NULL, -- Trích xuất từ OCR CCCD, vd: NGUYEN VAN AN
    id_card_number VARCHAR(20) UNIQUE, -- Số CCCD / Hộ chiếu
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20) UNIQUE NOT NULL,
    avatar_url TEXT,
    role user_role_enum DEFAULT 'traveler',
    current_wallet_balance NUMERIC(15, 2) DEFAULT 0.00 CHECK (current_wallet_balance >= 0),
    preferred_language VARCHAR(5) DEFAULT 'vi' CHECK (preferred_language IN ('vi', 'en', 'ko', 'ja')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- 3. BẢNG 2: linked_bank_accounts (Tài khoản ngân hàng Napas 247 nhận hoàn tiền)
-- ============================================================================
CREATE TABLE IF NOT EXISTS linked_bank_accounts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    bank_code VARCHAR(20) NOT NULL,
    bank_name VARCHAR(120) NOT NULL,
    account_number VARCHAR(35) NOT NULL,
    account_holder_name VARCHAR(120) NOT NULL,
    napas_lookup_ref VARCHAR(100),
    verification_status bank_verification_status DEFAULT 'UNVERIFIED',
    verified_at TIMESTAMPTZ,
    is_default_for_refund BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT uq_user_bank_account UNIQUE (user_id, bank_code, account_number)
);

-- ============================================================================
-- 4. BẢNG 3: b2b_partner_profiles (Hồ sơ Đối tác Khách sạn / Resort B2B)
-- ============================================================================
CREATE TABLE IF NOT EXISTS b2b_partner_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    partner_name VARCHAR(150) NOT NULL,
    business_license_no VARCHAR(50) UNIQUE NOT NULL,
    legal_representative VARCHAR(100) NOT NULL,
    contact_phone VARCHAR(20) NOT NULL,
    contact_email VARCHAR(120) NOT NULL,
    bank_code VARCHAR(20) NOT NULL,
    bank_account_no VARCHAR(35) NOT NULL,
    bank_account_holder VARCHAR(120) NOT NULL,
    sla_guarantee_deposit_balance NUMERIC(15, 2) DEFAULT 20000000.00 CHECK (sla_guarantee_deposit_balance >= 0),
    sla_status VARCHAR(30) DEFAULT 'ACTIVE_COMPLIANT',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- 5. BẢNG 4: destinations (Danh mục các Điểm đến Kèm Đa ngôn ngữ)
-- ============================================================================
CREATE TABLE IF NOT EXISTS destinations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code_slug VARCHAR(50) UNIQUE NOT NULL, -- hochiminh, dalat, danang, phuquoc, sapa
    city_name VARCHAR(80) NOT NULL,
    province_name VARCHAR(80) NOT NULL,
    region VARCHAR(30) NOT NULL CHECK (region IN ('NORTH', 'CENTRAL', 'SOUTH', 'HIGHLANDS')),
    airport_code VARCHAR(10),
    headline_vi VARCHAR(200) NOT NULL,
    headline_en VARCHAR(200),
    headline_ko VARCHAR(200),
    headline_ja VARCHAR(200),
    overview_description JSONB NOT NULL,
    hero_image_url TEXT NOT NULL,
    avg_daily_budget_min NUMERIC(12, 0) DEFAULT 800000,
    avg_daily_budget_max NUMERIC(12, 0) DEFAULT 2500000,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- 6. BẢNG 5: b2b_inventories (Kho phòng trống được cấp phép kết nối PMS)
-- ============================================================================
CREATE TABLE IF NOT EXISTS b2b_inventories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    partner_id UUID NOT NULL REFERENCES b2b_partner_profiles(id) ON DELETE CASCADE,
    destination_id UUID NOT NULL REFERENCES destinations(id) ON DELETE RESTRICT,
    hotel_resort_name VARCHAR(150) NOT NULL,
    room_category VARCHAR(100) NOT NULL,
    star_rating INT CHECK (star_rating BETWEEN 3 AND 5),
    rack_rate NUMERIC(15, 2) NOT NULL,
    b2b_contract_net_rate NUMERIC(15, 2) NOT NULL,
    available_date DATE NOT NULL,
    allotment_count INT DEFAULT 1 CHECK (allotment_count >= 0),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- 7. BẢNG 6: blind_trips (Chuyến đi & Kế hoạch Tự chọn Địa điểm + Ngân sách)
-- ============================================================================
CREATE TABLE IF NOT EXISTS blind_trips (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_code VARCHAR(30) UNIQUE NOT NULL, -- WM99081234
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    trip_mode trip_mode_enum DEFAULT 'CUSTOM_DESTINATION_PLANNER',
    
    -- Người dùng tự nhập số tiền và địa điểm muốn đến
    destination_id UUID NOT NULL REFERENCES destinations(id),
    custom_budget_amount NUMERIC(15, 2) NOT NULL CHECK (custom_budget_amount > 0), -- Số tiền người dùng nhập
    pax_count INT DEFAULT 2 CHECK (pax_count >= 1), -- Số người đi
    duration_days INT DEFAULT 3 CHECK (duration_days >= 1), -- Số ngày đi
    
    -- Phân bổ ngân sách AI đề xuất
    budget_allocation JSONB DEFAULT '{
      "accommodation_pct": 40,
      "food_dining_pct": 30,
      "attraction_tickets_pct": 20,
      "contingency_transport_pct": 10
    }'::jsonb,
    
    package_price NUMERIC(15, 2) NOT NULL,
    pnr_code VARCHAR(15),
    
    -- Persona Survey kết quả
    persona_healing_pct INT DEFAULT 50 CHECK (persona_healing_pct BETWEEN 0 AND 100),
    persona_foodie_pct INT DEFAULT 50 CHECK (persona_foodie_pct BETWEEN 0 AND 100),
    persona_adventure_pct INT DEFAULT 50 CHECK (persona_adventure_pct BETWEEN 0 AND 100),
    persona_resort_pct INT DEFAULT 50 CHECK (persona_resort_pct BETWEEN 0 AND 100),
    health_allergy_notes TEXT,
    
    -- Trạng thái & Vòng đời
    status trip_lifecycle_status DEFAULT 'AWAITING_VIETQR_PAYMENT',
    departure_date TIMESTAMPTZ NOT NULL,
    return_date TIMESTAMPTZ NOT NULL,
    
    -- Thẻ cào mở khóa Canvas (cho chế độ Bản đồ mù hoặc xác nhận phòng)
    scratch_revealed_at TIMESTAMPTZ,
    scratch_percentage_reached INT DEFAULT 0,
    is_destination_revealed BOOLEAN DEFAULT TRUE,
    
    selected_itinerary_id UUID,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- 8. BẢNG 7: b2b_room_commitments (Cam kết Phòng Cứng & SLA Bảo lãnh)
-- ============================================================================
CREATE TABLE IF NOT EXISTS b2b_room_commitments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    trip_id UUID NOT NULL REFERENCES blind_trips(id) ON DELETE CASCADE,
    partner_id UUID NOT NULL REFERENCES b2b_partner_profiles(id) ON DELETE RESTRICT,
    inventory_id UUID NOT NULL REFERENCES b2b_inventories(id),
    pms_confirmation_code VARCHAR(50) NOT NULL,
    commitment_status room_commitment_status DEFAULT 'PENDING_PARTNER_SIGN',
    partner_digital_signed_at TIMESTAMPTZ,
    sla_deposit_locked_amount NUMERIC(15, 2) DEFAULT 20000000.00,
    violation_penalty_incurred NUMERIC(15, 2) DEFAULT 0.00,
    hotel_upgrade_guarantee_applied BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- 9. BẢNG 8: escrow_payment_ledgers (Sổ cái VietQR & Dòng tiền Tạm giữ Escrow)
-- ============================================================================
CREATE TABLE IF NOT EXISTS escrow_payment_ledgers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    trip_id UUID NOT NULL REFERENCES blind_trips(id) ON DELETE RESTRICT,
    vietqr_order_ref VARCHAR(50) NOT NULL,
    corporate_account_number VARCHAR(35) NOT NULL DEFAULT '990812348888',
    corporate_beneficiary_name VARCHAR(150) NOT NULL DEFAULT 'CONG TY CP CONG NGHE DU LICH WANDERMATCH',
    corporate_bank_code VARCHAR(20) NOT NULL DEFAULT 'MB',
    transaction_type ledger_transaction_type NOT NULL,
    amount NUMERIC(15, 2) NOT NULL,
    direction VARCHAR(5) NOT NULL CHECK (direction IN ('IN', 'OUT')),
    sender_bank_account VARCHAR(50),
    sender_account_holder VARCHAR(120),
    receiver_bank_account VARCHAR(50),
    receiver_account_holder VARCHAR(120),
    escrow_release_status VARCHAR(30) DEFAULT 'HELD_IN_ESCROW' CHECK (escrow_release_status IN ('HELD_IN_ESCROW', 'DISBURSED_TO_PARTNER', 'REFUNDED_TO_USER', 'FORFEITED_RETAINED')),
    webhook_payload JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- 10. BẢNG 9: cancellation_refund_requests (Bộ máy Xử lý Hoàn tiền 3 Khung Giờ)
-- ============================================================================
CREATE TABLE IF NOT EXISTS cancellation_refund_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    trip_id UUID NOT NULL REFERENCES blind_trips(id) ON DELETE RESTRICT,
    user_id UUID NOT NULL REFERENCES users(id),
    target_bank_account_id UUID REFERENCES linked_bank_accounts(id),
    hours_before_departure NUMERIC(8, 2) NOT NULL,
    is_revealed_at_cancellation BOOLEAN NOT NULL DEFAULT FALSE,
    tier_applied refund_tier_category NOT NULL,
    cancellation_fee_percent NUMERIC(5, 2) NOT NULL,
    original_trip_price NUMERIC(15, 2) NOT NULL,
    cancellation_fee_amount NUMERIC(15, 2) NOT NULL,
    partner_compensation_cut NUMERIC(15, 2) DEFAULT 0.00,
    platform_admin_cut NUMERIC(15, 2) DEFAULT 0.00,
    actual_refund_amount NUMERIC(15, 2) NOT NULL,
    force_majeure_reason TEXT,
    evidence_document_url TEXT,
    bonus_voucher_amount NUMERIC(15, 2) DEFAULT 0.00,
    operator_decision_status VARCHAR(30) DEFAULT 'AUTO_APPROVED_EXECUTED' CHECK (operator_decision_status IN ('AUTO_APPROVED_EXECUTED', 'UNDER_REVIEW', 'APPROVED_BY_ADMIN', 'REJECTED')),
    refund_executed_at TIMESTAMPTZ,
    payout_bank_reference VARCHAR(100),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- 11. BẢNG 10: destination_pois (Món ăn, Điểm vui chơi, Giá vé & Đa ngôn ngữ)
-- ============================================================================
CREATE TABLE IF NOT EXISTS destination_pois (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    destination_id UUID NOT NULL REFERENCES destinations(id) ON DELETE CASCADE,
    category poi_category_enum NOT NULL,
    name_vi VARCHAR(150) NOT NULL,
    name_en VARCHAR(150) NOT NULL,
    name_ko VARCHAR(150),
    name_ja VARCHAR(150),
    address VARCHAR(255) NOT NULL,
    opening_hours VARCHAR(80) NOT NULL,
    
    -- Giá vé / Chi phí ước tính bình quân 1 người
    ticket_or_avg_cost_min NUMERIC(12, 0) NOT NULL DEFAULT 0,
    ticket_or_avg_cost_max NUMERIC(12, 0) NOT NULL DEFAULT 0,
    cost_display_vi VARCHAR(100) NOT NULL,
    cost_display_en VARCHAR(100) NOT NULL,
    cost_display_ko VARCHAR(100),
    cost_display_ja VARCHAR(100),
    
    description JSONB NOT NULL,
    specialty_highlight JSONB,
    hero_image_url TEXT NOT NULL,
    gallery_image_urls JSONB DEFAULT '[]'::jsonb,
    
    average_rating NUMERIC(3, 2) DEFAULT 5.00 CHECK (average_rating BETWEEN 1.00 AND 5.00),
    total_reviews_count INT DEFAULT 0 CHECK (total_reviews_count >= 0),
    dominant_verdict_badge verdict_badge_enum DEFAULT 'VERY_WORTH_IT',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- 12. BẢNG 11: ai_generated_itineraries (1-3 Lịch trình AI theo Khung giờ)
-- ============================================================================
CREATE TABLE IF NOT EXISTS ai_generated_itineraries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    trip_id UUID REFERENCES blind_trips(id) ON DELETE CASCADE,
    destination_id UUID NOT NULL REFERENCES destinations(id),
    itinerary_index INT NOT NULL CHECK (itinerary_index IN (1, 2, 3)),
    persona_focus_type VARCHAR(50) NOT NULL,
    
    title_vi VARCHAR(180) NOT NULL,
    title_en VARCHAR(180) NOT NULL,
    title_ko VARCHAR(180),
    title_ja VARCHAR(180),
    tagline_vi VARCHAR(255) NOT NULL,
    tagline_en VARCHAR(255) NOT NULL,
    tagline_ko VARCHAR(255),
    tagline_ja VARCHAR(255),
    
    total_self_funded_cost_est NUMERIC(12, 0) NOT NULL DEFAULT 450000,
    timeline_slots JSONB NOT NULL,
    is_selected_by_user BOOLEAN DEFAULT FALSE,
    activated_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- 13. BẢNG 12: poi_reviews (Đánh giá Thực tế của Khách Đã Đi)
-- ============================================================================
CREATE TABLE IF NOT EXISTS poi_reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    poi_id UUID NOT NULL REFERENCES destination_pois(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    author_name VARCHAR(100) NOT NULL,
    author_avatar_url TEXT,
    rating_score INT NOT NULL CHECK (rating_score BETWEEN 1 AND 5),
    verdict_badge verdict_badge_enum NOT NULL,
    actual_spent_amount NUMERIC(12, 0),
    review_content TEXT NOT NULL,
    visit_date DATE NOT NULL DEFAULT CURRENT_DATE,
    verified_traveler BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- 14. INDEXES ĐẢM BẢO HIỆU NĂNG TRUY VẤN CAO
-- ============================================================================
CREATE INDEX idx_destinations_slug ON destinations(code_slug);
CREATE INDEX idx_blind_trips_dest ON blind_trips(destination_id);
CREATE INDEX idx_blind_trips_budget ON blind_trips(custom_budget_amount);
CREATE INDEX idx_destination_pois_dest ON destination_pois(destination_id, category);
CREATE INDEX idx_ai_itineraries_dest ON ai_generated_itineraries(destination_id);
CREATE INDEX idx_poi_reviews_poi ON poi_reviews(poi_id);

-- ============================================================================
-- 15. TRIGGER TỰ ĐỘNG CẬP NHẬT RATING & ĐÁNH GIÁ TRÊN POI
-- ============================================================================
CREATE OR REPLACE FUNCTION update_poi_rating_stats()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE destination_pois
    SET 
        average_rating = (
            SELECT ROUND(AVG(rating_score)::numeric, 2)
            FROM poi_reviews
            WHERE poi_id = COALESCE(NEW.poi_id, OLD.poi_id)
        ),
        total_reviews_count = (
            SELECT COUNT(*)
            FROM poi_reviews
            WHERE poi_id = COALESCE(NEW.poi_id, OLD.poi_id)
        ),
        updated_at = NOW()
    WHERE id = COALESCE(NEW.poi_id, OLD.poi_id);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_after_poi_review_change ON poi_reviews;
CREATE TRIGGER trg_after_poi_review_change
AFTER INSERT OR UPDATE OR DELETE ON poi_reviews
FOR EACH ROW
EXECUTE FUNCTION update_poi_rating_stats();

-- ============================================================================
-- 16. SEED DATA MẪU: TP. HỒ CHÍ MINH, ĐÀ LẠT, ĐÀ NẴNG
-- ============================================================================

-- Thêm Điểm đến 1: TP. Hồ Chí Minh
INSERT INTO destinations (id, code_slug, city_name, province_name, region, airport_code, headline_vi, headline_en, headline_ko, headline_ja, overview_description, hero_image_url)
VALUES (
    '10000000-0000-0000-0000-000000000001',
    'hochiminh',
    'TP. Hồ Chí Minh',
    'Hồ Chí Minh',
    'SOUTH',
    'SGN',
    'Hòn Ngọc Viễn Đông — Đô Thị Sôi Động & Thiên Đường Ẩm Thực',
    'The Pearl of the Far East — Vibrant Metropolis & Culinary Capital',
    '동양의 진주 — 활기찬 대도시 & 미식의 천국 호치민',
    '東洋の真珠 — 活気あふれる大都市＆グルメ天国ホーチミン',
    '{
        "vi": "TP. Hồ Chí Minh là trung tâm kinh tế, văn hóa sầm uất bậc nhất Việt Nam với sự giao thoa kiến trúc Pháp cổ kính và nhịp sống hiện đại ven sông Sài Gòn rực rỡ ánh đèn.",
        "en": "Ho Chi Minh City is Vietnam’s vibrant cultural and economic hub, blending French colonial heritage with a bustling modern riverside skyline.",
        "ko": "호치민시는 프랑스 식민지 시대의 유산과 사이공 강의 현대적인 스카이라인이 공존하는 베트남 최대의 경제·문화 중심지입니다.",
        "ja": "ホーチミン市はフランス植民地時代の美しい建築とサイゴン川沿いの近代的な摩天楼が調和する、ベトナム最大の活気ある大都市です。"
    }'::jsonb,
    'https://images.unsplash.com/photo-1583417319070-4a69db38a482?auto=format&fit=crop&w=1200&q=80'
) ON CONFLICT (code_slug) DO NOTHING;

-- Thêm Điểm đến 2: Đà Lạt
INSERT INTO destinations (id, code_slug, city_name, province_name, region, airport_code, headline_vi, headline_en, headline_ko, headline_ja, overview_description, hero_image_url)
VALUES (
    '10000000-0000-0000-0000-000000000002',
    'dalat',
    'Đà Lạt',
    'Lâm Đồng',
    'HIGHLANDS',
    'DLI',
    'Xứ Sở Sương Mù & Những Đồi Thông Tĩnh Lặng',
    'The Misty Highland & Whispering Pine Forests',
    '안개 낀 고원과 속삭이는 소나무 숲',
    '霧に包まれた高原と松林の囁き',
    '{
        "vi": "Đà Lạt nằm trên cao nguyên Lâm Viên với khí hậu ôn đới mát mẻ quanh năm, ngàn hoa đua nở và văn hóa cà phê săn mây độc đáo.",
        "en": "Dalat sits atop the Langbiang plateau with a year-round cool temperate climate, endless flowers, and serene pine forests.",
        "ko": "달랏은 연중 서늘한 기후와 소나무 숲, 구름 사냥 카페 문화가 매력적인 해발 1,500m 고원 도시입니다.",
        "ja": "ダラットは標高1,500mに位置し、一年を通じて冷涼な気候と穏やかな松林、雲海カフェが人気のリゾートです。"
    }'::jsonb,
    'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=1200&q=80'
) ON CONFLICT (code_slug) DO NOTHING;

-- Thêm Điểm đến 3: Đà Nẵng
INSERT INTO destinations (id, code_slug, city_name, province_name, region, airport_code, headline_vi, headline_en, headline_ko, headline_ja, overview_description, hero_image_url)
VALUES (
    '10000000-0000-0000-0000-000000000003',
    'danang',
    'Đà Nẵng & Hội An',
    'Đà Nẵng',
    'CENTRAL',
    'DAD',
    'Thành Phố Đáng Sống — Biển Mỹ Khê & Phố Cổ Lung Linh',
    'Most Livable City — My Khe Beach & Lantern Old Town',
    '가장 살기 좋은 도시 — 미케 비치 & 환상적인 호이안 구시가지',
    '最も住みやすい都市 — ミーケビーチ＆幻想的なホイアン古都',
    '{
        "vi": "Đà Nẵng sở hữu bãi biển Mỹ Khê top đầu thế giới, bán đảo Sơn Trà hoang sơ và kết nối thuận tiện tới Di sản Phố Cổ Hội An lung linh đèn lồng.",
        "en": "Danang boasts world-class My Khe beach, Son Tra peninsula, and quick access to the UNESCO lantern-lit heritage of Hoi An.",
        "ko": "세계적인 미케 해변과 손짜 반도, 유네스코 등재 호이안 고대 도시를 품은 최고의 휴양 도시입니다.",
        "ja": "世界屈指のミーケビーチとホイアンのランタン灯る世界遺産の街並みを巡る理想的なリゾート。"
    }'::jsonb,
    'https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?auto=format&fit=crop&w=1200&q=80'
) ON CONFLICT (code_slug) DO NOTHING;

-- ============================================================================
-- PHẦN BỔ SUNG: 5 TRỤ CỘT THỰC DỤNG TIÊU DÙNG & TỐI ƯU LOSS AVERSION (V3.1)
-- ============================================================================

-- BẢNG 13: group_booking_sessions (Phiên đặt chuyến theo nhóm & chia bill VietQR)
CREATE TABLE IF NOT EXISTS group_booking_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    group_code VARCHAR(10) UNIQUE NOT NULL, -- Vd: G8892
    creator_user_id UUID REFERENCES users(id),
    total_amount NUMERIC(15, 2) NOT NULL CHECK (total_amount > 0),
    amount_per_member NUMERIC(15, 2) NOT NULL CHECK (amount_per_member > 0),
    total_members INT NOT NULL CHECK (total_members >= 2 AND total_members <= 10),
    paid_members_count INT DEFAULT 0,
    session_expires_at TIMESTAMPTZ NOT NULL, -- Giữ chỗ trong 30 phút
    status VARCHAR(30) DEFAULT 'WAITING_MEMBERS' CHECK (status IN ('WAITING_MEMBERS', 'FULLY_PAID', 'EXPIRED_REFUNDED', 'CANCELLED')),
    corporate_account_no VARCHAR(50) DEFAULT '990812348888',
    corporate_bank_code VARCHAR(20) DEFAULT 'MB',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- BẢNG 14: group_booking_members (Từng thành viên trong nhóm chia tiền)
CREATE TABLE IF NOT EXISTS group_booking_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID REFERENCES group_booking_sessions(id) ON DELETE CASCADE,
    member_index INT NOT NULL CHECK (member_index >= 1),
    member_name VARCHAR(120) NOT NULL,
    member_phone VARCHAR(20),
    napas_bank_code VARCHAR(20) NOT NULL,
    napas_account_no VARCHAR(50) NOT NULL,
    napas_account_holder VARCHAR(120) NOT NULL,
    amount_due NUMERIC(15, 2) NOT NULL,
    vietqr_memo VARCHAR(50) NOT NULL UNIQUE, -- Vd: WM G8892 M1
    qr_raw_payload TEXT,
    is_paid BOOLEAN DEFAULT FALSE,
    paid_at TIMESTAMPTZ,
    payout_refund_status VARCHAR(30) DEFAULT 'NONE' CHECK (payout_refund_status IN ('NONE', 'PENDING_REFUND', 'REFUNDED_100_PERCENT')),
    payout_refund_tx_id VARCHAR(100),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- BẢNG 15: b2b_sla_escrow_claims (Xử lý khiếu nại phòng & kích hoạt SOS Quỹ Ký Quỹ Đổi Phòng 15 Phút)
CREATE TABLE IF NOT EXISTS b2b_sla_escrow_claims (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    trip_id UUID REFERENCES blind_trips(id) ON DELETE CASCADE,
    hotel_id UUID REFERENCES b2b_partner_profiles(id),
    traveler_id UUID REFERENCES users(id),
    complaint_reason VARCHAR(100) NOT NULL, -- 'OVERBOOKED_DENIED', 'WRONG_STAR_RATING', 'UNHYGIENIC_FACILITY'
    evidence_image_url TEXT,
    penalty_deduction_amount NUMERIC(15, 2) NOT NULL, -- Trích từ EscrowSecurityDeposit
    backup_hotel_voucher_code VARCHAR(50),
    backup_hotel_name VARCHAR(200),
    resolution_time_minutes INT DEFAULT 15,
    status VARCHAR(30) DEFAULT 'SLA_PENALIZED_AND_REPLACED' CHECK (status IN ('PENDING_REVIEW', 'SLA_PENALIZED_AND_REPLACED', 'RESOLVED_SATISFIED', 'REJECTED')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- BẢNG 16: anti_tourist_trap_guides (Bản đồ ẩm thực bản địa & cảnh báo chặt chém)
CREATE TABLE IF NOT EXISTS anti_tourist_trap_guides (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    destination_id UUID REFERENCES destinations(id) ON DELETE CASCADE,
    spot_name VARCHAR(200) NOT NULL,
    category VARCHAR(50) NOT NULL, -- 'STREET_FOOD', 'SEAFOOD', 'SPECIALTY_DISH'
    price_range_min NUMERIC(12, 2) NOT NULL,
    price_range_max NUMERIC(12, 2) NOT NULL,
    distance_km_from_hotel NUMERIC(4, 1) DEFAULT 1.5,
    local_authentic_reason TEXT NOT NULL,
    scam_warning_alert TEXT, -- Vd: 'Cảnh báo: Không mua hải sản từ người bán rong ven đường, hỏi giá trước khi chọn con sống'
    voucher_discount_amount NUMERIC(12, 2) DEFAULT 200000.00,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Bổ sung trường Thực dụng vào bảng blind_trips
ALTER TABLE blind_trips 
    ADD COLUMN IF NOT EXISTS retail_value_floor NUMERIC(15, 2) DEFAULT 0.00,
    ADD COLUMN IF NOT EXISTS retail_price_actual NUMERIC(15, 2) DEFAULT 0.00,
    ADD COLUMN IF NOT EXISTS savings_amount NUMERIC(15, 2) DEFAULT 0.00,
    ADD COLUMN IF NOT EXISTS savings_pct NUMERIC(5, 2) DEFAULT 0.00,
    ADD COLUMN IF NOT EXISTS comfort_locks JSONB DEFAULT '{"no_red_eye": true, "bed_type": "TWIN", "luggage_kg": 20, "need_work_desk": false}'::jsonb,
    ADD COLUMN IF NOT EXISTS exact_departure_window VARCHAR(200),
    ADD COLUMN IF NOT EXISTS offline_wallet_data JSONB,
    ADD COLUMN IF NOT EXISTS destination_cost_index NUMERIC(3, 2) DEFAULT 1.0;

-- ============================================================================
-- KẾT THÚC DDL SCHEMA V3.1 (5 TRỤ CỘT THỰC DỤNG TIÊU DÙNG & TỐI ƯU LOSS AVERSION)
-- ============================================================================
