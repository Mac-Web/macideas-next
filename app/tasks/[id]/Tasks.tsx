"use client";

import type { Tag } from "@/generated/prisma/client";
import type { TaskType } from "@/components/tasks/Task";
import { useState, useMemo } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  FaArrowsAltV,
  FaCheckCircle,
  FaFilter,
  FaSort,
  FaTag,
} from "react-icons/fa";
import { priorities } from "@/lib/constants";
import Task from "@/components/tasks/Task";
import TaskInput from "@/components/tasks/TaskInput";
import Input from "@/components/ui/Input";
import Details from "./Details";
import Checkbox from "@/components/ui/Checkbox";
import Dropdown from "@/components/ui/Dropdown";

const sorts = [
  "Created",
  "Updated",
  "Due date",
  "Start date",
  "Priority",
  "Name",
  "Starred",
];
const filters = ["All", "Starred", "Incomplete", "Completed"];
const optionStyles = "flex items-center gap-x-2 text-gray-300";

interface TasksProps {
  tasks: TaskType[];
  id: string;
  name: string;
  tags: Tag[];
  myDay?: boolean;
}

function Tasks({ tasks, id, name, tags, myDay }: TasksProps) {
  const [details, setDetails] = useState<string | null>(null);
  const [search, setSearch] = useState<string>("");
  const [showCompleted, setShowCompleted] = useState<boolean>(false);
  const [sort, setSort] = useState<string>(sorts[0]);
  const [filter, setFilter] = useState<string>(filters[0]);
  const [order, setOrder] = useState<string>("Ascending");
  const [filterOpen, setFilterOpen] = useState<boolean>(false);
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
          default:
            if (filter !== "All") {
              const priority = priorities.find((p) => p.name === filter);
              if (priority) {
                base =
                  base &&
                  (priority.name === "None"
                    ? !t.priority || t.priority === "None"
                    : t.priority === priority.name);
              } else {
                base =
                  base && t.tags.find((tag) => tag.id === filter)
                    ? true
                    : false;
              }
            }
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
            if (a.due && !b.due) return -1;
            if (b.due && !a.due) return 1;
            return (a.due?.getTime() || 0) - (b.due?.getTime() || 0);
          case "Start date":
            if (a.start && !b.start) return -1;
            if (b.start && !a.start) return 1;
            return (a.start?.getTime() || 0) - (b.start?.getTime() || 0);
          case "Priority":
            return (
              (priorities.find((p) => p.name === b.priority)?.value || 0) -
              (priorities.find((p) => p.name === a.priority)?.value || 0)
            );
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
              selected={
                !filters.find((f) => f === filter)
                  ? priorities.find((p) => p.name === filter)?.name ||
                    tags.find((t) => t.id === filter)!.name
                  : filter
              }
              setSelected={(f) => setFilter(f)}
              values={filters}
              open={filterOpen}
              setOpen={() => setFilterOpen(true)}
              text="Filter by"
            >
              {priorities.map((p, i) => (
                <div
                  key={i}
                  className={`flex gap-x-2 items-center cursor-pointer hover:bg-gray-900 px-2 py-1 rounded
                    ${filter === p.name && "font-bold text-teal-600"}`}
                  onClick={() => {
                    setFilter(p.name);
                    setFilterOpen(false);
                  }}
                >
                  {p.name}
                </div>
              ))}
              <hr className="my-2 border-0 min-h-0.5 w-full bg-gray-700" />
              {tags.length > 0
                ? tags.map((tag) => (
                    <div
                      key={tag.id}
                      className={`flex gap-x-2 items-center text-sm cursor-pointer hover:bg-gray-900 px-2 py-1 rounded
                    ${filter === tag.id && "font-bold text-teal-600"}`}
                      onClick={() => {
                        setFilter(tag.id);
                        setFilterOpen(false);
                      }}
                    >
                      <span className="text-xs">
                        {tag.emoji || <FaTag size={13} />}
                      </span>
                      {tag.name}
                    </div>
                  ))
                : null}
            </Dropdown>
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
        <div className="flex flex-col gap-y-2 pb-3 overflow-auto h-[calc(100%-174px)]">
          {displayedTasks.length > 0 ? (
            displayedTasks.map((task) => {
              return (
                <Task
                  key={task.id}
                  task={task}
                  setDetails={setDetails}
                  tags={tags}
                  taskListId={id}
                />
              );
            })
          ) : tasks.filter((t) => !t.completed).length > 0 ? (
            <div className="text-gray-300 text-center py-10">
              No tasks found! Create one below or try a different search.
            </div>
          ) : (
            <div className="text-gray-300 flex flex-col gap-y-5 justify-center h-[calc(100%-114px)] items-center">
              <FaCheckCircle size={50} />
              <p>Great work, all tasks are completed!</p>
            </div>
          )}
        </div>
        <TaskInput id={id} tags={tags} myDay={myDay} />
      </div>
      <AnimatePresence mode="popLayout">
        {task && (
          <motion.div exit={{ x: "100%" }}>
            <Details task={task} setDetails={setDetails} tags={tags} id={id} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default Tasks;
