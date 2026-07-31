import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { FaCheckCircle, FaRegStar } from "react-icons/fa";
import CreateTaskList from "./CreateTaskList";
import TaskList from "./TaskList";

async function Sidebar() {
  const session = await getSession();
  if (!session) redirect("/");
  const taskLists = await prisma.taskList.findMany({
    where: { userId: session.user.id },
    orderBy: { updatedAt: "desc" },
  });
  const starredTaskLists = taskLists.filter((list) => list.starred);

  return (
    <div className="w-70 border-r border-gray-700 h-[calc(100vh-68px)] py-5 relative">
      <div className="flex flex-col gap-y-3 flex-1 h-[calc(100%-45px)] px-5 overflow-auto">
        {starredTaskLists.length > 0 && (
          <>
            <h2 className="text-white font-bold flex gap-x-3 mb-2 items-center cursor-pointer">
              <FaRegStar size={15} /> Starred task lists
            </h2>
            {starredTaskLists.map((taskList) => {
              return <TaskList key={taskList.id} taskList={taskList} starred />;
            })}
          </>
        )}
        <h2 className="text-white font-bold flex gap-x-3 items-center mb-2">
          <FaCheckCircle size={15} /> All task lists
        </h2>
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
