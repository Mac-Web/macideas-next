"use client";

import type {
  Folder,
  TaskList as TaskListType,
} from "@/generated/prisma/client";
import { useState, useRef, useEffect } from "react";
import { usePathname } from "next/navigation";
import {
  FaEllipsisV,
  FaPen,
  FaRegFolder,
  FaRegStar,
  FaStar,
  FaTrash,
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import {
  addEmoji,
  deleteTaskList,
  renameTaskList,
  starTaskList,
} from "@/app/tasks/actions";
import { BsList } from "react-icons/bs";
import Emoji from "../ui/Emoji";
import WarningModal from "../modals/WarningModal";
import Input from "../ui/Input";
import Link from "next/link";
import MoveModal from "../modals/MoveModal";

const optionStyles =
  "flex gap-x-2 items-center text-sm px-2 py-1.5 cursor-pointer hover:bg-gray-900 rounded";

interface TaskListProps {
  taskList: TaskListType;
  starred?: boolean;
  folders: Folder[];
}

function TaskList({ taskList, starred, folders }: TaskListProps) {
  const [menuOpen, setMenuOpen] = useState<boolean>(false);
  const [deleting, setDeleting] = useState<boolean>(false);
  const [rename, setRename] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [moving, setMoving] = useState<boolean>(false);
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
          className={`flex gap-x-3 items-center whitespace-nowrap text-gray-300 px-4 py-2 rounded group-hover:bg-gray-900/60
            w-full ${pathname.includes(taskList.id) && "bg-gray-900 group-hover:bg-gray-900! text-teal-600 font-bold"}`}
        >
          <Emoji
            setSelected={async (e) => await addEmoji(taskList.id, e)}
            placeholder={taskList.emoji || <BsList size={20} />}
          />
          {taskList.name.slice(0, 18) +
            (taskList.name.length > 18 ? "..." : "")}{" "}
          {taskList.starred && !starred && (
            <FaStar size={13} className="text-teal-600" title="Starred" />
          )}
        </Link>
      )}
      <div
        className={`cursor-pointer absolute right-4 ${!menuOpen && "opacity-0"} text-gray-300 group-hover:opacity-100 transition-opacity!`}
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
           top-[calc(100%+8px)] z-5"
            >
              <div className={optionStyles} onClick={(e) => handleRename(e)}>
                <FaPen size={15} /> Rename
              </div>
              <div
                className={optionStyles}
                onClick={async () =>
                  await starTaskList(taskList.id, !taskList.starred)
                }
              >
                {taskList.starred ? (
                  <FaStar size={15} className="text-teal-600" />
                ) : (
                  <FaRegStar size={15} />
                )}{" "}
                {taskList.starred ? "Starred" : "Star"}
              </div>
              <div className={optionStyles} onClick={() => setMoving(true)}>
                <FaRegFolder size={15} /> Move
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
          <WarningModal
            title="Delete confirmation"
            description={`Are you sure you want to delete the task list ${taskList.name}? This will delete all its data and tasks. This action cannot be undone.`}
            confirm={handleDelete}
            closeModal={() => setDeleting(false)}
            loading={loading}
          />
        )}
        {moving && (
          <MoveModal
            id={taskList.id}
            folders={folders}
            folder={taskList.folderId}
            closeModal={() => setMoving(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

export default TaskList;
