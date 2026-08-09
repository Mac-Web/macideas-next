import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Items from "./Items";
import Hero from "@/components/projects/Hero";

async function fetchProjectData(id: string) {
  const session = await getSession();
  if (!session) redirect("/");
  const project = await prisma.project.findUnique({
    where: { id, userId: session.user.id },
    include: {
      folders: { include: { taskLists: true, notes: true } },
      tasks: true,
      taskLists: true,
      notes: true,
    },
  });
  if (!project) redirect("/projects");
  return project;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const project = await fetchProjectData(id);

  return {
    title: `${project.name} | Projects | MacIdeas`,
    description: `You can browse, view, and manage your folders, task lists, tasks, and notes in the ${project.name} project on this page!`,
    authors: [{ name: "MacWeb", url: "https://macweb.app" }],
    openGraph: {
      title: `${project.name} | Projects | MacIdeas`,
      description: `You can browse, view, and manage your folders, task lists, tasks, and notes in the ${project.name} project on this page!`,
      url: `https://macideas.macweb.app/projects/${project.id}`,
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
}

async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const project = await fetchProjectData(id);

  // TODO: add option to add task lists/tasks/folders/notes to project from this page

  return (
    <div className="flex flex-col items-center flex-1 relative h-[calc(100vh-68px)] gap-y-5 px-10">
      <Hero
        id={project.id}
        name={project.name}
        description={project.description}
      />
      <Items project={project} />
    </div>
  );
}

export default Page;
