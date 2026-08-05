"use client";

import type { Subtask, Tag, Task as TaskT } from "@/generated/prisma/client";
import { AnimatePresence } from "framer-motion";
import {
  FaCalendar,
  FaCheck,
  FaEyeSlash,
  FaPen,
  FaRegCircle,
  FaRegStar,
  FaStar,
  FaTag,
  FaTrash,
} from "react-icons/fa";
import { useState, useRef, useMemo } from "react";
import {
  completeSubtask,
  completeTask,
  deleteTask,
  renameTask,
  starTask,
  updatePriority,
} from "@/app/tasks/[id]/actions";
import { priorities } from "@/lib/constants";
import { FaCircleCheck } from "react-icons/fa6";
import WarningModal from "../modals/WarningModal";
import TagModal from "../modals/TagModal";
import DateModal from "../modals/DateModal";
import Dropdown from "../ui/Dropdown";
import Input from "../ui/Input";

const optionStyles = "opacity-0 group-hover:opacity-100 transition-opacity!";

export type TaskType = TaskT & {
  tags: Tag[];
  subtasks: Subtask[];
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
  const [editing, setEditing] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const completeRef = useRef<HTMLDivElement>(null);
  const editRef = useRef<HTMLDivElement>(null);
  const subtasks = useMemo(() => {
    return task.subtasks.sort((a, b) => {
      return String(a.completed).localeCompare(String(b.completed));
    });
  }, [task.subtasks]);

  async function handleDelete() {
    setLoading(true);
    await deleteTask(task.id);
    setLoading(false);
  }

  async function handleRename() {
    if (editing && editing.trim().length > 0) {
      await renameTask(task.id, editing);
      setEditing(null);
    } else if (editing === null) {
      setEditing(task.text);
    }
  }

  function handlePanel(e: React.MouseEvent) {
    if (
      !menuRef.current?.contains(e.target as Node) &&
      !completeRef.current?.contains(e.target as Node) &&
      !editRef.current?.contains(e.target as Node)
    ) {
      setDetails((prev) => (prev === task.id ? null : task.id));
    }
  }

  async function hideTask() {
    console.log("hiding task...");
    //TODO: implement hiding tasks from my day
  }

  async function handleCompleteSubtask(
    e: React.MouseEvent,
    id: string,
    completed: boolean,
  ) {
    e.preventDefault();
    e.stopPropagation();
    await completeSubtask(id, taskListId, completed);
  }

  return (
    <div
      className={`group ${task.completed ? "bg-gray-900/40" : "bg-gray-900"} rounded px-3 py-2.5 flex items-center gap-x-3 cursor-pointer text-gray-300 relative`}
      onClick={handlePanel}
    >
      {editing !== null ? (
        <div
          className="transition-none! border-2 border-gray-700 rounded"
          onClick={(e: React.MouseEvent) => e.preventDefault()}
          ref={editRef}
        >
          <Input
            placeholder="Task"
            value={editing}
            setValue={(e) => setEditing(e)}
            onblur={handleRename}
            styles="py-0! px-1!"
            focused
          />
        </div>
      ) : (
        <div className="flex flex-col gap-y-1">
          <div className="flex gap-x-3 items-center">
            <div
              className="relative group/complete flex items-center justify-center"
              title={`${task.completed ? "Unmark" : "Mark"} as completed`}
              onClick={async () => await completeTask(task.id, !task.completed)}
              ref={completeRef}
            >
              {task.completed ? (
                <FaCircleCheck size={17} />
              ) : (
                <>
                  <FaRegCircle size={17} />
                  <FaCheck
                    size={12}
                    className={`absolute ${!task.completed && "opacity-0"} group-hover/complete:opacity-100 transition-opacity!`}
                  />
                </>
              )}
            </div>
            <div className="flex flex-col">
              <span className={task.completed ? "line-through" : ""}>
                {task.text}
              </span>
              {(task.start || task.due) && (
                <div className="flex gap-x-3">
                  {task.due && (
                    <span className="text-xs" title={task.due.toISOString()}>
                      Dues {task.due.toLocaleDateString()}
                    </span>
                  )}
                  {task.start && (
                    <span className="text-xs" title={task.start.toISOString()}>
                      Starts {task.start.toLocaleDateString()}
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>
          {subtasks.length > 0 && (
            <div className="ml-7 flex flex-col gap-y-0.5">
              {subtasks.map((subtask) => (
                <div
                  key={subtask.id}
                  className={`${subtask.completed && "line-through"} text-sm flex items-center gap-x-2`}
                >
                  {subtask.completed ? (
                    <FaCircleCheck
                      size={13}
                      title="Unmark as completed"
                      onClick={(e) =>
                        handleCompleteSubtask(e, subtask.id, false)
                      }
                    />
                  ) : (
                    <FaRegCircle
                      size={13}
                      title="Mark as completed"
                      onClick={(e) =>
                        handleCompleteSubtask(e, subtask.id, true)
                      }
                    />
                  )}
                  {subtask.text}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
      {task.tags && (
        <div className="flex gap-x-1 absolute right-70 min-w-60">
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
      <div ref={menuRef} className="flex gap-x-5 absolute right-3 items-center">
        <Dropdown
          selected={task.priority || "None"}
          setSelected={async (p) => await updatePriority(task.id, p)}
          values={priorities.map((p) => p.name)}
          text="Priority"
          styles={`${task.priority && task.priority !== "None" ? "" : optionStyles} py-0.5! ${priorities.find((p) => p.name === task.priority)?.color}`}
          hover={false}
        />
        {taskListId === "day" && (
          <FaEyeSlash
            size={15}
            title="Remove from My Day"
            className={optionStyles}
            onClick={hideTask}
          />
        )}
        <FaPen
          size={15}
          title="Edit task"
          className={optionStyles}
          onClick={handleRename}
        />
        <FaTag
          size={15}
          title="Edit tags"
          className={optionStyles}
          onClick={() => setTagging(true)}
        />
        <FaCalendar
          size={15}
          title="Edit dates"
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
