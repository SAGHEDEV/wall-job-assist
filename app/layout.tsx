import type { Metadata } from "next";
import { Geist, Geist_Mono, Rochester } from "next/font/google";
import "./globals.css";
import Navbar from "@/app/components/layout/Navbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const rochester = Rochester({
  variable: "--font-rochester",
  weight: "400",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "WalJob Assist — Your career, remembered",
  description:
    "WalJob Assist remembers your experience, skills, and preferences — then tailors every job application using persistent Walrus Memory.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${rochester.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <Navbar />
        <main style={{ flex: 1, display: "flex", flexDirection: "column" }}>
          {children}
        </main>
      </body>
    </html>
  );
}
