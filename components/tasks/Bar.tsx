"use client";

import type { Folder, TaskList } from "@/generated/prisma/client";
import { useState } from "react";
import {
  FaFolder,
  FaImage,
  FaPalette,
  FaRegStar,
  FaStar,
  FaSun,
  FaTrash,
} from "react-icons/fa";
import {
  addEmoji,
  deleteTaskList,
  renameTaskList,
  starTaskList,
} from "@/app/tasks/actions";
import { addDescription } from "@/app/tasks/[id]/actions";
import { AnimatePresence } from "framer-motion";
import { BsList } from "react-icons/bs";
import WarningModal from "../modals/WarningModal";
import Input from "../ui/Input";
import Emoji from "../ui/Emoji";

interface BarProps {
  taskList: TaskList;
  folder: Folder | null;
  myDay?: boolean;
}

function Bar({ taskList, folder, myDay }: BarProps) {
  const [editing, setEditing] = useState<string | null>(null);
  const [description, setDescription] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  async function handleRename() {
    if (editing && editing.trim().length > 0) {
      setEditing(null);
      await renameTaskList(taskList.id, editing);
    }
  }

  async function handleDescription() {
    if (description !== taskList.description) {
      await addDescription(taskList.id, description?.trim() || "");
    }
    setDescription(null);
  }

  async function handleDelete() {
    setLoading(true);
    await deleteTaskList(taskList.id);
    setLoading(false);
  }

  return (
    <div className="w-full border-b border-b-gray-700 flex items-center gap-x-3 px-3 py-2 relative">
      {myDay ? (
        <FaSun size={20} className="text-gray-300" />
      ) : (
        <Emoji
          setSelected={async (e) => await addEmoji(taskList.id, e)}
          placeholder={taskList.emoji || <BsList size={20} />}
        />
      )}
      {editing !== null ? (
        <Input
          placeholder="Untitled task list"
          value={editing}
          setValue={(e) => setEditing(e)}
          styles="w-70 py-1!"
          onblur={handleRename}
        />
      ) : (
        <div
          className="text-white font-bold text-lg flex gap-x-5 items-center cursor-pointer py-1"
          onClick={() => !myDay && setEditing(taskList.name)}
        >
          {taskList.name.slice(0, 40) +
            (taskList.name.length > 40 ? "..." : "")}
        </div>
      )}
      {description !== null ? (
        <Input
          placeholder="Untitled task list"
          value={description}
          setValue={(d) => setDescription(d)}
          styles="w-50 py-1! text-sm"
          onblur={handleDescription}
        />
      ) : taskList.description ? (
        <div
          className="text-xs text-gray-300 cursor-pointer"
          onClick={() => !myDay && setDescription(taskList.description)}
        >
          {taskList.description}
        </div>
      ) : (
        <div
          className="hover:underline text-xs text-gray-300 cursor-pointer"
          onClick={() => setDescription("")}
        >
          Add description
        </div>
      )}
      {folder && (
        <div className="ml-3 flex text-gray-300 items-center gap-x-2 text-xs">
          <FaFolder size={15} style={{ color: folder.color || "" }} />{" "}
          {folder.name}
        </div>
      )}
      {!myDay && (
        <div className="absolute right-3 flex items-center gap-x-5 text-gray-300">
          <FaImage
            size={17}
            className="cursor-pointer"
            title="Upload background image"
          />
          <label className="cursor-pointer" title="Customize color">
            <input
              type="color"
              onChange={(e) => console.log(e.target.value)}
              className="hidden"
            />
            <FaPalette size={17} />
            {/* TODO: add option to upload/choose custom background and theme */}
          </label>
          <div
            className="cursor-pointer"
            onClick={async () =>
              await starTaskList(taskList.id, !taskList.starred)
            }
          >
            {taskList.starred ? (
              <FaStar
                size={17}
                className="text-teal-600"
                title="Starred task list"
              />
            ) : (
              <FaRegStar
                size={17}
                className="text-gray-300"
                title="Star task list"
              />
            )}
          </div>
          <FaTrash
            size={17}
            className="text-red-500 cursor-pointer"
            title="Delete task list"
            onClick={() => setDeleting(true)}
          />
        </div>
      )}
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
      </AnimatePresence>
    </div>
  );
}

export default Bar;
