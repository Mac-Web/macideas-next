"use client";

import type {
  Folder,
  Note as NoteType,
  Project,
} from "@/generated/prisma/client";
import { useState, useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  FaBook,
  FaCheckCircle,
  FaEllipsisV,
  FaFolder,
  FaFolderOpen,
  FaPalette,
  FaPen,
  FaPlusCircle,
  FaTrash,
} from "react-icons/fa";
import { colorFolder, deleteFolder, renameFolder } from "@/app/tasks/actions";
import { createNote } from "@/app/notes/actions";
import { usePathname, useRouter } from "next/navigation";
import WarningModal from "../modals/WarningModal";
import FolderModal from "../modals/FolderModal";
import Note from "./Note";
import Input from "../ui/Input";

const optionStyles =
  "flex gap-x-2 items-center text-sm px-2 py-1.5 cursor-pointer hover:bg-gray-900 rounded";

export type FolderType = Folder & {
  notes: NoteType[];
};

interface FolderProps {
  folder: FolderType;
  folders: Folder[];
  notes: NoteType[];
  projects: Project[];
  existing?: string[];
}

function Folder({ folder, folders, notes, projects, existing }: FolderProps) {
  const [menuOpen, setMenuOpen] = useState<boolean>(false);
  const [deleting, setDeleting] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [rename, setRename] = useState<string | null>(null);
  const [folderOpen, setFolderOpen] = useState<boolean>(false);
  const [selecting, setSelecting] = useState<boolean>(false);
  const [adding, setAdding] = useState<boolean>(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const router = useRouter();

  async function handleRename(e?: React.MouseEvent) {
    e?.stopPropagation();
    if (rename) {
      await renameFolder(folder.id, rename, pathname);
      setRename(null);
    } else {
      setRename(folder.name);
      setMenuOpen(false);
    }
  }

  function handleEdit() {
    setSelecting(true);
    setFolderOpen(true);
  }

  async function handleCreate() {
    const id = await createNote(pathname, folder.id);
    setFolderOpen(true);
    if (id) router.push(`/notes/${id}`);
  }

  async function handleDelete() {
    setLoading(true);
    await deleteFolder(folder.id, pathname);
    setLoading(false);
    setDeleting(false);
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
    <>
      <div className="flex items-center group relative" ref={menuRef}>
        {rename !== null ? (
          <Input
            placeholder="New folder"
            value={rename}
            setValue={(r) => setRename(r)}
            styles="w-35 text-sm px-2 py-1"
            onblur={handleRename}
          />
        ) : (
          <div
            className="flex gap-x-3 items-center whitespace-nowrap text-gray-300 px-4 py-2 rounded
          group-hover:bg-gray-900/60 w-full cursor-pointer"
            onClick={() => setFolderOpen(!folderOpen)}
          >
            {folderOpen ? (
              <FaFolderOpen size={20} style={{ color: folder.color || "" }} />
            ) : (
              <FaFolder size={20} style={{ color: folder.color || "" }} />
            )}
            {folder.name.slice(0, 18) + (folder.name.length > 18 ? "..." : "")}
          </div>
        )}
        <FaPlusCircle
          className="absolute right-12 text-gray-300 group-hover:opacity-100 transition-opacity! opacity-0 cursor-pointer"
          title="Create note"
          size={17}
          onClick={handleCreate}
        />
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
                <div className={optionStyles} onClick={handleEdit}>
                  <FaCheckCircle size={15} /> Edit
                </div>
                <div className={optionStyles} onClick={() => setAdding(true)}>
                  <FaBook size={15} /> Projects
                </div>
                <div className={optionStyles} onClick={(e) => handleRename(e)}>
                  <FaPen size={15} /> Rename
                </div>
                <label className={optionStyles}>
                  <input
                    type="color"
                    className="hidden"
                    onChange={async (e) =>
                      await colorFolder(folder.id, e.target.value, pathname)
                    }
                  />
                  <FaPalette size={15} /> Color
                </label>
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
              description={`Are you sure you want to delete the folder ${folder.name}? This will delete all its data, task lists, tasks, and notes. This action cannot be undone.`}
              confirm={handleDelete}
              closeModal={() => setDeleting(false)}
              loading={loading}
            />
          )}
          {selecting && (
            <FolderModal
              folder={{ ...folder, taskLists: folder.notes }}
              taskLists={notes}
              closeModal={() => setSelecting(false)}
              isNote
            />
          )}
          {adding && (
            <FolderModal
              folder={{ ...folder, taskLists: folder.notes }}
              taskLists={projects}
              closeModal={() => setAdding(false)}
              isProject
              existing={existing}
            />
          )}
        </AnimatePresence>
      </div>
      {folderOpen && (
        <div className="flex flex-col gap-y-3 pl-5">
          {folder.notes.length > 0 ? (
            folder.notes.map((note) => (
              <Note key={note.id} note={note} folders={folders} />
            ))
          ) : (
            <div className="text-center text-gray-300 text-sm">
              No notes found in this folder.{" "}
              <span className="cursor-pointer underline" onClick={handleCreate}>
                Create one
              </span>
            </div>
          )}
        </div>
      )}
    </>
  );
}

export default Folder;

//TODO: merge this file with the one in /tasks since they're very similar also merge other component files in /notes with /tasks
