import type { TaskList } from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import Bar from "@/components/tasks/Bar";
import Tasks from "./Tasks";

async function fetchTaskListData(id: string) {
  const session = await getSession();
  if (!session) redirect("/");
  if (id === "day") {
    const start = new Date();
    start.setHours(0, 0, 0, 0);
    const end = new Date();
    end.setHours(23, 59, 59, 999);
    const session = await getSession();
    if (!session) redirect("/");
    const dailyTasks = await prisma.task.findMany({
      where: {
        userId: session.user.id,
        myDayVisible: true,
        OR: [
          { due: { gte: start, lte: end } },
          { start: { gte: start, lte: end } },
          { myDay: true },
        ],
      },
      include: {
        tags: { orderBy: { name: "asc" } },
        subtasks: true,
      },
      orderBy: { createdAt: "desc" },
    });
    const taskList = {
      id: "day",
      name: "My Day",
      description:
        "My day is a special task list where you can easily create, browse, and manage your daily tasks!",
      userId: session.user.id,
      folder: null,
      tasks: dailyTasks,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    return taskList;
  } else {
    const taskList = await prisma.taskList.findUnique({
      where: { id, userId: session.user.id },
      include: {
        tasks: {
          include: { tags: { orderBy: { name: "asc" } }, subtasks: true },
          orderBy: { createdAt: "desc" },
        },
        folder: true,
      },
    });
    if (!taskList) redirect("/tasks");
    return taskList;
  }
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
  const myDay = id === "day";
  const taskList = await fetchTaskListData(id);
  const session = await getSession();
  const tags = await prisma.tag.findMany({
    where: { userId: session!.user.id },
    orderBy: { name: "asc" },
  });

  return (
    <div className="flex flex-col items-center flex-1 relative h-[calc(100vh-68px)]">
      <Bar
        taskList={taskList as TaskList}
        folder={taskList.folder}
        myDay={myDay}
      />
      <Tasks
        tasks={taskList.tasks}
        id={taskList.id}
        name={taskList.name}
        tags={tags}
        myDay={myDay}
      />
    </div>
  );
}

export default Page;
