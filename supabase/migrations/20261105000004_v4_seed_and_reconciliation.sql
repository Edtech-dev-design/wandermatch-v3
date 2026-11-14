-- ============================================================================
-- WANDERMATCH V4.0 – MIGRATION 004: SEED CATALOG (>= 3 DESTINATIONS PER BUCKET)
-- & 7 GATEKEEPER RECONCILIATION QUERIES (Recon #1 - Recon #7)
-- ============================================================================

-- ============================================================================
-- 1. SEED 9 DESTINATIONS ACROSS 3 CLIMATE BUCKETS (3 PER BUCKET FOR k >= 3)
-- ============================================================================
INSERT INTO public.destinations (
    id, code_slug, city_name, province_name, region, climate_bucket_id,
    climate_zone_label, temp_range_label,
    healing_score, nature_score, solitude_score, comfort_score, culture_score,
    climate_profile_jsonb, approved_mystery_hints_jsonb, generic_packing_jsonb, local_dining_guide_jsonb
) VALUES
-- BUCKET 1: COOL_MIST_HIGHLAND (3 destinations: Đà Lạt, Măng Đen, Sa Pa)
('20000000-0000-4000-8000-000000000001', 'da-lat', 'Đà Lạt', 'Lâm Đồng', 'HIGHLANDS', 'COOL_MIST_HIGHLAND',
 'Cao Nguyên Sương Mù & Rừng Thông', '15°C – 22°C', 95, 92, 85, 90, 80,
 '{"default": 92}'::jsonb,
 '["Không gian se lạnh giữa đại ngàn thông xanh, nơi nhịp sống chậm lại bên tách trà ấm.", "Vùng cao nguyên thanh bình đón sương sớm và hương thảo mộc tự nhiên."]'::jsonb,
 '["Áo khoác ấm nhẹ", "Giày đi bộ thoải mái", "Khăn choàng cổ"]'::jsonb,
 '[{"name": "Bánh căn Lệ Yersin", "specialty": "Bánh căn trứng cút nóng hổi"}]'::jsonb),

('20000000-0000-4000-8000-000000000002', 'mang-den', 'Măng Đen', 'Kon Tum', 'HIGHLANDS', 'COOL_MIST_HIGHLAND',
 'Cao Nguyên Sương Mù & Rừng Thông', '15°C – 22°C', 98, 98, 96, 85, 78,
 '{"default": 90}'::jsonb,
 '["Không gian se lạnh giữa đại ngàn thông xanh, nơi nhịp sống chậm lại bên tách trà ấm.", "Vùng cao nguyên thanh bình đón sương sớm và hương thảo mộc tự nhiên."]'::jsonb,
 '["Áo khoác ấm nhẹ", "Giày đi bộ thoải mái", "Khăn choàng cổ"]'::jsonb,
 '[{"name": "Gà nướng cơm lam Cô Sinh", "specialty": "Gà nướng lá tiêu rừng"}]'::jsonb),

('20000000-0000-4000-8000-000000000003', 'sa-pa', 'Sa Pa', 'Lào Cai', 'NORTH', 'COOL_MIST_HIGHLAND',
 'Cao Nguyên Sương Mù & Rừng Thông', '15°C – 22°C', 94, 97, 88, 86, 92,
 '{"default": 89}'::jsonb,
 '["Không gian se lạnh giữa đại ngàn thông xanh, nơi nhịp sống chậm lại bên tách trà ấm.", "Vùng cao nguyên thanh bình đón sương sớm và hương thảo mộc tự nhiên."]'::jsonb,
 '["Áo khoác ấm nhẹ", "Giày đi bộ thoải mái", "Khăn choàng cổ"]'::jsonb,
 '[{"name": "Lẩu cá tầm Bản Mây", "specialty": "Cá tầm suối tươi"}]'::jsonb),

-- BUCKET 2: TROPICAL_COAST_SUN (3 destinations: Phú Quốc, Quy Nhơn, Nha Trang)
('20000000-0000-4000-8000-000000000004', 'phu-quoc', 'Phú Quốc', 'Kiên Giang', 'ISLAND', 'TROPICAL_COAST_SUN',
 'Vịnh Biển Nắng Ấm & Gió Nhiệt Đới', '25°C – 31°C', 92, 90, 82, 95, 70,
 '{"default": 93}'::jsonb,
 '["Làn nước trong xanh ôm trọn bờ cát mịn dưới ánh hoàng hôn rực rỡ.", "Hơi thở đại dương dịu êm với khu nghỉ dưỡng tách biệt và ẩm thực biển tươi sống."]'::jsonb,
 '["Kính râm & kem chống nắng", "Trang phục đi biển thoáng mát", "Mũ rộng vành"]'::jsonb,
 '[{"name": "Bún quậy Kiến Xây", "specialty": "Bún quậy hải sản tươi"}]'::jsonb),

('20000000-0000-4000-8000-000000000005', 'quy-nhon', 'Quy Nhơn', 'Bình Định', 'CENTRAL', 'TROPICAL_COAST_SUN',
 'Vịnh Biển Nắng Ấm & Gió Nhiệt Đới', '25°C – 31°C', 90, 91, 88, 88, 84,
 '{"default": 91}'::jsonb,
 '["Làn nước trong xanh ôm trọn bờ cát mịn dưới ánh hoàng hôn rực rỡ.", "Hơi thở đại dương dịu êm với khu nghỉ dưỡng tách biệt và ẩm thực biển tươi sống."]'::jsonb,
 '["Kính râm & kem chống nắng", "Trang phục đi biển thoáng mát", "Mũ rộng vành"]'::jsonb,
 '[{"name": "Hải sản Eo Gió", "specialty": "Ốc biển & nhum nướng mỡ hành"}]'::jsonb),

('20000000-0000-4000-8000-000000000006', 'nha-trang', 'Nha Trang', 'Khánh Hòa', 'CENTRAL', 'TROPICAL_COAST_SUN',
 'Vịnh Biển Nắng Ấm & Gió Nhiệt Đới', '25°C – 31°C', 89, 88, 80, 94, 78,
 '{"default": 91}'::jsonb,
 '["Làn nước trong xanh ôm trọn bờ cát mịn dưới ánh hoàng hôn rực rỡ.", "Hơi thở đại dương dịu êm với khu nghỉ dưỡng tách biệt và ẩm thực biển tươi sống."]'::jsonb,
 '["Kính râm & kem chống nắng", "Trang phục đi biển thoáng mát", "Mũ rộng vành"]'::jsonb,
 '[{"name": "Bún cá Năm Beo", "specialty": "Bún chả cá sứa tươi"}]'::jsonb),

-- BUCKET 3: HERITAGE_CULTURAL_WARM (3 destinations: Huế, Hội An - Đà Nẵng, Ninh Bình)
('20000000-0000-4000-8000-000000000007', 'hue', 'Cố Đô Huế', 'Thừa Thiên Huế', 'CENTRAL', 'HERITAGE_CULTURAL_WARM',
 'Miền Di Sản Trầm Mặc & Khoáng Nóng', '22°C – 28°C', 94, 84, 88, 90, 99,
 '{"default": 88}'::jsonb,
 '["Miền đất lưu giữ chiều sâu văn hóa trăm năm với nhịp sống thư thái và ẩm thực tinh tế.", "Hành trình tìm về sự tĩnh tại giữa kiến trúc cổ kính và thiên nhiên hiền hòa."]'::jsonb,
 '["Trang phục lịch sự tham quan di tích", "Giày bệt êm chân", "Ô gấp gọn"]'::jsonb,
 '[{"name": "Cơm hến Hoa Đông", "specialty": "Cơm hến & bánh bèo nậm lọc"}]'::jsonb),

('20000000-0000-4000-8000-000000000008', 'hoi-an', 'Đà Nẵng & Hội An', 'Quảng Nam - Đà Nẵng', 'CENTRAL', 'HERITAGE_CULTURAL_WARM',
 'Miền Di Sản Trầm Mặc & Khoáng Nóng', '22°C – 28°C', 91, 86, 82, 94, 96,
 '{"default": 90}'::jsonb,
 '["Miền đất lưu giữ chiều sâu văn hóa trăm năm với nhịp sống thư thái và ẩm thực tinh tế.", "Hành trình tìm về sự tĩnh tại giữa kiến trúc cổ kính và thiên nhiên hiền hòa."]'::jsonb,
 '["Trang phục lịch sự tham quan di tích", "Giày bệt êm chân", "Ô gấp gọn"]'::jsonb,
 '[{"name": "Cao lầu Thanh", "specialty": "Cao lầu phố cổ"}]'::jsonb),

('20000000-0000-4000-8000-000000000009', 'ninh-binh', 'Tràng An - Ninh Bình', 'Ninh Bình', 'NORTH', 'HERITAGE_CULTURAL_WARM',
 'Miền Di Sản Trầm Mặc & Khoáng Nóng', '22°C – 28°C', 93, 95, 89, 88, 95,
 '{"default": 89}'::jsonb,
 '["Miền đất lưu giữ chiều sâu văn hóa trăm năm với nhịp sống thư thái và ẩm thực tinh tế.", "Hành trình tìm về sự tĩnh tại giữa kiến trúc cổ kính và thiên nhiên hiền hòa."]'::jsonb,
 '["Trang phục lịch sự tham quan di tích", "Giày bệt êm chân", "Ô gấp gọn"]'::jsonb,
 '[{"name": "Dê núi Tràng An", "specialty": "Cơm cháy sốt dê núi"}]'::jsonb)
ON CONFLICT (id) DO NOTHING;

-- SEED B2B PARTNER & PROVIDER
INSERT INTO auth.users (id, email)
VALUES ('00000000-0000-4000-8000-000000000001', 'partner.system@wandermatch.vn')
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.profiles (id, email, full_name, phone)
VALUES ('00000000-0000-4000-8000-000000000001', 'partner.system@wandermatch.vn', 'WanderMatch Luxury Partner Network', '0901000111')
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.user_roles (user_id, role, is_active)
VALUES ('00000000-0000-4000-8000-000000000001', 'b2b_partner', true)
ON CONFLICT (user_id, role) DO NOTHING;

INSERT INTO public.travel_providers (
    id, owner_user_id, provider_name, provider_type, business_license_no,
    kyb_status, settlement_bank_code, settlement_bank_account, settlement_bank_holder,
    sla_deposit_vnd, is_active
) VALUES (
    '10000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001',
    'WanderMatch Luxury Partner Network', 'COMBO_OPERATOR', 'BL-WM-2026-001', 'VERIFIED',
    'MB', '0889421997', 'WANDERMATCH B2B ESCROW', 100000000, true
) ON CONFLICT (id) DO NOTHING;

-- SEED 9 HOTELS
INSERT INTO public.hotels (id, destination_id, provider_id, hotel_name, address, sla_code, star_rating, review_score, vibe_tier_alias, secret_hero_image_url) VALUES
('30000000-0000-4000-8000-000000000001', '20000000-0000-4000-8000-000000000001', '10000000-0000-4000-8000-000000000001', 'Ana Mandara Villas Dalat Resort & Spa', 'Đà Lạt, Lâm Đồng', 'SLA-DLI-501', 5, 9.2, 'Boutique Sanctuary & Spa', 'https://cdn.wandermatch.vn/hotels/da-lat.jpg'),
('30000000-0000-4000-8000-000000000002', '20000000-0000-4000-8000-000000000002', '10000000-0000-4000-8000-000000000001', 'Golden Boutique Sanctuary Măng Đen', 'Măng Đen, Kon Tum', 'SLA-PXU-502', 5, 9.2, 'Boutique Sanctuary & Spa', 'https://cdn.wandermatch.vn/hotels/mang-den.jpg'),
('30000000-0000-4000-8000-000000000003', '20000000-0000-4000-8000-000000000003', '10000000-0000-4000-8000-000000000001', 'Hotel de la Coupole MGallery', 'Sa Pa, Lào Cai', 'SLA-SPA-503', 5, 9.2, 'Boutique Sanctuary & Spa', 'https://cdn.wandermatch.vn/hotels/sa-pa.jpg'),
('30000000-0000-4000-8000-000000000004', '20000000-0000-4000-8000-000000000004', '10000000-0000-4000-8000-000000000001', 'Salinda Resort Phu Quoc Island', 'Phú Quốc, Kiên Giang', 'SLA-PQC-504', 5, 9.2, 'Boutique Sanctuary & Spa', 'https://cdn.wandermatch.vn/hotels/phu-quoc.jpg'),
('30000000-0000-4000-8000-000000000005', '20000000-0000-4000-8000-000000000005', '10000000-0000-4000-8000-000000000001', 'Avani Quy Nhon Resort & Cliff Spa', 'Quy Nhơn, Bình Định', 'SLA-UIH-505', 5, 9.2, 'Boutique Sanctuary & Spa', 'https://cdn.wandermatch.vn/hotels/quy-nhon.jpg'),
('30000000-0000-4000-8000-000000000006', '20000000-0000-4000-8000-000000000006', '10000000-0000-4000-8000-000000000001', 'Amiana Resort Nha Trang Bay', 'Nha Trang, Khánh Hòa', 'SLA-CXR-506', 5, 9.2, 'Boutique Sanctuary & Spa', 'https://cdn.wandermatch.vn/hotels/nha-trang.jpg'),
('30000000-0000-4000-8000-000000000007', '20000000-0000-4000-8000-000000000007', '10000000-0000-4000-8000-000000000001', 'Pilgrimage Village Boutique Resort & Spa', 'Huế, Thừa Thiên Huế', 'SLA-HUI-507', 5, 9.2, 'Boutique Sanctuary & Spa', 'https://cdn.wandermatch.vn/hotels/hue.jpg'),
('30000000-0000-4000-8000-000000000008', '20000000-0000-4000-8000-000000000008', '10000000-0000-4000-8000-000000000001', 'Anantara Hoi An Heritage Resort', 'Hội An, Quảng Nam', 'SLA-DAD-508', 5, 9.2, 'Boutique Sanctuary & Spa', 'https://cdn.wandermatch.vn/hotels/hoi-an.jpg'),
('30000000-0000-4000-8000-000000000009', '20000000-0000-4000-8000-000000000009', '10000000-0000-4000-8000-000000000001', 'Emeralda Resort Ninh Binh Sanctuary', 'Ninh Bình', 'SLA-NBH-509', 5, 9.2, 'Boutique Sanctuary & Spa', 'https://cdn.wandermatch.vn/hotels/ninh-binh.jpg')
ON CONFLICT (id) DO NOTHING;

-- SEED 27 FLIGHTS (SGN, HAN, DAD for 9 destinations)
INSERT INTO public.flights (id, destination_id, provider_id, origin_airport, destination_airport, airline_name, flight_code, exact_departure_time, time_band, baggage_kg) VALUES
('40000000-0001-4000-8000-000000000001', '20000000-0000-4000-8000-000000000001', '10000000-0000-4000-8000-000000000001', 'SGN', 'DLI', 'Vietnam Airlines', 'VN1380-SGN', '08:30 - 10:00', 'MORNING', 20),
('40000000-0002-4000-8000-000000000001', '20000000-0000-4000-8000-000000000001', '10000000-0000-4000-8000-000000000001', 'HAN', 'DLI', 'Vietnam Airlines', 'VN1380-HAN', '08:30 - 10:00', 'MORNING', 20),
('40000000-0003-4000-8000-000000000001', '20000000-0000-4000-8000-000000000001', '10000000-0000-4000-8000-000000000001', 'DAD', 'DLI', 'Vietnam Airlines', 'VN1380-DAD', '08:30 - 10:00', 'MORNING', 20),
('40000000-0001-4000-8000-000000000002', '20000000-0000-4000-8000-000000000002', '10000000-0000-4000-8000-000000000001', 'SGN', 'PXU', 'Vietnam Airlines', 'VN1860-SGN', '08:30 - 10:00', 'MORNING', 20),
('40000000-0002-4000-8000-000000000002', '20000000-0000-4000-8000-000000000002', '10000000-0000-4000-8000-000000000001', 'HAN', 'PXU', 'Vietnam Airlines', 'VN1860-HAN', '08:30 - 10:00', 'MORNING', 20),
('40000000-0003-4000-8000-000000000002', '20000000-0000-4000-8000-000000000002', '10000000-0000-4000-8000-000000000001', 'DAD', 'PXU', 'Vietnam Airlines', 'VN1860-DAD', '08:30 - 10:00', 'MORNING', 20),
('40000000-0001-4000-8000-000000000003', '20000000-0000-4000-8000-000000000003', '10000000-0000-4000-8000-000000000001', 'SGN', 'HAN', 'Vietnam Airlines', 'VN2100-SGN', '08:30 - 10:00', 'MORNING', 20),
('40000000-0002-4000-8000-000000000003', '20000000-0000-4000-8000-000000000003', '10000000-0000-4000-8000-000000000001', 'HAN', 'HAN', 'Vietnam Airlines', 'VN2100-HAN', '08:30 - 10:00', 'MORNING', 20),
('40000000-0003-4000-8000-000000000003', '20000000-0000-4000-8000-000000000003', '10000000-0000-4000-8000-000000000001', 'DAD', 'HAN', 'Vietnam Airlines', 'VN2100-DAD', '08:30 - 10:00', 'MORNING', 20),
('40000000-0001-4000-8000-000000000004', '20000000-0000-4000-8000-000000000004', '10000000-0000-4000-8000-000000000001', 'SGN', 'PQC', 'Vietnam Airlines', 'VN1820-SGN', '08:30 - 10:00', 'MORNING', 20),
('40000000-0002-4000-8000-000000000004', '20000000-0000-4000-8000-000000000004', '10000000-0000-4000-8000-000000000001', 'HAN', 'PQC', 'Vietnam Airlines', 'VN1820-HAN', '08:30 - 10:00', 'MORNING', 20),
('40000000-0003-4000-8000-000000000004', '20000000-0000-4000-8000-000000000004', '10000000-0000-4000-8000-000000000001', 'DAD', 'PQC', 'Vietnam Airlines', 'VN1820-DAD', '08:30 - 10:00', 'MORNING', 20),
('40000000-0001-4000-8000-000000000005', '20000000-0000-4000-8000-000000000005', '10000000-0000-4000-8000-000000000001', 'SGN', 'UIH', 'Vietnam Airlines', 'VN1620-SGN', '08:30 - 10:00', 'MORNING', 20),
('40000000-0002-4000-8000-000000000005', '20000000-0000-4000-8000-000000000005', '10000000-0000-4000-8000-000000000001', 'HAN', 'UIH', 'Vietnam Airlines', 'VN1620-HAN', '08:30 - 10:00', 'MORNING', 20),
('40000000-0003-4000-8000-000000000005', '20000000-0000-4000-8000-000000000005', '10000000-0000-4000-8000-000000000001', 'DAD', 'UIH', 'Vietnam Airlines', 'VN1620-DAD', '08:30 - 10:00', 'MORNING', 20),
('40000000-0001-4000-8000-000000000006', '20000000-0000-4000-8000-000000000006', '10000000-0000-4000-8000-000000000001', 'SGN', 'CXR', 'Vietnam Airlines', 'VN1340-SGN', '08:30 - 10:00', 'MORNING', 20),
('40000000-0002-4000-8000-000000000006', '20000000-0000-4000-8000-000000000006', '10000000-0000-4000-8000-000000000001', 'HAN', 'CXR', 'Vietnam Airlines', 'VN1340-HAN', '08:30 - 10:00', 'MORNING', 20),
('40000000-0003-4000-8000-000000000006', '20000000-0000-4000-8000-000000000006', '10000000-0000-4000-8000-000000000001', 'DAD', 'CXR', 'Vietnam Airlines', 'VN1340-DAD', '08:30 - 10:00', 'MORNING', 20),
('40000000-0001-4000-8000-000000000007', '20000000-0000-4000-8000-000000000007', '10000000-0000-4000-8000-000000000001', 'SGN', 'HUI', 'Vietnam Airlines', 'VN1540-SGN', '08:30 - 10:00', 'MORNING', 20),
('40000000-0002-4000-8000-000000000007', '20000000-0000-4000-8000-000000000007', '10000000-0000-4000-8000-000000000001', 'HAN', 'HUI', 'Vietnam Airlines', 'VN1540-HAN', '08:30 - 10:00', 'MORNING', 20),
('40000000-0003-4000-8000-000000000007', '20000000-0000-4000-8000-000000000007', '10000000-0000-4000-8000-000000000001', 'DAD', 'HUI', 'Vietnam Airlines', 'VN1540-DAD', '08:30 - 10:00', 'MORNING', 20),
('40000000-0001-4000-8000-000000000008', '20000000-0000-4000-8000-000000000008', '10000000-0000-4000-8000-000000000001', 'SGN', 'DAD', 'Vietnam Airlines', 'VN1120-SGN', '08:30 - 10:00', 'MORNING', 20),
('40000000-0002-4000-8000-000000000008', '20000000-0000-4000-8000-000000000008', '10000000-0000-4000-8000-000000000001', 'HAN', 'DAD', 'Vietnam Airlines', 'VN1120-HAN', '08:30 - 10:00', 'MORNING', 20),
('40000000-0003-4000-8000-000000000008', '20000000-0000-4000-8000-000000000008', '10000000-0000-4000-8000-000000000001', 'DAD', 'DAD', 'Vietnam Airlines', 'VN1120-DAD', '08:30 - 10:00', 'MORNING', 20),
('40000000-0001-4000-8000-000000000009', '20000000-0000-4000-8000-000000000009', '10000000-0000-4000-8000-000000000001', 'SGN', 'HAN', 'Vietnam Airlines', 'VN2200-SGN', '08:30 - 10:00', 'MORNING', 20),
('40000000-0002-4000-8000-000000000009', '20000000-0000-4000-8000-000000000009', '10000000-0000-4000-8000-000000000001', 'HAN', 'HAN', 'Vietnam Airlines', 'VN2200-HAN', '08:30 - 10:00', 'MORNING', 20),
('40000000-0003-4000-8000-000000000009', '20000000-0000-4000-8000-000000000009', '10000000-0000-4000-8000-000000000001', 'DAD', 'HAN', 'Vietnam Airlines', 'VN2200-DAD', '08:30 - 10:00', 'MORNING', 20)
ON CONFLICT (id) DO NOTHING;

-- SEED 9 HOTEL INVENTORIES
INSERT INTO public.partner_inventories (id, provider_id, hotel_id, flight_id, item_type, inventory_date, total_slots, available_slots, reserved_slots, retail_price_vnd, net_price_vnd) VALUES
('50000000-0000-4000-8000-000000000001', '10000000-0000-4000-8000-000000000001', '30000000-0000-4000-8000-000000000001', NULL, 'HOTEL_ROOM', '2026-11-15', 50, 50, 0, 1800000, 1100000),
('50000000-0000-4000-8000-000000000002', '10000000-0000-4000-8000-000000000001', '30000000-0000-4000-8000-000000000002', NULL, 'HOTEL_ROOM', '2026-11-15', 50, 50, 0, 1800000, 1100000),
('50000000-0000-4000-8000-000000000003', '10000000-0000-4000-8000-000000000001', '30000000-0000-4000-8000-000000000003', NULL, 'HOTEL_ROOM', '2026-11-15', 50, 50, 0, 1800000, 1100000),
('50000000-0000-4000-8000-000000000004', '10000000-0000-4000-8000-000000000001', '30000000-0000-4000-8000-000000000004', NULL, 'HOTEL_ROOM', '2026-11-15', 50, 50, 0, 1800000, 1100000),
('50000000-0000-4000-8000-000000000005', '10000000-0000-4000-8000-000000000001', '30000000-0000-4000-8000-000000000005', NULL, 'HOTEL_ROOM', '2026-11-15', 50, 50, 0, 1800000, 1100000),
('50000000-0000-4000-8000-000000000006', '10000000-0000-4000-8000-000000000001', '30000000-0000-4000-8000-000000000006', NULL, 'HOTEL_ROOM', '2026-11-15', 50, 50, 0, 1800000, 1100000),
('50000000-0000-4000-8000-000000000007', '10000000-0000-4000-8000-000000000001', '30000000-0000-4000-8000-000000000007', NULL, 'HOTEL_ROOM', '2026-11-15', 50, 50, 0, 1800000, 1100000),
('50000000-0000-4000-8000-000000000008', '10000000-0000-4000-8000-000000000001', '30000000-0000-4000-8000-000000000008', NULL, 'HOTEL_ROOM', '2026-11-15', 50, 50, 0, 1800000, 1100000),
('50000000-0000-4000-8000-000000000009', '10000000-0000-4000-8000-000000000001', '30000000-0000-4000-8000-000000000009', NULL, 'HOTEL_ROOM', '2026-11-15', 50, 50, 0, 1800000, 1100000)
ON CONFLICT (id) DO NOTHING;

-- SEED 27 FLIGHT INVENTORIES
INSERT INTO public.partner_inventories (id, provider_id, hotel_id, flight_id, item_type, inventory_date, total_slots, available_slots, reserved_slots, retail_price_vnd, net_price_vnd) VALUES
('51000000-0001-4000-8000-000000000001', '10000000-0000-4000-8000-000000000001', NULL, '40000000-0001-4000-8000-000000000001', 'FLIGHT_SEAT', '2026-11-15', 100, 100, 0, 1200000, 850000),
('51000000-0002-4000-8000-000000000001', '10000000-0000-4000-8000-000000000001', NULL, '40000000-0002-4000-8000-000000000001', 'FLIGHT_SEAT', '2026-11-15', 100, 100, 0, 1200000, 850000),
('51000000-0003-4000-8000-000000000001', '10000000-0000-4000-8000-000000000001', NULL, '40000000-0003-4000-8000-000000000001', 'FLIGHT_SEAT', '2026-11-15', 100, 100, 0, 1200000, 850000),
('51000000-0001-4000-8000-000000000002', '10000000-0000-4000-8000-000000000001', NULL, '40000000-0001-4000-8000-000000000002', 'FLIGHT_SEAT', '2026-11-15', 100, 100, 0, 1200000, 850000),
('51000000-0002-4000-8000-000000000002', '10000000-0000-4000-8000-000000000001', NULL, '40000000-0002-4000-8000-000000000002', 'FLIGHT_SEAT', '2026-11-15', 100, 100, 0, 1200000, 850000),
('51000000-0003-4000-8000-000000000002', '10000000-0000-4000-8000-000000000001', NULL, '40000000-0003-4000-8000-000000000002', 'FLIGHT_SEAT', '2026-11-15', 100, 100, 0, 1200000, 850000),
('51000000-0001-4000-8000-000000000003', '10000000-0000-4000-8000-000000000001', NULL, '40000000-0001-4000-8000-000000000003', 'FLIGHT_SEAT', '2026-11-15', 100, 100, 0, 1200000, 850000),
('51000000-0002-4000-8000-000000000003', '10000000-0000-4000-8000-000000000001', NULL, '40000000-0002-4000-8000-000000000003', 'FLIGHT_SEAT', '2026-11-15', 100, 100, 0, 1200000, 850000),
('51000000-0003-4000-8000-000000000003', '10000000-0000-4000-8000-000000000001', NULL, '40000000-0003-4000-8000-000000000003', 'FLIGHT_SEAT', '2026-11-15', 100, 100, 0, 1200000, 850000),
('51000000-0001-4000-8000-000000000004', '10000000-0000-4000-8000-000000000001', NULL, '40000000-0001-4000-8000-000000000004', 'FLIGHT_SEAT', '2026-11-15', 100, 100, 0, 1200000, 850000),
('51000000-0002-4000-8000-000000000004', '10000000-0000-4000-8000-000000000001', NULL, '40000000-0002-4000-8000-000000000004', 'FLIGHT_SEAT', '2026-11-15', 100, 100, 0, 1200000, 850000),
('51000000-0003-4000-8000-000000000004', '10000000-0000-4000-8000-000000000001', NULL, '40000000-0003-4000-8000-000000000004', 'FLIGHT_SEAT', '2026-11-15', 100, 100, 0, 1200000, 850000),
('51000000-0001-4000-8000-000000000005', '10000000-0000-4000-8000-000000000001', NULL, '40000000-0001-4000-8000-000000000005', 'FLIGHT_SEAT', '2026-11-15', 100, 100, 0, 1200000, 850000),
('51000000-0002-4000-8000-000000000005', '10000000-0000-4000-8000-000000000001', NULL, '40000000-0002-4000-8000-000000000005', 'FLIGHT_SEAT', '2026-11-15', 100, 100, 0, 1200000, 850000),
('51000000-0003-4000-8000-000000000005', '10000000-0000-4000-8000-000000000001', NULL, '40000000-0003-4000-8000-000000000005', 'FLIGHT_SEAT', '2026-11-15', 100, 100, 0, 1200000, 850000),
('51000000-0001-4000-8000-000000000006', '10000000-0000-4000-8000-000000000001', NULL, '40000000-0001-4000-8000-000000000006', 'FLIGHT_SEAT', '2026-11-15', 100, 100, 0, 1200000, 850000),
('51000000-0002-4000-8000-000000000006', '10000000-0000-4000-8000-000000000001', NULL, '40000000-0002-4000-8000-000000000006', 'FLIGHT_SEAT', '2026-11-15', 100, 100, 0, 1200000, 850000),
('51000000-0003-4000-8000-000000000006', '10000000-0000-4000-8000-000000000001', NULL, '40000000-0003-4000-8000-000000000006', 'FLIGHT_SEAT', '2026-11-15', 100, 100, 0, 1200000, 850000),
('51000000-0001-4000-8000-000000000007', '10000000-0000-4000-8000-000000000001', NULL, '40000000-0001-4000-8000-000000000007', 'FLIGHT_SEAT', '2026-11-15', 100, 100, 0, 1200000, 850000),
('51000000-0002-4000-8000-000000000007', '10000000-0000-4000-8000-000000000001', NULL, '40000000-0002-4000-8000-000000000007', 'FLIGHT_SEAT', '2026-11-15', 100, 100, 0, 1200000, 850000),
('51000000-0003-4000-8000-000000000007', '10000000-0000-4000-8000-000000000001', NULL, '40000000-0003-4000-8000-000000000007', 'FLIGHT_SEAT', '2026-11-15', 100, 100, 0, 1200000, 850000),
('51000000-0001-4000-8000-000000000008', '10000000-0000-4000-8000-000000000001', NULL, '40000000-0001-4000-8000-000000000008', 'FLIGHT_SEAT', '2026-11-15', 100, 100, 0, 1200000, 850000),
('51000000-0002-4000-8000-000000000008', '10000000-0000-4000-8000-000000000001', NULL, '40000000-0002-4000-8000-000000000008', 'FLIGHT_SEAT', '2026-11-15', 100, 100, 0, 1200000, 850000),
('51000000-0003-4000-8000-000000000008', '10000000-0000-4000-8000-000000000001', NULL, '40000000-0003-4000-8000-000000000008', 'FLIGHT_SEAT', '2026-11-15', 100, 100, 0, 1200000, 850000),
('51000000-0001-4000-8000-000000000009', '10000000-0000-4000-8000-000000000001', NULL, '40000000-0001-4000-8000-000000000009', 'FLIGHT_SEAT', '2026-11-15', 100, 100, 0, 1200000, 850000),
('51000000-0002-4000-8000-000000000009', '10000000-0000-4000-8000-000000000001', NULL, '40000000-0002-4000-8000-000000000009', 'FLIGHT_SEAT', '2026-11-15', 100, 100, 0, 1200000, 850000),
('51000000-0003-4000-8000-000000000009', '10000000-0000-4000-8000-000000000001', NULL, '40000000-0003-4000-8000-000000000009', 'FLIGHT_SEAT', '2026-11-15', 100, 100, 0, 1200000, 850000)
ON CONFLICT (id) DO NOTHING;


-- ============================================================================
-- 2. SEVEN GATEKEEPER RECONCILIATION QUERIES FUNCTION (Recon #1 - Recon #7)
-- ============================================================================
CREATE OR REPLACE FUNCTION public.run_v4_reconciliation_checks()
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, public
STABLE
AS $$
DECLARE
    v_recon1_orphan_bookings BIGINT;
    v_recon2_amount_mismatch BIGINT;
    v_recon3_orphan_tx BIGINT;
    v_recon4_inventory_mismatch BIGINT;
    v_recon5_refund_mismatch BIGINT;
    v_recon6_unprocessed_webhooks BIGINT;
    v_recon7_ownership_mismatch BIGINT;
BEGIN
    -- Recon #1: Every booking must have a 1:1 payment record
    SELECT COUNT(*) INTO v_recon1_orphan_bookings
    FROM public.bookings b
    LEFT JOIN public.payments p ON p.booking_id = b.id
    WHERE p.id IS NULL;

    -- Recon #2: Expected and paid amounts between bookings and payments must match 100%
    SELECT COUNT(*) INTO v_recon2_amount_mismatch
    FROM public.bookings b
    JOIN public.payments p ON p.booking_id = b.id
    WHERE b.expected_amount_vnd <> p.expected_amount_vnd
       OR b.paid_amount_vnd <> p.paid_amount_vnd;

    -- Recon #3: Sum of INFLOW transactions must equal bookings.paid_amount_vnd (0 orphan/mismatch tx)
    SELECT COUNT(*) INTO v_recon3_orphan_tx
    FROM public.bookings b
    LEFT JOIN (
        SELECT booking_id, COALESCE(SUM(amount_vnd), 0) AS tx_inflow_sum
        FROM public.payment_transactions
        WHERE direction = 'INFLOW'
        GROUP BY booking_id
    ) tx ON tx.booking_id = b.id
    WHERE b.paid_amount_vnd <> COALESCE(tx.tx_inflow_sum, 0);

    -- Recon #4: Inventory holds conservation invariant
    SELECT COUNT(*) INTO v_recon4_inventory_mismatch
    FROM public.partner_inventories pi
    LEFT JOIN (
        SELECT inventory_id, COALESCE(SUM(quantity), 0) AS active_held_qty
        FROM public.inventory_holds
        WHERE hold_status IN ('HELD', 'COMMITTED')
        GROUP BY inventory_id
    ) h ON h.inventory_id = pi.id
    WHERE pi.reserved_slots <> COALESCE(h.active_held_qty, 0)
       OR pi.available_slots < 0
       OR (pi.available_slots + pi.reserved_slots) > pi.total_slots;

    -- Recon #5: Refunds succeeded sum vs payments.refunded_amount_vnd
    SELECT COUNT(*) INTO v_recon5_refund_mismatch
    FROM public.payments p
    LEFT JOIN (
        SELECT payment_id, COALESCE(SUM(refund_amount_vnd), 0) AS succeeded_refund_sum
        FROM public.refunds
        WHERE status = 'SUCCEEDED'
        GROUP BY payment_id
    ) r ON r.payment_id = p.id
    WHERE p.refunded_amount_vnd <> COALESCE(r.succeeded_refund_sum, 0);

    -- Recon #6: Unprocessed webhook inbox events check
    SELECT COUNT(*) INTO v_recon6_unprocessed_webhooks
    FROM public.payment_webhook_events
    WHERE processing_status IN ('RECEIVED', 'QUEUED_DURING_CUTOVER');

    -- Recon #7: Cross-table user_id ownership & zero active guest@wandermatch.vn check
    SELECT COUNT(*) INTO v_recon7_ownership_mismatch
    FROM public.bookings b
    JOIN public.packages pkg ON pkg.id = b.package_id
    JOIN public.recommendation_sessions rs ON rs.id = pkg.session_id
    JOIN public.profiles pr ON pr.id = b.user_id
    WHERE b.user_id <> pkg.user_id
       OR pkg.user_id <> rs.user_id
       OR lower(pr.email) = 'guest@wandermatch.vn';

    RETURN jsonb_build_object(
        'recon_1_orphan_bookings', v_recon1_orphan_bookings,
        'recon_2_amount_mismatch', v_recon2_amount_mismatch,
        'recon_3_orphan_tx', v_recon3_orphan_tx,
        'recon_4_inventory_mismatch', v_recon4_inventory_mismatch,
        'recon_5_refund_mismatch', v_recon5_refund_mismatch,
        'recon_6_unprocessed_webhooks', v_recon6_unprocessed_webhooks,
        'recon_7_ownership_mismatch', v_recon7_ownership_mismatch,
        'total_discrepancy', (
            v_recon1_orphan_bookings +
            v_recon2_amount_mismatch +
            v_recon3_orphan_tx +
            v_recon4_inventory_mismatch +
            v_recon5_refund_mismatch +
            v_recon6_unprocessed_webhooks +
            v_recon7_ownership_mismatch
        )
    );
END;
$$;

REVOKE ALL ON FUNCTION public.run_v4_reconciliation_checks() FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.run_v4_reconciliation_checks() TO service_role;

-- ============================================================================
-- 3. EXTERNAL PAYMENT PROVIDER SETTLEMENT RECONCILIATION (Recon #8)
-- Compares bank/gateway settlement statement rows against public.payment_transactions
-- to detect MISSING_IN_DB, MISSING_AT_PROVIDER, and AMOUNT_MISMATCH discrepancies.
-- ============================================================================
CREATE OR REPLACE FUNCTION public.reconcile_external_settlement_v4(p_settlement_records JSONB)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, public
STABLE
AS $$
DECLARE
    v_missing_in_db BIGINT := 0;
    v_missing_at_provider BIGINT := 0;
    v_amount_mismatch BIGINT := 0;
    v_anomalies JSONB := '[]'::jsonb;
BEGIN
    IF p_settlement_records IS NULL OR jsonb_typeof(p_settlement_records) <> 'array' THEN
        RAISE EXCEPTION 'INVALID_SETTLEMENT_PAYLOAD: Expected JSONB array.' USING ERRCODE = '22023';
    END IF;

    -- 1. Transactions present in Bank Settlement Statement but missing in DB
    SELECT COUNT(*), COALESCE(jsonb_agg(jsonb_build_object(
        'anomaly_type', 'MISSING_IN_DB',
        'payment_provider', UPPER(COALESCE(s->>'payment_provider', s->>'provider', 'SEPAY')),
        'external_transaction_id', s->>'external_transaction_id',
        'statement_amount_vnd', (s->>'amount_vnd')::BIGINT
    )), '[]'::jsonb)
    INTO v_missing_in_db, v_anomalies
    FROM jsonb_array_elements(p_settlement_records) s
    LEFT JOIN public.payment_transactions tx
      ON tx.payment_provider = UPPER(COALESCE(s->>'payment_provider', s->>'provider', 'SEPAY'))
     AND tx.external_transaction_id = (s->>'external_transaction_id')
    WHERE tx.id IS NULL;

    -- 2. Transactions present in both, but amount_vnd or direction differs
    WITH mismatches AS (
        SELECT
            UPPER(COALESCE(s->>'payment_provider', s->>'provider', 'SEPAY')) AS payment_provider,
            s->>'external_transaction_id' AS external_transaction_id,
            (s->>'amount_vnd')::BIGINT AS statement_amount_vnd,
            tx.amount_vnd AS db_amount_vnd
        FROM jsonb_array_elements(p_settlement_records) s
        JOIN public.payment_transactions tx
          ON tx.payment_provider = UPPER(COALESCE(s->>'payment_provider', s->>'provider', 'SEPAY'))
         AND tx.external_transaction_id = (s->>'external_transaction_id')
        WHERE tx.amount_vnd <> (s->>'amount_vnd')::BIGINT
           OR COALESCE(UPPER(s->>'direction'), 'INFLOW') <> tx.direction
    )
    SELECT COUNT(*), v_anomalies || COALESCE(jsonb_agg(jsonb_build_object(
        'anomaly_type', 'AMOUNT_MISMATCH',
        'payment_provider', m.payment_provider,
        'external_transaction_id', m.external_transaction_id,
        'statement_amount_vnd', m.statement_amount_vnd,
        'db_amount_vnd', m.db_amount_vnd
    )), '[]'::jsonb)
    INTO v_amount_mismatch, v_anomalies
    FROM mismatches m;

    -- 3. Transactions recorded in DB for the providers in statement, but missing from statement
    WITH db_unmatched AS (
        SELECT tx.payment_provider, tx.external_transaction_id, tx.amount_vnd
        FROM public.payment_transactions tx
        WHERE NOT EXISTS (
            SELECT 1 FROM jsonb_array_elements(p_settlement_records) s
            WHERE UPPER(COALESCE(s->>'payment_provider', s->>'provider', 'SEPAY')) = tx.payment_provider
              AND (s->>'external_transaction_id') = tx.external_transaction_id
        )
    )
    SELECT COUNT(*), v_anomalies || COALESCE(jsonb_agg(jsonb_build_object(
        'anomaly_type', 'MISSING_AT_PROVIDER',
        'payment_provider', u.payment_provider,
        'external_transaction_id', u.external_transaction_id,
        'db_amount_vnd', u.amount_vnd
    )), '[]'::jsonb)
    INTO v_missing_at_provider, v_anomalies
    FROM db_unmatched u;

    RETURN jsonb_build_object(
        'missing_in_db_count', v_missing_in_db,
        'missing_at_provider_count', v_missing_at_provider,
        'amount_mismatch_count', v_amount_mismatch,
        'total_settlement_discrepancy', (v_missing_in_db + v_missing_at_provider + v_amount_mismatch),
        'anomalies', v_anomalies
    );
END;
$$;

REVOKE ALL ON FUNCTION public.reconcile_external_settlement_v4(JSONB) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.reconcile_external_settlement_v4(JSONB) TO service_role;

-- ============================================================================
-- 4. CUTOVER WRITE-FREEZE CONTROL & ROLLBACK DELTA EXPORT RPCs
-- ============================================================================
CREATE OR REPLACE FUNCTION public.set_cutover_write_freeze_v4(
    p_write_freeze BOOLEAN,
    p_maintenance_readonly BOOLEAN DEFAULT FALSE
) RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, public
AS $$
DECLARE
    v_val JSONB;
BEGIN
    v_val := jsonb_build_object(
        'write_freeze', COALESCE(p_write_freeze, FALSE),
        'maintenance_readonly', COALESCE(p_maintenance_readonly, FALSE),
        'v4_active', NOT COALESCE(p_write_freeze, FALSE),
        'updated_at', NOW()
    );

    INSERT INTO public.system_settings (key, value_jsonb, description, is_public, updated_at)
    VALUES ('cutover_mode', v_val, 'Cutover write-freeze and maintenance control flags', TRUE, NOW())
    ON CONFLICT (key) DO UPDATE
        SET value_jsonb = EXCLUDED.value_jsonb,
            updated_at = NOW();

    RETURN v_val;
END;
$$;

REVOKE ALL ON FUNCTION public.set_cutover_write_freeze_v4(BOOLEAN, BOOLEAN) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.set_cutover_write_freeze_v4(BOOLEAN, BOOLEAN) TO service_role;

CREATE OR REPLACE FUNCTION public.export_v4_delta_for_v3_rollback()
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, public
STABLE
AS $$
DECLARE
    v_bookings JSONB;
    v_payments JSONB;
    v_refunds JSONB;
BEGIN
    SELECT COALESCE(jsonb_agg(jsonb_build_object(
        'bookingCode', b.booking_code,
        'userEmail', pr.email,
        'customerName', pr.full_name,
        'packageId', b.package_id::TEXT,
        'groupSize', b.group_size,
        'expectedAmount', b.expected_amount_vnd,
        'paidAmount', b.paid_amount_vnd,
        'amountDue', b.amount_due_vnd,
        'isOverpaid', (b.overpaid_amount_vnd > 0),
        'overpaidAmount', b.overpaid_amount_vnd,
        'status', b.status,
        'isRevealed', b.is_revealed,
        'revealedAt', b.revealed_at,
        'isLegacyMigrated', b.is_legacy_migrated,
        'departureDate', b.departure_date,
        'createdAt', b.created_at
    ) ORDER BY b.created_at ASC), '[]'::jsonb)
    INTO v_bookings
    FROM public.bookings b
    JOIN public.profiles pr ON pr.id = b.user_id;

    SELECT COALESCE(jsonb_agg(jsonb_build_object(
        'transactionId', tx.external_transaction_id,
        'provider', tx.payment_provider,
        'bookingCode', b.booking_code,
        'amount', tx.amount_vnd,
        'direction', tx.direction,
        'gateway', tx.bank_code,
        'transferContent', tx.transfer_content,
        'verifiedAt', tx.created_at
    ) ORDER BY tx.created_at ASC), '[]'::jsonb)
    INTO v_payments
    FROM public.payment_transactions tx
    JOIN public.bookings b ON b.id = tx.booking_id
    WHERE tx.direction = 'INFLOW';

    SELECT COALESCE(jsonb_agg(jsonb_build_object(
        'refundId', COALESCE(r.payout_bank_ref, r.id::TEXT),
        'bookingCode', b.booking_code,
        'refundAmount', r.refund_amount_vnd,
        'penaltyFee', r.cancellation_fee_vnd,
        'status', r.status,
        'processedAt', COALESCE(r.processed_at, r.updated_at)
    ) ORDER BY r.created_at ASC), '[]'::jsonb)
    INTO v_refunds
    FROM public.refunds r
    JOIN public.bookings b ON b.id = r.booking_id;

    RETURN jsonb_build_object(
        'exported_at', NOW(),
        'bookings', v_bookings,
        'payments', v_payments,
        'refunds', v_refunds
    );
END;
$$;

REVOKE ALL ON FUNCTION public.export_v4_delta_for_v3_rollback() FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.export_v4_delta_for_v3_rollback() TO service_role;



