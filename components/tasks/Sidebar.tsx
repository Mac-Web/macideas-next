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
  });
  const starredTaskLists = taskLists.filter((list) => list.starred);

  return (
    <div className="w-60 border-r border-gray-700 h-[calc(100vh-68px)] py-5 relative">
      {starredTaskLists.length > 0 && (
        <>
          <h2 className="text-white font-bold flex gap-x-3 items-center mb-5 cursor-pointer">
            <FaRegStar size={15} /> Starred task lists
          </h2>
          <div className="flex flex-col gap-y-3 flex-1 pr-5 overflow-auto mb-5">
            {starredTaskLists.map((taskList) => {
              return <TaskList key={taskList.id} taskList={taskList} starred />;
            })}
          </div>
        </>
      )}
      <h2 className="text-white font-bold flex gap-x-3 items-center mb-5">
        <FaCheckCircle size={15} /> All task lists
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
