// URL de l'API
export const getApiBaseUrl = () => {
  const raw = import.meta.env.VITE_API_URL as string | undefined;
  if (raw && raw.trim().length > 0) return raw.trim().replace(/\/$/, "");
  if (typeof window !== "undefined") {
    const host = window.location.hostname;
    if (host === "localhost" || host === "127.0.0.1") {
      return `${window.location.protocol}//${host}:4000`;
    }
    return window.location.origin;
  }
  return "http://localhost:4000";
};

// URL complète de l'API
export const apiUrl = (path: string) =>
  `${getApiBaseUrl()}${path.startsWith("/") ? path : `/${path}`}`;

// Clé de stockage du token d'authentification
const tokenKey = "marsai_token";

// Récupère le token d'authentification stocké
export const getStoredToken = () => {
  try {
    return localStorage.getItem(tokenKey);
  } catch {
    return null;
  }
};

// Stocke le token d'authentification
export const setStoredToken = (token: string) => {
  try {
    localStorage.setItem(tokenKey, token);
  } catch {
    return;
  }
};

// Efface le token d'authentification stocké
export const clearStoredToken = () => {
  try {
    localStorage.removeItem(tokenKey);
  } catch {
    return;
  }
};

// Consomme le token d'authentification de l'URL hash et le stocke localement
export const consumeTokenFromUrlHash = () => {
  const hash = window.location.hash;
  if (!hash || hash.length < 2) return null;

  const params = new URLSearchParams(hash.slice(1));
  const token = params.get("token");
  if (!token) return null;

  setStoredToken(token);

  params.delete("token");
  const rest = params.toString();
  const nextHash = rest.length > 0 ? `#${rest}` : "";

  window.history.replaceState(
    null,
    "",
    `${window.location.pathname}${window.location.search}${nextHash}`
  );
  return token;
};

export const consumeAuthErrorFromUrl = () => {
  const params = new URLSearchParams(window.location.search);
  const message =
    params.get("authError") ||
    params.get("error_description") ||
    params.get("error");
  if (!message) return null;

  params.delete("authError");
  params.delete("error_description");
  params.delete("error");
  const nextSearch = params.toString();
  const nextUrl = `${window.location.pathname}${nextSearch ? `?${nextSearch}` : ""
    }${window.location.hash}`;
  window.history.replaceState(null, "", nextUrl);
  return message;
};

// Classe d'erreur pour les appels API
export class ApiError extends Error {
  status: number;
  payload: unknown;

  constructor(message: string, status: number, payload: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.payload = payload;
  }
}

// Effectue une requête API avec le token d'authentification stocké
export const apiFetch = async (path: string, init: RequestInit = {}) => {
  const token = getStoredToken();

  const headers = new Headers(init.headers);
  if (token && !headers.has("Authorization"))
    headers.set("Authorization", `Bearer ${token}`);

  if (
    init.body &&
    !(init.body instanceof FormData) &&
    !headers.has("Content-Type")
  ) {
    headers.set("Content-Type", "application/json");
  }

  const res = await fetch(apiUrl(path), {
    ...init,
    headers,
  });

  if (res.status === 401) {
    clearStoredToken();
  }

  return res;
};

// Extrait le message d'erreur de la payload d'une réponse API
const extractApiErrorMessage = (payload: unknown, status: number) => {
  if (typeof payload === "object" && payload !== null && "error" in payload) {
    const val = (payload as { error?: unknown }).error;
    if (typeof val === "string") return val;
    if (val !== undefined) return String(val);
  }
  return `HTTP ${status}`;
};

// Effectue une requête API avec le token d'authentification stocké et retourne la payload JSON
export const apiFetchJson = async <T>(
  path: string,
  init: RequestInit = {}
): Promise<T> => {
  const res = await apiFetch(path, init);
  const ct = res.headers.get("content-type") || "";
  const isJson = ct.includes("application/json");

  const payload = isJson
    ? await res.json().catch(() => null)
    : await res.text().catch(() => "");

  if (!res.ok) {
    throw new ApiError(
      extractApiErrorMessage(payload, res.status),
      res.status,
      payload
    );
  }

  return payload as T;
};

// Décodage de la payload d'un token JWT
export const decodeJwtPayload = <T extends object = Record<string, unknown>>(
  token: string
): T | null => {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;

    const b64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
    const padded = b64.padEnd(Math.ceil(b64.length / 4) * 4, "=");
    const json = atob(padded);
    return JSON.parse(json) as T;
  } catch {
    return null;
  }
};
