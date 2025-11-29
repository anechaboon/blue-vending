"use client";
import { logout as authLogout } from "@/services/auth";

export function handleLogout() {
    authLogout();
    window.location.reload();
}

export default function LogoutButton() {

    return (
        <div className="flow-root">
        <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
        >
            Logout
        </button>
        </div>
        
    );
}
