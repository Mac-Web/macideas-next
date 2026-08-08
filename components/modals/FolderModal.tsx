"use client";

import type { Note, Project, TaskList } from "@/generated/prisma/client";
import type { FolderType } from "../tasks/Folder";
import { useState, useMemo } from "react";
import { selectFolder } from "@/app/tasks/actions";
import { selectFolder as selectNoteFolder } from "@/app/notes/actions";
import { addProjects } from "@/app/projects/actions";
import { usePathname } from "next/navigation";
import Modal from "../ui/Modal";
import Input from "../ui/Input";
import Btn from "../ui/Btn";
import Checkbox from "../ui/Checkbox";

interface FolderModalProps {
  folder: FolderType;
  taskLists: TaskList[] | Note[] | Project[];
  closeModal: () => void;
  isNote?: boolean;
  isProject?: boolean;
  existing?: string[];
}

function FolderModal({
  folder,
  taskLists,
  closeModal,
  isNote,
  isProject,
  existing,
}: FolderModalProps) {
  const [search, setSearch] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedLists, setSelectedLists] = useState<string[]>(
    existing || folder.taskLists.map((l) => l.id),
  );
  const sortedLists = useMemo(
    () =>
      taskLists
        .filter((t) =>
          t.name.toLowerCase().includes(search.trim().toLowerCase()),
        )
        .sort((a, b) =>
          isProject
            ? 1
            : String((b as TaskList).folderId === folder.id).localeCompare(
                String((a as TaskList).folderId === folder.id),
              ),
        ),
    [taskLists, search, folder.id, isProject],
  );
  const pathname = usePathname();

  async function handleSave() {
    setLoading(true);
    if (isNote) {
      await selectNoteFolder(folder.id, selectedLists, pathname);
    } else if (isProject) {
      await addProjects(folder.id, selectedLists, pathname);
    } else {
      await selectFolder(folder.id, selectedLists, pathname);
    }
    setLoading(false);
    closeModal();
  }

  //TODO: update palceholders and other stuff so they say notes when isNote

  return (
    <Modal closeModal={closeModal}>
      <div className="flex flex-col gap-y-5">
        <h2 className="text-white text-xl font-bold">
          Edit folder {isProject ? "projects" : "task lists"}
        </h2>
        <Input
          placeholder={`Search ${isProject ? "projects" : "task lists"}`}
          value={search}
          setValue={(s) => setSearch(s)}
          clear
        />
        <div className="flex flex-col gap-y-2 max-h-80 overflow-auto">
          {sortedLists.length > 0 ? (
            sortedLists.map((taskList) => (
              <label
                key={taskList.id}
                className="border-2 border-gray-700 rounded cursor-pointer hover:bg-gray-900 px-3 py-1.5"
              >
                <Checkbox
                  text={taskList.name}
                  checked={selectedLists.includes(taskList.id)}
                  setChecked={(c) =>
                    setSelectedLists(
                      c
                        ? [...selectedLists, taskList.id]
                        : selectedLists.filter((l) => l !== taskList.id),
                    )
                  }
                />
              </label>
            ))
          ) : (
            <div className="text-gray-300 text-center text-sm py-2">
              No {isProject ? "projects" : "task lists"} found. Maybe try a
              different search?
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

export default FolderModal;
