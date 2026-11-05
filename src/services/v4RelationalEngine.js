// ============================================================================
// WANDERMATCH V4.0 – 27-TABLE RELATIONAL TRANSACTIONAL ENGINE, RLS & RPC KERNEL
// Implements the full PostgreSQL 15+ 27-Table Schema, Composite FKs, State
// Transition Triggers, RLS Policies, SECURITY DEFINER RPCs, Durable Webhook
// Inbox, and Transactional Outbox with Exponential Backoff & Bank Reconciliation.
// ============================================================================

import {
  encryptPiiValue,
  decryptPiiValue,
  computeCccdBlindIndex,
  rotatePiiRecordKeyVersion,
  extractLast4Digits
} from "../security/piiCrypto.js";
import { runFiveStageRecommendationPipeline } from "../engines/recommendationEngine.js";

export const ALL_27_TABLES = [
  "profiles",                 // #1
  "user_sensitive_pii",       // #2
  "user_roles",               // #3
  "user_preferences",         // #4
  "destinations",             // #5
  "travel_providers",         // #6
  "hotels",                   // #7
  "flights",                  // #8
  "partner_inventories",      // #9
  "recommendation_sessions",  // #10
  "packages",                 // #11
  "package_items",            // #12
  "bookings",                 // #13
  "booking_items",            // #14
  "booking_travelers",        // #15
  "inventory_holds",          // #16
  "booking_status_history",   // #17
  "payments",                 // #18
  "payment_webhook_events",   // #19
  "payment_transactions",     // #20
  "refunds",                  // #21
  "reviews",                  // #22
  "saved_packages",           // #23
  "notifications",            // #24
  "audit_logs",               // #25
  "system_settings",          // #26
  "outbox_events"             // #27
];

const IMMUTABLE_APPEND_ONLY_TABLES = new Set([
  "booking_status_history",
  "payment_transactions",
  "audit_logs"
]);

const SERVICE_ROLE_ONLY_TABLES = new Set([
  "user_sensitive_pii",
  "outbox_events",
  "payment_webhook_events"
]);

const SERVICE_ROLE_ONLY_RPCS = new Set([
  "ingest_webhook_event_v4",
  "process_payment_webhook_v4",
  "replay_queued_webhook_events_v4",
  "expire_stale_holds_v4",
  "claim_refund_for_processing_v4",
  "finalize_refund_payout_v4",
  "claim_due_outbox_events_v4",
  "run_v4_reconciliation_checks",
  "reconcile_external_settlement_v4"
]);

const VALID_BOOKING_TRANSITIONS = {
  PENDING_PAYMENT: new Set(["UNDERPAID", "PAID", "OVERPAID", "EXPIRED", "CANCELLED"]),
  UNDERPAID: new Set(["PAID", "OVERPAID", "REFUND_REQUESTED", "PAID_HOLD_CONFLICT"]),
  EXPIRED: new Set(["PAID", "OVERPAID", "PAID_HOLD_CONFLICT"]),
  PAID: new Set(["OVERPAID", "REVEALED", "REFUND_REQUESTED"]),
  OVERPAID: new Set(["REVEALED", "REFUND_REQUESTED"]),
  PAID_HOLD_CONFLICT: new Set(["PAID", "OVERPAID", "REFUND_REQUESTED", "REFUND_APPROVED"]),
  REVEALED: new Set(["COMPLETED", "REFUND_REQUESTED"]),
  REFUND_REQUESTED: new Set(["REFUND_APPROVED", "PAID", "OVERPAID", "REVEALED", "PAID_HOLD_CONFLICT"]),
  REFUND_APPROVED: new Set(["REFUND_PROCESSING"]),
  REFUND_PROCESSING: new Set(["REFUNDED", "REFUND_RECONCILIATION_REQUIRED", "REFUND_APPROVED"]),
  REFUND_RECONCILIATION_REQUIRED: new Set(["REFUNDED", "REFUND_APPROVED"]),
  REFUNDED: new Set([]),
  COMPLETED: new Set([]),
  CANCELLED: new Set([])
};

function makeSqlError(message, code = "P0001", httpStatus = 400) {
  const err = new Error(message);
  err.code = code;
  err.sqlState = code;
  err.httpStatus = httpStatus;
  return err;
}

function createDefaultSeedCatalog() {
  const partnerUserId = "00000000-0000-4000-8000-000000000001";
  const adminUserId = "00000000-0000-4000-8000-000000000002";
  const providerId = "10000000-0000-4000-8000-000000000001";

  const profiles = [
    {
      id: partnerUserId,
      email: "partner.system@wandermatch.vn",
      full_name: "WanderMatch B2B Partner",
      phone: "0901000111",
      loyalty_tier: "GOLD",
      loyalty_points: 1000,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: adminUserId,
      email: "superadmin.system@wandermatch.vn",
      full_name: "WanderMatch Super Admin",
      phone: "0901000222",
      loyalty_tier: "GOLD",
      loyalty_points: 5000,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
  ];

  const user_roles = [
    {
      id: crypto.randomUUID(),
      user_id: partnerUserId,
      role: "b2b_partner",
      is_active: true,
      granted_by: adminUserId,
      granted_at: new Date().toISOString()
    },
    {
      id: crypto.randomUUID(),
      user_id: adminUserId,
      role: "super_admin",
      is_active: true,
      granted_by: adminUserId,
      granted_at: new Date().toISOString()
    },
    {
      id: crypto.randomUUID(),
      user_id: adminUserId,
      role: "admin",
      is_active: true,
      granted_by: adminUserId,
      granted_at: new Date().toISOString()
    }
  ];

  const travel_providers = [
    {
      id: providerId,
      owner_user_id: partnerUserId,
      provider_name: "WanderMatch Prime Hospitality & Aviation",
      provider_type: "COMBO_OPERATOR",
      business_license_no: "0318889991",
      kyb_status: "VERIFIED",
      settlement_bank_code: "MB",
      settlement_bank_account: "0988888888",
      settlement_bank_holder: "CONG TY TNHH WANDERMATCH VN",
      sla_deposit_vnd: 50000000,
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
  ];

  const destConfigs = [
    // BUCKET 1: COOL_MIST_HIGHLAND (3 cities)
    {
      id: "20000000-0000-4000-8000-000000000001",
      code_slug: "da-lat",
      city_name: "Đà Lạt",
      province_name: "Lâm Đồng",
      region: "HIGHLANDS",
      climate_bucket_id: "COOL_MIST_HIGHLAND",
      climate_zone_label: "Cao Nguyên Sương Mù & Rừng Thông",
      temp_range_label: "15°C – 22°C",
      healing_score: 95,
      nature_score: 92,
      solitude_score: 85,
      comfort_score: 90,
      culture_score: 80,
      hotel_name: "Ana Mandara Villas Dalat Resort & Spa",
      sla_code: "SLA-DLI-501",
      flight_code: "VN1380",
      dest_airport: "DLI",
      dining: [{ name: "Bánh căn Lệ", specialty: "Bánh căn trứng cút nóng hổi" }]
    },
    {
      id: "20000000-0000-4000-8000-000000000002",
      code_slug: "mang-den",
      city_name: "Măng Đen",
      province_name: "Kon Tum",
      region: "HIGHLANDS",
      climate_bucket_id: "COOL_MIST_HIGHLAND",
      climate_zone_label: "Cao Nguyên Sương Mù & Rừng Thông",
      temp_range_label: "15°C – 22°C",
      healing_score: 98,
      nature_score: 98,
      solitude_score: 96,
      comfort_score: 86,
      culture_score: 78,
      hotel_name: "Golden Boutique Sanctuary Măng Đen",
      sla_code: "SLA-PXU-502",
      flight_code: "VN1860",
      dest_airport: "PXU",
      dining: [{ name: "Gà nướng Cô Sinh", specialty: "Gà nướng cơm lam ống tre" }]
    },
    {
      id: "20000000-0000-4000-8000-000000000003",
      code_slug: "sa-pa",
      city_name: "Sa Pa",
      province_name: "Lào Cai",
      region: "NORTH",
      climate_bucket_id: "COOL_MIST_HIGHLAND",
      climate_zone_label: "Cao Nguyên Sương Mù & Rừng Thông",
      temp_range_label: "15°C – 22°C",
      healing_score: 94,
      nature_score: 97,
      solitude_score: 88,
      comfort_score: 88,
      culture_score: 92,
      hotel_name: "Hotel de la Coupole MGallery",
      sla_code: "SLA-SPA-503",
      flight_code: "VN2100",
      dest_airport: "HAN",
      dining: [{ name: "Lẩu cá tầm Bản Mây", specialty: "Cá tầm suối tươi" }]
    },
    // BUCKET 2: TROPICAL_COAST_SUN (3 cities)
    {
      id: "20000000-0000-4000-8000-000000000004",
      code_slug: "phu-quoc",
      city_name: "Phú Quốc",
      province_name: "Kiên Giang",
      region: "ISLAND",
      climate_bucket_id: "TROPICAL_COAST_SUN",
      climate_zone_label: "Vịnh Biển Nắng Ấm & Gió Nhiệt Đới",
      temp_range_label: "25°C – 31°C",
      healing_score: 92,
      nature_score: 90,
      solitude_score: 82,
      comfort_score: 95,
      culture_score: 70,
      hotel_name: "Salinda Resort Phu Quoc Island",
      sla_code: "SLA-PQC-504",
      flight_code: "VN1820",
      dest_airport: "PQC",
      dining: [{ name: "Bún quậy Kiến Xây", specialty: "Bún quậy hải sản tươi" }]
    },
    {
      id: "20000000-0000-4000-8000-000000000005",
      code_slug: "quy-nhon",
      city_name: "Quy Nhơn",
      province_name: "Bình Định",
      region: "CENTRAL",
      climate_bucket_id: "TROPICAL_COAST_SUN",
      climate_zone_label: "Vịnh Biển Nắng Ấm & Gió Nhiệt Đới",
      temp_range_label: "25°C – 31°C",
      healing_score: 90,
      nature_score: 91,
      solitude_score: 88,
      comfort_score: 89,
      culture_score: 84,
      hotel_name: "Avani Quy Nhon Resort & Cliff Spa",
      sla_code: "SLA-UIH-505",
      flight_code: "VN1620",
      dest_airport: "UIH",
      dining: [{ name: "Hải sản Eo Gió", specialty: "Nhum biển nướng mỡ hành" }]
    },
    {
      id: "20000000-0000-4000-8000-000000000006",
      code_slug: "nha-trang",
      city_name: "Nha Trang",
      province_name: "Khánh Hòa",
      region: "CENTRAL",
      climate_bucket_id: "TROPICAL_COAST_SUN",
      climate_zone_label: "Vịnh Biển Nắng Ấm & Gió Nhiệt Đới",
      temp_range_label: "25°C – 31°C",
      healing_score: 89,
      nature_score: 88,
      solitude_score: 80,
      comfort_score: 94,
      culture_score: 78,
      hotel_name: "Amiana Resort Nha Trang Bay",
      sla_code: "SLA-CXR-506",
      flight_code: "VN1340",
      dest_airport: "CXR",
      dining: [{ name: "Bún cá Năm Beo", specialty: "Bún chả cá sứa tươi" }]
    },
    // BUCKET 3: HERITAGE_CULTURAL_WARM (3 cities)
    {
      id: "20000000-0000-4000-8000-000000000007",
      code_slug: "hue",
      city_name: "Cố Đô Huế",
      province_name: "Thừa Thiên Huế",
      region: "CENTRAL",
      climate_bucket_id: "HERITAGE_CULTURAL_WARM",
      climate_zone_label: "Miền Di Sản Trầm Mặc & Khoáng Nóng",
      temp_range_label: "22°C – 28°C",
      healing_score: 94,
      nature_score: 84,
      solitude_score: 88,
      comfort_score: 90,
      culture_score: 99,
      hotel_name: "Pilgrimage Village Boutique Resort & Spa",
      sla_code: "SLA-HUI-507",
      flight_code: "VN1540",
      dest_airport: "HUI",
      dining: [{ name: "Cơm hến Hoa Đông", specialty: "Cơm hến & bánh bèo" }]
    },
    {
      id: "20000000-0000-4000-8000-000000000008",
      code_slug: "hoi-an",
      city_name: "Đà Nẵng & Hội An",
      province_name: "Quảng Nam - Đà Nẵng",
      region: "CENTRAL",
      climate_bucket_id: "HERITAGE_CULTURAL_WARM",
      climate_zone_label: "Miền Di Sản Trầm Mặc & Khoáng Nóng",
      temp_range_label: "22°C – 28°C",
      healing_score: 91,
      nature_score: 86,
      solitude_score: 82,
      comfort_score: 94,
      culture_score: 96,
      hotel_name: "Anantara Hoi An Heritage Resort",
      sla_code: "SLA-DAD-508",
      flight_code: "VN1120",
      dest_airport: "DAD",
      dining: [{ name: "Cao lầu Thanh", specialty: "Cao lầu phố cổ" }]
    },
    {
      id: "20000000-0000-4000-8000-000000000009",
      code_slug: "ninh-binh",
      city_name: "Tràng An - Ninh Bình",
      province_name: "Ninh Bình",
      region: "NORTH",
      climate_bucket_id: "HERITAGE_CULTURAL_WARM",
      climate_zone_label: "Miền Di Sản Trầm Mặc & Khoáng Nóng",
      temp_range_label: "22°C – 28°C",
      healing_score: 93,
      nature_score: 95,
      solitude_score: 89,
      comfort_score: 88,
      culture_score: 95,
      hotel_name: "Emeralda Resort Ninh Binh Sanctuary",
      sla_code: "SLA-NBH-509",
      flight_code: "VN2200",
      dest_airport: "HAN",
      dining: [{ name: "Cơm cháy Tràng An", specialty: "Cơm cháy sốt dê núi" }]
    }
  ];

  const destinations = [];
  const hotels = [];
  const flights = [];
  const partner_inventories = [];

  destConfigs.forEach((cfg, idx) => {
    destinations.push({
      id: cfg.id,
      code_slug: cfg.code_slug,
      city_name: cfg.city_name,
      province_name: cfg.province_name,
      region: cfg.region,
      climate_bucket_id: cfg.climate_bucket_id,
      climate_zone_label: cfg.climate_zone_label,
      temp_range_label: cfg.temp_range_label,
      healing_score: cfg.healing_score,
      nature_score: cfg.nature_score,
      solitude_score: cfg.solitude_score,
      comfort_score: cfg.comfort_score,
      culture_score: cfg.culture_score,
      climate_profile_jsonb: { default: 90, "11": 91 },
      approved_mystery_hints_jsonb: [
        "Không gian nghỉ dưỡng tuyển chọn giữa thiên nhiên thanh bình, khí hậu dễ chịu và ẩm thực bản địa đặc sắc.",
        "Hành trình tái tạo năng lượng tại resort 5 sao chuẩn quốc tế với dịch vụ đưa đón sân bay riêng biệt."
      ],
      generic_packing_jsonb: ["Trang phục nghỉ dưỡng thoải mái", "Giày đi bộ êm chân", "Kính mát & kem chống nắng"],
      local_dining_guide_jsonb: cfg.dining,
      is_active: true,
      created_at: new Date().toISOString()
    });

    const hotelId = `30000000-0000-4000-8000-00000000000${idx + 1}`;
    hotels.push({
      id: hotelId,
      destination_id: cfg.id,
      provider_id: providerId,
      hotel_name: cfg.hotel_name,
      address: `Khu nghỉ dưỡng trung tâm ${cfg.city_name}, ${cfg.province_name}`,
      sla_code: cfg.sla_code,
      star_rating: 5,
      review_score: 9.2,
      vibe_tier_alias: "Boutique Sanctuary & Spa",
      secret_hero_image_url: `https://cdn.wandermatch.vn/hotels/${cfg.code_slug}.jpg`,
      is_active: true,
      created_at: new Date().toISOString()
    });

    for (const origin of ["SGN", "HAN", "DAD"]) {
      const flightId = `40000000-${origin === "SGN" ? "0001" : origin === "HAN" ? "0002" : "0003"}-4000-8000-00000000000${idx + 1}`;
      flights.push({
        id: flightId,
        destination_id: cfg.id,
        provider_id: providerId,
        origin_airport: origin,
        destination_airport: cfg.dest_airport,
        airline_name: "Vietnam Airlines",
        flight_code: `${cfg.flight_code}-${origin}`,
        exact_departure_time: "08:30 - 10:00",
        time_band: "MORNING",
        baggage_kg: 20,
        is_red_eye: false,
        is_active: true,
        created_at: new Date().toISOString()
      });

      partner_inventories.push({
        id: `51000000-${origin === "SGN" ? "0001" : origin === "HAN" ? "0002" : "0003"}-4000-8000-00000000000${idx + 1}`,
        provider_id: providerId,
        hotel_id: null,
        flight_id: flightId,
        item_type: "FLIGHT_SEAT",
        inventory_date: "2026-11-15",
        total_slots: 100,
        available_slots: 100,
        reserved_slots: 0,
        retail_price_vnd: 1200000,
        net_price_vnd: 850000,
        is_active: true,
        updated_at: new Date().toISOString()
      });
    }

    partner_inventories.push({
      id: `50000000-0000-4000-8000-00000000000${idx + 1}`,
      provider_id: providerId,
      hotel_id: hotelId,
      flight_id: null,
      item_type: "HOTEL_ROOM",
      inventory_date: "2026-11-15",
      total_slots: 50,
      available_slots: 50,
      reserved_slots: 0,
      retail_price_vnd: 1800000,
      net_price_vnd: 1100000,
      is_active: true,
      updated_at: new Date().toISOString()
    });
  });

  return {
    profiles,
    user_sensitive_pii: [],
    user_roles,
    user_preferences: [],
    destinations,
    travel_providers,
    hotels,
    flights,
    partner_inventories,
    recommendation_sessions: [],
    packages: [],
    package_items: [],
    bookings: [],
    booking_items: [],
    booking_travelers: [],
    inventory_holds: [],
    booking_status_history: [],
    payments: [],
    payment_webhook_events: [],
    payment_transactions: [],
    refunds: [],
    reviews: [],
    saved_packages: [],
    notifications: [],
    audit_logs: [],
    system_settings: [
      {
        key: "cutover_mode",
        value_jsonb: { write_freeze: false, maintenance_readonly: false, v4_active: true },
        description: "Cutover control flags",
        is_public: true,
        updated_by: adminUserId,
        updated_at: new Date().toISOString()
      }
    ],
    outbox_events: [],
    pg_temp_tables: {}
  };
}

if (!globalThis.__WANDERMATCH_V4_PG_CLUSTERS__) {
  globalThis.__WANDERMATCH_V4_PG_CLUSTERS__ = new Map();
}

export class V4RelationalDatabase {
  constructor(clusterNameOrEnv = "default") {
    if (typeof clusterNameOrEnv === "object" && clusterNameOrEnv !== null) {
      this.env = clusterNameOrEnv;
      this.clusterName = String(clusterNameOrEnv.V4_CLUSTER_NAME || "default");
    } else {
      this.env = {};
      this.clusterName = String(clusterNameOrEnv || "default");
    }
    if (!globalThis.__WANDERMATCH_V4_PG_CLUSTERS__.has(this.clusterName)) {
      globalThis.__WANDERMATCH_V4_PG_CLUSTERS__.set(this.clusterName, {
        tables: createDefaultSeedCatalog(),
        txMutex: Promise.resolve(),
        bookingSeq: 20260001
      });
    }
  }

  get cluster() {
    return globalThis.__WANDERMATCH_V4_PG_CLUSTERS__.get(this.clusterName);
  }

  get tables() {
    return this.cluster.tables;
  }

  resetCluster() {
    globalThis.__WANDERMATCH_V4_PG_CLUSTERS__.set(this.clusterName, {
      tables: createDefaultSeedCatalog(),
      txMutex: Promise.resolve(),
      bookingSeq: 20260001
    });
  }

  nextBookingCodeV4() {
    const seq = this.cluster.bookingSeq++;
    return `WM${String(seq).padStart(8, "0")}`;
  }

  /**
   * Executes a callback inside an atomic ACID transaction with automatic rollback on throw
   */
  async withTransaction(fn) {
    const cluster = this.cluster;
    const runTx = async () => {
      const snapshot = structuredClone(cluster.tables);
      try {
        const res = await fn(cluster.tables);
        return res;
      } catch (err) {
        cluster.tables = snapshot;
        throw err;
      }
    };
    const next = cluster.txMutex.then(runTx, runTx);
    cluster.txMutex = next.catch(() => {});
    return next;
  }

  /**
   * SECURITY DEFINER helper: public.is_admin(p_uid)
   * Explicitly uses public.user_roles (search_path = pg_catalog, public), ignoring pg_temp!
   */
  isAdmin(uid) {
    if (!uid) return false;
    return this.tables.user_roles.some(
      r => r.user_id === uid && (r.role === "admin" || r.role === "super_admin") && r.is_active === true
    );
  }

  isSuperAdmin(uid) {
    if (!uid) return false;
    return this.tables.user_roles.some(
      r => r.user_id === uid && r.role === "super_admin" && r.is_active === true
    );
  }

  /**
   * Enforces REVOKE CREATE ON SCHEMA public FROM PUBLIC, anon, authenticated (T-03)
   */
  async executeDdlAsRole({ role = "authenticated", uid = null, sql = "" }) {
    const normSql = String(sql).trim();
    if (/CREATE\s+TABLE\s+(?:IF\s+NOT\s+EXISTS\s+)?public\./i.test(normSql)) {
      if (role !== "service_role" && !this.isSuperAdmin(uid)) {
        throw makeSqlError("permission denied for schema public", "42501", 403);
      }
    }
    if (/CREATE\s+TABLE\s+(?:IF\s+NOT\s+EXISTS\s+)?pg_temp\.user_roles/i.test(normSql)) {
      // Attackers can create temp tables in pg_temp, but SECURITY DEFINER functions
      // have SET search_path = pg_catalog, public so pg_temp is searched LAST / ignored!
      this.tables.pg_temp_tables.user_roles = [{ user_id: uid, role: "super_admin", is_active: true }];
      return { command: "CREATE TABLE pg_temp.user_roles" };
    }
    throw makeSqlError("DDL statement not permitted", "42501", 403);
  }

  /**
   * Enforces Table-Level Privileges (REVOKE ALL) + Row-Level Security (RLS) across all 27 tables (T-01, T-15, T-16)
   */
  async queryTableAsRole({
    role = "authenticated",
    uid = null,
    table,
    action = "SELECT",
    filterFn = () => true,
    payload = null
  }) {
    if (!ALL_27_TABLES.includes(table)) {
      throw makeSqlError(`relation "public.${table}" does not exist`, "42P01", 404);
    }

    // 1. Table-level privilege check (REVOKE ALL FROM PUBLIC, anon, authenticated)
    if (role === "anon") {
      throw makeSqlError(`permission denied for table ${table}`, "42501", 403);
    }
    if (SERVICE_ROLE_ONLY_TABLES.has(table) && role !== "service_role") {
      if (table === "user_sensitive_pii") {
        throw makeSqlError("permission denied for table user_sensitive_pii", "42501", 403);
      }
      if (table === "outbox_events" && !(action === "SELECT" && this.isAdmin(uid))) {
        throw makeSqlError("permission denied for table outbox_events", "42501", 403);
      }
      if (table === "payment_webhook_events" && !(action === "SELECT" && this.isAdmin(uid))) {
        throw makeSqlError("permission denied for table payment_webhook_events", "42501", 403);
      }
    }

    // 2. Append-only immutable trigger check
    if ((action === "UPDATE" || action === "DELETE") && IMMUTABLE_APPEND_ONLY_TABLES.has(table)) {
      throw makeSqlError(`Table ${table} is append-only immutable; UPDATE and DELETE are prohibited.`, "42501", 403);
    }

    const isAdmin = role === "service_role" || this.isAdmin(uid);
    const isSuper = role === "service_role" || this.isSuperAdmin(uid);

    // 3. Row-Level Security (RLS) row visibility predicate for SELECT
    const rlsVisible = (row) => {
      if (role === "service_role") return true;
      switch (table) {
        case "profiles":
          return row.id === uid || isAdmin;
        case "user_sensitive_pii":
          return false; // Blocked at table privilege level for non-service_role
        case "user_roles":
          return row.user_id === uid || isAdmin;
        case "user_preferences":
          return row.user_id === uid || isAdmin;
        case "destinations":
        case "packages":
        case "package_items":
        case "payment_webhook_events":
        case "audit_logs":
        case "outbox_events":
          return isAdmin;
        case "travel_providers":
          return row.owner_user_id === uid || isAdmin;
        case "hotels":
        case "flights":
        case "partner_inventories":
          return (
            isAdmin ||
            this.tables.travel_providers.some(tp => tp.id === row.provider_id && tp.owner_user_id === uid)
          );
        case "recommendation_sessions":
        case "bookings":
          return row.user_id === uid || isAdmin;
        case "booking_items": {
          if (isAdmin) return true;
          const bk = this.tables.bookings.find(b => b.id === row.booking_id);
          return Boolean(
            bk &&
            bk.user_id === uid &&
            bk.is_revealed === true &&
            (bk.status === "REVEALED" || bk.status === "COMPLETED")
          );
        }
        case "booking_travelers":
        case "inventory_holds":
        case "booking_status_history":
        case "payments":
        case "payment_transactions": {
          if (isAdmin) return true;
          const bk = this.tables.bookings.find(b => b.id === row.booking_id);
          return Boolean(bk && bk.user_id === uid);
        }
        case "refunds":
          return row.requested_by === uid || isAdmin;
        case "reviews":
          return row.moderation_status === "APPROVED" || row.user_id === uid || isAdmin;
        case "saved_packages":
        case "notifications":
          return row.user_id === uid;
        case "system_settings":
          return row.is_public === true || isAdmin;
        default:
          return false;
      }
    };

    if (action === "SELECT") {
      return this.tables[table].filter(r => rlsVisible(r) && filterFn(r)).map(r => structuredClone(r));
    }

    if (action === "UPDATE") {
      return this.withTransaction(async (t) => {
        if (table === "profiles" && role !== "service_role" && !isAdmin && payload) {
          const forbiddenCols = ["loyalty_tier", "loyalty_points", "email", "id"];
          for (const col of forbiddenCols) {
            if (Object.prototype.hasOwnProperty.call(payload, col)) {
              throw makeSqlError("permission denied for table profiles", "42501", 403);
            }
          }
        }
        const updated = [];
        for (let i = 0; i < t[table].length; i++) {
          const row = t[table][i];
          if (!filterFn(row)) continue;
          if (role !== "service_role" && !rlsVisible(row)) continue;

          const nextRow = { ...row, ...payload };
          if (table === "bookings") {
            this._enforceBookingTriggers(row, nextRow);
          }
          t[table][i] = nextRow;
          updated.push(structuredClone(nextRow));
        }
        return updated;
      });
    }

    if (action === "INSERT") {
      return this.withTransaction(async (t) => {
        if (role !== "service_role") {
          if (table === "user_roles" && !isSuper) {
            throw makeSqlError("new row violates row-level security policy for table user_roles", "42501", 403);
          }
        }
        const newRow = { id: payload.id || crypto.randomUUID(), ...payload };
        if (table === "bookings") {
          this._enforceBookingTriggers(null, newRow);
        }
        if (table === "packages") {
          this._enforcePackageConstraints(newRow, t);
        }
        t[table].push(newRow);
        return structuredClone(newRow);
      });
    }

    throw makeSqlError(`Unsupported action ${action}`, "42501", 403);
  }

  _enforcePackageConstraints(pkgRow, t = this.tables) {
    // Composite FK (session_id, user_id) -> recommendation_sessions(id, user_id)
    const sess = t.recommendation_sessions.find(
      s => s.id === pkgRow.session_id && s.user_id === pkgRow.user_id
    );
    if (!sess) {
      throw makeSqlError(
        "insert or update on table \"packages\" violates foreign key constraint \"fk_packages_session_user\"",
        "23503",
        409
      );
    }
    if ((pkgRow.k_anonymity_count ?? 3) < 3) {
      throw makeSqlError(
        "new row for relation \"packages\" violates check constraint \"packages_k_anonymity_count_check\"",
        "23514",
        422
      );
    }
  }

  _enforceBookingTriggers(oldRow, newRow, t = this.tables) {
    // 1. Booking code format check + trigger trg_enforce_booking_code_format
    const code = String(newRow.booking_code || "");
    if (!/^WM(-?[A-Z0-9]{4,16})+$/i.test(code)) {
      throw makeSqlError(
        `INVALID_BOOKING_CODE: Booking code ${code} violates base format constraint.`,
        "23514",
        400
      );
    }
    const isLegacy = Boolean(newRow.is_legacy_migrated);
    if (!isLegacy && !/^WM[0-9]{8}$/.test(code)) {
      throw makeSqlError(
        `INVALID_BOOKING_CODE: New V4 bookings must match ^WM[0-9]{8}$ (got ${code}).`,
        "23514",
        400
      );
    }

    // 2. Composite FK (package_id, user_id) -> packages(id, user_id)
    const pkg = t.packages.find(p => p.id === newRow.package_id && p.user_id === newRow.user_id);
    if (!pkg) {
      throw makeSqlError(
        "insert or update on table \"bookings\" violates foreign key constraint \"fk_bookings_package_user\"",
        "23503",
        409
      );
    }

    // 3. State transition matrix trigger trg_enforce_booking_state_transition
    if (oldRow && oldRow.status !== newRow.status) {
      const allowed = VALID_BOOKING_TRANSITIONS[oldRow.status];
      if (!allowed || !allowed.has(newRow.status)) {
        throw makeSqlError(
          `ILLEGAL_BOOKING_STATE_TRANSITION: Cannot transition booking ${oldRow.booking_code} from ${oldRow.status} to ${newRow.status}.`,
          "23514",
          409
        );
      }
    }

    // Recompute generated columns
    newRow.amount_due_vnd = Math.max(0, Number(newRow.expected_amount_vnd) - Number(newRow.paid_amount_vnd || 0));
    newRow.overpaid_amount_vnd = Math.max(0, Number(newRow.paid_amount_vnd || 0) - Number(newRow.expected_amount_vnd));
  }

  /**
   * RPC Dispatcher with Strict Function Privilege Verification (T-02)
   */
  async callRpcAsRole({ role = "authenticated", uid = null, rpcName, args = {}, env = {} }) {
    if (SERVICE_ROLE_ONLY_RPCS.has(rpcName) && role !== "service_role") {
      throw makeSqlError(`permission denied for function ${rpcName}`, "42501", 403);
    }
    if (role === "anon") {
      throw makeSqlError(`permission denied for function ${rpcName}`, "42501", 401);
    }

    switch (rpcName) {
      case "get_my_masked_pii_v4":
        return this.rpcGetMyMaskedPii(uid);
      case "get_my_sealed_packages_v4":
        return this.rpcGetMySealedPackages(uid, args.p_session_id);
      case "create_booking_with_hold_v4":
        return this.rpcCreateBookingWithHold(uid, args);
      case "ingest_webhook_event_v4":
        return this.rpcIngestWebhookEvent(args);
      case "process_payment_webhook_v4":
        return this.rpcProcessPaymentWebhook(args);
      case "replay_queued_webhook_events_v4":
        return this.rpcReplayQueuedWebhookEvents(args);
      case "expire_stale_holds_v4":
        return this.rpcExpireStaleHolds(args);
      case "reveal_blind_booking_v4":
        return this.rpcRevealBlindBooking(uid, args.p_booking_code);
      case "request_refund_v4":
        return this.rpcRequestRefund(uid, args);
      case "approve_refund_v4":
        return this.rpcApproveRefund(uid, args);
      case "claim_refund_for_processing_v4":
        return this.rpcClaimRefundForProcessing(args.p_refund_id);
      case "finalize_refund_payout_v4":
        return this.rpcFinalizeRefundPayout(args);
      case "claim_due_outbox_events_v4":
        return this.rpcClaimDueOutboxEvents(args);
      case "run_v4_reconciliation_checks":
        return this.rpcRunReconciliationChecks(args.p_v3_snapshot || null);
      case "reconcile_external_settlement_v4":
        return this.rpcReconcileExternalSettlement(args.p_settlement_records || []);
      default:
        throw makeSqlError(`function public.${rpcName} does not exist`, "42883", 404);
    }
  }

  /**
   * Service-Role Helper: Upsert encrypted PII into Table #2 user_sensitive_pii
   */
  async upsertUserSensitivePii({
    userId,
    cccdPlaintext,
    refundBankCode,
    refundBankAccount,
    refundBankHolder,
    env = {}
  }) {
    const encCccd = await encryptPiiValue(cccdPlaintext, env);
    const encBank = await encryptPiiValue(refundBankAccount, env);
    const blindIdx = await computeCccdBlindIndex(cccdPlaintext, env);
    const cccdLast4 = extractLast4Digits(cccdPlaintext);
    const bankLast4 = extractLast4Digits(refundBankAccount);

    return this.withTransaction(async (t) => {
      const conflict = t.user_sensitive_pii.find(
        p => p.cccd_blind_index === blindIdx && p.user_id !== userId
      );
      if (conflict) {
        throw makeSqlError("duplicate key value violates unique constraint \"user_sensitive_pii_cccd_blind_index_key\"", "23505", 409);
      }

      const row = {
        user_id: userId,
        cccd_ciphertext: encCccd.ciphertext,
        cccd_key_version: encCccd.keyVersion,
        cccd_blind_index: blindIdx,
        cccd_last4: cccdLast4,
        refund_bank_code: String(refundBankCode || "MB").toUpperCase(),
        refund_bank_account_ciphertext: encBank.ciphertext,
        refund_bank_account_last4: bankLast4,
        refund_bank_holder_normalized: String(refundBankHolder || "").trim().toUpperCase(),
        bank_key_version: encBank.keyVersion,
        verified_at: new Date().toISOString(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      const existingIdx = t.user_sensitive_pii.findIndex(p => p.user_id === userId);
      if (existingIdx >= 0) {
        t.user_sensitive_pii[existingIdx] = row;
      } else {
        t.user_sensitive_pii.push(row);
      }
      return structuredClone(row);
    });
  }

  /**
   * Service-Role Helper: Key Rotation Batch Job (v1 -> v2)
   */
  async rotatePiiKeyVersionBatch(env = {}, targetVersion = 2) {
    return this.withTransaction(async (t) => {
      let rotatedCount = 0;
      for (let i = 0; i < t.user_sensitive_pii.length; i++) {
        const row = t.user_sensitive_pii[i];
        if (row.cccd_key_version < targetVersion || row.bank_key_version < targetVersion) {
          t.user_sensitive_pii[i] = await rotatePiiRecordKeyVersion(row, env, targetVersion);
          rotatedCount++;
        }
      }
      return { rotated_count: rotatedCount, target_key_version: targetVersion };
    });
  }

  async rpcGetMyMaskedPii(uid) {
    if (!uid) throw makeSqlError("UNAUTHORIZED: Authentication required.", "28000", 401);
    const pii = this.tables.user_sensitive_pii.find(p => p.user_id === uid);
    if (!pii) return { has_pii: false };
    return {
      has_pii: true,
      cccd_masked: `********${pii.cccd_last4}`,
      refund_bank_code: pii.refund_bank_code,
      refund_bank_account_masked: `******${pii.refund_bank_account_last4}`,
      refund_bank_holder_normalized: pii.refund_bank_holder_normalized,
      verified_at: pii.verified_at
    };
  }

  async rpcGetMySealedPackages(uid, sessionId) {
    if (!uid) throw makeSqlError("UNAUTHORIZED: Authentication required.", "28000", 401);
    const isAdmin = this.isAdmin(uid);
    return this.tables.packages
      .filter(p => p.session_id === sessionId && (p.user_id === uid || isAdmin))
      .sort((a, b) => a.rank_order - b.rank_order)
      .map(p => ({
        package_id: p.id,
        session_id: p.session_id,
        rank_order: p.rank_order,
        is_top_pick: p.is_top_pick,
        blind_code_alias: p.blind_code_alias,
        climate_bucket_id: p.climate_bucket_id,
        climate_zone_label: p.climate_zone_label,
        temp_range_label: p.temp_range_label,
        anonymized_hint: p.anonymized_hint,
        packing_checklist: p.packing_checklist,
        hotel_star_tier: p.hotel_star_tier,
        vibe_tier_alias: p.vibe_tier_alias,
        flight_time_band: p.flight_time_band,
        mood_illustration_key: p.mood_illustration_key,
        display_price_band_vnd: p.display_price_band_vnd,
        k_anonymity_count: p.k_anonymity_count,
        group_size: p.group_size,
        unit_price_vnd: p.unit_price_vnd,
        expected_amount_vnd: p.expected_amount_vnd,
        retail_value_vnd: p.retail_value_vnd,
        similarity_score: p.similarity_score,
        total_score: p.total_score,
        score_breakdown: p.score_breakdown,
        status: p.status,
        expires_at: p.expires_at
      }));
  }

  /**
   * Generate & Persist V4 Recommendation Session + 3 Sealed Packages + Package Items
   */
  async createRecommendationSessionAndPackages({
    userId,
    originAirport = "SGN",
    budgetPerPersonVnd = 5500000,
    groupSize = 2,
    departureDate = "2026-11-15",
    durationDays = 3,
    userPreferences = {},
    blacklistedSlugs = [],
    comfortLocks = {}
  }) {
    if (!userId) throw makeSqlError("UNAUTHORIZED: Authentication required.", "28000", 401);

    return this.withTransaction(async (t) => {
      const pipelineOut = runFiveStageRecommendationPipeline({
        userId,
        originAirport,
        budgetPerPersonVnd,
        groupSize,
        departureDate,
        durationDays,
        userPreferences,
        blacklistedSlugs,
        comfortLocks,
        catalog: t
      });

      const sessionId = crypto.randomUUID();
      const sessionRow = {
        id: sessionId,
        user_id: userId,
        origin_airport: String(originAirport || "SGN").toUpperCase(),
        budget_per_person_vnd: Number(budgetPerPersonVnd),
        group_size: Number(groupSize),
        departure_date: departureDate,
        duration_days: Number(durationDays || 3),
        trip_purpose: "GENERAL_RETREAT",
        vec_healing: pipelineOut.userVec.healing,
        vec_nature: pipelineOut.userVec.nature,
        vec_solitude: pipelineOut.userVec.solitude,
        vec_comfort: pipelineOut.userVec.comfort,
        vec_culture: pipelineOut.userVec.culture,
        blacklisted_city_slugs: blacklistedSlugs,
        comfort_locks: comfortLocks,
        ai_archetype_label: "Curated Blind Explorer",
        created_at: new Date().toISOString()
      };
      t.recommendation_sessions.push(sessionRow);

      const expiresAt = new Date(Date.now() + 30 * 60 * 1000).toISOString();
      for (const item of pipelineOut.packages) {
        const pkgId = crypto.randomUUID();
        const pkgRow = {
          id: pkgId,
          session_id: sessionId,
          user_id: userId,
          rank_order: item.rank_order,
          is_top_pick: item.is_top_pick,
          secret_destination_id: item.destination.id,
          secret_hotel_id: item.hotel.id,
          secret_flight_id: item.flight.id,
          blind_code_alias: item.blind_code_alias,
          climate_bucket_id: item.climate_bucket_id,
          climate_zone_label: item.climate_zone_label,
          temp_range_label: item.temp_range_label,
          anonymized_hint: item.anonymized_hint,
          packing_checklist: item.packing_checklist,
          hotel_star_tier: item.hotel_star_tier,
          vibe_tier_alias: item.vibe_tier_alias,
          flight_time_band: item.flight_time_band,
          mood_illustration_key: item.mood_illustration_key,
          display_price_band_vnd: item.display_price_band_vnd,
          k_anonymity_count: item.k_anonymity_count,
          group_size: item.group_size,
          unit_price_vnd: item.unit_price_vnd,
          expected_amount_vnd: item.expected_amount_vnd,
          retail_value_vnd: item.retail_value_vnd,
          net_cost_vnd: item.net_cost_vnd,
          similarity_score: item.scoreBreakdown.sVibe,
          total_score: item.scoreBreakdown.sTotal,
          score_breakdown: item.scoreBreakdown,
          status: "SEALED_ACTIVE",
          expires_at: expiresAt,
          created_at: new Date().toISOString()
        };
        this._enforcePackageConstraints(pkgRow, t);
        t.packages.push(pkgRow);

        t.package_items.push(
          {
            id: crypto.randomUUID(),
            package_id: pkgId,
            inventory_id: item.hotelInv.id,
            item_type: "HOTEL_ROOM",
            units_required: item.roomsNeeded,
            unit_snapshot_price_vnd: item.hotelInv.net_price_vnd
          },
          {
            id: crypto.randomUUID(),
            package_id: pkgId,
            inventory_id: item.flightInv.id,
            item_type: "FLIGHT_SEAT",
            units_required: item.seatsNeeded,
            unit_snapshot_price_vnd: item.flightInv.net_price_vnd
          }
        );
      }

      const sealedPackages = await this.rpcGetMySealedPackages(userId, sessionId);
      return {
        session_id: sessionId,
        packages: sealedPackages
      };
    });
  }

  /**
   * RPC #3: create_booking_with_hold_v4
   */
  async rpcCreateBookingWithHold(uid, {
    p_package_id,
    p_booking_code,
    p_departure_date = "2026-11-15",
    p_duration_days = 3,
    p_travelers = [],
    p_is_legacy_migrated = false
  }) {
    if (!uid) throw makeSqlError("UNAUTHORIZED: Authentication required.", "28000", 401);

    return this.withTransaction(async (t) => {
      const bookingCode = p_booking_code || this.nextBookingCodeV4();

      // Idempotent replay check for same user
      const existing = t.bookings.find(
        b => (b.package_id === p_package_id || b.booking_code === bookingCode) && b.user_id === uid
      );
      if (existing) {
        return {
          booking_id: existing.id,
          booking_code: existing.booking_code,
          status: existing.status,
          expected_amount_vnd: existing.expected_amount_vnd,
          paid_amount_vnd: existing.paid_amount_vnd,
          amount_due_vnd: existing.amount_due_vnd,
          hold_expires_at: existing.hold_expires_at,
          idempotent_replay: true
        };
      }

      // Check if booking_code is already taken by another user
      if (t.bookings.some(b => b.booking_code === bookingCode)) {
        throw makeSqlError("CONFLICT: Booking code already exists.", "23505", 409);
      }

      const pkg = t.packages.find(p => p.id === p_package_id);
      if (!pkg) {
        throw makeSqlError("NOT_FOUND: Package does not exist.", "P0002", 404);
      }
      if (pkg.user_id !== uid) {
        throw makeSqlError("FORBIDDEN: Package belongs to another user.", "42501", 403);
      }
      if (pkg.status !== "SEALED_ACTIVE") {
        throw makeSqlError(`CONFLICT: Package is no longer active (status=${pkg.status}).`, "23505", 409);
      }
      if (new Date(pkg.expires_at).getTime() < Date.now()) {
        pkg.status = "EXPIRED";
        throw makeSqlError("GONE: Package quote has expired.", "P0001", 410);
      }

      // Lock and decrement partner_inventories in deterministic UUID order
      const pkgItems = t.package_items
        .filter(pi => pi.package_id === pkg.id)
        .sort((a, b) => a.inventory_id.localeCompare(b.inventory_id));

      for (const item of pkgItems) {
        const inv = t.partner_inventories.find(i => i.id === item.inventory_id && i.is_active);
        if (!inv || inv.available_slots < item.units_required) {
          throw makeSqlError(
            `INSUFFICIENT_INVENTORY: Not enough available slots for item ${item.item_type}.`,
            "P0001",
            409
          );
        }
        inv.available_slots -= item.units_required;
        inv.reserved_slots += item.units_required;
        inv.updated_at = new Date().toISOString();
      }

      pkg.status = "LOCKED_IN_BOOKING";

      const holdExpiresAt = new Date(Date.now() + 30 * 60 * 1000).toISOString();
      const bookingId = crypto.randomUUID();
      const newBooking = {
        id: bookingId,
        booking_code: bookingCode,
        is_legacy_migrated: Boolean(p_is_legacy_migrated),
        user_id: uid,
        package_id: pkg.id,
        group_size: pkg.group_size,
        expected_amount_vnd: pkg.expected_amount_vnd,
        paid_amount_vnd: 0,
        amount_due_vnd: pkg.expected_amount_vnd,
        overpaid_amount_vnd: 0,
        status: "PENDING_PAYMENT",
        is_revealed: false,
        revealed_at: null,
        departure_date: p_departure_date,
        return_date: p_departure_date,
        hold_expires_at: holdExpiresAt,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      this._enforceBookingTriggers(null, newBooking, t);
      t.bookings.push(newBooking);

      for (const item of pkgItems) {
        t.inventory_holds.push({
          id: crypto.randomUUID(),
          booking_id: bookingId,
          inventory_id: item.inventory_id,
          quantity: item.units_required,
          hold_status: "HELD",
          expires_at: holdExpiresAt,
          committed_at: null,
          released_at: null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        });
        t.booking_items.push({
          id: crypto.randomUUID(),
          booking_id: bookingId,
          inventory_id: item.inventory_id,
          item_type: item.item_type,
          quantity: item.units_required,
          unit_price_vnd: item.unit_snapshot_price_vnd,
          created_at: new Date().toISOString()
        });
      }

      t.payments.push({
        id: crypto.randomUUID(),
        booking_id: bookingId,
        expected_amount_vnd: newBooking.expected_amount_vnd,
        paid_amount_vnd: 0,
        refunded_amount_vnd: 0,
        payment_status: "UNPAID",
        last_transaction_at: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });

      if (Array.isArray(p_travelers)) {
        p_travelers.forEach((tr, i) => {
          t.booking_travelers.push({
            id: crypto.randomUUID(),
            booking_id: bookingId,
            traveler_index: i + 1,
            full_name: tr.full_name || `Traveler ${i + 1}`,
            id_card_ciphertext: tr.id_card_ciphertext || null,
            key_version: Number(tr.key_version || 1),
            created_at: new Date().toISOString()
          });
        });
      }

      t.booking_status_history.push({
        id: crypto.randomUUID(),
        booking_id: bookingId,
        from_booking_status: null,
        to_booking_status: "PENDING_PAYMENT",
        changed_by: uid,
        reason: "Booking created and inventory held for 30m.",
        created_at: new Date().toISOString()
      });

      return {
        booking_id: newBooking.id,
        booking_code: newBooking.booking_code,
        status: newBooking.status,
        expected_amount_vnd: newBooking.expected_amount_vnd,
        paid_amount_vnd: newBooking.paid_amount_vnd,
        amount_due_vnd: newBooking.amount_due_vnd,
        hold_expires_at: newBooking.hold_expires_at,
        idempotent_replay: false
      };
    });
  }

  /**
   * RPC #4: ingest_webhook_event_v4 (Durable Webhook Inbox for Cutover Write-Freeze)
   */
  async rpcIngestWebhookEvent({
    p_provider = "SEPAY",
    p_provider_event_id,
    p_raw_payload = {},
    p_is_write_freeze = false
  }) {
    return this.withTransaction(async (t) => {
      const provider = String(p_provider || "SEPAY").toUpperCase();
      const eventId = String(p_provider_event_id || "").trim();
      if (!eventId) {
        throw makeSqlError("MISSING_PROVIDER_EVENT_ID", "22023", 400);
      }

      const initialStatus = p_is_write_freeze ? "QUEUED_DURING_CUTOVER" : "RECEIVED";
      let evt = t.payment_webhook_events.find(
        e => e.provider === provider && e.provider_event_id === eventId
      );
      if (evt) {
        evt.raw_payload = structuredClone(p_raw_payload);
        return {
          webhook_event_id: evt.id,
          processing_status: evt.processing_status,
          persisted_durably: true,
          duplicate_event: true
        };
      }

      evt = {
        id: crypto.randomUUID(),
        provider,
        provider_event_id: eventId,
        matched_booking_id: null,
        signature_verified: true,
        raw_payload: structuredClone(p_raw_payload),
        processing_status: initialStatus,
        error_message: null,
        received_at: new Date().toISOString(),
        processed_at: null
      };
      t.payment_webhook_events.push(evt);

      return {
        webhook_event_id: evt.id,
        processing_status: evt.processing_status,
        persisted_durably: true,
        duplicate_event: false
      };
    });
  }

  /**
   * RPC #5: process_payment_webhook_v4
   */
  async rpcProcessPaymentWebhook({
    p_provider = "SEPAY",
    p_provider_event_id,
    p_external_tx_id,
    p_booking_code,
    p_transfer_amount,
    p_transfer_content = "",
    p_bank_code = "MB",
    p_raw_payload = {}
  }) {
    return this.withTransaction(async (t) => {
      const provider = String(p_provider || "SEPAY").toUpperCase();
      const extTxId = String(p_external_tx_id || "").trim();
      const eventId = String(p_provider_event_id || extTxId).trim();
      const amount = Number(p_transfer_amount || 0);

      if (!Number.isFinite(amount) || amount <= 0) {
        throw makeSqlError("INVALID_AMOUNT: Transfer amount must be positive.", "22023", 400);
      }

      // Extract booking code from p_booking_code or p_transfer_content supporting both V4 ^WM[0-9]{8}$ and legacy V3 codes
      let resolvedCode = String(p_booking_code || "").trim().toUpperCase();
      let isAmbiguousMemo = false;
      if (!resolvedCode && p_transfer_content) {
        const matches = [...String(p_transfer_content).matchAll(/\b(WM(?:-?[A-Z0-9]{4,16})+)\b/gi)].map(
          m => m[1].toUpperCase()
        );
        const uniqueCodes = [...new Set(matches)];
        if (uniqueCodes.length === 1) {
          resolvedCode = uniqueCodes[0];
        } else if (uniqueCodes.length > 1) {
          isAmbiguousMemo = true;
        }
      }

      // Upsert webhook inbox record
      let whEvent = t.payment_webhook_events.find(
        e => e.provider === provider && e.provider_event_id === eventId
      );
      if (!whEvent) {
        whEvent = {
          id: crypto.randomUUID(),
          provider,
          provider_event_id: eventId,
          matched_booking_id: null,
          signature_verified: true,
          raw_payload: structuredClone(p_raw_payload),
          processing_status: "RECEIVED",
          error_message: null,
          received_at: new Date().toISOString(),
          processed_at: null
        };
        t.payment_webhook_events.push(whEvent);
      }

      // 1. Provider-scoped UNIQUE(payment_provider, external_transaction_id) check
      const existingTx = t.payment_transactions.find(
        tx => tx.payment_provider === provider && tx.external_transaction_id === extTxId
      );
      if (existingTx) {
        const bk = t.bookings.find(b => b.id === existingTx.booking_id);
        whEvent.processing_status = "IGNORED_DUPLICATE";
        whEvent.matched_booking_id = bk ? bk.id : null;
        whEvent.processed_at = new Date().toISOString();
        return {
          success: true,
          http_status: 200,
          idempotent_replay: true,
          booking_code: bk ? bk.booking_code : resolvedCode,
          status: bk ? bk.status : "UNKNOWN",
          expected_amount_vnd: bk ? bk.expected_amount_vnd : 0,
          paid_amount_vnd: bk ? bk.paid_amount_vnd : 0,
          amount_due_vnd: bk ? bk.amount_due_vnd : 0,
          overpaid_amount_vnd: bk ? bk.overpaid_amount_vnd : 0,
          is_overpaid: bk ? bk.overpaid_amount_vnd > 0 : false
        };
      }

      if (isAmbiguousMemo || !resolvedCode) {
        whEvent.processing_status = "FAILED_UNMATCHED";
        whEvent.error_message = `Ambiguous or missing booking code in transfer content: ${p_transfer_content}`;
        whEvent.processed_at = new Date().toISOString();
        return {
          success: false,
          status: "UNMATCHED_BOOKING_CODE",
          http_status: 404,
          error: "Ambiguous or missing booking code in transfer content."
        };
      }

      const booking = t.bookings.find(b => b.booking_code === resolvedCode);
      if (!booking) {
        whEvent.processing_status = "FAILED_UNMATCHED";
        whEvent.error_message = `Booking code not found: ${resolvedCode}`;
        whEvent.processed_at = new Date().toISOString();
        return {
          success: false,
          status: "UNMATCHED_BOOKING_CODE",
          http_status: 404,
          error: "Booking code not found."
        };
      }

      const oldStatus = booking.status;
      const payment = t.payments.find(p => p.booking_id === booking.id);

      // Insert immutable payment_transactions row
      const newTx = {
        id: crypto.randomUUID(),
        payment_id: payment.id,
        booking_id: booking.id,
        webhook_event_id: whEvent.id,
        payment_provider: provider,
        external_transaction_id: extTxId,
        amount_vnd: amount,
        direction: "INFLOW",
        bank_code: p_bank_code,
        transfer_content: p_transfer_content || resolvedCode,
        created_at: new Date().toISOString()
      };
      t.payment_transactions.push(newTx);

      const newPaid = Number(booking.paid_amount_vnd) + amount;
      let newBookingStatus = booking.status;
      let newPaymentStatus = payment.payment_status;

      if (["EXPIRED", "CANCELLED", "REFUND_REQUESTED", "REFUND_APPROVED", "REFUND_PROCESSING", "REFUNDED"].includes(oldStatus)) {
        if (oldStatus === "EXPIRED" && newPaid >= booking.expected_amount_vnd) {
          const holds = t.inventory_holds
            .filter(h => h.booking_id === booking.id)
            .sort((a, b) => a.inventory_id.localeCompare(b.inventory_id));

          let canReacquire = true;
          for (const h of holds) {
            if (h.hold_status === "EXPIRED") {
              const inv = t.partner_inventories.find(i => i.id === h.inventory_id && i.is_active);
              if (!inv || inv.available_slots < h.quantity) {
                canReacquire = false;
              }
            }
          }

          if (canReacquire) {
            for (const h of holds) {
              if (h.hold_status === "EXPIRED") {
                const inv = t.partner_inventories.find(i => i.id === h.inventory_id);
                inv.available_slots -= h.quantity;
                inv.reserved_slots += h.quantity;
                inv.updated_at = new Date().toISOString();
                h.hold_status = "COMMITTED";
                h.committed_at = new Date().toISOString();
                h.updated_at = new Date().toISOString();
              }
            }
            newBookingStatus = newPaid > booking.expected_amount_vnd ? "OVERPAID" : "PAID";
            newPaymentStatus = newBookingStatus;
          } else {
            newBookingStatus = "PAID_HOLD_CONFLICT";
            newPaymentStatus = newPaid > booking.expected_amount_vnd ? "OVERPAID" : "PAID";
          }
        } else {
          newBookingStatus = "PAID_HOLD_CONFLICT";
          newPaymentStatus =
            newPaid < booking.expected_amount_vnd
              ? "UNDERPAID"
              : newPaid === booking.expected_amount_vnd
              ? "PAID"
              : "OVERPAID";
        }
      } else {
        if (newPaid < booking.expected_amount_vnd) {
          newBookingStatus = "UNDERPAID";
          newPaymentStatus = "UNDERPAID";
        } else if (newPaid === booking.expected_amount_vnd) {
          newBookingStatus = booking.is_revealed ? "REVEALED" : "PAID";
          newPaymentStatus = "PAID";
        } else {
          newBookingStatus = booking.is_revealed ? "REVEALED" : "OVERPAID";
          newPaymentStatus = "OVERPAID";
        }

        if (newPaid >= booking.expected_amount_vnd) {
          for (const h of t.inventory_holds) {
            if (h.booking_id === booking.id && h.hold_status === "HELD") {
              h.hold_status = "COMMITTED";
              h.committed_at = h.committed_at || new Date().toISOString();
              h.updated_at = new Date().toISOString();
            }
          }
        }
      }

      const updatedBooking = {
        ...booking,
        paid_amount_vnd: newPaid,
        status: newBookingStatus,
        updated_at: new Date().toISOString()
      };
      this._enforceBookingTriggers(booking, updatedBooking, t);
      Object.assign(booking, updatedBooking);

      payment.paid_amount_vnd = newPaid;
      payment.payment_status = newPaymentStatus;
      payment.last_transaction_at = new Date().toISOString();
      payment.updated_at = new Date().toISOString();

      t.booking_status_history.push({
        id: crypto.randomUUID(),
        booking_id: booking.id,
        from_booking_status: oldStatus,
        to_booking_status: newBookingStatus,
        changed_by: null,
        reason: `Webhook tx ${extTxId} (+${amount} VND)`,
        created_at: new Date().toISOString()
      });

      if (["PAID", "OVERPAID", "PAID_HOLD_CONFLICT"].includes(newBookingStatus)) {
        const outboxKey = `OUTBOX-WH-${provider}-${extTxId}`;
        if (!t.outbox_events.some(o => o.idempotency_key === outboxKey)) {
          t.outbox_events.push({
            id: crypto.randomUUID(),
            aggregate_type: "BOOKING",
            aggregate_id: booking.id,
            event_type: newBookingStatus === "PAID_HOLD_CONFLICT" ? "HOLD_CONFLICT_ALERT" : "BOOKING_PAID_NOTIFICATION",
            idempotency_key: outboxKey,
            payload: {
              booking_id: booking.id,
              booking_code: booking.booking_code,
              status: booking.status,
              paid_amount_vnd: booking.paid_amount_vnd
            },
            status: "PENDING",
            attempt_count: 0,
            max_attempts: 8,
            next_attempt_at: new Date().toISOString(),
            locked_by: null,
            locked_until: null,
            last_error: null,
            created_at: new Date().toISOString(),
            processed_at: null
          });
        }
      }

      whEvent.matched_booking_id = booking.id;
      whEvent.processing_status = newBookingStatus === "PAID_HOLD_CONFLICT" ? "LATE_PAYMENT_CONFLICT" : "PROCESSED";
      whEvent.processed_at = new Date().toISOString();

      return {
        success: true,
        http_status: 200,
        idempotent_replay: false,
        booking_code: booking.booking_code,
        status: booking.status,
        expected_amount_vnd: booking.expected_amount_vnd,
        paid_amount_vnd: booking.paid_amount_vnd,
        amount_due_vnd: booking.amount_due_vnd,
        overpaid_amount_vnd: booking.overpaid_amount_vnd,
        is_overpaid: booking.overpaid_amount_vnd > 0
      };
    });
  }

  /**
   * RPC #6: replay_queued_webhook_events_v4
   */
  async rpcReplayQueuedWebhookEvents({ p_batch_limit = 200 } = {}) {
    const queued = this.tables.payment_webhook_events
      .filter(e => e.processing_status === "QUEUED_DURING_CUTOVER")
      .slice(0, p_batch_limit);

    let replayedCount = 0;
    let processedCount = 0;
    let duplicateCount = 0;

    for (const evt of queued) {
      const payload = evt.raw_payload || {};
      const res = await this.rpcProcessPaymentWebhook({
        p_provider: evt.provider,
        p_provider_event_id: evt.provider_event_id,
        p_external_tx_id: payload.external_transaction_id || payload.id || evt.provider_event_id,
        p_booking_code: payload.booking_code || payload.bookingCode || "",
        p_transfer_amount: payload.transfer_amount || payload.transferAmount || payload.amount || 0,
        p_transfer_content: payload.transfer_content || payload.content || "",
        p_bank_code: payload.bank_code || "MB",
        p_raw_payload: payload
      });
      replayedCount++;
      if (res.idempotent_replay) duplicateCount++;
      else if (res.success) processedCount++;
    }

    return {
      replayed_count: replayedCount,
      processed_count: processedCount,
      ignored_duplicate_count: duplicateCount
    };
  }

  /**
   * RPC #7: expire_stale_holds_v4
   */
  async rpcExpireStaleHolds({ p_batch_limit = 100, p_reference_time = null } = {}) {
    return this.withTransaction(async (t) => {
      const nowMs = p_reference_time ? new Date(p_reference_time).getTime() : Date.now();
      let expiredCount = 0;

      const candidates = t.bookings
        .filter(
          b =>
            b.status === "PENDING_PAYMENT" &&
            Number(b.paid_amount_vnd) === 0 &&
            new Date(b.hold_expires_at).getTime() < nowMs
        )
        .slice(0, p_batch_limit);

      for (const bk of candidates) {
        const holds = t.inventory_holds
          .filter(h => h.booking_id === bk.id && h.hold_status === "HELD")
          .sort((a, b) => a.inventory_id.localeCompare(b.inventory_id));

        for (const h of holds) {
          h.hold_status = "EXPIRED";
          h.released_at = new Date().toISOString();
          h.updated_at = new Date().toISOString();

          const inv = t.partner_inventories.find(i => i.id === h.inventory_id);
          if (inv) {
            inv.available_slots += h.quantity;
            inv.reserved_slots = Math.max(0, inv.reserved_slots - h.quantity);
            inv.updated_at = new Date().toISOString();
          }
        }

        const updatedBk = { ...bk, status: "EXPIRED", updated_at: new Date().toISOString() };
        this._enforceBookingTriggers(bk, updatedBk, t);
        Object.assign(bk, updatedBk);

        const pkg = t.packages.find(p => p.id === bk.package_id);
        if (pkg && pkg.status === "LOCKED_IN_BOOKING") {
          pkg.status = "EXPIRED";
        }

        t.booking_status_history.push({
          id: crypto.randomUUID(),
          booking_id: bk.id,
          from_booking_status: "PENDING_PAYMENT",
          to_booking_status: "EXPIRED",
          changed_by: null,
          reason: "Hold expired after 30m without payment.",
          created_at: new Date().toISOString()
        });

        expiredCount++;
      }

      return { expired_bookings_count: expiredCount };
    });
  }

  /**
   * RPC #8: reveal_blind_booking_v4
   */
  async rpcRevealBlindBooking(uid, bookingCode) {
    if (!uid) throw makeSqlError("UNAUTHORIZED: Authentication required.", "28000", 401);

    return this.withTransaction(async (t) => {
      const isAdmin = this.isAdmin(uid);
      const bk = t.bookings.find(b => b.booking_code === bookingCode);
      if (!bk) {
        throw makeSqlError("NOT_FOUND: Booking does not exist.", "P0002", 404);
      }
      if (bk.user_id !== uid && !isAdmin) {
        throw makeSqlError("FORBIDDEN: Not the owner of this booking.", "42501", 403);
      }
      if (bk.status === "PAID_HOLD_CONFLICT") {
        throw makeSqlError(
          "HOLD_CONFLICT: Booking has an unresolved inventory hold conflict and cannot be revealed.",
          "P0001",
          409
        );
      }
      if (!["PAID", "OVERPAID", "REVEALED", "COMPLETED"].includes(bk.status)) {
        throw makeSqlError(
          `PAYMENT_REQUIRED: Booking is not eligible for reveal (status=${bk.status}).`,
          "P0001",
          402
        );
      }

      const txSum = t.payment_transactions
        .filter(tx => tx.booking_id === bk.id && tx.direction === "INFLOW")
        .reduce((acc, tx) => acc + Number(tx.amount_vnd), 0);

      if (bk.paid_amount_vnd < bk.expected_amount_vnd || txSum < bk.expected_amount_vnd) {
        throw makeSqlError(
          `PAYMENT_RECONCILIATION_FAILED: Verified inflows (${txSum}) are less than expected (${bk.expected_amount_vnd}).`,
          "P0001",
          402
        );
      }

      const oldStatus = bk.status;
      if (!bk.is_revealed) {
        const updatedBk = {
          ...bk,
          is_revealed: true,
          revealed_at: new Date().toISOString(),
          status: "REVEALED",
          updated_at: new Date().toISOString()
        };
        this._enforceBookingTriggers(bk, updatedBk, t);
        Object.assign(bk, updatedBk);

        t.booking_status_history.push({
          id: crypto.randomUUID(),
          booking_id: bk.id,
          from_booking_status: oldStatus,
          to_booking_status: "REVEALED",
          changed_by: uid,
          reason: "Destination revealed by authorized owner.",
          created_at: new Date().toISOString()
        });
      }

      t.audit_logs.push({
        id: crypto.randomUUID(),
        actor_id: uid,
        actor_role: isAdmin ? "admin" : "traveler",
        action_type: "BLIND_BOOKING_REVEALED",
        target_table: "bookings",
        target_id: bk.booking_code,
        ip_address: "127.0.0.1",
        old_data: null,
        new_data: { revealed_at: bk.revealed_at },
        created_at: new Date().toISOString()
      });

      const pkg = t.packages.find(p => p.id === bk.package_id);
      const dest = t.destinations.find(d => d.id === pkg.secret_destination_id);
      const hotel = t.hotels.find(h => h.id === pkg.secret_hotel_id);
      const flight = t.flights.find(f => f.id === pkg.secret_flight_id);

      return {
        booking_code: bk.booking_code,
        status: bk.status,
        revealed_at: bk.revealed_at,
        destination: {
          city_name: dest.city_name,
          province_name: dest.province_name,
          region: dest.region,
          local_dining_guide: dest.local_dining_guide_jsonb
        },
        hotel: {
          hotel_name: hotel.hotel_name,
          address: hotel.address,
          star_rating: hotel.star_rating,
          sla_code: hotel.sla_code,
          hero_image_url: hotel.secret_hero_image_url
        },
        flight: {
          airline_name: flight.airline_name,
          flight_code: flight.flight_code,
          origin_airport: flight.origin_airport,
          destination_airport: flight.destination_airport,
          exact_departure_time: flight.exact_departure_time,
          baggage_kg: flight.baggage_kg
        }
      };
    });
  }

  /**
   * RPC #9: request_refund_v4
   */
  async rpcRequestRefund(uid, {
    p_booking_code,
    p_mode = "REQUEST",
    p_tier = "EARLY_72H",
    p_reason = null,
    p_evidence_url = null,
    p_idempotency_key = null
  }) {
    if (!uid) throw makeSqlError("UNAUTHORIZED: Login required.", "28000", 401);

    return this.withTransaction(async (t) => {
      const bk = t.bookings.find(b => b.booking_code === p_booking_code);
      if (!bk) throw makeSqlError("NOT_FOUND: Booking not found.", "P0002", 404);
      if (bk.user_id !== uid) {
        throw makeSqlError("FORBIDDEN: Only the booking owner can request a refund.", "42501", 403);
      }
      if (bk.paid_amount_vnd <= 0 || ["PENDING_PAYMENT", "EXPIRED", "REFUNDED"].includes(bk.status)) {
        throw makeSqlError(`CONFLICT: Booking has no refundable balance (status=${bk.status}).`, "23505", 409);
      }

      const pay = t.payments.find(p => p.booking_id === bk.id);
      let effectiveTier = String(p_tier || "EARLY_72H").trim().toUpperCase();
      if (effectiveTier === "FORCE_MAJEURE_A") effectiveTier = "FORCE_MAJEURE";
      else if (effectiveTier === "LATE_24_72H") effectiveTier = "WINDOW_24_72H";
      else if (effectiveTier === "LAST_MINUTE_24H") effectiveTier = "LATE_OR_REVEALED";

      let feeRate = 1.0, partnerRate = 0.75;
      if (bk.status === "PAID_HOLD_CONFLICT") {
        effectiveTier = "HOLD_CONFLICT_FULL";
        feeRate = 0.0; partnerRate = 0.0;
      } else if (bk.is_revealed && effectiveTier !== "FORCE_MAJEURE") {
        effectiveTier = "LATE_OR_REVEALED";
        feeRate = 1.0; partnerRate = 0.75;
      } else if (effectiveTier === "EARLY_72H" || effectiveTier === "FORCE_MAJEURE") {
        feeRate = 0.10; partnerRate = 0.0;
      } else if (effectiveTier === "WINDOW_24_72H") {
        feeRate = 0.35; partnerRate = 0.25;
      } else {
        effectiveTier = "LATE_OR_REVEALED";
        feeRate = 1.0; partnerRate = 0.75;
      }

      const feeVnd = Math.round(bk.paid_amount_vnd * feeRate);
      const partnerVnd = Math.round(bk.paid_amount_vnd * partnerRate);
      const refundVnd = Math.max(0, bk.paid_amount_vnd - feeVnd);

      if (p_mode === "QUOTE") {
        return {
          mode: "QUOTE",
          booking_code: bk.booking_code,
          tier_applied: effectiveTier,
          paid_snapshot_vnd: bk.paid_amount_vnd,
          cancellation_fee_vnd: feeVnd,
          partner_comp_vnd: partnerVnd,
          refund_amount_vnd: refundVnd
        };
      }

      // Check active refund partial unique index
      const activeRefund = t.refunds.find(
        r =>
          r.booking_id === bk.id &&
          ["REQUESTED", "APPROVED", "PROCESSING", "RECONCILIATION_REQUIRED"].includes(r.status)
      );
      if (activeRefund) {
        throw makeSqlError("CONFLICT: An active refund already exists for this booking.", "23505", 409);
      }

      const idemKey = p_idempotency_key || `REQ-${bk.booking_code}-${Date.now()}`;
      const newRefund = {
        id: crypto.randomUUID(),
        booking_id: bk.id,
        payment_id: pay.id,
        requested_by: uid,
        reviewed_by: null,
        idempotency_key: idemKey,
        tier_applied: effectiveTier,
        paid_snapshot_vnd: bk.paid_amount_vnd,
        cancellation_fee_vnd: feeVnd,
        partner_comp_vnd: partnerVnd,
        refund_amount_vnd: refundVnd,
        reason: p_reason,
        evidence_url: p_evidence_url,
        status: "REQUESTED",
        payout_bank_ref: null,
        failure_reason: null,
        requested_at: new Date().toISOString(),
        reviewed_at: null,
        processed_at: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      t.refunds.push(newRefund);

      const oldStatus = bk.status;
      const updatedBk = { ...bk, status: "REFUND_REQUESTED", updated_at: new Date().toISOString() };
      this._enforceBookingTriggers(bk, updatedBk, t);
      Object.assign(bk, updatedBk);

      t.booking_status_history.push({
        id: crypto.randomUUID(),
        booking_id: bk.id,
        from_booking_status: oldStatus,
        to_booking_status: "REFUND_REQUESTED",
        changed_by: uid,
        reason: `Traveler submitted refund request ${newRefund.id}`,
        created_at: new Date().toISOString()
      });

      return {
        mode: "REQUEST",
        refund_id: newRefund.id,
        status: newRefund.status,
        refund_amount_vnd: newRefund.refund_amount_vnd
      };
    });
  }

  /**
   * RPC #10: approve_refund_v4 (Admin Approval ONLY — writes to Transactional Outbox)
   */
  async rpcApproveRefund(uid, { p_refund_id, p_decision = "APPROVE", p_review_note = null }) {
    if (!this.isAdmin(uid)) {
      throw makeSqlError("FORBIDDEN: Admin privilege required.", "42501", 403);
    }

    return this.withTransaction(async (t) => {
      const ref = t.refunds.find(r => r.id === p_refund_id);
      if (!ref) throw makeSqlError("NOT_FOUND: Refund not found.", "P0002", 404);

      if (["APPROVED", "PROCESSING", "SUCCEEDED"].includes(ref.status) && p_decision === "APPROVE") {
        return {
          refund_id: ref.id,
          status: ref.status,
          idempotent_replay: true
        };
      }

      if (ref.status !== "REQUESTED") {
        throw makeSqlError(`CONFLICT: Only REQUESTED refunds can be reviewed (current=${ref.status}).`, "23505", 409);
      }

      const bk = t.bookings.find(b => b.id === ref.booking_id);
      const oldStatus = bk.status;

      if (p_decision === "REJECT") {
        ref.status = "REJECTED";
        ref.reviewed_by = uid;
        ref.reviewed_at = new Date().toISOString();
        ref.reason = p_review_note || ref.reason;
        ref.updated_at = new Date().toISOString();

        const revertedStatus = bk.is_revealed
          ? "REVEALED"
          : bk.paid_amount_vnd > bk.expected_amount_vnd
          ? "OVERPAID"
          : "PAID";
        const updatedBk = { ...bk, status: revertedStatus, updated_at: new Date().toISOString() };
        this._enforceBookingTriggers(bk, updatedBk, t);
        Object.assign(bk, updatedBk);

        return { refund_id: ref.id, status: "REJECTED", idempotent_replay: false };
      }

      ref.status = "APPROVED";
      ref.reviewed_by = uid;
      ref.reviewed_at = new Date().toISOString();
      ref.updated_at = new Date().toISOString();

      const updatedBk = { ...bk, status: "REFUND_APPROVED", updated_at: new Date().toISOString() };
      this._enforceBookingTriggers(bk, updatedBk, t);
      Object.assign(bk, updatedBk);

      t.booking_status_history.push({
        id: crypto.randomUUID(),
        booking_id: bk.id,
        from_booking_status: oldStatus,
        to_booking_status: "REFUND_APPROVED",
        changed_by: uid,
        reason: `Admin approved refund ${ref.id}`,
        created_at: new Date().toISOString()
      });

      const outboxKey = `OUTBOX-PAYOUT-${ref.idempotency_key}`;
      if (!t.outbox_events.some(o => o.idempotency_key === outboxKey)) {
        t.outbox_events.push({
          id: crypto.randomUUID(),
          aggregate_type: "REFUND",
          aggregate_id: ref.id,
          event_type: "REFUND_PAYOUT_REQUESTED",
          idempotency_key: outboxKey,
          payload: {
            refund_id: ref.id,
            booking_id: bk.id,
            booking_code: bk.booking_code,
            user_id: bk.user_id,
            refund_amount_vnd: ref.refund_amount_vnd,
            idempotency_key: ref.idempotency_key
          },
          status: "PENDING",
          attempt_count: 0,
          max_attempts: 8,
          next_attempt_at: new Date().toISOString(),
          locked_by: null,
          locked_until: null,
          last_error: null,
          created_at: new Date().toISOString(),
          processed_at: null
        });
      }

      t.audit_logs.push({
        id: crypto.randomUUID(),
        actor_id: uid,
        actor_role: "admin",
        action_type: "REFUND_APPROVED",
        target_table: "refunds",
        target_id: ref.id,
        ip_address: "127.0.0.1",
        old_data: null,
        new_data: { booking_code: bk.booking_code, refund_amount_vnd: ref.refund_amount_vnd },
        created_at: new Date().toISOString()
      });

      return {
        refund_id: ref.id,
        status: "APPROVED",
        outbox_queued: true,
        idempotent_replay: false
      };
    });
  }

  /**
   * RPC #11A: claim_refund_for_processing_v4
   */
  async rpcClaimRefundForProcessing(refundId) {
    return this.withTransaction(async (t) => {
      const ref = t.refunds.find(r => r.id === refundId);
      if (!ref) throw makeSqlError("NOT_FOUND: Refund not found.", "P0002", 404);
      if (ref.status === "RECONCILIATION_REQUIRED") {
        throw makeSqlError(
          `RECONCILIATION_LOCKED: Refund ${ref.id} is awaiting bank status reconciliation; duplicate payout blocked.`,
          "23505",
          409
        );
      }
      if (ref.status !== "APPROVED") {
        throw makeSqlError(
          `CONFLICT: Only APPROVED refunds can be claimed for payout processing (current=${ref.status}).`,
          "23505",
          409
        );
      }

      const bk = t.bookings.find(b => b.id === ref.booking_id);
      ref.status = "PROCESSING";
      ref.updated_at = new Date().toISOString();

      const updatedBk = { ...bk, status: "REFUND_PROCESSING", updated_at: new Date().toISOString() };
      this._enforceBookingTriggers(bk, updatedBk, t);
      Object.assign(bk, updatedBk);

      return {
        refund_id: ref.id,
        status: "PROCESSING",
        idempotency_key: ref.idempotency_key
      };
    });
  }

  /**
   * RPC #11B: finalize_refund_payout_v4
   */
  async rpcFinalizeRefundPayout({
    p_refund_id,
    p_outcome,
    p_payout_bank_ref = null,
    p_error_message = null
  }) {
    return this.withTransaction(async (t) => {
      const ref = t.refunds.find(r => r.id === p_refund_id);
      if (!ref) throw makeSqlError("NOT_FOUND: Refund not found.", "P0002", 404);
      if (ref.status === "SUCCEEDED") {
        return { refund_id: ref.id, status: "SUCCEEDED", idempotent_replay: true };
      }

      const bk = t.bookings.find(b => b.id === ref.booking_id);

      if (p_outcome === "RECONCILIATION_REQUIRED") {
        ref.status = "RECONCILIATION_REQUIRED";
        ref.failure_reason = p_error_message;
        ref.updated_at = new Date().toISOString();

        const updatedBk = { ...bk, status: "REFUND_RECONCILIATION_REQUIRED", updated_at: new Date().toISOString() };
        this._enforceBookingTriggers(bk, updatedBk, t);
        Object.assign(bk, updatedBk);

        return { refund_id: ref.id, status: "RECONCILIATION_REQUIRED" };
      }

      if (p_outcome === "FAILED") {
        ref.status = "FAILED";
        ref.failure_reason = p_error_message;
        ref.updated_at = new Date().toISOString();

        const updatedBk = { ...bk, status: "REFUND_APPROVED", updated_at: new Date().toISOString() };
        this._enforceBookingTriggers(bk, updatedBk, t);
        Object.assign(bk, updatedBk);

        return { refund_id: ref.id, status: "FAILED" };
      }

      // Outcome === 'SUCCEEDED': Release inventory holds ONCE and record OUTFLOW_REFUND transaction
      const holds = t.inventory_holds
        .filter(h => h.booking_id === bk.id && ["HELD", "COMMITTED"].includes(h.hold_status))
        .sort((a, b) => a.inventory_id.localeCompare(b.inventory_id));

      for (const h of holds) {
        h.hold_status = "RELEASED";
        h.released_at = new Date().toISOString();
        h.updated_at = new Date().toISOString();

        const inv = t.partner_inventories.find(i => i.id === h.inventory_id);
        if (inv) {
          inv.available_slots += h.quantity;
          inv.reserved_slots = Math.max(0, inv.reserved_slots - h.quantity);
          inv.updated_at = new Date().toISOString();
        }
      }

      const extTxId = p_payout_bank_ref || `REF-PAYOUT-${ref.idempotency_key}`;
      if (
        !t.payment_transactions.some(
          tx => tx.payment_provider === "NAPAS_PAYOUT" && tx.external_transaction_id === extTxId
        )
      ) {
        t.payment_transactions.push({
          id: crypto.randomUUID(),
          payment_id: ref.payment_id,
          booking_id: bk.id,
          webhook_event_id: null,
          payment_provider: "NAPAS_PAYOUT",
          external_transaction_id: extTxId,
          amount_vnd: ref.refund_amount_vnd,
          direction: "OUTFLOW_REFUND",
          bank_code: "MB",
          transfer_content: `Refund payout for ${bk.booking_code}`,
          created_at: new Date().toISOString()
        });
      }

      ref.status = "SUCCEEDED";
      ref.payout_bank_ref = extTxId;
      ref.processed_at = new Date().toISOString();
      ref.updated_at = new Date().toISOString();

      const pay = t.payments.find(p => p.id === ref.payment_id);
      pay.refunded_amount_vnd = Number(pay.refunded_amount_vnd || 0) + Number(ref.refund_amount_vnd);
      pay.payment_status =
        pay.refunded_amount_vnd >= pay.paid_amount_vnd ? "REFUNDED" : "PARTIALLY_REFUNDED";
      pay.updated_at = new Date().toISOString();

      const updatedBk = { ...bk, status: "REFUNDED", updated_at: new Date().toISOString() };
      this._enforceBookingTriggers(bk, updatedBk, t);
      Object.assign(bk, updatedBk);

      const outbox = t.outbox_events.find(
        o => o.idempotency_key === `OUTBOX-PAYOUT-${ref.idempotency_key}`
      );
      if (outbox) {
        outbox.status = "PUBLISHED";
        outbox.processed_at = new Date().toISOString();
      }

      return { refund_id: ref.id, status: "SUCCEEDED", idempotent_replay: false };
    });
  }

  /**
   * RPC #12: claim_due_outbox_events_v4 (FOR UPDATE SKIP LOCKED + Lease Expiry Crash Recovery)
   */
  async rpcClaimDueOutboxEvents({
    p_worker_id = "outbox-worker-1",
    p_batch_limit = 20,
    p_lease_seconds = 30,
    p_now_ms = Date.now()
  } = {}) {
    return this.withTransaction(async (t) => {
      const nowMs = Number(p_now_ms || Date.now());
      const due = t.outbox_events
        .filter(
          e =>
            (e.status === "PENDING" &&
              new Date(e.next_attempt_at).getTime() <= nowMs &&
              (!e.locked_until || new Date(e.locked_until).getTime() <= nowMs)) ||
            (e.status === "PROCESSING" &&
              e.locked_until &&
              new Date(e.locked_until).getTime() <= nowMs)
        )
        .sort((a, b) => new Date(a.next_attempt_at).getTime() - new Date(b.next_attempt_at).getTime())
        .slice(0, p_batch_limit);

      const claimed = [];
      const leaseUntil = new Date(nowMs + Math.max(5, Number(p_lease_seconds || 30)) * 1000).toISOString();
      for (const evt of due) {
        evt.status = "PROCESSING";
        evt.locked_by = p_worker_id;
        evt.locked_until = leaseUntil;
        claimed.push(structuredClone(evt));
      }
      return {
        claimed_count: claimed.length,
        events: claimed
      };
    });
  }

  /**
   * Transactional Outbox Poller with Exponential Backoff, Dead-Letter, Lease Recovery, and Bank Timeout Protection (T-12, T-13)
   */
  async processOutboxBatch({ bankGatewayFn, workerId = "outbox-worker-1", nowMs = Date.now() }) {
    const dueEvents = this.tables.outbox_events.filter(
      e =>
        (e.status === "PENDING" &&
          new Date(e.next_attempt_at).getTime() <= nowMs &&
          (!e.locked_until || new Date(e.locked_until).getTime() <= nowMs)) ||
        (e.status === "PROCESSING" &&
          e.locked_until &&
          new Date(e.locked_until).getTime() <= nowMs)
    );

    const results = [];
    for (const evt of dueEvents) {
      if (evt.event_type === "REFUND_PAYOUT_REQUESTED") {
        const refundId = evt.payload.refund_id;
        const ref = this.tables.refunds.find(r => r.id === refundId);
        // Never re-execute payout if refund is in RECONCILIATION_REQUIRED!
        if (ref && ref.status === "RECONCILIATION_REQUIRED") {
          results.push({ event_id: evt.id, skipped: "RECONCILIATION_REQUIRED" });
          continue;
        }
        if (ref && ref.status === "APPROVED") {
          await this.rpcClaimRefundForProcessing(refundId);
        }
      }

      evt.status = "PROCESSING";
      evt.locked_by = workerId;
      evt.locked_until = new Date(nowMs + 30000).toISOString();

      try {
        const gatewayRes = await bankGatewayFn(evt);
        if (evt.event_type === "REFUND_PAYOUT_REQUESTED") {
          await this.rpcFinalizeRefundPayout({
            p_refund_id: evt.payload.refund_id,
            p_outcome: "SUCCEEDED",
            p_payout_bank_ref: gatewayRes?.payout_bank_ref || `NAPAS-${evt.idempotency_key}`
          });
        } else {
          evt.status = "PUBLISHED";
          evt.processed_at = new Date(nowMs).toISOString();
        }
        results.push({ event_id: evt.id, status: "PUBLISHED" });
      } catch (err) {
        evt.attempt_count += 1;
        evt.last_error = err.message || "Outbox processing error";
        evt.locked_by = null;
        evt.locked_until = null;

        if (err.isTimeout && evt.event_type === "REFUND_PAYOUT_REQUESTED") {
          // Lock refund in RECONCILIATION_REQUIRED so outbox worker NEVER double-pays!
          await this.rpcFinalizeRefundPayout({
            p_refund_id: evt.payload.refund_id,
            p_outcome: "RECONCILIATION_REQUIRED",
            p_error_message: err.message
          });
          evt.status = "PENDING";
          results.push({ event_id: evt.id, status: "RECONCILIATION_REQUIRED" });
          continue;
        }

        if (err.isDefinitiveRejection && evt.event_type === "REFUND_PAYOUT_REQUESTED") {
          await this.rpcFinalizeRefundPayout({
            p_refund_id: evt.payload.refund_id,
            p_outcome: "FAILED",
            p_error_message: err.message
          });
          evt.status = "DEAD_LETTER";
          results.push({ event_id: evt.id, status: "FAILED" });
          continue;
        }

        if (evt.attempt_count >= evt.max_attempts) {
          evt.status = "DEAD_LETTER";
          results.push({ event_id: evt.id, status: "DEAD_LETTER" });
        } else {
          evt.status = "PENDING";
          const backoffSeconds = Math.pow(2, evt.attempt_count);
          evt.next_attempt_at = new Date(nowMs + backoffSeconds * 1000).toISOString();
          results.push({
            event_id: evt.id,
            status: "RETRY_SCHEDULED",
            attempt_count: evt.attempt_count,
            next_attempt_at: evt.next_attempt_at
          });
        }
      }
    }

    return results;
  }

  /**
   * Reconciles a refund locked in RECONCILIATION_REQUIRED via Bank Status Inquiry API (T-13)
   */
  async reconcileRefundPayout({ refundId, bankInquiryFn }) {
    const ref = this.tables.refunds.find(r => r.id === refundId);
    if (!ref) throw makeSqlError("NOT_FOUND: Refund not found.", "P0002", 404);
    if (ref.status !== "RECONCILIATION_REQUIRED") {
      return { refund_id: ref.id, status: ref.status };
    }

    const inquiry = await bankInquiryFn(ref.idempotency_key);
    if (inquiry.bank_status === "SUCCEEDED") {
      return this.rpcFinalizeRefundPayout({
        p_refund_id: ref.id,
        p_outcome: "SUCCEEDED",
        p_payout_bank_ref: inquiry.payout_bank_ref || `RECON-${ref.idempotency_key}`
      });
    }
    if (inquiry.bank_status === "FAILED" || inquiry.bank_status === "NOT_FOUND") {
      return this.rpcFinalizeRefundPayout({
        p_refund_id: ref.id,
        p_outcome: "FAILED",
        p_error_message: inquiry.reason || "Confirmed not executed by bank reconciliation"
      });
    }
    return { refund_id: ref.id, status: "RECONCILIATION_REQUIRED" };
  }

  /**
   * ETL Migration: Migrate V3.0 JSONB state into the 27-table V4.0 Relational Schema (T-10, T-19)
   * 100% Idempotent: Running twice on the same v3State will NOT duplicate rows or throw PK/UNIQUE errors.
   */
  async migrateV3StateToV4(v3State = {}) {
    return this.withTransaction(async (t) => {
      let migratedBookings = 0;
      let migratedPayments = 0;
      let migratedRefunds = 0;
      let skippedDuplicateBookings = 0;

      const defaultDest = t.destinations[0];
      const defaultHotel = t.hotels[0];
      const defaultFlight = t.flights[0];

      const mapLegacyStatus = (rawStatus, paidAmt, expectedAmt, isRevealed) => {
        const norm = String(rawStatus || "").trim().toUpperCase();
        if (isRevealed) return "REVEALED";
        if (norm === "CONFIRMED" || norm === "PAID") {
          return paidAmt > expectedAmt ? "OVERPAID" : "PAID";
        }
        if (norm === "LOCKED" || norm === "PENDING_PAYMENT" || !norm) {
          return paidAmt > 0 && paidAmt < expectedAmt ? "UNDERPAID" : "PENDING_PAYMENT";
        }
        if (VALID_BOOKING_TRANSITIONS[norm]) return norm;
        return paidAmt >= expectedAmt && expectedAmt > 0 ? "PAID" : "PENDING_PAYMENT";
      };

      for (const v3Bk of v3State.bookings || []) {
        const bookingCode = String(v3Bk.bookingCode || "").trim().toUpperCase();
        if (!bookingCode) continue;

        // Idempotency guard: if this booking_code was already migrated, reuse existing records
        let bkRow = t.bookings.find(b => b.booking_code === bookingCode);
        let paymentRow = bkRow ? t.payments.find(p => p.booking_id === bkRow.id) : null;
        let profile = null;

        const rawEmail = String(v3Bk.ownerEmail || v3Bk.customerEmail || "").trim().toLowerCase();
        // Remap legacy guest@wandermatch.vn to an isolated unclaimed legacy profile email
        const safeEmail =
          !rawEmail || rawEmail === "guest@wandermatch.vn"
            ? `legacy.migrated.${bookingCode.toLowerCase()}@wandermatch.invalid`
            : rawEmail;

        profile = t.profiles.find(p => p.email === safeEmail);
        if (!profile) {
          profile = {
            id: crypto.randomUUID(),
            email: safeEmail,
            full_name: v3Bk.customerName || "Legacy Migrated Traveler",
            phone: v3Bk.customerPhone || null,
            loyalty_tier: "BRONZE",
            loyalty_points: 0,
            created_at: v3Bk.createdAt || new Date().toISOString(),
            updated_at: new Date().toISOString()
          };
          t.profiles.push(profile);
          t.user_roles.push({
            id: crypto.randomUUID(),
            user_id: profile.id,
            role: "traveler",
            is_active: true,
            granted_by: null,
            granted_at: new Date().toISOString()
          });
        }

        const groupSize = Math.max(1, Number(v3Bk.groupSize || 1));
        const expectedAmount = Number(
          v3Bk.expectedAmount ?? v3Bk.packageCost ?? v3Bk.budgetPaid ?? 5000000
        );
        const paidAmount = Number(
          v3Bk.paidAmount ??
            (["PAID", "CONFIRMED", "REVEALED"].includes(String(v3Bk.status || "").toUpperCase())
              ? expectedAmount
              : 0)
        );
        const unitPrice = Math.round(expectedAmount / groupSize);

        if (!bkRow) {
          const sessId = crypto.randomUUID();
          t.recommendation_sessions.push({
            id: sessId,
            user_id: profile.id,
            origin_airport: "SGN",
            budget_per_person_vnd: Math.max(1000000, unitPrice),
            group_size: groupSize,
            departure_date: "2026-11-15",
            duration_days: 3,
            trip_purpose: "LEGACY_MIGRATED",
            vec_healing: 80,
            vec_nature: 80,
            vec_solitude: 80,
            vec_comfort: 80,
            vec_culture: 80,
            blacklisted_city_slugs: [],
            comfort_locks: {},
            ai_archetype_label: "Legacy Traveler",
            created_at: v3Bk.createdAt || new Date().toISOString()
          });

          const pkgId = crypto.randomUUID();
          t.packages.push({
            id: pkgId,
            session_id: sessId,
            user_id: profile.id,
            rank_order: 1,
            is_top_pick: true,
            secret_destination_id: defaultDest.id,
            secret_hotel_id: defaultHotel.id,
            secret_flight_id: defaultFlight.id,
            blind_code_alias: "LEGACY-MYSTERY-01",
            climate_bucket_id: defaultDest.climate_bucket_id,
            climate_zone_label: defaultDest.climate_zone_label,
            temp_range_label: defaultDest.temp_range_label,
            anonymized_hint: "Gói du lịch chuyển đổi từ phiên bản V3.0.",
            packing_checklist: [],
            hotel_star_tier: 5,
            vibe_tier_alias: "Boutique Sanctuary & Spa",
            flight_time_band: "MORNING",
            mood_illustration_key: "MOOD_COOL_MIST_HIGHLAND",
            display_price_band_vnd: "5.000.000đ - 5.500.000đ",
            k_anonymity_count: 3,
            group_size: groupSize,
            unit_price_vnd: unitPrice,
            expected_amount_vnd: expectedAmount,
            retail_value_vnd: Math.round(expectedAmount * 1.25),
            net_cost_vnd: Math.round(expectedAmount * 0.8),
            similarity_score: 90,
            total_score: 90,
            score_breakdown: {},
            status: "LOCKED_IN_BOOKING",
            expires_at: new Date(Date.now() + 3600000).toISOString(),
            created_at: v3Bk.createdAt || new Date().toISOString()
          });

          const bkId = crypto.randomUUID();
          const mappedStatus = mapLegacyStatus(
            v3Bk.status,
            paidAmount,
            expectedAmount,
            Boolean(v3Bk.isRevealed)
          );
          bkRow = {
            id: bkId,
            booking_code: bookingCode,
            is_legacy_migrated: true,
            user_id: profile.id,
            package_id: pkgId,
            group_size: groupSize,
            expected_amount_vnd: expectedAmount,
            paid_amount_vnd: paidAmount,
            amount_due_vnd: Math.max(0, expectedAmount - paidAmount),
            overpaid_amount_vnd: Math.max(0, paidAmount - expectedAmount),
            status: mappedStatus,
            is_revealed: Boolean(v3Bk.isRevealed),
            revealed_at: v3Bk.revealedAt || (v3Bk.isRevealed ? new Date().toISOString() : null),
            departure_date: "2026-11-15",
            return_date: "2026-11-18",
            hold_expires_at: v3Bk.holdExpiresAt || new Date(Date.now() + 1800000).toISOString(),
            created_at: v3Bk.createdAt || new Date().toISOString(),
            updated_at: new Date().toISOString()
          };
          this._enforceBookingTriggers(null, bkRow, t);
          t.bookings.push(bkRow);
          migratedBookings++;

          const payId = crypto.randomUUID();
          paymentRow = {
            id: payId,
            booking_id: bkId,
            expected_amount_vnd: expectedAmount,
            paid_amount_vnd: paidAmount,
            refunded_amount_vnd: 0,
            payment_status:
              paidAmount === 0
                ? "UNPAID"
                : paidAmount < expectedAmount
                ? "UNDERPAID"
                : paidAmount === expectedAmount
                ? "PAID"
                : "OVERPAID",
            last_transaction_at: new Date().toISOString(),
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          };
          t.payments.push(paymentRow);
        } else {
          skippedDuplicateBookings++;
        }

        // Migrate associated V3 payments idempotently
        const matchingV3Payments = (v3State.payments || []).filter(
          p => String(p.bookingCode).toUpperCase() === bkRow.booking_code
        );
        let migratedInflowSum = 0;
        for (const p of matchingV3Payments) {
          const extTxId = String(p.transactionId);
          const alreadyExists = t.payment_transactions.some(
            tx => tx.payment_provider === "SEPAY" && tx.external_transaction_id === extTxId
          );
          migratedInflowSum += Number(p.amount || 0);
          if (!alreadyExists) {
            t.payment_transactions.push({
              id: crypto.randomUUID(),
              payment_id: paymentRow.id,
              booking_id: bkRow.id,
              webhook_event_id: null,
              payment_provider: "SEPAY",
              external_transaction_id: extTxId,
              amount_vnd: Number(p.amount),
              direction: "INFLOW",
              bank_code: "MB",
              transfer_content: `Migrated ${bkRow.booking_code}`,
              created_at: p.verifiedAt || new Date().toISOString()
            });
            migratedPayments++;
          }
        }

        // Synthesize Opening Balance INFLOW transaction if a legacy paid booking lacks payment rows
        if (paidAmount > migratedInflowSum) {
          const openingDelta = paidAmount - migratedInflowSum;
          const openingTxId = `MIG-OPENING-${bkRow.booking_code}`;
          const hasOpeningTx = t.payment_transactions.some(
            tx => tx.payment_provider === "SEPAY" && tx.external_transaction_id === openingTxId
          );
          if (!hasOpeningTx) {
            t.payment_transactions.push({
              id: crypto.randomUUID(),
              payment_id: paymentRow.id,
              booking_id: bkRow.id,
              webhook_event_id: null,
              payment_provider: "SEPAY",
              external_transaction_id: openingTxId,
              amount_vnd: openingDelta,
              direction: "INFLOW",
              bank_code: "MB",
              transfer_content: `Opening balance migration ${bkRow.booking_code}`,
              created_at: v3Bk.createdAt || new Date().toISOString()
            });
            migratedPayments++;
          }
        }

        // Migrate associated V3 refunds idempotently
        const matchingV3Refunds = (v3State.refunds || []).filter(
          r => String(r.bookingCode).toUpperCase() === bkRow.booking_code
        );
        for (const r of matchingV3Refunds) {
          const idemKey = `MIG-REF-${r.refundId}`;
          if (t.refunds.some(existingRef => existingRef.idempotency_key === idemKey)) {
            continue;
          }
          const refAmt = Number(r.refundAmount || 0);
          const feeAmt = Number(r.penaltyFee ?? Math.max(0, paidAmount - refAmt));
          t.refunds.push({
            id: crypto.randomUUID(),
            booking_id: bkRow.id,
            payment_id: paymentRow.id,
            requested_by: profile.id,
            reviewed_by: null,
            idempotency_key: idemKey,
            tier_applied: "EARLY_72H",
            paid_snapshot_vnd: paidAmount,
            cancellation_fee_vnd: feeAmt,
            partner_comp_vnd: 0,
            refund_amount_vnd: refAmt,
            reason: "Legacy migrated refund",
            evidence_url: null,
            status: "SUCCEEDED",
            payout_bank_ref: String(r.refundId),
            failure_reason: null,
            requested_at: r.processedAt || new Date().toISOString(),
            reviewed_at: r.processedAt || new Date().toISOString(),
            processed_at: r.processedAt || new Date().toISOString(),
            created_at: r.processedAt || new Date().toISOString(),
            updated_at: new Date().toISOString()
          });
          paymentRow.refunded_amount_vnd += refAmt;
          paymentRow.payment_status =
            paymentRow.refunded_amount_vnd >= paymentRow.paid_amount_vnd
              ? "REFUNDED"
              : "PARTIALLY_REFUNDED";
          migratedRefunds++;
        }
      }

      return {
        migrated_bookings: migratedBookings,
        migrated_payments: migratedPayments,
        migrated_refunds: migratedRefunds,
        skipped_duplicate_bookings: skippedDuplicateBookings
      };
    });
  }

  /**
   * 7 Gatekeeper Reconciliation Queries (Recon #1 - Recon #7)
   */
  async rpcRunReconciliationChecks(v3Snapshot = null) {
    const t = this.tables;

    // Recon #1: Orphan bookings & V3 count comparison
    let recon1 = t.bookings.filter(b => !t.payments.some(p => p.booking_id === b.id)).length;
    if (v3Snapshot && Array.isArray(v3Snapshot.bookings)) {
      recon1 += Math.abs(v3Snapshot.bookings.length - t.bookings.filter(b => b.is_legacy_migrated).length);
    }

    // Recon #2: Expected and paid amount match between bookings, payments, and V3 snapshot
    let recon2 = 0;
    for (const b of t.bookings) {
      const p = t.payments.find(pay => pay.booking_id === b.id);
      if (!p || b.expected_amount_vnd !== p.expected_amount_vnd || b.paid_amount_vnd !== p.paid_amount_vnd) {
        recon2++;
      }
    }
    if (v3Snapshot && Array.isArray(v3Snapshot.bookings)) {
      const v3ExpectedSum = v3Snapshot.bookings.reduce((s, b) => s + Number(b.expectedAmount || 0), 0);
      const v3PaidSum = v3Snapshot.bookings.reduce((s, b) => s + Number(b.paidAmount || 0), 0);
      const v4MigratedExpectedSum = t.bookings
        .filter(b => b.is_legacy_migrated)
        .reduce((s, b) => s + Number(b.expected_amount_vnd), 0);
      const v4MigratedPaidSum = t.bookings
        .filter(b => b.is_legacy_migrated)
        .reduce((s, b) => s + Number(b.paid_amount_vnd), 0);
      if (v3ExpectedSum !== v4MigratedExpectedSum || v3PaidSum !== v4MigratedPaidSum) {
        recon2 += 1;
      }
    }

    // Recon #3: Sum of INFLOW transactions == bookings.paid_amount_vnd & zero orphan transactions
    let recon3 = 0;
    for (const tx of t.payment_transactions) {
      if (!t.bookings.some(b => b.id === tx.booking_id)) recon3++;
    }
    for (const b of t.bookings) {
      const txInflowSum = t.payment_transactions
        .filter(tx => tx.booking_id === b.id && tx.direction === "INFLOW")
        .reduce((s, tx) => s + Number(tx.amount_vnd), 0);
      if (b.paid_amount_vnd !== txInflowSum) recon3++;
    }

    // Recon #4: Inventory holds conservation invariant
    let recon4 = 0;
    for (const pi of t.partner_inventories) {
      const activeHeldQty = t.inventory_holds
        .filter(h => h.inventory_id === pi.id && ["HELD", "COMMITTED"].includes(h.hold_status))
        .reduce((s, h) => s + Number(h.quantity), 0);
      if (
        pi.reserved_slots !== activeHeldQty ||
        pi.available_slots < 0 ||
        pi.available_slots + pi.reserved_slots > pi.total_slots
      ) {
        recon4++;
      }
    }

    // Recon #5: Succeeded refunds sum == payments.refunded_amount_vnd
    let recon5 = 0;
    for (const p of t.payments) {
      const succeededRefundSum = t.refunds
        .filter(r => r.payment_id === p.id && r.status === "SUCCEEDED")
        .reduce((s, r) => s + Number(r.refund_amount_vnd), 0);
      if (p.refunded_amount_vnd !== succeededRefundSum) recon5++;
    }

    // Recon #6: Zero unprocessed webhook events in inbox
    const recon6 = t.payment_webhook_events.filter(e =>
      ["RECEIVED", "QUEUED_DURING_CUTOVER"].includes(e.processing_status)
    ).length;

    // Recon #7: Cross-table user_id consistency & zero active guest@wandermatch.vn
    let recon7 = 0;
    for (const b of t.bookings) {
      const pkg = t.packages.find(p => p.id === b.package_id);
      const sess = pkg ? t.recommendation_sessions.find(s => s.id === pkg.session_id) : null;
      const prof = t.profiles.find(pr => pr.id === b.user_id);
      if (
        !pkg ||
        !sess ||
        !prof ||
        b.user_id !== pkg.user_id ||
        pkg.user_id !== sess.user_id ||
        prof.email.toLowerCase() === "guest@wandermatch.vn"
      ) {
        recon7++;
      }
    }

    const totalDiscrepancy = recon1 + recon2 + recon3 + recon4 + recon5 + recon6 + recon7;

    return {
      recon_1_orphan_bookings: recon1,
      recon_2_amount_mismatch: recon2,
      recon_3_orphan_tx: recon3,
      recon_4_inventory_mismatch: recon4,
      recon_5_refund_mismatch: recon5,
      recon_6_unprocessed_webhooks: recon6,
      recon_7_ownership_mismatch: recon7,
      total_discrepancy: totalDiscrepancy
    };
  }

  /**
   * RPC #13: reconcile_external_settlement_v4 (Recon #8 — External Payment Gateway Settlement vs DB)
   */
  async rpcReconcileExternalSettlement(settlementRecords = []) {
    const records = Array.isArray(settlementRecords) ? settlementRecords : [];
    const t = this.tables;
    const discrepancies = [];

    let missingInDb = 0;
    let missingAtProvider = 0;
    let amountMismatch = 0;

    // 1. Check each provider settlement record against payment_transactions
    for (const sr of records) {
      const provider = String(sr.payment_provider || sr.provider || "SEPAY").toUpperCase();
      const extTxId = String(sr.external_transaction_id || "").trim();
      const settledAmt = Number(sr.amount_vnd || 0);
      const direction = String(sr.direction || "INFLOW").toUpperCase();

      const dbTx = t.payment_transactions.find(
        tx => tx.payment_provider === provider && tx.external_transaction_id === extTxId
      );

      if (!dbTx) {
        missingInDb++;
        discrepancies.push({
          discrepancy_type: "MISSING_IN_DB",
          provider,
          external_transaction_id: extTxId,
          settled_amount_vnd: settledAmt,
          db_amount_vnd: 0,
          direction,
          booking_code: sr.booking_code || null
        });
      } else if (Number(dbTx.amount_vnd) !== settledAmt || dbTx.direction !== direction) {
        amountMismatch++;
        const bk = t.bookings.find(b => b.id === dbTx.booking_id);
        discrepancies.push({
          discrepancy_type: "AMOUNT_MISMATCH",
          provider,
          external_transaction_id: extTxId,
          settled_amount_vnd: settledAmt,
          db_amount_vnd: Number(dbTx.amount_vnd),
          direction,
          booking_code: bk ? bk.booking_code : sr.booking_code || null
        });
      }
    }

    // 2. Check DB transactions for any scoped provider that are missing in the provider settlement batch
    const scopedProviders = new Set(records.map(r => String(r.payment_provider || r.provider || "SEPAY").toUpperCase()));
    if (scopedProviders.size > 0) {
      for (const dbTx of t.payment_transactions) {
        if (!scopedProviders.has(dbTx.payment_provider)) continue;
        const inSettlement = records.some(
          sr =>
            String(sr.payment_provider || sr.provider || "SEPAY").toUpperCase() === dbTx.payment_provider &&
            String(sr.external_transaction_id || "").trim() === dbTx.external_transaction_id
        );
        if (!inSettlement) {
          missingAtProvider++;
          const bk = t.bookings.find(b => b.id === dbTx.booking_id);
          discrepancies.push({
            discrepancy_type: "MISSING_AT_PROVIDER",
            provider: dbTx.payment_provider,
            external_transaction_id: dbTx.external_transaction_id,
            settled_amount_vnd: 0,
            db_amount_vnd: Number(dbTx.amount_vnd),
            direction: dbTx.direction,
            booking_code: bk ? bk.booking_code : null
          });
        }
      }
    }

    return {
      statement_count: records.length,
      missing_in_db_count: missingInDb,
      missing_at_provider_count: missingAtProvider,
      amount_mismatch_count: amountMismatch,
      total_settlement_discrepancy: missingInDb + missingAtProvider + amountMismatch,
      discrepancies
    };
  }
}

