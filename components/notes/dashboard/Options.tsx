"use client";

import { createNote } from "@/app/notes/actions";
import { createProject } from "@/app/projects/actions";
import { createFolder } from "@/app/tasks/actions";
import { useRouter } from "next/navigation";
import { FaPlusCircle, FaFolderPlus, FaBook } from "react-icons/fa";

const optionStyles =
  "border-2 border-gray-700 rounded cursor-pointer hover:bg-gray-900 flex flex-col gap-y-2 items-center p-5 text-gray-300 w-40";

function Options() {
  const router = useRouter();

  async function handleCreate() {
    const id = await createNote("/notes");
    router.push(`/notes/${id}`);
  }

  async function handleCreateProject() {
    const id = await createProject("/notes");
    if (id) router.push(`/projects/${id}`);
  }

  return (
    <div className="flex gap-x-3">
      <div className={optionStyles} onClick={handleCreate}>
        <FaPlusCircle size={25} />
        Create note
      </div>
      <div
        className={optionStyles}
        onClick={async () => createFolder("/notes")}
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
