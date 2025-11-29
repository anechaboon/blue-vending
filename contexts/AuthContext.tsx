"use client";

import { createContext, useContext, useEffect, useRef, useState } from "react";
import { getToken, logout as authLogout } from "@/services/auth";

interface AuthContextType {
    user: string | null;
    loading: boolean;
    login: (token: string) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    loading: true,
    login: () => {},
    logout: () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) { // ครอบคลุมทั้งแอป รับ props.children เพื่อเรนเดอร์ เนื้อหาภายใน
    const [user, setUser] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const mounted = useRef(true);

    const parseUserFromToken = (token: string | null) => {
        if (!token) return null;
        try {
            const payload = JSON.parse(atob(token.split(".")[1]));
            // payload.sub อาจเป็น string หรือ object ตาม backend -> normalize เป็น string
            return typeof payload.sub === "string" ? payload.sub : JSON.stringify(payload.sub);
        } catch {
            return null;
        }
    };

    useEffect(() => {
        mounted.current = true;
        // ทำเป็น async flow แบบ deterministic แยก setUser และ setLoading ให้เป็นลำดับชัดเจน
        const init = () => {
            const token = getToken();
            const u = parseUserFromToken(token);
            if (!mounted.current) return;

            setUser(u);
            // ตั้ง loading = false เฉพาะหลังจากตั้ง user เรียบร้อย
            setLoading(false);
        };

        init();

        // ฟัง event storage เผื่อ token ถูกเปลี่ยนจาก tab อื่น
        const onStorage = (e: StorageEvent) => {
            if (e.key === "token") {
                const newToken = typeof window === "undefined" ? null : localStorage.getItem("token");
                const newUser = parseUserFromToken(newToken);
                if (!mounted.current) return;
                setUser(newUser);
                setLoading(false);
            }
        };
        if (typeof window !== "undefined") window.addEventListener("storage", onStorage); // เพื่อ sync ข้าม tab

        return () => { // cleanup
            mounted.current = false; // ป้องกัน setState หลัง unmount
            if (typeof window !== "undefined") window.removeEventListener("storage", onStorage); // cleanup event listener ป้องกัน memory leak
        };
    }, []);

    // login(token) ให้ context อัปเดททันทีเมื่อ login สำเร็จ
    const login = (token: string) => {
        try {
            // assume token already saved to localStorage by caller
            const u = parseUserFromToken(token);
            setUser(u);
            setLoading(false);
        } catch {
            setUser(null);
            setLoading(false);
        }
    };

    const logout = () => {
        // เคลียร์ token จาก storage ผ่านบริการ ปรับ state ทันที
        try {
            authLogout();
        } catch {
            try {
                if (typeof window !== "undefined") localStorage.removeItem("token");
            } catch {}
        }
        setUser(null);
        setLoading(false);
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, logout }}>
        {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}
