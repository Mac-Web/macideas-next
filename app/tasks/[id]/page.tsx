import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import Bar from "@/components/tasks/Bar";
import TaskInput from "@/components/tasks/TaskInput";
import { FaCheckCircle } from "react-icons/fa";

async function fetchTaskListData(id: string) {
  const session = await getSession();
  if (!session) redirect("/");
  const taskList = await prisma.taskList.findUnique({
    where: { id, userId: session.user.id },
    include: { tasks: true },
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

  return (
    <div className="flex flex-col items-center pb-25 flex-1 relative">
      <Bar taskList={taskList} />
      <div className="px-3 w-full h-full">
        {taskList.tasks.length > 1 ? (
          <p className="text-gray-300 text-center w-[65%]">
            You&apos;ll be able to add, view, and manage your tasks for this
            task list on this page soon!
          </p>
        ) : (
          <div className="text-gray-300 flex flex-col gap-y-5 justify-center h-full items-center">
            <FaCheckCircle size={50} />
            <p>Great work, all tasks are completed!</p>
          </div>
        )}
        <TaskInput />
      </div>
    </div>
  );
}

export default Page;
