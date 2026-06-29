import type { Metadata } from "next";
import { Be_Vietnam_Pro, JetBrains_Mono } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages } from "next-intl/server";
import { routing } from "@/src/i18n/routing";
import "./globals.css";

const beVietnamPro = Be_Vietnam_Pro({
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500"],
  variable: "--font-sans",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    template: "%s | ENGLISH",
    default: "ENGLISH — Nen tang hoc tieng Anh the he moi",
  },
  description:
    "Nen tang hoc tieng Anh the he moi cho nguoi Viet Nam (A1–C2). Ket hop 6 ky nang voi AI cham diem va SRS.",
  metadataBase: new URL("https://edu.doanquangkien.com"),
  robots: {
    index: true,
    follow: true,
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const locale = await getLocale();
  // If no valid locale is set, fall back to the default
  const resolvedLocale =
    locale && routing.locales.includes(locale as never)
      ? locale
      : routing.defaultLocale;
  const messages = await getMessages();

  return (
    <html
      lang={resolvedLocale}
      className={`${beVietnamPro.variable} ${jetbrainsMono.variable} dark`}
      suppressHydrationWarning
    >
      <body className="min-h-screen bg-background font-sans font-normal text-foreground antialiased">
        <NextIntlClientProvider messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
