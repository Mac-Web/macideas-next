"use client";

import type { Folder, Note, Task, TaskList } from "@/generated/prisma/client";
import type { SelectionType } from "../modals/AddModal";
import { useState } from "react";
import { FaPlus } from "react-icons/fa";
import { AnimatePresence } from "framer-motion";
import AddModal from "../modals/AddModal";

interface AddProps {
  id: string;
  folders: Folder[];
  taskLists: TaskList[];
  tasks: Task[];
  notes: Note[];
  existing: SelectionType[];
}

function Add({ id, folders, taskLists, tasks, notes, existing }: AddProps) {
  const [menuOpen, setMenuOpen] = useState<boolean>(false);

  return (
    <>
      <div
        onClick={() => setMenuOpen(true)}
        className="absolute top-10 right-10 text-gray-300 cursor-pointer border-2 border-gray-700 rounded p-1.5
          hover:bg-gray-900"
        title="Add to project"
      >
        <FaPlus size={20} />
      </div>
      <AnimatePresence>
        {menuOpen && (
          <AddModal
            id={id}
            folders={folders}
            taskLists={taskLists}
            tasks={tasks}
            notes={notes}
            existing={existing}
            closeModal={() => setMenuOpen(false)}
          />
        )}
      </AnimatePresence>
    </>
  );
}

export default Add;
