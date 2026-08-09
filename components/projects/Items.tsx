"use client";

import type { FolderType } from "@/app/projects/Projects";
import type { ProjectType } from "@/app/projects/Projects";
import { FaCheckCircle, FaFolder, FaFrown } from "react-icons/fa";
import { BsList } from "react-icons/bs";
import { FaNoteSticky } from "react-icons/fa6";
import { useRouter } from "next/navigation";
import { addEmoji } from "@/app/tasks/actions";
import { addEmoji as addNoteEmoji } from "@/app/notes/actions";
import Emoji from "../ui/Emoji";

const itemStyles =
  "border-2 border-gray-700 rounded px-4 py-2 hover:bg-gray-900 cursor-pointer flex items-center gap-x-3 text-gray-300 select-none";

interface ItemsProps {
  open: ProjectType;
  search: string;
  handleOpen: (folder: FolderType) => void;
}

function Items({ open, search, handleOpen }: ItemsProps) {
  const router = useRouter();

  return (
    <>
      {open.folders
        .filter((i) =>
          i.name.toLowerCase().includes(search.trim().toLowerCase()),
        )
        .map((folder) => {
          return (
            <div
              key={folder.id}
              className={itemStyles}
              title="Open folder"
              onDoubleClick={() => handleOpen(folder)}
            >
              <div className="flex items-center gap-x-3 flex-4">
                <FaFolder
                  size={25}
                  className="w-8"
                  style={{ color: folder.color || "" }}
                />{" "}
                {folder.name}
              </div>
              <div
                className="flex-1 text-xs flex items-center gap-x-2"
                title="This item is a folder"
              >
                <FaFolder />
                Folder
              </div>
              <div
                className="flex-1 text-xs"
                title={folder.updatedAt.toISOString()}
              >
                Modified {folder.updatedAt.toLocaleDateString()}
              </div>
              <div
                className="flex-1 text-xs"
                title={folder.createdAt.toISOString()}
              >
                Created {folder.createdAt.toLocaleDateString()}
              </div>
            </div>
          );
        })}
      {open.taskLists
        .filter((i) =>
          i.name.toLowerCase().includes(search.trim().toLowerCase()),
        )
        .map((taskList) => {
          return (
            <div
              key={taskList.id}
              onDoubleClick={() => router.push(`/tasks/${taskList.id}`)}
              className={itemStyles}
              title="Go to task list"
            >
              <div className="flex items-center gap-x-3 flex-4">
                <Emoji
                  setSelected={async (e) => await addEmoji(taskList.id, e)}
                  placeholder={taskList.emoji || <BsList size={25} />}
                  styles="text-xl w-8"
                />
                {taskList.name}
              </div>
              <div
                className="flex-1 text-xs flex items-center gap-x-2"
                title="This item is a task list"
              >
                <BsList />
                Task list
              </div>
              <div
                className="flex-1 text-xs"
                title={taskList.updatedAt.toISOString()}
              >
                Modified {taskList.updatedAt.toLocaleDateString()}
              </div>
              <div
                className="flex-1 text-xs"
                title={taskList.createdAt.toISOString()}
              >
                Created {taskList.createdAt.toLocaleDateString()}
              </div>
            </div>
          );
        })}
      {open.tasks
        .filter((i) =>
          i.text.toLowerCase().includes(search.trim().toLowerCase()),
        )
        .map((task) => {
          return (
            <div
              key={task.id}
              onDoubleClick={() =>
                router.push(`/tasks/${task.taskListId}?task=${task.id}`)
              }
              className={itemStyles}
              title="Go to task"
            >
              <div className="flex items-center gap-x-3 flex-4">
                <FaCheckCircle size={25} className="w-8" /> {task.text}
              </div>
              <div
                className="flex-1 text-xs flex items-center gap-x-2"
                title="This item is a task"
              >
                <FaCheckCircle />
                Task
              </div>
              <div
                className="flex-1 text-xs"
                title={task.updatedAt.toISOString()}
              >
                Modified {task.updatedAt.toLocaleDateString()}
              </div>
              <div
                className="flex-1 text-xs"
                title={task.createdAt.toISOString()}
              >
                Created {task.createdAt.toLocaleDateString()}
              </div>
            </div>
          );
        })}
      {open.notes
        .filter((i) =>
          i.name.toLowerCase().includes(search.trim().toLowerCase()),
        )
        .map((note) => {
          return (
            <div
              key={note.id}
              onDoubleClick={() => router.push(`/notes/${note.id}`)}
              className={itemStyles}
              title="Go to note"
            >
              <div className="flex items-center gap-x-3 flex-4">
                <Emoji
                  setSelected={async (e) => await addNoteEmoji(note.id, e)}
                  placeholder={note.emoji || <FaNoteSticky size={25} />}
                />
                {note.name}
              </div>
              <div
                className="flex-1 text-xs flex items-center gap-x-2"
                title="This item is a task list"
              >
                <FaNoteSticky />
                Note
              </div>
              <div
                className="flex-1 text-xs"
                title={note.updatedAt.toISOString()}
              >
                Modified {note.updatedAt.toLocaleDateString()}
              </div>
              <div
                className="flex-1 text-xs"
                title={note.createdAt.toISOString()}
              >
                Created {note.createdAt.toLocaleDateString()}
              </div>
            </div>
          );
        })}
      {open.folders.length +
        open.tasks.length +
        open.taskLists.length +
        open.notes.length ===
        0 && (
        <div className="flex flex-col gap-y-5 text-gray-300 items-center py-10">
          <FaFrown size={50} />
          There&apos;s nothing in this project yet...
        </div>
      )}
    </>
  );
}

export default Items;
