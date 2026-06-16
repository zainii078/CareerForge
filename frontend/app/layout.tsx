import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "CareerForge - AI-Powered Resume Builder & ATS Optimizer",
  description:
    "Build ATS-optimized resumes that get interviews. Use AI to create professional resumes, improve ATS scores, and match with the right opportunities.",
  keywords: [
    "resume builder",
    "ATS optimizer",
    "AI resume",
    "job search",
    "career",
    "resume templates",
  ],
  openGraph: {
    title: "CareerForge - AI-Powered Resume Builder & ATS Optimizer",
    description:
      "Build ATS-optimized resumes that get interviews. Use AI to create professional resumes, improve ATS scores, and match with the right opportunities.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "CareerForge - AI-Powered Resume Builder",
    description: "Build ATS-optimized resumes that get interviews.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster position="top-right" />
        </ThemeProvider>
      </body>
    </html>
  );
}
