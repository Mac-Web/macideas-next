import type { TaskType } from "@/components/tasks/Task";
import type { Task } from "@/generated/prisma/client";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { priorities } from "@/lib/constants";
import { dashboardSettings } from "@/lib/constants";
import { FaFaceFrown } from "react-icons/fa6";
import Settings from "@/components/tasks/dashboard/Settings";
import Section from "@/components/tasks/dashboard/Section";
import Tags from "@/components/tasks/dashboard/Tags";
import Options from "@/components/tasks/dashboard/Options";

async function Page() {
  const session = await getSession();
  if (!session) redirect("/");
  const userSettings = await prisma.macIdeasSettings.findUnique({
    where: { userId: session.user.id },
  });
  const tasks = await prisma.task.findMany({
    where: {
      userId: session.user.id,
      completed: userSettings?.showCompleted ? undefined : false || false,
    },
    include: { tags: true, subtasks: true },
    orderBy: { createdAt: "desc" },
  });
  const tags = await prisma.tag.findMany({
    where: { userId: session.user.id },
    include: { tasks: { include: { tags: true, subtasks: true } } },
  });
  const allTasks: Record<string, Task[]> = {
    0: tasks.filter((task) => {
      const start = new Date();
      start.setHours(0, 0, 0, 0);
      const end = new Date();
      end.setHours(23, 59, 59, 999);
      return (
        task.myDay ||
        (task.due && task.due > start && task.due < end) ||
        (task.start && task.start > start && task.start < end)
      );
    }),
    1: tasks
      .filter(
        (task) =>
          task.due &&
          (userSettings?.showOverdue ? true : task.due > new Date()),
      )
      .sort((a, b) => a.due!.getTime() - b.due!.getTime()),
    2: tasks
      .filter((task) => task.priority && task.priority !== "None")
      .sort(
        (a, b) =>
          priorities.find((p) => p.name === b.priority)!.value -
          priorities.find((p) => p.name === a.priority)!.value,
      ),
    3: tasks
      .filter(
        (task) =>
          task.start &&
          (userSettings?.showOverdue ? true : task.start > new Date()),
      )
      .sort((a, b) => a.start!.getTime() - b.start!.getTime()),
    4: tasks.filter((task) => task.starred),
    6: tasks.slice(0, 5),
  };
  const displayedSections = dashboardSettings.filter(
    (s) => !userSettings || userSettings.selected.includes(s.id),
  );

  return (
    <div className="flex flex-col items-center py-10 gap-y-5 flex-1 h-[calc(100vh-68px)] overflow-auto relative">
      <h2 className="text-white font-bold text-2xl">Tasks Dashboard</h2>
      <p className="text-gray-300 text-center w-[60%]">
        Easily view and manage all your daily, starred, upcoming, and recent
        tasks, organized tags, and other information about your task lists on
        this dashboard!
      </p>
      <Options />
      <div className="flex flex-wrap w-full px-10 gap-5">
        {displayedSections.length > 0 ? (
          displayedSections.map((setting) => {
            return setting.id === 5 ? (
              <Tags
                key={setting.id}
                tags={tags}
                showCompleted={userSettings?.showCompleted}
              />
            ) : (
              <Section
                key={setting.id}
                title={setting.name}
                tasks={allTasks[setting.id] as TaskType[]}
                link={setting.id === 0 ? "/tasks/day" : undefined}
                sectionId={setting.id}
              >
                {setting.icon}
              </Section>
            );
          })
        ) : (
          <div className="h-100 w-full flex flex-col gap-y-5 justify-center items-center text-gray-300">
            <FaFaceFrown size={50} />
            <div className="text-center w-[60%]">
              You don&apos;t have any pinned sections on the homepage. Click on
              the settings icon on the top right to customize your dashboard!
            </div>
          </div>
        )}
      </div>
      <Settings settings={userSettings || undefined} />
    </div>
  );
}

export default Page;
