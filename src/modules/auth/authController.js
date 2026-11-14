// ============================================================================
// WANDERMATCH V4.2 — BACKEND AUTH MODULE CONTROLLER
// ============================================================================

import { requireAuthenticatedUser } from "../../middleware/authMiddleware.js";
import { invokePostgresRpc } from "../../services/supabase/postgresRpcClient.js";
import { deterministicUuidV4 } from "../../services/v4RelationalEngine.js";

export function createAuthDomainController({ authenticateRequest }) {
  return {
    async getCurrentSessionUser(request, env) {
      const authUser = await authenticateRequest(request, env);
      return requireAuthenticatedUser(authUser);
    }
  };
}

export async function handleGetAuthMeV4({ authUser }) {
  const user = requireAuthenticatedUser(authUser);
  return {
    success: true,
    user: {
      id: deterministicUuidV4(user.userId || user.email),
      email: user.email,
      name: user.name || "WanderMatch Traveler",
      role: user.role || (user.isAdmin ? "admin" : "user"),
      isAdmin: Boolean(user.isAdmin)
    }
  };
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i;

function isPostgresGotrueEnabled(env) {
  return Boolean(
    env &&
    env.SUPABASE_URL &&
    env.SUPABASE_ANON_KEY &&
    String(env.USE_V4_POSTGRES_RPC).toLowerCase() === "true"
  );
}

function isProductionEnv(env) {
  return String(env?.ENVIRONMENT || "").toLowerCase() === "production";
}

function buildAdminRoleCheck(email, env) {
  const adminEmails = String(env?.ADMIN_EMAILS || "")
    .split(",")
    .map(s => s.trim().toLowerCase())
    .filter(Boolean);
  return adminEmails.includes(String(email || "").trim().toLowerCase());
}

async function sha256Hex(input) {
  const bytes = new TextEncoder().encode(String(input || ""));
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return Array.from(new Uint8Array(digest))
    .map(b => b.toString(16).padStart(2, "0"))
    .join("");
}

async function verifyLocalJwtWithSecret(token, env) {
  const secret = env && (env.SESSION_SECRET || env.JWT_SECRET);
  if (!secret || !token || typeof token !== "string") return null;
  const parts = token.split(".");
  if (parts.length !== 3) return null;
  try {
    const enc = new TextEncoder();
    const unb64Url = (str) => {
      const norm = str.replace(/-/g, "+").replace(/_/g, "/");
      const pad = norm.length % 4 === 0 ? "" : "=".repeat(4 - (norm.length % 4));
      const bin = atob(norm + pad);
      return Uint8Array.from(bin, c => c.charCodeAt(0));
    };
    const key = await crypto.subtle.importKey(
      "raw",
      enc.encode(secret),
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["verify"]
    );
    const sigBytes = unb64Url(parts[2]);
    const ok = await crypto.subtle.verify("HMAC", key, sigBytes, enc.encode(`${parts[0]}.${parts[1]}`));
    if (!ok) return null;
    const claimsJson = new TextDecoder().decode(unb64Url(parts[1]));
    const claims = JSON.parse(claimsJson);
    if (claims.exp && Date.now() / 1000 > Number(claims.exp)) return null;
    return claims;
  } catch {
    return null;
  }
}

export async function handleRegisterV4({ request, env, v4db, handleLegacyAuth, corsHeaders }) {
  if (!isPostgresGotrueEnabled(env)) {
    return handleLegacyAuth(new URL("http://localhost/api/auth/register"), request, env, corsHeaders);
  }

  const body = await request.json().catch(() => ({}));
  const email = String(body.email || "").trim().toLowerCase();
  const password = String(body.password || "");
  const name = String(body.name || body.fullName || "WanderMatch Traveler").trim();

  if (!EMAIL_REGEX.test(email) || password.length < 6) {
    return new Response(
      JSON.stringify({ success: false, error: "Email hợp lệ và mật khẩu (>= 6 ký tự) là bắt buộc.", code: "VALIDATION_ERROR" }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }

  const baseUrl = String(env.SUPABASE_URL).replace(/\/+$/, "");
  const signupRes = await fetch(`${baseUrl}/auth/v1/signup`, {
    method: "POST",
    headers: {
      apikey: env.SUPABASE_ANON_KEY,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      email,
      password,
      data: { full_name: name }
    })
  });
  let signupData = await signupRes.json().catch(() => ({}));

  // In non-production Staging, handle Supabase Free Tier email SMTP rate limits (429/400) or pending confirmation cleanly via GoTrue Admin API
  if (!signupRes.ok) {
    const errCode = String(signupData.error_code || signupData.code || "");
    const errText = String(signupData.msg || signupData.message || signupData.error_description || "");
    const alreadyExists = /already|exists|registered/i.test(`${errText} ${errCode}`) || signupRes.status === 422 && /already/i.test(errText);
    if (!alreadyExists && env.SUPABASE_SERVICE_ROLE_KEY && !isProductionEnv(env)) {
      const adminCreateRes = await fetch(`${baseUrl}/auth/v1/admin/users`, {
        method: "POST",
        headers: {
          apikey: env.SUPABASE_SERVICE_ROLE_KEY,
          Authorization: `Bearer ${env.SUPABASE_SERVICE_ROLE_KEY}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email,
          password,
          email_confirm: true,
          user_metadata: { full_name: name }
        })
      });
      const adminCreateData = await adminCreateRes.json().catch(() => ({}));
      if (!adminCreateRes.ok) {
        const dup = adminCreateRes.status === 422 || /already/i.test(String(adminCreateData.msg || adminCreateData.message || ""));
        return new Response(
          JSON.stringify({
            success: false,
            error: dup ? "Email đã được đăng ký." : (adminCreateData.msg || adminCreateData.message || "GoTrue admin user creation failed."),
            code: dup ? "USER_EXISTS" : "REGISTER_FAILED"
          }),
          { status: dup ? 409 : 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const tokenRes = await fetch(`${baseUrl}/auth/v1/token?grant_type=password`, {
        method: "POST",
        headers: {
          apikey: env.SUPABASE_ANON_KEY,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, password })
      });
      signupData = await tokenRes.json().catch(() => ({ user: adminCreateData }));
    } else {
      const status = alreadyExists ? 409 : (signupRes.status >= 400 ? signupRes.status : 400);
      return new Response(
        JSON.stringify({ success: false, error: errText || "Supabase GoTrue signup failed.", code: status === 409 ? "USER_EXISTS" : "SIGNUP_FAILED" }),
        { status, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
  } else if (!signupData.access_token && signupData.user?.id && env.SUPABASE_SERVICE_ROLE_KEY && !isProductionEnv(env)) {
    await fetch(`${baseUrl}/auth/v1/admin/users/${signupData.user.id}`, {
      method: "PUT",
      headers: {
        apikey: env.SUPABASE_SERVICE_ROLE_KEY,
        Authorization: `Bearer ${env.SUPABASE_SERVICE_ROLE_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ email_confirm: true })
    }).catch(() => {});
    const tokenRes = await fetch(`${baseUrl}/auth/v1/token?grant_type=password`, {
      method: "POST",
      headers: {
        apikey: env.SUPABASE_ANON_KEY,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ email, password })
    });
    const tokenData = await tokenRes.json().catch(() => ({}));
    if (tokenRes.ok && tokenData.access_token) {
      signupData = tokenData;
    }
  }

  const uid = signupData.user?.id || signupData.id || deterministicUuidV4(email);
  const isAdmin = buildAdminRoleCheck(email, env);
  await invokePostgresRpc(env, v4db, {
    rpcName: "ensure_user_profile_v4",
    role: "service_role",
    args: {
      p_user_id: uid,
      p_email: email,
      p_full_name: name,
      p_role: isAdmin ? "admin" : "traveler"
    }
  }).catch(() => {});

  return new Response(
    JSON.stringify({
      success: true,
      provider: "supabase_gotrue",
      token: signupData.access_token || null,
      refreshToken: signupData.refresh_token || null,
      user: {
        id: uid,
        userId: uid,
        email,
        name,
        role: isAdmin ? "admin" : "user"
      }
    }),
    { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
  );
}

export async function handleLoginV4({ request, env, v4db, handleLegacyAuth, corsHeaders }) {
  const usePostgresGotrue =
    env &&
    env.SUPABASE_URL &&
    env.SUPABASE_ANON_KEY &&
    String(env.USE_V4_POSTGRES_RPC).toLowerCase() === "true";

  if (!usePostgresGotrue) {
    return handleLegacyAuth(new URL("http://localhost/api/auth/login"), request, env, corsHeaders);
  }

  const cloned = request.clone();
  const body = await cloned.json().catch(() => ({}));
  const email = String(body.email || "").trim().toLowerCase();
  const password = String(body.password || "");
  if (!email || !password) {
    return new Response(
      JSON.stringify({ success: false, error: "Email và mật khẩu là bắt buộc." }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }

  const baseUrl = String(env.SUPABASE_URL).replace(/\/+$/, "");
  const loginRes = await fetch(`${baseUrl}/auth/v1/token?grant_type=password`, {
    method: "POST",
    headers: {
      apikey: env.SUPABASE_ANON_KEY,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ email, password })
  });
  const loginData = await loginRes.json().catch(() => ({}));

  if (loginRes.ok && loginData.access_token && loginData.user?.id) {
    const userEmail = String(loginData.user.email || email).trim().toLowerCase();
    const adminEmails = String(env?.ADMIN_EMAILS || "").split(",").map(s => s.trim().toLowerCase()).filter(Boolean);
    const isAdmin = adminEmails.includes(userEmail);
    const fullName = loginData.user.user_metadata?.full_name || userEmail.split("@")[0];
    await invokePostgresRpc(env, v4db, {
      rpcName: "ensure_user_profile_v4",
      role: "service_role",
      args: {
        p_user_id: loginData.user.id,
        p_email: userEmail,
        p_full_name: fullName,
        p_role: isAdmin ? "admin" : "traveler"
      }
    }).catch(() => {});

    return new Response(
      JSON.stringify({
        success: true,
        provider: "supabase_gotrue",
        token: loginData.access_token,
        refreshToken: loginData.refresh_token || null,
        user: {
          id: loginData.user.id,
          userId: loginData.user.id,
          email: userEmail,
          name: fullName,
          role: isAdmin ? "admin" : "user"
        }
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }

  const legacyRes = await handleLegacyAuth(new URL("http://localhost/api/auth/login"), request, env, corsHeaders);
  if (legacyRes && legacyRes.ok) {
    return legacyRes;
  }

  return new Response(
    JSON.stringify({
      success: false,
      error: loginData.error_description || loginData.msg || "Email hoặc mật khẩu không chính xác.",
      code: "INVALID_CREDENTIALS"
    }),
    { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
  );
}

export async function handleForgotPasswordV4({ request, env, storage, corsHeaders }) {
  const body = await request.json().catch(() => ({}));
  const email = String(body.email || "").trim().toLowerCase();
  if (!EMAIL_REGEX.test(email)) {
    return new Response(
      JSON.stringify({ success: false, error: "Email không hợp lệ.", code: "VALIDATION_ERROR" }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }

  if (isPostgresGotrueEnabled(env)) {
    const baseUrl = String(env.SUPABASE_URL).replace(/\/+$/, "");
    await fetch(`${baseUrl}/auth/v1/recover`, {
      method: "POST",
      headers: {
        apikey: env.SUPABASE_ANON_KEY,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ email })
    }).catch(() => {});
  } else if (storage && storage.users && storage.users[email]) {
    const randomDigits = String(
      100000 + (crypto.getRandomValues(new Uint32Array(1))[0] % 900000)
    );
    const otpHash = await sha256Hex(`${email}:${randomDigits}`);
    storage.passwordResets = storage.passwordResets || {};
    storage.passwordResets[email] = {
      otpHash,
      expiresAt: Date.now() + 15 * 60 * 1000
    };
  }

  return new Response(
    JSON.stringify({
      success: true,
      status: "RECOVERY_SENT",
      message: "Nếu email tồn tại trong hệ thống, hướng dẫn đặt lại mật khẩu đã được gửi."
    }),
    { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
  );
}

export async function handleResetPasswordV4({ request, env, storage, hashPassword, verifyToken, corsHeaders }) {
  const body = await request.json().catch(() => ({}));
  const email = String(body.email || "").trim().toLowerCase();
  const otp = String(body.otp || "").trim();
  const authHeader = request.headers.get("Authorization") || "";
  const headerToken = authHeader.startsWith("Bearer ") ? authHeader.slice(7).trim() : "";
  const recoveryToken = String(body.recoveryToken || body.accessToken || body.token || headerToken || "").trim();
  const newPassword = String(body.newPassword || body.password || "");

  if (newPassword.length < 6) {
    return new Response(
      JSON.stringify({ success: false, error: "Mật khẩu mới phải có ít nhất 6 ký tự.", code: "VALIDATION_ERROR" }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
  if (!recoveryToken && (!EMAIL_REGEX.test(email) || otp.length < 6)) {
    return new Response(
      JSON.stringify({ success: false, error: "Thiếu recoveryToken hoặc email + mã xác thực hợp lệ.", code: "VALIDATION_ERROR" }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }

  if (isPostgresGotrueEnabled(env)) {
    const baseUrl = String(env.SUPABASE_URL).replace(/\/+$/, "");
    let bearerRecovery = recoveryToken;
    if (!bearerRecovery && email && otp) {
      const verifyRes = await fetch(`${baseUrl}/auth/v1/verify`, {
        method: "POST",
        headers: {
          apikey: env.SUPABASE_ANON_KEY,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, token: otp, type: "recovery" })
      });
      const verifyData = await verifyRes.json().catch(() => ({}));
      if (!verifyRes.ok || !verifyData.access_token) {
        return new Response(
          JSON.stringify({ success: false, error: "Mã xác thực khôi phục mật khẩu không hợp lệ hoặc đã hết hạn.", code: "INVALID_RECOVERY_TOKEN" }),
          { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      bearerRecovery = verifyData.access_token;
    }

    const updateRes = await fetch(`${baseUrl}/auth/v1/user`, {
      method: "PUT",
      headers: {
        apikey: env.SUPABASE_ANON_KEY,
        Authorization: `Bearer ${bearerRecovery}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ password: newPassword })
    });
    const updateData = await updateRes.json().catch(() => ({}));
    if (!updateRes.ok) {
      return new Response(
        JSON.stringify({
          success: false,
          error: updateData.msg || updateData.message || "Token khôi phục mật khẩu không hợp lệ hoặc đã hết hạn.",
          code: "INVALID_RECOVERY_TOKEN"
        }),
        { status: updateRes.status === 401 || updateRes.status === 403 ? 401 : 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        status: "PASSWORD_UPDATED",
        message: "Mật khẩu đã được đặt lại thành công."
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }

  // Local / Worker HMAC verification mode
  let resolvedEmail = email;
  if (recoveryToken) {
    const claims = typeof verifyToken === "function"
      ? await verifyToken(recoveryToken, env)
      : await verifyLocalJwtWithSecret(recoveryToken, env);
    if (!claims || !claims.email) {
      return new Response(
        JSON.stringify({ success: false, error: "Token khôi phục mật khẩu không hợp lệ hoặc đã hết hạn.", code: "INVALID_RECOVERY_TOKEN" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    resolvedEmail = String(claims.email).trim().toLowerCase();
  } else {
    const record = storage?.passwordResets?.[resolvedEmail];
    const providedHash = await sha256Hex(`${resolvedEmail}:${otp}`);
    if (!record || record.expiresAt < Date.now() || record.otpHash !== providedHash) {
      return new Response(
        JSON.stringify({ success: false, error: "Mã xác thực khôi phục mật khẩu không hợp lệ hoặc đã hết hạn.", code: "INVALID_RECOVERY_TOKEN" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    delete storage.passwordResets[resolvedEmail];
  }

  const targetUser = storage?.users?.[resolvedEmail];
  if (!targetUser || typeof hashPassword !== "function") {
    return new Response(
      JSON.stringify({ success: false, error: "Không tìm thấy tài khoản tương ứng.", code: "INVALID_RECOVERY_TOKEN" }),
      { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }

  const nextHash = await hashPassword(newPassword);
  targetUser.salt = nextHash.salt;
  targetUser.hash = nextHash.hash;
  targetUser.passwordUpdatedAt = new Date().toISOString();

  return new Response(
    JSON.stringify({
      success: true,
      status: "PASSWORD_UPDATED",
      message: "Mật khẩu đã được đặt lại thành công."
    }),
    { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
  );
}
