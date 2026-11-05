-- ============================================================================
-- WANDERMATCH V4.0 – MIGRATION 004: SEED CATALOG (>= 3 DESTINATIONS PER BUCKET)
-- & 7 GATEKEEPER RECONCILIATION QUERIES (Recon #1 - Recon #7)
-- ============================================================================

-- ============================================================================
-- 1. SEED 9 DESTINATIONS ACROSS 3 CLIMATE BUCKETS (3 PER BUCKET FOR k >= 3)
-- ============================================================================
INSERT INTO public.destinations (
    code_slug, city_name, province_name, region, climate_bucket_id,
    climate_zone_label, temp_range_label,
    healing_score, nature_score, solitude_score, comfort_score, culture_score,
    climate_profile_jsonb, approved_mystery_hints_jsonb, generic_packing_jsonb, local_dining_guide_jsonb
) VALUES
-- BUCKET 1: COOL_MIST_HIGHLAND (3 destinations: Đà Lạt, Măng Đen, Sa Pa)
('da-lat', 'Đà Lạt', 'Lâm Đồng', 'HIGHLANDS', 'COOL_MIST_HIGHLAND',
 'Cao Nguyên Sương Mù & Rừng Thông', '15°C – 22°C', 95, 92, 85, 90, 80,
 '{"default": 92}'::jsonb,
 '["Không gian se lạnh giữa đại ngàn thông xanh, nơi nhịp sống chậm lại bên tách trà ấm.", "Vùng cao nguyên thanh bình đón sương sớm và hương thảo mộc tự nhiên."]'::jsonb,
 '["Áo khoác ấm nhẹ", "Giày đi bộ thoải mái", "Khăn choàng cổ"]'::jsonb,
 '[{"name": "Bánh căn Lệ Yersin", "specialty": "Bánh căn trứng cút nóng hổi"}]'::jsonb),

('mang-den', 'Măng Đen', 'Kon Tum', 'HIGHLANDS', 'COOL_MIST_HIGHLAND',
 'Cao Nguyên Sương Mù & Rừng Thông', '15°C – 22°C', 98, 98, 96, 85, 78,
 '{"default": 90}'::jsonb,
 '["Không gian se lạnh giữa đại ngàn thông xanh, nơi nhịp sống chậm lại bên tách trà ấm.", "Vùng cao nguyên thanh bình đón sương sớm và hương thảo mộc tự nhiên."]'::jsonb,
 '["Áo khoác ấm nhẹ", "Giày đi bộ thoải mái", "Khăn choàng cổ"]'::jsonb,
 '[{"name": "Gà nướng cơm lam Cô Sinh", "specialty": "Gà nướng lá tiêu rừng"}]'::jsonb),

('sa-pa', 'Sa Pa', 'Lào Cai', 'NORTH', 'COOL_MIST_HIGHLAND',
 'Cao Nguyên Sương Mù & Rừng Thông', '15°C – 22°C', 94, 97, 88, 86, 92,
 '{"default": 89}'::jsonb,
 '["Không gian se lạnh giữa đại ngàn thông xanh, nơi nhịp sống chậm lại bên tách trà ấm.", "Vùng cao nguyên thanh bình đón sương sớm và hương thảo mộc tự nhiên."]'::jsonb,
 '["Áo khoác ấm nhẹ", "Giày đi bộ thoải mái", "Khăn choàng cổ"]'::jsonb,
 '[{"name": "Lẩu cá tầm Bản Mây", "specialty": "Cá tầm suối tươi"}]'::jsonb),

-- BUCKET 2: TROPICAL_COAST_SUN (3 destinations: Phú Quốc, Quy Nhơn, Nha Trang)
('phu-quoc', 'Phú Quốc', 'Kiên Giang', 'ISLAND', 'TROPICAL_COAST_SUN',
 'Vịnh Biển Nắng Ấm & Gió Nhiệt Đới', '25°C – 31°C', 92, 90, 82, 95, 70,
 '{"default": 93}'::jsonb,
 '["Làn nước trong xanh ôm trọn bờ cát mịn dưới ánh hoàng hôn rực rỡ.", "Hơi thở đại dương dịu êm với khu nghỉ dưỡng tách biệt và ẩm thực biển tươi sống."]'::jsonb,
 '["Kính râm & kem chống nắng", "Trang phục đi biển thoáng mát", "Mũ rộng vành"]'::jsonb,
 '[{"name": "Bún quậy Kiến Xây", "specialty": "Bún quậy hải sản tươi"}]'::jsonb),

('quy-nhon', 'Quy Nhơn', 'Bình Định', 'CENTRAL', 'TROPICAL_COAST_SUN',
 'Vịnh Biển Nắng Ấm & Gió Nhiệt Đới', '25°C – 31°C', 90, 91, 88, 88, 84,
 '{"default": 91}'::jsonb,
 '["Làn nước trong xanh ôm trọn bờ cát mịn dưới ánh hoàng hôn rực rỡ.", "Hơi thở đại dương dịu êm với khu nghỉ dưỡng tách biệt và ẩm thực biển tươi sống."]'::jsonb,
 '["Kính râm & kem chống nắng", "Trang phục đi biển thoáng mát", "Mũ rộng vành"]'::jsonb,
 '[{"name": "Hải sản Eo Gió", "specialty": "Ốc biển & nhum nướng mỡ hành"}]'::jsonb),

('nha-trang', 'Nha Trang', 'Khánh Hòa', 'CENTRAL', 'TROPICAL_COAST_SUN',
 'Vịnh Biển Nắng Ấm & Gió Nhiệt Đới', '25°C – 31°C', 89, 88, 80, 94, 78,
 '{"default": 91}'::jsonb,
 '["Làn nước trong xanh ôm trọn bờ cát mịn dưới ánh hoàng hôn rực rỡ.", "Hơi thở đại dương dịu êm với khu nghỉ dưỡng tách biệt và ẩm thực biển tươi sống."]'::jsonb,
 '["Kính râm & kem chống nắng", "Trang phục đi biển thoáng mát", "Mũ rộng vành"]'::jsonb,
 '[{"name": "Bún cá Năm Beo", "specialty": "Bún chả cá sứa tươi"}]'::jsonb),

-- BUCKET 3: HERITAGE_CULTURAL_WARM (3 destinations: Huế, Hội An - Đà Nẵng, Ninh Bình)
('hue', 'Cố Đô Huế', 'Thừa Thiên Huế', 'CENTRAL', 'HERITAGE_CULTURAL_WARM',
 'Miền Di Sản Trầm Mặc & Khoáng Nóng', '22°C – 28°C', 94, 84, 88, 90, 99,
 '{"default": 88}'::jsonb,
 '["Miền đất lưu giữ chiều sâu văn hóa trăm năm với nhịp sống thư thái và ẩm thực tinh tế.", "Hành trình tìm về sự tĩnh tại giữa kiến trúc cổ kính và thiên nhiên hiền hòa."]'::jsonb,
 '["Trang phục lịch sự tham quan di tích", "Giày bệt êm chân", "Ô gấp gọn"]'::jsonb,
 '[{"name": "Cơm hến Hoa Đông", "specialty": "Cơm hến & bánh bèo nậm lọc"}]'::jsonb),

('hoi-an', 'Đà Nẵng & Hội An', 'Quảng Nam - Đà Nẵng', 'CENTRAL', 'HERITAGE_CULTURAL_WARM',
 'Miền Di Sản Trầm Mặc & Khoáng Nóng', '22°C – 28°C', 91, 86, 82, 94, 96,
 '{"default": 90}'::jsonb,
 '["Miền đất lưu giữ chiều sâu văn hóa trăm năm với nhịp sống thư thái và ẩm thực tinh tế.", "Hành trình tìm về sự tĩnh tại giữa kiến trúc cổ kính và thiên nhiên hiền hòa."]'::jsonb,
 '["Trang phục lịch sự tham quan di tích", "Giày bệt êm chân", "Ô gấp gọn"]'::jsonb,
 '[{"name": "Cao lầu Thanh", "specialty": "Cao lầu phố cổ"}]'::jsonb),

('ninh-binh', 'Tràng An - Ninh Bình', 'Ninh Bình', 'NORTH', 'HERITAGE_CULTURAL_WARM',
 'Miền Di Sản Trầm Mặc & Khoáng Nóng', '22°C – 28°C', 93, 95, 89, 88, 95,
 '{"default": 89}'::jsonb,
 '["Miền đất lưu giữ chiều sâu văn hóa trăm năm với nhịp sống thư thái và ẩm thực tinh tế.", "Hành trình tìm về sự tĩnh tại giữa kiến trúc cổ kính và thiên nhiên hiền hòa."]'::jsonb,
 '["Trang phục lịch sự tham quan di tích", "Giày bệt êm chân", "Ô gấp gọn"]'::jsonb,
 '[{"name": "Dê núi Tràng An", "specialty": "Cơm cháy sốt dê núi"}]'::jsonb)
ON CONFLICT (code_slug) DO NOTHING;

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

