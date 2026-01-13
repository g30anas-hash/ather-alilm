import type { Metadata } from "next";
import { Amiri, Scheherazade_New, Cairo } from "next/font/google";
import "./globals.css";

const amiri = Amiri({
  subsets: ["arabic"],
  weight: ["400", "700"],
  variable: "--font-amiri",
  display: "swap",
});

const scheherazade = Scheherazade_New({
  subsets: ["arabic"],
  weight: ["400", "700"],
  variable: "--font-scheherazade",
  display: "swap",
});

const cairo = Cairo({
  subsets: ["arabic"],
  variable: "--font-cairo",
  display: "swap",
});

export const metadata: Metadata = {
  title: "أثير العلم | Ather Alilm",
  description: "منصة تعليمية بأسلوب Gamified World بهوية أندلسية",
};

import { UserProvider } from "@/context/UserContext";
import { ToastProvider } from "@/context/ToastContext";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl">
      <body
        className={`${amiri.variable} ${scheherazade.variable} ${cairo.variable} antialiased bg-[#2A1B0E] text-[#F4E4BC]`}
      >
        <div className="fixed inset-0 pointer-events-none z-50 mix-blend-overlay opacity-20 bg-[url('https://www.transparenttextures.com/patterns/aged-paper.png')]"></div>
        <UserProvider>
          <ToastProvider>
            {children}
          </ToastProvider>
        </UserProvider>
      </body>
    </html>
  );
}
