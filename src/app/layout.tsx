import type { Metadata } from "next";
import { Fraunces, JetBrains_Mono, Manrope } from "next/font/google";
import "./globals.css";
import { ClerkProviderWrapper } from "../providers/clerk";
import { Toaster } from "../components/ui/sonner";
import { Provider } from "jotai";
import { ThemeProvider } from "../providers/theme";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

const fraunces = Fraunces({
  variable: "--font-fraunces",
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
          className={`${manrope.variable} ${jetbrainsMono.variable} ${fraunces.variable} antialiased`}
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
