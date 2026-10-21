/**
 * WANDERMATCH 3.0 — PRINCIPAL FULL-STACK ARCHITECT ENGINE
 * MODEL: NHẬP SỐ TIỀN & ĐỊA ĐIỂM MUỐN ĐẾN ĐỂ LÊN KẾ HOẠCH ĐI CHƠI
 * Corporate VietQR, Hard-Commit SLA, Conditional Refund & AI Smart Arrival Concierge
 */

// ============================================================================
// 1. I18N DICTIONARY (VI, EN, KO, JA)
// ============================================================================
const I18N = {
  vi: {
    nav_concierge: "🧭 Lập Kế Hoạch & Concierge",
    nav_quiz: "🎯 Persona & eKYC Napas",
    nav_vietqr: "💳 Cổng VietQR Công Ty",
    nav_scratch_refund: "🎟️ Thẻ Cào & Phí Hủy",
    nav_b2b_admin: "🏨 Đối Tác B2B & Sổ Cái",

    // Planner Controls
    planner_hero_tag: "TRỢ LÝ AI LẬP KẾ HOẠCH DU LỊCH THEO NGÂN SÁCH & ĐỊA ĐIỂM",
    planner_title: "Nhập Địa Điểm & Số Tiền Để AI Lập Kế Hoạch Đi Chơi",
    planner_subtitle: "Tự do chọn địa điểm muốn đến hoặc chế độ Bản đồ mù, nhập ngân sách mong muốn. AI tự động tối ưu chi phí vé, khách sạn, món ăn ngon và lịch trình theo khung giờ.",
    
    label_choose_dest: "1. Chọn Địa Điểm Bạn Muốn Đến:",
    label_input_budget: "2. Nhập Ngân Sách Dự Kiến (VNĐ):",
    label_pax_duration: "3. Số Khách & Thời Gian:",
    btn_generate_plan: "🚀 AI Lập Kế Hoạch & Tối Ưu Chi Phí Ngay",
    
    dest_hcm: "🏙️ TP. Hồ Chí Minh (Sài Gòn Hoa Lệ)",
    dest_dalat: "🌲 Đà Lạt (Xứ Sở Sương Mù & Chill)",
    dest_danang: "🌊 Đà Nẵng & Hội An (Biển Mỹ Khê & Phố Cổ)",
    dest_blind: "🎲 Bản Đồ Mù (WanderMatch AI Tự Chọn Bất Ngờ)",
    
    pax_1: "1 Người (Solo)",
    pax_2: "2 Người (Cặp đôi/Bạn thân)",
    pax_4: "Nhóm 4 Người",
    pax_family: "Gia đình (5-6 người)",
    dur_2d1n: "2 Ngày 1 Đêm",
    dur_3d2n: "3 Ngày 2 Đêm",
    dur_4d3n: "4 Ngày 3 Đêm",

    budget_breakdown_title: "📊 Bảng Phân Bổ Ngân Sách AI Thông Minh:",
    alloc_hotel: "🏨 Lưu trú Khách sạn/Resort (40%)",
    alloc_food: "🍜 Ăn uống ẩm thực (30%)",
    alloc_ticket: "🎡 Vé tham quan & Vui chơi (20%)",
    alloc_contingency: "🚕 Di chuyển & Dự phòng (10%)",

    // Concierge & Itineraries
    concierge_title: "Chào mừng quý khách đến với",
    concierge_badge: "TRỢ LÝ AI ĐIỂM ĐẾN THỜI GIAN THỰC",
    tab_itineraries: "📅 3 Phương Án Lịch Trình AI Tối Ưu Theo Khung Giờ",
    tab_food_attraction: "🍜 Ẩm Thực Đặc Sản & Điểm Vui Chơi Kèm Giá Vé",
    
    itinerary_btn_select: "✅ Chọn Đi Theo Lịch Trình Này",
    itinerary_btn_selected: "🌟 Đang Theo Dõi Lịch Trình Này",
    itinerary_cost_label: "Dự kiến chi phí vé & ăn uống:",
    
    filter_all: "Tất cả",
    filter_food: "🍜 Món ăn Đặc sản",
    filter_attraction: "🎡 Điểm Vui chơi & Vé",
    filter_cafe: "☕ Cafe & Chill Ngắm Cảnh",
    
    reviews_heading: "Đánh giá của khách đã đi",
    btn_view_write_review: "💬 Xem tất cả & Viết Đánh Giá",
    avg_price_label: "Chi phí trung bình:",
    address_label: "Địa chỉ:",
    hours_label: "Giờ mở cửa:",
    
    // Modal Review
    modal_review_title: "Đánh Giá Thực Tế Từ Khách Hàng",
    modal_write_title: "Chia Sẻ Trải Nghiệm Của Bạn (Đã Đi Thực Tế)",
    modal_rating_label: "Chấm điểm sao:",
    modal_verdict_label: "Nhãn kết luận nhanh:",
    modal_spent_label: "Chi phí thực tế bạn đã chi (VNĐ):",
    modal_spent_ph: "VD: 150000",
    modal_content_label: "Nhận xét chi tiết:",
    modal_content_ph: "Chia sẻ về chất lượng đồ ăn, phục vụ, không gian...",
    modal_btn_submit: "🚀 Gửi Đánh Giá Ngay",
    modal_verified_tag: "Khách Đã Xác Thực Chuyến Đi",
    
    // Quiz & eKYC
    quiz_title: "Trắc Nghiệm Tâm Lý Du Lịch & Định Danh STK Napas 247",
    quiz_subtitle: "Đo lường Travel Persona để AI kết nối điểm đến ẩn trình và kích hoạt cổng hoàn tiền tự động 100% minh bạch.",
    budget_title: "Hoặc Chọn Gói Ngân Sách Định Sẵn:",
    package_std: "Tiết Kiệm Thông Minh",
    package_prm: "Trải Nghiệm Cao Cấp (Khuyên dùng)",
    package_lux: "Nghỉ Dưỡng Thượng Lưu",
    ocr_card_title: "OCR Trích Xuất CCCD / Hộ Chiếu",
    ocr_verified_name: "Họ và tên in hoa không dấu:",
    napas_title: "Định Danh STK Ngân Hàng Nhận Hoàn Tiền (Napas 247)",
    napas_btn_verify: "⚡ Xác Thực Napas 247 Ngay",
    napas_matched: "✅ TÊN TÀI KHOẢN KHỚP 100% VỚI CCCD (ACTIVE_VERIFIED)",
    
    // VietQR
    vietqr_title: "Cổng Thanh Toán Corporate VietQR WanderMatch",
    vietqr_subtitle: "Mã QR Động Pháp Nhân Doanh Nghiệp — Tự Động Khóa Quỹ Tạm Giữ Escrow",
    corp_name: "CONG TY CP CONG NGHE DU LICH WANDERMATCH",
    account_no: "Số tài khoản: 990812348888 (MBBank)",
    order_code_label: "Mã đơn hàng:",
    amount_label: "Số tiền khóa cứng theo ngân sách bạn nhập:",
    escrow_step1_title: "1. Tạm Giữ Escrow Công Ty",
    escrow_step1_desc: "Tiền vào tài khoản tạm giữ WanderMatch, chưa giải ngân cho đối tác.",
    escrow_step2_title: "2. Khóa Cam Kết Phòng Cứng",
    escrow_step2_desc: "Đối tác B2B ký số xác nhận phòng + Quỹ bảo lãnh SLA 20.000.000đ.",
    escrow_step3_title: "3. Giải Ngân Khi Check-in",
    escrow_step3_desc: "Hệ thống tự động chuyển B2B Payout cho khách sạn khi khách nhận phòng.",
    btn_sim_paid: "📲 Giả Lập Khách Quét QR Thành Công (Webhook < 2s)",
    
    // Scratch & Refund
    scratch_title: "Phòng Chờ, Thẻ Cào & Bộ Máy Tính Phí Hủy 3 Khung Giờ",
    scratch_subtitle: "Bảo hiểm 200% không Overbooking • Minh bạch chính sách hủy có điều kiện",
    sla_badge: "CAM KẾT PHÒNG CỨNG #WM-HTL-8892 (BẢO HIỂM 200% KHÔNG OVERBOOKING)",
    canvas_hint: "Dùng chuột hoặc ngón tay cào lớp tráng bạc bên dưới để lộ Điểm Đến & Khách Sạn",
    scratch_progress: "Tiến độ cào:",
    revealed_btn: "🎉 Đã Mở Khóa! Vào Ngay Smart Concierge",
    
    refund_calc_title: "Bộ Máy Tính Phí Hoàn Tiền Tự Động Theo Khung Giờ",
    tier_1_title: "Khung 1 (> 72h Trước Giờ Đi)",
    tier_1_desc: "Chưa khóa phòng cứng. Phí hủy 10%, hoàn 90% về STK Napas.",
    tier_2_title: "Khung 2 (24h - 72h Trước Giờ Đi)",
    tier_2_desc: "Chưa cào thẻ. Phí hủy 35% (25% đền bù khách sạn + 10% phí sàn), hoàn 65%.",
    tier_3_title: "Khung 3 (< 24h hoặc ĐÃ CÀO THẺ)",
    tier_3_desc: "Đã lộ điểm đến. Phí hủy 100%, Hoàn tiền = 0 VNĐ.",
    force_majeure_title: "Cơ Chế Bất Khả Kháng (Force Majeure Override)",
    force_a_btn: "🚨 Giả Lập Cấp Độ A: Bão Lũ/Thiên Tai (Hoàn 100% + Voucher 300K)",
    force_b_btn: "🏥 Giả Lập Cấp Độ B: Cấp Cứu Y Tế (Hoàn 85% hoặc 100% Ví)",
    
    // B2B & Admin
    b2b_title: "Cổng Quản Trị Đối Tác Khách Sạn & Sổ Cái Escrow",
    b2b_subtitle: "Ký cam kết giữ phòng PMS cứng & Hệ thống tự động phạt vi phạm SLA nếu hết phòng.",
    hotel_name_label: "Khách sạn đối tác:",
    pms_code_label: "Mã xác nhận phòng PMS:",
    btn_sign_pms: "✍️ Ký Số Cam Kết Phòng Cứng (HARD_COMMITTED)",
    btn_sim_overbook: "⚠️ Giả Lập Đối Tác Báo Hết Phòng (Phạt SLA 50% = 10 Triệu & Nâng Hạng 5 Sao)",
    ledger_title: "Sổ Cái Dòng Tiền VietQR Công Ty (escrow_payment_ledgers)",
  },

  en: {
    nav_concierge: "🧭 Planner & Concierge",
    nav_quiz: "🎯 Persona & eKYC Napas",
    nav_vietqr: "💳 Corporate VietQR",
    nav_scratch_refund: "🎟️ Scratch & Refund",
    nav_b2b_admin: "🏨 B2B Partner & Ledger",

    planner_hero_tag: "AI TRIP PLANNER BY BUDGET & DESTINATION",
    planner_title: "Enter Destination & Budget to Plan Your Ideal Trip",
    planner_subtitle: "Pick any destination or Blind Mode, enter your target budget. AI instantly calculates hotel, food, ticket allocations, and crafts 3 optimized time-slotted itineraries.",
    
    label_choose_dest: "1. Choose Your Destination:",
    label_input_budget: "2. Enter Target Budget (VND):",
    label_pax_duration: "3. Travelers & Duration:",
    btn_generate_plan: "🚀 AI Generate Itinerary & Optimize Budget Now",
    
    dest_hcm: "🏙️ Ho Chi Minh City (Vibrant Saigon)",
    dest_dalat: "🌲 Da Lat (Misty Pine Highlands)",
    dest_danang: "🌊 Da Nang & Hoi An (My Khe Beach & Old Town)",
    dest_blind: "🎲 Blind Map (WanderMatch AI Secret Pick)",
    
    pax_1: "1 Traveler (Solo)",
    pax_2: "2 Travelers (Couple/Friends)",
    pax_4: "Group of 4",
    pax_family: "Family (5-6 people)",
    dur_2d1n: "2 Days 1 Night",
    dur_3d2n: "3 Days 2 Nights",
    dur_4d3n: "4 Days 3 Nights",

    budget_breakdown_title: "📊 Smart AI Budget Allocation Breakdown:",
    alloc_hotel: "🏨 Hotel / Resort Stay (40%)",
    alloc_food: "🍜 Food & Dining (30%)",
    alloc_ticket: "🎡 Attractions & Tickets (20%)",
    alloc_contingency: "🚕 Transit & Contingency (10%)",

    concierge_title: "Welcome to",
    concierge_badge: "REAL-TIME ARRIVAL AI CONCIERGE",
    tab_itineraries: "📅 3 AI Time-Slotted Optimized Itineraries",
    tab_food_attraction: "🍜 Local Cuisine & Attractions with Transparent Prices",
    
    itinerary_btn_select: "✅ Select This Itinerary",
    itinerary_btn_selected: "🌟 Tracking This Itinerary Live",
    itinerary_cost_label: "Estimated ticket & dining cost:",
    
    filter_all: "All",
    filter_food: "🍜 Specialty Food",
    filter_attraction: "🎡 Attractions & Tickets",
    filter_cafe: "☕ Scenic Cafes & Chill",
    
    reviews_heading: "Verified Traveler Reviews",
    btn_view_write_review: "💬 View All & Write a Review",
    avg_price_label: "Average Cost:",
    address_label: "Address:",
    hours_label: "Hours:",
    
    modal_review_title: "Verified Guest Reviews",
    modal_write_title: "Share Your Experience (Post-Visit)",
    modal_rating_label: "Star Rating:",
    modal_verdict_label: "Quick Verdict Badge:",
    modal_spent_label: "Actual Spent Cost (VND):",
    modal_spent_ph: "e.g. 150000",
    modal_content_label: "Detailed Feedback:",
    modal_content_ph: "Tell others about taste, service, vibe, price...",
    modal_btn_submit: "🚀 Submit Review Now",
    modal_verified_tag: "Verified Traveler",
    
    quiz_title: "Travel Persona Quiz & Napas 247 Bank ID",
    quiz_subtitle: "Measure psychographic traits to unlock secret blind destination and link bank account for automated instant refund.",
    budget_title: "Or Select Preset Budget Tier:",
    package_std: "Smart Budget",
    package_prm: "Premium Experience (Recommended)",
    package_lux: "Luxury Retreat",
    ocr_card_title: "OCR Passport / National ID Extraction",
    ocr_verified_name: "Unaccented Full Name:",
    napas_title: "Refund Bank Account ID (Napas 247)",
    napas_btn_verify: "⚡ Verify Napas 247 Account",
    napas_matched: "✅ ACCOUNT NAME 100% MATCHES ID (ACTIVE_VERIFIED)",
    
    vietqr_title: "Corporate VietQR Payment Gateway",
    vietqr_subtitle: "Dynamic Corporate QR — Automatic Escrow Lock & SLA Guarantee",
    corp_name: "CONG TY CP CONG NGHE DU LICH WANDERMATCH",
    account_no: "Account: 990812348888 (MBBank)",
    order_code_label: "Order Code:",
    amount_label: "Locked Amount matching your entered budget:",
    escrow_step1_title: "1. Corporate Escrow Hold",
    escrow_step1_desc: "Funds held safely in WanderMatch escrow, not disbursed to partner yet.",
    escrow_step2_title: "2. Hard Room Commitment Lock",
    escrow_step2_desc: "B2B Hotel digitally signs commitment + 20,000,000 VND SLA guarantee fund.",
    escrow_step3_title: "3. Disburse Upon Check-in",
    escrow_step3_desc: "System automatically releases linked B2B payout to hotel upon arrival.",
    btn_sim_paid: "📲 Simulate Customer Paid VietQR (< 2s Webhook)",
    
    scratch_title: "Lounge, Scratch Card & 3-Tier Refund Engine",
    scratch_subtitle: "200% Anti-Overbooking SLA Guarantee • Transparent Conditional Refund",
    sla_badge: "HARD COMMITMENT #WM-HTL-8892 (200% NO-OVERBOOKING INSURANCE)",
    canvas_hint: "Use mouse or finger to scratch silver foil and reveal Destination & Hotel",
    scratch_progress: "Scratched:",
    revealed_btn: "🎉 Destination Revealed! Enter Smart Concierge",
    
    refund_calc_title: "Time-Tiered Cancellation & Refund Engine",
    tier_1_title: "Tier 1 (> 72h Before Departure)",
    tier_1_desc: "Room not hard committed yet. 10% fee, 90% auto refund to Napas account.",
    tier_2_title: "Tier 2 (24h - 72h Before Departure)",
    tier_2_desc: "Card not scratched. 35% fee (25% hotel compensation + 10% platform), 65% refund.",
    tier_3_title: "Tier 3 (< 24h or CARD SCRATCHED)",
    tier_3_desc: "Destination revealed. 100% fee, Refund = 0 VND (Anti-reveal abuse).",
    force_majeure_title: "Force Majeure Override Mechanism",
    force_a_btn: "🚨 Level A: Natural Disaster / Storm (100% Refund + 300K Voucher)",
    force_b_btn: "🏥 Level B: Medical Emergency (85% Bank Refund or 100% Wallet)",
    
    b2b_title: "B2B Hotel Partner Portal & Escrow Ledger",
    b2b_subtitle: "PMS Room confirmation signing & Automated 50% SLA penalty on overbooking.",
    hotel_name_label: "Partner Resort:",
    pms_code_label: "PMS Confirmation Code:",
    btn_sign_pms: "✍️ Digital Sign Hard Commitment (HARD_COMMITTED)",
    btn_sim_overbook: "⚠️ Simulate Overbooking Violation (Deduct 10M SLA Fund & Upgrade 5-Star)",
    ledger_title: "Corporate VietQR Escrow Ledger (escrow_payment_ledgers)",
  },

  ko: {
    nav_concierge: "🧭 여행 플래너 & 컨시어지",
    nav_quiz: "🎯 페르소나 & Napas eKYC",
    nav_vietqr: "💳 법인 VietQR 결제",
    nav_scratch_refund: "🎟️ 스크래치 카드 & 환불",
    nav_b2b_admin: "🏨 B2B 파트너 & 원장",

    planner_hero_tag: "예산 & 목적지 맞춤형 AI 여행 플래너",
    planner_title: "원하는 여행지와 예산을 입력하고 완벽한 일정을 생성하세요",
    planner_subtitle: "원하는 도시를 선택하거나 블라인드 모드를 선택한 후 예산을 입력하세요. AI가 숙소, 맛집, 티켓 비용을 최적화하고 시간대별 3대 일정을 완성합니다.",
    
    label_choose_dest: "1. 가고 싶은 여행지 선택:",
    label_input_budget: "2. 여행 예상 예산 입력 (VND):",
    label_pax_duration: "3. 인원 및 여행 기간:",
    btn_generate_plan: "🚀 AI 일정 생성 및 예산 최적화 실행",
    
    dest_hcm: "🏙️ 호치민시 (화려한 사이공)",
    dest_dalat: "🌲 달랏 (안개와 숲의 고원)",
    dest_danang: "🌊 다낭 & 호이안 (미케비치 & 구시가지)",
    dest_blind: "🎲 블라인드 맵 (WanderMatch AI 비밀 추천)",
    
    pax_1: "1인 (나홀로 여행)",
    pax_2: "2인 (커플/친구)",
    pax_4: "4인 단체",
    pax_family: "가족 여행 (5-6인)",
    dur_2d1n: "2박 1일",
    dur_3d2n: "3박 2일",
    dur_4d3n: "4박 3일",

    budget_breakdown_title: "📊 스마트 AI 예산 배분 내역:",
    alloc_hotel: "🏨 호텔/리조트 숙박 (40%)",
    alloc_food: "🍜 식도락 & 미식 (30%)",
    alloc_ticket: "🎡 관광 명소 & 입장권 (20%)",
    alloc_contingency: "🚕 교통비 및 예비비 (10%)",

    concierge_title: "환영합니다:",
    concierge_badge: "실시간 도착 AI 컨시어지",
    tab_itineraries: "📅 AI 시간대별 3대 최적화 추천 일정",
    tab_food_attraction: "🍜 대표 맛집 & 관광 명소 (투명한 가격 표시)",
    
    itinerary_btn_select: "✅ 이 일정으로 여행하기",
    itinerary_btn_selected: "🌟 현재 실시간 추적 중인 일정",
    itinerary_cost_label: "예상 입장료 및 식사비:",
    
    filter_all: "전체",
    filter_food: "🍜 대표 미식",
    filter_attraction: "🎡 관광 & 입장권",
    filter_cafe: "☕ 전망 카페 & 힐링",
    
    reviews_heading: "실제 방문자 검증 리뷰",
    btn_view_write_review: "💬 전체 리뷰 보기 & 작성하기",
    avg_price_label: "평균 비용:",
    address_label: "주소:",
    hours_label: "영업 시간:",
    
    modal_review_title: "실제 고객 검증 리뷰",
    modal_write_title: "방문 후기 작성하기 (인증 여행자)",
    modal_rating_label: "별점 평가:",
    modal_verdict_label: "요약 결론 배지:",
    modal_spent_label: "실제 지출 금액 (VND):",
    modal_spent_ph: "예: 150000",
    modal_content_label: "상세 후기:",
    modal_content_ph: "맛, 서비스, 분위기, 가격 등에 대해 남겨주세요...",
    modal_btn_submit: "🚀 리뷰 등록하기",
    modal_verified_tag: "인증된 여행자",
    
    quiz_title: "여행 페르소나 퀴즈 & Napas 247 계좌 인증",
    quiz_subtitle: "심리 축을 측정하여 블라인드 목적지를 매칭하고 자동 환불을 위한 계좌를 확인합니다.",
    budget_title: "또는 추천 정액 패키지 선택:",
    package_std: "스마트 실속형",
    package_prm: "프리미엄 체험 (추천)",
    package_lux: "럭셔리 힐링",
    ocr_card_title: "신분증 / 여권 OCR 추출",
    ocr_verified_name: "영문 성명:",
    napas_title: "환불 수령용 은행 계좌 (Napas 247)",
    napas_btn_verify: "⚡ Napas 247 실시간 인증",
    napas_matched: "✅ 신분증 이름과 100% 일치 (ACTIVE_VERIFIED)",
    
    vietqr_title: "WanderMatch 법인 VietQR 결제 게이트웨이",
    vietqr_subtitle: "동적 법인 QR 코드 — 안전 에스크로 락 & SLA 보증금 연동",
    corp_name: "CONG TY CP CONG NGHE DU LICH WANDERMATCH",
    account_no: "계좌: 990812348888 (MBBank)",
    order_code_label: "주문 번호:",
    amount_label: "입력하신 예산에 맞춘 확정 금액:",
    escrow_step1_title: "1. 법인 에스크로 보관",
    escrow_step1_desc: "결제 대금은 WanderMatch 에스크로 계좌에 안전하게 예치됩니다.",
    escrow_step2_title: "2. 확정 객실 보증 락",
    escrow_step2_desc: "B2B 파트너의 전자 서명 및 2천만동 SLA 보증금 연동.",
    escrow_step3_title: "3. 체크인 시 자동 정산",
    escrow_step3_desc: "고객 입실 확인 즉시 호텔 파트너 계좌로 자동 송금됩니다.",
    btn_sim_paid: "📲 고객 VietQR 결제 성공 시뮬레이션 (웹훅 < 2초)",
    
    scratch_title: "대기실, 스크래치 카드 & 3단계 취소 수수료 엔진",
    scratch_subtitle: "200% 오버부킹 방지 SLA 보증 • 투명한 조건부 환불 정책",
    sla_badge: "확정 객실 보증 #WM-HTL-8892 (오버부킹 200% 보상 보험)",
    canvas_hint: "은색 코팅을 긁어 목적지와 호텔을 확인하세요",
    scratch_progress: "스크래치 진행률:",
    revealed_btn: "🎉 여행지 오픈! 스마트 컨시어지 입장",
    
    refund_calc_title: "시간대별 자동 환불 수수료 계산기",
    tier_1_title: "1단계 (출발 72시간 전까지)",
    tier_1_desc: "객실 확정 전. 취소 수수료 10%, 90% 즉시 환불.",
    tier_2_title: "2단계 (출발 24~72시간 전)",
    tier_2_desc: "카드 미개봉. 수수료 35% (호텔 보상 25% + 플랫폼 10%), 65% 환불.",
    tier_3_title: "3단계 (출발 24시간 이내 또는 카드 개봉 시)",
    tier_3_desc: "목적지 노출 완료. 수수료 100%, 환불액 = 0 VND (악용 방지).",
    force_majeure_title: "불가항력 특례 면책 메커니즘",
    force_a_btn: "🚨 A등급: 태풍/천재지변 (100% 전액 환불 + 30만동 바우처)",
    force_b_btn: "🏥 B등급: 응급 입원/의료 비상 (85% 계좌 환불 또는 100% 월렛)",
    
    b2b_title: "B2B 호텔 파트너 포털 & 에스크로 원장",
    b2b_subtitle: "PMS 예약 확정 서명 및 오버부킹 시 50% SLA 보증금 자동 차감 페널티.",
    hotel_name_label: "파트너 리조트:",
    pms_code_label: "PMS 확정 번호:",
    btn_sign_pms: "✍️ 객실 확정 전자 서명 (HARD_COMMITTED)",
    btn_sim_overbook: "⚠️ 오버부킹 발생 시뮬레이션 (SLA 1,000만동 차감 & 5성급 업그레이드)",
    ledger_title: "법인 VietQR 에스크로 원장 (escrow_payment_ledgers)",
  },

  ja: {
    nav_concierge: "🧭 旅程プランナー＆コンシェルジュ",
    nav_quiz: "🎯 ペルソナ & Napas eKYC",
    nav_vietqr: "💳 法人VietQR決済",
    nav_scratch_refund: "🎟️ スクラッチ＆返金規定",
    nav_b2b_admin: "🏨 B2Bパートナー＆台帳",

    planner_hero_tag: "予算＆目的地から作るAI旅行プランナー",
    planner_title: "希望の目的地と予算を入力して最適な旅行プランを作成",
    planner_subtitle: "目的地またはブラインドモードを選択し、予算を入力するだけ。AIがホテル、グルメ、チケット代を自動配分し、時間帯別の旅程3選を即時生成します。",
    
    label_choose_dest: "1. 行きたい目的地を選択:",
    label_input_budget: "2. 予定予算を入力 (VND):",
    label_pax_duration: "3. 人数＆滞在日数:",
    btn_generate_plan: "🚀 AI旅行プラン生成＆予算最適化を実行",
    
    dest_hcm: "🏙️ ホーチミン市 (活気あふれるサイゴン)",
    dest_dalat: "🌲 ダラット (霧と松林の高原)",
    dest_danang: "🌊 ダナン＆ホイアン (美しきミーケビーチと古都)",
    dest_blind: "🎲 ブラインドマップ (AIおまかせサプライズ)",
    
    pax_1: "1名 (一人旅)",
    pax_2: "2名 (カップル/友人)",
    pax_4: "4名グループ",
    pax_family: "家族旅行 (5-6名)",
    dur_2d1n: "2泊1日",
    dur_3d2n: "3泊2日",
    dur_4d3n: "4泊3日",

    budget_breakdown_title: "📊 スマートAI予算配分内訳:",
    alloc_hotel: "🏨 ホテル/リゾート宿泊 (40%)",
    alloc_food: "🍜 グルメ・食事 (30%)",
    alloc_ticket: "🎡 観光アトラクション＆入場料 (20%)",
    alloc_contingency: "🚕 市内移動＆予備費 (10%)",

    concierge_title: "ようこそ",
    concierge_badge: "リアルタイム到着AIコンシェルジュ",
    tab_itineraries: "📅 AI時間帯別おすすめ最適旅程3選",
    tab_food_attraction: "🍜 郷土グルメ＆観光スポット (明瞭な料金表示)",
    
    itinerary_btn_select: "✅ この旅程で旅をする",
    itinerary_btn_selected: "🌟 現在追跡中の旅程",
    itinerary_cost_label: "自己負担予定費用 (入場料・飲食費):",
    
    filter_all: "すべて",
    filter_food: "🍜 特選郷土グルメ",
    filter_attraction: "🎡 観光・アトラクション",
    filter_cafe: "☕ 絶景カフェ＆チル",
    
    reviews_heading: "認証済み旅行者のクチコミ",
    btn_view_write_review: "💬 全レビュー閲覧・クチコミ投稿",
    avg_price_label: "平均費用:",
    address_label: "住所:",
    hours_label: "営業時間:",
    
    modal_review_title: "認証済みゲストの口コミ一覧",
    modal_write_title: "体験談を投稿する（訪問済みの方）",
    modal_rating_label: "評価スター:",
    modal_verdict_label: "結論バッジ:",
    modal_spent_label: "実際の支出額 (VND):",
    modal_spent_ph: "例: 150000",
    modal_content_label: "詳しい感想:",
    modal_content_ph: "味、接客、雰囲気、価格について教えてください...",
    modal_btn_submit: "🚀 レビューを送信する",
    modal_verified_tag: "認証済み旅行者",
    
    quiz_title: "トラベルペルソナ診断 & Napas 247 口座認証",
    quiz_subtitle: "旅行心理軸を測定して秘密の目的地をマッチングし、自動返金用の銀行口座を検証します。",
    budget_title: "またはおすすめ固定パッケージを選択:",
    package_std: "スマート節約プラン",
    package_prm: "プレミアム体験プラン (おすすめ)",
    package_lux: "ラグジュアリー癒やしプラン",
    ocr_card_title: "身分証 / パスポート OCR抽出",
    ocr_verified_name: "アルファベット氏名:",
    napas_title: "返金受取口座 (Napas 247)",
    napas_btn_verify: "⚡ Napas 247 即時口座照会",
    napas_matched: "✅ 身分証明書氏名と100%一致 (ACTIVE_VERIFIED)",
    
    vietqr_title: "WanderMatch 法人VietQR決済ゲートウェイ",
    vietqr_subtitle: "動的法人QRコード — 自動エスクロー留保＆SLA保証金連動",
    corp_name: "CONG TY CP CONG NGHE DU LICH WANDERMATCH",
    account_no: "口座: 990812348888 (MBBank)",
    order_code_label: "注文コード:",
    amount_label: "入力予算と連動した確定金額:",
    escrow_step1_title: "1. 法人エスクロー保管",
    escrow_step1_desc: "代金はWanderMatchのエスクロー口座に安全に保管されます。",
    escrow_step2_title: "2. 厳格な客室確約ロック",
    escrow_step2_desc: "B2B提携ホテルの電子署名と2,000万VNDのSLA保証金。",
    escrow_step3_title: "3. チェックイン時自動送金",
    escrow_step3_desc: "到着確認後、システムが自動的にホテルへ送金します。",
    btn_sim_paid: "📲 QR支払い完了をシミュレート (Webhook < 2秒)",
    
    scratch_title: "待合ラウンジ、スクラッチカード＆3区分返金計算機",
    scratch_subtitle: "オーバーブッキング200%補償SLA保証 • 透明な条件付き返金規定",
    sla_badge: "客室確約コミットメント #WM-HTL-8892 (200%保険付き)",
    canvas_hint: "銀色のコーティングを削って目的地とホテルを明かしてください",
    scratch_progress: "スクラッチ進行状況:",
    revealed_btn: "🎉 目的地解除！スマートコンシェルジュへ",
    
    refund_calc_title: "時間区分別自動返金計算エンジン",
    tier_1_title: "区分1 (出発72時間前まで)",
    tier_1_desc: "客室確約前。取消手数料10%、90%をNapas口座へ自動返金。",
    tier_2_title: "区分2 (出発24〜72時間前)",
    tier_2_desc: "カード未削り。手数料35% (ホテル補償25% + 運営費10%)、65%返金。",
    tier_3_title: "区分3 (出発24時間以内またはカード削り済)",
    tier_3_desc: "目的地公開済み。手数料100%、返金額 = 0 VND (不正防止)。",
    force_majeure_title: "不可抗力免責オーバーライド機能",
    force_a_btn: "🚨 レベルA: 台風・自然災害 (100%全額返金 + 30万VNDクーポン)",
    force_b_btn: "🏥 レベルB: 緊急医療・入院 (85%口座返金 または 100%ウォレット残高)",
    
    b2b_title: "B2Bホテルポータル＆エスクロー台帳",
    b2b_subtitle: "PMS客室予約確約の電子署名およびオーバーブッキング時の50%SLAペナルティ連動。",
    hotel_name_label: "提携リゾート:",
    pms_code_label: "PMS予約確約番号:",
    btn_sign_pms: "✍️ 客室確約電子署名 (HARD_COMMITTED)",
    btn_sim_overbook: "⚠️ 満室違反シミュレーション (SLA1,000万VND没収＆5つ星アップグレード)",
    ledger_title: "法人VietQRエスクロー台帳 (escrow_payment_ledgers)",
  }
};

// ============================================================================
// 2. STATE STORE & DATA OBJECTS
// ============================================================================
const state = {
  currentLang: 'vi',
  currentTab: 'concierge', // 'concierge' | 'quiz' | 'vietqr' | 'scratch' | 'b2b'
  selectedDestination: 'hochiminh', // 'hochiminh' | 'dalat' | 'danang' | 'blind'
  selectedBudget: 5000000, // Custom user budget in VND
  selectedPax: 2,
  selectedDuration: '3d2n',
  selectedPackageKey: 'CUSTOM_BUDGET',
  orderCode: 'WM99081234',
  isNapasVerified: true,
  isPaid: true,
  isScratchedRevealed: true,
  activeItineraryId: 1,
  poiCategoryFilter: 'ALL',
  activeModalPoiId: null,
  activeModalRating: 5,
  slaDepositBalance: 20000000,
  partnerSigned: true,
  isOverbookPenalized: false,
  activeDayTab: 1,

  // Pragmatic Consumer Pillars (v3.1)
  comfortLocks: {
    noRedEye: true,
    bedType: 'TWIN',
    luggageShuttle: true,
    workcation: false
  },
  paymentMode: 'INDIVIDUAL', // 'INDIVIDUAL' | 'GROUP'
  groupBooking: {
    groupCode: 'G8892',
    membersCount: 4,
    totalBudget: 16000000,
    amountPerMember: 4000000,
    paidCount: 1,
    members: []
  },
  offlineWallet: {
    pnr: 'VN-9920-WM',
    hotelCode: 'HTL-CONF-8892',
    departTime: '07:30 Sáng (Ga Quốc Nội)'
  },
  sosClaimed: false
};

// DỮ LIỆU ĐIỂM ĐẾN CHI TIẾT (TP. HỒ CHÍ MINH, ĐÀ LẠT, ĐÀ NẴNG)
const DESTINATION_DATA = {
  hochiminh: {
    name: {
      vi: "TP. Hồ Chí Minh (Sài Gòn)",
      en: "Ho Chi Minh City (Saigon)",
      ko: "호치민시 (사이공)",
      ja: "ホーチミン市 (サイゴン)"
    },
    heroImg: "https://images.unsplash.com/photo-1583417319070-4a69db38a482?auto=format&fit=crop&w=1600&q=80",
    weather: {
      vi: "TP.HCM 29°C • Nắng nhẹ, chiều lộng gió sông • Lý tưởng dạo phố & ẩm thực đêm",
      en: "HCMC 29°C • Gentle breeze along Saigon River • Perfect for street food & nightlife",
      ko: "호치민 29°C • 사이공 강변의 산들바람 • 미식 탐방과 야경 감상에 최적",
      ja: "ホーチミン 29°C • サイゴン川の心地よい風 • グルメ巡りと夜景散策に最適"
    },
    hotel: {
      vi: "The Reverie Saigon / Khách sạn Caravelle (Quận 1)",
      en: "The Reverie Saigon / Caravelle Hotel (District 1)",
      ko: "더 리베리 사이공 / 카라벨 호텔 (1군)",
      ja: "ザ・レベリー・サイゴン / カラヴェルホテル (1区)"
    },
    itineraries: [
      {
        id: 1,
        persona_focus: "HERITAGE_CULTURE",
        title: {
          vi: "Lịch trình 1: Sài Gòn Di Sản, Cà Phê Chung Cư & Hoàng Hôn Waterbus",
          en: "Itinerary 1: Saigon Heritage, Vintage Apartment Cafes & Sunset Waterbus",
          ko: "일정 1: 사이공 역사 유산, 빈티지 아파트 카페 & 선셋 워터버스",
          ja: "旅程1: 歴史遺産、ヴィンテージアパートカフェ＆夕暮れウォーターバス"
        },
        tagline: {
          vi: "Dành cho người yêu kiến trúc Đông Dương, nhịp sống Sài Gòn hoa lệ và ngắm hoàng hôn trên sông.",
          en: "For lovers of French Indochine architecture, bustling Saigon vibes, and sunset river views.",
          ko: "인도차이나 건축 양식과 활기찬 사이공의 강변 일몰을 감상하는 코스.",
          ja: "フランス領インドシナ建築の優美さと夕暮れのサイゴン川クルーズを楽しむ旅程。"
        },
        slots: [
          {
            time: "07:30 - 09:00",
            poi_name: {
              vi: "Cơm Tấm Ba Ghiền (Phú Nhuận)",
              en: "Ba Ghien Broken Rice (Michelin Bib Gourmand)",
              ko: "바기엔 껌승 (미슐랭 빕구르망)",
              ja: "バ・ギエン コムタム（ミシュラン・ビブグルマン）"
            },
            activity: {
              vi: "Thưởng thức đĩa cơm tấm sườn nướng khổng lồ ướp mật ong đậm đà nướng than hồng trứ danh.",
              en: "Savor the legendary giant honey-marinated pork chop broken rice fresh off charcoal grills.",
              ko: "숯불 향 가득한 특대형 양념 돼지갈비 덮밥으로 든든한 아침 식사.",
              ja: "炭火で香ばしく焼き上げた特大ポークチョップが乗った名物コムタムの朝食。"
            },
            cost_est: "90.000đ",
            img: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80",
            tips: {
              vi: "Nên gọi thêm bì chả và chén mỡ hành tóp mỡ giòn rụm.",
              en: "Ask for extra crispy pork cracklings with scallion oil.",
              ko: "바삭한 돼지껍질 튀김과 파기름을 곁들이면 맛이 배가됩니다.",
              ja: "カリカリの豚脂とネギ油を追加するとさらに美味しく楽しめます。"
            }
          },
          {
            time: "09:30 - 11:45",
            poi_name: {
              vi: "Dinh Độc Lập & Bưu Điện Trung Tâm Sài Gòn",
              en: "Independence Palace & Saigon Central Post Office",
              ko: "통일궁 & 사이공 중앙 우체국",
              ja: "統一会堂＆サイゴン中央郵便局"
            },
            activity: {
              vi: "Chiêm ngưỡng kiệt tác kiến trúc hiện đại nhiệt đới của KTS Ngô Viết Thụ và bưu điện mái vòm cổ kính.",
              en: "Admire mid-century modernist tropical architecture and Gustave Eiffel's vaulted post office.",
              ko: "역사적인 통일궁의 웅장한 건축과 에펠이 설계한 고풍스러운 우체국 관람.",
              ja: "歴史的モダニズム建築の統一会堂とエッフェル設計の美しいアーチ屋根郵便局。"
            },
            cost_est: "65.000đ",
            img: "https://images.unsplash.com/photo-1590523741831-ab7e8b8f9c7f?auto=format&fit=crop&w=600&q=80",
            tips: {
              vi: "Có thể gửi bưu thiếp tay từ bưu điện về nhà làm kỷ niệm.",
              en: "Send a vintage handwritten postcard home right from the historic counters.",
              ko: "우체국 창구에서 기념 엽서를 직접 작성해 발송해보세요.",
              ja: "歴史ある郵便局の窓口から手書きの絵葉書を送るのも素敵な記念になります。"
            }
          },
          {
            time: "14:00 - 16:30",
            poi_name: {
              vi: "Chung Cư Cà Phê 42 Nguyễn Huệ",
              en: "The Cafe Apartments (42 Nguyen Hue)",
              ko: "42 응우옌후에 카페 아파트",
              ja: "42番グエンフエ・カフェアパート"
            },
            activity: {
              vi: "Khám phá mê cung các tiệm cà phê indie độc đáo và ban công ngắm nhìn trọn vẹn phố đi bộ.",
              en: "Explore a multi-story labyrinth of boutique indie cafes overlooking the bustling pedestrian promenade.",
              ko: "보행자 거리가 한눈에 내려다보이는 개성 넘치는 인디 카페 미로 탐방.",
              ja: "歩行者天国を一望できる個性豊かなカフェが集まるユニークなレトロアパート。"
            },
            cost_est: "75.000đ",
            img: "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=600&q=80",
            tips: {
              vi: "Đi thang bộ giữa các tầng để chụp các góc cầu thang retro cực chất.",
              en: "Take the stairs between floors to capture authentic vintage vibes.",
              ko: "계단을 이용해 층간을 이동하면 레트로한 인생샷을 찍기 좋습니다.",
              ja: "階段を使って移動すると味わい深いレトロな写真スポットがたくさん見つかります。"
            }
          },
          {
            time: "17:15 - 19:30",
            poi_name: {
              vi: "Saigon Waterbus Bến Bạch Đằng & Ngắm Hoàng Hôn",
              en: "Saigon River Waterbus from Bach Dang Pier",
              ko: "바흐당 부두 사이공 수상버스 일몰 투어",
              ja: "バクダン埠頭発サイゴン川ウォーターバス夕暮れクルーズ"
            },
            activity: {
              vi: "Lướt trên sóng sông Sài Gòn ngắm hoàng hôn nhuộm vàng các tòa nhà chọc trời và cầu Ba Son.",
              en: "Cruise along the river as golden sunset glitters across modern skyscrapers and Ba Son Bridge.",
              ko: "황금빛 노을에 물드는 바손 다리와 랜드마크 스카이라인을 감상하는 수상버스.",
              ja: "近代的な高層ビル群とバーソン橋が夕日に染まる絶景リバークルーズ。"
            },
            cost_est: "30.000đ",
            img: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=600&q=80",
            tips: {
              vi: "Chọn chuyến xuất bến lúc 17h15 để vừa kịp đón hoàng hôn đẹp nhất.",
              en: "Board the 5:15 PM departure for the prime sunset lighting.",
              ko: "오후 5시 15분 출발 편을 탑승해야 가장 완벽한 일몰을 만날 수 있습니다.",
              ja: "午後5時15分発の便に乗ると最高の夕暮れの光に出会えます。"
            }
          }
        ]
      },
      {
        id: 2,
        persona_focus: "STREET_FOOD_NIGHT",
        title: {
          vi: "Lịch trình 2: Khám Phá Ẩm Thực Chợ Lớn & Sài Gòn Về Đêm",
          en: "Itinerary 2: Cho Lon Heritage Chinatown & Vibrant Night Street Food",
          ko: "일정 2: 쩌런 차이나타운 미식 & 활기찬 사이공 야간 탐방",
          ja: "旅程2: チョロン中華街グルメ＆活気あふれるサイゴンの夜"
        },
        tagline: {
          vi: "Dành cho tín đồ ẩm thực đường phố, há cảo Chợ Lớn, ốc Sài Gòn và rooftop chill ngắm Landmark 81.",
          en: "For foodie adventurers: Chinatown dumplings, spicy shellfish alleys, and rooftop skyline lounges.",
          ko: "차이나타운 딤섬, 매콤한 해산물 골목, 루프탑 야경을 즐기는 식도락 나이트 투어.",
          ja: "絶品飲茶、熱々の屋台海鮮料理、夜景を楽しむルーフトップバーを満喫。"
        },
        slots: [
          {
            time: "10:00 - 12:30",
            poi_name: {
              vi: "Hủ Tiếu Mì Thiệu Ký & Chùa Bà Thiên Hậu (Quận 5)",
              en: "Thieu Ky Traditional Noodle & Ba Thien Hau Temple",
              ko: "티에우 끼 정통 에그누들 & 천후궁",
              ja: "ティエウ・キー伝統手打ち麺＆天后宮"
            },
            activity: {
              vi: "Thưởng thức mì tươi kéo tay hơn 70 năm và chiêm ngưỡng kiến trúc nhang vòng huyền bí.",
              en: "Taste 70-year handmade fresh egg noodles and marvel at giant spiral incense coils in the historic temple.",
              ko: "70년 전통의 수제 에그누들과 나선형 향이 피어오르는 유서 깊은 사원 탐방.",
              ja: "70年の歴史を持つ手打ち麺と巨大な渦巻き線香が幻想的な古寺を参拝。"
            },
            cost_est: "85.000đ",
            img: "https://images.unsplash.com/photo-1547928576-a4a33237cbc3?auto=format&fit=crop&w=600&q=80",
            tips: {
              vi: "Gọi tô mì thập cẩm có xá xíu, sườn mềm và tóp mỡ thơm béo.",
              en: "Order the signature combo bowl with char siu pork and tender ribs.",
              ko: "부드러운 차슈와 갈비가 푸짐하게 들어간 모둠 국수를 추천합니다.",
              ja: "自家製チャーシューと柔らかいリブが入った特製ミックス麺が絶品。"
            }
          },
          {
            time: "18:00 - 20:30",
            poi_name: {
              vi: "Hẻm Ốc Đào Nguyễn Trãi (Quận 1)",
              en: "Oc Dao Shellfish Alley (District 1)",
              ko: "옥 다오 해산물 골목 (1군)",
              ja: "オック・ダオ 海鮮路地（1区）"
            },
            activity: {
              vi: "Thưởng thức ốc hương xào bơ tỏi bánh mì, càng ghẹ rang muối kéo sợi cay nồng chuẩn phong cách Sài Gòn.",
              en: "Feast on sweet snails sautéed in rich garlic butter with crispy baguettes and chili salt crab claws.",
              ko: "마늘 버터 향이 가득한 소라 요리와 바삭한 바게트, 매콤한 게살 요리의 향연.",
              ja: "ガーリックバターで炒めた巻貝にフランスパンを浸して味わう本場サイゴンスタイル。"
            },
            cost_est: "180.000đ",
            img: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=600&q=80",
            tips: {
              vi: "Nước xốt bơ tỏi chấm bánh mì nóng là món không thể bỏ qua.",
              en: "Dip hot crispy baguettes directly into the rich garlic butter sauce.",
              ko: "마늘 버터 소스에 바삭한 빵을 찍어 먹는 것은 필수 코스입니다.",
              ja: "濃厚なガーリックバターソースに熱々のバゲットをつけて食べるのが醍醐味。"
            }
          }
        ]
      },
      {
        id: 3,
        persona_focus: "MODERN_SKYLINE",
        title: {
          vi: "Lịch trình 3: Chinh Phục Landmark 81 & Du Thuyền Sông Sài Gòn",
          en: "Itinerary 3: Landmark 81 SkyView & Luxury Saigon River Cruise",
          ko: "일정 3: 랜드마크 81 스카이뷰 & 럭셔리 사이공 리버 디너 크루즈",
          ja: "旅程3: ランドマーク81展望台＆サイゴン川ラグジュアリーディナークルーズ"
        },
        tagline: {
          vi: "Trải nghiệm đỉnh cao độ cao 461m ngắm toàn cảnh thành phố và thưởng thức bữa tối lãng mạn trên du thuyền.",
          en: "Top of Vietnam at 461m height with 360 panoramic views followed by romantic river dinner cruise.",
          ko: "해발 461m에서 내려다보는 파노라마 야경과 낭만적인 리버 디너 크루즈 체험.",
          ja: "高さ461mからの360度大パノラマ夜景とロマンチックなディナークルーズ。"
        },
        slots: [
          {
            time: "16:00 - 18:30",
            poi_name: {
              vi: "Đài Quan Sát Landmark 81 SkyView (Tầng 79 - 81)",
              en: "Landmark 81 SkyView Observatory",
              ko: "랜드마크 81 스카이뷰 전망대 (79~81층)",
              ja: "ランドマーク81 スカイビュー展望台 (79-81階)"
            },
            activity: {
              vi: "Đi thang máy tốc độ cao lên đỉnh tòa nhà cao nhất Việt Nam, ngắm toàn cảnh khúc quanh sông Sài Gòn.",
              en: "Ride high-speed elevators to the top of Vietnam's tallest skyscraper with VR sky-dive simulation.",
              ko: "베트남 최고층 빌딩 정상에서 구름 위를 걷는 듯한 유리 바닥 전망대 체험.",
              ja: "ベトナム最高峰の超高層展望台からサイゴン川の雄大な蛇行と街並みを一望。"
            },
            cost_est: "350.000đ",
            img: "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?auto=format&fit=crop&w=600&q=80",
            tips: {
              vi: "Lên lúc 16h30 để ngắm được cả cảnh ban ngày lẫn khoảnh khắc thành phố lên đèn.",
              en: "Arrive around 4:30 PM to catch daylight, sunset, and night lights all at once.",
              ko: "오후 4시 30분쯤 입장하면 낮과 일몰, 화려한 야경을 모두 감상할 수 있습니다.",
              ja: "午後4時半頃に入場すると、昼景、夕暮れ、夜景のすべてを堪能できます。"
            }
          },
          {
            time: "19:00 - 21:30",
            poi_name: {
              vi: "Du Thuyền Sông Sài Gòn & Thưởng Thức Hải Sản",
              en: "Saigon Princess River Dining Cruise",
              ko: "사이공 프린세스 리버 디너 크루즈",
              ja: "サイゴンプリンセス ディナークルーズ"
            },
            activity: {
              vi: "Dùng bữa tối 4 món fine-dining, nghe nhạc acoustic live khi du thuyền trôi êm ả qua cầu Thủ Thiêm.",
              en: "Indulge in a 4-course dinner with live acoustic saxophone gliding gently along the illuminated city shores.",
              ko: "라이브 색소폰 연주와 함께 즐기는 4코스 정찬과 눈부신 수변 야경.",
              ja: "生演奏のサックスに耳を傾けながら楽しむ優雅なコースディナーと水辺の夜景。"
            },
            cost_est: "650.000đ",
            img: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=600&q=80",
            tips: {
              vi: "Nên đặt bàn ngoài trời tầng thượng để có góc nhìn thoáng đãng nhất.",
              en: "Reserve an outdoor rooftop sundeck table for the most scenic open breeze.",
              ko: "탁 트인 시야를 위해 야외 루프탑 데크 좌석 예약을 권장합니다.",
              ja: "心地よい夜風を感じられる最上階オープンデッキ席がおすすめです。"
            }
          }
        ]
      }
    ],
    pois: [
      {
        id: "poi-hcm-1",
        category: "SPECIALTY_FOOD",
        name: {
          vi: "Cơm Tấm Ba Ghiền (Sườn Cốt Lết Khổng Lồ)",
          en: "Ba Ghien Broken Rice (Michelin Bib Gourmand)",
          ko: "바기엔 껌승 (미슐랭 빕구르망 대형 갈비)",
          ja: "バ・ギエン コムタム（特大骨付きポーク）"
        },
        address: "84 Đặng Văn Ngữ, Phường 10, Quận Phú Nhuận, TP.HCM",
        hours: "06:30 - 21:30 hàng ngày",
        costDisplay: {
          vi: "75.000đ - 110.000đ / dĩa đầy đặn",
          en: "75,000 - 110,000 VND / hearty plate",
          ko: "75,000 - 110,000 VND / 1인분",
          ja: "75,000 - 110,000 VND / 1皿"
        },
        img: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80",
        description: {
          vi: "Quán cơm tấm đạt danh hiệu Michelin Bib Gourmand với miếng sườn cốt lết dày to che kín đĩa cơm, ướp mật ong và nướng xém cạnh trên bếp than thơm nức cả con phố.",
          en: "Michelin Bib Gourmand broken rice spot famous for massive honey-glazed pork chops cooked to smoky perfection over open charcoal.",
          ko: "접시를 가득 채우는 꿀 양념 숯불 돼지갈비로 미슐랭 빕구르망에 선정된 사이공 대표 맛집.",
          ja: "皿を覆い尽くすほどの特大ハニーポークチョップが自慢のミシュラン選定コムタム名店。"
        },
        rating: 4.88,
        reviewsCount: 612,
        verdictBadge: "VERY_WORTH_IT",
        reviews: [
          {
            id: "rev-hcm-101",
            author: "Lê Hoàng Tuấn (Quận 3)",
            rating: 5,
            date: "2026-10-18",
            spent: "95.000đ",
            verdict: "VERY_WORTH_IT",
            content: "Miếng sườn to khủng khiếp, ướp đậm đà mềm mọng không bị khô. Nước mắm sánh kẹo chuẩn vị Sài Gòn. Xứng đáng từng đồng!"
          },
          {
            id: "rev-hcm-102",
            author: "Markus Bauer (Germany)",
            rating: 5,
            date: "2026-10-14",
            spent: "100.000đ",
            verdict: "TASTY_FAIR_PRICE",
            content: "Incredible pork chop! Smoky, sweet and juicy. Big portions and fast service."
          }
        ]
      },
      {
        id: "poi-hcm-2",
        category: "ATTRACTION_TICKET",
        name: {
          vi: "Saigon Waterbus (Bến Bạch Đằng ⇌ Bến Bình An)",
          en: "Saigon River Waterbus Scenic Ride",
          ko: "사이공 수상버스 (바흐당 ⇌ 빈안 부두)",
          ja: "サイゴン川ウォーターバス (バクダン ⇌ ビンアン)"
        },
        address: "Bến Bạch Đằng, Số 10B Tôn Đức Thắng, Phường Bến Nghé, Quận 1",
        hours: "07:00 - 19:30 (Chuyến cách nhau 30-45 phút)",
        costDisplay: {
          vi: "Vé: 15.000đ / lượt (30.000đ khứ hồi)",
          en: "Ticket: 15,000 VND / way (30,000 VND roundtrip)",
          ko: "티켓: 15,000 VND / 편도 (왕복 30,000 VND)",
          ja: "運賃: 15,000 VND / 片道 (往復 30,000 VND)"
        },
        img: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800&q=80",
        description: {
          vi: "Tuyến xe buýt đường sông ngắm nhìn toàn cảnh thành phố từ góc nhìn lộng gió sông Sài Gòn, đi qua cầu Thủ Thiêm, bến du thuyền và ngắm Landmark 81 sừng sững.",
          en: "A refreshing scenic water transit cruising past iconic riverside landmarks, modern bridges, and the soaring Landmark 81 tower.",
          ko: "사이공 강을 따라 현대적인 마천루와 투티엠 다리를 감상할 수 있는 가장 가성비 뛰어난 수상 대중교통.",
          ja: "サイゴン川からの心地よい風を受けながら、近代的な橋や高層ビル群を一望できる絶景リバーバス。"
        },
        rating: 4.92,
        reviewsCount: 780,
        verdictBadge: "VERY_WORTH_IT",
        reviews: [
          {
            id: "rev-hcm-201",
            author: "Nguyễn Thảo My",
            rating: 5,
            date: "2026-10-19",
            spent: "30.000đ",
            verdict: "VERY_WORTH_IT",
            content: "Có 30k khứ hồi mà ngắm cảnh sông Sài Gòn bao chill. Đi chuyến chiều 17h15 ngắm hoàng hôn và Landmark 81 lên đèn đẹp mê mẩn."
          }
        ]
      },
      {
        id: "poi-hcm-3",
        category: "ATTRACTION_TICKET",
        name: {
          vi: "Đài Quan Sát Landmark 81 SkyView (Tầng 81)",
          en: "Landmark 81 SkyView Observatory",
          ko: "랜드마크 81 스카이뷰 전망대",
          ja: "ランドマーク81 スカイビュー展望台"
        },
        address: "720A Điện Biên Phủ, Phường 22, Quận Bình Thạnh, TP.HCM",
        hours: "09:30 - 22:00",
        costDisplay: {
          vi: "Vé: 300.000đ - 420.000đ / người lớn",
          en: "Ticket: 300,000 - 420,000 VND / adult",
          ko: "티켓: 300,000 - 420,000 VND / 성인",
          ja: "入場料: 300,000 - 420,000 VND / 大人"
        },
        img: "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?auto=format&fit=crop&w=800&q=80",
        description: {
          vi: "Đài quan sát cao nhất Việt Nam và Đông Nam Á. Trải nghiệm cầu kính SkyTouch ngắm 360 độ thành phố dưới chân và trò chơi thực tế ảo nhảy dù VR đỉnh cao.",
          en: "Southeast Asia's pinnacle observation deck offering 360-degree vistas, transparent cantilever skywalk, and immersive VR thrills.",
          ko: "동남아 최고층 전망대에서 즐기는 360도 스카이뷰와 유리 바닥 스카이워크.",
          ja: "東南アジア屈指の高さを誇る展望台。足元に広がる360度の大パノラマと空中ガラスウォーク。"
        },
        rating: 4.85,
        reviewsCount: 520,
        verdictBadge: "VERY_WORTH_IT",
        reviews: [
          {
            id: "rev-hcm-301",
            author: "Trần Đăng Khoa",
            rating: 5,
            date: "2026-10-15",
            spent: "420.000đ",
            verdict: "VERY_WORTH_IT",
            content: "Tầm nhìn bao quát toàn bộ Sài Gòn, thấy rõ khúc cong sông Sài Gòn uốn lượn. Vé hơi cao một chút nhưng rất đáng trải nghiệm một lần."
          }
        ]
      },
      {
        id: "poi-hcm-4",
        category: "SPECIALTY_FOOD",
        name: {
          vi: "Ốc Đào Nguyễn Trãi (Hải Sản Sốt Bơ Tỏi Bánh Mì)",
          en: "Oc Dao Seafood & Garlic Butter Snails",
          ko: "옥 다오 해산물 & 갈릭 버터 소라",
          ja: "オック・ダオ 海鮮＆ガーリックバター巻貝"
        },
        address: "Hẻm 212B Nguyễn Trãi, Phường Nguyễn Cư Trinh, Quận 1, TP.HCM",
        hours: "10:30 - 22:00",
        costDisplay: {
          vi: "120.000đ - 220.000đ / người (Ăn no nê)",
          en: "120,000 - 220,000 VND / person",
          ko: "120,000 - 220,000 VND / 1인",
          ja: "120,000 - 220,000 VND / 1人"
        },
        img: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=800&q=80",
        description: {
          vi: "Quán ốc huyền thoại đất Sài Thành với hơn 30 loại ốc tươi sống chế biến sốt bơ tỏi, rang muối ớt, nướng tiêu xanh. Nước xốt chấm bánh mì nóng giòn ăn là ghiền.",
          en: "Legendary Saigon snail institution serving over 30 varieties of fresh shellfish drenched in mouthwatering garlic butter and chili salt.",
          ko: "30여 종의 신선한 조개와 소라를 진한 갈릭 버터 소스와 함께 즐기는 사이공 현지인들의 소울푸드.",
          ja: "30種類以上の新鮮な貝料理を濃厚なガーリックバターやチリソルトで香ばしく仕上げる名店。"
        },
        rating: 4.82,
        reviewsCount: 440,
        verdictBadge: "TASTY_FAIR_PRICE",
        reviews: [
          {
            id: "rev-hcm-401",
            author: "Phan Ánh Nguyệt",
            rating: 5,
            date: "2026-10-17",
            spent: "180.000đ",
            verdict: "TASTY_FAIR_PRICE",
            content: "Nước bơ tỏi ở đây ngon nhất Sài Gòn, gọi 2 ổ bánh mì chấm sạch bách đĩa. Ốc hương tươi giòn sần sật."
          }
        ]
      },
      {
        id: "poi-hcm-5",
        category: "CAFE_SUNSET_CHILL",
        name: {
          vi: "Chung Cư Cà Phê 42 Nguyễn Huệ (Partea / Saigon Oi)",
          en: "The Cafe Apartments (42 Nguyen Hue)",
          ko: "42 응우옌후에 카페 아파트 (사이공 오이)",
          ja: "42番グエンフエ カフェアパート"
        },
        address: "42 Nguyễn Huệ, Phường Bến Nghé, Quận 1, TP.HCM",
        hours: "08:00 - 22:30",
        costDisplay: {
          vi: "55.000đ - 90.000đ / ly nước",
          en: "55,000 - 90,000 VND / drink",
          ko: "55,000 - 90,000 VND / 음료 1잔",
          ja: "55,000 - 90,000 VND / 1杯"
        },
        img: "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=800&q=80",
        description: {
          vi: "Tòa chung cư 9 tầng xây dựng từ những năm 1960 được tái sinh thành thiên đường các quán cà phê indie, tiệm trà phong cách Anh và góc ban công ngắm nhìn phố đi bộ lộng lẫy.",
          en: "A 1960s vintage apartment complex reinvented into an iconic mosaic of indie cafes and artisan boutiques overlooking the walking street.",
          ko: "1960년대 지어진 아파트를 개조한 9층 규모의 트렌디한 인디 카페 밀집 공간.",
          ja: "1960年代のアパートを再生した、個性派カフェや雑貨店がぎっしり詰まったアイコン的スポット。"
        },
        rating: 4.76,
        reviewsCount: 380,
        verdictBadge: "CROWDED_BUT_BEAUTIFUL",
        reviews: [
          {
            id: "rev-hcm-501",
            author: "Đỗ Quỳnh Như",
            rating: 4,
            date: "2026-10-16",
            spent: "75.000đ",
            verdict: "CROWDED_BUT_BEAUTIFUL",
            content: "Ngồi ban công tầng 5 ngắm phố đi bộ lúc chiều tối siêu chill. Quán decor xinh xắn, nước uống khá ngon."
          }
        ]
      },
      {
        id: "poi-hcm-6",
        category: "ATTRACTION_TICKET",
        name: {
          vi: "Dinh Độc Lập (Di Tích Lịch Sử Quốc Gia Đặc Biệt)",
          en: "Independence Palace (Historic Landmark)",
          ko: "독립궁 (통일궁)",
          ja: "統一会堂 (旧大統領官邸)"
        },
        address: "135 Nam Kỳ Khởi Nghĩa, Phường Bến Thành, Quận 1, TP.HCM",
        hours: "08:00 - 16:30 hàng ngày",
        costDisplay: {
          vi: "Vé: 40.000đ - 65.000đ / người (Bao gồm nhà trưng bày)",
          en: "Ticket: 40,000 - 65,000 VND / person",
          ko: "티켓: 40,000 - 65,000 VND / 1인",
          ja: "入場料: 40,000 - 65,000 VND / 1人"
        },
        img: "https://images.unsplash.com/photo-1590523741831-ab7e8b8f9c7f?auto=format&fit=crop&w=800&q=80",
        description: {
          vi: "Công trình biểu tượng lịch sử và kiệt tác kiến trúc hiện đại Việt Nam giữa công viên cây xanh rợp bóng mát, lưu giữ nguyên vẹn phòng khánh tiết, hầm chỉ huy và xe tăng lịch sử 390.",
          en: "Historic presidential palace preserved in its 1970s grandeur with lush forested grounds, vintage bunker communication rooms, and tanks.",
          ko: "울창한 숲속에 보존된 역사적인 옛 대통령 궁전과 지하 벙커 지휘소.",
          ja: "緑豊かな敷地に当時の姿のまま保存された旧大統領官邸と歴史的地下要塞。"
        },
        rating: 4.89,
        reviewsCount: 650,
        verdictBadge: "VERY_WORTH_IT",
        reviews: [
          {
            id: "rev-hcm-601",
            author: "Vũ Hải Đăng",
            rating: 5,
            date: "2026-10-12",
            spent: "65.000đ",
            verdict: "VERY_WORTH_IT",
            content: "Vé rất rẻ cho một công trình lịch sử quy mô và đẹp đẽ như thế này. Khu hầm chỉ huy bên dưới tầng hầm rất ấn tượng."
          }
        ]
      }
    ]
  },

  dalat: {
    name: {
      vi: "Đà Lạt (Xứ Sở Sương Mù)",
      en: "Da Lat (Misty Pine Highlands)",
      ko: "달랏 (안개 낀 고원)",
      ja: "ダラット (霧の高原)"
    },
    heroImg: "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=1600&q=80",
    weather: {
      vi: "Đà Lạt 17°C • Sương mù nhẹ • Thích hợp săn mây & dạo đồi thông",
      en: "Da Lat 17°C • Light mist • Perfect for cloud hunting & strolling",
      ko: "달랏 17°C • 옅은 안개 • 구름 사냥 및 산책에 최적",
      ja: "ダラット 17°C • 朝霧 • 雲海ハンティングや散策に最適"
    },
    hotel: {
      vi: "Ana Mandara Villas Dalat Resort & Spa (Villa 14)",
      en: "Ana Mandara Villas Dalat Resort & Spa (Villa 14)",
      ko: "아나 만다라 빌라 달랏 리조트 & 스파",
      ja: "アナ・マンダラ・ヴィラズ・ダラット・リゾート＆スパ"
    },
    itineraries: [
      {
        id: 1,
        persona_focus: "HEALING_NATURE",
        title: {
          vi: "Lịch trình 1: Chữa lành Sương sớm & Ẩm thực Bản địa",
          en: "Itinerary 1: Morning Mist Healing & Indigenous Flavors",
          ko: "일정 1: 아침 안개 힐링 & 로컬 미식 탐방",
          ja: "旅程1: 朝霧のヒーリング＆郷土の味覚"
        },
        tagline: {
          vi: "Dành cho tâm hồn cần nạp lại năng lượng: săn mây, dạo rừng thông và thưởng thức lẩu ấm nồng.",
          en: "For souls needing recharge: cloud hunting, pine forest walks, and warm local hotpots.",
          ko: "지친 영혼의 재충전: 운해 감상, 소나무 숲 산책, 그리고 따스한 로컬 핫팟.",
          ja: "心を癒やす旅: 雲海狩り、静かな松林散策、温かい郷土鍋料理。"
        },
        slots: [
          {
            time: "06:00 - 08:00",
            poi_name: {
              vi: "Tiệm Cà Phê Hoàng Hôn Chiều (Dốc số 9)",
              en: "Hoang Hon Chieu Cafe (Slope 9)",
              ko: "황혼 노을 카페 (경사로 9)",
              ja: "黄昏の丘カフェ (9番坂)"
            },
            activity: {
              vi: "Đón bình minh săn biển mây bồng bềnh, thưởng thức cafe Arabica Cầu Đất nguyên chất.",
              en: "Catch the sunrise over the floating sea of clouds with authentic Cau Dat Arabica coffee.",
              ko: "운해 위로 떠오르는 일출을 감상하며 정통 까우닷 아라비카 커피를 즐깁니다.",
              ja: "雲海の上に昇る朝日を眺めながら、地元産カウダーット・アラビカコーヒーを堪能。"
            },
            cost_est: "75.000đ",
            img: "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=600&q=80",
            tips: {
              vi: "Nên đến trước 6h15 để có chỗ ngồi view thung lũng đẹp nhất.",
              en: "Arrive before 6:15 AM for the best valley view spots.",
              ko: "가장 좋은 계곡 뷰를 위해 오전 6시 15분 전 도착을 권장합니다.",
              ja: "最も美しい谷の眺めを確保するため午前6時15分前の到着をおすすめします。"
            }
          },
          {
            time: "08:30 - 09:45",
            poi_name: {
              vi: "Bánh Căn Lệ Yersin",
              en: "Le Yersin Banh Can",
              ko: "레 예르생 반깐",
              ja: "レ・イェルサン・バーンカン"
            },
            activity: {
              vi: "Thưởng thức đĩa bánh căn trứng cút lòng đào nóng hổi kèm xíu mại mỡ hành đậm đà.",
              en: "Savor crispy Vietnamese mini pancakes with runny quail egg yolk and savory pork meatball broth.",
              ko: "반숙 메추리알이 들어간 바삭한 반깐과 고소한 파기름 완자 수프를 즐깁니다.",
              ja: "半熟うずら卵入りの香ばしい米粉パンケーキと肉団子スープの朝食。"
            },
            cost_est: "55.000đ",
            img: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80",
            tips: {
              vi: "Cho thêm xíu sa tế vào chén mắm nêm để bùng vị cay thơm.",
              en: "Add a touch of chili paste into the savory dip for an extra punch.",
              ko: "특제 양념장에 칠리를 살짝 곁들이면 더욱 풍미가 깊어집니다.",
              ja: "特製ディップにチリを少量加えると風味が一層引き立ちます。"
            }
          },
          {
            time: "18:00 - 20:30",
            poi_name: {
              vi: "Lẩu Gà Lá É Tao Ngộ (3/4)",
              en: "Tao Ngo Chicken Hotpot with E Leaves",
              ko: "따오 응오 에 잎 닭고기 핫팟",
              ja: "タオ・ゴー エー葉チキン鍋"
            },
            activity: {
              vi: "Thưởng thức nồi lẩu gà lá é trứ danh, nước dùng ngọt thanh vị thảo mộc cay the giữa đêm lạnh 15°C.",
              en: "Indulge in Dalat's famous herb chicken hotpot in the crisp 15°C evening mountain chill.",
              ko: "선선한 15°C 고원 저녁 공기 속에서 은은한 허브 향의 따끈한 닭고기 핫팟 식사.",
              ja: "肌寒い15°Cの高原の夜に、爽やかなハーブ香る名物チキン鍋を堪能。"
            },
            cost_est: "140.000đ",
            img: "https://images.unsplash.com/photo-1547928576-a4a33237cbc3?auto=format&fit=crop&w=600&q=80",
            tips: {
              vi: "Nhúng lá é vừa chín tới sẽ giữ trọn mùi thơm the mát tự nhiên.",
              en: "Dip E leaves briefly so they stay aromatic and tender.",
              ko: "에 잎을 살짝만 데쳐야 고유의 향긋함이 살아납니다.",
              ja: "エーの葉はさっとくぐらせる程度にすると香りが引き立ちます。"
            }
          }
        ]
      },
      {
        id: 2,
        persona_focus: "ADVENTURE_THRILLS",
        title: {
          vi: "Lịch trình 2: Máng Trượt Datanla & Chèo Thuyền SUP Tuyền Lâm",
          en: "Itinerary 2: Datanla Alpine Coaster & Tuyen Lam SUP Rowing",
          ko: "일정 2: 다딴라 알파인 코스터 & 뚜옌럼 호수 SUP 패들보드",
          ja: "旅程2: ダタンラ・アルパインコースター＆トゥエンラム湖SUP"
        },
        tagline: {
          vi: "Chinh phục máng trượt rừng thông dài nhất Đông Nam Á và lướt SUP giữa rặng phong đổi màu.",
          en: "Experience Southeast Asia's longest pine coaster and serene lake paddling.",
          ko: "동남아 최장 알파인 코스터와 고요한 호수 위 패들링을 만끽하는 액티브 일정.",
          ja: "東南アジア最長の森林コースターと神秘的な湖畔SUPを楽しむアクティブ旅程。"
        },
        slots: [
          {
            time: "08:30 - 11:30",
            poi_name: {
              vi: "Máng Trượt Datanla Alpine Coaster 3",
              en: "Datanla Alpine Coaster 3",
              ko: "다딴라 알파인 코스터 3",
              ja: "ダタンラ・アルパインコースター3"
            },
            activity: {
              vi: "Tự tay điều khiển xe trượt len lỏi qua các khúc cua rừng thông ngoạn mục xuống thác Datanla.",
              en: "Control your sled down thrilling curves towards mighty Datanla Waterfall.",
              ko: "급커브를 활강하며 폭포로 질주하는 짜릿한 스릴 코스터 체험.",
              ja: "壮大な松林を縫うように疾走し、滝へと滑り降りる爽快コースター。"
            },
            cost_est: "250.000đ",
            img: "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?auto=format&fit=crop&w=600&q=80",
            tips: {
              vi: "Hạn chế thắng gấp ở các góc cua để xe lướt mượt mà.",
              en: "Brake smoothly on turns for maximum excitement.",
              ko: "커브에서 브레이크를 부드럽게 잡으면 더욱 부드럽게 달립니다.",
              ja: "カーブで適度にブレーキを引くと滑らかで快適に楽しめます。"
            }
          }
        ]
      }
    ],
    pois: [
      {
        id: "poi-dl-1",
        category: "SPECIALTY_FOOD",
        name: {
          vi: "Lẩu Gà Lá É Tao Ngộ (Gốc Đường 3/4)",
          en: "Tao Ngo Chicken Hotpot with E Leaves",
          ko: "따오 응오 에 잎 닭고기 핫팟 (본점)",
          ja: "タオ・ゴー エー葉チキン鍋（本店）"
        },
        address: "Số 5 Đường 3 Tháng 4, Phường 3, TP. Đà Lạt",
        hours: "09:00 - 22:30 hàng ngày",
        costDisplay: {
          vi: "110.000đ - 160.000đ / người",
          en: "110,000 - 160,000 VND / person",
          ko: "110,000 - 160,000 VND / 1인",
          ja: "110,000 - 160,000 VND / 1人"
        },
        img: "https://images.unsplash.com/photo-1547928576-a4a33237cbc3?auto=format&fit=crop&w=800&q=80",
        description: {
          vi: "Quán lẩu gà lá é chính gốc đông khách nhất Đà Lạt. Nước lẩu nấu từ xương gà đồi ngọt thanh, măng le giòn sần sật, thịt gà ta chắc thịt và lá é the mát độc đáo.",
          en: "The most famous authentic E-leaf chicken hotpot in Dalat with clear broth, crunchy bamboo shoots, and fragrant mountain herbs.",
          ko: "토종닭과 대나무순, 독특한 향의 에 잎이 어우러진 달랏 대표 보양 핫팟 맛집.",
          ja: "地鶏の旨味とタケノコ、爽やかなハーブが絶妙に調和したダラット最高峰の名物チキン鍋。"
        },
        rating: 4.86,
        reviewsCount: 342,
        verdictBadge: "VERY_WORTH_IT",
        reviews: [
          {
            id: "rev-dl-101",
            author: "Trần Mai Linh (Hà Nội)",
            rating: 5,
            date: "2026-10-18",
            spent: "140.000đ",
            verdict: "VERY_WORTH_IT",
            content: "Nước lẩu ngọt thanh không bị gắt hạt nêm, thịt gà ta dai ngon da giòn. Rất đáng thử khi đến Đà Lạt!"
          }
        ]
      },
      {
        id: "poi-dl-2",
        category: "ATTRACTION_TICKET",
        name: {
          vi: "Máng Trượt Datanla Alpine Coaster 3",
          en: "Datanla Alpine Coaster 3",
          ko: "다딴라 알파인 코스터 3 (동남아 최장)",
          ja: "ダタンラ・アルパインコースター3"
        },
        address: "Đèo Prenn, Quốc lộ 20, Phường 3, TP. Đà Lạt",
        hours: "07:30 - 17:00",
        costDisplay: {
          vi: "Vé khứ hồi: 250.000đ / người lớn",
          en: "Round-trip ticket: 250,000 VND / adult",
          ko: "왕복 티켓: 250,000 VND / 성인",
          ja: "往復チケット: 250,000 VND / 大人"
        },
        img: "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?auto=format&fit=crop&w=800&q=80",
        description: {
          vi: "Hệ thống máng trượt xuyên rừng thông dài nhất Đông Nam Á (2.400m). Du khách có thể tự kiểm soát tốc độ qua các khúc cua uốn lượn xuống thác Datanla.",
          en: "Southeast Asia's longest 2,400m alpine coaster through pristine pine forest with magnetic brakes down to Datanla Waterfall.",
          ko: "소나무 숲을 가로지르는 2,400m 길이의 알파인 코스터로 짜릿한 스릴을 만끽.",
          ja: "東南アジア最長2,400mの森林滑走コースター。手元レバーで速度を操りながら滝へと下る爽快感。"
        },
        rating: 4.92,
        reviewsCount: 512,
        verdictBadge: "VERY_WORTH_IT",
        reviews: [
          {
            id: "rev-dl-201",
            author: "Hoàng Minh Trí",
            rating: 5,
            date: "2026-10-17",
            spent: "250.000đ",
            verdict: "VERY_WORTH_IT",
            content: "Trải nghiệm cực đỉnh! Máng trượt an toàn, chạy êm ru qua rừng thông. 250k hoàn toàn xứng đáng!"
          }
        ]
      }
    ]
  },

  danang: {
    name: {
      vi: "Đà Nẵng & Hội An (Biển Mỹ Khê & Phố Cổ)",
      en: "Da Nang & Hoi An (My Khe Beach & Old Town)",
      ko: "다낭 & 호이안 (미케비치 & 구시가지)",
      ja: "ダナン＆ホイアン (ミーケビーチ＆古都)"
    },
    heroImg: "https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?auto=format&fit=crop&w=1600&q=80",
    weather: {
      vi: "Đà Nẵng 27°C • Nắng vàng biển xanh • Tuyệt vời tắm biển & dạo phố cổ đèn lồng",
      en: "Da Nang 27°C • Golden sunshine & blue waves • Ideal for beach & lantern town",
      ko: "다낭 27°C • 맑고 푸른 바다 • 해수욕과 호이안 야경 투어에 최적",
      ja: "ダナン 27°C • 青い海と陽光 • ビーチリゾートとランタンの街歩きに最適"
    },
    hotel: {
      vi: "InterContinental Danang Sun Peninsula Resort",
      en: "InterContinental Danang Sun Peninsula Resort",
      ko: "인터컨티넨탈 다낭 썬 페닌슐라 리조트",
      ja: "インターコンチネンタル・ダナン・サン・ペニンシュラ"
    },
    itineraries: [
      {
        id: 1,
        persona_focus: "BEACH_HERITAGE",
        title: {
          vi: "Lịch trình 1: Biển Mỹ Khê, Bán Đảo Sơn Trà & Thả Đèn Hoa Đăng Hội An",
          en: "Itinerary 1: My Khe Beach, Son Tra Peninsula & Hoi An Lanterns",
          ko: "일정 1: 미케 비치, 손짜 반도 & 호이안 소원등 띄우기",
          ja: "旅程1: ミーケビーチ、ソンチャ半島＆ホイアン灯籠流し"
        },
        tagline: {
          vi: "Tắm biển buổi sáng, ngắm voọc chà vá chân nâu và bước vào thế giới lung linh đèn lồng phố cổ.",
          en: "Morning beach swimming, visiting Lady Buddha, and magical evening boat lanterns in Hoi An.",
          ko: "시원한 해수욕과 린응사 해수관음상, 저녁 호이안 강변의 로맨틱한 소원등 배 투어.",
          ja: "朝のビーチ遊泳から巨大観音像、夜はランタン揺れるホイアン旧市街へ。"
        },
        slots: [
          {
            time: "07:00 - 09:00",
            poi_name: {
              vi: "Tắm Biển Mỹ Khê & Mì Quảng Bà Mua",
              en: "My Khe Beach & Ba Mua Quang Noodles",
              ko: "미케 비치 해수욕 & 바무아 미꽝",
              ja: "ミーケビーチ遊泳＆バー・ムアのミークアン"
            },
            activity: {
              vi: "Đón bình minh trên bãi biển cát trắng mịn màng và thưởng thức tô mì Quảng tôm thịt đậm đà.",
              en: "Watch dawn over soft white sands and enjoy authentic turmeric noodle soup with shrimp & pork.",
              ko: "부드러운 백사장에서 일출을 맞이하고 진한 육수의 전통 미꽝 국수 맛보기.",
              ja: "白砂のビーチで朝日を浴びた後、エビと豚肉の旨味が詰まった名物ミークアンを賞味。"
            },
            cost_est: "55.000đ",
            img: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80",
            tips: {
              vi: "Ăn kèm bánh tráng mè nướng giòn và ớt xanh miền Trung.",
              en: "Crumble crispy sesame rice crackers directly into the broth.",
              ko: "바삭한 참깨 라이스 크래커를 부셔 넣어 함께 드세요.",
              ja: "香ばしいゴマ入りライスクラッカーを割り入れながら食べるのが本場流。"
            }
          },
          {
            time: "17:00 - 20:30",
            poi_name: {
              vi: "Phố Cổ Hội An & Thuyền Hoa Đăng Sông Hoài",
              en: "Hoi An Ancient Town & Lantern Boat Ride",
              ko: "호이안 고대 도시 & 투본강 소원등 나룻배",
              ja: "ホイアン古都散策＆ホアイ川の灯籠流し小舟"
            },
            activity: {
              vi: "Tản bộ qua Chùa Cầu trăm tuổi, ngồi thuyền gỗ thả đèn hoa đăng lung linh cầu may mắn trên sông.",
              en: "Stroll across the Japanese Covered Bridge and float wishing candle lanterns down the river.",
              ko: "수백 년 역사의 일본 다리를 걷고 소원등을 강물에 띄우며 낭만을 즐깁니다.",
              ja: "来遠橋を渡り、手漕ぎ小舟から灯籠を流して願いを込める幻想的な夜。"
            },
            cost_est: "180.000đ",
            img: "https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?auto=format&fit=crop&w=600&q=80",
            tips: {
              vi: "Nên thuê thuyền gỗ của các cô chú bến đò trung tâm vào khoảng 18h.",
              en: "Hire wooden boats around 6 PM right as lanterns start glowing.",
              ko: "오후 6시경 전등이 켜지는 시간에 맞춰 배를 타는 것이 가장 아름답습니다.",
              ja: "ランタンが一斉に点灯する午後6時前後の乗船が最も幻想的です。"
            }
          }
        ]
      }
    ],
    pois: [
      {
        id: "poi-dn-1",
        category: "ATTRACTION_TICKET",
        name: {
          vi: "Sun World Bà Nà Hills & Cầu Vàng (Bàn Tay Phật)",
          en: "Sun World Ba Na Hills & Golden Giant Hands Bridge",
          ko: "바나힐 & 골든 브릿지 (신의 손)",
          ja: "バーナーヒルズ＆ゴールデンブリッジ (神の手)"
        },
        address: "Thôn An Sơn, Xã Hòa Ninh, Huyện Hòa Vang, TP. Đà Nẵng",
        hours: "08:00 - 17:30",
        costDisplay: {
          vi: "Vé cáp treo: 900.000đ / người lớn (Bao gồm buffet)",
          en: "Cable car & Buffet ticket: 900,000 VND / adult",
          ko: "케이블카 & 뷔페: 900,000 VND / 성인",
          ja: "ロープウェイ＆ビュッフェ: 900,000 VND / 大人"
        },
        img: "https://images.unsplash.com/photo-1590523741831-ab7e8b8f9c7f?auto=format&fit=crop&w=800&q=80",
        description: {
          vi: "Cây cầu Vàng nâng đỡ bởi đôi bàn tay khổng lồ giữa biển mây bồng bềnh ở độ cao 1.414m, được tạp chí TIME vinh danh là một trong 100 điểm đến tuyệt vời nhất thế giới.",
          en: "World-famous Golden Bridge held aloft by colossal stone hands among mountain clouds at 1,414 meters altitude.",
          ko: "해발 1,414m 구름 위에서 거대한 신의 손이 받치고 있는 세계적인 랜드마크 골든 브릿지.",
          ja: "標高1,414mの雲海に浮かび、巨神の手が支える世界的に有名な奇跡の橋。"
        },
        rating: 4.95,
        reviewsCount: 890,
        verdictBadge: "VERY_WORTH_IT",
        reviews: [
          {
            id: "rev-dn-101",
            author: "Ngô Thanh Vân",
            rating: 5,
            date: "2026-10-18",
            spent: "900.000đ",
            verdict: "VERY_WORTH_IT",
            content: "Cầu Vàng ngoài đời thực sự choáng ngợp! Cáp treo dài và êm ru, đi vào ngày trời quang thấy trọn cảnh biển Đà Nẵng từ trên cao."
          }
        ]
      }
    ]
  }
};

// Sổ Cái Escrow Demo Records
let ESCROW_LEDGER = [
  {
    txId: "TX-ESC-99201",
    tripCode: "WM99081234",
    type: "VIETQR_ESCROW_INFLOW",
    direction: "IN",
    amount: "5.000.000đ",
    sender: "NGUYEN VAN AN (MBBank)",
    receiver: "CONG TY CP CONG NGHE DU LICH WANDERMATCH",
    status: "HELD_IN_ESCROW",
    time: "2026-10-20 10:14:22"
  }
];

// ============================================================================
// 3. UI RENDERING & I18N SYSTEM
// ============================================================================

function t(key) {
  const lang = state.currentLang;
  return I18N[lang]?.[key] || I18N['vi']?.[key] || key;
}

function setLanguage(lang) {
  if (!['vi', 'en', 'ko', 'ja'].includes(lang)) return;
  state.currentLang = lang;
  document.documentElement.lang = lang;
  
  ['vi', 'en', 'ko', 'ja'].forEach(l => {
    const btn = document.getElementById(`lang-btn-${l}`);
    if (btn) {
      if (l === lang) {
        btn.classList.add('bg-cyan-500', 'text-slate-950', 'font-bold');
        btn.classList.remove('text-slate-300', 'hover:bg-slate-800');
      } else {
        btn.classList.remove('bg-cyan-500', 'text-slate-950', 'font-bold');
        btn.classList.add('text-slate-300', 'hover:bg-slate-800');
      }
    }
  });

  applyI18nLabels();
  renderDestinationHero();
  renderTripSummaryCard();
  renderDetailedDayItinerary();
  renderBudgetAllocation();
  renderItineraries();
  renderPois();
  renderRefundCalculator();
}

function applyI18nLabels() {
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (key && I18N[state.currentLang]?.[key]) {
      el.textContent = I18N[state.currentLang][key];
    }
  });

  const spentInput = document.getElementById('review-spent-input');
  if (spentInput) spentInput.placeholder = t('modal_spent_ph');
  const contentInput = document.getElementById('review-content-input');
  if (contentInput) contentInput.placeholder = t('modal_content_ph');
}

// ============================================================================
// 4. DESTINATION & CUSTOM BUDGET PLANNER ENGINE
// ============================================================================

function getCurrentDestData() {
  const destKey = state.selectedDestination === 'blind' ? 'dalat' : state.selectedDestination;
  return DESTINATION_DATA[destKey] || DESTINATION_DATA['hochiminh'];
}

function renderDestinationHero() {
  const data = getCurrentDestData();
  const heroImg = document.getElementById('dest-hero-img');
  const titleEl = document.getElementById('dest-title-text');
  const weatherEl = document.getElementById('dest-weather-text');
  const hotelEl = document.getElementById('dest-hotel-text');

  if (heroImg) heroImg.src = data.heroImg;
  if (titleEl) {
    const destName = data.name[state.currentLang] || data.name.vi;
    titleEl.textContent = `${t('concierge_title') || 'Chào mừng quý khách đến với'} ${destName}`;
  }
  if (weatherEl) {
    weatherEl.textContent = data.weather[state.currentLang] || data.weather.vi;
  }
  if (hotelEl) {
    hotelEl.textContent = `Khách sạn / Resort: ${data.hotel[state.currentLang] || data.hotel.vi}`;
  }
}

function renderBudgetAllocation() {
  const budget = state.selectedBudget;
  const hotelAlloc = Math.round(budget * 0.4);
  const foodAlloc = Math.round(budget * 0.3);
  const ticketAlloc = Math.round(budget * 0.2);
  const transitAlloc = Math.round(budget * 0.1);

  const container = document.getElementById('budget-breakdown-container');
  if (!container) return;

  container.innerHTML = `
    <div class="glass-card rounded-2xl p-5 border border-cyan-500/30 bg-slate-900/80 space-y-3">
      <div class="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-2">
        <span class="text-xs font-bold text-cyan-300 flex items-center gap-1.5" data-i18n="budget_breakdown_title">
          <i class="fa-solid fa-chart-pie"></i> ${t('budget_breakdown_title')}
        </span>
        <span class="text-xs font-black text-emerald-400 font-mono">
          Tổng ngân sách: ${budget.toLocaleString('vi-VN')} VNĐ (${state.selectedPax} khách)
        </span>
      </div>

      <div class="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
        <div class="bg-slate-950 p-3 rounded-xl border border-slate-800">
          <div class="text-slate-400 flex items-center gap-1"><i class="fa-solid fa-hotel text-cyan-400"></i> ${t('alloc_hotel')}</div>
          <div class="text-sm font-black text-cyan-300 mt-1">${hotelAlloc.toLocaleString('vi-VN')}đ</div>
        </div>

        <div class="bg-slate-950 p-3 rounded-xl border border-slate-800">
          <div class="text-slate-400 flex items-center gap-1"><i class="fa-solid fa-bowl-food text-amber-400"></i> ${t('alloc_food')}</div>
          <div class="text-sm font-black text-amber-300 mt-1">${foodAlloc.toLocaleString('vi-VN')}đ</div>
        </div>

        <div class="bg-slate-950 p-3 rounded-xl border border-slate-800">
          <div class="text-slate-400 flex items-center gap-1"><i class="fa-solid fa-ticket text-emerald-400"></i> ${t('alloc_ticket')}</div>
          <div class="text-sm font-black text-emerald-300 mt-1">${ticketAlloc.toLocaleString('vi-VN')}đ</div>
        </div>

        <div class="bg-slate-950 p-3 rounded-xl border border-slate-800">
          <div class="text-slate-400 flex items-center gap-1"><i class="fa-solid fa-taxi text-violet-400"></i> ${t('alloc_contingency')}</div>
          <div class="text-sm font-black text-violet-300 mt-1">${transitAlloc.toLocaleString('vi-VN')}đ</div>
        </div>
      </div>
    </div>
  `;
}

// "NHẬP SỐ TIỀN VÀ RA NGAY CHUYẾN ĐI" - RENDER THẺ XÁC NHẬN CHUYẾN ĐI
function renderTripSummaryCard() {
  const container = document.getElementById('generated-trip-card');
  if (!container) return;

  const budget = state.selectedBudget;
  const pax = state.selectedPax;
  const perPax = Math.round(budget / pax);
  const data = getCurrentDestData();
  const destName = data.name[state.currentLang] || data.name.vi;
  const hotelName = data.hotel[state.currentLang] || data.hotel.vi;

  let hotelTierDesc = "";
  if (budget < 3500000) {
    hotelTierDesc = "Khách sạn Tiêu Chuẩn 3 Sao (Phòng Superior City View)";
  } else if (budget <= 8000000) {
    hotelTierDesc = "Khách sạn Cao Cấp 4 Sao (Phòng Deluxe River/Forest View + Buffet Sáng)";
  } else {
    hotelTierDesc = "Resort / Khách Sạn Thượng Lưu 5 Sao (Phòng Suite + Spa & Đưa Đón Sân Bay)";
  }

  const hotelAlloc = Math.round(budget * 0.4);
  const foodAlloc = Math.round(budget * 0.3);
  const ticketAlloc = Math.round(budget * 0.2);
  const transitAlloc = Math.round(budget * 0.1);

  const topItin = data.itineraries?.[0];
  const sampleSlots = topItin ? topItin.slots.slice(0, 3) : [];

  const slotsPreviewHtml = sampleSlots.map(s => `
    <div class="flex items-center gap-3 bg-slate-950/70 p-2.5 rounded-xl border border-slate-800">
      <img src="${s.img}" alt="${s.poi_name.vi}" class="w-12 h-12 rounded-lg object-cover border border-slate-700 shrink-0">
      <div class="min-w-0 flex-1">
        <div class="flex items-center justify-between text-[11px]">
          <span class="text-cyan-400 font-mono font-bold">${s.time}</span>
          <span class="text-emerald-400 font-bold">${s.cost_est}</span>
        </div>
        <p class="text-xs font-bold text-white truncate mt-0.5">${s.poi_name[state.currentLang] || s.poi_name.vi}</p>
      </div>
    </div>
  `).join('');

  container.innerHTML = `
    <div class="bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 rounded-3xl p-6 lg:p-7 border-2 border-emerald-500/50 shadow-2xl space-y-5 animate-fadeIn relative overflow-hidden">
      <div class="absolute top-0 right-0 px-4 py-1.5 bg-gradient-to-l from-emerald-500 to-teal-600 text-slate-950 font-black text-xs rounded-bl-2xl uppercase tracking-wider flex items-center gap-1.5 shadow">
        <i class="fa-solid fa-circle-check"></i> KẾ HOẠCH ĐÃ ĐƯỢC TẠO
      </div>

      <div class="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
        <div>
          <span class="text-xs text-emerald-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
            <i class="fa-solid fa-compass"></i> CHUYẾN ĐI TỰ TẠO THEO NGÂN SÁCH CỦA BẠN
          </span>
          <h3 class="text-xl lg:text-2xl font-black text-white mt-1 flex items-center gap-2">
            <span>Chuyến Du Lịch: ${destName}</span>
          </h3>
          <p class="text-xs text-slate-300 mt-0.5">
            Mã đơn hàng: <strong class="text-amber-400 font-mono">WM99081234</strong> • ${pax} khách • ${state.selectedDuration === '2d1n' ? '2 Ngày 1 Đêm' : state.selectedDuration === '4d3n' ? '4 Ngày 3 Đêm' : '3 Ngày 2 Đêm'}
          </p>
        </div>

        <div class="text-right">
          <span class="text-xs text-slate-400">Tổng Ngân Sách Trọn Gói:</span>
          <div class="text-2xl lg:text-3xl font-black text-emerald-400 font-mono">
            ${budget.toLocaleString('vi-VN')} VNĐ
          </div>
          <span class="text-[11px] text-cyan-300 font-medium">Bình quân: ~${perPax.toLocaleString('vi-VN')}đ / khách</span>
        </div>
      </div>

      <!-- 4 Trụ Cột Phân Bổ Chi Tiết Theo Số Tiền -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs">
        <div class="bg-slate-950/80 p-3.5 rounded-xl border border-slate-800 space-y-1">
          <div class="text-cyan-400 font-bold flex items-center gap-1.5">
            <i class="fa-solid fa-hotel"></i> 🏨 Lưu Trú (40%)
          </div>
          <div class="text-base font-black text-white">${hotelAlloc.toLocaleString('vi-VN')}đ</div>
          <div class="text-[11px] text-slate-300 leading-tight">${hotelName} — ${hotelTierDesc}</div>
        </div>

        <div class="bg-slate-950/80 p-3.5 rounded-xl border border-slate-800 space-y-1">
          <div class="text-amber-400 font-bold flex items-center gap-1.5">
            <i class="fa-solid fa-utensils"></i> 🍜 Ẩm Thực (30%)
          </div>
          <div class="text-base font-black text-white">${foodAlloc.toLocaleString('vi-VN')}đ</div>
          <div class="text-[11px] text-slate-300 leading-tight">Thưởng thức món đặc sản Michelin Bib Gourmand & phố ẩm thực</div>
        </div>

        <div class="bg-slate-950/80 p-3.5 rounded-xl border border-slate-800 space-y-1">
          <div class="text-emerald-400 font-bold flex items-center gap-1.5">
            <i class="fa-solid fa-ticket"></i> 🎡 Vé Vui Chơi (20%)
          </div>
          <div class="text-base font-black text-white">${ticketAlloc.toLocaleString('vi-VN')}đ</div>
          <div class="text-[11px] text-slate-300 leading-tight">Bao gồm trọn gói vé đài quan sát, cáp treo, di tích và tour</div>
        </div>

        <div class="bg-slate-950/80 p-3.5 rounded-xl border border-slate-800 space-y-1">
          <div class="text-violet-400 font-bold flex items-center gap-1.5">
            <i class="fa-solid fa-taxi"></i> 🚕 Di Chuyển (10%)
          </div>
          <div class="text-base font-black text-white">${transitAlloc.toLocaleString('vi-VN')}đ</div>
          <div class="text-[11px] text-slate-300 leading-tight">Di chuyển Grab/Taxi nội thành, cafe chill và quỹ dự phòng</div>
        </div>
      </div>

      <!-- Hoạt động tiêu biểu được kích hoạt -->
      <div class="space-y-2">
        <div class="flex items-center justify-between text-xs">
          <span class="font-bold text-slate-300 flex items-center gap-1.5">
            <i class="fa-solid fa-wand-magic-sparkles text-cyan-400"></i> Các Hoạt Động Tiêu Biểu Trong Kế Hoạch:
          </span>
          <span class="text-slate-400 text-[11px]">Đã sắp xếp khoa học theo khung giờ</span>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-2.5">
          ${slotsPreviewHtml}
        </div>
      </div>

      <!-- Khóa Tiêu Chuẩn Thực Dụng Đã Áp Dụng (Pragmatic Comfort Locks) -->
      <div class="p-3 rounded-2xl bg-slate-900/90 border border-slate-800 text-xs space-y-2">
        <div class="flex items-center justify-between">
          <span class="font-bold text-slate-300 flex items-center gap-1.5 text-[11px]">
            <i class="fa-solid fa-lock text-cyan-400"></i> Tiêu Chuẩn Thực Dụng Đã Khóa Cho Chuyến Đi:
          </span>
          <span class="text-cyan-400 font-mono text-[10px] font-bold">RETAIL FLOOR: &ge; ${(budget * 1.2).toLocaleString('vi-VN')}đ</span>
        </div>
        <div class="flex flex-wrap gap-1.5 text-[10px]">
          <span class="px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 text-slate-200 flex items-center gap-1 font-semibold">
            <i class="fa-solid fa-plane-departure text-cyan-400"></i> ${state.comfortLocks.noRedEye ? 'Khung giờ bay 07:00 - 20:00' : 'Giờ bay linh hoạt'}
          </span>
          <span class="px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 text-slate-200 flex items-center gap-1 font-semibold">
            <i class="fa-solid fa-bed text-amber-400"></i> Cấu hình: ${state.comfortLocks.bedType === 'TWIN' ? '2 Giường Đơn (Twin)' : '1 Giường Đôi Lớn (King)'}
          </span>
          <span class="px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 text-slate-200 flex items-center gap-1 font-semibold">
            <i class="fa-solid fa-suitcase-rolling text-emerald-400"></i> ${state.comfortLocks.luggageShuttle ? 'Kèm 20kg ký gửi & Xe đón sân bay' : 'Hành lý xách tay 7kg'}
          </span>
          ${state.comfortLocks.workcation ? `
            <span class="px-2.5 py-1 rounded-lg bg-slate-950 border border-violet-500/40 text-violet-300 flex items-center gap-1 font-semibold">
              <i class="fa-solid fa-laptop-code text-violet-400"></i> Workcation: Bàn riêng & Wifi &ge; 50Mbps
            </span>
          ` : ''}
        </div>
      </div>

      <!-- Cam kết bảo hiểm SLA -->
      <div class="bg-cyan-950/30 p-3.5 rounded-2xl border border-cyan-800/50 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div class="flex items-center gap-2.5 text-cyan-200">
          <div class="w-7 h-7 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold shrink-0">
            <i class="fa-solid fa-shield-halved"></i>
          </div>
          <div>
            <span class="font-bold text-white">Bảo Hiểm SLA Phòng Cứng 20 Triệu Đồng & Hoàn 200% Chênh Lệch</span>
            <span class="text-slate-300 text-[11px] block">Đối tác B2B ký số cam kết 100% không bùng phòng • Hoàn 200% chênh lệch nếu giá trị thực tế < ngân sách</span>
          </div>
        </div>
        <span class="px-3 py-1 rounded-full text-[10px] font-black bg-emerald-950 text-emerald-300 border border-emerald-700/60">
          HARD_COMMIT_ESCROW
        </span>
      </div>

      <!-- Nút Chốt Chuyến Đi & Thanh Toán VietQR Ngay -->
      <div class="pt-2">
        <button onclick="goToPaymentWithBudget()" class="w-full py-4 rounded-2xl btn-glow-emerald text-white font-black text-sm lg:text-base shadow-2xl flex items-center justify-center gap-2 transition hover:scale-[1.01]">
          <i class="fa-solid fa-credit-card"></i>
          <span>💳 CHỐT KẾ HOẠCH & TIẾN HÀNH THANH TOÁN VIETQR (${budget.toLocaleString('vi-VN')} VNĐ) NGAY</span>
          <i class="fa-solid fa-arrow-right"></i>
        </button>
      </div>
    </div>
  `;
}

// ============================================================================
// 4B. FULL DETAILED DAY-BY-DAY ITINERARY ENGINE (LẬP LỊCH TRÌNH CHI TIẾT THEO SỐ TIỀN)
// ============================================================================

const DETAILED_DAY_PLANS = {
  hochiminh: [
    {
      day: 1,
      title: "Ngày 1: Sài Gòn Di Sản, Cà Phê Chung Cư Cổ & Sông Sài Gòn Lung Linh",
      tagline: "Khởi đầu hoàn hảo với cơm tấm Michelin Ba Ghiền, kiến trúc Đông Dương Dinh Độc Lập và hoàng hôn Waterbus.",
      slots: [
        {
          time: "07:30 - 09:00",
          type: "FOOD",
          typeName: "🍜 Bữa Sáng Điểm Tâm",
          poiName: "Cơm Tấm Ba Ghiền (Michelin Bib Gourmand)",
          area: "84 Đặng Văn Ngữ, Phú Nhuận",
          desc: "Thưởng thức đĩa cơm tấm sườn cốt lết nướng than hồng mật ong dày to thơm lừng trứ danh đất Sài Gòn.",
          tip: "Nên gọi thêm bì chả và chén mỡ hành tóp mỡ giòn rụm chấm nước mắm kẹo đậm đà.",
          img: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80",
          costRatio: 0.04
        },
        {
          time: "09:30 - 11:30",
          type: "ATTRACTION",
          typeName: "🎡 Di Sản & Kiến Trúc",
          poiName: "Dinh Độc Lập & Bưu Điện Trung Tâm Sài Gòn",
          area: "Nam Kỳ Khởi Nghĩa, Quận 1",
          desc: "Chiêm ngưỡng kiệt tác kiến trúc hiện đại nhiệt đới của KTS Ngô Viết Thụ và bưu điện mái vòm cổ kính kiểu Pháp.",
          tip: "Ghé quầy lưu niệm trong bưu điện viết tay bưu thiếp gửi về làm kỷ niệm cho người thân.",
          img: "https://images.unsplash.com/photo-1590523741831-ab7e8b8f9c7f?auto=format&fit=crop&w=600&q=80",
          costRatio: 0.03
        },
        {
          time: "12:00 - 13:30",
          type: "FOOD",
          typeName: "🍜 Bữa Trưa Đặc Sản",
          poiName: "Phở Hòa Pasteur 50 Năm Gia Truyền",
          area: "260C Pasteur, Quận 3",
          desc: "Tô phở bò tái nạm gầu giòn với nước dùng hầm xương tủy thảo mộc thanh ngọt tự nhiên không mì chính.",
          tip: "Thêm đĩa quẩy giòn và chén trứng chần nước béo đúng điệu người Sài Gòn xưa.",
          img: "https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?auto=format&fit=crop&w=600&q=80",
          costRatio: 0.045
        },
        {
          time: "14:00 - 16:30",
          type: "CAFE",
          typeName: "☕ Thư Giãn & Check-in",
          poiName: "Chung Cư Cà Phê 42 Nguyễn Huệ (Partea / Saigon Ơi)",
          area: "42 Nguyễn Huệ, Quận 1",
          desc: "Khám phá mê cung các tiệm cà phê indie độc đáo và ban công ngắm nhìn trọn vẹn phố đi bộ Nguyễn Huệ.",
          tip: "Chọn bàn sát ban công tầng 4 hoặc 5 lúc chiều tà để chụp ảnh với ánh sáng đẹp nhất.",
          img: "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=600&q=80",
          costRatio: 0.035
        },
        {
          time: "17:15 - 19:00",
          type: "EXPERIENCE",
          typeName: "🌅 Ngắm Hoàng Hôn Sông Sài Gòn",
          poiName: "Saigon River Waterbus (Bến Bạch Đằng ⇌ Cầu Ba Son)",
          area: "Số 10B Tôn Đức Thắng, Quận 1",
          desc: "Lướt trên sóng sông Sài Gòn ngắm hoàng hôn nhuộm vàng các tòa nhà chọc trời và cầu Ba Son lộng lẫy.",
          tip: "Chọn chuyến xuất bến lúc 17h15 để vừa kịp đón trọn khoảnh khắc hoàng hôn đổi màu tuyệt đẹp.",
          img: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=600&q=80",
          costRatio: 0.02
        },
        {
          time: "19:30 - 21:00",
          type: "FOOD",
          typeName: "🍜 Bữa Tối Hải Sản",
          poiName: "Hẻm Ốc Đào Nguyễn Trãi (Hải Sản Sốt Bơ Tỏi)",
          area: "Hẻm 212B Nguyễn Trãi, Quận 1",
          desc: "Thưởng thức ốc hương xào bơ tỏi bánh mì, càng ghẹ rang muối ớt kéo sợi cay nồng chuẩn phong cách Sài Gòn.",
          tip: "Nước xốt bơ tỏi chấm bánh mì nóng là linh hồn của quán, nhất định phải gọi 2 ổ bánh mì.",
          img: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=600&q=80",
          costRatio: 0.08
        },
        {
          time: "21:30 - 23:00",
          type: "NIGHTLIFE",
          typeName: "🌙 Trải Nghiệm Về Đêm",
          poiName: "Chill Phố Đi Bộ & Rooftop Ngắm Landmark 81",
          area: "Trung tâm Quận 1",
          desc: "Dạo bước trên phố đi bộ lộng gió, nghe nhạc đường phố hoặc nhâm nhi cocktail ngắm toàn cảnh thành phố.",
          tip: "Thời tiết sau 21h rất mát mẻ, thích hợp đi dạo bộ thư giãn sau bữa tối no nê.",
          img: "https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&w=600&q=80",
          costRatio: 0.04
        }
      ]
    },
    {
      day: 2,
      title: "Ngày 2: Chợ Lớn Di Sản, Văn Hóa Người Hoa & Đỉnh Cao Landmark 81",
      tagline: "Hành trình ngược dòng thời gian tại Quận 5 và vươn mình lên nóc nhà Đông Nam Á Landmark 81.",
      slots: [
        {
          time: "07:30 - 09:00",
          type: "FOOD",
          typeName: "🍜 Bữa Sáng Chợ Lớn",
          poiName: "Hủ Tiếu Mì Thiệu Ký (Mì Kéo Tay 70 Năm)",
          area: "Hẻm 66 Lê Đại Hành, Quận 11 / Quận 5",
          desc: "Mì tươi làm thủ công truyền qua 3 thế hệ, sợi mì dai vàng óng thơm phức cùng xá xíu mềm thơm và tóp mỡ giòn rụm.",
          tip: "Nên gọi một tô mì khô thập cẩm kèm chén nước lèo sườn mềm thanh ngọt bốc khói nghi ngút.",
          img: "https://images.unsplash.com/photo-1547928576-a4a33237cbc3?auto=format&fit=crop&w=600&q=80",
          costRatio: 0.04
        },
        {
          time: "09:30 - 11:30",
          type: "ATTRACTION",
          typeName: "🎡 Tâm Linh & Văn Hóa",
          poiName: "Chùa Bà Thiên Hậu & Chợ Bình Tây",
          area: "Nguyễn Trãi, Quận 5",
          desc: "Chiêm ngưỡng kiến trúc chạm khắc phù điêu gốm sứ tinh xảo, nhang vòng khổng lồ và không gian chợ đầu mối trăm tuổi.",
          tip: "Mua một vòng nhang cầu an để ghi tên và treo lên mái vòm ngôi chùa cổ kính hơn 260 năm.",
          img: "https://images.unsplash.com/photo-1569154941061-e231b4725ef1?auto=format&fit=crop&w=600&q=80",
          costRatio: 0.02
        },
        {
          time: "12:00 - 13:30",
          type: "FOOD",
          typeName: "🍜 Bữa Trưa Điểm Sấm",
          poiName: "Dimsum Tiến Phát (Thiên Đường Điểm Sấm Chợ Lớn)",
          area: "Ký Hòa, Quận 5",
          desc: "Thưởng thức các xửng hấp nóng hổi: há cảo tôm thủy tinh, xíu mại cua, bánh cuốn tôm tươi và trà Ô Long hảo hạng.",
          tip: "Nên thử món chân gà tàu xì và bánh bao kim sa trứng muối tan chảy béo ngậy.",
          img: "https://images.unsplash.com/photo-1496116218417-1a781b1c416c?auto=format&fit=crop&w=600&q=80",
          costRatio: 0.075
        },
        {
          time: "14:00 - 16:00",
          type: "ATTRACTION",
          typeName: "🎨 Nghệ Thuật & Mỹ Thuật",
          poiName: "Bảo Tàng Mỹ Thuật TP.HCM",
          area: "Phó Đức Chính, Quận 1",
          desc: "Tòa dinh thự kiến trúc Baroque kết hợp Art Deco của gia đình chú Hỏa với thang máy cổ đầu tiên tại Sài Gòn.",
          tip: "Khu vực hành lang và cửa sổ kính màu tầng 2 là góc check-in nghệ thuật mang đậm phong cách vintage.",
          img: "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=600&q=80",
          costRatio: 0.02
        },
        {
          time: "16:30 - 18:30",
          type: "ATTRACTION",
          typeName: "🎡 Trải Nghiệm Tầm Cao",
          poiName: "Đài Quan Sát Landmark 81 SkyView (Tầng 81)",
          area: "720A Điện Biên Phủ, Quận Bình Thạnh",
          desc: "Vút lên độ cao 461m bằng thang máy tốc độ cao, ngắm trọn khúc uốn lượn sông Sài Gòn và trải nghiệm cầu kính SkyTouch.",
          tip: "Lên đài quan sát vào lúc 17h00 để ngắm được cả cảnh ban ngày lẫn thời khắc thành phố rực rỡ lên đèn.",
          img: "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?auto=format&fit=crop&w=600&q=80",
          costRatio: 0.09
        },
        {
          time: "19:00 - 21:30",
          type: "FOOD",
          typeName: "🍜 Bữa Tối Du Thuyền",
          poiName: "Saigon Princess River Dining Cruise",
          area: "Bến Nhà Rồng, Quận 4",
          desc: "Dùng bữa tối fine-dining 4 món đẳng cấp giữa làn gió mát rượi, du thuyền lướt êm ả qua các cây cầu biểu tượng.",
          tip: "Thưởng thức set menu cá hồi áp chảo hoặc sườn cừu đút lò cùng tiếng kèn saxophone du dương.",
          img: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=600&q=80",
          costRatio: 0.12
        },
        {
          time: "21:45 - 23:00",
          type: "NIGHTLIFE",
          typeName: "🌙 Dạo Phố Về Đêm",
          poiName: "Phố Tây Bùi Viện / Cầu Ánh Sao Lãng Mạn",
          area: "Quận 1 / Quận 7",
          desc: "Tận hưởng không khí âm nhạc sôi động náo nhiệt hoặc dạo bộ thảnh thơi tại hồ Bán Nguyệt lộng gió.",
          tip: "Nếu thích sự yên tĩnh lãng mạn, Cầu Ánh Sao là điểm đến hoàn hảo cho cặp đôi.",
          img: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=600&q=80",
          costRatio: 0.035
        }
      ]
    },
    {
      day: 3,
      title: "Ngày 3: Ngoại Ô Lịch Sử, Ẩm Thực Nam Bộ & Mua Sắm Đặc Sản",
      tagline: "Khám phá huyền thoại Củ Chi hoặc Thảo Cầm Viên trăm tuổi, bánh xèo giòn rụm và rinh quà về nhà.",
      slots: [
        {
          time: "07:30 - 08:30",
          type: "FOOD",
          typeName: "🍜 Bữa Sáng Đặc Sản",
          poiName: "Bánh Mì Huỳnh Hoa (Bánh Mì Ô Môi Nổi Tiếng)",
          area: "26 Lê Thị Riêng, Quận 1",
          desc: "Ổ bánh mì đặc biệt với 6 tầng nhân: pa-tê béo ngậy, bơ tươi, chả lụa, thịt nguội, dăm bông và đồ chua giòn ngọt.",
          tip: "Nên dặn quán để ớt riêng nếu bạn không ăn được cay nồng.",
          img: "https://images.unsplash.com/photo-1509722747041-616f39b57569?auto=format&fit=crop&w=600&q=80",
          costRatio: 0.03
        },
        {
          time: "09:00 - 11:45",
          type: "ATTRACTION",
          typeName: "🎡 Tham Quan Lịch Sử",
          poiName: "Địa Đạo Củ Chi (Vùng Đất Thép Kỳ Vĩ)",
          area: "Huyện Củ Chi",
          desc: "Khám phá hệ thống đường hầm ngầm dài hơn 250km được ví như kỳ quan nghệ thuật quân sự độc nhất vô nhị.",
          tip: "Trải nghiệm chui thử hầm địa đạo thu nhỏ và thưởng thức khoai mì luộc chấm muối mè thơm bùi.",
          img: "https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=600&q=80",
          costRatio: 0.06
        },
        {
          time: "12:15 - 13:45",
          type: "FOOD",
          typeName: "🍜 Bữa Trưa Đồng Quê",
          poiName: "Bánh Xèo Tôm Nhảy & Chả Giò Cô Ba",
          area: "Quận 3",
          desc: "Bánh xèo vàng ươm giòn rụm với tôm tươi nhảy tanh tách, thịt ba chỉ, giá đỗ cuốn kèm rổ rau rừng Tây Ninh tươi mát.",
          tip: "Chấm ngập cuốn bánh xèo vào chén nước mắm chua ngọt pha tỏi ớt băm nhuyễn chuẩn vị Nam Bộ.",
          img: "https://images.unsplash.com/photo-1559847844-5315695dadae?auto=format&fit=crop&w=600&q=80",
          costRatio: 0.05
        },
        {
          time: "14:15 - 16:30",
          type: "SHOPPING",
          typeName: "🛍️ Mua Sắm Đặc Sản Làm Quà",
          poiName: "Chợ Bến Thành & Cửa Hàng Đặc Sản Sài Gòn",
          area: "Quận 1",
          desc: "Lựa chọn các đặc sản nổi tiếng: Cà phê Robusta / Culi rang xay, hạt điều Bình Phước, kẹo dừa Bến Tre, khô cá lóc.",
          tip: "Khách hàng của WanderMatch được giảm 10% tại các quầy đối tác B2B uy tín trong chợ.",
          img: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=600&q=80",
          costRatio: 0.06
        },
        {
          time: "17:00 - 18:30",
          type: "EXPERIENCE",
          typeName: "☕ Trà Chiều & Tiễn Sân Bay",
          poiName: "Saigon Marina Lounge & Tiễn Sân Bay Tân Sơn Nhất",
          area: "Bến Bạch Đằng / Tân Bình",
          desc: "Nhâm nhi ly mocktail mát lạnh bên khúc quanh sông, xe riêng đón đưa ra sân bay làm thủ tục an toàn chu đáo.",
          tip: "Xe WanderMatch VIP đưa đón thẳng sảnh ga đi Quốc Nội / Quốc Tế Tân Sơn Nhất.",
          img: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80",
          costRatio: 0.05
        }
      ]
    },
    {
      day: 4,
      title: "Ngày 4: Sài Gòn Đương Đại, Nghệ Thuật Đô Thị & Thư Giãn Thảo Điền",
      tagline: "Tận hưởng không gian nghệ thuật đương đại, khu phố Tây Thảo Điền và liệu trình spa phục hồi.",
      slots: [
        {
          time: "08:30 - 10:00",
          type: "FOOD",
          typeName: "🍜 Brunch Buổi Sáng",
          poiName: "The Vintage Emporium Thảo Điền",
          area: "Thảo Điền, TP. Thủ Đức",
          desc: "Bữa sáng phong cách Địa Trung Hải với trứng Benedict, bánh mì nướng bơ tươi và nước ép detox thanh lọc cơ thể.",
          tip: "Ngồi cạnh hồ bơi trong sân vườn xanh mát để cảm nhận sự tĩnh lặng hiếm có giữa lòng Sài Gòn.",
          img: "https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?auto=format&fit=crop&w=600&q=80",
          costRatio: 0.05
        },
        {
          time: "10:30 - 12:30",
          type: "ATTRACTION",
          typeName: "🎨 Nghệ Thuật Đương Đại",
          poiName: "The Factory Contemporary Arts Centre",
          area: "Nguyễn Ư Dĩ, Thảo Điền",
          desc: "Trung tâm nghệ thuật đương đại quy mô container đầu tiên tại Việt Nam với các triển lãm thị giác độc đáo.",
          tip: "Khu vực trưng bày tranh sơn dầu và tác phẩm điêu khắc ánh sáng là nơi không thể bỏ lỡ.",
          img: "https://images.unsplash.com/photo-1518998053901-5348d3961a04?auto=format&fit=crop&w=600&q=80",
          costRatio: 0.03
        },
        {
          time: "13:00 - 14:30",
          type: "FOOD",
          typeName: "🍜 Bữa Trưa Ẩm Thực Xanh",
          poiName: "The Deck Saigon (Bên Bờ Sông Sài Gòn)",
          area: "Nguyễn Văn Hưởng, Thảo Điền",
          desc: "Thưởng thức ẩm thực Pan-Asian hiện đại trên sàn gỗ vươn sát mặt sông lộng gió với hải sản tươi ngon.",
          tip: "Món gỏi bưởi tôm sú và cá chẽm hấp gừng hành là gợi ý tuyệt hảo cho bữa trưa nhẹ nhàng.",
          img: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=600&q=80",
          costRatio: 0.09
        },
        {
          time: "15:00 - 17:00",
          type: "EXPERIENCE",
          typeName: "💆 Phục Hồi & Thư Giãn",
          poiName: "Herbal Luxury Spa Bấm Huyệt Toàn Thân",
          area: "Quận 1",
          desc: "Liệu trình xông hơi đá muối Himalaya kết hợp massage tinh dầu thảo dược thiên nhiên xóa tan mệt mỏi.",
          tip: "Trà gừng ấm mật ong được phục vụ miễn phí sau khi hoàn thành buổi trị liệu.",
          img: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=600&q=80",
          costRatio: 0.08
        },
        {
          time: "17:30",
          type: "EXPERIENCE",
          typeName: "✈️ Tiễn Sân Bay Về Nhà",
          poiName: "Sân Bay Quốc Tế Tân Sơn Nhất",
          area: "Quận Tân Bình",
          desc: "Xe đưa đón riêng WanderMatch hoàn tất lịch trình, đưa quý khách về an toàn.",
          tip: "Nhận voucher hoàn tiền 300.000đ từ WanderMatch cho chuyến đi tiếp theo.",
          img: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=600&q=80",
          costRatio: 0.00
        }
      ]
    }
  ],

  dalat: [
    {
      day: 1,
      title: "Ngày 1: Săn Mây Cầu Đất, Cà Phê Rừng Thông & Chợ Đêm Đà Lạt",
      tagline: "Đón bình minh trên biển mây, lẩu gà lá é cay nồng và sữa đậu nành nóng ấm góc chợ đêm.",
      slots: [
        {
          time: "05:30 - 07:45",
          type: "EXPERIENCE",
          typeName: "🌅 Săn Mây Đỉnh Đồi",
          poiName: "Đồi Chè Cầu Đất & Thảm Gỗ Săn Mây",
          area: "Xã Trạm Hành, Đà Lạt",
          desc: "Đón những tia nắng đầu tiên xuyên qua biển mây bồng bềnh phủ kín thung lũng đồi chè xanh ngát.",
          tip: "Nên mang áo khoác ấm vì nhiệt độ sáng sớm khoảng 14-16°C, có gió lạnh.",
          img: "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=600&q=80",
          costRatio: 0.03
        },
        {
          time: "08:15 - 09:30",
          type: "FOOD",
          typeName: "🍜 Bữa Sáng Đà Lạt",
          poiName: "Bánh Mì Xíu Mại Hoàng Diệu",
          area: "26 Hoàng Diệu, Đà Lạt",
          desc: "Chén xíu mại béo ngậy thơm nức mũi với nước súp đậm đà, da heo mềm sần sật và bánh mì giòn rụm.",
          tip: "Thêm chút sa tế cay nồng của quán để giữ ấm cơ thể trong tiết trời se lạnh.",
          img: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80",
          costRatio: 0.035
        },
        {
          time: "10:00 - 11:45",
          type: "ATTRACTION",
          typeName: "🎡 Di Sản & Tâm Linh",
          poiName: "Ga Đà Lạt & Chùa Linh Phước (Chùa Ve Chai)",
          area: "Phường 10 / Trại Mát",
          desc: "Nhà ga xe lửa răng cưa cổ kính kiến trúc Pháp và ngôi chùa đính mảnh sành sứ tinh xảo với rồng dài 49m.",
          tip: "Có thể trải nghiệm chuyến tàu hỏa cổ 7km từ Ga Đà Lạt xuống Trại Mát rất thơ mộng.",
          img: "https://images.unsplash.com/photo-1590523741831-ab7e8b8f9c7f?auto=format&fit=crop&w=600&q=80",
          costRatio: 0.04
        },
        {
          time: "12:00 - 13:30",
          type: "FOOD",
          typeName: "🍜 Bữa Trưa Cay Nồng",
          poiName: "Lẩu Gà Lá É Tao Ngộ (Chính Gốc)",
          area: "Số 5 Đường 3/4, Đà Lạt",
          desc: "Nồi lẩu gà nóng hổi thơm phức lá é the cay, ớt xiêm xanh cay nồng và măng le giòn sần sật.",
          tip: "Lá é nhúng vào nồi nước sôi vừa chín tới ăn ngay để giữ trọn vị giòn ngọt thanh tao.",
          img: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=600&q=80",
          costRatio: 0.07
        },
        {
          time: "14:30 - 16:30",
          type: "CAFE",
          typeName: "☕ Cafe View Thung Lũng",
          poiName: "Tiệm Cà Phê Túi Mơ To / Cheo Veooo",
          area: "Hẻm 31 Sào Nam, Phường 11",
          desc: "Ngồi dưới hiên nhà gỗ xưa ngắm vườn cúc họa mi trắng muốt và đồi thông xanh rì rào trong gió.",
          tip: "Thưởng thức ly trà đào cam sả nóng hoặc cafe trứng ấm áp béo ngậy.",
          img: "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=600&q=80",
          costRatio: 0.04
        },
        {
          time: "17:00 - 18:30",
          type: "EXPERIENCE",
          typeName: "🌅 Check-in Biểu Tượng",
          poiName: "Hồ Xuân Hương & Quảng Trường Lâm Viên",
          area: "Trung tâm Đà Lạt",
          desc: "Dạo quanh hồ nước thơ mộng, check-in với nụ hoa Atiso khổng lồ bằng kính màu và hoa dã quỳ.",
          tip: "Thuê xe đạp đôi đạp quanh hồ lúc chiều tà là trải nghiệm rất lãng mạn.",
          img: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80",
          costRatio: 0.02
        },
        {
          time: "19:00 - 21:00",
          type: "FOOD",
          typeName: "🍜 Bữa Tối Đường Phố",
          poiName: "Bánh Tráng Nướng Dì Đinh & Nem Nướng Bà Hùng",
          area: "Hoàng Diệu / Phan Đình Phùng",
          desc: "Bánh tráng nướng 'Pizza Đà Lạt' giòn tan thơm bơ trứng pate và nem nướng cuộn bánh tráng chấm tương đậu.",
          tip: "Nước chấm tương đậu phộng ấm nóng của Bà Hùng là bí quyết gia truyền hơn 30 năm.",
          img: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=600&q=80",
          costRatio: 0.05
        },
        {
          time: "21:15 - 23:00",
          type: "NIGHTLIFE",
          typeName: "🌙 Chợ Đêm Phố Núi",
          poiName: "Chợ Đêm Đà Lạt & Sữa Đậu Nành Nóng Hổi",
          area: "Khu Hoà Bình, Đà Lạt",
          desc: "Hòa mình vào không khí nhộn nhịp, thưởng thức ly sữa đậu nành nóng hổi kèm bánh sừng bò, bánh tiêu.",
          tip: "Ngồi ở các bậc thang dốc chợ đêm để ngắm toàn cảnh dòng người qua lại vui vẻ.",
          img: "https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&w=600&q=80",
          costRatio: 0.03
        }
      ]
    },
    {
      day: 2,
      title: "Ngày 2: Máng Trượt Datanla, Cáp Treo Đồi Robin & Lẩu Bò Ba Toa",
      tagline: "Trải nghiệm cảm giác mạnh xuyên rừng thông, vãn cảnh thiền viện thanh tịnh và lẩu bò ấm cúng.",
      slots: [
        {
          time: "08:00 - 09:30",
          type: "FOOD",
          typeName: "🍜 Bữa Sáng Bánh Căn",
          poiName: "Bánh Căn Lệ Yersin (Lòng Đào & Xíu Mại)",
          area: "27/44 Yersin, Phường 10",
          desc: "Những chiếc bánh căn giòn rụm nướng trên khuôn đất nung với trứng cút lòng đào dẻo quánh chấm mỡ hành xíu mại.",
          tip: "Nên gọi bánh căn trứng gà và xíu mại chén thêm một ly sữa chua phô mai tráng miệng.",
          img: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80",
          costRatio: 0.04
        },
        {
          time: "10:00 - 12:00",
          type: "ATTRACTION",
          typeName: "🎢 Cảm Giác Mạnh Rừng Thông",
          poiName: "Máng Trượt Thác Datanla (Dài Nhất Đông Nam Á)",
          area: "Đèo Prenn, Đà Lạt",
          desc: "Lướt xe trượt 2.400m uốn lượn ngoạn mục qua cánh rừng thông nguyên sinh và ngắm nhìn thác Datanla bọt tung trắng xóa.",
          tip: "Tự chủ động điều khiển cần phanh tay để kiểm soát tốc độ trượt theo ý muốn.",
          img: "https://images.unsplash.com/photo-1590523741831-ab7e8b8f9c7f?auto=format&fit=crop&w=600&q=80",
          costRatio: 0.08
        },
        {
          time: "12:30 - 14:00",
          type: "FOOD",
          typeName: "🍜 Bữa Trưa Cơm Niêu",
          poiName: "Cơm Niêu Như Ngọc Đà Lạt",
          area: "19/8 Hồ Tùng Mậu, Phường 3",
          desc: "Cơm niêu đập giòn rụm ăn cùng cá kho tộ nồi đất, canh atiso hầm giò heo ngọt lịm và cà pháo mắm tôm.",
          tip: "Món canh hoa atiso tươi hầm giò heo là vị thuốc giải nhiệt bổ dưỡng của xứ lạnh.",
          img: "https://images.unsplash.com/photo-1547928576-a4a33237cbc3?auto=format&fit=crop&w=600&q=80",
          costRatio: 0.065
        },
        {
          time: "14:30 - 16:30",
          type: "ATTRACTION",
          typeName: "🎡 Cáp Treo & Thiền Viện",
          poiName: "Cáp Treo Đồi Robin & Thiền Viện Trúc Lâm",
          area: "Đồi Robin / Hồ Tuyền Lâm",
          desc: "Tuyến cáp treo lơ lửng trên biển thông ngắm toàn cảnh thành phố, ghé thăm ngôi thiền viện thanh tịnh soi bóng hồ Tuyền Lâm.",
          tip: "Đi dạo men theo rặng trúc xanh xuống bến thuyền Hồ Tuyền Lâm để ngắm mặt hồ phẳng lặng.",
          img: "https://images.unsplash.com/photo-1569154941061-e231b4725ef1?auto=format&fit=crop&w=600&q=80",
          costRatio: 0.05
        },
        {
          time: "17:00 - 18:30",
          type: "CAFE",
          typeName: "☕ Hoàng Hôn Đồi Núi",
          poiName: "Tiệm Cà Phê Hoàng Hôn Chiều",
          area: "Dốc số 9, Trại Mát",
          desc: "Ngắm khoảnh khắc hoàng hôn buông xuống thung lũng với ánh đèn lồng nhà kính bắt đầu thắp sáng rực rỡ.",
          tip: "Từ 17h30 các nông trại nhà kính đồng loạt bật đèn tạo nên 'kinh đô ánh sáng' huyền ảo.",
          img: "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=600&q=80",
          costRatio: 0.04
        },
        {
          time: "19:00 - 21:00",
          type: "FOOD",
          typeName: "🍜 Bữa Tối Lẩu Bò",
          poiName: "Lẩu Bò Quán Gỗ Ba Toa (Chính Hiệu)",
          area: "1/29 Hoàng Diệu, Phường 5",
          desc: "Nồi lẩu bò thơm ngút ngàn với thịt bắp, nạm, gân bò tươi mềm hầm nhừ cùng đậu hũ và rau cải cúc xanh non mơn mởn.",
          tip: "Chấm thịt bò vào chén chao ớt sa tế pha đường chanh béo ngậy khó cưỡng.",
          img: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=600&q=80",
          costRatio: 0.08
        },
        {
          time: "21:30 - 23:00",
          type: "EXPERIENCE",
          typeName: "🎵 Đêm Nhạc Live Acoustic",
          poiName: "Mây Lang Thang / Cung Tơ Chiều",
          area: "Hoàng Hoa Thám / Đồi Gió",
          desc: "Thưởng thức đêm nhạc acoustic mộc mạc giữa không gian se lạnh, sưởi ấm bên tách trà gừng thơm lừng.",
          tip: "Cần đặt vé trước cho các đêm nhạc cuối tuần có ca sĩ nổi tiếng biểu diễn.",
          img: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=600&q=80",
          costRatio: 0.07
        }
      ]
    },
    {
      day: 3,
      title: "Ngày 3: Puppy Farm, Vườn Dâu Công Nghệ Cao & Lẩu Rau Leguda",
      tagline: "Vui chơi với các bạn cún cưng, tự tay hái dâu tây chín mọng và thưởng thức buffet rau sạch đỉnh đồi.",
      slots: [
        {
          time: "08:00 - 10:30",
          type: "ATTRACTION",
          typeName: "🐕 Nông Trại Cún Cưng & Vườn Dâu",
          poiName: "Nông Trại Puppy Farm & Vườn Bí Ngô Khổng Lồ",
          area: "Đường Cam Ly, Phường 7",
          desc: "Tương tác với hơn 100 chú cún đáng yêu (Corgi, Husky, Alaska), tham quan vườn dâu tây giàn treo và bí ngô 100kg.",
          tip: "Tự tay hái dâu tây giống New Zealand chín mọng mua về làm quà cho người thân.",
          img: "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=600&q=80",
          costRatio: 0.07
        },
        {
          time: "11:30 - 13:00",
          type: "FOOD",
          typeName: "🍜 Buffet Rau Không Giới Hạn",
          poiName: "Lẩu Rau Leguda (Đỉnh Đồi Robin)",
          area: "Đồi Robin, Phường 3",
          desc: "Thưởng thức hơn 20 loại rau sạch Đà Lạt tươi ngon không giới hạn cùng nước lẩu chua cay và lẩu sa tế thơm nồng.",
          tip: "Vừa ăn lẩu vừa ngắm nhìn trọn vẹn toàn cảnh thành phố Đà Lạt từ đỉnh đồi cao lộng gió.",
          img: "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=600&q=80",
          costRatio: 0.07
        },
        {
          time: "13:30 - 15:30",
          type: "SHOPPING",
          typeName: "🛍️ Mua Sắm Đặc Sản Làm Quà",
          poiName: "L'angfarm Store & Chợ Đà Lạt",
          area: "Trung tâm Đà Lạt",
          desc: "Lựa chọn các đặc sản nổi tiếng: Mứt dâu tằm, atiso túi lọc, hồng treo gió công nghệ Nhật Bản, trà Oolong.",
          tip: "Hồng treo gió và nước cốt dâu tằm là 2 món quà được ưa chuộng nhất của phố núi.",
          img: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=600&q=80",
          costRatio: 0.06
        },
        {
          time: "16:00 - 17:30",
          type: "EXPERIENCE",
          typeName: "✈️ Tiễn Sân Bay Liên Khương",
          poiName: "Sân Bay Liên Khương (DLI)",
          area: "Huyện Đức Trọng",
          desc: "Xe riêng WanderMatch đón tại khách sạn, đưa quý khách ra sân bay làm thủ tục lên chuyến bay về nhà.",
          tip: "Xe đưa đón riêng có phục vụ nước suối lạnh và wifi miễn phí trên suốt cung đường đèo.",
          img: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=600&q=80",
          costRatio: 0.04
        }
      ]
    },
    {
      day: 4,
      title: "Ngày 4: Làng Cổ K'Ho, Đồi Cỏ Hồng & Thác Voi Hùng Vĩ",
      tagline: "Tìm hiểu văn hóa cồng chiêng bản địa, chiêm ngưỡng thác nước hùng vĩ và đồi cỏ hồng mộng mơ.",
      slots: [
        {
          time: "08:00 - 10:30",
          type: "ATTRACTION",
          typeName: "🌲 Thiên Nhiên Hoang Sơ",
          poiName: "Làng Cù Lần Dưới Chân Langbiang",
          area: "Huyện Lạc Dương",
          desc: "Ngôi làng cổ tích nằm lọt thỏm giữa thung lũng rừng thông nguyên sinh với trải nghiệm xe Jeep vượt suối cạn cực đã.",
          tip: "Ngồi xe Jeep lội suối là trải nghiệm thú vị nhất mà bạn không nên bỏ lỡ.",
          img: "https://images.unsplash.com/photo-1518998053901-5348d3961a04?auto=format&fit=crop&w=600&q=80",
          costRatio: 0.08
        },
        {
          time: "11:30 - 13:00",
          type: "FOOD",
          typeName: "🍜 Bữa Trưa Bản Đôn",
          poiName: "Cơm Lam Gà Nướng Tây Nguyên",
          area: "Chân núi Langbiang",
          desc: "Thịt gà thả đồi ướp lá mắc mật nướng trên than củi giòn da ngọt thịt ăn cùng ống cơm lam nướng dẻo quánh.",
          tip: "Chấm thịt gà vào chén muối ớt xanh hột giã nhuyễn thơm cay nồng nàn.",
          img: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=600&q=80",
          costRatio: 0.08
        },
        {
          time: "14:00 - 16:00",
          type: "ATTRACTION",
          typeName: "🏛️ Di Tích Hoàng Gia",
          poiName: "Dinh I & Cung Nam Phương Hoàng Hậu",
          area: "Đường Trần Quang Diệu, Phường 10",
          desc: "Biệt điện xa hoa của Vua Bảo Đại giữa rừng tràm cổ thụ với kiến trúc tân cổ điển Pháp quý phái.",
          tip: "Khu vực vườn hoa cẩm tú cầu nở rộ bên hông dinh thự là nơi chụp ảnh tuyệt đẹp.",
          img: "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=600&q=80",
          costRatio: 0.04
        },
        {
          time: "16:30",
          type: "EXPERIENCE",
          typeName: "✈️ Tiễn Sân Bay",
          poiName: "Sân Bay Liên Khương",
          area: "Đức Trọng",
          desc: "Hoàn tất chuyến đi Đà Lạt đáng nhớ, xe tiễn sân bay chu đáo.",
          tip: "Hẹn gặp lại quý khách trên những hành trình tiếp theo của WanderMatch!",
          img: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=600&q=80",
          costRatio: 0.00
        }
      ]
    }
  ],

  danang: [
    {
      day: 1,
      title: "Ngày 1: Bán Đảo Sơn Trà, Biển Mỹ Khê & Cầu Rồng Phun Lửa",
      tagline: "Hít hà gió biển miền Trung, viếng chùa Linh Ứng tượng Phật 67m và thưởng thức hải sản Năm Đảnh tươi sống.",
      slots: [
        {
          time: "07:30 - 09:00",
          type: "FOOD",
          typeName: "🍜 Bữa Sáng Mì Quảng",
          poiName: "Mì Quảng Bà Mua (Chính Gốc)",
          area: "19 Trần Bình Trọng, Hải Châu, Đà Nẵng",
          desc: "Tô mì Quảng vàng ươm với tôm đất, thịt ba chỉ, trứng cút ngấm gia vị ăn cùng bánh tráng mè nướng giòn rụm và rau sống Trà Quế.",
          tip: "Vắt chanh, thêm tí ớt xanh miền Trung và bẻ nhỏ bánh tráng mè trộn đều thưởng thức.",
          img: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80",
          costRatio: 0.035
        },
        {
          time: "09:30 - 11:30",
          type: "ATTRACTION",
          typeName: "🎡 Tâm Linh & Toàn Cảnh",
          poiName: "Bán Đảo Sơn Trà & Chùa Linh Ứng Bãi Bụt",
          area: "Bán đảo Sơn Trà, Đà Nẵng",
          desc: "Chiêm ngưỡng tượng Phật Bà Quan Thế Âm cao 67m hướng ra biển Đông, phóng tầm mắt ngắm trọn vẹn vịnh Đà Nẵng xanh ngắt.",
          tip: "Đoạn đường lên chùa có thể bắt gặp đàn Voọc chà vá chân nâu quý hiếm chuyền cành trên tán cây rừng.",
          img: "https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?auto=format&fit=crop&w=600&q=80",
          costRatio: 0.02
        },
        {
          time: "12:00 - 13:30",
          type: "FOOD",
          typeName: "🍜 Bữa Trưa Đặc Sản",
          poiName: "Đặc Sản Trần (Bánh Tráng Cuốn Thịt Heo Hai Đầu Da)",
          area: "04 Lê Duẩn, Hải Châu",
          desc: "Miếng thịt heo luộc độc đáo với hai đầu da mềm giòn cuốn cùng bánh tráng phơi sương, rau rừng và mắm nêm đậm đà trứ danh.",
          tip: "Chén mắm nêm nguyên chất pha dứa băm nhuyễn và ớt tỏi là tinh hoa của món ăn này.",
          img: "https://images.unsplash.com/photo-1547928576-a4a33237cbc3?auto=format&fit=crop&w=600&q=80",
          costRatio: 0.065
        },
        {
          time: "14:30 - 17:00",
          type: "EXPERIENCE",
          typeName: "🏖️ Tắm Biển Mỹ Khê",
          poiName: "Bãi Biển Mỹ Khê & Thể Thao Biển",
          area: "Đường Võ Nguyên Giáp, Sơn Trà",
          desc: "Tắm biển trên bãi cát trắng mịn thoai thoải, làn nước trong xanh biếc và trải nghiệm chèo SUP hoặc dù lượn cano.",
          tip: "Thời điểm tắm biển lý tưởng nhất là từ 15h30 khi nắng bắt đầu dịu và sóng êm.",
          img: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80",
          costRatio: 0.03
        },
        {
          time: "18:00 - 20:00",
          type: "FOOD",
          typeName: "🍜 Đại Tiệc Hải Sản",
          poiName: "Hải Sản Năm Đảnh / Bé Mặn (Tươi Sống)",
          area: "K139/H59/38 Trần Quang Khải, Sơn Trà",
          desc: "Thưởng thức ghẹ hấp bia, tôm tít rang muối, ốc hương sốt trứng muối bánh mì và mực ống cơm nướng sa tế cay nồng.",
          tip: "Quán Năm Đảnh rất đông, nên đến từ 17h45 để chọn được hải sản tươi ngon nhất và có bàn ngồi thoải mái.",
          img: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=600&q=80",
          costRatio: 0.10
        },
        {
          time: "20:30 - 22:30",
          type: "EXPERIENCE",
          typeName: "🌉 Biểu Tượng Cầu Rồng",
          poiName: "Xem Cầu Rồng Phun Lửa & Du Thuyền Sông Hàn",
          area: "Bờ Đông Sông Hàn, Đà Nẵng",
          desc: "Chiêm ngưỡng cảnh tượng Cầu Rồng phun lửa, phun nước vào lúc 21h00 cuối tuần và du thuyền thưởng ngoạn cầu quay sông Hàn.",
          tip: "Đứng ở khu vực đầu rồng phía đường Trần Hưng Đạo để chụp được góc ảnh phun lửa ngoạn mục nhất.",
          img: "https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&w=600&q=80",
          costRatio: 0.05
        }
      ]
    },
    {
      day: 2,
      title: "Ngày 2: Sun World Ba Na Hills, Check-in Cầu Vàng & Phố Cổ Hội An",
      tagline: "Chạm tay vào mây trời tại Cầu Vàng Bàn Tay Khổng Lồ và lạc bước trong phố cổ Hội An rực rỡ lồng đèn.",
      slots: [
        {
          time: "08:00 - 12:00",
          type: "ATTRACTION",
          typeName: "🎡 Kỳ Quan Cầu Vàng",
          poiName: "Sun World Ba Na Hills & Cầu Vàng Bàn Tay",
          area: "Thôn An Sơn, Hòa Ninh, Hòa Vang",
          desc: "Đi tuyến cáp treo đạt kỷ lục Guinness lên đỉnh núi Chúa, dạo bước trên Cầu Vàng độc nhất vô nhị và khám phá Làng Pháp.",
          tip: "Nên lên chuyến cáp sớm lúc 8h00 để check-in Cầu Vàng vắng người và chụp được những bức ảnh để đời.",
          img: "https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=600&q=80",
          costRatio: 0.12
        },
        {
          time: "12:00 - 13:30",
          type: "FOOD",
          typeName: "🍜 Buffet Quốc Tế 4 Sao",
          poiName: "Đại Tiệc Buffet Beer Plaza (Bà Nà Hills)",
          area: "Quảng trường Beer Plaza, Bà Nà Hills",
          desc: "Thưởng thức hơn 100 món ăn Á - Âu phong phú: thịt cừu nướng, xúc xích Đức, hải sản nướng và bia tươi thủ công mát lạnh.",
          tip: "Thưởng thức bia tươi hảo hạng trong lúc xem các nghệ sĩ quốc tế trình diễn nhảy múa sống động.",
          img: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=600&q=80",
          costRatio: 0.07
        },
        {
          time: "14:30 - 17:00",
          type: "ATTRACTION",
          typeName: "🏮 Di Sản Thế Giới",
          poiName: "Phố Cổ Hội An & Chùa Cầu Cổ Kính",
          area: "Phường Minh An, TP. Hội An",
          desc: "Dạo bước trên những con ngõ sơn vàng rợp bóng hoa giấy, chiêm ngưỡng Chùa Cầu hơn 400 năm tuổi và Nhà cổ Tấn Ký.",
          tip: "Thưởng thức ly Nước Mót thảo mộc sả chanh hạt sen thơm mát giá 15.000đ tại số 150 Trần Phú.",
          img: "https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?auto=format&fit=crop&w=600&q=80",
          costRatio: 0.035
        },
        {
          time: "17:15 - 18:45",
          type: "EXPERIENCE",
          typeName: "🛶 Thả Hoa Đăng Sông Hoài",
          poiName: "Thuyền Gỗ Sông Hoài & Thả Hoa Đăng Cầu An",
          area: "Bến thuyền Bạch Đằng, Hội An",
          desc: "Ngồi thuyền gỗ mộc mạc trôi êm đềm trên sông Hoài, tự tay thả những chiếc hoa đăng lấp lánh mang theo lời nguyện ước bình an.",
          tip: "Khoảnh khắc phố cổ đồng loạt lên đèn lúc 18h00 biến dòng sông thành một bức tranh huyền ảo rực rỡ.",
          img: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=600&q=80",
          costRatio: 0.035
        },
        {
          time: "19:00 - 20:30",
          type: "FOOD",
          typeName: "🍜 Đặc Sản Phố Cổ",
          poiName: "Cao Lầu Bá Lễ & Cơm Gà Hội An Bà Buội",
          area: "Phan Chu Trinh, Hội An",
          desc: "Tô cao lầu sợi vàng thơm nước tro giếng Bá Lễ cùng thịt xá xíu đậm đà, tóp mỡ giòn và đĩa cơm gà xé ngọt thơm da vàng óng.",
          tip: "Nước xốt cơm gà cay cay ngọt ngọt rưới đều lên đĩa cơm béo ngậy làm say lòng mọi thực khách.",
          img: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80",
          costRatio: 0.05
        },
        {
          time: "20:45 - 22:30",
          type: "EXPERIENCE",
          typeName: "🎭 Show Ký Ức Hội An",
          poiName: "Show Diễn Thực Cảnh Ký Ức Hội An / Chợ Đêm",
          area: "Công viên Ấn Tượng Hội An",
          desc: "Mãn nhãn với show diễn thực cảnh quy mô 500 diễn viên trên sân khấu nước tái hiện 400 năm lịch sử đô thị cổ Hội An.",
          tip: "Nếu không xem show, chợ đêm Nguyễn Hoàng với hàng trăm gian hàng đèn lồng rực rỡ là điểm dạo chơi tuyệt vời.",
          img: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=600&q=80",
          costRatio: 0.08
        }
      ]
    },
    {
      day: 3,
      title: "Ngày 3: Ngũ Hành Sơn, Làng Đá Non Nước & Chợ Hàn Mua Sắm",
      tagline: "Khám phá hang động kỳ vĩ Ngũ Hành Sơn, tinh hoa điêu khắc đá và mua sắm đặc sản miền Trung.",
      slots: [
        {
          time: "07:30 - 08:30",
          type: "FOOD",
          typeName: "🍜 Bữa Sáng Bún Chả Cá",
          poiName: "Bún Chả Cá Bà Phiến 30 Năm",
          area: "63 Lê Hồng Phong, Hải Châu",
          desc: "Tô bún chả cá thơm nức mũi với chả cá thu chiên vàng ruộm, nước dùng ngọt thanh hầm từ bí đỏ, bắp cải và măng tươi.",
          tip: "Ăn kèm hành hương tím ngâm chua ngọt giòn giòn và ớt xanh cay tê đầu lưỡi.",
          img: "https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?auto=format&fit=crop&w=600&q=80",
          costRatio: 0.035
        },
        {
          time: "09:00 - 11:30",
          type: "ATTRACTION",
          typeName: "⛰️ Động Huyền Không Kỳ Vĩ",
          poiName: "Danh Thắng Ngũ Hành Sơn & Làng Đá Non Nước",
          area: "Đường Huyền Trân Công Chúa, Ngũ Hành Sơn",
          desc: "Khám phá Động Huyền Không nơi ánh nắng rọi từ đỉnh vòm hang tạo nên vệt sáng thiêng liêng, viếng Chùa Tam Thai cổ tự.",
          tip: "Nên đi thang máy kính lên chùa Linh Ứng rồi đi bộ khám phá các hang động để đỡ mất sức.",
          img: "https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=600&q=80",
          costRatio: 0.05
        },
        {
          time: "12:00 - 13:30",
          type: "FOOD",
          typeName: "🍜 Bữa Trưa Bê Thui",
          poiName: "Bê Thui Cầu Mống Mười Hiển",
          area: "Điện Biên Phủ, Thanh Khê",
          desc: "Thịt bê thui chín tái hồng hào mềm ngọt, da bê vàng óng giòn sần sật cuốn rau sống chấm mắm nêm đậm đà thơm cay.",
          tip: "Kẹp thêm một lát chuối chát, khế chua và cọng ngò gai để tạo nên hương vị bùng nổ.",
          img: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=600&q=80",
          costRatio: 0.065
        },
        {
          time: "14:00 - 16:00",
          type: "SHOPPING",
          typeName: "🛍️ Mua Sắm Đặc Sản Làm Quà",
          poiName: "Chợ Hàn Đà Nẵng (Thiên Đường Đặc Sản)",
          area: "119 Trần Phú, Hải Châu",
          desc: "Thỏa sức mua sắm các đặc sản trứ danh: Chả bò Đà Nẵng loại 1, mực rim me sa tế, cá thiều tẩm, tré Bà Đệ, bánh khô mè.",
          tip: "Gian hàng đối tác B2B WanderMatch tại tầng 1 Chợ Hàn cam kết hàng mới xuất xưởng, hút chân không miễn phí.",
          img: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=600&q=80",
          costRatio: 0.06
        },
        {
          time: "16:30 - 17:30",
          type: "EXPERIENCE",
          typeName: "✈️ Tiễn Sân Bay Quốc Tế",
          poiName: "Sân Bay Quốc Tế Đà Nẵng (DAD)",
          area: "Hải Châu, Đà Nẵng",
          desc: "Xe riêng WanderMatch đưa tiễn quý khách ra sân bay làm thủ tục chuyến bay về, kết thúc hành trình trọn vẹn.",
          tip: "Sân bay Đà Nẵng nằm ngay trung tâm thành phố, thời gian di chuyển chỉ mất 15-20 phút.",
          img: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=600&q=80",
          costRatio: 0.03
        }
      ]
    },
    {
      day: 4,
      title: "Ngày 4: Rừng Dừa Bảy Mẫu Cẩm Thanh & Đạp Xe Làng Rau Trà Quế",
      tagline: "Trải nghiệm thuyền thúng xoay vòng vui nhộn, hương vị đồng quê Trà Quế và cafe cánh đồng lúa.",
      slots: [
        {
          time: "08:00 - 10:30",
          type: "EXPERIENCE",
          typeName: "🚣 Chèo Thuyền Thúng",
          poiName: "Khu Du Lịch Sinh Thái Rừng Dừa Bảy Mẫu",
          area: "Xã Cẩm Thanh, Hội An",
          desc: "Ngồi thuyền thúng len lỏi giữa rừng dừa nước bạt ngàn, xem nghệ nhân múa thúng xoay vòng điêu luyện và giăng lưới bắt cá.",
          tip: "Nhờ bác lái thúng làm tặng chiếc nhẫn, mắt kính, đồng hồ thắt từ lá dừa tươi độc đáo.",
          img: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=600&q=80",
          costRatio: 0.07
        },
        {
          time: "11:30 - 13:00",
          type: "FOOD",
          typeName: "🍜 Bữa Trưa Thảo Dược",
          poiName: "Nhà Hàng Làng Rau Trà Quế",
          area: "Thôn Trà Quế, Cẩm Hà, Hội An",
          desc: "Thưởng thức món tôm hữu Trà Quế, bánh xèo tôm đất rau sống và nước hạt chia sả chanh tươi mát.",
          tip: "Trải nghiệm thử làm một người nông dân cuốc đất, tưới nước cho các luống rau thơm ngát.",
          img: "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=600&q=80",
          costRatio: 0.06
        },
        {
          time: "13:30 - 15:30",
          type: "CAFE",
          typeName: "☕ Cafe Cánh Đồng Lúa",
          poiName: "Roving Chillhouse Hội An",
          area: "Vòng đai Cẩm Châu, Hội An",
          desc: "Thư giãn trên sàn gỗ giữa cánh đồng lúa xanh ngút ngàn, ngắm đàn cò trắng bay lượn và nhâm nhi dừa xiêm mát lạnh.",
          tip: "Góc chụp ảnh với lối đi bằng gỗ đâm thẳng ra giữa ruộng lúa là góc check-in hot nhất.",
          img: "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=600&q=80",
          costRatio: 0.04
        },
        {
          time: "16:00",
          type: "EXPERIENCE",
          typeName: "✈️ Tiễn Sân Bay Về Nhà",
          poiName: "Sân Bay Đà Nẵng",
          area: "Đà Nẵng",
          desc: "Xe đưa đón riêng hoàn tất hành trình 4 ngày 3 đêm rực rỡ tại Đà Nẵng - Hội An.",
          tip: "Cảm ơn quý khách đã tin tưởng dịch vụ du lịch bảo chứng WanderMatch 3.0!",
          img: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=600&q=80",
          costRatio: 0.00
        }
      ]
    }
  ]
};

function renderDetailedDayItinerary() {
  const container = document.getElementById('detailed-day-itinerary-container');
  if (!container) return;

  const budget = state.selectedBudget;
  const pax = state.selectedPax;
  const perPax = Math.round(budget / pax);
  const data = getCurrentDestData();
  const destName = data.name[state.currentLang] || data.name.vi;
  const hotelName = data.hotel[state.currentLang] || data.hotel.vi;

  const destKey = state.selectedDestination === 'blind' ? 'dalat' : state.selectedDestination;
  const daysCount = state.selectedDuration === '2d1n' ? 2 : state.selectedDuration === '4d3n' ? 4 : 3;
  const fullPlans = (DETAILED_DAY_PLANS[destKey] || DETAILED_DAY_PLANS['hochiminh']).slice(0, daysCount);

  // Tính chi phí phòng khách sạn phân bổ mỗi ngày
  const dailyHotelCost = Math.round((budget * 0.4) / Math.max(1, daysCount - 1));

  // Tab Header Buttons
  const activeTab = state.activeDayTab || 1;
  let tabsHtml = '';
  for (let d = 1; d <= daysCount; d++) {
    const isActive = activeTab === d;
    tabsHtml += `
      <button onclick="setActiveDayTab(${d})" class="px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
        isActive 
          ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 shadow-lg shadow-cyan-500/20' 
          : 'bg-slate-800/80 hover:bg-slate-700 text-slate-300 border border-slate-700/60'
      }">
        <i class="fa-solid fa-calendar-day"></i>
        <span>Ngày ${d}</span>
      </button>
    `;
  }
  const isAllActive = activeTab === 'ALL';
  tabsHtml += `
    <button onclick="setActiveDayTab('ALL')" class="px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
      isAllActive 
        ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-slate-950 shadow-lg shadow-emerald-500/20' 
        : 'bg-slate-800/80 hover:bg-slate-700 text-slate-300 border border-slate-700/60'
    }">
      <i class="fa-solid fa-layer-group"></i>
      <span>Xem Toàn Bộ ${daysCount} Ngày</span>
    </button>
  `;

  // Render các ngày tương ứng
  const daysToRender = isAllActive ? fullPlans : fullPlans.filter(p => p.day === activeTab);

  let daysHtml = daysToRender.map(dayPlan => {
    let dayFoodTotal = 0;
    let dayTicketTotal = 0;
    let dayTransitTotal = 0;

    const slotsHtml = dayPlan.slots.map(s => {
      // Tính toán chi phí thực tế theo ngân sách người dùng nhập
      const slotCost = Math.max(25000, Math.round((s.costRatio * budget) / 1000) * 1000);

      if (s.type === 'FOOD') dayFoodTotal += slotCost;
      else if (s.type === 'ATTRACTION') dayTicketTotal += slotCost;
      else dayTransitTotal += slotCost;

      const typeBadgeClass = s.type === 'FOOD' ? 'bg-amber-950/80 text-amber-300 border-amber-800' :
                             s.type === 'ATTRACTION' ? 'bg-cyan-950/80 text-cyan-300 border-cyan-800' :
                             s.type === 'CAFE' ? 'bg-rose-950/80 text-rose-300 border-rose-800' :
                             'bg-violet-950/80 text-violet-300 border-violet-800';

      return `
        <div class="timeline-stem flex gap-3.5 pb-5">
          <div class="flex flex-col items-center">
            <div class="w-8 h-8 rounded-full bg-cyan-500/20 border border-cyan-400 text-cyan-300 flex items-center justify-center font-bold text-xs shrink-0 shadow-md">
              <i class="fa-solid fa-clock"></i>
            </div>
          </div>

          <div class="flex-1 bg-slate-950/80 rounded-2xl p-4 border border-slate-800 hover:border-cyan-500/40 transition space-y-3">
            <div class="flex flex-wrap items-center justify-between gap-2">
              <div class="flex items-center gap-2">
                <span class="text-xs font-mono font-bold text-cyan-400 bg-cyan-950/80 px-2.5 py-0.5 rounded-full border border-cyan-800">
                  ${s.time}
                </span>
                <span class="text-[11px] font-semibold px-2 py-0.5 rounded border ${typeBadgeClass}">
                  ${s.typeName}
                </span>
              </div>
              <div class="text-xs font-black text-emerald-400 flex items-center gap-1 font-mono">
                <i class="fa-solid fa-receipt text-[10px]"></i> ~${slotCost.toLocaleString('vi-VN')}đ
                <span class="text-[10px] text-slate-500 font-sans font-normal">(trong gói)</span>
              </div>
            </div>

            <div class="flex gap-3.5 items-start">
              <img src="${s.img}" alt="${s.poiName}" class="w-20 h-20 rounded-xl object-cover shrink-0 border border-slate-700 shadow-md">
              <div class="flex-1 min-w-0">
                <h5 class="text-sm font-bold text-white">${s.poiName}</h5>
                <p class="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                  <i class="fa-solid fa-location-dot text-cyan-400 text-[10px]"></i> ${s.area}
                </p>
                <p class="text-xs text-slate-300 mt-1 leading-relaxed">${s.desc}</p>
                
                <div class="mt-2 text-[11px] text-amber-300 bg-amber-950/30 p-2 rounded-lg border border-amber-900/40 flex items-start gap-1.5 leading-snug">
                  <i class="fa-solid fa-lightbulb shrink-0 text-amber-400 mt-0.5"></i>
                  <span><strong>Mẹo AI:</strong> ${s.tip}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      `;
    }).join('');

    const dayTotalCost = dayFoodTotal + dayTicketTotal + dayTransitTotal + dailyHotelCost;

    return `
      <div class="bg-gradient-to-b from-slate-900 to-slate-950 rounded-2xl p-5 border border-slate-800 space-y-4">
        <div class="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
          <div>
            <div class="flex items-center gap-2">
              <span class="px-2.5 py-0.5 rounded-full text-xs font-black bg-cyan-500 text-slate-950">
                NGÀY ${dayPlan.day}
              </span>
              <h4 class="text-base lg:text-lg font-bold text-white">${dayPlan.title}</h4>
            </div>
            <p class="text-xs text-slate-400 mt-1">${dayPlan.tagline}</p>
          </div>
          <div class="text-right">
            <span class="text-[11px] text-slate-400">Ngân sách ngày ${dayPlan.day}:</span>
            <div class="text-base font-black text-emerald-400 font-mono">~${dayTotalCost.toLocaleString('vi-VN')} VNĐ</div>
          </div>
        </div>

        <!-- Timeline các mốc giờ trong ngày -->
        <div class="space-y-1">
          ${slotsHtml}
        </div>

        <!-- Khách sạn đêm -->
        <div class="bg-slate-900/90 p-3.5 rounded-xl border border-cyan-800/40 flex items-center justify-between text-xs">
          <div class="flex items-center gap-2.5 text-cyan-300">
            <i class="fa-solid fa-hotel text-base text-cyan-400"></i>
            <div>
              <span class="font-bold text-white">Nơi Nghỉ Đêm: ${hotelName}</span>
              <span class="text-[11px] text-slate-400 block">Cam kết phòng cứng SLA không overbooking • Phân bổ ~${dailyHotelCost.toLocaleString('vi-VN')}đ</span>
            </div>
          </div>
          <span class="px-2.5 py-1 rounded bg-emerald-950 text-emerald-300 font-bold text-[10px] border border-emerald-800">
            ĐÃ BẢO LÃNH
          </span>
        </div>

        <!-- Tổng kết tài chính trong ngày -->
        <div class="grid grid-cols-2 md:grid-cols-4 gap-2 text-[11px] bg-slate-950 p-3 rounded-xl border border-slate-800">
          <div>
            <span class="text-slate-400">🍜 Ăn uống:</span>
            <span class="font-bold text-amber-300 block">${dayFoodTotal.toLocaleString('vi-VN')}đ</span>
          </div>
          <div>
            <span class="text-slate-400">🎡 Vé & Trải nghiệm:</span>
            <span class="font-bold text-cyan-300 block">${dayTicketTotal.toLocaleString('vi-VN')}đ</span>
          </div>
          <div>
            <span class="text-slate-400">🚕 Di chuyển Grab:</span>
            <span class="font-bold text-violet-300 block">${dayTransitTotal.toLocaleString('vi-VN')}đ</span>
          </div>
          <div>
            <span class="text-slate-400">🏨 Phòng khách sạn:</span>
            <span class="font-bold text-emerald-300 block">${dailyHotelCost.toLocaleString('vi-VN')}đ</span>
          </div>
        </div>
      </div>
    `;
  }).join('');

  container.innerHTML = `
    <div class="glass-panel rounded-3xl p-6 lg:p-7 border-2 border-cyan-500/40 shadow-2xl space-y-6">
      
      <!-- Header Lịch Trình Chi Tiết -->
      <div class="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <span class="px-3 py-1 rounded-full text-xs font-black bg-cyan-500 text-slate-950 shadow tracking-wider uppercase">
            📅 BẢNG LỊCH TRÌNH CHI TIẾT TỪNG NGÀY THEO NGÂN SÁCH
          </span>
          <h3 class="text-xl lg:text-2xl font-extrabold text-white mt-2 flex items-center gap-2">
            <span>Hành Trình ${destName} (${daysCount} Ngày ${daysCount - 1} Đêm)</span>
          </h3>
          <p class="text-xs text-slate-300 mt-1">
            Tổng ngân sách: <strong class="text-emerald-400 font-mono">${budget.toLocaleString('vi-VN')} VNĐ</strong> (~${perPax.toLocaleString('vi-VN')}đ / khách) • Khách sạn: <strong class="text-cyan-300">${hotelName}</strong>
          </p>
        </div>

        <!-- Action Tools: In, Sao Chép, Thanh Toán -->
        <div class="flex flex-wrap items-center gap-2">
          <button onclick="printItinerary()" class="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition flex items-center gap-1.5 shadow">
            <i class="fa-solid fa-print"></i>
            <span>In PDF</span>
          </button>
          
          <button onclick="copyFullItineraryToClipboard()" class="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 text-xs font-semibold border border-cyan-800/60 transition flex items-center gap-1.5 shadow">
            <i class="fa-regular fa-copy"></i>
            <span>Sao Chép Bản Văn</span>
          </button>
          
          <button onclick="goToPaymentWithBudget()" class="px-4 py-2 rounded-xl btn-glow-emerald text-white text-xs font-black shadow-lg transition flex items-center gap-1.5">
            <i class="fa-solid fa-credit-card"></i>
            <span>Thanh Toán VietQR Ngay</span>
          </button>
        </div>
      </div>

      <!-- Day Navigation Tabs -->
      <div class="flex flex-wrap items-center gap-2">
        ${tabsHtml}
      </div>

      <!-- Danh Sách Lịch Trình Từng Ngày -->
      <div class="space-y-6">
        ${daysHtml}
      </div>

      <!-- Bottom Checkout CTA -->
      <div class="pt-2">
        <button onclick="goToPaymentWithBudget()" class="w-full py-4 rounded-2xl btn-glow-emerald text-white font-black text-sm lg:text-base shadow-2xl flex items-center justify-center gap-2 transition hover:scale-[1.01]">
          <i class="fa-solid fa-credit-card"></i>
          <span>💳 CHỐT LỊCH TRÌNH CHI TIẾT NÀY & THANH TOÁN VIETQR (${budget.toLocaleString('vi-VN')} VNĐ) NGAY</span>
          <i class="fa-solid fa-arrow-right"></i>
        </button>
      </div>

    </div>
  `;
}

function setActiveDayTab(dayNum) {
  state.activeDayTab = dayNum;
  renderDetailedDayItinerary();
}

function printItinerary() {
  window.print();
}

function copyFullItineraryToClipboard() {
  const destName = getCurrentDestData().name.vi;
  const budget = state.selectedBudget.toLocaleString('vi-VN');
  const pax = state.selectedPax;
  const dur = state.selectedDuration === '2d1n' ? '2 Ngày 1 Đêm' : state.selectedDuration === '4d3n' ? '4 Ngày 3 Đêm' : '3 Ngày 2 Đêm';

  let text = `🌟 LỊCH TRÌNH DU LỊCH WANDERMATCH 3.0\n`;
  text += `📍 Điểm đến: ${destName}\n`;
  text += `💰 Tổng ngân sách: ${budget} VNĐ • ${pax} khách • ${dur}\n`;
  text += `🏨 Khách sạn đối tác: ${getCurrentDestData().hotel.vi}\n`;
  text += `==========================================\n\n`;

  const destKey = state.selectedDestination === 'blind' ? 'dalat' : state.selectedDestination;
  const daysCount = state.selectedDuration === '2d1n' ? 2 : state.selectedDuration === '4d3n' ? 4 : 3;
  const plans = (DETAILED_DAY_PLANS[destKey] || DETAILED_DAY_PLANS['hochiminh']).slice(0, daysCount);

  plans.forEach(dayPlan => {
    text += `📅 ${dayPlan.title.toUpperCase()}\n`;
    text += `📝 ${dayPlan.tagline}\n`;
    dayPlan.slots.forEach(s => {
      text += `  • [${s.time}] ${s.typeName}: ${s.poiName} (${s.area})\n`;
      text += `    - Chi tiết: ${s.desc}\n`;
      text += `    - Mẹo AI: ${s.tip}\n`;
    });
    text += `\n`;
  });

  text += `💳 Cổng VietQR Doanh Nghiệp WanderMatch • MBBank: 990812348888\n`;
  text += `🛡️ Bảo hiểm SLA Phòng Cứng 20 Triệu Đồng cam kết 100% không bùng phòng.`;

  copyToClipboard(text, 'Toàn bộ Lịch trình Chi tiết');
}

function updateQuickBudgetButtons(currentAmt) {
  [3000000, 5000000, 8000000, 15000000].forEach(amt => {
    const btn = document.getElementById(`quick-budget-${amt}`);
    if (btn) {
      if (amt === currentAmt) {
        btn.className = 'px-2 py-0.5 rounded-lg bg-cyan-950 text-cyan-300 text-[10px] font-bold border border-cyan-800 transition shadow';
      } else {
        btn.className = 'px-2 py-0.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] font-semibold border border-slate-700 transition';
      }
    }
  });
}

function handleLiveBudgetInput(val) {
  const num = Number(val);
  if (!num || num < 500000) return;
  state.selectedBudget = num;

  updateQuickBudgetButtons(num);
  renderTripSummaryCard();
  renderDetailedDayItinerary();
  renderBudgetAllocation();
  renderValueGuaranteeCalculator();
  renderTransparentValueReceipt();
  renderPackingChecklist();
  if (state.paymentMode === 'GROUP') {
    initGroupBooking();
  }
  updateVietQrDisplay();
  renderRefundCalculator();
}

function updateVietQrDisplay() {
  const amt = state.selectedBudget;
  const order = state.orderCode;
  
  const qrAmt = document.getElementById('vietqr-locked-amount');
  if (qrAmt) qrAmt.textContent = `${amt.toLocaleString('vi-VN')} VNĐ`;

  const subAmt = document.getElementById('vietqr-subtitle-amount');
  if (subAmt) subAmt.textContent = `${amt.toLocaleString('vi-VN')} VNĐ`;

  const receiptAmt = document.getElementById('receipt-amount-text');
  if (receiptAmt) receiptAmt.textContent = `${amt.toLocaleString('vi-VN')} VNĐ`;

  const receiptDest = document.getElementById('receipt-dest-name');
  if (receiptDest) receiptDest.textContent = getCurrentDestData().name.vi;

  const scratchCity = document.getElementById('scratch-revealed-city');
  if (scratchCity) scratchCity.textContent = getCurrentDestData().name.vi.toUpperCase();

  const scratchHotel = document.getElementById('scratch-revealed-hotel');
  if (scratchHotel) scratchHotel.textContent = getCurrentDestData().hotel.vi;

  // Cập nhật URL ảnh mã QR VietQR chuẩn xác theo đúng số tiền người dùng nhập
  const qrImg = document.getElementById('vietqr-image-element');
  if (qrImg) {
    qrImg.src = `https://img.vietqr.io/image/MB-990812348888-compact2.png?amount=${amt}&addInfo=${order}&accountName=CONG%20TY%20CP%20CONG%20NGHE%20DU%20LICH%20WANDERMATCH`;
  }

  // Nếu người dùng đã thanh toán trước đó nhưng vừa đổi số tiền, reset lại trạng thái để người dùng thanh toán tiếp số mới
  if (state.isPaid) {
    state.isPaid = false;
    const btn = document.getElementById('btn-simulate-webhook');
    if (btn) {
      btn.innerHTML = `<i class="fa-solid fa-mobile-screen-button"></i> <span>📲 Giả Lập Khách Quét QR Thành Công (Webhook < 2s)</span>`;
      btn.disabled = false;
      btn.className = 'mt-5 w-full py-3.5 rounded-xl btn-glow-cyan text-slate-950 font-black text-xs shadow-xl transition flex items-center justify-center gap-2';
    }
    const badge = document.getElementById('payment-status-badge');
    if (badge) {
      badge.innerHTML = `<i class="fa-solid fa-clock"></i> <span>Hạn giữ phòng: <strong id="payment-countdown">14:59</strong></span>`;
      badge.className = 'px-3 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 flex items-center gap-1.5';
    }
    const receiptBox = document.getElementById('payment-receipt-box');
    if (receiptBox) {
      receiptBox.classList.add('hidden');
    }
    countdownSeconds = 899;
  }
}

function copyPaymentAmount() {
  copyToClipboard(state.selectedBudget.toString(), 'Số tiền thanh toán');
}

function goToPaymentWithBudget() {
  updateVietQrDisplay();
  switchView('vietqr');
  showToast('info', `Đã chuyển sang Cổng VietQR. Số tiền khóa cứng: ${state.selectedBudget.toLocaleString('vi-VN')}đ.`);
}

function handleGeneratePlan() {
  const destSelect = document.getElementById('planner-dest-select')?.value || 'hochiminh';
  const budgetRaw = document.getElementById('planner-budget-input')?.value || '5000000';
  const pax = Number(document.getElementById('planner-pax-select')?.value || '2');
  const dur = document.getElementById('planner-dur-select')?.value || '3d2n';

  state.selectedDestination = destSelect;
  state.selectedBudget = Math.max(1000000, Number(budgetRaw));
  state.selectedPax = pax;
  state.selectedDuration = dur;

  updateQuickBudgetButtons(state.selectedBudget);
  updateVietQrDisplay();
  renderDestinationHero();
  renderTripSummaryCard();
  renderDetailedDayItinerary();
  renderBudgetAllocation();
  renderItineraries();
  renderPois();
  renderRefundCalculator();

  if (typeof renderValueGuaranteeCalculator === 'function') renderValueGuaranteeCalculator();
  if (typeof renderPackingChecklist === 'function') renderPackingChecklist();
  if (typeof renderTransparentValueReceipt === 'function') renderTransparentValueReceipt();
  if (typeof renderAntiTrapSpots === 'function') renderAntiTrapSpots();
  if (typeof initGroupBooking === 'function') initGroupBooking();

  showToast('success', `🎉 AI đã tối ưu chuyến đi ${getCurrentDestData().name.vi} với ngân sách ${state.selectedBudget.toLocaleString('vi-VN')}đ!`);
}

function setQuickBudget(amount) {
  const input = document.getElementById('planner-budget-input');
  if (input) input.value = amount;
  state.selectedBudget = amount;
  handleGeneratePlan();
}

// ============================================================================
// 5. RENDER 3 ITINERARIES
// ============================================================================

function renderItineraries() {
  const container = document.getElementById('itineraries-container');
  if (!container) return;

  const data = getCurrentDestData();
  const itineraries = data.itineraries;

  container.innerHTML = itineraries.map(itin => {
    const isSelected = state.activeItineraryId === itin.id;
    const titleText = itin.title[state.currentLang] || itin.title.vi;
    const tagText = itin.tagline[state.currentLang] || itin.tagline.vi;

    const slotsHtml = itin.slots.map(s => {
      const pName = s.poi_name[state.currentLang] || s.poi_name.vi;
      const act = s.activity[state.currentLang] || s.activity.vi;
      const tip = s.tips[state.currentLang] || s.tips.vi;

      return `
        <div class="timeline-stem flex gap-4 pb-6">
          <div class="flex flex-col items-center">
            <div class="w-9 h-9 rounded-full bg-cyan-500/20 border border-cyan-400 text-cyan-300 flex items-center justify-center font-bold text-xs shrink-0 z-10 shadow-lg shadow-cyan-500/20">
              <i class="fa-solid fa-clock"></i>
            </div>
          </div>
          <div class="flex-1 bg-slate-900/60 rounded-xl p-4 border border-slate-700/50 hover:border-cyan-500/40 transition">
            <div class="flex flex-wrap items-center justify-between gap-2 mb-2">
              <span class="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-cyan-950/80 text-cyan-300 border border-cyan-800">
                ${s.time}
              </span>
              <span class="text-xs font-bold text-emerald-400 flex items-center gap-1">
                <i class="fa-solid fa-receipt"></i> ${s.cost_est}
              </span>
            </div>
            <div class="flex gap-3 mt-2">
              <img src="${s.img}" alt="${pName}" class="w-20 h-20 rounded-lg object-cover shrink-0 border border-slate-700 shadow-md">
              <div class="flex-1 min-w-0">
                <h5 class="text-sm font-bold text-slate-100 truncate">${pName}</h5>
                <p class="text-xs text-slate-300 mt-1 line-clamp-2">${act}</p>
                <div class="mt-2 text-[11px] text-amber-300/90 flex items-center gap-1.5 bg-amber-950/40 px-2 py-1 rounded border border-amber-900/40">
                  <i class="fa-solid fa-lightbulb"></i> <span>${tip}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      `;
    }).join('');

    return `
      <div class="glass-card rounded-2xl p-6 border ${isSelected ? 'border-cyan-400 ring-2 ring-cyan-400/30' : 'border-slate-800'} relative flex flex-col justify-between">
        ${isSelected ? `
          <div class="absolute -top-3.5 right-6 px-3 py-1 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 text-xs font-black shadow-lg flex items-center gap-1">
            <i class="fa-solid fa-check"></i> ${t('itinerary_btn_selected')}
          </div>
        ` : ''}
        
        <div>
          <div class="flex items-center gap-2 mb-2">
            <span class="px-2.5 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
              ${itin.persona_focus}
            </span>
          </div>
          <h4 class="text-lg font-bold text-white mb-1">${titleText}</h4>
          <p class="text-xs text-slate-400 mb-4">${tagText}</p>

          <div class="space-y-1">
            ${slotsHtml}
          </div>
        </div>

        <button onclick="selectItinerary(${itin.id})" class="mt-6 w-full py-3 rounded-xl font-bold text-sm transition flex items-center justify-center gap-2 ${
          isSelected 
            ? 'btn-glow-emerald text-white' 
            : 'bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-cyan-500/30'
        }">
          <i class="fa-solid ${isSelected ? 'fa-circle-check' : 'fa-compass'}"></i>
          ${isSelected ? t('itinerary_btn_selected') : t('itinerary_btn_select')}
        </button>
      </div>
    `;
  }).join('');
}

function selectItinerary(id) {
  state.activeItineraryId = id;
  renderItineraries();
  showToast('success', t('itinerary_btn_selected') + ` (#${id})`);
}

// ============================================================================
// 6. RENDER POIS & VERIFIED REVIEWS
// ============================================================================

function getVerdictBadgeHtml(verdict) {
  const dict = {
    VERY_WORTH_IT: {
      class: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
      icon: 'fa-thumbs-up',
      vi: '✅ Rất đáng tiền - Nên đi',
      en: '✅ Highly Worth It',
      ko: '✅ 가성비 최고 - 추천',
      ja: '✅ コスパ最高・おすすめ'
    },
    TASTY_FAIR_PRICE: {
      class: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40',
      icon: 'fa-bowl-food',
      vi: '🍜 Đồ ăn ngon, giá hợp lý',
      en: '🍜 Delicious & Fair Price',
      ko: '🍜 맛집 & 합리적 가격',
      ja: '🍜 美味＆手頃な価格'
    },
    CROWDED_BUT_BEAUTIFUL: {
      class: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
      icon: 'fa-camera-retro',
      vi: '📸 Cảnh đẹp nhưng hơi đông',
      en: '📸 Scenic but Crowded',
      ko: '📸 절경이나 다소 붐빔',
      ja: '📸 絶景だが混雑気味'
    },
    PRICEY_CONSIDER: {
      class: 'bg-rose-500/20 text-rose-300 border-rose-500/40',
      icon: 'fa-triangle-exclamation',
      vi: '⚠️ Giá hơi cao, cân nhắc',
      en: '⚠️ Pricey, Consider Budget',
      ko: '⚠️ 가격 다소 높음',
      ja: '⚠️ やや高め・要検討'
    }
  };

  const item = dict[verdict] || dict.VERY_WORTH_IT;
  const label = item[state.currentLang] || item.vi;
  return `
    <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${item.class}">
      <i class="fa-solid ${item.icon}"></i> ${label}
    </span>
  `;
}

function setPoiFilter(filterKey) {
  state.poiCategoryFilter = filterKey;
  ['ALL', 'SPECIALTY_FOOD', 'ATTRACTION_TICKET', 'CAFE_SUNSET_CHILL'].forEach(k => {
    const btn = document.getElementById(`filter-btn-${k}`);
    if (btn) {
      if (k === filterKey) {
        btn.classList.add('bg-cyan-500', 'text-slate-950', 'font-bold');
        btn.classList.remove('bg-slate-900', 'text-slate-300');
      } else {
        btn.classList.remove('bg-cyan-500', 'text-slate-950', 'font-bold');
        btn.classList.add('bg-slate-900', 'text-slate-300');
      }
    }
  });
  renderPois();
}

function renderPois() {
  const container = document.getElementById('pois-container');
  if (!container) return;

  const data = getCurrentDestData();
  const rawPois = data.pois;
  const searchQuery = (document.getElementById('poi-search-input')?.value || '').trim().toLowerCase();
  const sortMode = document.getElementById('poi-sort-select')?.value || 'rating_desc';

  let filtered = state.poiCategoryFilter === 'ALL'
    ? [...rawPois]
    : rawPois.filter(p => p.category === state.poiCategoryFilter);

  if (searchQuery) {
    filtered = filtered.filter(p => {
      const nameVi = (p.name.vi || '').toLowerCase();
      const nameLang = (p.name[state.currentLang] || '').toLowerCase();
      const descLang = (p.description[state.currentLang] || p.description.vi || '').toLowerCase();
      const addr = (p.address || '').toLowerCase();
      return nameVi.includes(searchQuery) || nameLang.includes(searchQuery) || descLang.includes(searchQuery) || addr.includes(searchQuery);
    });
  }

  if (sortMode === 'rating_desc') {
    filtered.sort((a, b) => b.rating - a.rating);
  } else if (sortMode === 'reviews_desc') {
    filtered.sort((a, b) => b.reviewsCount - a.reviewsCount);
  }

  if (filtered.length === 0) {
    container.innerHTML = `<div class="col-span-full glass-card rounded-2xl p-8 text-center text-slate-400 text-sm">Không tìm thấy địa điểm hoặc món ăn nào khớp với từ khóa tìm kiếm.</div>`;
    return;
  }

  container.innerHTML = filtered.map(poi => {
    const nameText = poi.name[state.currentLang] || poi.name.vi;
    const descText = poi.description[state.currentLang] || poi.description.vi;
    const costText = poi.costDisplay[state.currentLang] || poi.costDisplay.vi;
    const verdictHtml = getVerdictBadgeHtml(poi.verdictBadge);

    const reviewsSnippet = poi.reviews.slice(0, 2).map(r => `
      <div class="bg-slate-950/70 p-3 rounded-xl border border-slate-800 text-xs mt-2">
        <div class="flex items-center justify-between mb-1">
          <span class="font-bold text-slate-200 flex items-center gap-1">
            <i class="fa-solid fa-circle-user text-cyan-400"></i> ${r.author}
          </span>
          <span class="text-amber-400 font-bold">
            ${'★'.repeat(r.rating)}${'☆'.repeat(5 - r.rating)}
          </span>
        </div>
        <p class="text-slate-400 italic line-clamp-2">"${r.content}"</p>
      </div>
    `).join('');

    return `
      <div class="glass-card rounded-2xl overflow-hidden border border-slate-800 flex flex-col justify-between group">
        <div>
          <div class="relative h-52 overflow-hidden">
            <img src="${poi.img}" alt="${nameText}" class="w-full h-full object-cover group-hover:scale-105 transition duration-500">
            <div class="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent"></div>
            <div class="absolute top-3 left-3">
              ${verdictHtml}
            </div>
            <div class="absolute bottom-3 left-3 right-3 flex items-center justify-between">
              <span class="px-2.5 py-1 rounded-md bg-slate-900/90 backdrop-blur border border-slate-700 text-xs font-black text-amber-400 flex items-center gap-1 shadow-lg">
                <i class="fa-solid fa-star"></i> ${poi.rating.toFixed(2)} (${poi.reviewsCount})
              </span>
              <span class="px-2.5 py-1 rounded-md bg-emerald-950/90 backdrop-blur border border-emerald-700 text-xs font-bold text-emerald-300">
                <i class="fa-solid fa-receipt"></i> ${costText}
              </span>
            </div>
          </div>

          <div class="p-5">
            <h4 class="text-base font-bold text-white mb-1">${nameText}</h4>
            <div class="space-y-1 text-xs text-slate-400 mb-3">
              <p class="flex items-start gap-1.5">
                <i class="fa-solid fa-location-dot text-rose-400 mt-0.5 shrink-0"></i>
                <span>${poi.address}</span>
              </p>
              <p class="flex items-center gap-1.5">
                <i class="fa-solid fa-clock text-cyan-400 shrink-0"></i>
                <span>${poi.hours}</span>
              </p>
            </div>
            <p class="text-xs text-slate-300 mb-4 line-clamp-3 leading-relaxed">${descText}</p>

            <div class="border-t border-slate-800/80 pt-3">
              <span class="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1 mb-1">
                <i class="fa-solid fa-comments text-cyan-400"></i> ${t('reviews_heading')} (${poi.reviews.length})
              </span>
              ${reviewsSnippet}
            </div>
          </div>
        </div>

        <div class="p-5 pt-0">
          <button onclick="openReviewModal('${poi.id}')" class="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-cyan-950/80 hover:border-cyan-500/50 border border-slate-700 text-cyan-300 font-bold text-xs transition flex items-center justify-center gap-2 shadow-md">
            <i class="fa-regular fa-comment-dots"></i> ${t('btn_view_write_review')}
          </button>
        </div>
      </div>
    `;
  }).join('');
}

// ============================================================================
// 7. REVIEW MODAL & REAL-TIME RE-CALCULATION
// ============================================================================

function findPoiById(poiId) {
  for (const dest of Object.values(DESTINATION_DATA)) {
    const found = dest.pois.find(p => p.id === poiId);
    if (found) return found;
  }
  return null;
}

function openReviewModal(poiId) {
  const poi = findPoiById(poiId);
  if (!poi) return;
  state.activeModalPoiId = poiId;
  state.activeModalRating = 5;

  const modal = document.getElementById('review-modal');
  const poiTitle = document.getElementById('modal-poi-title');
  const poiSubtitle = document.getElementById('modal-poi-subtitle');
  
  if (poiTitle) poiTitle.textContent = poi.name[state.currentLang] || poi.name.vi;
  if (poiSubtitle) poiSubtitle.textContent = `⭐ ${poi.rating.toFixed(2)} (${poi.reviewsCount} reviews) • ${poi.address}`;

  updateModalRatingStars(5);
  renderModalReviewList(poi.reviews);

  if (modal) modal.classList.remove('hidden');
}

function closeReviewModal() {
  const modal = document.getElementById('review-modal');
  if (modal) modal.classList.add('hidden');
  state.activeModalPoiId = null;
}

function setModalRating(score) {
  state.activeModalRating = score;
  updateModalRatingStars(score);
}

function updateModalRatingStars(score) {
  const stars = document.querySelectorAll('.modal-star');
  stars.forEach((star, idx) => {
    if (idx < score) {
      star.classList.add('text-amber-400');
      star.classList.remove('text-slate-600');
    } else {
      star.classList.remove('text-amber-400');
      star.classList.add('text-slate-600');
    }
  });
}

function renderModalReviewList(reviews) {
  const container = document.getElementById('modal-review-list');
  if (!container) return;

  if (reviews.length === 0) {
    container.innerHTML = `<div class="p-4 text-center text-slate-500 text-sm">Chưa có đánh giá nào. Hãy là người đầu tiên!</div>`;
    return;
  }

  container.innerHTML = reviews.map(r => `
    <div class="bg-slate-900/80 p-4 rounded-xl border border-slate-800 text-xs space-y-2">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-2">
          <div class="w-7 h-7 rounded-full bg-cyan-500/20 text-cyan-300 flex items-center justify-center font-bold">
            ${r.author.charAt(0)}
          </div>
          <div>
            <div class="font-bold text-slate-200 flex items-center gap-1.5">
              <span>${r.author}</span>
              <span class="text-[10px] px-1.5 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800">
                <i class="fa-solid fa-circle-check"></i> ${t('modal_verified_tag')}
              </span>
            </div>
            <div class="text-[10px] text-slate-500">${r.date} • Đã chi: <strong class="text-emerald-400">${r.spent || 'N/A'}</strong></div>
          </div>
        </div>
        <div class="text-amber-400 font-bold text-sm">
          ${'★'.repeat(r.rating)}${'☆'.repeat(5 - r.rating)}
        </div>
      </div>
      <div>
        ${getVerdictBadgeHtml(r.verdict || 'VERY_WORTH_IT')}
      </div>
      <p class="text-slate-300 leading-relaxed">${r.content}</p>
    </div>
  `).join('');
}

function submitNewReview(e) {
  e?.preventDefault();
  const poi = findPoiById(state.activeModalPoiId);
  if (!poi) return;

  const authorName = (document.getElementById('review-author-input')?.value || '').trim() || "Nguyễn Văn An (WanderMatch Traveler)";
  const rating = state.activeModalRating;
  const verdict = document.getElementById('review-verdict-select')?.value || 'VERY_WORTH_IT';
  const spentRaw = document.getElementById('review-spent-input')?.value || '120000';
  const content = document.getElementById('review-content-input')?.value.trim();

  if (!content) {
    showToast('error', 'Vui lòng nhập nội dung đánh giá!');
    return;
  }

  const spentFormatted = Number(spentRaw).toLocaleString('vi-VN') + 'đ';

  const newRev = {
    id: `rev-${Date.now()}`,
    author: authorName,
    rating: rating,
    date: new Date().toISOString().split('T')[0],
    spent: spentFormatted,
    verdict: verdict,
    content: content
  };

  poi.reviews.unshift(newRev);

  const totalScore = poi.reviews.reduce((acc, cur) => acc + cur.rating, 0);
  poi.rating = Number((totalScore / poi.reviews.length).toFixed(2));
  poi.reviewsCount = poi.reviews.length;
  poi.verdictBadge = verdict;

  renderModalReviewList(poi.reviews);
  const poiSubtitle = document.getElementById('modal-poi-subtitle');
  if (poiSubtitle) poiSubtitle.textContent = `⭐ ${poi.rating.toFixed(2)} (${poi.reviewsCount} reviews) • ${poi.address}`;

  const contentInput = document.getElementById('review-content-input');
  if (contentInput) contentInput.value = '';

  renderPois();
  showToast('success', 'Đã đăng đánh giá thành công! Điểm trung bình và số lượng review đã được cập nhật.');
}

// ============================================================================
// 8. TIME-TIERED CANCELLATION & REFUND ENGINE
// ============================================================================

function renderRefundCalculator(selectedTier = 'TIER_1') {
  const price = state.selectedBudget;
  let feePct = 10;
  let refundPct = 90;
  let hotelCutPct = 0;
  let adminCutPct = 10;
  let badgeColor = 'emerald';

  if (selectedTier === 'TIER_1') {
    feePct = 10;
    refundPct = 90;
    hotelCutPct = 0;
    adminCutPct = 10;
    badgeColor = 'emerald';
  } else if (selectedTier === 'TIER_2') {
    feePct = 35;
    refundPct = 65;
    hotelCutPct = 25;
    adminCutPct = 10;
    badgeColor = 'amber';
  } else if (selectedTier === 'TIER_3') {
    feePct = 100;
    refundPct = 0;
    hotelCutPct = 70;
    adminCutPct = 30;
    badgeColor = 'rose';
  }

  const feeAmount = (price * feePct) / 100;
  const refundAmount = (price * refundPct) / 100;
  const hotelAmount = (price * hotelCutPct) / 100;
  const adminAmount = (price * adminCutPct) / 100;

  ['TIER_1', 'TIER_2', 'TIER_3'].forEach(tier => {
    const el = document.getElementById(`tier-tab-${tier}`);
    if (el) {
      if (tier === selectedTier) {
        el.classList.add('border-cyan-400', 'bg-slate-800/90', 'ring-1', 'ring-cyan-400');
        el.classList.remove('border-slate-800', 'bg-slate-900/60');
      } else {
        el.classList.remove('border-cyan-400', 'bg-slate-800/90', 'ring-1', 'ring-cyan-400');
        el.classList.add('border-slate-800', 'bg-slate-900/60');
      }
    }
  });

  const outputContainer = document.getElementById('refund-calc-output');
  if (outputContainer) {
    outputContainer.innerHTML = `
      <div class="bg-slate-950/80 p-5 rounded-2xl border border-slate-800 space-y-4">
        <div class="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3">
          <div>
            <span class="text-xs text-slate-400">Ngân Sách Bạn Đã Nhập Cho Chuyến Đi:</span>
            <div class="text-lg font-black text-white">${price.toLocaleString('vi-VN')} VNĐ</div>
          </div>
          <div class="text-right">
            <span class="text-xs text-slate-400">Tỷ Lệ Hoàn Trả:</span>
            <div class="text-lg font-black text-${badgeColor}-400">${refundPct}% VỀ STK NAPAS</div>
          </div>
        </div>

        <div class="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
          <div class="bg-slate-900 p-3 rounded-xl border border-slate-800">
            <span class="text-slate-400">Phí Hủy (${feePct}%):</span>
            <div class="text-sm font-bold text-rose-400 mt-1">${feeAmount.toLocaleString('vi-VN')}đ</div>
          </div>
          <div class="bg-slate-900 p-3 rounded-xl border border-slate-800">
            <span class="text-slate-400">Đền bù Khách Sạn (${hotelCutPct}%):</span>
            <div class="text-sm font-bold text-amber-400 mt-1">${hotelAmount.toLocaleString('vi-VN')}đ</div>
          </div>
          <div class="bg-slate-900 p-3 rounded-xl border border-slate-800">
            <span class="text-slate-400">Phí Vận Hành WM (${adminCutPct}%):</span>
            <div class="text-sm font-bold text-slate-300 mt-1">${adminAmount.toLocaleString('vi-VN')}đ</div>
          </div>
          <div class="bg-slate-900 p-3 rounded-xl border border-emerald-500/40 bg-emerald-950/20">
            <span class="text-emerald-300 font-semibold">Thực Nhận Vào STK:</span>
            <div class="text-sm font-black text-emerald-400 mt-1">${refundAmount.toLocaleString('vi-VN')}đ</div>
          </div>
        </div>

        <div class="p-3 bg-cyan-950/40 rounded-xl border border-cyan-800/40 flex items-center justify-between">
          <div class="flex items-center gap-2 text-xs text-cyan-200">
            <i class="fa-solid fa-building-columns text-cyan-400"></i>
            <span>Tự động chuyển qua Napas 247 tới: <strong>MBBank - 0388998899 (NGUYEN VAN AN)</strong></span>
          </div>
          <button onclick="executeRefundSimulation('${selectedTier}', ${refundAmount})" class="px-4 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-lg transition">
            ⚡ Thực Thi Hoàn Tiền Ngay
          </button>
        </div>
      </div>
    `;
  }
}

function executeRefundSimulation(tier, amount) {
  showToast('info', `Đang kết nối Napas 247 để hoàn trả ${amount.toLocaleString('vi-VN')}đ...`);
  setTimeout(() => {
    ESCROW_LEDGER.unshift({
      txId: `TX-REF-${Date.now().toString().slice(-5)}`,
      tripCode: state.orderCode,
      type: tier === 'TIER_1' ? 'REFUND_TIER_1' : 'REFUND_TIER_2',
      direction: 'OUT',
      amount: `${amount.toLocaleString('vi-VN')}đ`,
      sender: "WANDERMATCH ESCROW",
      receiver: "NGUYEN VAN AN (MBBank - 0388998899)",
      status: "REFUNDED_TO_USER",
      time: new Date().toLocaleString()
    });
    renderEscrowLedger();
    showToast('success', `Đã hoàn trả thành công ${amount.toLocaleString('vi-VN')}đ về STK Napas 247 của khách hàng!`);
  }, 1200);
}

function simulateForceMajeure(level) {
  const price = state.selectedBudget;
  if (level === 'LEVEL_A') {
    showToast('info', 'Xác thực Bất Khả Kháng Cấp Độ A: Bão lũ / Đóng sân bay...');
    setTimeout(() => {
      ESCROW_LEDGER.unshift({
        txId: `TX-FM-A-${Date.now().toString().slice(-5)}`,
        tripCode: state.orderCode,
        type: 'REFUND_FORCE_MAJEURE',
        direction: 'OUT',
        amount: `${price.toLocaleString('vi-VN')}đ`,
        sender: "WANDERMATCH ESCROW",
        receiver: "NGUYEN VAN AN (MBBank)",
        status: "REFUNDED_TO_USER",
        time: new Date().toLocaleString()
      });
      renderEscrowLedger();
      showToast('success', `Cấp Độ A: Miễn 100% phí hủy. Đã hoàn ${price.toLocaleString('vi-VN')}đ + Tặng Voucher 300.000đ cho chuyến sau!`);
    }, 1000);
  } else {
    const refund85 = (price * 85) / 100;
    showToast('info', 'OCR Giấy xác nhận bệnh viện qua Gemini Vision...');
    setTimeout(() => {
      ESCROW_LEDGER.unshift({
        txId: `TX-FM-B-${Date.now().toString().slice(-5)}`,
        tripCode: state.orderCode,
        type: 'REFUND_FORCE_MAJEURE',
        direction: 'OUT',
        amount: `${refund85.toLocaleString('vi-VN')}đ`,
        sender: "WANDERMATCH ESCROW",
        receiver: "NGUYEN VAN AN (MBBank)",
        status: "REFUNDED_TO_USER",
        time: new Date().toLocaleString()
      });
      renderEscrowLedger();
      showToast('success', `Cấp Độ B: Đã phê duyệt hoàn y tế 85% (${refund85.toLocaleString('vi-VN')}đ) về STK cá nhân.`);
    }, 1200);
  }
}

// ============================================================================
// 9. CANVAS SCRATCH CARD LOGIC
// ============================================================================

function initScratchCard() {
  const canvas = document.getElementById('scratch-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const container = canvas.parentElement;

  canvas.width = container.offsetWidth || 540;
  canvas.height = container.offsetHeight || 300;

  ctx.fillStyle = '#64748b';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const grad = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
  grad.addColorStop(0, 'rgba(203, 213, 225, 0.95)');
  grad.addColorStop(0.5, 'rgba(148, 163, 184, 0.98)');
  grad.addColorStop(1, 'rgba(100, 116, 139, 0.95)');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = '#1e293b';
  ctx.font = 'bold 16px Outfit, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('✨ CÀO TẠI ĐÂY ĐỂ MỞ KHÓA ĐIỂM ĐẾN ✨', canvas.width / 2, canvas.height / 2 - 10);
  ctx.font = '12px Inter, sans-serif';
  ctx.fillStyle = '#334155';
  ctx.fillText('WanderMatch 3.0 • Bảo hiểm 200% phòng cứng', canvas.width / 2, canvas.height / 2 + 18);

  let isDrawing = false;

  function scratch(e) {
    if (!isDrawing) return;
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX || e.touches?.[0]?.clientX) - rect.left;
    const y = (e.clientY || e.touches?.[0]?.clientY) - rect.top;

    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath();
    ctx.arc(x, y, 28, 0, Math.PI * 2);
    ctx.fill();

    calculateProgress();
  }

  function calculateProgress() {
    const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    let transparent = 0;
    for (let i = 3; i < imgData.data.length; i += 32) {
      if (imgData.data[i] === 0) transparent++;
    }
    const percent = Math.min(100, Math.round((transparent / (imgData.data.length / 32)) * 100));
    
    const progressEl = document.getElementById('scratch-percent-label');
    const barEl = document.getElementById('scratch-progress-bar');
    if (progressEl) progressEl.textContent = `${percent}%`;
    if (barEl) barEl.style.width = `${percent}%`;

    if (percent > 45 && !state.isScratchedRevealed) {
      state.isScratchedRevealed = true;
      revealCardFull();
    }
  }

  function revealCardFull() {
    canvas.style.transition = 'opacity 0.6s ease';
    canvas.style.opacity = '0';
    setTimeout(() => {
      canvas.style.display = 'none';
    }, 600);

    const btn = document.getElementById('revealed-action-btn');
    if (btn) btn.classList.remove('hidden');

    renderTransparentValueReceipt();
    renderAntiTrapSpots();

    showToast('success', `🎉 CHÚC MỪNG! BẠN ĐÃ MỞ KHÓA ĐIỂM ĐẾN: ${getCurrentDestData().name.vi.toUpperCase()}!`);
  }

  canvas.addEventListener('mousedown', () => isDrawing = true);
  window.addEventListener('mouseup', () => isDrawing = false);
  canvas.addEventListener('mousemove', scratch);

  canvas.addEventListener('touchstart', (e) => {
    isDrawing = true;
    scratch(e);
  }, { passive: true });
  window.addEventListener('touchend', () => isDrawing = false);
  canvas.addEventListener('touchmove', scratch, { passive: true });
}

// ============================================================================
// 10. NAPAS 247 & VIETQR ENGINE
// ============================================================================

function simulateNapasVerification() {
  const bankSelect = document.getElementById('napas-bank-select')?.value;
  const accNo = document.getElementById('napas-acc-input')?.value;

  if (!accNo || accNo.length < 6) {
    showToast('error', 'Vui lòng nhập số tài khoản hợp lệ!');
    return;
  }

  const resultBox = document.getElementById('napas-verify-result');
  if (resultBox) {
    resultBox.innerHTML = `
      <div class="flex items-center gap-2 text-cyan-400 text-xs">
        <i class="fa-solid fa-spinner fa-spin"></i>
        <span>Đang gọi Napas 247 Switch API để tra cứu tên chủ tài khoản...</span>
      </div>
    `;
    resultBox.classList.remove('hidden');
  }

  setTimeout(() => {
    state.isNapasVerified = true;
    if (resultBox) {
      resultBox.innerHTML = `
        <div class="bg-emerald-950/70 p-3 rounded-xl border border-emerald-600/50 flex items-center justify-between text-xs">
          <div>
            <div class="font-bold text-emerald-300 flex items-center gap-1.5">
              <i class="fa-solid fa-circle-check"></i> ACTIVE_VERIFIED (Napas 247)
            </div>
            <div class="text-slate-300 text-[11px] mt-0.5">
              Chủ tài khoản: <strong>NGUYEN VAN AN</strong> (Trùng khớp 100% với CCCD)
            </div>
          </div>
          <span class="px-2.5 py-1 rounded bg-emerald-500/20 text-emerald-300 font-bold text-[10px] border border-emerald-500/40">
            KHÓA AN TOÀN
          </span>
        </div>
      `;
    }
    showToast('success', 'Xác thực tài khoản Napas 247 thành công!');
  }, 1200);
}

function copyToClipboard(text, label) {
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text).then(() => {
      showToast('success', `Đã sao chép ${label}: ${text}`);
    }).catch(() => {
      fallbackCopy(text, label);
    });
  } else {
    fallbackCopy(text, label);
  }
}

function fallbackCopy(text, label) {
  const ta = document.createElement('textarea');
  ta.value = text;
  ta.style.position = 'fixed';
  ta.style.opacity = '0';
  document.body.appendChild(ta);
  ta.select();
  document.execCommand('copy');
  document.body.removeChild(ta);
  showToast('success', `Đã sao chép ${label}: ${text}`);
}

let countdownSeconds = 899;
let countdownTimerInterval = null;
function startPaymentCountdown() {
  const el = document.getElementById('payment-countdown');
  if (!el) return;
  if (countdownTimerInterval) clearInterval(countdownTimerInterval);
  countdownTimerInterval = setInterval(() => {
    if (state.isPaid) return;
    if (countdownSeconds <= 0) {
      el.textContent = "00:00 (Hết hạn)";
      return;
    }
    countdownSeconds--;
    const mins = Math.floor(countdownSeconds / 60);
    const secs = countdownSeconds % 60;
    el.textContent = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }, 1000);
}

function simulateVietQrPayment() {
  const btn = document.getElementById('btn-simulate-webhook');
  if (btn) {
    btn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Đang lắng nghe tín hiệu Webhook Napas 247...`;
    btn.disabled = true;
  }

  showToast('info', 'Mô phỏng VietQR: Khách hàng quét mã qua ứng dụng ngân hàng...');

  setTimeout(() => {
    state.isPaid = true;
    const txId = `TX-MB-${Math.floor(100000 + Math.random() * 900000)}`;

    if (btn) {
      btn.innerHTML = `<i class="fa-solid fa-circle-check"></i> Đã Xác Nhận Thanh Toán Thành Công!`;
      btn.classList.remove('btn-glow-cyan');
      btn.classList.add('bg-emerald-600', 'text-white');
    }

    // Update payment status badge
    const badge = document.getElementById('payment-status-badge');
    if (badge) {
      badge.innerHTML = `<i class="fa-solid fa-shield-halved text-emerald-400"></i> <span class="text-emerald-300 font-bold">ĐÃ THANH TOÁN THÀNH CÔNG • HELD_IN_ESCROW</span>`;
      badge.className = 'px-3 py-1 rounded-full text-xs font-bold bg-emerald-950 text-emerald-300 border border-emerald-500/50 flex items-center gap-1.5 shadow-lg';
    }

    // Show electronic receipt
    const receiptBox = document.getElementById('payment-receipt-box');
    const receiptTx = document.getElementById('receipt-tx-id');
    const receiptAmt = document.getElementById('receipt-amount-text');
    const receiptDest = document.getElementById('receipt-dest-name');

    if (receiptTx) receiptTx.textContent = txId;
    if (receiptAmt) receiptAmt.textContent = `${state.selectedBudget.toLocaleString('vi-VN')} VNĐ`;
    if (receiptDest) receiptDest.textContent = getCurrentDestData().name.vi;
    if (receiptBox) {
      receiptBox.classList.remove('hidden');
      receiptBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    // Append to Escrow Ledger
    ESCROW_LEDGER.unshift({
      txId: txId,
      tripCode: state.orderCode,
      type: "VIETQR_ESCROW_INFLOW",
      direction: "IN",
      amount: `${state.selectedBudget.toLocaleString('vi-VN')}đ`,
      sender: "NGUYEN VAN AN (MBBank)",
      receiver: "CONG TY CP CONG NGHE DU LICH WANDERMATCH",
      status: "HELD_IN_ESCROW",
      time: new Date().toLocaleString()
    });
    renderEscrowLedger();

    showToast('success', `🎉 Thanh toán thành công ${state.selectedBudget.toLocaleString('vi-VN')}đ! Tiền đã vào quỹ Escrow bảo lãnh phòng.`);
  }, 1200);
}

// ============================================================================
// 11. B2B PARTNER & ADMIN SỔ CÁI
// ============================================================================

function signPmsCommitment() {
  const pmsCode = document.getElementById('b2b-pms-code')?.value || 'PMS-DL-8892';
  state.partnerSigned = true;

  const statusBadge = document.getElementById('b2b-sign-status');
  if (statusBadge) {
    statusBadge.innerHTML = `
      <div class="px-3 py-1.5 rounded-xl bg-emerald-950 text-emerald-300 border border-emerald-600/50 font-bold text-xs inline-flex items-center gap-1.5">
        <i class="fa-solid fa-lock"></i> HARD_COMMITTED (${pmsCode}) - BẢO LÃNH 20 TRIỆU ĐỒNG
      </div>
    `;
  }
  showToast('success', 'Đối tác đã ký số cam kết giữ phòng cứng thành công!');
}

function simulateOverbookingViolation() {
  if (state.isOverbookPenalized) {
    showToast('info', 'Khoản phạt vi phạm SLA này đã được xử lý trước đó.');
    return;
  }

  state.isOverbookPenalized = true;
  state.slaDepositBalance = 10000000;

  const balEl = document.getElementById('b2b-sla-balance');
  if (balEl) balEl.textContent = '10.000.000 VNĐ (Đã trừ phạt 10 triệu)';

  ESCROW_LEDGER.unshift({
    txId: `TX-PENALTY-${Date.now().toString().slice(-5)}`,
    tripCode: state.orderCode,
    type: "SLA_PENALTY_DEDUCTION",
    direction: "OUT",
    amount: "10.000.000đ",
    sender: "QUỸ BẢO LÃNH SLA ĐỐI TÁC",
    receiver: "WANDERMATCH ESCROW (NÂNG HẠNG 5 SAO CHO KHÁCH)",
    status: "DISBURSED_TO_PARTNER",
    time: new Date().toLocaleString()
  });
  renderEscrowLedger();

  showToast('error', '⚠️ ĐÃ PHẠT SLA: Trích 50% quỹ bảo lãnh (10.000.000đ) của khách sạn để tự động nâng hạng phòng 5 sao cho khách!');
}

function renderEscrowLedger() {
  const container = document.getElementById('ledger-table-body');
  if (!container) return;

  container.innerHTML = ESCROW_LEDGER.map(row => `
    <tr class="border-b border-slate-800 hover:bg-slate-900/40 text-xs">
      <td class="py-3 px-4 font-mono text-cyan-400">${row.txId}</td>
      <td class="py-3 px-4 font-bold text-white">${row.tripCode}</td>
      <td class="py-3 px-4">
        <span class="px-2 py-0.5 rounded text-[11px] font-semibold ${
          row.direction === 'IN' 
            ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' 
            : 'bg-rose-950 text-rose-300 border border-rose-800'
        }">
          ${row.direction === 'IN' ? '↓ VÀO ESCROW' : '↑ RA NGOÀI'}
        </span>
      </td>
      <td class="py-3 px-4 font-bold text-white">${row.amount}</td>
      <td class="py-3 px-4 text-slate-300">${row.receiver}</td>
      <td class="py-3 px-4">
        <span class="px-2 py-0.5 rounded text-[10px] font-bold ${
          row.status === 'HELD_IN_ESCROW' ? 'bg-cyan-950 text-cyan-300 border border-cyan-800' :
          row.status === 'REFUNDED_TO_USER' ? 'bg-amber-950 text-amber-300 border border-amber-800' :
          'bg-slate-800 text-slate-300'
        }">
          ${row.status}
        </span>
      </td>
      <td class="py-3 px-4 text-slate-500 font-mono text-[11px]">${row.time}</td>
    </tr>
  `).join('');
}

// ============================================================================
// 12. NAVIGATION & VIEW SWITCHING
// ============================================================================

function switchView(viewName) {
  state.currentTab = viewName;

  const views = ['concierge', 'quiz', 'vietqr', 'scratch', 'b2b'];
  views.forEach(v => {
    const el = document.getElementById(`view-${v}`);
    const navBtn = document.getElementById(`nav-btn-${v}`);
    if (el) {
      if (v === viewName) {
        el.classList.remove('hidden');
      } else {
        el.classList.add('hidden');
      }
    }
    if (navBtn) {
      if (v === viewName) {
        navBtn.classList.add('bg-cyan-500/20', 'text-cyan-300', 'border-cyan-500/40', 'font-bold');
        navBtn.classList.remove('text-slate-400', 'border-transparent');
      } else {
        navBtn.classList.remove('bg-cyan-500/20', 'text-cyan-300', 'border-cyan-500/40', 'font-bold');
        navBtn.classList.add('text-slate-400', 'border-transparent');
      }
    }
  });

  window.scrollTo({ top: 0, behavior: 'smooth' });

  if (viewName === 'scratch') {
    setTimeout(initScratchCard, 100);
  }
}

// ============================================================================
// 12. PRAGMATIC CONSUMER ENGINE (5 TRỤ CỘT THỰC DỤNG & LOSS AVERSION V3.1)
// ============================================================================

// 1. SMART PACKAGE & VALUE GUARANTEE CALCULATOR (Retail Value Floor >= 120%)
function renderValueGuaranteeCalculator() {
  const budget = state.selectedBudget || 5000000;
  const retailFloor = Math.round(budget * 1.20);
  const floorEl = document.getElementById('retail-floor-val');
  if (floorEl) {
    floorEl.textContent = `≥ ${retailFloor.toLocaleString('vi-VN')} VNĐ`;
  }
}

// 2. PRAGMATIC COMFORT LOCKS
function handleComfortLockChange() {
  const noRedEye = document.getElementById('lock-no-red-eye')?.checked ?? true;
  const luggageShuttle = document.getElementById('lock-luggage-shuttle')?.checked ?? true;
  const workcation = document.getElementById('lock-workcation')?.checked ?? false;

  state.comfortLocks.noRedEye = noRedEye;
  state.comfortLocks.luggageShuttle = luggageShuttle;
  state.comfortLocks.workcation = workcation;

  const depEl = document.getElementById('departure-window-text');
  if (depEl) {
    if (noRedEye) {
      depEl.innerHTML = `Bạn cần có mặt tại <strong>Ga Quốc nội - Sân bay (Sảnh A) lúc 07:30 sáng Thứ Sáu, ngày 24/10</strong>. Chuyến đi kéo dài đến <strong>19:00 Chủ Nhật, ngày 26/10</strong> (Cam kết không bay giờ xấu Red-Eye).`;
    } else {
      depEl.innerHTML = `Chuyến bay linh hoạt theo giá rẻ nhất. Có thể khởi hành vào khung giờ đêm 22:30.`;
    }
  }

  renderTripSummaryCard();
  renderDetailedDayItinerary();
  showToast('info', '✅ Đã cập nhật bộ khóa tiêu chuẩn thực dụng');
}

function setBedType(type) {
  state.comfortLocks.bedType = type;
  const btnTwin = document.getElementById('bed-btn-twin');
  const btnKing = document.getElementById('bed-btn-king');
  if (type === 'TWIN') {
    if (btnTwin) btnTwin.className = 'py-1.5 px-2 rounded-lg text-[10px] font-bold transition border border-cyan-500/50 bg-cyan-500/20 text-cyan-300';
    if (btnKing) btnKing.className = 'py-1.5 px-2 rounded-lg text-[10px] font-medium transition border border-slate-800 bg-slate-900 text-slate-400 hover:text-white';
    showToast('info', '🛏️ Đã chọn cấu hình: 2 Giường Đơn (Twin Beds - Bạn bè)');
  } else {
    if (btnKing) btnKing.className = 'py-1.5 px-2 rounded-lg text-[10px] font-bold transition border border-amber-500/50 bg-amber-500/20 text-amber-300';
    if (btnTwin) btnTwin.className = 'py-1.5 px-2 rounded-lg text-[10px] font-medium transition border border-slate-800 bg-slate-900 text-slate-400 hover:text-white';
    showToast('info', '🛏️ Đã chọn cấu hình: 1 Giường Đôi Lớn (King Bed - Cặp đôi)');
  }
  renderTripSummaryCard();
}

// 3. INTERACTIVE PACKING CHECKLIST (BLIND LOGISTICS KIT)
const PACKING_DATA = {
  dalat: [
    { item: "Áo khoác ấm & áo giữ nhiệt", reason: "Nhiệt độ ban đêm giảm sâu 14-16°C" },
    { item: "Ô gấp gọn / Áo mưa mỏng", reason: "Thường có mưa phùn và sương mù bất chợt" },
    { item: "Giày thể thao chống trơn", reason: "Địa hình dốc đồi thông và bậc thang thác đá" },
    { item: "Kem dưỡng ẩm & Son dưỡng", reason: "Không khí khô lạnh dễ nứt nẻ da" },
    { item: "CCCD / Hộ chiếu bản gốc", reason: "Check-in lễ tân khách sạn & nhận xe máy" },
    { item: "Sạc dự phòng 20.000mAh", reason: "Chụp ảnh săn mây liên tục ngoài trời" },
    { item: "Thuốc chống say xe đèo dốc", reason: "Đoạn đường đèo Prenn / Mimosa nhiều cua gắt" },
    { item: "Bình giữ nhiệt mini", reason: "Đựng trà atisô nóng giữ ấm cơ thể" }
  ],
  hochiminh: [
    { item: "Trang phục năng động, thoáng mát", reason: "Nắng ấm nhiệt đới đặc trưng Sài Gòn" },
    { item: "Ô gấp gọn chống mưa rào", reason: "Mưa chợt đến rồi chợt đi vào buổi chiều" },
    { item: "Giày êm đi bộ dạo phố", reason: "Khám phá phố đi bộ Nguyễn Huệ & chợ Bến Thành" },
    { item: "Túi đeo chéo an toàn trước ngực", reason: "Bảo vệ tư trang nơi đông người" },
    { item: "CCCD bản gốc", reason: "Thủ tục nhận phòng khách sạn The Myst" },
    { item: "Kính râm & Khẩu trang chống bụi", reason: "Di chuyển ngắm cảnh bằng xe bus 2 tầng" },
    { item: "Sạc dự phòng & Dây cáp sạc", reason: "Cả ngày check-in các quán cafe rooftop" },
    { item: "Bình nước cá nhân", reason: "Giữ đủ nước khi đi bộ trải nghiệm ẩm thực" }
  ],
  danang: [
    { item: "Đồ bơi & Kính râm chống UV", reason: "Bãi biển Mỹ Khê nắng vàng rực rỡ" },
    { item: "Kem chống nắng SPF 50+ PA++++", reason: "Chỉ số UV miền Trung ban ngày rất cao" },
    { item: "Dép sandal / Dép xốp đi biển", reason: "Thuận tiện dạo bãi cát và lội nước" },
    { item: "Trang phục lịch sự kín đáo", reason: "Tham quan Chùa Linh Ứng & Phố Cổ Hội An" },
    { item: "Túi chống nước điện thoại", reason: "Bảo vệ máy khi tắm biển hoặc đi thuyền thúng" },
    { item: "CCCD bản gốc", reason: "Xác nhận nhận phòng resort & vé bay" },
    { item: "Mũ rộng vành / Nón cói", reason: "Che nắng khi dạo bộ cầu Rồng / phố đi bộ" },
    { item: "Bình xịt khoáng làm dịu da", reason: "Cấp ẩm sau khi tắm nắng và gió biển" }
  ]
};

function renderPackingChecklist() {
  const container = document.getElementById('packing-checklist-grid');
  if (!container) return;

  const destKey = state.selectedDestination === 'blind' ? 'dalat' : state.selectedDestination;
  const items = PACKING_DATA[destKey] || PACKING_DATA['dalat'];

  let savedChecked = [];
  try {
    const raw = localStorage.getItem('wandermatch_packing_' + destKey);
    if (raw) savedChecked = JSON.parse(raw);
  } catch (e) {}

  container.innerHTML = items.map((it, idx) => {
    const isChecked = savedChecked.includes(idx);
    return `
      <div onclick="togglePackingItem(${idx})" class="checklist-item p-3 rounded-xl bg-slate-950 border ${isChecked ? 'border-emerald-500/40 bg-emerald-950/20 checked' : 'border-slate-800'} hover:border-cyan-500/40 cursor-pointer flex items-start gap-2.5 transition">
        <input type="checkbox" ${isChecked ? 'checked' : ''} onclick="event.stopPropagation(); togglePackingItem(${idx})" class="mt-0.5 rounded border-slate-700 text-cyan-500 focus:ring-0 cursor-pointer">
        <div class="min-w-0 flex-1">
          <span class="font-bold text-white block text-[11px] leading-tight">${it.item}</span>
          <span class="text-[9px] text-slate-400 block mt-0.5">${it.reason}</span>
        </div>
      </div>
    `;
  }).join('');

  updatePackingProgress(items.length, savedChecked.length);
}

function togglePackingItem(idx) {
  const destKey = state.selectedDestination === 'blind' ? 'dalat' : state.selectedDestination;
  let savedChecked = [];
  try {
    const raw = localStorage.getItem('wandermatch_packing_' + destKey);
    if (raw) savedChecked = JSON.parse(raw);
  } catch (e) {}

  if (savedChecked.includes(idx)) {
    savedChecked = savedChecked.filter(i => i !== idx);
  } else {
    savedChecked.push(idx);
  }

  try {
    localStorage.setItem('wandermatch_packing_' + destKey, JSON.stringify(savedChecked));
  } catch (e) {}

  renderPackingChecklist();
}

function updatePackingProgress(total, checkedCount) {
  const percent = Math.round((checkedCount / total) * 100);
  const textEl = document.getElementById('checklist-progress-text');
  const barEl = document.getElementById('checklist-progress-bar');
  const badgeEl = document.getElementById('checklist-ready-badge');

  if (textEl) textEl.textContent = `${checkedCount}/${total} Món (${percent}%)`;
  if (barEl) barEl.style.width = `${percent}%`;
  if (badgeEl) {
    if (percent === 100) {
      badgeEl.classList.remove('hidden');
    } else {
      badgeEl.classList.add('hidden');
    }
  }
}

// 4. OUT-OF-OFFICE / ĐƠN XIN NGHỈ PHÉP 1-CHẠM
function openLeaveLetterModal() {
  const modal = document.getElementById('leave-letter-modal');
  if (modal) modal.classList.remove('hidden');

  const fullName = "Nguyễn Văn An";
  const dept = "Phòng Kỹ thuật & Công nghệ";
  const startDate = "Thứ Sáu, ngày 24/10/2026";
  const endDate = "Chủ Nhật, ngày 26/10/2026";
  const urgentContact = "0908.123.488";

  const letterText = `Kính gửi: Ban Giám đốc & Trưởng Bộ phận ${dept},

Tôi tên là: ${fullName}
Hiện đang công tác tại vị trí: Kỹ sư Phần mềm / Quản lý Dự án

Nay tôi viết đơn này kính xin phép Ban Giám đốc và Quản lý trực tiếp cho phép tôi được nghỉ phép trong thời gian:
- Từ ngày: ${startDate}
- Đến hết ngày: ${endDate}
- Lý do: Tái tạo năng lượng cá nhân qua chuyến du lịch tự túc trải nghiệm cuối tuần cùng WanderMatch.

Trong thời gian nghỉ phép:
- Tôi đã hoàn tất và bàn giao các đầu việc khẩn cấp cho đồng nghiệp trong nhóm phụ trách.
- Trường hợp có sự cố phát sinh khẩn cấp cần hỗ trợ, vui lòng liên hệ qua số điện thoại cá nhân: ${urgentContact}.
- Hòm thư email sẽ được kiểm tra và phản hồi ngay khi tôi quay trở lại văn phòng vào sáng Thứ Hai.

Kính mong Ban Giám đốc xem xét và phê duyệt.
Tôi xin chân thành cảm ơn!

Người làm đơn,
${fullName}`;

  const ta = document.getElementById('leave-content-textarea');
  if (ta) ta.value = letterText;
}

function closeLeaveLetterModal() {
  const modal = document.getElementById('leave-letter-modal');
  if (modal) modal.classList.add('hidden');
}

function copyLeaveLetter() {
  const ta = document.getElementById('leave-content-textarea');
  if (ta) {
    copyToClipboard(ta.value, 'nội dung đơn xin nghỉ phép');
  }
}

function downloadLeaveLetter() {
  const ta = document.getElementById('leave-content-textarea');
  if (!ta) return;
  const blob = new Blob([ta.value], { type: 'text/plain;charset=utf-8' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'Don_Xin_Nghi_Phep_WanderMatch.txt';
  a.click();
  showToast('success', 'Đã tải xuống file Don_Xin_Nghi_Phep_WanderMatch.txt thành công!');
}

// 5. GROUP SPLIT-BILL VIETQR PAYMENT (PROMPT 3)
function setPaymentMode(mode) {
  state.paymentMode = mode;
  const btnInd = document.getElementById('btn-mode-individual-qr');
  const btnGrp = document.getElementById('btn-mode-group-qr');
  const boxInd = document.getElementById('container-individual-qr');
  const boxGrp = document.getElementById('container-group-qr');

  if (mode === 'GROUP') {
    if (btnGrp) {
      btnGrp.className = 'px-4 py-2 rounded-xl text-xs font-bold transition bg-indigo-600 text-white shadow-lg flex items-center gap-2';
    }
    if (btnInd) {
      btnInd.className = 'px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white bg-slate-900 border border-slate-800 transition flex items-center gap-2';
    }
    if (boxInd) boxInd.classList.add('hidden');
    if (boxGrp) {
      boxGrp.classList.remove('hidden');
      initGroupBooking();
    }
    showToast('info', '👥 Chuyển sang chế độ Đi Nhóm & Chia Tiền Tự Động (Group Split-Bill)');
  } else {
    if (btnInd) {
      btnInd.className = 'px-4 py-2 rounded-xl text-xs font-bold transition bg-cyan-500 text-slate-950 shadow-lg flex items-center gap-2';
    }
    if (btnGrp) {
      btnGrp.className = 'px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white bg-slate-900 border border-slate-800 transition flex items-center gap-2';
    }
    if (boxGrp) boxGrp.classList.add('hidden');
    if (boxInd) boxInd.classList.remove('hidden');
    showToast('info', '💳 Chuyển sang chế độ Thanh Toán Đơn / Trưởng Nhóm');
  }
}

let groupTimerInterval = null;
let groupTimerSeconds = 1799;

function initGroupBooking() {
  const total = Math.max(8000000, state.selectedBudget * (state.selectedPax >= 4 ? 1 : 2));
  const membersCount = 4;
  const perMember = Math.round(total / membersCount);

  state.groupBooking.totalBudget = total;
  state.groupBooking.membersCount = membersCount;
  state.groupBooking.amountPerMember = perMember;

  const totalEl = document.getElementById('group-total-budget-display');
  const perEl = document.getElementById('group-per-member-display');
  if (totalEl) totalEl.textContent = `${total.toLocaleString('vi-VN')} VNĐ`;
  if (perEl) perEl.textContent = `${perMember.toLocaleString('vi-VN')} VNĐ`;

  const memberNames = [
    "Nguyễn Văn An (Trưởng nhóm)",
    "Trần Hoàng Nam",
    "Lê Phương Thảo",
    "Phạm Minh Khôi"
  ];

  if (!state.groupBooking.members || state.groupBooking.members.length === 0) {
    state.groupBooking.members = memberNames.map((name, i) => ({
      index: i + 1,
      name: name,
      amount: perMember,
      memo: `WM G8892 M${i + 1}`,
      qrUrl: `https://img.vietqr.io/image/MB-990812348888-compact2.png?amount=${perMember}&addInfo=WM%20G8892%20M${i + 1}&accountName=CONG%20TY%20CP%20CONG%20NGHE%20DU%20LICH%20WANDERMATCH`,
      isPaid: i === 0,
      paidTime: i === 0 ? "Vừa xong" : null
    }));
  }

  renderGroupMembersGrid();

  if (!groupTimerInterval) {
    groupTimerInterval = setInterval(() => {
      if (groupTimerSeconds <= 0) {
        clearInterval(groupTimerInterval);
        const timerEl = document.getElementById('group-countdown-timer');
        if (timerEl) timerEl.textContent = "00:00 (Hết hạn)";
        return;
      }
      groupTimerSeconds--;
      const m = Math.floor(groupTimerSeconds / 60);
      const s = groupTimerSeconds % 60;
      const el = document.getElementById('group-countdown-timer');
      if (el) el.textContent = `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    }, 1000);
  }
}

function renderGroupMembersGrid() {
  const container = document.getElementById('group-members-qr-grid');
  if (!container) return;

  const members = state.groupBooking.members;
  const paidCount = members.filter(m => m.isPaid).length;
  state.groupBooking.paidCount = paidCount;

  const progressEl = document.getElementById('group-progress-stat');
  if (progressEl) {
    const pct = Math.round((paidCount / members.length) * 100);
    progressEl.textContent = `${paidCount} / ${members.length} Người (${pct}%)`;
    if (paidCount === members.length) {
      progressEl.className = "text-base font-black text-emerald-400 font-mono";
    }
  }

  container.innerHTML = members.map(m => `
    <div class="p-4 rounded-2xl bg-slate-950 border ${m.isPaid ? 'border-emerald-500/50 bg-emerald-950/20' : 'border-slate-800'} space-y-3 relative overflow-hidden transition">
      ${m.isPaid ? `
        <div class="absolute top-2 right-2 px-2 py-0.5 rounded text-[9px] font-black bg-emerald-500 text-slate-950 uppercase tracking-wider flex items-center gap-1 shadow">
          <i class="fa-solid fa-check"></i> ĐÃ THANH TOÁN
        </div>
      ` : `
        <div class="absolute top-2 right-2 px-2 py-0.5 rounded text-[9px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 uppercase tracking-wider">
          CHỜ QUÉT QR
        </div>
      `}

      <div>
        <span class="text-[10px] font-mono text-cyan-400 font-bold block">THÀNH VIÊN #${m.index}</span>
        <h5 class="text-xs font-bold text-white truncate">${m.name}</h5>
        <span class="text-sm font-black text-emerald-400 font-mono block mt-1">${m.amount.toLocaleString('vi-VN')} VNĐ</span>
      </div>

      <!-- QR Code Image -->
      <div class="p-2 bg-white rounded-xl flex items-center justify-center">
        <img src="${m.qrUrl}" alt="${m.memo}" class="w-36 h-auto rounded">
      </div>

      <!-- Memo -->
      <div class="bg-slate-900 p-2 rounded-lg border border-slate-800 text-[10px] flex items-center justify-between">
        <span class="text-slate-400">Nội dung:</span>
        <span class="font-mono font-bold text-amber-400">${m.memo}</span>
        <button onclick="copyToClipboard('${m.memo}', 'Nội dung chuyển khoản')" class="text-cyan-400 hover:text-cyan-300">
          <i class="fa-regular fa-copy"></i>
        </button>
      </div>

      ${!m.isPaid ? `
        <button onclick="simulatePayMember(${m.index})" class="w-full py-2 rounded-xl btn-glow-cyan text-slate-950 font-bold text-[10px] shadow transition flex items-center justify-center gap-1.5">
          <i class="fa-solid fa-mobile-screen"></i>
          <span>Mô Phỏng Quét Trả (${m.index})</span>
        </button>
      ` : `
        <div class="text-[10px] text-emerald-300 text-center font-semibold py-1">
          ✅ Đã nhận tiền vào STK MBBank Công Ty
        </div>
      `}
    </div>
  `).join('');
}

function simulatePayMember(idx) {
  const member = state.groupBooking.members.find(m => m.index === idx);
  if (!member || member.isPaid) return;

  member.isPaid = true;
  member.paidTime = new Date().toLocaleTimeString();

  ESCROW_LEDGER.unshift({
    txId: `TX-GRP-${Date.now().toString().slice(-5)}`,
    tripCode: `WM-${state.groupBooking.groupCode}-M${idx}`,
    type: "VIETQR_ESCROW_INFLOW",
    direction: "IN",
    amount: `${member.amount.toLocaleString('vi-VN')}đ`,
    sender: `${member.name} (Napas 247)`,
    receiver: "CONG TY CP CONG NGHE DU LICH WANDERMATCH",
    status: "HELD_IN_ESCROW",
    time: new Date().toLocaleString()
  });

  renderGroupMembersGrid();
  renderEscrowLedger();

  const paidCount = state.groupBooking.members.filter(m => m.isPaid).length;
  if (paidCount === state.groupBooking.members.length) {
    showToast('success', `🎉 TẤT CẢ 4/4 THÀNH VIÊN ĐÃ ĐÓNG ĐỦ! Hệ thống tự động kích hoạt AutoBookingSagaService khóa cứng vé và phòng!`);
  } else {
    showToast('success', `✅ Thành viên #${idx} (${member.name}) đã đóng ${member.amount.toLocaleString('vi-VN')}đ thành công!`);
  }
}

function simulateAllMembersPay() {
  state.groupBooking.members.forEach(m => {
    if (!m.isPaid) {
      m.isPaid = true;
      m.paidTime = new Date().toLocaleTimeString();
      ESCROW_LEDGER.unshift({
        txId: `TX-GRP-${Date.now().toString().slice(-5)}`,
        tripCode: `WM-${state.groupBooking.groupCode}-M${m.index}`,
        type: "VIETQR_ESCROW_INFLOW",
        direction: "IN",
        amount: `${m.amount.toLocaleString('vi-VN')}đ`,
        sender: `${m.name} (Napas 247)`,
        receiver: "CONG TY CP CONG NGHE DU LICH WANDERMATCH",
        status: "HELD_IN_ESCROW",
        time: new Date().toLocaleString()
      });
    }
  });

  renderGroupMembersGrid();
  renderEscrowLedger();
  showToast('success', '🎉 Toàn bộ nhóm 4 người đã đóng đủ 16.000.000đ! Chuyến đi đã được khóa cứng bảo lãnh 100%.');
}

function simulateGroupCancelRefund() {
  const paidMembers = state.groupBooking.members.filter(m => m.isPaid);
  if (paidMembers.length === 0) {
    showToast('info', 'Chưa có thành viên nào đóng tiền để hoàn.');
    return;
  }

  paidMembers.forEach(m => {
    ESCROW_LEDGER.unshift({
      txId: `TX-REFUND-${Date.now().toString().slice(-5)}`,
      tripCode: `WM-${state.groupBooking.groupCode}-M${m.index}`,
      type: "REFUND_FORCE_MAJEURE",
      direction: "OUT",
      amount: `${m.amount.toLocaleString('vi-VN')}đ`,
      sender: "CONG TY CP CONG NGHE DU LICH WANDERMATCH",
      receiver: `${m.name} (STK Napas 247)`,
      status: "REFUNDED_TO_USER",
      time: new Date().toLocaleString()
    });
  });

  state.groupBooking.members.forEach(m => m.isPaid = false);
  renderGroupMembersGrid();
  renderEscrowLedger();

  showToast('success', `⚡ Đã kích hoạt hoàn trả 100% tiền (${paidMembers.length} thành viên) về đúng STK Napas 247 không mất phí!`);
}

// 6. TRANSPARENT VALUE RECEIPT & ANTI-TOURIST TRAP (PROMPT 1 & 4)
function renderTransparentValueReceipt() {
  const budget = state.selectedBudget || 5000000;
  const retailFlight = Math.round(budget * 0.64);
  const retailHotel = Math.round(budget * 0.69);
  const totalMarket = retailFlight + retailHotel;
  const savings = totalMarket - budget;
  const savingsPct = ((savings / totalMarket) * 100).toFixed(1);

  const fPrice = document.getElementById('receipt-flight-price');
  const hPrice = document.getElementById('receipt-hotel-price');
  const tPrice = document.getElementById('receipt-total-market-price');
  const uPrice = document.getElementById('receipt-user-paid-price');
  const sHighlight = document.getElementById('receipt-savings-highlight');

  if (fPrice) fPrice.textContent = `${retailFlight.toLocaleString('vi-VN')} VNĐ`;
  if (hPrice) hPrice.textContent = `${retailHotel.toLocaleString('vi-VN')} VNĐ`;
  if (tPrice) tPrice.textContent = `${totalMarket.toLocaleString('vi-VN')} VNĐ`;
  if (uPrice) uPrice.textContent = `${budget.toLocaleString('vi-VN')} VNĐ`;
  if (sHighlight) {
    sHighlight.innerHTML = `
      <i class="fa-solid fa-arrow-trend-down"></i>
      <span>Chuyến đi Mù này đã giúp bạn tiết kiệm thực tế ${savings.toLocaleString('vi-VN')}đ (${savingsPct}%)!</span>
    `;
  }
}

function claimFoodVoucher() {
  showToast('success', '🎁 Đã lưu E-Voucher ẩm thực bản địa 200.000 VNĐ vào ví! Mã: WM-FOOD-200K (Áp dụng tại mọi quán trong cẩm nang Anti-Tourist Trap).');
}

// 7. ANTI-TOURIST TRAP GUIDE SPOTS
const ANTI_TRAP_DATA = {
  dalat: [
    { name: "Quán Bánh Căn Lệ Yersin", price: "35.000đ - 55.000đ / dĩa", reason: "Bánh căn giòn rụm, xíu mại thơm béo, người dân Đà Lạt ăn đông nhất." },
    { name: "Lẩu Gà Lá É Tao Ngộ (Đường 3/4)", price: "200.000đ - 300.000đ / nồi 3-4 người", reason: "Nước dùng the nồng lá é ngọt thanh, thịt gà ta chắc thịt chuẩn gốc." },
    { name: "Bánh Tráng Nướng Dì Đinh", price: "20.000đ - 35.000đ / cái", reason: "Pizza Đà Lạt nướng than hoa ngập phô mai bơ trứng, không bị chặt chém." },
    { name: "Quán Kem Bơ Thanh Thảo (Nguyễn Văn Trỗi)", price: "25.000đ - 30.000đ / ly", reason: "Bơ sáp dẻo quánh xay mịn kèm viên kem dừa thơm ngậy danh tiếng." },
    { name: "Chợ Đêm Ẩm Thực Góc Phố Không Cò Mồi", price: "15.000đ - 40.000đ / món", reason: "Sữa đậu nành nóng & bánh ngọt sưởi ấm đêm lạnh giá niêm yết chuẩn." }
  ],
  hochiminh: [
    { name: "Cơm Tấm Ba Ghiền (Đặng Văn Ngữ)", price: "85.000đ - 110.000đ / dĩa", reason: "Miếng sườn khổng lồ nướng than hoa đạt Michelin Bib Gourmand." },
    { name: "Ốc Đào (Hẻm 212B Nguyễn Trãi)", price: "120.000đ - 180.000đ / người", reason: "Ốc hương sốt bơ tỏi bánh mì nức tiếng Sài Gòn, hải sản tươi sống." },
    { name: "Phở Hòa Pasteur", price: "90.000đ - 110.000đ / tô", reason: "Nước dùng thanh trong gia truyền hơn 50 năm, thịt bò tươi mềm." },
    { name: "Bánh Mì Huỳnh Hoa", price: "68.000đ / ổ ngập nhân", reason: "Ổ bánh mì nặng nửa ký với 5 loại chả lụa pate bơ béo ngậy." },
    { name: "Hủ Tiếu Nam Vang Nhân Quán", price: "85.000đ - 100.000đ / tô", reason: "Hủ tiếu khô sốt tỏi ớt đặc trưng, tôm tươi giòn sần sật." }
  ],
  danang: [
    { name: "Bánh Tráng Cuốn Thịt Heo Bà Mua", price: "60.000đ - 85.000đ / phần", reason: "Thịt heo hai đầu da luộc mềm, mắm nêm cá cơm nguyên chất đậm đà." },
    { name: "Mì Quảng Bà Vị (Lê Đình Dương)", price: "40.000đ - 55.000đ / tô", reason: "Sợi mì tươi dẻo vàng nghệ, tôm thịt rim đậm đà và bánh tráng mè nướng." },
    { name: "Hải Sản Bé Mặn (Đường Võ Nguyên Giáp)", price: "180.000đ - 280.000đ / người", reason: "Cân tại bể công khai trước mặt khách, niêm yết rõ ràng không sợ chém." },
    { name: "Bánh Xèo Tôm Nhảy Năm Hiền", price: "45.000đ - 65.000đ / dĩa", reason: "Tôm đất tươi nhảy tanh tách đổ bánh giòn tan chấm sốt tương đậu phụng." },
    { name: "Chè Liên Đà Nẵng (Đường Hoàng Diệu)", price: "25.000đ - 35.000đ / chén", reason: "Chè sầu riêng nước cốt dừa nguyên chất béo ngậy làm xiêu lòng thực khách." }
  ]
};

function renderAntiTrapSpots() {
  const container = document.getElementById('anti-trap-spots-list');
  if (!container) return;

  const destKey = state.selectedDestination === 'blind' ? 'dalat' : state.selectedDestination;
  const spots = ANTI_TRAP_DATA[destKey] || ANTI_TRAP_DATA['dalat'];

  container.innerHTML = spots.map(s => `
    <div class="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
      <div class="flex items-center justify-between">
        <h5 class="font-bold text-white text-xs">${s.name}</h5>
        <span class="font-mono text-[10px] font-bold text-emerald-400 bg-emerald-950/70 px-2 py-0.5 rounded border border-emerald-800">${s.price}</span>
      </div>
      <p class="text-[11px] text-slate-300 leading-tight">${s.reason}</p>
    </div>
  `).join('');
}

// 8. SOS SLA 15-MINUTE GUARANTEE (PROMPT 4)
function openSosModal() {
  const modal = document.getElementById('sos-sla-modal');
  if (modal) modal.classList.remove('hidden');
}

function closeSosModal() {
  const modal = document.getElementById('sos-sla-modal');
  if (modal) modal.classList.add('hidden');
}

function executeSosClaim() {
  const btn = document.getElementById('btn-trigger-sos-claim');
  const resBox = document.getElementById('sos-result-box');

  if (btn) {
    btn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Đang kích hoạt giao thức trích phạt đối tác...`;
    btn.disabled = true;
  }

  setTimeout(() => {
    state.sosClaimed = true;
    state.slaDepositBalance = Math.max(0, state.slaDepositBalance - 5000000);
    const balanceEl = document.getElementById('b2b-sla-balance');
    if (balanceEl) balanceEl.textContent = `${state.slaDepositBalance.toLocaleString('vi-VN')} VNĐ`;

    ESCROW_LEDGER.unshift({
      txId: `TX-SOS-SLA-${Date.now().toString().slice(-5)}`,
      tripCode: state.orderCode,
      type: "SLA_PENALTY_DEDUCTION",
      direction: "OUT",
      amount: "5.000.000đ",
      sender: "B2B_PARTNER_ESCROW_SECURITY_DEPOSIT",
      receiver: "5_STAR_BACKUP_HOTEL_REPLACEMENT",
      status: "DISBURSED_TO_PARTNER",
      time: new Date().toLocaleString()
    });
    renderEscrowLedger();

    if (resBox) resBox.classList.remove('hidden');
    if (btn) {
      btn.innerHTML = `<i class="fa-solid fa-circle-check"></i> ĐÃ BỒI THƯỜNG KHÁCH SẠN 5 SAO!`;
      btn.className = "flex-1 py-3 rounded-xl bg-emerald-600 text-white font-black text-xs shadow-xl";
    }

    showToast('success', '🚨 Giao thức SLA thành công: Đã tự động nâng cấp khách sạn 5 sao liền kề và điều xe đón trong 15 phút!');
  }, 1200);
}

// ============================================================================
// 13. TOAST NOTIFICATION UTILITY
// ============================================================================

function showToast(type, message) {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  const icon = type === 'success' ? 'fa-circle-check text-emerald-400' :
               type === 'error' ? 'fa-circle-exclamation text-rose-400' :
               'fa-circle-info text-cyan-400';
  const border = type === 'success' ? 'border-emerald-500/40 bg-slate-900/90' :
                 type === 'error' ? 'border-rose-500/40 bg-slate-900/90' :
                 'border-cyan-500/40 bg-slate-900/90';

  toast.className = `toast border ${border} text-xs text-slate-100`;
  toast.innerHTML = `
    <i class="fa-solid ${icon} text-base shrink-0"></i>
    <span class="flex-1 font-medium leading-relaxed">${message}</span>
  `;

  container.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(-10px)';
    setTimeout(() => toast.remove(), 300);
  }, 4000);
}

// ============================================================================
// 14. DYNAMIC THEME COLOR SWITCHER & APP INITIALIZATION
// ============================================================================

const THEME_NAMES = {
  cyan: '🌌 Cyber Cyan (Mặc định)',
  emerald: '🌿 Emerald Pine (Rừng Thông)',
  sunset: '🌅 Sunset Amber (Hoàng Hôn)',
  sakura: '🌸 Sakura Rose (Hồng Anh Đào)',
  royal: '💜 Royal Amethyst (Tím Thượng Lưu)',
  light: '☀️ Daylight Pearl (Giao diện Sáng)'
};

function setTheme(themeKey, silent = false) {
  const validTheme = THEME_NAMES[themeKey] ? themeKey : 'cyan';
  document.documentElement.setAttribute('data-theme', validTheme);
  document.body.setAttribute('data-theme', validTheme);
  try {
    localStorage.setItem('wandermatch_theme', validTheme);
  } catch (e) {}

  Object.keys(THEME_NAMES).forEach(k => {
    const btn = document.getElementById(`theme-btn-${k}`);
    if (btn) {
      if (k === validTheme) {
        btn.classList.add('active-theme');
      } else {
        btn.classList.remove('active-theme');
      }
    }
  });

  if (!silent) {
    showToast('info', `🎨 Đã chuyển giao diện sang chủ đề: ${THEME_NAMES[validTheme]}`);
  }
}

function openGithubSyncModal() {
  const modal = document.getElementById('github-sync-modal');
  if (modal) modal.classList.remove('hidden');
  fetch('/api/github/status')
    .then(r => r.json())
    .then(data => {
      if (data && data.syncStatus) {
        updateGithubModalUi(data.syncStatus);
      }
    })
    .catch(() => {});
}

function closeGithubSyncModal() {
  const modal = document.getElementById('github-sync-modal');
  if (modal) modal.classList.add('hidden');
}

function updateGithubModalUi(st) {
  const stateEl = document.getElementById('gh-modal-state');
  const timeEl = document.getElementById('gh-modal-time');
  const msgEl = document.getElementById('gh-modal-msg');
  const urlInput = document.getElementById('gh-remote-url-input');
  const headerBadge = document.getElementById('github-header-status');

  if (timeEl && st.lastSyncTime) timeEl.textContent = st.lastSyncTime;
  if (msgEl && st.lastCommitMessage) msgEl.textContent = st.lastCommitMessage;
  if (urlInput && st.remoteUrl) urlInput.value = st.remoteUrl;
  if (stateEl && st.state) {
    stateEl.textContent = st.state === 'SYNCED_GITHUB'
      ? '✅ ĐÃ ĐỒNG BỘ LÊN GITHUB'
      : st.state === 'DETECTED_CHANGES'
      ? '⚡ PHÁT HIỆN CODE MỚI - ĐANG TỰ ĐỘNG ĐỒNG BỘ...'
      : '🟢 ĐANG THEO DÕI THAY ĐỔI CODE (REAL-TIME)';
  }
  if (headerBadge) {
    headerBadge.textContent = st.state === 'SYNCED_GITHUB' ? 'GitHub Synced' : 'Auto-Sync ON';
  }
}

function triggerManualGithubSync() {
  const btn = document.getElementById('btn-trigger-gh-sync');
  const remoteUrl = document.getElementById('gh-remote-url-input')?.value || '';
  if (btn) {
    btn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Đang commit & đẩy code lên GitHub...`;
    btn.disabled = true;
  }

  fetch('/api/github/sync', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ remoteUrl })
  })
    .then(r => r.json())
    .then(data => {
      if (btn) {
        btn.innerHTML = `<i class="fa-solid fa-cloud-arrow-up"></i> <span>🚀 Đồng Bộ & Đẩy Lên GitHub Ngay</span>`;
        btn.disabled = false;
      }
      if (data && data.syncStatus) {
        updateGithubModalUi(data.syncStatus);
        if (data.syncStatus.state === 'SYNCED_GITHUB' || data.syncStatus.state === 'UP_TO_DATE') {
          showToast('success', '✅ Đã tự động commit & đẩy code mới nhất lên GitHub!');
        } else {
          showToast('info', '📦 Đã tự động tạo bản commit mới nhất. Hãy đảm bảo repo đã được tạo trên GitHub.');
        }
      }
    })
    .catch(() => {
      if (btn) {
        btn.innerHTML = `<i class="fa-solid fa-cloud-arrow-up"></i> <span>🚀 Đồng Bộ & Đẩy Lên GitHub Ngay</span>`;
        btn.disabled = false;
      }
      showToast('info', 'Đã lưu trạng thái đồng bộ GitHub!');
    });
}

document.addEventListener('DOMContentLoaded', () => {
  let savedTheme = 'cyan';
  try {
    savedTheme = localStorage.getItem('wandermatch_theme') || 'cyan';
  } catch (e) {}
  setTheme(savedTheme, true);

  setLanguage('vi');
  renderDestinationHero();
  renderTripSummaryCard();
  renderDetailedDayItinerary();
  renderBudgetAllocation();
  renderItineraries();
  renderPois();
  renderRefundCalculator('TIER_1');
  renderEscrowLedger();
  updateVietQrDisplay();
  startPaymentCountdown();
  setTimeout(initScratchCard, 200);

  // Consumer Pragmatism v3.1 Inits
  if (typeof renderValueGuaranteeCalculator === 'function') renderValueGuaranteeCalculator();
  if (typeof renderPackingChecklist === 'function') renderPackingChecklist();
  if (typeof renderTransparentValueReceipt === 'function') renderTransparentValueReceipt();
  if (typeof renderAntiTrapSpots === 'function') renderAntiTrapSpots();
  if (typeof initGroupBooking === 'function') initGroupBooking();

  document.querySelectorAll('.modal-star').forEach(star => {
    star.addEventListener('click', () => {
      const score = Number(star.getAttribute('data-score'));
      setModalRating(score);
    });
  });

  ['healing', 'foodie', 'adventure', 'resort'].forEach(axis => {
    const slider = document.getElementById(`slider-${axis}`);
    const label = document.getElementById(`val-${axis}`);
    if (slider && label) {
      slider.addEventListener('input', (e) => {
        label.textContent = `${e.target.value}%`;
      });
    }
  });
});
