"use client";

import { FaPlusCircle } from "react-icons/fa";
import { useState } from "react";
import { createTaskList } from "@/app/tasks/actions";
import { usePathname, useRouter } from "next/navigation";

function CreateTaskList() {
  const [loading, setLoading] = useState<boolean>(false);
  const pathname = usePathname();
  const router = useRouter();

  async function handleCreate() {
    setLoading(true);
    const id = await createTaskList(pathname);
    if (id) router.push(`/tasks/${id}`);
    setLoading(false);
  }

  return (
    <div
      className="border-2 border-gray-700 rounded hover:bg-gray-900 cursor-pointer absolute bottom-5 w-[calc(100%-20px)]
     flex items-center gap-x-3 text-gray-300 justify-center py-2"
      onClick={handleCreate}
    >
      <FaPlusCircle size={17} /> {loading ? "Creating..." : "Create task list"}
    </div>
  );
}

export default CreateTaskList;
