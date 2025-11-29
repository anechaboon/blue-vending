"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import AdminSideMenu from "@/app/components/AdminSideMenu";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading && !user) {
            router.replace("/admin-login");
        }
    }, [loading, user, router]);
    // if (loading) return <div>Loading...</div>;

    return (
        <>
            {user && (
                <>
                    <div className="fixed top-0 left-0 w-64 h-full text-white">
                        <AdminSideMenu />
                    </div>
                    <div className="ml-64 p-8">
                        {children}
                    </div>
                </>
            )}
        </>
    );
}
