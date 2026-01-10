import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import { BackToTop } from "@/components/shared/back-to-top";
import { AIChatbot } from "@/components/shared/ai-chatbot";
import { ThemeProvider } from "@/components/providers/theme-provider";
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
  title: "ODDA - Oromo Digital Diaspora Association",
  description: "A comprehensive community platform for the Oromo diaspora - Academy, Careers, and Wiki",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider>
          {children}
          <BackToTop />
          <AIChatbot />
          <Toaster position="top-right" />
        </ThemeProvider>
      </body>
    </html>
  );
}
