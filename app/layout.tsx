import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "morrow — share what makes today worth it",
  description: "A calmer corner of the internet for the people and moments you want to remember.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning /* <-- BẠN THÊM VÀO ĐÂY */
    >
      <body 
        className="min-h-full flex flex-col"
        suppressHydrationWarning /* <-- VÀ THÊM VÀO CẢ ĐÂY */
      >
        {children}
      </body>
    </html>
  );
}
