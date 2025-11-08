import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import QuickConsult from "@/components/QuickConsult"; // ★ 新增：全域掛載諮詢按鈕

// === Google Fonts ===
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// === Metadata ===
export const metadata: Metadata = {
  title: "TW Connect | Cross-border Advisory",
  description: "Take your first step into Taiwan, Japan, and the US with confidence.",
  icons: {
    icon: "/favicon.ico",
  },
};

// === Root Layout ===
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // 預設語系（可之後整合 i18n）
    <html lang="ja">
      <body
        suppressHydrationWarning
        className={`
          ${geistSans.variable}
          ${geistMono.variable}
          bg-background
          text-foreground
          antialiased
          relative
          overflow-x-hidden
        `}
      >
        {children}

        {/* ★ 全站固定顯示的諮詢按鈕（桌機右上、手機右下） */}
        <QuickConsult
          targetId="contact"
          anchorSelector='[data-lang-switcher="true"]'
          followAnchor={false}
          position="top-right"
          topAdjustRem={-0.325}     // 桌機微上移 10px
          matchAnchorWidth={true}   // 桌機與語言切換寬度一致
        />
      </body>
    </html>
  );
}
