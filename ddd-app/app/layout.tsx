import type { Metadata } from "next";
import { Noto_Sans } from "next/font/google";
import "./globals.css";
import Navbar from "./components/navbar";
import { PostHogProvider } from "./providers/PostHogProvider";

const notoSans = Noto_Sans({
  variable: "--font-noto-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'),
  title: "Dan Dutil | QA & Automation Engineer",
  description: "QA and Automation Engineer with 10+ years of experience. Skilled in manual and automated testing, including Playwright, Selenium, Postman, etc.",
  authors: [{ name: "Dan Dutil" }],
  keywords: ["QA Engineer", "Automation Engineer", "Test Engineer", "QE Engineer", "Playwright", "Selenium", "Software Testing", "Agile Tester", "Test Automation", "Software Quality Assurance", "Manual Testing", "Automation Testing"],
  openGraph: {
    title: "Dan Dutil | QA & Automation Engineer",
    description: "QA and Automation Engineer with 10+ years of experience. Skilled in manual and automated testing, including Playwright, Selenium, Postman, etc.",
    siteName: "Dan Dutil",
    type: "website",
    images: [{ url: "/api/og", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Dan Dutil | QA & Automation Engineer",
    description: "QA and Automation Engineer with 10+ years of experience.",
    images: ["/api/og"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={notoSans.variable}>
      <body
        className={`antialiased font-(family-name:--font-noto-sans)`}
        suppressHydrationWarning
      >
        <PostHogProvider>
          <Navbar />
          <div className="flex min-h-screen flex-col items-center pt-24 bg-slate-800 text-teal-200">
            {children}
          </div>
        </PostHogProvider>
      </body>
    </html>
  );
}
