"use client";

import { FaBook, FaChevronUp, FaFolder, FaPlusCircle } from "react-icons/fa";
import { useState } from "react";
import { createTaskList } from "@/app/tasks/actions";
import { AnimatePresence, motion } from "framer-motion";
import { usePathname, useRouter } from "next/navigation";

const optionStyles =
  "flex gap-x-2 items-center text-sm px-4 py-2 cursor-pointer hover:bg-gray-900 rounded";

function CreateTaskList() {
  const [loading, setLoading] = useState<boolean>(false);
  const [menuOpen, setMenuOpen] = useState<boolean>(false);
  const pathname = usePathname();
  const router = useRouter();

  async function handleCreate() {
    setLoading(true);
    const id = await createTaskList(pathname);
    if (id) router.push(`/tasks/${id}`);
    setLoading(false);
  }

  return (
    <div className="absolute bottom-3 w-[calc(100%-20px)] flex gap-x-2 text-gray-300 justify-center">
      <div
        className="border-2 hover:bg-gray-900 flex-1 justify-center py-2 cursor-pointer border-gray-700 rounded flex
        items-center gap-x-3 bg-gray-950 z-5"
        onClick={handleCreate}
      >
        <FaPlusCircle size={17} />{" "}
        {loading ? "Creating..." : "Create task list"}
      </div>
      <div
        className="border-2 hover:bg-gray-900 p-2 flex items-center justify-center w-10 cursor-pointer border-gray-700
         rounded bg-gray-950 z-5"
        onClick={() => setMenuOpen(!menuOpen)}
      >
        <FaChevronUp
          className={`transition-transform! ${menuOpen && "rotate-180"}`}
          size={17}
        />
      </div>
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: 80, scaleY: 0 }}
            animate={{ opacity: 1, y: 0, scaleY: 1 }}
            exit={{ opacity: 0, y: 80, scaleY: 0 }}
            className="absolute bottom-13 z-1 border-gray-700 border-2 rounded p-2 flex flex-col gap-y-1 w-full"
          >
            <div className={optionStyles}>
              <FaFolder size={17} /> Create Folder
            </div>
            <div className={optionStyles}>
              <FaBook size={17} /> Create Project
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default CreateTaskList;
