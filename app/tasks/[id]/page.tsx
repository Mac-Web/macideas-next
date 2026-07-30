import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";

async function Page({ params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session) redirect("/");
  const { id } = await params;
  const taskList = await prisma.taskList.findUnique({
    where: { id, userId: session.user.id },
    include: { tasks: true },
  });
  if (!taskList) redirect("/tasks");

  return (
    <div className="flex flex-col items-center py-10 gap-y-5 flex-1">
      <h2 className="text-white font-bold text-2xl">{taskList.name}</h2>
      <p className="text-gray-300 text-center w-[65%]">
        You&apos;ll be able to add, view, and manage your tasks for this task
        list on this page soon!
      </p>
    </div>
  );
}

export default Page;
