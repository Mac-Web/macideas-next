"use client";

import type { Tag as TagType } from "@/generated/prisma/client";
import { useMemo, useState } from "react";
import { createTag, setTags } from "@/app/tasks/[id]/actions";
import Tag from "../tasks/Tag";
import Modal from "../ui/Modal";
import Input from "../ui/Input";
import Btn from "../ui/Btn";

interface TagModalProps {
  tags: TagType[];
  closeModal: () => void;
  taskListId: string;
  selected: string[];
  taskId: string;
}

function TagModal({
  tags,
  closeModal,
  taskListId,
  selected,
  taskId,
}: TagModalProps) {
  const [search, setSearch] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [newTag, setNewTag] = useState<string | null>(null);
  const [selectedTags, setSelectedTags] = useState<string[]>(selected);
  const displayedTags = useMemo(
    () =>
      tags.filter((tag) =>
        tag.name.toLowerCase().includes(search.trim().toLowerCase()),
      ),
    [tags, search],
  );

  async function handleCreate() {
    if (newTag && newTag.trim().length > 0) {
      await createTag(newTag, taskListId);
    }
    setNewTag(null);
  }

  async function handleSave(clear?: boolean) {
    setLoading(true);
    await setTags(taskId, clear ? [] : selectedTags);
    setLoading(false);
    closeModal();
  }

  return (
    <Modal closeModal={closeModal}>
      <div className="flex flex-col gap-y-5">
        <h2 className="text-white text-xl font-bold">Select tags</h2>
        <Input
          placeholder="Search tags"
          value={search}
          setValue={(s) => setSearch(s)}
          clear
        />
        <div className="flex flex-col gap-y-2 max-h-80 overflow-auto">
          {displayedTags.length > 0 ? (
            displayedTags.map((tag) => (
              <Tag
                key={tag.id}
                tag={tag}
                selected={selectedTags.includes(tag.id)}
                setSelected={(v) =>
                  setSelectedTags((prev) =>
                    v ? [...prev, tag.id] : prev.filter((t) => t !== tag.id),
                  )
                }
                taskListId={taskListId}
              />
            ))
          ) : (
            <div className="text-gray-300 text-center text-sm py-2">
              No tags found, create one below!
            </div>
          )}
        </div>
        {newTag !== null && (
          <Input
            placeholder="New tag"
            value={newTag}
            setValue={(n) => setNewTag(n)}
            onblur={handleCreate}
            styles="text-base!"
          />
        )}
        <div className="flex gap-x-3">
          {newTag === null && (
            <>
              <Btn
                text={loading ? "Saving..." : "Save"}
                onclick={() => handleSave()}
                primary
              />
            </>
          )}
          <Btn
            text="Create"
            onclick={() => (newTag ? handleCreate : setNewTag(""))}
            primary={newTag !== null}
          />
          {newTag === null ? (
            <Btn text="Clear" onclick={() => handleSave(true)} />
          ) : (
            <Btn text="Cancel" onclick={() => setNewTag(null)} />
          )}
        </div>
      </div>
    </Modal>
  );
}

export default TagModal;
