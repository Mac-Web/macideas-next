"use client";

import type { FolderType, ProjectType } from "../Projects";
import { useState } from "react";
import Input from "@/components/ui/Input";
import Folder from "@/components/projects/Folder";
import Project from "@/components/projects/Items";
import { FaCaretRight } from "react-icons/fa";

function Items({ project }: { project: ProjectType }) {
  const [search, setSearch] = useState<string>("");
  const [open, setOpen] = useState<FolderType | null>(null);

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
      <div className="text-gray-300 flex gap-x-2 text-sm w-full">
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
      <div className="w-full flex flex-col gap-y-3">
        {open ? (
          <Folder open={open} search={search.trim().toLowerCase()} />
        ) : (
          <Project
            open={project}
            search={search.trim().toLowerCase()}
            handleOpen={(f) => setOpen(f)}
          />
        )}
      </div>
    </>
  );
}

export default Items;
