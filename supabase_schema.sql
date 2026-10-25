CREATE TABLE IF NOT EXISTS public.customer_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT UNIQUE NOT NULL,
    full_name TEXT NOT NULL,
    encrypted_cccd TEXT NOT NULL,
    bank_code TEXT NOT NULL,
    encrypted_bank_account TEXT NOT NULL,
    bank_account_holder TEXT NOT NULL,
    persona_vector JSONB NOT NULL,
    comfort_locks JSONB NOT NULL,
    blacklisted_cities TEXT[] DEFAULT '{}',
    past_feedback_summary TEXT DEFAULT 'Khách hàng mới lần đầu trải nghiệm.',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.b2b_partners (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_name TEXT NOT NULL,
    license_number TEXT NOT NULL,
    kyb_status TEXT DEFAULT 'VERIFIED',
    linked_bank_code TEXT NOT NULL,
    linked_bank_account TEXT NOT NULL,
    escrow_deposit_balance NUMERIC DEFAULT 50000000,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.b2b_inventories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    partner_id UUID REFERENCES public.b2b_partners(id),
    city_name TEXT NOT NULL,
    combo_title TEXT NOT NULL,
    transport_info TEXT NOT NULL,
    hotel_name TEXT NOT NULL,
    star_rating INT DEFAULT 5,
    public_review_score NUMERIC DEFAULT 9.0,
    retail_price NUMERIC NOT NULL,
    net_price NUMERIC NOT NULL,
    hotel_confirmation_code TEXT NOT NULL,
    weather_temp_c INT NOT NULL,
    weather_desc TEXT NOT NULL,
    attribute_vector JSONB NOT NULL,
    remaining_slots INT DEFAULT 5
);

CREATE TABLE IF NOT EXISTS public.blind_bookings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_code TEXT UNIQUE NOT NULL,
    customer_id UUID REFERENCES public.customer_profiles(id),
    inventory_id UUID REFERENCES public.b2b_inventories(id),
    group_size INT DEFAULT 1,
    budget_vnd NUMERIC NOT NULL,
    retail_value_vnd NUMERIC NOT NULL,
    net_cost_vnd NUMERIC NOT NULL,
    gross_margin_vnd NUMERIC NOT NULL,
    departure_time TIMESTAMPTZ NOT NULL,
    reveal_time TIMESTAMPTZ NOT NULL,
    ai_reasoning_log TEXT,
    mystery_hint TEXT,
    packing_checklist JSONB DEFAULT '[]'::jsonb,
    anti_tourist_trap_guide JSONB DEFAULT '[]'::jsonb,
    payment_status TEXT DEFAULT 'PAID_ESCROW',
    refund_type TEXT DEFAULT 'NONE',
    refund_fee_vnd NUMERIC DEFAULT 0,
    partner_compensation_vnd NUMERIC DEFAULT 0,
    net_refund_to_user_vnd NUMERIC DEFAULT 0,
    force_majeure_reason TEXT,
    is_demo_unlocked BOOLEAN DEFAULT FALSE,
    customer_rating INT,
    customer_review TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.customer_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.b2b_partners ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.b2b_inventories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blind_bookings ENABLE ROW LEVEL SECURITY;

INSERT INTO public.b2b_partners (id, company_name, license_number, linked_bank_code, linked_bank_account, escrow_deposit_balance)
VALUES 
('11111111-1111-1111-1111-111111111111', 'VietHeritage Travel Corp', '79-1024/2026/TCDL-GP', 'VCB', '0071000889999', 80000000),
('22222222-2222-2222-2222-222222222222', 'Indochina Retreat & Airways', '01-2048/2026/TCDL-GP', 'TCB', '19036688999988', 65000000)
ON CONFLICT DO NOTHING;

INSERT INTO public.b2b_inventories (id, partner_id, city_name, combo_title, transport_info, hotel_name, star_rating, public_review_score, retail_price, net_price, hotel_confirmation_code, weather_temp_c, weather_desc, attribute_vector)
VALUES
('11111111-1111-1111-1111-111111111101', '11111111-1111-1111-1111-111111111111', 'Đà Lạt', '3N2Đ Trú Ẩn Rừng Thông & Săn Mây', 'Vé khứ hồi Vietnam Airlines (08:30 - 10:15) + Xe đưa đón sân bay Liên Khương', 'Ana Mandara Villas Dalat Resort & Spa', 5, 9.1, 6500000, 3600000, 'SLA-DL-88219', 16, 'Se lạnh, sương mù nhẹ buổi sớm', '{"healing": 95, "nature": 90, "solitude": 85, "comfort": 90, "culture": 70}'),
('11111111-1111-1111-1111-111111111102', '11111111-1111-1111-1111-111111111111', 'Quy Nhơn', '3N2Đ Bình Yên Làng Chài & Eo Gió', 'Vé khứ hồi Bamboo Airways (09:00 - 10:35) + Ký gửi 20kg', 'Avani Quy Nhon Resort (Phòng hướng biển)', 5, 8.9, 6200000, 3500000, 'SLA-QN-44102', 27, 'Nắng vàng dịu, gió biển mát', '{"healing": 85, "nature": 90, "solitude": 80, "comfort": 85, "culture": 65}'),
('11111111-1111-1111-1111-111111111103', '22222222-2222-2222-2222-222222222222', 'Măng Đen', '3N2Đ Chữa Lành Giữa Đại Ngàn Tây Nguyên', 'Vé máy bay khứ hồi Pleiku (07:45) + Limousine đưa thẳng lên Măng Đen', 'Golden Boutique Hotel Măng Đen', 4, 8.8, 5400000, 2900000, 'SLA-MD-77310', 18, 'Không khí trong lành, mùi thông non', '{"healing": 98, "nature": 95, "solitude": 95, "comfort": 75, "culture": 80}'),
('11111111-1111-1111-1111-111111111104', '22222222-2222-2222-2222-222222222222', 'Huế', '3N2Đ Dạo Bước Cố Đô & Thiền Định Sông Hương', 'Vé khứ hồi Vietnam Airlines (09:15) + Tặng vé tắm khoáng nóng Alba', 'Pilgrimage Village Boutique Resort & Spa', 5, 9.2, 5800000, 3200000, 'SLA-HUE-99201', 24, 'Trời dịu mát, thoảng hương trầm', '{"healing": 90, "nature": 75, "solitude": 85, "comfort": 90, "culture": 98}'),
('11111111-1111-1111-1111-111111111105', '11111111-1111-1111-1111-111111111111', 'Phú Quốc', '3N2Đ Nghỉ Dưỡng Nhiệt Đới & Hoàng Hôn Nam Đảo', 'Vé khứ hồi Vietjet Deluxe (10:00) + Đưa đón riêng', 'Salinda Resort Phu Quoc Island', 5, 9.3, 7800000, 4200000, 'SLA-PQ-55190', 29, 'Nắng ấm nhiệt đới, biển êm', '{"healing": 80, "nature": 85, "solitude": 60, "comfort": 98, "culture": 60}')
ON CONFLICT DO NOTHING;
