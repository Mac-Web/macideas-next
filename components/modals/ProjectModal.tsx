"use client";

import type { Project } from "@/generated/prisma/client";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { addTaskProjects } from "@/app/tasks/actions";
import { addNoteProjects } from "@/app/notes/actions";
import { addProjects } from "@/app/tasks/[id]/actions";
import Modal from "../ui/Modal";
import Input from "../ui/Input";
import Checkbox from "../ui/Checkbox";
import Btn from "../ui/Btn";

interface ProjectModalProps {
  id: string;
  projects: Project[];
  closeModal: () => void;
  existing?: string[];
  isNote?: boolean;
  isTask?: boolean;
}

function ProjectModal({
  id,
  projects,
  closeModal,
  existing,
  isNote,
  isTask,
}: ProjectModalProps) {
  const [search, setSearch] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedLists, setSelectedLists] = useState<string[]>(existing || []);
  const pathname = usePathname();

  async function handleSave() {
    setLoading(true);
    if (isNote) {
      await addNoteProjects(id, selectedLists, pathname);
    } else if (isTask) {
      await addProjects(id, selectedLists);
    } else {
      await addTaskProjects(id, selectedLists, pathname);
    }
    setLoading(false);
    closeModal();
  }

  //TODO: update palceholders and other stuff so they say notes when isNote

  return (
    <Modal closeModal={closeModal}>
      <div className="flex flex-col gap-y-5">
        <h2 className="text-white text-xl font-bold">
          Edit {isNote ? "note" : "task list"} projects
        </h2>
        <Input
          placeholder="Search projects"
          value={search}
          setValue={(s) => setSearch(s)}
          clear
        />
        <div className="flex flex-col gap-y-2 max-h-80 overflow-auto">
          {projects.length > 0 ? (
            projects.map((project) => (
              <label
                key={project.id}
                className="border-2 border-gray-700 rounded cursor-pointer hover:bg-gray-900 px-3 py-1.5"
              >
                <Checkbox
                  text={project.name}
                  checked={selectedLists.includes(project.id)}
                  setChecked={(c) =>
                    setSelectedLists(
                      c
                        ? [...selectedLists, project.id]
                        : selectedLists.filter((l) => l !== project.id),
                    )
                  }
                />
              </label>
            ))
          ) : (
            <div className="text-gray-300 text-center text-sm py-2">
              No projects found. Maybe try a different search?
            </div>
          )}
        </div>
        <div className="flex gap-x-3">
          <Btn
            text={loading ? "Saving..." : "Save"}
            onclick={handleSave}
            primary
          />
          <Btn text="Cancel" onclick={closeModal} />
        </div>
      </div>
    </Modal>
  );
}

export default ProjectModal;
