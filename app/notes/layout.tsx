import type { Metadata } from "next";
import Sidebar from "@/components/notes/Sidebar";

export const metadata: Metadata = {
  title: "Notes | MacIdeas",
  description: "Create, browse, view, and manage your MacIdeas notes here!",
  authors: [{ name: "MacWeb", url: "https://macweb.app" }],
  openGraph: {
    title: "Notes | MacIdeas",
    description: "Create, browse, view, and manage your MacIdeas notes here!",
    url: "https://macideas.macweb.app/notes",
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

export default function TasksLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex">
      <Sidebar />
      {children}
    </div>
  );
}
