import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import Bar from "@/components/tasks/Bar";
import Tasks from "./Tasks";

async function fetchTaskListData(id: string) {
  const session = await getSession();
  if (!session) redirect("/");
  const taskList = await prisma.taskList.findUnique({
    where: { id, userId: session.user.id },
    include: {
      tasks: {
        include: { tags: { orderBy: { name: "asc" } } },
        orderBy: { createdAt: "desc" },
      },
    },
  });
  if (!taskList) redirect("/tasks");
  return taskList;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const taskList = await fetchTaskListData(id);

  return {
    title: `${taskList.name} | Tasks | MacIdeas`,
    description: `You can add, view, and manage your tasks in the ${taskList.name} task list on this page!`,
    authors: [{ name: "MacWeb", url: "https://macweb.app" }],
    openGraph: {
      title: `${taskList.name} | Tasks | MacIdeas`,
      description: `You can add, view, and manage your tasks in the ${taskList.name} task list on this page!`,
      url: `https://macideas.macweb.app/tasks/${taskList.id}`,
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
  const taskList = await fetchTaskListData(id);
  const session = await getSession();
  const tags = await prisma.tag.findMany({
    where: { userId: session!.user.id },
    orderBy: { name: "asc" },
  });

  return (
    <div className="flex flex-col items-center flex-1 relative h-[calc(100vh-68px)]">
      <Bar taskList={taskList} />
      <Tasks
        tasks={taskList.tasks}
        id={taskList.id}
        name={taskList.name}
        tags={tags}
      />
    </div>
  );
}

export default Page;
