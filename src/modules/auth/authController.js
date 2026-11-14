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

export async function handleRegisterV4({ request, env, v4db, handleLegacyAuth, corsHeaders }) {
  const usePostgresGotrue =
    env &&
    env.SUPABASE_URL &&
    env.SUPABASE_ANON_KEY &&
    String(env.USE_V4_POSTGRES_RPC).toLowerCase() === "true";

  if (!usePostgresGotrue) {
    return handleLegacyAuth(new URL("http://localhost/api/auth/register"), request, env, corsHeaders);
  }

  const body = await request.json().catch(() => ({}));
  const email = String(body.email || "").trim().toLowerCase();
  const password = String(body.password || "");
  const name = String(body.name || body.fullName || "WanderMatch Traveler").trim();

  if (!email || password.length < 6) {
    return new Response(
      JSON.stringify({ success: false, error: "Email và mật khẩu (>= 6 ký tự) là bắt buộc." }),
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
  const signupData = await signupRes.json().catch(() => ({}));

  if (!signupRes.ok) {
    return new Response(
      JSON.stringify({ success: false, error: signupData.msg || signupData.error_description || "Supabase GoTrue signup failed." }),
      { status: signupRes.status >= 400 ? signupRes.status : 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }

  const uid = signupData.user?.id || deterministicUuidV4(email);
  await invokePostgresRpc(env, v4db, {
    rpcName: "ensure_user_profile_v4",
    role: "service_role",
    args: {
      p_user_id: uid,
      p_email: email,
      p_full_name: name,
      p_role: "traveler"
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
        role: "user"
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

  return handleLegacyAuth(new URL("http://localhost/api/auth/login"), request, env, corsHeaders);
}
