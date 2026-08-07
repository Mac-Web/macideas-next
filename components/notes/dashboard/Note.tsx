import type { Note as NoteT, Tag } from "@/generated/prisma/client";
import { FaTag } from "react-icons/fa";
import Link from "next/link";

export type NoteType = NoteT & {
  tags: Tag[];
};

function Note({ note }: { note: NoteType }) {
  return (
    <Link
      href={`/notes/${note.id}`}
      className="text-gray-300 w-48 rounded border-2 border-gray-700 flex flex-col gap-y-3 p-5
       hover:bg-gray-900"
    >
      <h2 className="text-white text-xl font-bold">{note.name}</h2>
      {note.description && <div className="text-sm">{note.description}</div>}
      {note.tags && (
        <div className="flex gap-x-1">
          {note.tags.slice(0, 2).map((tag) => (
            <div
              key={tag.id}
              className="flex gap-x-2 text-sm items-center bg-gray-950 rounded px-2 py-0.5"
              style={{ backgroundColor: tag.color || undefined }}
            >
              {tag.emoji ? <span>{tag.emoji}</span> : <FaTag size={10} />}
              {tag.name}
            </div>
          ))}
          {note.tags.length > 2 && (
            <div className="text-sm bg-gray-950 rounded px-2">
              +{note.tags.length - 2}
            </div>
          )}
        </div>
      )}
      <div className="text-xs flex flex-col gap-y-1">
        <div title={note.createdAt.toISOString()}>
          Created {note.createdAt.toLocaleDateString()}
        </div>
        <div title={note.updatedAt.toISOString()}>
          Updated {note.updatedAt.toLocaleDateString()}
        </div>
      </div>
    </Link>
  );
}

export default Note;
