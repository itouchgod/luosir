import type { Metadata } from "next";
import type { ReactElement, ReactNode } from "react";
import { Inter, Sora } from "next/font/google";
import { BackToTop } from "@/components/BackToTop";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const sora = Sora({
  variable: "--font-sora",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"
  ),
  title: "Luo Sir | 个人主页",
  description:
    "专注响应式界面设计与全栈系统开发，为创始人和产品团队打造高质量的数字体验。",
  icons: {
    icon: [
      {
        url: "/icon.png",
        type: "image/png",
        sizes: "512x512",
      },
    ],
    shortcut: "/favicon.ico",
    apple: "/icon.png",
  },
  openGraph: {
    title: "Luo Sir | 个人主页",
    description:
      "专注响应式界面设计与全栈系统开发，为创始人和产品团队打造高质量的数字体验。",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Luo Sir 个人主页预览",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>): ReactElement {
  return (
    <html lang="zh-CN" className={`${inter.variable} ${sora.variable} h-full`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: `(function(){try{var s=localStorage.getItem('theme');var p=s?s==='light':window.matchMedia('(prefers-color-scheme: light)').matches;if(p)document.documentElement.dataset.theme='light';}catch(e){}})();` }} />
      </head>
      <body className="min-h-full bg-background text-foreground antialiased">
        {children}
        <BackToTop />
      </body>
    </html>
  );
}
