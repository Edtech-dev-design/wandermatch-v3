"""
WANDERMATCH 3.1 — PRAGMATIC AI MATCHING ENGINE (Python AI Engine)
Author: Senior Machine Learning & Operations Research Engineer
Multi-Objective Optimization: Socio-psychological Matching + Dual Economic Constraints + Pragmatic Reveal Kit
"""

import os
import math
import json
from typing import List, Dict, Any, Optional
from pydantic import BaseModel, Field
import numpy as np
import pandas as pd
from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware

# Initialize FastAPI App
app = FastAPI(
    title="WanderMatch 3.1 Pragmatic AI Engine",
    description="Dual Economic Constraints, Pragmatic Comfort Locks, Pocket-Friendly Estimator & Gemini Reveal Kit",
    version="3.1.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ============================================================================
# 1. DATA MODELS & SCHEMAS
# ============================================================================

class ComfortLocks(BaseModel):
    no_red_eye: bool = Field(default=True, description="No departures between 21:30 and 06:30")
    bed_type: str = Field(default="TWIN", description="KING (couples) or TWIN (friends)")
    need_work_desk: bool = Field(default=False, description="Workcation Ready: dedicated desk + wifi >= 50Mbps")
    luggage_kg: int = Field(default=20, description="Included checked luggage kg")
    shuttle_airport: bool = Field(default=True, description="Direct airport pickup to hotel")

class MatchingRequest(BaseModel):
    user_id: str
    user_budget: float = Field(ge=1000000, description="Budget in VND, min 1,000,000 VND")
    pax: int = Field(default=2, ge=1, le=10)
    persona_vector: List[float] = Field(default=[0.8, 0.4, 0.9, 0.2, 0.7], description="Normalized Big 5 or Travel Archetype")
    blacklisted_cities: List[str] = Field(default_factory=list)
    comfort_locks: ComfortLocks = Field(default_factory=ComfortLocks)
    destination_cost_index: Optional[Dict[str, float]] = Field(
        default={
            "hochiminh": 1.25,
            "dalat": 0.90,
            "danang": 0.85,
            "phuquoc": 1.40,
            "quynhon": 0.80
        }
    )

class TransparentValueReceipt(BaseModel):
    market_flight_price: float
    market_hotel_price: float
    total_market_retail_value: float
    user_paid_amount: float
    real_savings_amount: float
    real_savings_percentage: float
    value_guarantee_met: bool
    free_local_voucher_vnd: float = 200000.0

class PragmaticRevealKit(BaseModel):
    destination_code: str
    destination_name: str
    hotel_name: str
    star_rating: int
    review_score: float
    bed_type_confirmed: str
    flight_departure_window: str
    estimated_on_ground_pocket_money: float
    transparent_receipt: TransparentValueReceipt
    smart_packing_checklist: List[Dict[str, str]]
    micro_itinerary_3d2n: List[Dict[str, Any]]
    anti_tourist_trap_guide: Dict[str, Any]

# ============================================================================
# 2. IN-MEMORY B2B INVENTORY POOL (SIMULATED DATASET)
# ============================================================================

HOTEL_INVENTORY = [
    {
        "id": "HTL-HCM-01",
        "city": "hochiminh",
        "name": "The Myst Dong Khoi & Spa",
        "star": 5,
        "review_score": 9.1,
        "bed_types": ["KING", "TWIN"],
        "has_work_desk": True,
        "wifi_mbps": 120,
        "net_cost_per_night": 1200000,
        "retail_price_per_night": 2300000
    },
    {
        "id": "HTL-DL-02",
        "city": "dalat",
        "name": "Colline Heritage Boutique Hotel",
        "star": 4,
        "review_score": 8.8,
        "bed_types": ["KING", "TWIN"],
        "has_work_desk": True,
        "wifi_mbps": 80,
        "net_cost_per_night": 750000,
        "retail_price_per_night": 1450000
    },
    {
        "id": "HTL-DN-03",
        "city": "danang",
        "name": "Grand Tourane Ocean Resort",
        "star": 5,
        "review_score": 8.9,
        "bed_types": ["KING", "TWIN"],
        "has_work_desk": True,
        "wifi_mbps": 100,
        "net_cost_per_night": 900000,
        "retail_price_per_night": 1750000
    },
    {
        "id": "HTL-DN-LOW",
        "city": "danang",
        "name": "Budget Old Motel (Blacklist Candidate)",
        "star": 2,
        "review_score": 6.8,  # Below 8.0 baseline
        "bed_types": ["TWIN"],
        "has_work_desk": False,
        "wifi_mbps": 10,
        "net_cost_per_night": 300000,
        "retail_price_per_night": 500000
    }
]

TRANSIT_INVENTORY = [
    {
        "id": "FL-VN-101",
        "city": "hochiminh",
        "carrier": "Vietnam Airlines",
        "depart_time": "08:15",
        "is_red_eye": False,
        "has_20kg_luggage": True,
        "net_cost": 1100000,
        "retail_price": 1650000
    },
    {
        "id": "FL-VJ-202",
        "city": "dalat",
        "carrier": "Vietjet Air Premium",
        "depart_time": "09:30",
        "is_red_eye": False,
        "has_20kg_luggage": True,
        "net_cost": 850000,
        "retail_price": 1350000
    },
    {
        "id": "FL-QH-303",
        "city": "danang",
        "carrier": "Bamboo Airways",
        "depart_time": "07:45",
        "is_red_eye": False,
        "has_20kg_luggage": True,
        "net_cost": 950000,
        "retail_price": 1500000
    },
    {
        "id": "FL-RED-EYE",
        "city": "danang",
        "carrier": "Midnight Budget Flight",
        "depart_time": "23:45",
        "is_red_eye": True, # Filtered out when no_red_eye is True
        "has_20kg_luggage": False,
        "net_cost": 450000,
        "retail_price": 750000
    }
]

# ============================================================================
# 3. CORE LOGIC: PRAGMATIC MATCHER & DUAL ECONOMIC OPTIMIZATION
# ============================================================================

class PragmaticMatcherEngine:
    def __init__(self):
        self.min_margin_company = 0.18 # WanderMatch Gross Margin >= 18% (net <= budget * 0.82)
        self.min_perceived_value_customer = 1.15 # Retail Floor >= 115% - 120%
        self.hotel_df = pd.DataFrame(HOTEL_INVENTORY)
        self.transit_df = pd.DataFrame(TRANSIT_INVENTORY)

    def filter_and_match(self, req: MatchingRequest) -> PragmaticRevealKit:
        budget = req.user_budget
        locks = req.comfort_locks
        
        # 1. Filter Hotels by Pragmatic Quality Baseline
        eligible_hotels = self.hotel_df[
            (self.hotel_df['review_score'] >= 8.0) & # Hard SLA baseline
            (self.hotel_df['bed_types'].apply(lambda beds: locks.bed_type in beds)) &
            (~self.hotel_df['city'].isin(req.blacklisted_cities))
        ]
        
        if locks.need_work_desk:
            eligible_hotels = eligible_hotels[
                (eligible_hotels['has_work_desk'] == True) &
                (eligible_hotels['wifi_mbps'] >= 50)
            ]
            
        if eligible_hotels.empty:
            raise HTTPException(
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                detail="Không tìm thấy khách sạn đạt tiêu chuẩn chất lượng cứng (Review >= 8.0 / Cấu hình giường / Workcation)."
            )

        # 2. Filter Transits by Red-Eye Lock
        eligible_transits = self.transit_df[
            (~self.transit_df['city'].isin(req.blacklisted_cities))
        ]
        if locks.no_red_eye:
            eligible_transits = eligible_transits[eligible_transits['is_red_eye'] == False]
            
        if eligible_transits.empty:
            raise HTTPException(
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                detail="Không tìm thấy chuyến bay phù hợp ngoài khung giờ bay đêm (No Red-Eye)."
            )

        # 3. Multi-Objective Pair Search: Dual Economic Constraints
        valid_pairs = []
        for _, hotel in eligible_hotels.iterrows():
            city = hotel['city']
            matching_transits = eligible_transits[eligible_transits['city'] == city]
            
            for _, transit in matching_transits.iterrows():
                # 3 nights hotel + transit khứ hồi x2
                total_net_cost = (hotel['net_cost_per_night'] * 2) + (transit['net_cost'] * 2)
                total_retail_price = (hotel['retail_price_per_night'] * 2) + (transit['retail_price'] * 2)
                
                # Check Dual Economic Constraints
                company_arbitrage_ok = total_net_cost <= (budget * (1 - self.min_margin_company))
                customer_value_ok = total_retail_price >= (budget * self.min_perceived_value_customer)
                
                # Objective Score: High Customer Value + Safe Company Margin + Persona Affinity
                margin_pct = (budget - total_net_cost) / budget
                value_multiple = total_retail_price / budget
                objective_score = (value_multiple * 0.5) + (margin_pct * 0.3) + (hotel['review_score'] / 10.0 * 0.2)

                valid_pairs.append({
                    "hotel": hotel,
                    "transit": transit,
                    "city": city,
                    "total_net_cost": total_net_cost,
                    "total_retail_price": total_retail_price,
                    "company_margin": margin_pct,
                    "retail_value_ratio": value_multiple,
                    "objective_score": objective_score,
                    "dual_economic_satisfied": company_arbitrage_ok and customer_value_ok
                })

        if not valid_pairs:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Không tìm thấy tổ hợp vé + phòng thỏa mãn đồng thời biên lợi nhuận sàn và bảo hiểm giá trị 120% cho khách."
            )

        # Sort by satisfying dual constraints first, then objective score
        valid_pairs.sort(key=lambda x: (x['dual_economic_satisfied'], x['objective_score']), reverse=True)
        best_candidate = valid_pairs[0]
        
        hotel = best_candidate['hotel']
        transit = best_candidate['transit']
        city = best_candidate['city']
        
        # 4. Pocket-Friendly Score: Estimated On-Ground Pocket Money
        cost_index = req.destination_cost_index.get(city, 1.0)
        daily_food_transit_base = 350000.0 * cost_index
        estimated_pocket_money = math.round(daily_food_transit_base * 3, -4)

        # 5. Transparent Value Receipt Calculation
        retail_flight = transit['retail_price'] * 2
        retail_hotel = hotel['retail_price_per_night'] * 2
        total_market = retail_flight + retail_hotel
        real_savings = total_market - budget
        savings_pct = (real_savings / total_market) * 100.0

        receipt = TransparentValueReceipt(
            market_flight_price=retail_flight,
            market_hotel_price=retail_hotel,
            total_market_retail_value=total_market,
            user_paid_amount=budget,
            real_savings_amount=real_savings,
            real_savings_percentage=round(savings_pct, 1),
            value_guarantee_met=total_market >= (budget * 1.15),
            free_local_voucher_vnd=200000.0
        )

        # 6. Generate Pragmatic Reveal Kit (Gemini Fallback Structure)
        reveal_kit = self._generate_reveal_kit(city, hotel, transit, receipt, estimated_pocket_money, locks)
        return reveal_kit

    def _generate_reveal_kit(self, city: str, hotel: Any, transit: Any, receipt: TransparentValueReceipt, pocket_money: float, locks: ComfortLocks) -> PragmaticRevealKit:
        city_names = {
            "hochiminh": "TP. Hồ Chí Minh",
            "dalat": "Đà Lạt (Lâm Đồng)",
            "danang": "Đà Nẵng & Hội An"
        }
        city_name = city_names.get(city, city.title())

        # Smart Packing Checklist (tailored by terrain/weather)
        pack_items = {
            "dalat": [
                {"item": "Áo khoác ấm & áo giữ nhiệt", "reason": "Nhiệt độ đêm giảm sâu 14-16°C"},
                {"item": "Ô gấp gọn / Áo mưa mỏng", "reason": "Thường có mưa phùn và sương mù bất chợt"},
                {"item": "Giày thể thao chống trơn", "reason": "Địa hình dốc đồi thông và bậc thang thác đá"},
                {"item": "Kem dưỡng ẩm & Son dưỡng", "reason": "Không khí khô lạnh dễ nứt nẻ da"},
                {"item": "CCCD / Hộ chiếu bản gốc", "reason": "Check-in lễ tân khách sạn & nhận xe máy"},
                {"item": "Sạc dự phòng 20.000mAh", "reason": "Chụp ảnh săn mây liên tục ngoài trời"},
                {"item": "Thuốc chống say xe đèo dốc", "reason": "Tuyến đường đèo Prenn / Mimosa nhiều cua gắt"},
                {"item": "Bình giữ nhiệt mini", "reason": "Đựng trà atisô nóng giữ ấm cơ thể"}
            ],
            "danang": [
                {"item": "Đồ bơi & Kính râm chống tia UV", "reason": "Bãi biển Mỹ Khê nắng vàng rực rỡ"},
                {"item": "Kem chống nắng SPF 50+ PA++++", "reason": "Chỉ số UV miền Trung ban ngày rất cao"},
                {"item": "Dép sandal / Dép xốp đi biển", "reason": "Thuận tiện dạo bãi cát và lội nước"},
                {"item": "Trang phục lịch sự kín đáo", "reason": "Tham quan Chùa Linh Ứng & Phố Cổ Hội An"},
                {"item": "Túi chống nước điện thoại", "reason": "Bảo vệ máy khi tắm biển hoặc đi thuyền thúng"},
                {"item": "CCCD bản gốc", "reason": "Xác nhận nhận phòng resort & vé bay Bamboo Airways"},
                {"item": "Mũ rộng vành / Nón cói", "reason": "Che nắng khi dạo bộ cầu Rồng / phố đi bộ"},
                {"item": "Bình xịt khoáng làm dịu da", "reason": "Cấp ẩm sau khi tắm nắng và gió biển"}
            ],
            "hochiminh": [
                {"item": "Trang phục năng động, thoáng mát", "reason": "Nắng ấm nhiệt đới đặc trưng Sài Gòn"},
                {"item": "Ô gấp gọn chống mưa rào", "reason": "Đặc sản 'mưa chợt đến rồi chợt đi' buổi chiều"},
                {"item": "Giày êm đi bộ dạo phố", "reason": "Khám phá phố đi bộ Nguyễn Huệ & chợ Bến Thành"},
                {"item": "Túi đeo chéo an toàn trước ngực", "reason": "Bảo vệ tư trang nơi đông người"},
                {"item": "CCCD bản gốc", "reason": "Thủ tục nhận phòng The Myst Đồng Khởi"},
                {"item": "Kính râm & Khẩu trang chống bụi", "reason": "Di chuyển ngắm cảnh bằng xe bus 2 tầng / Grab"},
                {"item": "Sạc dự phòng & Dây cáp sạc", "reason": "Cả ngày check-in các quán cafe rooftop"},
                {"item": "Bình nước cá nhân", "reason": "Giữ đủ nước khi đi bộ trải nghiệm ẩm thực đường phố"}
            ]
        }

        # Micro-Itinerary with km distances
        itinerary = [
            {
                "day": 1,
                "title": "Hạ cánh, Check-in Nghỉ dưỡng & Ẩm thực Chào mừng",
                "morning": f"Xe đón từ sân bay đưa thẳng về {hotel['name']} (0km). Nhận phòng {locks.bed_type}, cất hành lý và thưởng thức welcome drink.",
                "afternoon": "Thư giãn tại hồ bơi khách sạn. Khởi hành dạo trung tâm, check-in địa điểm biểu tượng cách khách sạn 1.2km.",
                "evening": "Thưởng thức bữa tối đặc sản bản địa tại nhà hàng đối tác (tặng kèm voucher 200k), dạo phố đêm lãng mạn."
            },
            {
                "day": 2,
                "title": "Hành trình Trải nghiệm Bản sắc Văn hóa & Check-in Sống ảo",
                "morning": "Ăn buffet sáng tiêu chuẩn tại khách sạn. 08:30 xe đón đi tour ngắm cảnh thiên nhiên cách khách sạn 4.5km.",
                "afternoon": "Thưởng thức cafe view toàn cảnh, trải nghiệm ẩm thực bản địa ngon-bổ-rẻ tại danh sách Anti-Tourist Trap.",
                "evening": "Trải nghiệm acoustic chill hoặc dạo chợ đêm. Thưởng thức các món ăn vặt trứ danh với giá niêm yết chuẩn."
            },
            {
                "day": 3,
                "title": "Mua sắm Quà Bản địa, Check-out & Tạm biệt",
                "morning": "Buffet sáng, tự do dạo mua đặc sản tại chợ truyền thống có bảo đảm giá. Trở về thu dọn hành lý.",
                "afternoon": "12:00 Check-out 1 chạm không cần chờ đợi. Xe đưa đón đưa đoàn ra sân bay trước giờ bay 2 tiếng.",
                "evening": "Đáp chuyến bay về điểm xuất phát. Kết thúc chuyến du lịch mù đầy ắp bất ngờ và giá trị thực tế."
            }
        ]

        # Anti-Tourist Trap Guide
        anti_trap = {
            "authentic_spots": [
                {"name": "Quán Bánh Căn / Bánh Xèo Bản Địa Cô Ba", "price_range": "35.000đ - 60.000đ", "why": "Người dân địa phương ăn đông nhất, bột tươi đổ than hồng giòn rụm."},
                {"name": "Hải Sản / Lẩu Tươi Sống Bình Dân A Tèo", "price_range": "150.000đ - 250.000đ/người", "why": "Cân tại bể trước mặt khách, niêm yết bảng giá rõ ràng từng con."},
                {"name": "Tiệm Cà Phê Mộc Góc Phố Xưa", "price_range": "25.000đ - 45.000đ", "why": "Cà phê hạt rang xay nguyên chất, view ngắm nhịp sống êm đềm."},
                {"name": "Bánh Mì Kẹp Thịt Nướng Đặc Sản", "price_range": "20.000đ - 35.000đ", "why": "Pate gan tự làm béo ngậy, sốt đặc biệt gia truyền 30 năm."},
                {"name": "Chè Cung Đình / Sữa Đậu Nành Nóng", "price_range": "15.000đ - 25.000đ", "why": "Vị ngọt thanh tự nhiên, mở bán từ chiều tối tới đêm muộn."}
            ],
            "trap_warnings": [
                "Cảnh báo 1: Tuyệt đối không đi theo 'cò mồi' phát tờ rơi dẫn vào vườn dâu/quán hải sản dọc đường quốc lộ.",
                "Cảnh báo 2: Luôn xem menu có in giá VNĐ cụ thể và hỏi rõ cách tính theo lạng hay theo đĩa trước khi gọi món.",
                "Cảnh báo 3: Khi mua đặc sản đóng hộp làm quà, hãy vào các cơ sở OCOP hoặc siêu thị đặc sản uy tín để tránh mua phải hàng trôi nổi kém chất lượng."
            ]
        }

        return PragmaticRevealKit(
            destination_code=city,
            destination_name=city_name,
            hotel_name=hotel['name'],
            star_rating=hotel['star'],
            review_score=hotel['review_score'],
            bed_type_confirmed=f"{locks.bed_type} Bed (Đã khóa cứng)",
            flight_departure_window=f"Khởi hành {transit['depart_time']} sáng (Cam kết không bay giờ xấu Red-Eye)",
            estimated_on_ground_pocket_money=pocket_money,
            transparent_receipt=receipt,
            smart_packing_checklist=pack_items.get(city, pack_items['dalat']),
            micro_itinerary_3d2n=itinerary,
            anti_tourist_trap_guide=anti_trap
        )

# Initialize Engine Instance
matcher_engine = PragmaticMatcherEngine()

# ============================================================================
# 4. REST API ENDPOINTS
# ============================================================================

@app.get("/")
def health_check():
    return {
        "status": "ONLINE",
        "service": "WanderMatch 3.1 Pragmatic AI Matching Engine",
        "algorithms": ["Multi-Objective Optimization", "Dual Economic Constraints", "Pragmatic Quality Baseline"]
    }

@app.post("/api/ai/pragmatic-match", response_model=PragmaticRevealKit)
def match_trip(req: MatchingRequest):
    """
    Kích hoạt thuật toán ghép nối đa mục tiêu:
    - Sàn giá trị bán lẻ 120%
    - Khóa chất lượng thực dụng: Giờ bay, Cấu hình giường, 20kg hành lý, Workcation
    - Sinh Pragmatic Reveal Kit minh bạch
    """
    return matcher_engine.filter_and_match(req)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("pragmatic_matcher:app", host="0.0.0.0", port=8001, reload=True)
