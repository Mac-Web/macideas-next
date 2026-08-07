import type { Metadata } from "next";
import Sidebar from "@/components/projects/Sidebar";

export const metadata: Metadata = {
  title: "Projects | MacIdeas",
  description: "Create, browse, view, and manage your MacIdeas projects here!",
  authors: [{ name: "MacWeb", url: "https://macweb.app" }],
  openGraph: {
    title: "Projects | MacIdeas",
    description:
      "Create, browse, view, and manage your MacIdeas projects here!",
    url: "https://macideas.macweb.app/projects",
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

export default function ProjectsLayout({
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
