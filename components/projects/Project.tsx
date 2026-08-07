"use client";

import type { Project as ProjectType } from "@/generated/prisma/client";
import { useState, useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  FaBook,
  FaEllipsisV,
  FaPen,
  FaRegStar,
  FaStar,
  FaTrash,
} from "react-icons/fa";
import {
  addEmoji,
  deleteProject,
  renameProject,
  starProject,
} from "@/app/projects/actions";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Input from "../ui/Input";
import Emoji from "../ui/Emoji";
import WarningModal from "../modals/WarningModal";

const optionStyles =
  "flex gap-x-2 items-center text-sm px-2 py-1.5 cursor-pointer hover:bg-gray-900 rounded";

interface ProjectProps {
  project: ProjectType;
  starred?: boolean;
}

function Project({ project, starred }: ProjectProps) {
  const [rename, setRename] = useState<string | null>(null);
  const [menuOpen, setMenuOpen] = useState<boolean>(false);
  const [deleting, setDeleting] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  async function handleRename(e?: React.MouseEvent) {
    e?.stopPropagation();
    if (rename && rename.trim().length > 0) {
      await renameProject(project.id, rename);
      setRename(null);
    } else {
      setRename(project.name);
      setMenuOpen(false);
    }
  }

  async function handleDelete() {
    setLoading(true);
    await deleteProject(project.id);
    setLoading(false);
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
          placeholder="Untitled note"
          value={rename}
          setValue={(r) => setRename(r)}
          styles="w-35 text-sm px-2 py-1"
          onblur={handleRename}
        />
      ) : (
        <Link
          href={`/projects/${project.id}`}
          className={`flex gap-x-3 items-center whitespace-nowrap text-gray-300 px-4 py-2 rounded group-hover:bg-gray-900/60
            w-full ${pathname.includes(project.id) && "bg-gray-900 group-hover:bg-gray-900! text-teal-600 font-bold"}`}
        >
          <Emoji
            setSelected={async (e) => await addEmoji(project.id, e)}
            placeholder={project.emoji || <FaBook size={20} />}
          />
          {project.name.slice(0, 18) + (project.name.length > 18 ? "..." : "")}{" "}
          {project.starred && !starred && (
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
                  await starProject(project.id, !project.starred)
                }
              >
                {project.starred ? (
                  <FaStar size={15} className="text-teal-600" />
                ) : (
                  <FaRegStar size={15} />
                )}{" "}
                {project.starred ? "Starred" : "Star"}
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
        <AnimatePresence>
          {deleting && (
            <WarningModal
              title="Delete confirmation"
              description={`Are you sure you want to delete the project ${project.name}? This will delete all its data, tasks, task lists, notes, and everything else! This action cannot be undone.`}
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

export default Project;
