"use client";

import { FaBook, FaPlusCircle, FaFolderPlus } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { createFolder, createTaskList } from "@/app/tasks/actions";
import { createProject } from "@/app/projects/actions";

const optionStyles =
  "border-2 border-gray-700 rounded cursor-pointer hover:bg-gray-900 flex flex-col gap-y-2 items-center p-5 text-gray-300 w-40";

function Options() {
  const router = useRouter();

  async function handleCreate() {
    const id = await createTaskList("/tasks");
    router.push(`/tasks/${id}`);
  }

  async function handleCreateProject() {
    const id = await createProject("/tasks");
    if (id) router.push(`/projects/${id}`);
  }

  return (
    <div className="flex gap-x-3">
      <div className={optionStyles} onClick={handleCreate}>
        <FaPlusCircle size={25} />
        Create task list
      </div>
      <div
        className={optionStyles}
        onClick={async () => createFolder("/tasks")}
      >
        <FaFolderPlus size={25} /> Create folder
      </div>
      <div className={optionStyles} onClick={handleCreateProject}>
        <FaBook size={25} /> Create project
      </div>
    </div>
  );
}

export default Options;
