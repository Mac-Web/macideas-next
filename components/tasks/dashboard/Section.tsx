import type { TaskType } from "../Task";
import Task from "./Task";
import Link from "next/link";

interface SectionProps {
  title: string;
  tasks: TaskType[];
  children: React.ReactNode;
  link?: string;
}

function Section({ title, tasks, children, link }: SectionProps) {
  return (
    <div className="border-2 border-gray-700 rounded p-5 flex flex-col gap-y-5 flex-1 min-w-[40%]">
      <Link href={link || ""} className="text-white text-xl font-bold w-fit">
        {title} ({tasks.length})
      </Link>
      <div className="w-full flex flex-col gap-y-3 max-h-70 overflow-auto">
        {tasks.length > 0 ? (
          tasks.map((task) => <Task key={task.id} task={task} />)
        ) : (
          <div className="flex flex-col gap-y-5 items-center text-gray-300 text-center py-10 justify-center h-full">
            {children}
            You don&apos;t have any {title.toLowerCase()} yet
          </div>
        )}
      </div>
    </div>
  );
}

export default Section;
