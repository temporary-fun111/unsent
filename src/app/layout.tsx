import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Unsent - Write what you can't send",
  description: "A private-first unsent message vault. Pink, calm, and safe by design.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-[#FFF7FB]">
        {children}
      </body>
    </html>
  );
}
