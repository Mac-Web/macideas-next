import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Nav from "@/components/layout/Nav";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Home | MacIdeas",
  description:
    "A simple and easy to use productivity tool for managing tasks, creating notes, and keeping track of your work!",
  authors: [{ name: "MacWeb", url: "https://macweb.app" }],
  openGraph: {
    title: "MacIdeas",
    description:
      "A simple and easy to use productivity tool for managing tasks, creating notes, and keeping track of your work!",
    url: "https://macideas.macweb.app",
    siteName: "MacIdeas",
    images: [
      {
        url: "/logo.png",
        width: 100,
        height: 100,
      },
    ],
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col overflow-x-hidden">
        <Nav />
        {children}
      </body>
    </html>
  );
}
