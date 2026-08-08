"use client";

import type {
  Folder,
  Note,
  Project,
  Task,
  TaskList,
} from "@/generated/prisma/client";
import { useMemo, useState } from "react";
import { FaBook, FaCaretRight, FaFrown } from "react-icons/fa";
import { addEmoji, createProject } from "./actions";
import { useRouter } from "next/navigation";
import Input from "@/components/ui/Input";
import Emoji from "@/components/ui/Emoji";

type FolderType = Folder & {
  taskLists: TaskList[];
  notes: Note[];
};

type ProjectType = Project & {
  tasks: Task[];
  taskLists: TaskList[];
  notes: Note[];
  folders: FolderType[];
};

function Projects({ projects }: { projects: ProjectType[] }) {
  const [search, setSearch] = useState<string>("");
  const [breadCrumbs, setBreadCrumbs] = useState<
    { id: string; name: string }[]
  >([{ id: "0", name: "Projects" }]);
  const open = useMemo(() => {
    const target = breadCrumbs[breadCrumbs.length - 1].id;
    let res: FolderType | ProjectType | null = null;
    projects.forEach((p) => {
      if (!res) {
        if (p.id === target) res = p;
        p.folders.forEach((f) => {
          if (!res && f.id === target) res = f;
        });
      }
    });
    return res as FolderType | ProjectType | null;
  }, [breadCrumbs, projects]);
  const displayedProjects = projects.filter((p) =>
    p.name.toLowerCase().includes(search.trim().toLowerCase()),
  );
  const router = useRouter();

  function handleOpen(data: FolderType | ProjectType) {
    setBreadCrumbs((prev) => [...prev, { id: data.id, name: data.name }]);
  }

  async function handleCreate() {
    const id = await createProject("/projects");
    if (id) router.push(`/projects/${id}`);
  }

  return (
    <div className="w-full flex flex-col gap-y-5 items-center">
      <div className="w-100">
        <Input
          placeholder={`Search ${open ? open.name : "projects"}`}
          value={search}
          setValue={(s) => setSearch(s)}
          clear
        />
      </div>
      <div className="text-gray-300 flex gap-x-2 text-sm w-full">
        {breadCrumbs.map((b, i) => (
          <div
            key={i}
            className="flex gap-x-2 items-center cursor-pointer"
            onClick={() => setBreadCrumbs((prev) => prev.slice(0, i + 1))}
          >
            {b.name}
            {i < breadCrumbs.length - 1 && <FaCaretRight size={13} />}
          </div>
        ))}
      </div>
      <div className="flex flex-col gap-y-3 w-full">
        {!open ? (
          displayedProjects.length > 0 ? (
            displayedProjects.map((project) => {
              return (
                <div
                  key={project.id}
                  className="border-2 border-gray-700 rounded px-4 py-2 text-lg hover:bg-gray-900 cursor-pointer flex items-center gap-x-3 text-gray-300 select-none"
                  onDoubleClick={() => handleOpen(project)}
                >
                  <Emoji
                    setSelected={async (e) => await addEmoji(project.id, e)}
                    placeholder={project.emoji || <FaBook size={25} />}
                    styles="text-2xl w-8"
                  />
                  {project.name}
                </div>
              );
            })
          ) : (
            <div className="text-gray-300 text-center">
              <div>No projects found :(</div> Try a different search or{" "}
              <span
                className="cursor-pointer underline hover:text-teal-600"
                onClick={handleCreate}
              >
                create one
              </span>
            </div>
          )
        ) : (open as ProjectType)?.starred !== undefined ? (
          <div>
            {(open as ProjectType).folders.map((folder) => {
              return <div key={folder.id}>FOLDER: {folder.name}</div>;
            })}
            {open.taskLists.map((taskList) => {
              return <div key={taskList.id}>TASK LIST: {taskList.name}</div>;
            })}
            {(open as ProjectType).tasks.map((task) => {
              return <div key={task.id}>TASK: {task.text}</div>;
            })}
            {open.notes.map((note) => {
              return <div key={note.id}>NOTE: {note.name}</div>;
            })}
            {(open as ProjectType).folders.length +
              (open as ProjectType).tasks.length +
              open.taskLists.length +
              open.notes.length ===
              0 && (
              <div className="flex flex-col gap-y-5 text-gray-300 items-center py-10">
                <FaFrown size={50} />
                There&apos;s nothing in this project yet...
              </div>
            )}
          </div>
        ) : (
          <div>
            {open.taskLists.map((taskList) => {
              return <div key={taskList.id}>TASK LIST: {taskList.name}</div>;
            })}
            {open.notes.map((note) => {
              return <div key={note.id}>NOTE: {note.name}</div>;
            })}

            {open.taskLists.length + open.notes.length === 0 && (
              <div className="flex flex-col gap-y-5 text-gray-300 items-center py-10">
                <FaFrown size={50} />
                There&apos;s nothing in this folder yet...
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default Projects;
