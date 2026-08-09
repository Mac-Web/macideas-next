"use client";

import type {
  Folder as FolderT,
  Note,
  Project,
  Task,
  TaskList,
} from "@/generated/prisma/client";
import { useMemo, useState } from "react";
import { FaBook, FaCaretRight } from "react-icons/fa";
import { addEmoji, createProject } from "./actions";
import { useRouter } from "next/navigation";
import Input from "@/components/ui/Input";
import Emoji from "@/components/ui/Emoji";
import Folder from "@/components/projects/Folder";
import Items from "@/components/projects/Items";

const itemStyles =
  "border-2 border-gray-700 rounded px-4 py-2 text-lg hover:bg-gray-900 cursor-pointer flex items-center gap-x-3 text-gray-300 select-none";

export type FolderType = FolderT & {
  taskLists: TaskList[];
  notes: Note[];
};

export type ProjectType = Project & {
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

  // TODO: add sort/filter

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
                  className={itemStyles}
                  onDoubleClick={() => handleOpen(project)}
                  title="Open project"
                >
                  <Emoji
                    setSelected={async (e) => await addEmoji(project.id, e)}
                    placeholder={project.emoji || <FaBook size={25} />}
                    styles="text-xl w-8"
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
          <Items
            open={open as ProjectType}
            search={search.trim().toLowerCase()}
            handleOpen={handleOpen}
          />
        ) : (
          <Folder open={open} search={search.trim().toLowerCase()} />
        )}
      </div>
    </div>
  );
}

export default Projects;
