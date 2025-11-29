"use client";

import AdminSideMenu from "@/app/components/AdminSideMenu";

export default function AdminPage() {

    return (
        <>
            <div className="fixed top-0 left-0 w-64 h-full text-white">
                <AdminSideMenu />
            </div>
            <div className="ml-64 p-8">
                <h1 className="text-3xl font-bold mb-4">Welcome to the Admin Page</h1>
                <p>This is a protected admin area.</p>
            </div>
            
        </>
        
    );
}
