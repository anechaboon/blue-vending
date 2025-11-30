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

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;
export async function purchase(formData: FormData) {
    const res = await fetch(`${BASE_URL}/purchase`, {
        method: "POST",
        body: formData,
    });

    if (!res.ok) {
        throw new Error("Failed to create product");
    }

    const data = await res.json();
    return data;
}