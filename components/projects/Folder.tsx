"use client";

import type { FolderType } from "@/app/projects/Projects";
import { useRouter } from "next/navigation";
import { FaNoteSticky } from "react-icons/fa6";
import { FaFrown } from "react-icons/fa";
import { BsList } from "react-icons/bs";
import { addEmoji } from "@/app/tasks/actions";
import { addEmoji as addNoteEmoji } from "@/app/notes/actions";
import Emoji from "../ui/Emoji";

const itemStyles =
  "border-2 border-gray-700 rounded px-4 py-2 text-lg hover:bg-gray-900 cursor-pointer flex items-center gap-x-3 text-gray-300 select-none";

interface FolderProps {
  open: FolderType;
  search: string;
}

function Folder({ open, search }: FolderProps) {
  const router = useRouter();

  return (
    <>
      {open.taskLists
        .filter((i) => i.name.toLowerCase().includes(search))
        .map((taskList) => {
          return (
            <div
              key={taskList.id}
              onDoubleClick={() => router.push(`/tasks/${taskList.id}`)}
              className={itemStyles}
              title="Go to task list"
            >
              <Emoji
                setSelected={async (e) => await addEmoji(taskList.id, e)}
                placeholder={taskList.emoji || <BsList size={25} />}
              />
              {taskList.name}
            </div>
          );
        })}
      {open.notes
        .filter((i) => i.name.toLowerCase().includes(search))
        .map((note) => {
          return (
            <div
              key={note.id}
              onDoubleClick={() => router.push(`/notes/${note.id}`)}
              className={itemStyles}
              title="Go to note"
            >
              <Emoji
                setSelected={async (e) => await addNoteEmoji(note.id, e)}
                placeholder={note.emoji || <FaNoteSticky size={25} />}
              />
              {note.name}
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
