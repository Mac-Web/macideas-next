"use client";

import type { Subtask as SubtaskType } from "@/generated/prisma/client";
import { FaPlusCircle } from "react-icons/fa";
import { useMemo, useState } from "react";
import { addSubtask } from "@/app/tasks/[id]/actions";
import Input from "../ui/Input";
import Checkbox from "../ui/Checkbox";
import Subtask from "./Subtask";

interface SubtasksProps {
  taskId: string;
  taskListId: string;
  subtasks: SubtaskType[];
}

function Subtasks({ taskId, taskListId, subtasks }: SubtasksProps) {
  const [subtask, setSubtask] = useState<string | null>(null);
  const [completed, setCompleted] = useState<boolean>(true);
  const displayedSubtasks = useMemo(() => {
    return subtasks
      .filter((s) => completed || !s.completed)
      .sort((a, b) => String(a.completed).localeCompare(String(b.completed)));
  }, [subtasks, completed]);

  async function handleNew(e: React.SubmitEvent) {
    e.preventDefault();
    if (subtask && subtask.trim().length > 0) {
      await addSubtask(taskId, subtask, taskListId);
      setSubtask(null);
    }
  }

  return (
    <div className="flex flex-col gap-y-3">
      <div className="flex items-center justify-between">
        Subtask{displayedSubtasks.length === 1 ? "" : "s"} (
        {displayedSubtasks.length}){" "}
        <Checkbox
          text="Show completed"
          checked={completed}
          setChecked={(c) => setCompleted(c)}
          styles="text-xs gap-x-1!"
        />
      </div>
      {displayedSubtasks.length > 0 && (
        <div className="flex flex-col gap-y-1">
          {displayedSubtasks.map((subtask) => (
            <Subtask
              key={subtask.id}
              subtask={subtask}
              taskListId={taskListId}
            />
          ))}
        </div>
      )}
      {subtask !== null && (
        <form onSubmit={(e) => handleNew(e)}>
          <Input
            placeholder="New subtask"
            value={subtask}
            setValue={(s) => setSubtask(s)}
            styles="text-sm!"
          />
        </form>
      )}
      <div
        className="cursor-pointer border-2 border-gray-700 hover:bg-gray-900 rounded py-1 flex items-center gap-x-3 justify-center"
        onClick={() => setSubtask(subtask === null ? "" : null)}
      >
        {subtask === null ? (
          <>
            {" "}
            <FaPlusCircle size={15} /> Add subtask
          </>
        ) : (
          "Cancel"
        )}
      </div>
    </div>
  );
}

export default Subtasks;
