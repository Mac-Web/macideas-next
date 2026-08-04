import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { priorities } from "@/lib/constants";
import {
  FaCalendarCheck,
  FaCalendarDay,
  FaCheckCircle,
  FaClock,
  FaStar,
} from "react-icons/fa";
import Section from "@/components/tasks/dashboard/Section";
import Tags from "@/components/tasks/dashboard/Tags";

async function Page() {
  const session = await getSession();
  if (!session) redirect("/");
  const tasks = await prisma.task.findMany({
    where: { userId: session.user.id, completed: false }, //TODO: add settings to also show completed tasks on dashboard?
    orderBy: { createdAt: "desc" },
  });
  const tags = await prisma.tag.findMany({
    where: { userId: session.user.id },
    include: { tasks: true },
  });
  const starredTasks = tasks.filter((task) => task.starred);
  const priorityTasks = tasks
    .filter((task) => task.priority && task.priority !== "None")
    .sort(
      (a, b) =>
        priorities.find((p) => p.name === b.priority)!.value -
        priorities.find((p) => p.name === a.priority)!.value,
    );
  const upcomingTasks = tasks
    .filter((task) => task.due && task.due > new Date())
    .sort((a, b) => a.due!.getTime() - b.due!.getTime());
  const startTasks = tasks
    .filter((task) => task.start && task.start > new Date())
    .sort((a, b) => a.start!.getTime() - b.start!.getTime());
  const recentTasks = tasks.slice(0, 5);

  return (
    <div className="flex flex-col items-center py-10 gap-y-5 flex-1 h-[calc(100vh-68px)] overflow-auto">
      <h2 className="text-white font-bold text-2xl">Tasks Dashboard</h2>
      <p className="text-gray-300 text-center w-[60%]">
        Easily view and manage all your daily, starred, upcoming, and recent
        tasks, organized tags, and other information about your task lists on
        this dashboard!
      </p>
      <div className="flex flex-wrap w-full px-10 gap-5">
        <Section title="Due soon" tasks={upcomingTasks}>
          <FaCalendarCheck size={40} />
        </Section>
        <Section title="Priority tasks" tasks={priorityTasks}>
          <FaCheckCircle size={40} />
        </Section>
        <Section title="Start soon" tasks={startTasks}>
          <FaCalendarDay size={40} />
        </Section>
        <Section title="Starred tasks" tasks={starredTasks}>
          <FaStar size={40} />
        </Section>
        <Tags tags={tags} />
        <Section title="Recently created tasks" tasks={recentTasks}>
          <FaClock size={40} />
        </Section>
      </div>
    </div>
  );
}

export default Page;
