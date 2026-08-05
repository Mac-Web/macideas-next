"use client";

import type { TaskType } from "../Task";
import { FaRegCircle, FaStar, FaTag } from "react-icons/fa";
import { priorities } from "@/lib/constants";
import Link from "next/link";

function Task({ task }: { task: TaskType }) {
  return (
    <Link
      key={task.id}
      href={`/tasks/${task.taskListId || "day"}`}
      className="flex items-center gap-x-5 bg-gray-900 px-5 py-1.5 rounded text-gray-300 whitespace-nowrap overflow-hidden"
    >
      <FaRegCircle size={17} />
      <div className="flex flex-col">
        <span className={task.completed ? "line-through" : ""}>
          {task.text}
        </span>
        {(task.start || task.due) && (
          <>
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
          </>
        )}
      </div>
      {task.starred && (
        <FaStar size={15} className="text-teal-600" title="Starred" />
      )}
      {task.priority && task.priority !== "None" && (
        <div
          className={`text-sm rounded px-1.5 py-0.5 ${priorities.find((p) => p.name === task.priority)?.color}`}
        >
          {priorities.find((p) => p.name === task.priority)?.name}
        </div>
      )}
      {task.tags && (
        <div className="flex gap-x-1">
          {task.tags.slice(0, 2).map((tag) => (
            <div
              key={tag.id}
              className="flex gap-x-2 text-sm items-center bg-gray-950 rounded px-2 py-0.5"
              style={{ backgroundColor: tag.color || undefined }}
            >
              {tag.emoji ? <span>{tag.emoji}</span> : <FaTag size={10} />}
              {tag.name}
            </div>
          ))}
          {task.tags.length > 2 && (
            <div className="text-sm bg-gray-950 rounded px-2">
              +{task.tags.length - 2}
            </div>
          )}
        </div>
      )}
    </Link>
    //TODO: make these task items actually have functionality instead of just links that redirect to the page
  );
}

export default Task;
