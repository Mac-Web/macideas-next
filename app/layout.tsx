import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ThemeProvider } from "next-themes";
import Nav from "@/components/layout/Nav";
import NextTopLoader from "nextjs-toploader";
import "./globals.css";
import "flatpickr/dist/flatpickr.css";

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
    <html
      lang="en"
      className={`${inter.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col overflow-x-hidden">
        <ThemeProvider attribute="class" defaultTheme="dark">
          <NextTopLoader
            showSpinner={false}
            height={2}
            initialPosition={0.1}
            shadow={false}
            template='<div class="bar bg-teal-500! dark:bg-teal-600!" role="bar"><div class="peg"></div></div><div class="spinner" role="spinner"><div class="spinner-icon"></div></div>'
          />
          <Nav />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
