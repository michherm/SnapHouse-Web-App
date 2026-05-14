import "./globals.css";
import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "SnapHouse Web (Migration)",
  description: "WikiHouse / SnapHouse Konfigurator — Next.js + R3F Meilenstein 1",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="de">
      <body>{children}</body>
    </html>
  );
}
