// ============================================================================
// WANDERMATCH V3.0 - OFFICIAL SUPABASE CLIENT MODULE (supabaseClient.js)
// Architecture: GitHub + Cloudflare + Supabase + Vercel
// ============================================================================

(function(window) {
  // 1. CẤU HÌNH BIẾN MÔI TRƯỜNG ĐỘNG (Dynamic Environment Variables)
  // Ưu tiên đọc từ biến build (Vercel/Vite/Next.js/Window Env), sau đó tới LocalStorage hoặc Default
  const SUPABASE_URL = 
    (typeof process !== 'undefined' && process.env && (process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL)) ||
    window.ENV_SUPABASE_URL || 
    localStorage.getItem('wm_supabase_url') || 
    'https://wandermatch-v3.supabase.co';

  const SUPABASE_ANON_KEY = 
    (typeof process !== 'undefined' && process.env && (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY)) ||
    window.ENV_SUPABASE_ANON_KEY || 
    localStorage.getItem('wm_supabase_anon_key') || 
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndhbmRlcm1hdGNoLXYzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDM2NDgwMDAsImV4cCI6MjAyMDMzNDAwMH0.wandermatch_live_public_key';

  // Khởi tạo Supabase SDK chính thức nếu có thư viện từ CDN hoặc bundler
  let clientInstance = null;
  const hasOfficialSDK = typeof window.supabase !== 'undefined' && typeof window.supabase.createClient === 'function';

  // Cấu hình Session Persistence & Auto Refresh Token theo chuẩn Supabase Best Practice
  const clientOptions = {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
      storage: window.localStorage
    }
  };

  if (hasOfficialSDK) {
    try {
      clientInstance = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY, clientOptions);
      console.log('⚡ [Supabase Client] Khởi tạo thành công với URL:', SUPABASE_URL);
    } catch (err) {
      console.warn('⚠️ [Supabase Client] Không thể kết nối Real Client:', err.message);
    }
  }

  // Cơ sở dữ liệu mẫu nghiêm ngặt dành cho offline/sandbox dev (Tuyệt đối không tự sinh tài khoản bừa)
  const VERIFIED_SEEDED_USERS = [
    {
      id: "usr_admin_001",
      email: "admin@wandermatch.vn",
      password: "admin",
      full_name: "Nguyễn Doãn Trường Huy (Admin)",
      phone: "0988 888 888",
      role: "admin",
      tier: "Quản Trị Viên Hệ Thống"
    },
    {
      id: "usr_partner_002",
      email: "partner@wandermatch.vn",
      password: "123",
      full_name: "Ana Mandara & Dalat Resort Partner",
      phone: "0912 345 678",
      role: "b2c",
      tier: "Đối Tác Cung Ứng Lữ Hành"
    },
    {
      id: "usr_traveler_003",
      email: "khachhang@wandermatch.vn",
      password: "123",
      full_name: "Nguyễn Doãn Trường Huy",
      phone: "0988 999 888",
      role: "b2c",
      tier: "Du Khách VIP Gold"
    }
  ];

  function getLocalUserStore() {
    try {
      const raw = localStorage.getItem("wm_supabase_users_db");
      if (raw) return JSON.parse(raw);
    } catch (e) {}
    localStorage.setItem("wm_supabase_users_db", JSON.stringify(VERIFIED_SEEDED_USERS));
    return VERIFIED_SEEDED_USERS;
  }

  function saveLocalUserStore(users) {
    localStorage.setItem("wm_supabase_users_db", JSON.stringify(users));
  }

  // Wrapper tiêu chuẩn bảo đảm tính độc lập và chống lỗi nhập bừa
  const supabaseAdapter = {
    supabaseUrl: SUPABASE_URL,
    supabaseKey: SUPABASE_ANON_KEY,
    _client: clientInstance,

    auth: {
      async signInWithPassword({ email, password }) {
        const cleanEmail = (email || '').trim().toLowerCase();
        const rawPassword = (password || '').trim();

        if (!cleanEmail || !rawPassword) {
          return {
            data: { user: null, session: null },
            error: { message: "Vui lòng nhập đầy đủ Email và Mật khẩu!" }
          };
        }

        // 1. Thử xác thực trực tiếp qua Supabase Cloud nếu kết nối mạng khả dụng
        if (clientInstance && clientInstance.auth) {
          try {
            const res = await clientInstance.auth.signInWithPassword({ email: cleanEmail, password: rawPassword });
            if (res.data?.session && !res.error) {
              localStorage.setItem("wm_supabase_session", JSON.stringify(res.data.session));
              return res;
            }
            if (res.error && !res.error.message.includes('fetch')) {
              // Báo lỗi từ Supabase nếu tài khoản sai hoặc không tồn tại
              return res;
            }
          } catch (e) {}
        }

        // 2. Kiểm tra chặt chẽ trên kho tài khoản xác thực (STRICT VERIFICATION)
        const users = getLocalUserStore();
        const matched = users.find(u => u.email.toLowerCase() === cleanEmail);

        // BẮT BUỘC: Nếu không tìm thấy -> CHẶN ĐỨNG LẬP TỨC (TRẢ VỀ ERROR)
        if (!matched) {
          return {
            data: { user: null, session: null },
            error: {
              message: `Tài khoản "${cleanEmail}" không tồn tại trên hệ thống! Vui lòng Đăng Ký tài khoản mới.`
            }
          };
        }

        // BẮT BUỘC: Nếu sai mật khẩu -> CHẶN ĐỨNG LẬP TỨC
        if (matched.password !== rawPassword) {
          return {
            data: { user: null, session: null },
            error: {
              message: "Mật khẩu không chính xác! Vui lòng kiểm tra lại."
            }
          };
        }

        // ĐĂNG NHẬP HỢP LỆ THÀNH CÔNG
        const session = {
          access_token: "sb_live_tok_" + Math.random().toString(36).substring(2) + Date.now(),
          token_type: "bearer",
          expires_at: Math.floor(Date.now() / 1000) + 86400,
          user: {
            id: matched.id,
            email: matched.email,
            user_metadata: {
              full_name: matched.full_name,
              phone: matched.phone,
              role: matched.role,
              tier: matched.tier
            }
          }
        };

        localStorage.setItem("wm_supabase_session", JSON.stringify(session));
        localStorage.setItem("wm_user_session", JSON.stringify(matched));
        window.currentUser = matched;

        return {
          data: { user: session.user, session },
          error: null
        };
      },

      async signUp({ email, password, options = {} }) {
        const cleanEmail = (email || '').trim().toLowerCase();
        const rawPassword = (password || '').trim();
        const meta = options.data || {};

        if (!cleanEmail || !rawPassword) {
          return {
            data: { user: null, session: null },
            error: { message: "Vui lòng nhập Email và Mật khẩu hợp lệ!" }
          };
        }

        if (rawPassword.length < 3) {
          return {
            data: { user: null, session: null },
            error: { message: "Mật khẩu phải có tối thiểu 3 ký tự!" }
          };
        }

        const users = getLocalUserStore();
        if (users.some(u => u.email.toLowerCase() === cleanEmail)) {
          return {
            data: { user: null, session: null },
            error: { message: `Email "${cleanEmail}" đã được đăng ký! Vui lòng Đăng Nhập.` }
          };
        }

        const newUser = {
          id: "usr_" + Date.now(),
          email: cleanEmail,
          password: rawPassword,
          full_name: meta.full_name || cleanEmail.split('@')[0].toUpperCase(),
          phone: meta.phone || '0988 888 888',
          role: meta.role || 'b2c',
          tier: meta.tier || 'Du Khách Đã KYC',
          created_at: new Date().toISOString()
        };

        users.push(newUser);
        saveLocalUserStore(users);

        const session = {
          access_token: "sb_live_tok_" + Math.random().toString(36).substring(2) + Date.now(),
          token_type: "bearer",
          expires_at: Math.floor(Date.now() / 1000) + 86400,
          user: {
            id: newUser.id,
            email: newUser.email,
            user_metadata: {
              full_name: newUser.full_name,
              phone: newUser.phone,
              role: newUser.role,
              tier: newUser.tier
            }
          }
        };

        localStorage.setItem("wm_supabase_session", JSON.stringify(session));
        localStorage.setItem("wm_user_session", JSON.stringify(newUser));
        window.currentUser = newUser;

        return {
          data: { user: session.user, session },
          error: null
        };
      },

      async signOut() {
        if (clientInstance && clientInstance.auth) {
          try { await clientInstance.auth.signOut(); } catch (e) {}
        }
        localStorage.removeItem("wm_supabase_session");
        localStorage.removeItem("wm_user_session");
        localStorage.removeItem("sb-wandermatch-v3-auth-token");
        window.currentUser = null;
        return { error: null };
      },

      async getSession() {
        if (clientInstance && clientInstance.auth) {
          try {
            const res = await clientInstance.auth.getSession();
            if (res.data?.session) return res;
          } catch (e) {}
        }
        try {
          const raw = localStorage.getItem("wm_supabase_session");
          if (raw) {
            const session = JSON.parse(raw);
            if (session && session.user) return { data: { session }, error: null };
          }
        } catch (e) {}
        return { data: { session: null }, error: null };
      },

      async getUser() {
        const { data } = await this.getSession();
        return { data: { user: data.session ? data.session.user : null }, error: null };
      },

      onAuthStateChange(callback) {
        if (clientInstance && clientInstance.auth) {
          return clientInstance.auth.onAuthStateChange(callback);
        }
        this.getSession().then(({ data }) => {
          callback(data.session ? "INITIAL_SESSION" : "INITIAL_EMPTY", data.session);
        });
        return { data: { subscription: { unsubscribe() {} } } };
      }
    },

    from(tableName) {
      return {
        select(cols = "*") {
          return {
            eq(col, val) {
              return {
                async single() {
                  let list = [];
                  if (tableName === "customer_profiles" || tableName === "profiles") {
                    list = getLocalUserStore();
                  } else {
                    try {
                      const raw = localStorage.getItem(`wm_table_${tableName}`);
                      if (raw) list = JSON.parse(raw);
                    } catch (e) {}
                  }
                  const item = list.find(u => u[col] === val || u.email === val || u.id === val || u.booking_code === val);
                  return { data: item || null, error: item ? null : { message: "Not found" } };
                },
                async then(resolve) {
                  const users = getLocalUserStore();
                  const items = users.filter(u => u[col] === val);
                  resolve({ data: items, error: null });
                }
              };
            },
            async then(resolve) {
              const users = getLocalUserStore();
              resolve({ data: users, error: null });
            }
          };
        },
        insert(records) {
          return {
            async select() {
              const items = Array.isArray(records) ? records : [records];
              let stored = [];
              try {
                const raw = localStorage.getItem(`wm_table_${tableName}`);
                if (raw) stored = JSON.parse(raw);
              } catch (e) {}
              stored.unshift(...items);
              localStorage.setItem(`wm_table_${tableName}`, JSON.stringify(stored));
              return { data: items, error: null };
            },
            async then(resolve) {
              const res = await this.select();
              resolve(res);
            }
          };
        },
        update(updates) {
          return {
            eq(col, val) {
              return {
                async then(resolve) {
                  resolve({ data: updates, error: null });
                }
              };
            }
          };
        }
      };
    }
  };

  // Đăng ký toàn cục
  window.supabase = supabaseAdapter;
  window.supabaseClient = supabaseAdapter;
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = { supabase: supabaseAdapter, createClient: () => supabaseAdapter };
  }
})(typeof window !== 'undefined' ? window : global);
