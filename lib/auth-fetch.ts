"use client";

const API_BASE_URL = "https://code.haru2end.dedyn.io/api";

let refreshPromise: Promise<string | null> | null = null;

type TokenPayload = {
  atk?: string;
  rtk?: string;
  accessToken?: string;
  refreshToken?: string;
  access_token?: string;
  refresh_token?: string;
};

function parseTokens(payload: TokenPayload | null | undefined) {
  if (!payload) return { atk: null, rtk: null };
  return {
    atk: payload.atk ?? payload.accessToken ?? payload.access_token ?? null,
    rtk: payload.rtk ?? payload.refreshToken ?? payload.refresh_token ?? null,
  };
}

async function requestTokenRefresh(refreshToken: string): Promise<{ atk: string; rtk: string | null } | null> {
  try {
    const query = new URLSearchParams({ refreshToken }).toString();
    const response = await fetch(`${API_BASE_URL}/user/reissue?${query}`, {
      method: "POST",
    });

    if (!response.ok) return null;
    const data = (await response.json().catch(() => null)) as TokenPayload | null;
    const { atk, rtk } = parseTokens(data);
    if (!atk) return null;
    return { atk, rtk };
  } catch {
    return null;
  }
}

export async function refreshAccessToken(): Promise<string | null> {
  if (typeof window === "undefined") return null;

  if (!refreshPromise) {
    refreshPromise = (async () => {
      const refreshToken = localStorage.getItem("refreshToken");
      if (!refreshToken) return null;

      const refreshed = await requestTokenRefresh(refreshToken);
      if (!refreshed) return null;

      localStorage.setItem("accessToken", refreshed.atk);
      if (refreshed.rtk) {
        localStorage.setItem("refreshToken", refreshed.rtk);
      }
      return refreshed.atk;
    })();
  }

  try {
    return await refreshPromise;
  } finally {
    refreshPromise = null;
  }
}

export async function authFetch(
  input: RequestInfo | URL,
  init: RequestInit = {},
  retryOnUnauthorized = true
): Promise<Response> {
  const headers = new Headers(init.headers ?? {});
  const accessToken = typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;
  if (accessToken && !headers.has("Authorization")) {
    headers.set("Authorization", `Bearer ${accessToken}`);
  }

  const response = await fetch(input, { ...init, headers });
  if (response.status !== 401 || !retryOnUnauthorized) {
    return response;
  }

  const newAccessToken = await refreshAccessToken();
  if (!newAccessToken) return response;

  const retryHeaders = new Headers(init.headers ?? {});
  retryHeaders.set("Authorization", `Bearer ${newAccessToken}`);
  return fetch(input, { ...init, headers: retryHeaders });
}
