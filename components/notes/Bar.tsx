"use client";

import type { Folder, Note } from "@/generated/prisma/client";
import {
  FaFolder,
  FaImage,
  FaPalette,
  FaRedo,
  FaRegStar,
  FaStar,
  FaTrash,
} from "react-icons/fa";
import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import { FaNoteSticky } from "react-icons/fa6";
import {
  deleteNote,
  addEmoji,
  renameNote,
  starNote,
} from "@/app/notes/actions";
import { addDescription, resetBg, updateColor } from "@/app/notes/[id]/actions";
import WarningModal from "../modals/WarningModal";
import UploadModal from "../modals/UploadModal";
import Emoji from "../ui/Emoji";
import Input from "../ui/Input";

interface BarProps {
  note: Note;
  folder: Folder | null;
  saved?: boolean;
  background?: boolean;
  hasBg?: boolean;
}

function Bar({ note, folder, saved, background, hasBg }: BarProps) {
  const [deleting, setDeleting] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [editing, setEditing] = useState<string | null>(null);
  const [description, setDescription] = useState<string | null>(null);
  const [uploading, setUploading] = useState<boolean>(false);

  async function handleRename() {
    if (editing && editing.trim().length > 0) {
      setEditing(null);
      await renameNote(note.id, editing);
    }
  }

  async function handleDescription() {
    if (description !== note.description) {
      await addDescription(note.id, description?.trim() || "");
    }
    setDescription(null);
  }

  async function handleDelete() {
    setLoading(true);
    await deleteNote(note.id);
    setLoading(false);
  }

  return (
    <div className="w-full border-b border-b-gray-700 flex items-center gap-x-3 px-3 py-2 relative">
      <Emoji
        setSelected={async (e) => await addEmoji(note.id, e)}
        placeholder={note.emoji || <FaNoteSticky size={20} />}
      />
      {editing !== null ? (
        <Input
          placeholder="Untitled note"
          value={editing}
          setValue={(e) => setEditing(e)}
          styles="w-70 py-1!"
          onblur={handleRename}
        />
      ) : (
        <div
          className={`text-black dark:text-white font-bold text-lg flex gap-x-5 items-center cursor-pointer py-1 ${background && "text-white!"}`}
          onClick={() => setEditing(note.name)}
        >
          {note.name.slice(0, 40) + (note.name.length > 40 ? "..." : "")}
        </div>
      )}
      {description !== null ? (
        <Input
          placeholder="Untitled note"
          value={description}
          setValue={(d) => setDescription(d)}
          styles="w-50 py-1! text-sm"
          onblur={handleDescription}
        />
      ) : note.description ? (
        <div
          className={`text-xs text-black dark:text-gray-300 cursor-pointer ${background && "text-white!"}`}
          onClick={() => setDescription(note.description)}
        >
          {note.description}
        </div>
      ) : (
        <div
          className={`hover:underline text-xs text-black dark:text-gray-300 cursor-pointer ${background && "text-white!"}`}
          onClick={() => setDescription("")}
        >
          Add description
        </div>
      )}
      {folder && (
        <div
          className={`ml-3 flex text-black dark:text-gray-300 items-center gap-x-2 text-xs ${background && "text-white!"}`}
        >
          <FaFolder size={15} style={{ color: folder.color || "" }} />{" "}
          {folder.name}
        </div>
      )}
      <div
        className={`opacity-0 ${saved && "opacity-100"} transition-opacity! text-xs pl-10  ${background && "text-white!"}`}
      >
        Note saved
      </div>
      <div
        className={`absolute right-3 flex items-center gap-x-5 text-black dark:text-gray-300 ${background && "text-white!"}`}
      >
        {hasBg && (
          <FaRedo
            size={17}
            title="Reset background image and color"
            className="cursor-pointer"
            onClick={async () => await resetBg(note.id)}
          />
        )}
        <FaImage
          size={17}
          title="Upload background image"
          className="cursor-pointer"
          onClick={() => setUploading(true)}
        />
        <label className="cursor-pointer" title="Customize color">
          <input
            type="color"
            onChange={async (e) => await updateColor(note.id, e.target.value)}
            className="hidden"
          />
          <FaPalette size={17} />
        </label>
        <div
          className="cursor-pointer"
          onClick={async () => await starNote(note.id, !note.starred)}
        >
          {note.starred ? (
            <FaStar
              size={17}
              title="Unmark as starred"
              className="text-teal-600"
            />
          ) : (
            <FaRegStar size={17} title="Mark as starred" />
          )}
        </div>
        <FaTrash
          size={17}
          title="Delete note"
          className="text-red-500 cursor-pointer"
          onClick={() => setDeleting(true)}
        />
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
        {uploading && (
          <UploadModal
            id={note.id}
            closeModal={() => setUploading(false)}
            isNote
          />
        )}
      </AnimatePresence>
    </div>
  );
}

export default Bar;
