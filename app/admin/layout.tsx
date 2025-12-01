"use client";
import AdminSideMenu from "@/app/components/AdminSideMenu";
export default function AdminLayout({ children }: { children: React.ReactNode }) {

    return (
        <>
            <div className="fixed top-0 left-0 w-64 h-full text-white">
                <AdminSideMenu />
            </div>
            <div className="ml-64 p-8">
                {children}
            </div>
        </>
    );
}
