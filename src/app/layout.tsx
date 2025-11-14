import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/contexts/AuthContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "FemCare - Period & Pregnancy Tracking App",
  description: "Your personal health companion for period tracking, pregnancy, and wellness insights",
  keywords: ["period tracking", "pregnancy", "health", "women's health", "fertility"],
  authors: [{ name: "FemCare Team" }],
  openGraph: {
    title: "FemCare - Period & Pregnancy Tracking",
    description: "Track your cycle, monitor symptoms, and get personalized health insights",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "FemCare - Period & Pregnancy Tracking",
    description: "Your personal health companion for period tracking, pregnancy, and wellness insights",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        <AuthProvider>
          {children}
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  );
}
