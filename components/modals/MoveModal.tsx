"use client";

import type { Folder } from "@/generated/prisma/client";
import { useState, useMemo } from "react";
import { usePathname } from "next/navigation";
import { moveFolder } from "@/app/tasks/actions";
import { moveNote } from "@/app/notes/actions";
import Btn from "../ui/Btn";
import Modal from "../ui/Modal";
import Checkbox from "../ui/Checkbox";
import Input from "../ui/Input";

interface MoveModalProps {
  id: string;
  folder: string | null;
  folders: Folder[];
  closeModal: () => void;
  isNote?: boolean;
}

function MoveModal({
  id,
  folder,
  folders,
  closeModal,
  isNote,
}: MoveModalProps) {
  const [search, setSearch] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [selected, setSelected] = useState<string>(folder || "");
  const displayedFolders = useMemo(
    () =>
      folders.filter((f) =>
        f.name.toLowerCase().includes(search.trim().toLowerCase()),
      ),
    [folders, search],
  );
  const pathname = usePathname();

  async function handleSave() {
    setLoading(true);
    if (isNote) {
      await moveNote(id, selected, pathname);
    } else {
      await moveFolder(id, selected, pathname);
    }
    setLoading(false);
    closeModal();
  }

  return (
    <Modal closeModal={closeModal}>
      <div className="flex flex-col gap-y-5">
        <h2 className="text-white text-xl font-bold">Move task list</h2>
        <Input
          placeholder="Search folders"
          value={search}
          setValue={(s) => setSearch(s)}
          clear
        />
        <div className="flex flex-col gap-y-2 max-h-80 overflow-auto">
          {displayedFolders.length > 0 ? (
            displayedFolders.map((folder) => (
              <label
                key={folder.id}
                className="border-2 border-gray-700 rounded cursor-pointer hover:bg-gray-900 px-3 py-1.5"
              >
                <Checkbox
                  text={folder.name}
                  checked={selected === folder.id}
                  setChecked={(c) => setSelected(c ? folder.id : "")}
                />
              </label>
            ))
          ) : (
            <div className="text-gray-300 text-center text-sm py-2">
              No folders found. Maybe try a different search?
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

export default MoveModal;
