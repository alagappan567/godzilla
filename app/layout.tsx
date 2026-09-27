import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Godzilla",
  description: "King of the Monsters.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
