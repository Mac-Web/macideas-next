import { FaRegStar } from "react-icons/fa";
import { FaRegNoteSticky } from "react-icons/fa6";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Folder from "./Folder";
import Home from "./Home";
import Create from "./Create";
import Note from "./Note";

async function Sidebar() {
  const session = await getSession();
  if (!session) redirect("/");
  const notes = await prisma.note.findMany({
    where: { userId: session.user.id },
  });
  const orphanedNotes = notes.filter((note) => !note.folderId);
  const starredNotes = notes.filter((note) => note.starred);
  const folders = await prisma.folder.findMany({
    where: { userId: session.user.id },
    include: { notes: true, projects: true },
    orderBy: { name: "asc" },
  });
  const cleanFolders = folders.map((folder) => {
    return { ...folder, notes: null };
  });
  const projects = await prisma.project.findMany({
    where: { userId: session.user.id },
  });

  return (
    <div className="w-70 border-r border-gray-700 h-[calc(100vh-68px)] py-5 relative">
      <div className="flex flex-col gap-y-3 flex-1 h-[calc(100%-45px)] px-3 overflow-auto">
        <Home />
        {starredNotes.length > 0 && (
          <>
            <h2 className="text-white font-bold flex gap-x-3 px-2 mb-2 items-center">
              <FaRegStar size={15} /> Starred notes
            </h2>
            {starredNotes.map((note) => {
              return (
                <Note
                  key={note.id}
                  note={note}
                  folders={cleanFolders}
                  starred
                />
              );
            })}
          </>
        )}
        <h2 className="text-white font-bold flex gap-x-3 px-2 items-center mb-2">
          <FaRegNoteSticky size={15} /> All notes
        </h2>
        {folders?.map((folder) => (
          <Folder
            key={folder.id}
            folder={folder}
            folders={folders}
            notes={notes}
            projects={projects}
            existing={folder.projects.map((p) => p.id)}
          />
        ))}
        {/* TODO: add drag and drop folders and starred folders? */}
        {notes.length > 0 ? (
          orphanedNotes.map((note) => {
            return <Note key={note.id} note={note} folders={cleanFolders} />;
          })
        ) : (
          <div className="text-sm text-center text-gray-300 py-5">
            No notes found
          </div>
        )}
      </div>
      <Create />
    </div>
  );
}

export default Sidebar;
