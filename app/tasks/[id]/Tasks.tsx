"use client";

import type { Task as TaskType } from "@/generated/prisma/client";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FaCheckCircle } from "react-icons/fa";
import Task from "@/components/tasks/Task";
import TaskInput from "@/components/tasks/TaskInput";
import Details from "./Details";

interface TasksProps {
  tasks: TaskType[];
  id: string;
}

function Tasks({ tasks, id }: TasksProps) {
  const [details, setDetails] = useState<string | null>(null);
  const task = tasks.find((task) => task.id === details);

  return (
    <div className="w-full h-full flex overflow-x-hidden">
      <div className="px-3 w-full h-full">
        {tasks.length > 0 ? (
          <>
            <h2 className="text-white font-bold text-lg pt-3">
              Task{tasks.length === 1 ? "" : "s"} ({tasks.length})
            </h2>
            <div className="flex flex-col gap-y-2 py-3 overflow-auto h-[calc(100%-143px)]">
              {tasks.map((task) => {
                return (
                  <Task key={task.id} task={task} setDetails={setDetails} />
                );
              })}
            </div>
          </>
        ) : (
          <div className="text-gray-300 flex flex-col gap-y-5 justify-center h-[calc(100%-103px)] items-center">
            <FaCheckCircle size={50} />
            <p>Great work, all tasks are completed!</p>
          </div>
        )}
        <TaskInput id={id} />
      </div>
      <AnimatePresence mode="popLayout">
        {task && (
          <motion.div exit={{ x: "100%" }}>
            <Details task={task} setDetails={setDetails} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default Tasks;
