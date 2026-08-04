"use client";

import type { Subtask as SubtaskType } from "@/generated/prisma/client";
import { useState } from "react";
import { FaRegCircle, FaTrash, FaPen } from "react-icons/fa";
import { FaCircleCheck } from "react-icons/fa6";
import {
  completeSubtask,
  deleteSubtask,
  renameSubtask,
} from "@/app/tasks/[id]/actions";
import Input from "../ui/Input";

interface SubtaskProps {
  subtask: SubtaskType;
  taskListId: string;
}

function Subtask({ subtask, taskListId }: SubtaskProps) {
  const [rename, setRename] = useState<string | null>(null);

  async function handleRename() {
    if (rename && rename.trim().length > 0) {
      await renameSubtask(subtask.id, rename, taskListId);
      setRename(null);
    }
  }

  return (
    <div
      key={subtask.id}
      className={`bg-gray-900 rounded px-2 py-1 text-gray-300 flex items-center gap-x-2 relative
                 ${subtask.completed && "line-through bg-gray-900/50"}`}
    >
      {subtask.completed ? (
        <FaCircleCheck
          size={15}
          title="Unmark as completed"
          className="cursor-pointer"
          onClick={async () =>
            await completeSubtask(subtask.id, taskListId, !subtask.completed)
          }
        />
      ) : (
        <FaRegCircle
          size={15}
          title="Mark as completed"
          className="cursor-pointer"
          onClick={async () =>
            await completeSubtask(subtask.id, taskListId, !subtask.completed)
          }
        />
      )}
      {rename === null ? (
        subtask.text
      ) : (
        <Input
          placeholder="New subtask"
          value={rename}
          setValue={(r) => setRename(r)}
          styles="text-sm py-0! px-2! border-2 border-gray-700 rounded w-35"
          onblur={handleRename}
        />
      )}
      <div className="absolute right-2 flex items-center gap-x-2">
        <FaPen
          size={13}
          className="cursor-pointer"
          title="Rename subtask"
          onClick={() => setRename(subtask.text)}
        />
        <FaTrash
          size={13}
          className="cursor-pointer text-red-500"
          title="Delete subtask"
          onClick={async () => await deleteSubtask(subtask.id, taskListId)}
        />
      </div>
    </div>
  );
}

export default Subtask;
