import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import Projects from "./Projects";

async function Page() {
  const session = await getSession();
  if (!session) redirect("/");
  const projects = await prisma.project.findMany({
    where: { userId: session.user.id },
    include: {
      folders: { include: { taskLists: true, notes: true } },
      taskLists: true,
      tasks: true,
      notes: true,
    },
    orderBy: { name: "asc" },
  });

  return (
    <div className="flex flex-col items-center py-10 gap-y-5 flex-1 h-[calc(100vh-68px)] overflow-auto relative px-10">
      <h2 className="text-white font-bold text-2xl">Projects Dashboard</h2>
      <p className="text-gray-300 text-center w-[60%]">
        Easily view, manage, and organize all your recent, starred, and other
        projects, as well as their tasks, task lists, notes, and folders on this
        dashboard!
      </p>
      <Projects projects={projects} />
    </div>
  );
}

export default Page;
