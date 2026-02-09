import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/features/navigation/Navbar";
import Footer from "@/features/navigation/Footer";
import UserProviderContainer from "@/context/UserProviderContainer";
import { Toaster } from "react-hot-toast";
import { getCurrentUser } from "@/lib/auth/utils";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://tasker.app"),
  title: {
    default: "Tasker",
    template: "%s · Tasker",
  },
  description:
    "Tasker is a modern productivity app to manage tasks, notes, journals, and collections in one place.",
  applicationName: "Tasker",
  authors: [{ name: "Tasker Team" }],
  creator: "Tasker",
  keywords: [
    "task management",
    "productivity",
    "notes",
    "journal",
    "planner",
    "to-do app",
  ],
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    title: "Tasker",
    description:
      "Organize tasks, notes, journals, and collections with a clean and modern workflow.",
    siteName: "Tasker",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Tasker",
    description:
      "A modern productivity app for tasks, notes, journals, and collections.",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await getCurrentUser();

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <UserProviderContainer>
          <div className="flex flex-col items-stretch min-h-screen">
            <Navbar
              user={{
                firstName: user?.firstName,
                lastName: user?.lastName,
                email: user?.email,
              }}
            />
            {children}
            <Footer />
            <Toaster />
          </div>
        </UserProviderContainer>
      </body>
    </html>
  );
}
