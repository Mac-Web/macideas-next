"use client";

import type { Tag } from "@/generated/prisma/client";
import type { NoteType } from "./Note";
import { useState } from "react";
import { FaFaceFrown } from "react-icons/fa6";
import Note from "./Note";
import Dropdown from "@/components/ui/Dropdown";
import Hide from "@/components/tasks/dashboard/Hide";

type TagType = Tag & {
  notes: NoteType[];
};

function Tags({ tags }: { tags: TagType[] }) {
  const [selectedTag, setSelectedTag] = useState<TagType>(tags[0]);
  //TODO: handle tags with same name id problem and show the tag's emoji and background color

  return (
    <div className="border-2 border-gray-700 rounded p-5 flex flex-col gap-y-5 flex-1 min-w-[40%]">
      <div className="flex gap-x-3 items-center relative group">
        <div className="text-white text-xl font-bold">
          Note{selectedTag.notes.length === 1 ? "" : "s"} with
        </div>
        <Dropdown
          selected={selectedTag.name}
          setSelected={(t) =>
            setSelectedTag(tags.find((tag) => tag.name === t)!)
          }
          values={tags.map((t) => t.name)}
          styles="text-sm!"
        />
        <div className="text-white text-xl font-bold">
          tag ({selectedTag.notes.length})
        </div>
        <div className="absolute right-0">
          <Hide id={1} isNote />
        </div>
      </div>
      {selectedTag.notes.length > 0 ? (
        <div className="flex flex-wrap gap-3">
          {selectedTag.notes.map((note) => (
            <Note key={note.id} note={note} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col gap-y-5 items-center text-gray-300 text-center py-10 justify-center h-full">
          <FaFaceFrown size={40} />
          You don&apos;t have any notes with the {selectedTag.name} tag
        </div>
      )}
    </div>
  );
}

export default Tags;
