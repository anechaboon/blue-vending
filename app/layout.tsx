// app/layout.tsx
import "./globals.css";
import type { Metadata } from "next";
import { AuthProvider } from "@/contexts/AuthContext";

export const metadata: Metadata = {
  title: "PRACTICE",
  description: "Image slide gallery built with Next.js",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-white text-black">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}

