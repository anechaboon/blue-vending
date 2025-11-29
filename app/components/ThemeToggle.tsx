'use client';

import { useState, useEffect } from 'react';

export default function ThemeToggle() {
    const [isDark, setIsDark] = useState<boolean | undefined>(undefined);

    useEffect(() => {
        const saved = localStorage.getItem('theme');
        const dark = saved === 'dark';

        // sync HTML class
        document.documentElement.classList.toggle('dark', dark);

        // set state AFTER syncing DOM
        setIsDark(dark);
    }, []);

    const toggleTheme = () => {
        if (isDark === undefined) return; // ยังโหลดไม่เสร็จ

        const newValue = !isDark;
        setIsDark(newValue);

        document.documentElement.classList.toggle('dark', newValue);
        localStorage.setItem('theme', newValue ? 'dark' : 'light');
    };

    // ยังไม่รู้ theme → ห้าม render icon (กัน hydration mismatch)
    if (isDark === undefined) {
        return (
            <button className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 transition" />
        );
    }

    return (
        <button
            onClick={toggleTheme}
            className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition"
        >
            {isDark ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth={2} fill="none" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 1v2 M12 21v2 M4.22 4.22l1.42 1.42 M18.36 18.36l1.42 1.42 M1 12h2 M21 12h2 M4.22 19.78l1.42-1.42 M18.36 5.64l1.42-1.42" />
                </svg>
            ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-800" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
                </svg>
            )}
        </button>
    );
}
