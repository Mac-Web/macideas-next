"use client";

import type { Folder, Note, Task, TaskList } from "@/generated/prisma/client";
import { useMemo, useState } from "react";
import Modal from "../ui/Modal";
import Input from "../ui/Input";
import Btn from "../ui/Btn";
import Checkbox from "../ui/Checkbox";
import { addItems } from "@/app/projects/[id]/actions";

const tabs = ["Folders", "Task lists", "Tasks", "Notes"];

export interface SelectionType {
  id: string;
  type: string;
}

interface AddModalProps {
  id: string;
  folders: Folder[];
  taskLists: TaskList[];
  tasks: Task[];
  notes: Note[];
  existing: SelectionType[];
  closeModal: () => void;
}

function AddModal({
  id,
  folders,
  taskLists,
  tasks,
  notes,
  existing,
  closeModal,
}: AddModalProps) {
  const [search, setSearch] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [selected, setSelected] = useState<SelectionType[]>(existing || []);
  const [tab, setTab] = useState<string>(tabs[0]);
  const displayed = useMemo(() => {
    const q = search.trim().toLowerCase();
    switch (tab) {
      case "Folders":
        return folders.filter((f) => f.name.toLowerCase().includes(q));
      case "Task lists":
        return taskLists.filter((t) => t.name.toLowerCase().includes(q));
      case "Tasks":
        return tasks.filter((t) => t.text.toLowerCase().includes(q));
      case "Notes":
        return notes.filter((n) => n.name.toLowerCase().includes(q));
    }
    return [];
  }, [search, tab, folders, taskLists, tasks, notes]);

  async function handleSave() {
    setLoading(true);
    await addItems(id, selected);
    setLoading(false);
    closeModal();
  }

  return (
    <Modal closeModal={closeModal}>
      <div className="flex flex-col gap-y-5">
        <h2 className="text-white text-xl font-bold">Add to project</h2>
        <Input
          placeholder={`Search ${tab.toLowerCase()}`}
          value={search}
          setValue={(s) => setSearch(s)}
          clear
        />
        <div className="flex gap-x-3 justify-center">
          {tabs.map((t, i) => (
            <div
              key={i}
              onClick={() => setTab(t)}
              className={`px-2 py-1 rounded border-2 border-gray-700 cursor-pointer text-gray-300 text-sm
                hover:bg-gray-900 ${tab === t && "bg-gray-900! font-bold"}`}
            >
              {t} {tab === t && `(${displayed.length})`}
            </div>
          ))}
        </div>
        <div className="flex flex-col gap-y-2 max-h-80 overflow-auto">
          {displayed.length > 0 ? (
            displayed.map((item) => (
              <label
                key={item.id}
                className="border-2 border-gray-700 rounded cursor-pointer hover:bg-gray-900 px-3 py-1.5"
              >
                <Checkbox
                  text={(item as Folder).name || (item as Task).text}
                  checked={
                    selected.find((s) => s.id === item.id) ? true : false
                  }
                  setChecked={(c) =>
                    setSelected(
                      c
                        ? [...selected, { id: item.id, type: tab }]
                        : selected.filter((l) => l.id !== item.id),
                    )
                  }
                />
              </label>
            ))
          ) : (
            <div className="text-gray-300 text-center text-sm py-2">
              No results found. Maybe try a different search?
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

export default AddModal;
