import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Items from "./Items";
import Hero from "@/components/projects/Hero";
import Add from "@/components/projects/Add";

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
  const session = (await getSession())!;
  const user = (await prisma.user.findUnique({
    where: { id: session.user.id },
    include: { folders: true, taskLists: true, tasks: true, notes: true },
  }))!;
  const existing = [
    ...project.folders.map((f) => {
      return { id: f.id, type: "Folders" };
    }),
    ...project.taskLists.map((t) => {
      return { id: t.id, type: "Task lists" };
    }),
    ...project.tasks.map((t) => {
      return { id: t.id, type: "Tasks" };
    }),
    ...project.notes.map((n) => {
      return { id: n.id, type: "Notes" };
    }),
  ];

  return (
    <div className="flex flex-col items-center flex-1 relative h-[calc(100vh-68px)] gap-y-5 px-10">
      <Hero
        id={project.id}
        name={project.name}
        description={project.description}
      />
      <Items project={project} />
      <Add
        id={project.id}
        folders={user.folders}
        taskLists={user.taskLists}
        tasks={user.tasks}
        notes={user.notes}
        existing={existing}
      />
    </div>
  );
}

export default Page;
