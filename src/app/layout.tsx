import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import { BackToTop } from "@/components/shared/back-to-top";
import { OromoAssistant } from "@/components/ai-assistant";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { FeedbackButton, FeedbackProvider } from "@/components/feedback";
import { GoogleTranslateInit } from "@/components/translation";
import { LanguageProvider } from "@/contexts/LanguageContext";
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
  title: "ODDA Academy - Climb the Tree of Knowledge",
  description: "Free, world-class education for the Oromo community. ODDA means Tree in Oromo — grow your knowledge of language, culture, and career skills.",
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
          <LanguageProvider>
            <FeedbackProvider>
              {children}
              <BackToTop />
              <OromoAssistant />
              <FeedbackButton />
              <GoogleTranslateInit />
              <Toaster position="top-right" />
            </FeedbackProvider>
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
