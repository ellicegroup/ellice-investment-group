import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Providers } from "./providers";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  title: {
    default: "Ellice Investment Group — Pacific-Focused Investment Management",
    template: "%s — Ellice Investment Group",
  },
  description:
    "Ellice Investment Group manages two private funds delivering institutional-grade returns for investors across the Pacific and beyond.",
  metadataBase: new URL("https://www.elliceinvestmentgroup.com"),
  openGraph: {
    siteName: "Ellice Investment Group",
    type: "website",
    locale: "en_NZ",
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
    <html lang="en" className="h-full">
      <body className="min-h-full font-sans">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
