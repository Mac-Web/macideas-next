import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import CreateTaskList from "./CreateTaskList";
import TaskList from "./TaskList";

async function Sidebar() {
  const session = await getSession();
  if (!session) redirect("/");
  const taskLists = await prisma.taskList.findMany({
    where: { userId: session.user.id },
  });

  return (
    <div className="w-60 border-r border-gray-700 h-[calc(100vh-68px)] py-5 relative">
      <h2 className="text-white font-bold text-xl text-center mb-5">
        Your Tasks
      </h2>
      <div className="flex flex-col gap-y-3 flex-1 h-[calc(100%-100px)] pr-5 overflow-auto">
        {taskLists.length > 0 ? (
          taskLists.map((taskList) => {
            return <TaskList key={taskList.id} taskList={taskList} />;
          })
        ) : (
          <div className="text-sm text-center text-gray-300 py-5">
            No task lists found
          </div>
        )}
      </div>
      <CreateTaskList />
    </div>
  );
}

export default Sidebar;
