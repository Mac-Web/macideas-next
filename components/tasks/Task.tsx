"use client";

import type { Task as TaskType } from "@/generated/prisma/client";
import { AnimatePresence } from "framer-motion";
import {
  FaCalendar,
  FaPen,
  FaRegCircle,
  FaRegStar,
  FaStar,
  FaTag,
  FaTrash,
} from "react-icons/fa";
import { useState, useRef } from "react";
import { deleteTask, starTask } from "@/app/tasks/[id]/actions";
import WarningModal from "../modals/WarningModal";

const optionStyles = "opacity-0 group-hover:opacity-100 transition-opacity!";

interface TaskProps {
  task: TaskType;
  setDetails: React.Dispatch<React.SetStateAction<string | null>>;
}

function Task({ task, setDetails }: TaskProps) {
  const [deleting, setDeleting] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const menuRef = useRef<HTMLDivElement>(null);

  async function handleDelete() {
    setLoading(true);
    await deleteTask(task.id);
    setLoading(false);
  }

  function handlePanel(e: React.MouseEvent) {
    if (!menuRef.current?.contains(e.target as Node)) {
      setDetails((prev) => (prev === task.id ? null : task.id));
    }
  }

  return (
    <div
      className="group bg-gray-900 rounded px-3 py-2.5 flex items-center gap-x-3 cursor-pointer text-gray-300 relative"
      onClick={handlePanel}
    >
      <FaRegCircle size={17} title="Mark as completed" />
      <span>{task.text}</span>
      <div ref={menuRef} className="flex gap-x-5 absolute right-3">
        <FaPen size={15} title="Edit task" className={optionStyles} />
        <FaTag size={15} title="Edit tags" className={optionStyles} />
        <FaCalendar size={15} title="Edit due date" className={optionStyles} />
        {task.starred ? (
          <FaStar
            size={15}
            className="text-teal-600"
            title="Unmark as starred"
            onClick={async () => await starTask(task.id, !task.starred)}
          />
        ) : (
          <FaRegStar
            size={15}
            title="Mark as starred"
            className={optionStyles}
            onClick={async () => await starTask(task.id, !task.starred)}
          />
        )}
        <FaTrash
          size={15}
          className={"text-red-500 " + optionStyles}
          title="Delete task"
          onClick={() => setDeleting(true)}
        />
        <AnimatePresence>
          {deleting && (
            <WarningModal
              title="Delete confirmation"
              description={`Are you sure you want to delete the task ${task.text}? This action cannot be undone.`}
              confirm={handleDelete}
              closeModal={() => setDeleting(false)}
              loading={loading}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default Task;
