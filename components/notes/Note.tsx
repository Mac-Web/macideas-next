"use client";

import type { Note as NoteType } from "@/generated/prisma/client";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { FaStar, FaPen, FaEllipsisV, FaRegStar, FaTrash } from "react-icons/fa";
import { useState, useEffect, useRef } from "react";
import Emoji from "../ui/Emoji";
import Link from "next/link";
import Input from "../ui/Input";
import { FaNoteSticky } from "react-icons/fa6";
import WarningModal from "../modals/WarningModal";
import {
  addEmoji,
  deleteNote,
  renameNote,
  starNote,
} from "@/app/notes/actions";

const optionStyles =
  "flex gap-x-2 items-center text-sm px-2 py-1.5 cursor-pointer hover:bg-gray-900 rounded";

interface NoteProps {
  note: NoteType;
  starred?: boolean;
}

function Note({ note, starred }: NoteProps) {
  const [menuOpen, setMenuOpen] = useState<boolean>(false);
  const [deleting, setDeleting] = useState<boolean>(false);
  const [rename, setRename] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false); //TODO: add move to folder option
  const menuRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  async function handleDelete() {
    setLoading(true);
    await deleteNote(note.id);
    setLoading(false);
  }

  async function handleRename(e?: React.MouseEvent) {
    e?.stopPropagation();
    if (rename) {
      await renameNote(note.id, rename);
      setRename(null);
    } else {
      setRename(note.name);
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
          placeholder="Untitled note"
          value={rename}
          setValue={(r) => setRename(r)}
          styles="w-35 text-sm px-2 py-1"
          onblur={handleRename}
        />
      ) : (
        <Link
          href={`/notes/${note.id}`}
          className={`flex gap-x-3 items-center whitespace-nowrap text-gray-300 px-4 py-2 rounded group-hover:bg-gray-900/60
            w-full ${pathname.includes(note.id) && "bg-gray-900 group-hover:bg-gray-900! text-teal-600 font-bold"}`}
        >
          <Emoji
            setSelected={async (e) => await addEmoji(note.id, e)}
            placeholder={note.emoji || <FaNoteSticky size={20} />}
          />
          {note.name.slice(0, 18) + (note.name.length > 18 ? "..." : "")}{" "}
          {note.starred && !starred && (
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
                onClick={async () => await starNote(note.id, !note.starred)}
              >
                {note.starred ? (
                  <FaStar size={15} className="text-teal-600" />
                ) : (
                  <FaRegStar size={15} />
                )}{" "}
                {note.starred ? "Starred" : "Star"}
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
            description={`Are you sure you want to delete the note ${note.name}? This will delete all its data and content. This action cannot be undone.`}
            confirm={handleDelete}
            closeModal={() => setDeleting(false)}
            loading={loading}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

export default Note;
