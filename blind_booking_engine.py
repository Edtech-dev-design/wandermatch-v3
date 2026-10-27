"""
========================================================================================
WANDERMATCH — BLIND BOOKING / BUDGET TRAVEL OPTIMIZATION ENGINE
========================================================================================
Vai trò: Software Architect & Senior Data Scientist (OTA Industry)
Mục tiêu:
  Xây dựng lõi thuật toán "Du Lịch Mù" (Blind Booking Engine):
  Người dùng chỉ cần nhập:
    - Điểm khởi hành (Origin: ví dụ SGN, HAN, DAD)
    - Ngân sách cố định (Budget X VNĐ - số chẵn, tròn trăm)
    - Thời gian chuyến đi (Số ngày / số đêm)
    - Số lượng khách (Pax)
    - Vector sở thích trải nghiệm (User Preference Vector: beach, food, nature, culture, healing, adventure...)
    - Tùy chọn khẩu vị ẩm thực & ghi chú chuyến đi trước
  Hệ thống tự động:
    1. Lọc tuyến đường bay khứ hồi khả thi < Ngân sách (Budget Route Filtering)
    2. Khớp độ tương đồng sở thích bằng Cosine Similarity (Vector Recommendation)
    3. Tối ưu hóa combo Vé máy bay + Khách sạn bằng bài toán Cái Túi (Knapsack Optimization)
    4. Lựa chọn Hộp Quà May Mắn bí mật bằng thuật toán Ngẫu Nhiên Có Trọng Số (Weighted Random)
    5. Xuất tối đa 3 lựa chọn combo tối ưu kèm bảng kê chi phí dịch vụ hợp nhất
========================================================================================
"""

import math
import random
from typing import List, Dict, Any, Tuple, Optional


# ======================================================================================
# PHẦN 1: THIẾT KẾ CẤU TRÚC DỮ LIỆU (MOCK DATA ENGINES)
# ======================================================================================
# Chuẩn hóa không gian đặc trưng (Feature Vector Dimensions) cho Vector 6 chiều:
# [0: 'beach', 1: 'food', 2: 'nature', 3: 'culture', 4: 'healing', 5: 'adventure']
FEATURE_KEYS = ['beach', 'food', 'nature', 'culture', 'healing', 'adventure']

# 1.1. FLIGHT API MOCK (Dữ liệu chuyến bay giả lập từ các hãng hàng không)
# Mỗi record gồm: Mã chuyến, Điểm đi, Điểm đến, Hãng bay, Giá vé 1 chiều (VNĐ), Giờ bay
MOCK_FLIGHTS = [
    # Tuyến từ TP.HCM (SGN)
    {"flight_no": "VN112", "origin": "SGN", "destination": "DAD", "carrier": "Vietnam Airlines", "price_oneway": 950000, "depart_time": "08:15", "rating": 4.8},
    {"flight_no": "VN113", "origin": "DAD", "destination": "SGN", "carrier": "Vietnam Airlines", "price_oneway": 980000, "depart_time": "17:30", "rating": 4.8},
    {"flight_no": "VJ204", "origin": "SGN", "destination": "DAD", "carrier": "Vietjet Air", "price_oneway": 590000, "depart_time": "09:45", "rating": 4.2},
    {"flight_no": "VJ205", "origin": "DAD", "destination": "SGN", "carrier": "Vietjet Air", "price_oneway": 620000, "depart_time": "18:15", "rating": 4.2},

    {"flight_no": "VN138", "origin": "SGN", "destination": "DLI", "carrier": "Vietnam Airlines", "price_oneway": 750000, "depart_time": "07:30", "rating": 4.9},
    {"flight_no": "VN139", "origin": "DLI", "destination": "SGN", "carrier": "Vietnam Airlines", "price_oneway": 780000, "depart_time": "16:00", "rating": 4.9},
    {"flight_no": "QH202", "origin": "SGN", "destination": "DLI", "carrier": "Bamboo Airways", "price_oneway": 650000, "depart_time": "08:00", "rating": 4.6},
    {"flight_no": "QH203", "origin": "DLI", "destination": "SGN", "carrier": "Bamboo Airways", "price_oneway": 680000, "depart_time": "16:45", "rating": 4.6},

    {"flight_no": "VN150", "origin": "SGN", "destination": "PQC", "carrier": "Vietnam Airlines", "price_oneway": 980000, "depart_time": "09:10", "rating": 4.8},
    {"flight_no": "VN151", "origin": "PQC", "destination": "SGN", "carrier": "Vietnam Airlines", "price_oneway": 990000, "depart_time": "18:20", "rating": 4.8},
    {"flight_no": "VJ302", "origin": "SGN", "destination": "PQC", "carrier": "Vietjet Air", "price_oneway": 650000, "depart_time": "10:20", "rating": 4.3},
    {"flight_no": "VJ303", "origin": "PQC", "destination": "SGN", "carrier": "Vietjet Air", "price_oneway": 680000, "depart_time": "19:00", "rating": 4.3},

    {"flight_no": "VN162", "origin": "SGN", "destination": "UIH", "carrier": "Vietnam Airlines", "price_oneway": 720000, "depart_time": "08:45", "rating": 4.7},
    {"flight_no": "VN163", "origin": "UIH", "destination": "SGN", "carrier": "Vietnam Airlines", "price_oneway": 750000, "depart_time": "17:15", "rating": 4.7},
    {"flight_no": "QH304", "origin": "SGN", "destination": "UIH", "carrier": "Bamboo Airways", "price_oneway": 620000, "depart_time": "09:30", "rating": 4.6},
    {"flight_no": "QH305", "origin": "UIH", "destination": "SGN", "carrier": "Bamboo Airways", "price_oneway": 650000, "depart_time": "18:00", "rating": 4.6},

    {"flight_no": "VN174", "origin": "SGN", "destination": "HUI", "carrier": "Vietnam Airlines", "price_oneway": 780000, "depart_time": "08:30", "rating": 4.8},
    {"flight_no": "VN175", "origin": "HUI", "destination": "SGN", "carrier": "Vietnam Airlines", "price_oneway": 820000, "depart_time": "17:45", "rating": 4.8},

    {"flight_no": "VN186", "origin": "SGN", "destination": "PXU", "carrier": "Vietnam Airlines", "price_oneway": 680000, "depart_time": "07:15", "rating": 4.7},
    {"flight_no": "VN187", "origin": "PXU", "destination": "SGN", "carrier": "Vietnam Airlines", "price_oneway": 720000, "depart_time": "16:30", "rating": 4.7},

    # Tuyến từ Hà Nội (HAN)
    {"flight_no": "VN210", "origin": "HAN", "destination": "DAD", "carrier": "Vietnam Airlines", "price_oneway": 850000, "depart_time": "08:00", "rating": 4.8},
    {"flight_no": "VN211", "origin": "DAD", "destination": "HAN", "carrier": "Vietnam Airlines", "price_oneway": 890000, "depart_time": "17:00", "rating": 4.8},
    {"flight_no": "VN230", "origin": "HAN", "destination": "PQC", "carrier": "Vietnam Airlines", "price_oneway": 1150000, "depart_time": "07:45", "rating": 4.8},
    {"flight_no": "VN231", "origin": "PQC", "destination": "HAN", "carrier": "Vietnam Airlines", "price_oneway": 1200000, "depart_time": "18:15", "rating": 4.8},
    {"flight_no": "VN240", "origin": "HAN", "destination": "UIH", "carrier": "Vietnam Airlines", "price_oneway": 890000, "depart_time": "08:30", "rating": 4.7},
    {"flight_no": "VN241", "origin": "UIH", "destination": "HAN", "carrier": "Vietnam Airlines", "price_oneway": 920000, "depart_time": "16:45", "rating": 4.7},
    {"flight_no": "VN250", "origin": "HAN", "destination": "HUI", "carrier": "Vietnam Airlines", "price_oneway": 750000, "depart_time": "08:15", "rating": 4.8},
    {"flight_no": "VN251", "origin": "HUI", "destination": "HAN", "carrier": "Vietnam Airlines", "price_oneway": 780000, "depart_time": "17:15", "rating": 4.8},
]

# 1.2. CITY METADATA & FEATURE VECTORS (Đặc trưng các điểm đến)
# Vector chuẩn hóa [beach, food, nature, culture, healing, adventure]
MOCK_CITIES = {
    "DAD": {
        "city_name": "Đà Nẵng & Hội An",
        "region": "Miền Trung",
        "description": "Thành phố biển đáng sống, giao thoa giữa biển xanh Mỹ Khê và phố cổ Hội An",
        "vector": [0.95, 0.90, 0.70, 0.92, 0.85, 0.65],
        "travel_agency_partner": "WanderMatch Prime & Da Nang Tourism Alliance"
    },
    "DLI": {
        "city_name": "Đà Lạt (Lâm Đồng)",
        "region": "Tây Nguyên",
        "description": "Xứ sở ngàn hoa sương mù, khí hậu se lạnh 16°C và rừng thông trầm mặc",
        "vector": [0.10, 0.92, 0.96, 0.70, 0.98, 0.75],
        "travel_agency_partner": "Dalat Discovery Co., Ltd & WanderMatch Escrow"
    },
    "PQC": {
        "city_name": "Phú Quốc (Kiên Giang)",
        "region": "Miền Nam",
        "description": "Đảo ngọc nhiệt đới, hoàng hôn biển bãi Trường và nghỉ dưỡng 5 sao",
        "vector": [0.98, 0.88, 0.80, 0.55, 0.90, 0.70],
        "travel_agency_partner": "Phu Quoc Luxury Travel & Island Gate"
    },
    "UIH": {
        "city_name": "Quy Nhơn (Bình Định)",
        "region": "Miền Trung",
        "description": "Ghềnh ráng biển xanh, bãi Kỳ Co - Eo Gió hoang sơ và ẩm thực hải sản làng chài",
        "vector": [0.94, 0.86, 0.88, 0.72, 0.88, 0.72],
        "travel_agency_partner": "Binh Dinh Heritage Tour & WanderMatch Network"
    },
    "HUI": {
        "city_name": "Cố Đô Huế (Thừa Thiên Huế)",
        "region": "Miền Trung",
        "description": "Cố đô di sản ngàn năm, dòng sông Hương thơ mộng và suối khoáng nóng Alba",
        "vector": [0.40, 0.96, 0.75, 0.99, 0.92, 0.50],
        "travel_agency_partner": "Hue Heritage Discovery & Center of Culture"
    },
    "PXU": {
        "city_name": "Măng Đen & Pleiku (Kon Tum - Gia Lai)",
        "region": "Tây Nguyên",
        "description": "Thủ phủ chữa lành giữa đại ngàn nguyên sơ, rừng thông bạt ngàn và thác nước hùng vĩ",
        "vector": [0.05, 0.82, 0.99, 0.78, 0.99, 0.88],
        "travel_agency_partner": "Highland Green Escapes & Central Highlands Operator"
    }
}

# 1.3. HOTEL API MOCK (Dữ liệu khách sạn & resort tiêu chuẩn 4 - 5 sao)
MOCK_HOTELS = [
    # Đà Nẵng
    {
        "id": "HTL-DAD-01", "city_code": "DAD", "hotel_name": "Grand Tourane Ocean Resort",
        "stars": 5, "price_per_night": 1400000, "rating": 4.8,
        "tags": ["beach", "comfort", "healing", "food"],
        "amenities": ["Bãi biển riêng", "Bể bơi vô cực", "Buffet sáng quốc tế", "Xe đón sân bay"]
    },
    {
        "id": "HTL-DAD-02", "city_code": "DAD", "hotel_name": "Sala Danang Beach Hotel",
        "stars": 4, "price_per_night": 950000, "rating": 4.6,
        "tags": ["beach", "food", "comfort"],
        "amenities": ["Sky bar", "Bể bơi tầng thượng", "Buffet sáng", "Gần chợ đêm Sơn Trà"]
    },

    # Đà Lạt
    {
        "id": "HTL-DLI-01", "city_code": "DLI", "hotel_name": "Ana Mandara Villas Dalat Resort & Spa",
        "stars": 5, "price_per_night": 1800000, "rating": 4.9,
        "tags": ["nature", "healing", "comfort", "culture"],
        "amenities": ["Biệt thự Pháp cổ", "Rừng thông riêng", "Spa thảo mộc", "Trà chiều bên lò sưởi"]
    },
    {
        "id": "HTL-DLI-02", "city_code": "DLI", "hotel_name": "Colline Heritage Boutique Hotel",
        "stars": 4, "price_per_night": 1100000, "rating": 4.7,
        "tags": ["healing", "food", "comfort"],
        "amenities": ["Trung tâm chợ Đà Lạt", "Buffet rau hữu cơ", "Phòng view thung lũng"]
    },

    # Phú Quốc
    {
        "id": "HTL-PQC-01", "city_code": "PQC", "hotel_name": "Salinda Resort Phu Quoc Island",
        "stars": 5, "price_per_night": 2200000, "rating": 4.9,
        "tags": ["beach", "comfort", "healing"],
        "amenities": ["Bãi biển ngắm hoàng hôn", "Bể bơi lọc muối điện phân", "Buffet sâm-panh", "Đưa đón riêng"]
    },
    {
        "id": "HTL-PQC-02", "city_code": "PQC", "hotel_name": "Novotel Phu Quoc Resort",
        "stars": 4, "price_per_night": 1350000, "rating": 4.6,
        "tags": ["beach", "comfort", "adventure"],
        "amenities": ["Vườn nhiệt đới", "Bể bơi sát biển", "Sân tennis & chèo kayak", "Buffet sáng"]
    },

    # Quy Nhơn
    {
        "id": "HTL-UIH-01", "city_code": "UIH", "hotel_name": "Avani Quy Nhon Resort & Spa",
        "stars": 5, "price_per_night": 1600000, "rating": 4.8,
        "tags": ["beach", "nature", "healing"],
        "amenities": ["Bãi tắm Bãi Dài", "Spa trên vách đá", "Nhà hàng hải sản tươi", "Đưa đón sân bay Phù Cát"]
    },
    {
        "id": "HTL-UIH-02", "city_code": "UIH", "hotel_name": "Fleur De Lys Hotel Quy Nhon",
        "stars": 4, "price_per_night": 1050000, "rating": 4.6,
        "tags": ["beach", "food", "comfort"],
        "amenities": ["Mặt tiền biển An Dương Vương", "Hồ bơi tầng cao", "Buffet ẩm thực Bình Định"]
    },

    # Huế
    {
        "id": "HTL-HUI-01", "city_code": "HUI", "hotel_name": "Pilgrimage Village Boutique Resort & Spa",
        "stars": 5, "price_per_night": 1500000, "rating": 4.9,
        "tags": ["culture", "healing", "nature", "comfort"],
        "amenities": ["Không gian thiền định", "Nhà tranh gỗ truyền thống", "Tắm suối khoáng nóng", "Thưởng trà hoa sen"]
    },
    {
        "id": "HTL-HUI-02", "city_code": "HUI", "hotel_name": "Silk Path Grand Hue Hotel",
        "stars": 4, "price_per_night": 1000000, "rating": 4.7,
        "tags": ["culture", "food", "comfort"],
        "amenities": ["Kiến trúc cung đình tân cổ điển", "Bể bơi 4 mùa", "Vị trí sát bờ sông Hương"]
    },

    # Măng Đen / Pleiku
    {
        "id": "HTL-PXU-01", "city_code": "PXU", "hotel_name": "Golden Boutique Hotel Măng Đen",
        "stars": 4, "price_per_night": 950000, "rating": 4.7,
        "tags": ["nature", "healing", "adventure"],
        "amenities": ["View rừng thông ngút ngàn", "Lửa trại BBQ ban đêm", "Xe Limousine đưa đón sân bay Pleiku"]
    },
    {
        "id": "HTL-PXU-02", "city_code": "PXU", "hotel_name": "Đắk Ke Mang Den Eco Resort",
        "stars": 4, "price_per_night": 850000, "rating": 4.5,
        "tags": ["nature", "healing"],
        "amenities": ["Bên hồ Đăk Ke", "Vườn hoa sim & cà phê rang củi", "Không khí nguyên sơ 18°C"]
    }
]


# ======================================================================================
# THUẬT TOÁN 1: LỌC TUYẾN ĐƯỜNG & CHI PHÍ VÉ (BUDGET ROUTE FILTERING)
# ======================================================================================
def filter_budget_routes(
    origin: str,
    total_budget: float,
    pax: int = 2,
    max_flight_budget_ratio: float = 0.75
) -> Dict[str, Dict[str, Any]]:
    """
    Tư duy xử lý:
    - Trong mô hình Blind Booking, chi phí vé máy bay khứ hồi (Roundtrip Flights)
      thường chiếm không quá 50% - 65% tổng ngân sách gói. Nếu vé ngốn hết sạch tiền,
      khách hàng sẽ không còn đủ kinh phí để ở khách sạn 4-5 sao và ăn uống.
    - Hàm quét toàn bộ chuyến bay đi (Outbound) và về (Inbound) từ 'origin'.
    - Lọc ra các điểm đến (destination) có ít nhất 1 cặp vé khứ hồi hợp lệ với:
          Tổng giá vé khứ hồi cho toàn bộ số khách (Pax) <= (total_budget * max_flight_budget_ratio)
    """
    feasible_routes: Dict[str, Dict[str, Any]] = {}

    # Lấy các chuyến bay chiều đi từ origin
    outbound_flights = [f for f in MOCK_FLIGHTS if f["origin"] == origin]

    for out_fl in outbound_flights:
        dest = out_fl["destination"]
        # Tìm chuyến bay về tương ứng từ dest về origin
        return_flights = [f for f in MOCK_FLIGHTS if f["origin"] == dest and f["destination"] == origin]

        for ret_fl in return_flights:
            roundtrip_per_pax = out_fl["price_oneway"] + ret_fl["price_oneway"]
            total_flight_cost = roundtrip_per_pax * pax

            # Điều kiện: Tổng vé phải nhỏ hơn ngân sách tối đa dành cho vé
            if total_flight_cost <= total_budget * max_flight_budget_ratio:
                # Nếu thành phố chưa có trong feasible_routes hoặc cặp vé này rẻ/chất lượng hơn
                if dest not in feasible_routes:
                    feasible_routes[dest] = {
                        "city_code": dest,
                        "outbound": out_fl,
                        "return": ret_fl,
                        "roundtrip_cost_per_pax": roundtrip_per_pax,
                        "total_flight_cost": total_flight_cost,
                        "remaining_budget_for_stay": total_budget - total_flight_cost
                    }
                else:
                    # Giữ cặp vé có tổng giá tối ưu nhất
                    if total_flight_cost < feasible_routes[dest]["total_flight_cost"]:
                        feasible_routes[dest] = {
                            "city_code": dest,
                            "outbound": out_fl,
                            "return": ret_fl,
                            "roundtrip_cost_per_pax": roundtrip_per_pax,
                            "total_flight_cost": total_flight_cost,
                            "remaining_budget_for_stay": total_budget - total_flight_cost
                        }

    return feasible_routes


# ======================================================================================
# THUẬT TOÁN 2: KHỚP SỞ THÍCH BẰNG VECTOR SIMILARITY (RECOMMENDATION ENGINE)
# ======================================================================================
def cosine_similarity(vec_a: List[float], vec_b: List[float]) -> float:
    """
    Tính độ tương đồng Cosine (Cosine Similarity) giữa 2 vector n chiều:
        CosineSim(A, B) = (A . B) / (||A|| * ||B||)
    Trả về giá trị trong khoảng [0.0, 1.0].
    """
    dot_product = sum(a * b for a, b in zip(vec_a, vec_b))
    norm_a = math.sqrt(sum(a * a for a in vec_a))
    norm_b = math.sqrt(sum(b * b for b in vec_b))

    if norm_a == 0.0 or norm_b == 0.0:
        return 0.0
    return dot_product / (norm_a * norm_b)


def rank_destinations_by_preference(
    user_preference_vector: List[float],
    feasible_destinations: List[str]
) -> List[Tuple[str, float]]:
    """
    Tư duy xử lý:
    - Người dùng có 1 vector sở thích đa chiều (ví dụ thích chữa lành, thiên nhiên hơn là biển đông đúc).
    - So sánh vector của người dùng với Vector đặc trưng của từng thành phố trong tập khả thi (Bước 1).
    - Sắp xếp độ phù hợp từ cao xuống thấp để ưu tiên cho thuật toán tối ưu Knapsack ở Bước 3.
    """
    ranked_results: List[Tuple[str, float]] = []

    for city_code in feasible_destinations:
        if city_code in MOCK_CITIES:
            city_vector = MOCK_CITIES[city_code]["vector"]
            sim_score = cosine_similarity(user_preference_vector, city_vector)
            ranked_results.append((city_code, round(sim_score, 4)))

    # Sắp xếp giảm dần theo điểm tương đồng Cosine
    ranked_results.sort(key=lambda x: x[1], reverse=True)
    return ranked_results


# ======================================================================================
# THUẬT TOÁN 3: TỐI ƯU HÓA COMBO VÉ + PHÒNG (KNAPSACK PROBLEM / OPTIMIZATION)
# ======================================================================================
def optimize_blind_combo_knapsack(
    feasible_routes: Dict[str, Dict[str, Any]],
    ranked_cities: List[Tuple[str, float]],
    total_budget: float,
    nights: int = 2,
    rooms_needed: int = 1
) -> List[Dict[str, Any]]:
    """
    Tư duy xử lý (Bounded Knapsack / Multiple-Choice Knapsack Problem):
    - "Cái túi" có sức chứa = total_budget (VNĐ).
    - Với mỗi điểm đến khả thi:
        Chọn đúng 1 cặp vé máy bay khứ hồi (Đã xác định ở Bước 1).
        Chọn đúng 1 khách sạn đạt chuẩn từ danh sách khách sạn của thành phố đó.
    - Ràng buộc cứng (Constraints):
        Total Combo Cost = Flight Cost + (Hotel Price/đêm * nights * rooms_needed) <= total_budget.
    - Hàm mục tiêu tối ưu (Objective Function):
        1. Điểm chất lượng tổ hợp (Quality Score) = (Hotel Rating * 0.4) + (Flight Rating * 0.2) + (Similarity Score * 5 * 0.4)
        2. Tối ưu độ khít ngân sách (Budget Fit) = (Total Combo Cost / total_budget)
           Khách hàng bỏ ra ngân sách X, mong muốn nhận được combo giá trị cao nhất, sát với số tiền nhất.
        3. Điểm tối ưu Knapsack (Optimization Fitness) = (Quality Score * 0.7) + (Budget Fit * 0.3)
    """
    valid_combos: List[Dict[str, Any]] = []

    # Tạo từ điển tra cứu điểm tương đồng
    similarity_map = {city_code: score for city_code, score in ranked_cities}

    for city_code, route_info in feasible_routes.items():
        if city_code not in similarity_map:
            continue

        sim_score = similarity_map[city_code]
        city_meta = MOCK_CITIES[city_code]
        flight_cost = route_info["total_flight_cost"]
        flight_rating = (route_info["outbound"]["rating"] + route_info["return"]["rating"]) / 2.0

        # Lấy danh sách khách sạn tại thành phố này
        hotels_in_city = [h for h in MOCK_HOTELS if h["city_code"] == city_code]

        for hotel in hotels_in_city:
            hotel_total_cost = hotel["price_per_night"] * nights * rooms_needed
            total_combo_cost = flight_cost + hotel_total_cost

            # Kiểm tra ràng buộc Knapsack: Không được vượt ngân sách
            if total_combo_cost <= total_budget:
                remaining_pocket_money = total_budget - total_combo_cost
                budget_utilization = total_combo_cost / total_budget

                # Tính điểm chất lượng tổng hòa
                hotel_rating = hotel["rating"]
                composite_quality_score = (hotel_rating * 0.40) + (flight_rating * 0.20) + (sim_score * 5.0 * 0.40)

                # Fitness Knapsack: Cân bằng giữa chất lượng cao và tận dụng ngân sách sát nhất
                knapsack_fitness = (composite_quality_score * 0.70) + (budget_utilization * 1.5 * 0.30)

                # Giá trị bán lẻ thị trường ước tính (Retail Value >= 125% để khách thấy hời)
                market_retail_value = round(total_combo_cost * 1.25, -5)

                combo_item = {
                    "combo_id": f"COMBO-{city_code}-{hotel['id']}",
                    "city_code": city_code,
                    "city_name": city_meta["city_name"],
                    "region": city_meta["region"],
                    "travel_agency_partner": city_meta["travel_agency_partner"],
                    "flight_summary": {
                        "carrier": route_info["outbound"]["carrier"],
                        "outbound_flight": f"{route_info['outbound']['flight_no']} ({route_info['outbound']['depart_time']})",
                        "return_flight": f"{route_info['return']['flight_no']} ({route_info['return']['depart_time']})",
                        "flight_cost_total": flight_cost,
                        "rating": flight_rating
                    },
                    "hotel_summary": {
                        "hotel_id": hotel["id"],
                        "hotel_name": hotel["hotel_name"],
                        "stars": hotel["stars"],
                        "rating": hotel["rating"],
                        "amenities": hotel["amenities"],
                        "hotel_cost_total": hotel_total_cost,
                        "nights": nights
                    },
                    "dining_and_entertainment": [
                        "Voucher thưởng thức ẩm thực bản địa: 200.000 VNĐ / khách",
                        "Bữa sáng Buffet tiêu chuẩn quốc tế tại khách sạn",
                        "Cẩm nang hướng dẫn quán ăn địa phương độc quyền (chống bẫy chặt chém)"
                    ],
                    "included_services": [
                        "Vé máy bay khứ hồi (Đã bao gồm 20kg ký gửi + 7kg xách tay)",
                        f"Phòng nghỉ {hotel['stars']} sao ({hotel['hotel_name']}) {nights} đêm",
                        "Xe riêng / Limousine đón tiễn sân bay về khách sạn 2 chiều",
                        "Bảo hiểm du lịch toàn diện 24/7 (Bảo lãnh viện phí & tai nạn)",
                        "Quỹ bảo chứng nâng hạng phòng 5 sao SLA nếu có sự cố overbooking"
                    ],
                    "financial_breakdown": {
                        "user_target_budget": total_budget,
                        "total_combo_cost": total_combo_cost,
                        "flight_cost": flight_cost,
                        "hotel_cost": hotel_total_cost,
                        "service_and_insurance_cost": 250000,
                        "market_retail_value": market_retail_value,
                        "savings_amount": market_retail_value - total_combo_cost,
                        "unallocated_pocket_money": remaining_pocket_money
                    },
                    "similarity_score": sim_score,
                    "budget_utilization": round(budget_utilization * 100, 1),
                    "knapsack_fitness": round(knapsack_fitness, 3)
                }
                valid_combos.append(combo_item)

    # Sắp xếp các combo theo điểm Fitness tối ưu từ cao xuống thấp
    valid_combos.sort(key=lambda x: x["knapsack_fitness"], reverse=True)
    return valid_combos


# ======================================================================================
# THUẬT TOÁN 4: LỰA CHỌN BÍ MẬT CÓ TRỌNG SỐ (WEIGHTED RANDOM)
# ======================================================================================
def select_mystery_lucky_box(
    candidate_combos: List[Dict[str, Any]],
    top_k: int = 3
) -> Tuple[Dict[str, Any], List[Dict[str, Any]]]:
    """
    Tư duy xử lý:
    - Thuật toán Knapsack ở Bước 3 đã tìm ra danh sách các combo tối ưu nhất.
    - Ta chỉ lấy top_k (tối đa 3 lựa chọn xuất sắc nhất).
    - Để tạo yếu tố bất ngờ "Du Lịch Mù / Hộp Quà May Mắn", hệ thống áp dụng
      Weighted Random Sampling (Lấy mẫu ngẫu nhiên có trọng số) dựa trên Knapsack Fitness.
    - Điều này đảm bảo:
        + Combo có điểm chất lượng & độ sát ngân sách cao hơn sẽ có XÁC SUẤT ĐƯỢC CHỌN CAO HƠN.
        + Vẫn bảo tồn tính ngẫu nhiên bất ngờ thực sự của trải nghiệm Blind Booking.
        + Khách hàng vẫn có tối đa 3 lựa chọn để xem chi tiết.
    """
    if not candidate_combos:
        raise ValueError("Không tìm thấy combo nào vừa vặn với ngân sách đã nhập!")

    # Giới hạn tối đa top_k lựa chọn
    curated_options = candidate_combos[:top_k]

    # Tính trọng số xác suất (Weights) dựa trên knapsack_fitness mũ 2 để nhấn mạnh điểm cao
    weights = [combo["knapsack_fitness"] ** 2 for combo in curated_options]
    total_weight = sum(weights)
    probabilities = [w / total_weight for w in weights]

    # Gán tỷ lệ phần trăm may mắn vào từng combo để hiển thị minh bạch
    for combo, prob in zip(curated_options, probabilities):
        combo["lucky_probability_pct"] = round(prob * 100, 1)

    # Lựa chọn ngẫu nhiên có trọng số bằng random.choices
    chosen_mystery_box = random.choices(curated_options, weights=weights, k=1)[0]

    return chosen_mystery_box, curated_options


# ======================================================================================
# HÀM ĐIỀU PHỐI TỔNG THỂ (MAIN ORCHESTRATOR)
# ======================================================================================
def run_blind_booking_engine(
    origin: str,
    budget_vnd: float,
    pax: int = 2,
    nights: int = 2,
    user_style_tags: Optional[List[str]] = None,
    dining_preference: str = "Ẩm thực bản địa & hải sản",
    previous_trip_notes: str = ""
) -> Dict[str, Any]:
    """
    Bộ não điều phối toàn bộ quy trình:
      1. Kiểm tra tính hợp lệ của ngân sách (Phải là số chẵn, tròn trăm, >= 1.000.000 VNĐ).
      2. Chuyển đổi tags phong cách thành User Preference Vector.
      3. Lọc tuyến bay khứ hồi (Thuật toán 1).
      4. Khớp độ tương đồng sở thích Cosine Similarity (Thuật toán 2).
      5. Tối ưu Knapsack combo vé + phòng sát ngân sách (Thuật toán 3).
      6. Bốc thăm Hộp Quà May Mắn có trọng số (Thuật toán 4).
      7. Định dạng kết quả tổng quan hợp nhất kèm chi phí minh bạch.
    """
    # 1. VALIDATION: Kiểm tra ngân sách chẵn & tròn trăm
    if budget_vnd < 1000000:
        return {"success": False, "error": "Ngân sách tối thiểu phải từ 1.000.000 VNĐ trở lên."}

    # Kiểm tra số chẵn và tròn trăm
    if int(budget_vnd) % 2 != 0:
        return {"success": False, "error": "Ngân sách phải là số chẵn (Ví dụ: 3.000.000, 3.200.000, 4.000.000 VNĐ). Không chấp nhận số lẻ!"}

    if int(budget_vnd) % 100 != 0:
        return {"success": False, "error": "Ngân sách phải là số tròn trăm nghìn/đồng (Ví dụ: 2.500.000, 3.200.000 VNĐ)."}

    # 2. XÂY DỰNG USER PREFERENCE VECTOR từ tags phong cách
    # Tags: 'beach', 'food', 'nature', 'culture', 'healing', 'adventure'
    user_vec = [0.5, 0.5, 0.5, 0.5, 0.5, 0.5]  # Mặc định cân bằng
    if user_style_tags:
        for idx, key in enumerate(FEATURE_KEYS):
            if key in user_style_tags:
                user_vec[idx] = 0.95
            else:
                user_vec[idx] = 0.35

    # 3. THUẬT TOÁN 1: LỌC TUYẾN ĐƯỜNG & VÉ
    feasible_routes = filter_budget_routes(origin, budget_vnd, pax=pax)
    if not feasible_routes:
        return {
            "success": False,
            "error": f"Không có tuyến bay khứ hồi nào từ {origin} phù hợp với ngân sách {budget_vnd:,.0f} VNĐ cho {pax} người. Vui lòng tăng ngân sách!"
        }

    # 4. THUẬT TOÁN 2: KHỚP SỞ THÍCH COSINE SIMILARITY
    feasible_city_codes = list(feasible_routes.keys())
    ranked_cities = rank_destinations_by_preference(user_vec, feasible_city_codes)

    # 5. THUẬT TOÁN 3: TỐI ƯU HÓA KNAPSACK
    candidate_combos = optimize_blind_combo_knapsack(
        feasible_routes, ranked_cities, budget_vnd, nights=nights, rooms_needed=max(1, pax // 2)
    )
    if not candidate_combos:
        return {
            "success": False,
            "error": "Không thể kết hợp được combo Vé + Khách sạn 4-5 sao nào nằm trong ngân sách này. Hãy thử tăng số tiền!"
        }

    # 6. THUẬT TOÁN 4: RANDOM CÓ TRỌNG SỐ (CHỌN HỘP QUÀ DUY NHẤT & TOP 3 LỰA CHỌN)
    lucky_box, top_3_options = select_mystery_lucky_box(candidate_combos, top_k=3)

    return {
        "success": True,
        "input_criteria": {
            "origin": origin,
            "budget_vnd": budget_vnd,
            "pax": pax,
            "duration": f"{nights+1}N{nights}Đ",
            "nights": nights,
            "dining_preference": dining_preference,
            "previous_trip_notes": previous_trip_notes or "Chưa có ghi chú (để trống)"
        },
        "mystery_lucky_box": lucky_box,
        "top_3_curated_options": top_3_options,
        "total_feasible_combos_found": len(candidate_combos),
        "ai_engine_used": "WanderMatch Vector Knapsack Engine v3.2",
        "explanation": "Đã hoàn thành 4 giai đoạn: Lọc tuyến bay -> Cosine Similarity -> Knapsack Combo Optimization -> Weighted Random Lucky Box."
    }


# ======================================================================================
# CHẠY THỬ NGHIỆM TRÊN TERMINAL LOCAL
# ======================================================================================
if __name__ == "__main__":
    print("=" * 80)
    print("🚀 ĐANG KHỞI CHẠY THỬ NGHIỆM ĐỘNG CƠ DU LỊCH MÙ (BLIND BOOKING ENGINE)")
    print("=" * 80)

    # Giả lập khách hàng:
    # - Điểm đi: SGN (Sân bay Tân Sơn Nhất - TP.HCM)
    # - Ngân sách: 4.800.000 VNĐ (Số chẵn, tròn trăm)
    # - Số khách: 2 người (Cặp đôi/Bạn thân)
    # - Thời gian: 3 ngày 2 đêm (2 đêm khách sạn)
    # - Phong cách thích: 'healing' (chữa lành), 'nature' (thiên nhiên), 'food' (ẩm thực)
    TEST_ORIGIN = "SGN"
    TEST_BUDGET = 4800000.0
    TEST_PAX = 2
    TEST_NIGHTS = 2
    TEST_TAGS = ["healing", "nature", "food"]
    TEST_DINING = "Thưởng thức đặc sản vùng cao & lẩu nóng hổi bản địa"
    TEST_PREV_NOTES = ""  # Để trống theo yêu cầu

    result = run_blind_booking_engine(
        origin=TEST_ORIGIN,
        budget_vnd=TEST_BUDGET,
        pax=TEST_PAX,
        nights=TEST_NIGHTS,
        user_style_tags=TEST_TAGS,
        dining_preference=TEST_DINING,
        previous_trip_notes=TEST_PREV_NOTES
    )

    if result["success"]:
        print(f"\n✅ ĐÃ TỐI ƯU THÀNH CÔNG! Tìm thấy {result['total_feasible_combos_found']} phương án khả thi.")
        print(f"📌 Điểm đi: {TEST_ORIGIN} | Ngân sách: {TEST_BUDGET:,.0f} VNĐ | Khách: {TEST_PAX} người ({TEST_NIGHTS+1}N{TEST_NIGHTS}Đ)")
        
        box = result["mystery_lucky_box"]
        print("\n" + "="*80)
        print("🎁 [HỘP QUÀ MAY MẮN DUY NHẤT ĐƯỢC CHỌN (WEIGHTED RANDOM)]")
        print("="*80)
        print(f"✨ Điểm Đến Bí Mật: {box['city_name']} ({box['region']})")
        print(f"🏨 Lưu Trú: {box['hotel_summary']['hotel_name']} ({box['hotel_summary']['stars']} Sao) - Đánh giá: {box['hotel_summary']['rating']}/5.0")
        print(f"✈️ Chuyến Bay Khứ Hồi: {box['flight_summary']['carrier']} | Chiều đi: {box['flight_summary']['outbound_flight']} | Chiều về: {box['flight_summary']['return_flight']}")
        print(f"🏢 Công Ty Du Lịch Lữ Hành Đối Tác: {box['travel_agency_partner']}")
        print(f"🍜 Trải Nghiệm Ẩm Thực: {box['dining_and_entertainment'][0]}")
        
        print("\n📊 BẢNG TỔNG QUAN CHI PHÍ DỊCH VỤ:")
        fin = box["financial_breakdown"]
        print(f"   • Tiền vé máy bay khứ hồi (2 người): {fin['flight_cost']:,.0f} VNĐ")
        print(f"   • Tiền phòng khách sạn ({box['hotel_summary']['nights']} đêm): {fin['hotel_cost']:,.0f} VNĐ")
        print(f"   • TỔNG CHI PHÍ GÓI COMBO: {fin['total_combo_cost']:,.0f} VNĐ (Độ khít: {box['budget_utilization']}%)")
        print(f"   • Giá trị bán lẻ thực tế ngoài thị trường: {fin['market_retail_value']:,.0f} VNĐ")
        print(f"   • Khách hàng tiết kiệm được: {fin['savings_amount']:,.0f} VNĐ (~25% lợi ích)")
        print(f"   • Xác suất may mắn trúng hộp này: {box['lucky_probability_pct']}%")

        print("\n" + "-"*80)
        print(f"📋 DANH SÁCH TỐI ĐA 3 LỰA CHỌN TỐI ƯU NHẤT CHO KHÁCH:")
        for idx, opt in enumerate(result["top_3_curated_options"], start=1):
            print(f"  [{idx}] {opt['city_name']} | {opt['hotel_summary']['hotel_name']} ({opt['hotel_summary']['stars']}★) | Tổng: {opt['financial_breakdown']['total_combo_cost']:,.0f}đ (Độ tương đồng Cosine: {opt['similarity_score']})")
        print("="*80)
    else:
        print("❌ Lỗi:", result["error"])
