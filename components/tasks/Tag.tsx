"use client";

import type { Tag as TagType } from "@/generated/prisma/client";
import { AnimatePresence, motion } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import { FaEllipsisV, FaPalette, FaPen, FaTag, FaTrash } from "react-icons/fa";
import {
  colorTag,
  deleteTag,
  emojiTag,
  renameTag,
} from "@/app/tasks/[id]/actions";
import WarningModal from "../modals/WarningModal";
import Checkbox from "../ui/Checkbox";
import Input from "../ui/Input";
import Emoji from "../ui/Emoji";

const optionStyles =
  "flex gap-x-2 items-center text-sm px-2 py-1.5 cursor-pointer hover:bg-gray-900 rounded";

interface TagProps {
  tag: TagType;
  selected: boolean;
  setSelected: (value: boolean) => void;
  taskListId: string;
}

function Tag({ tag, selected, setSelected, taskListId }: TagProps) {
  const [menuOpen, setMenuOpen] = useState<boolean>(false);
  const [rename, setRename] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const emojiRef = useRef<HTMLDivElement>(null);

  function handleOpen(e: React.MouseEvent) {
    e.preventDefault();
    setMenuOpen(!menuOpen);
  }

  async function handleRename(e?: React.MouseEvent) {
    e?.preventDefault();
    if (!rename) {
      setRename(tag.name);
      setMenuOpen(false);
    } else if (rename.trim().length > 0) {
      await renameTag(tag.id, rename, taskListId);
      setRename(null);
    }
  }

  async function handleDelete(e?: React.MouseEvent) {
    e?.preventDefault();
    if (deleting) {
      setLoading(true);
      await deleteTag(tag.id, taskListId);
      setLoading(false);
      setDeleting(false);
    } else {
      setDeleting(true);
    }
  }

  async function handleEmoji(e?: React.MouseEvent, emoji?: string) {
    e?.preventDefault();
    if (e) {
      emojiRef.current?.click();
    } else {
      await emojiTag(tag.id, emoji || "", taskListId);
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
    <label
      className="relative flex items-center border-2 border-gray-700 rounded hover:bg-gray-900 px-3 py-1.5
    cursor-pointer"
      style={{ backgroundColor: tag.color || undefined }}
    >
      {rename !== null ? (
        <Input
          placeholder="New tag"
          value={rename}
          setValue={(r) => setRename(r)}
          onblur={handleRename}
          styles="py-1 text-sm!"
        />
      ) : (
        <Checkbox
          text={tag.name}
          checked={selected}
          setChecked={setSelected}
          icon={tag.emoji || <FaTag size={15} />}
        />
      )}
      <div
        className="cursor-pointer absolute right-3 text-gray-300"
        ref={menuRef}
      >
        <FaEllipsisV size={17} onClick={handleOpen} />
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col gap-y-1 border-2 border-gray-700 rounded p-2 bg-gray-950 absolute right-0
           top-[calc(100%+8px)] z-5"
            >
              <div className={optionStyles} onClick={handleRename}>
                <FaPen size={15} /> Rename
              </div>
              <div className={optionStyles} onClick={(e) => handleEmoji(e)}>
                <Emoji
                  setSelected={(e) => handleEmoji(undefined, e)}
                  placeholder={tag.emoji}
                  ref={emojiRef}
                />
                Emoji
              </div>
              <label className={optionStyles}>
                <input
                  type="color"
                  className="hidden"
                  onChange={async (e) =>
                    await colorTag(tag.id, e.target.value, taskListId)
                  }
                />
                <FaPalette size={15} /> Color
              </label>
              <div
                className={optionStyles + " text-red-500"}
                onClick={handleDelete}
              >
                <FaTrash size={15} /> Delete
              </div>
              <AnimatePresence>
                {deleting && (
                  <WarningModal
                    title="Delete confirmation"
                    description={`Are you sure you want to delete the tag ${tag.name}? This will remove it from all existing tasks. This action cannot be undone.`}
                    confirm={() => handleDelete()}
                    closeModal={() => setDeleting(false)}
                    loading={loading}
                  />
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </label>
  );
}

export default Tag;
