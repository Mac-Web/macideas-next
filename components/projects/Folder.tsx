"use client";

import type { FolderType } from "@/app/projects/Projects";
import { useRouter } from "next/navigation";
import { FaNoteSticky } from "react-icons/fa6";
import { FaFrown } from "react-icons/fa";
import { BsList } from "react-icons/bs";
import { addEmoji } from "@/app/tasks/actions";
import { addEmoji as addNoteEmoji } from "@/app/notes/actions";
import { sortList } from "@/lib/projects";
import Emoji from "../ui/Emoji";
import { TaskList } from "@/generated/prisma/client";

const itemStyles =
  "border-2 border-gray-700 rounded px-4 py-2 hover:bg-gray-900 cursor-pointer flex items-center gap-x-3 text-gray-300 select-none";

interface FolderProps {
  open: FolderType;
  search: string;
  sort: string | null;
}

function Folder({ open, search, sort }: FolderProps) {
  const router = useRouter();

  return (
    <>
      {(sortList(open.taskLists, search, sort) as TaskList[]).map(
        (taskList) => {
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
        },
      )}
      {(sortList(open.notes, search, sort) as TaskList[]).map((note) => {
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
      {open.taskLists.length + open.notes.length === 0 && (
        <div className="flex flex-col gap-y-5 text-gray-300 items-center py-10">
          <FaFrown size={50} />
          There&apos;s nothing in this folder yet...
        </div>
      )}
    </>
  );
}

export default Folder;
