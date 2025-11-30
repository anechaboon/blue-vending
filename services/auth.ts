import axios from "axios";

interface LoginPayload {
    email: string;
    password: string;
}

interface LoginResponse {
    access_token: string;
    token_type: string;
}

export const login = async (data: LoginPayload): Promise<LoginResponse> => {
    const formData = new URLSearchParams();
    formData.append("username", data.email); // OAuth2 ใช้ username
    formData.append("password", data.password);
    const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

    const respLogin = await axios.post(BASE_URL+"/auth/login", formData, {
        withCredentials: true,  // ต้องมี เพื่อให้ browser รับ HttpOnly cookie
    }).then(res => res.data);
    localStorage.setItem("token", respLogin.access_token);
    return respLogin;

};

export function logout() {
    if (typeof window === "undefined") return null; // ป้องกัน SSR
    localStorage.removeItem("token");
}

export function getToken() {
    if (typeof window === "undefined") return null; // ป้องกัน SSR
    return localStorage.getItem("token");
}
