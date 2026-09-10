"use client";

import type { FolderType, ProjectType } from "../Projects";
import { useState } from "react";
import Input from "@/components/ui/Input";
import Folder from "@/components/projects/Folder";
import Project from "@/components/projects/Items";
import { FaCaretRight } from "react-icons/fa";
import Bar from "@/components/projects/Bar";

function Items({ project }: { project: ProjectType }) {
  const [search, setSearch] = useState<string>("");
  const [open, setOpen] = useState<FolderType | null>(null);
  const [sort, setSort] = useState<string | null>(null);

  return (
    <>
      <div className="w-100">
        <Input
          placeholder={`Search ${open?.name || project.name}`}
          value={search}
          setValue={(s) => setSearch(s)}
          clear
        />
      </div>
      <div className="text-black dark:text-gray-300 flex gap-x-2 text-sm w-full">
        <div
          className="flex gap-x-2 items-center cursor-pointer"
          onClick={() => setOpen(null)}
        >
          {project.name}
          {open && <FaCaretRight size={13} />}
        </div>
        {open && (
          <div className="flex gap-x-2 items-center cursor-pointer">
            {open.name}
          </div>
        )}
      </div>
      <Bar sort={sort} setSort={setSort} />
      <div className="w-full flex flex-col gap-y-3 h-full overflow-auto mb-3">
        {open ? (
          <Folder
            open={open}
            search={search.trim().toLowerCase()}
            sort={sort}
          />
        ) : (
          <Project
            open={project}
            search={search.trim().toLowerCase()}
            handleOpen={(f) => setOpen(f)}
            sort={sort}
          />
        )}
      </div>
    </>
  );
}

export default Items;
