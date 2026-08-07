"use client";

import { FaPlusCircle } from "react-icons/fa";
import { useState } from "react";
import { createProject } from "@/app/projects/actions";
import { usePathname, useRouter } from "next/navigation";

function Create() {
  const [loading, setLoading] = useState<boolean>(false);
  const pathname = usePathname();
  const router = useRouter();

  async function handleCreateProject() {
    setLoading(true);
    const id = await createProject(pathname);
    if (id) router.push(`/projects/${id}`);
    setLoading(false);
  }

  return (
    <div
      className="absolute bottom-3 w-[calc(100%-40px)] left-5 flex text-gray-300 justify-center border-2 hover:bg-gray-900 flex-1 py-2 cursor-pointer border-gray-700 rounded items-center gap-x-3 bg-gray-950 z-5"
      onClick={handleCreateProject}
    >
      <FaPlusCircle size={17} /> {loading ? "Creating..." : "Create project"}
    </div>
  );
}

export default Create;
