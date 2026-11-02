// ============================================================================
// WANDERMATCH V3.0 (PHASE 1.5 SECURITY HOTFIX) - SUPABASE CLIENT MODULE
// Architecture: GitHub + Cloudflare + Supabase + Vercel
// Hardened: No plaintext seeded passwords, no local mock auth bypass,
// delegates authentication to real Supabase SDK or Backend JWT Auth (/api/auth/*)
// ============================================================================

(function(window) {
  const SUPABASE_URL =
    (typeof process !== 'undefined' && process.env && (process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL)) ||
    window.ENV_SUPABASE_URL ||
    localStorage.getItem('wm_supabase_url') ||
    '';

  const SUPABASE_ANON_KEY =
    (typeof process !== 'undefined' && process.env && (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY)) ||
    window.ENV_SUPABASE_ANON_KEY ||
    localStorage.getItem('wm_supabase_anon_key') ||
    '';

  function getApiBase() {
    if (typeof window !== 'undefined' && window.API_BASE) return window.API_BASE;
    if (typeof window !== 'undefined' && (window.location?.port === '3000' || window.location?.port === '5500')) {
      return 'http://127.0.0.1:8787';
    }
    return (typeof window !== 'undefined' && window.location?.origin) ? window.location.origin : 'http://127.0.0.1:8787';
  }

  let clientInstance = null;
  const hasOfficialSDK =
    typeof window.supabase !== 'undefined' &&
    typeof window.supabase.createClient === 'function' &&
    Boolean(SUPABASE_URL) &&
    Boolean(SUPABASE_ANON_KEY) &&
    !SUPABASE_URL.includes('wandermatch-v3.supabase.co');

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

  const authSubscribers = new Set();
  function notifyAuthSubscribers(event, session) {
    authSubscribers.forEach(cb => {
      try {
        if (typeof cb === 'function') cb(event, session);
      } catch (e) {
        console.error('Auth subscriber error:', e);
      }
    });
  }

  const supabaseAdapter = {
    supabaseUrl: SUPABASE_URL,
    supabaseKey: SUPABASE_ANON_KEY,
    _client: clientInstance,

    auth: {
      async signInWithPassword({ email, password }) {
        const cleanInput = (email || '').trim().toLowerCase();
        const rawPassword = (password || '').trim();

        if (!cleanInput || !rawPassword) {
          return {
            data: { user: null, session: null },
            error: { message: 'Vui lòng nhập đầy đủ Email và Mật khẩu!' }
          };
        }

        // 1. Real Supabase Cloud Auth if configured
        if (clientInstance && clientInstance.auth && cleanInput.includes('@')) {
          try {
            const res = await clientInstance.auth.signInWithPassword({ email: cleanInput, password: rawPassword });
            if (res.data?.session && !res.error) {
              localStorage.setItem('wm_supabase_session', JSON.stringify(res.data.session));
              notifyAuthSubscribers('SIGNED_IN', res.data.session);
              return res;
            }
            if (res.error && !res.error.message.includes('fetch')) {
              return res;
            }
          } catch (e) {}
        }

        // 2. Authoritative Backend API Verification (PBKDF2 + Signed JWT)
        try {
          const response = await fetch(`${getApiBase()}/api/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: cleanInput, password: rawPassword })
          });
          const payload = await response.json().catch(() => ({}));
          if (!response.ok || !payload.success || !payload.token) {
            return {
              data: { user: null, session: null },
              error: { message: payload.error || 'Email hoặc mật khẩu không chính xác!' }
            };
          }

          const u = payload.user;
          const session = {
            access_token: payload.token,
            token_type: 'bearer',
            expires_at: Math.floor(Date.now() / 1000) + 7 * 86400,
            user: {
              id: u.email,
              email: u.email,
              user_metadata: {
                full_name: u.name,
                role: u.role || 'b2c'
              }
            }
          };

          localStorage.setItem('wm_supabase_session', JSON.stringify(session));
          notifyAuthSubscribers('SIGNED_IN', session);
          return {
            data: { user: session.user, session },
            error: null
          };
        } catch (err) {
          return {
            data: { user: null, session: null },
            error: { message: 'Không thể kết nối máy chủ xác thực. Vui lòng thử lại!' }
          };
        }
      },

      async signUp({ email, password, options = {} }) {
        const cleanEmail = (email || '').trim().toLowerCase();
        const rawPassword = (password || '').trim();
        const meta = options.data || {};

        if (!cleanEmail || !rawPassword) {
          return {
            data: { user: null, session: null },
            error: { message: 'Vui lòng nhập Email và Mật khẩu hợp lệ!' }
          };
        }

        if (rawPassword.length < 6) {
          return {
            data: { user: null, session: null },
            error: { message: 'Mật khẩu phải có tối thiểu 6 ký tự!' }
          };
        }

        if (clientInstance && clientInstance.auth) {
          try {
            const res = await clientInstance.auth.signUp({ email: cleanEmail, password: rawPassword, options });
            if (res.data?.user && !res.error) {
              return res;
            }
          } catch (e) {}
        }

        try {
          const response = await fetch(`${getApiBase()}/api/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              email: cleanEmail,
              password: rawPassword,
              name: meta.full_name || cleanEmail.split('@')[0]
            })
          });
          const payload = await response.json().catch(() => ({}));
          if (!response.ok || !payload.success || !payload.token) {
            return {
              data: { user: null, session: null },
              error: { message: payload.error || 'Đăng ký tài khoản thất bại!' }
            };
          }

          const u = payload.user;
          const session = {
            access_token: payload.token,
            token_type: 'bearer',
            expires_at: Math.floor(Date.now() / 1000) + 7 * 86400,
            user: {
              id: u.email,
              email: u.email,
              user_metadata: {
                full_name: u.name,
                role: u.role || 'b2c'
              }
            }
          };

          return {
            data: { user: session.user, session },
            error: null
          };
        } catch (err) {
          return {
            data: { user: null, session: null },
            error: { message: 'Không thể kết nối máy chủ đăng ký. Vui lòng thử lại!' }
          };
        }
      },

      async signInWithOAuth({ provider, options = {} }) {
        if (!provider) {
          return { data: null, error: { message: 'Vui lòng chọn nhà cung cấp OAuth (google hoặc facebook)!' } };
        }
        const cleanProvider = String(provider).toLowerCase();
        const redirectTo = (options && options.redirectTo) || (typeof window !== 'undefined' && window.location && window.location.origin) || 'http://localhost:3000';

        if (clientInstance && clientInstance.auth && typeof clientInstance.auth.signInWithOAuth === 'function') {
          try {
            const res = await clientInstance.auth.signInWithOAuth({ provider: cleanProvider, options: { redirectTo } });
            if (res && !res.error && res.data?.url) {
              if (typeof window !== 'undefined' && window.location) {
                window.location.href = res.data.url;
              }
              return res;
            }
          } catch (e) {
            console.warn('Supabase SDK OAuth error:', e);
          }
        }

        if (SUPABASE_URL && !SUPABASE_URL.includes('wandermatch-v3.supabase.co')) {
          const authUrl = `${SUPABASE_URL}/auth/v1/authorize?provider=${cleanProvider}&redirect_to=${encodeURIComponent(redirectTo)}`;
          if (typeof window !== 'undefined' && window.location) {
            window.location.href = authUrl;
          }
          return { data: { provider: cleanProvider, url: authUrl }, error: null };
        }

        return {
          data: null,
          error: { message: 'Nhà cung cấp OAuth chưa được cấu hình trên môi trường này.' }
        };
      },

      async signOut() {
        if (clientInstance && clientInstance.auth) {
          try { await clientInstance.auth.signOut(); } catch (e) {}
        }
        localStorage.removeItem('wm_supabase_session');
        localStorage.removeItem('wm_user_session');
        localStorage.removeItem('sb-wandermatch-v3-auth-token');
        window.currentUser = null;
        notifyAuthSubscribers('SIGNED_OUT', null);
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
          const raw = localStorage.getItem('wm_supabase_session');
          if (raw) {
            const session = JSON.parse(raw);
            if (session && session.access_token && session.user) {
              const res = await fetch(`${getApiBase()}/api/auth/me`, {
                method: 'GET',
                headers: { Authorization: `Bearer ${session.access_token}` }
              });
              if (res.ok) {
                const body = await res.json().catch(() => ({}));
                if (body && body.success && body.user) {
                  session.user.user_metadata = {
                    ...(session.user.user_metadata || {}),
                    full_name: body.user.name,
                    role: body.user.role || 'b2c'
                  };
                  return { data: { session }, error: null };
                }
              }
              localStorage.removeItem('wm_supabase_session');
            }
          }
        } catch (e) {}
        return { data: { session: null }, error: null };
      },

      async getUser() {
        const { data } = await this.getSession();
        return { data: { user: data.session ? data.session.user : null }, error: null };
      },

      onAuthStateChange(callback) {
        if (typeof callback === 'function') {
          authSubscribers.add(callback);
          this.getSession().then(({ data }) => {
            try {
              callback(data.session ? 'INITIAL_SESSION' : 'INITIAL_EMPTY', data.session);
            } catch (e) {}
          });
        }
        return {
          data: {
            subscription: {
              unsubscribe() {
                authSubscribers.delete(callback);
              }
            }
          }
        };
      }
    }
  };

  window.supabase = supabaseAdapter;
  window.supabaseClient = supabaseAdapter;
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = { supabase: supabaseAdapter, createClient: () => supabaseAdapter };
  }
})(typeof window !== 'undefined' ? window : global);
