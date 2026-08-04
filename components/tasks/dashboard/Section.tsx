import type { Task } from "@/generated/prisma/client";
import { FaStar, FaRegCircle } from "react-icons/fa";
import { priorities } from "@/lib/constants";
import Link from "next/link";

interface SectionProps {
  title: string;
  tasks: Task[];
  children: React.ReactNode;
}

function Section({ title, tasks, children }: SectionProps) {
  return (
    <div className="border-2 border-gray-700 rounded p-5 flex flex-col gap-y-5 flex-1 min-w-[40%]">
      <h2 className="text-white text-xl font-bold">
        {title} ({tasks.length})
      </h2>
      <div className="w-full flex flex-col gap-y-3 max-h-70 overflow-auto">
        {tasks.length > 0 ? (
          tasks.map((task) => (
            <Link
              key={task.id}
              href={`/tasks/${task.taskListId}`}
              className="flex items-center gap-x-5 bg-gray-900 px-5 py-1.5 rounded text-gray-300"
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
                      <span
                        className="text-xs"
                        title={task.start.toISOString()}
                      >
                        Starts {task.start.toLocaleDateString()}
                      </span>
                    )}
                  </>
                )}
                {/* TODO: display task tags too */}
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
            </Link>
            //TODO: make these task items actually have functionality instead of just links that redirect to the page
          ))
        ) : (
          <div className="flex flex-col gap-y-5 items-center text-gray-300 text-center py-10">
            {children}
            You don&apos;t have any {title.toLowerCase()} yet...
          </div>
        )}
      </div>
    </div>
  );
}

export default Section;
