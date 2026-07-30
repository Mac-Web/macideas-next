"use client";

import type { TaskList as TaskListType } from "@/generated/prisma/client";
import { useState, useRef, useEffect } from "react";
import { usePathname } from "next/navigation";
import { FaEllipsisV, FaPen, FaRegStar, FaTrash } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { deleteTaskList, renameTaskList } from "@/app/tasks/actions";
import Link from "next/link";
import Modal from "../ui/Modal";
import Btn from "../ui/Btn";
import Input from "../ui/Input";

const optionStyles =
  "flex gap-x-2 items-center text-sm px-2 py-1.5 cursor-pointer hover:bg-gray-900 rounded";

function TaskList({ taskList }: { taskList: TaskListType }) {
  const [menuOpen, setMenuOpen] = useState<boolean>(false);
  const [deleting, setDeleting] = useState<boolean>(false);
  const [rename, setRename] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  async function handleDelete() {
    setLoading(true);
    await deleteTaskList(taskList.id);
    setLoading(false);
  }

  async function handleRename(e?: React.MouseEvent) {
    e?.stopPropagation();
    if (rename) {
      await renameTaskList(taskList.id, rename);
      setRename(null);
    } else {
      setRename(taskList.name);
      setMenuOpen(false);
    }
  }

  useEffect(() => {
    const clickHandler = (e: MouseEvent) => {
      if (!menuRef.current?.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("click", clickHandler);
    return () => {
      document.removeEventListener("click", clickHandler);
    };
  }, []);

  return (
    <div className="flex items-center group relative" ref={menuRef}>
      {rename !== null ? (
        <Input
          placeholder="Untitled task list"
          value={rename}
          setValue={(r) => setRename(r)}
          styles="w-35 text-sm px-2 py-1"
          onblur={handleRename}
        />
      ) : (
        <Link
          href={`/tasks/${taskList.id}`}
          className={`text-gray-300 px-4 py-2 rounded group-hover:bg-gray-900/60 w-full
        ${pathname.includes(taskList.id) && "bg-gray-900 group-hover:bg-gray-900! text-teal-600 font-bold"}`}
        >
          {taskList.name}
        </Link>
      )}
      <div
        className={`cursor-pointer absolute right-4 ${!menuOpen && "opacity-0"} text-gray-300 group-hover:opacity-100 transition-opacity! z-5`}
        onClick={() => setMenuOpen(true)}
      >
        <FaEllipsisV size={17} />
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col gap-y-1 border-2 border-gray-700 rounded p-2 bg-gray-950 absolute right-0
           top-[calc(100%+8px)]"
            >
              <div className={optionStyles} onClick={(e) => handleRename(e)}>
                <FaPen size={15} /> Rename
              </div>
              <div className={optionStyles}>
                <FaRegStar size={15} /> Star
              </div>
              <div
                className={optionStyles + " text-red-500"}
                onClick={() => setDeleting(true)}
              >
                <FaTrash size={15} /> Delete
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <AnimatePresence>
        {deleting && (
          <Modal closeModal={() => setDeleting(false)}>
            <div className="flex flex-col gap-y-5">
              <h2 className="text-white text-xl font-bold">
                Delete confirmation
              </h2>
              <p className="text-gray-300">
                Are you sure you want to delete the task list {taskList.name}?
                This will delete all its data and tasks. This action cannot be
                undone.
              </p>
              <div className="flex gap-x-3">
                <Btn
                  text={loading ? "Loading..." : "Confirm"}
                  onclick={handleDelete}
                  styles="bg-red-600! hover:bg-red-700! border-red-600! hover:border-red-700!"
                  primary
                />
                <Btn text="Cancel" onclick={() => setDeleting(false)} />
              </div>
            </div>
          </Modal>
        )}
      </AnimatePresence>
    </div>
  );
}

export default TaskList;
