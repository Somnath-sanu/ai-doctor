import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ClerkProviderWrapper } from "../providers/clerk";
import { Toaster } from "../components/ui/sonner";
import { Provider } from "jotai";
import { ThemeProvider } from "../providers/theme";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "MEDIVA AI – SMART DOCTOR NETWORK ",
    template: "%s | MEDIVA AI",
  },
  description:
    "MEDIVA AI is a modern medical assistant for clinicians, providing AI-powered consultations, reports, and clinical documentation.",
  applicationName: "MEDIVA AI",
  keywords: [
    "MEDIVA AI",
    "medical AI",
    "clinical documentation",
    "medical reports",
    "healthcare assistant",
  ],
  authors: [{ name: "MEDIVA AI" }],
  category: "health",
  openGraph: {
    title: "MEDIVA AI – Intelligent Medical Reporting",
    description:
      "AI-powered medical consultations and reporting to streamline clinical workflows.",
    url: "https://mediva.ai",
    siteName: "MEDIVA AI",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "MEDIVA AI – Intelligent Medical Reporting",
    description:
      "AI-powered medical consultations and reporting to streamline clinical workflows.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProviderWrapper>
      <html lang="en" suppressHydrationWarning>
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          <ThemeProvider>
            <Provider>
              {children}
              <Toaster position="top-center" />
            </Provider>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProviderWrapper>
  );
}
