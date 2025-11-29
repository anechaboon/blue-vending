// services/api.ts
import { getToken } from "./auth";

interface ApiOptions extends RequestInit {
    headers?: Record<string, string>;
}

export async function apiFetch(url: string, options: ApiOptions = {}) {
    const token = getToken();
    const isFormData = options.body instanceof FormData;

    const headers = {
        ...options.headers,
        Authorization: token ? `Bearer ${token}` : "",
        ...(isFormData ? {} : { "Content-Type": "application/json" })
    };
    const res = await fetch(url, { ...options, headers });

    if (res.status === 401) {
        localStorage.removeItem("token");
        window.location.href = "/admin-login";
        return;
    }

    return res.json();
}
