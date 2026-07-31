import type { Metadata } from "next";
import Sidebar from "@/components/tasks/Sidebar";

export const metadata: Metadata = {
  title: "Tasks | MacIdeas",
  description:
    "Create, browse, view, and manage your MacIdeas tasks and task lists here!",
  authors: [{ name: "MacWeb", url: "https://macweb.app" }],
  openGraph: {
    title: "Tasks | MacIdeas",
    description:
      "Create, browse, view, and manage your MacIdeas tasks and task lists here!",
    url: "https://macideas.macweb.app/tasks",
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
    <div className="pl-5 md:pl-20 lg:pl-[calc(50%-550px)] flex">
      <Sidebar />
      {children}
    </div>
  );
}
