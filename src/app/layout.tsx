import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";

const msSaans = localFont({
  src: [
    {
      path: "./fonts/MSaansVF.woff2",
      weight: "100 900",
      style: "normal",
    },
    {
      path: "./fonts/MSaansVF.woff",
      weight: "100 900",
      style: "normal",
    },
  ],
  variable: "--font-ms-saans",
  display: "swap",
});

export const viewport: Viewport = {
  viewportFit: "cover",
};

export const metadata: Metadata = {
  title: "Discover Web apps | Mobbin",
  description: "Discover the latest design patterns from top apps",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${msSaans.variable} antialiased`}>{children}</body>
    </html>
  );
}
