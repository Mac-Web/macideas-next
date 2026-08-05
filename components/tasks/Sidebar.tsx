import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { FaCheckCircle, FaRegStar } from "react-icons/fa";
import { Folder as FolderType } from "@/generated/prisma/client";
import CreateTaskList from "./CreateTaskList";
import TaskList from "./TaskList";
import Folder from "./Folder";
import Home from "./Home";
import Day from "./Day";

async function Sidebar() {
  const session = await getSession();
  if (!session) redirect("/");
  const taskLists = await prisma.taskList.findMany({
    where: { userId: session.user.id },
    orderBy: { updatedAt: "desc" },
  });
  const starredTaskLists = taskLists.filter((list) => list.starred);
  const orphanedLists = taskLists.filter((list) => !list.folderId);
  const folders = await prisma.folder.findMany({
    where: { userId: session.user.id },
    include: { taskLists: true },
    orderBy: { name: "asc" },
  });
  const cleanFolders: FolderType[] = folders.map((f) => {
    return { ...f, taskLists: undefined };
  });

  return (
    <div className="w-70 border-r border-gray-700 h-[calc(100vh-68px)] py-5 relative">
      <div className="flex flex-col gap-y-3 flex-1 h-[calc(100%-45px)] px-3 overflow-auto">
        <Home />
        <Day />
        {starredTaskLists.length > 0 && (
          <>
            <h2 className="text-white font-bold flex gap-x-3 px-2 mb-2 items-center">
              <FaRegStar size={15} /> Starred task lists
            </h2>
            {starredTaskLists.map((taskList) => {
              return (
                <TaskList
                  key={taskList.id}
                  taskList={taskList}
                  starred
                  folders={cleanFolders}
                />
              );
            })}
          </>
        )}
        <h2 className="text-white font-bold flex gap-x-3 px-2 items-center mb-2">
          <FaCheckCircle size={15} /> All task lists
        </h2>
        {folders?.map((folder) => (
          <Folder
            key={folder.id}
            folder={folder}
            taskLists={taskLists}
            folders={cleanFolders}
          />
        ))}
        {/* TODO: add drag and drop folders and starred folders? */}
        {taskLists.length > 0 ? (
          orphanedLists.map((taskList) => {
            return (
              <TaskList
                key={taskList.id}
                taskList={taskList}
                folders={cleanFolders}
              />
            );
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
