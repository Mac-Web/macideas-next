"use client";

import type { Task as TaskType } from "@/generated/prisma/client";
import { useState, useMemo } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FaArrowsAltV, FaCheckCircle, FaFilter, FaSort } from "react-icons/fa";
import Task from "@/components/tasks/Task";
import TaskInput from "@/components/tasks/TaskInput";
import Input from "@/components/ui/Input";
import Details from "./Details";
import Checkbox from "@/components/ui/Checkbox";
import Dropdown from "@/components/ui/Dropdown";

const sorts = ["Created", "Updated", "Due date", "Priority", "Name", "Starred"];
const filters = ["All", "Starred", "Incomplete", "Completed"];
const optionStyles = "flex items-center gap-x-2 text-gray-300";

interface TasksProps {
  tasks: TaskType[];
  id: string;
  name: string;
}

function Tasks({ tasks, id, name }: TasksProps) {
  const [details, setDetails] = useState<string | null>(null);
  const [search, setSearch] = useState<string>("");
  const [showCompleted, setShowCompleted] = useState<boolean>(false);
  const [sort, setSort] = useState<string>(sorts[0]);
  const [filter, setFilter] = useState<string>(filters[0]);
  const [order, setOrder] = useState<string>("Ascending");
  const displayedTasks = useMemo(() => {
    const query = search.trim().toLowerCase();
    const sorted = tasks
      .filter((t) => {
        let base =
          (t.text.toLowerCase().includes(query) ||
          t.description?.toLowerCase().includes(query)
            ? true
            : false) &&
          (showCompleted || !t.completed);
        switch (filter) {
          case "Starred":
            base = base && t.starred;
            break;
          case "Incomplete":
            base = base && !t.completed;
            break;
          case "Completed":
            setShowCompleted(true);
            base = base && t.completed;
            break;
        }
        return base;
      })
      .sort((a, b) => {
        if (a.completed && !b.completed) return 1;
        if (!a.completed && b.completed) return -1;
        switch (sort) {
          case "Created":
            return b.createdAt.getTime() - a.createdAt.getTime();
          case "Updated":
            return b.updatedAt.getTime() - a.updatedAt.getTime();
          case "Due date":
            return a.createdAt.getTime() - b.createdAt.getTime(); //TODO: add once due date is implemented
          case "Priority":
            return a.createdAt.getTime() - b.createdAt.getTime(); //TODO: add once priority is implemented
          case "Name":
            return a.text.localeCompare(b.text);
          case "Starred":
            return String(b.starred).localeCompare(String(a.starred));
          default:
            return a.id.localeCompare(b.id);
        }
      });
    if (order === "Descending") sorted.reverse();
    return sorted;
  }, [search, tasks, showCompleted, filter, sort, order]);
  const task = tasks.find((task) => task.id === details);

  return (
    <div className="w-full h-full flex overflow-x-hidden">
      <div className="px-3 w-full h-full">
        <div className="py-3 flex gap-x-3 items-center">
          <h2 className="text-white font-bold text-lg w-70">
            Task{displayedTasks.length === 1 ? "" : "s"} (
            {displayedTasks.length})
          </h2>
          <Input
            placeholder={`Search ${name}`}
            value={search}
            setValue={(s) => setSearch(s)}
            styles="text-base!"
            full
            clear
          />
          <div className={optionStyles}>
            <FaSort size={17} />
            <Dropdown
              selected={sort}
              setSelected={(s) => setSort(s)}
              values={sorts}
              text="Sort by"
            />
          </div>
          <div className={optionStyles}>
            <FaFilter size={17} />
            <Dropdown
              selected={filter}
              setSelected={(f) => setFilter(f)}
              values={filters}
              text="Filter by"
            />
          </div>
          <div className={optionStyles}>
            <FaArrowsAltV size={17} />
            <Dropdown
              selected={order}
              setSelected={(o) => setOrder(o)}
              values={["Ascending", "Descending"]}
              text="Order"
            />
          </div>
          <Checkbox
            text="Completed"
            checked={showCompleted}
            setChecked={(c) => {
              if (!c && filter === "Completed") setFilter("All");
              setShowCompleted(c);
            }}
            styles="text-sm gap-x-2!"
          />
        </div>
        <div className="flex flex-col gap-y-2 pb-3 overflow-auto h-122.25">
          {displayedTasks.length > 0 ? (
            displayedTasks.map((task) => {
              return <Task key={task.id} task={task} setDetails={setDetails} />;
            })
          ) : tasks.filter((t) => !t.completed).length > 0 ? (
            <div className="text-gray-300 text-center py-10">
              No tasks found! Create one below or try a different search.
            </div>
          ) : (
            <div className="text-gray-300 flex flex-col gap-y-5 justify-center h-[calc(100%-103px)] items-center">
              <FaCheckCircle size={50} />
              <p>Great work, all tasks are completed!</p>
            </div>
          )}
        </div>
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
