"use client";

import type { Tag, Task as TaskT } from "@/generated/prisma/client";
import { AnimatePresence } from "framer-motion";
import {
  FaCalendar,
  FaCheck,
  FaPen,
  FaRegCircle,
  FaRegStar,
  FaStar,
  FaTag,
  FaTrash,
} from "react-icons/fa";
import { useState, useRef } from "react";
import { completeTask, deleteTask, starTask } from "@/app/tasks/[id]/actions";
import WarningModal from "../modals/WarningModal";
import TagModal from "../modals/TagModal";
import DateModal from "../modals/DateModal";

const optionStyles = "opacity-0 group-hover:opacity-100 transition-opacity!";

export type TaskType = TaskT & {
  tags: Tag[];
};

interface TaskProps {
  task: TaskType;
  setDetails: React.Dispatch<React.SetStateAction<string | null>>;
  tags: Tag[];
  taskListId: string;
}

function Task({ task, setDetails, tags, taskListId }: TaskProps) {
  const [deleting, setDeleting] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [tagging, setTagging] = useState<boolean>(false);
  const [picking, setPicking] = useState<boolean>(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const completeRef = useRef<HTMLDivElement>(null);

  async function handleDelete() {
    setLoading(true);
    await deleteTask(task.id);
    setLoading(false);
  }

  function handlePanel(e: React.MouseEvent) {
    if (
      !menuRef.current?.contains(e.target as Node) &&
      !completeRef.current?.contains(e.target as Node)
    ) {
      setDetails((prev) => (prev === task.id ? null : task.id));
    }
  }

  return (
    <div
      className={`group ${task.completed ? "bg-gray-900/40" : "bg-gray-900"} rounded px-3 py-2.5 flex items-center gap-x-3 cursor-pointer text-gray-300 relative`}
      onClick={handlePanel}
    >
      <div
        className="relative group/complete flex items-center justify-center"
        title={`${task.completed ? "Unmark" : "Mark"} as completed`}
        onClick={async () => await completeTask(task.id, !task.completed)}
        ref={completeRef}
      >
        <FaRegCircle size={17} />
        <FaCheck
          size={12}
          className={`absolute ${!task.completed && "opacity-0"} group-hover/complete:opacity-100 transition-opacity!`}
        />
      </div>
      <div className="flex flex-col">
        <span className={task.completed ? "line-through" : ""}>
          {task.text}
        </span>
        {(task.start || task.due) && (
          <div className="flex gap-x-3">
            {task.start && (
              <span className="text-xs" title={task.start.toISOString()}>
                Starts {task.start.toLocaleDateString()}
              </span>
            )}
            {task.due && (
              <span className="text-xs" title={task.due.toISOString()}>
                Dues {task.due.toLocaleDateString()}
              </span>
            )}
          </div>
        )}
      </div>
      {task.tags && (
        <div className="flex gap-x-1 absolute right-40 min-w-60">
          {task.tags.slice(0, 3).map((tag) => (
            <div
              key={tag.id}
              className="flex gap-x-2 text-sm items-center bg-gray-950 rounded px-2 py-0.5"
              style={{ backgroundColor: tag.color || undefined }}
            >
              {tag.emoji ? <span>{tag.emoji}</span> : <FaTag size={10} />}
              {tag.name}
            </div>
          ))}
          {task.tags.length > 3 && (
            <div className="text-sm bg-gray-950 rounded px-2">
              +{task.tags.length - 3}
            </div>
          )}
        </div>
      )}
      <div ref={menuRef} className="flex gap-x-5 absolute right-3">
        <FaPen size={15} title="Edit task" className={optionStyles} />
        <FaTag
          size={15}
          title="Edit tags"
          className={optionStyles}
          onClick={() => setTagging(true)}
        />
        <FaCalendar
          size={15}
          title="Edit due date"
          className={optionStyles}
          onClick={() => setPicking(true)}
        />
        {task.starred ? (
          <FaStar
            size={15}
            className="text-teal-600"
            title="Unmark as starred"
            onClick={async () => await starTask(task.id, !task.starred)}
          />
        ) : (
          <FaRegStar
            size={15}
            title="Mark as starred"
            className={optionStyles}
            onClick={async () => await starTask(task.id, !task.starred)}
          />
        )}
        <FaTrash
          size={15}
          className={"text-red-500 " + optionStyles}
          title="Delete task"
          onClick={() => setDeleting(true)}
        />
        <AnimatePresence>
          {tagging && (
            <TagModal
              tags={tags}
              closeModal={() => setTagging(false)}
              taskListId={taskListId}
              selected={task.tags.map((t) => t.id)}
              taskId={task.id}
            />
          )}
          {deleting && (
            <WarningModal
              title="Delete confirmation"
              description={`Are you sure you want to delete the task ${task.text}? This action cannot be undone.`}
              confirm={handleDelete}
              closeModal={() => setDeleting(false)}
              loading={loading}
            />
          )}
          {picking && (
            <DateModal
              taskId={task.id}
              startDate={task.start || undefined}
              dueDate={task.due || undefined}
              closeModal={() => setPicking(false)}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default Task;
