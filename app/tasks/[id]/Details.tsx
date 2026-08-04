"use client";

import type { Tag, Task } from "@/generated/prisma/client";
import type { TaskType } from "@/components/tasks/Task";
import { AnimatePresence, motion } from "framer-motion";
import { useState, useEffect } from "react";
import { FaPlusCircle, FaTag } from "react-icons/fa";
import { FaCalendarCheck, FaCalendarDay, FaXmark } from "react-icons/fa6";
import { deleteTask, updateTask } from "./actions";
import { priorities } from "@/lib/constants";
import Dropdown from "@/components/ui/Dropdown";
import Input from "@/components/ui/Input";
import Textarea from "@/components/ui/Textarea";
import Btn from "@/components/ui/Btn";
import Checkbox from "@/components/ui/Checkbox";
import WarningModal from "@/components/modals/WarningModal";
import TagModal from "@/components/modals/TagModal";
import DateModal from "@/components/modals/DateModal";
import Subtasks from "@/components/tasks/Subtasks";

interface DetailsProps {
  task: TaskType;
  setDetails: React.Dispatch<React.SetStateAction<string | null>>;
  tags: Tag[];
  id: string;
}

function Details({ task, setDetails, tags, id }: DetailsProps) {
  const [openedTask, setOpenedTask] = useState<Task>(task);
  const [loading, setLoading] = useState<boolean>(false);
  const [deleting, setDeleting] = useState<boolean>(false);
  const [adding, setAdding] = useState<boolean>(false);
  const [picking, setPicking] = useState<boolean>(false);

  function displayTime(time: Date) {
    return `${time.toLocaleDateString()} ${(time.getHours() % 12 !== 0
      ? time.getHours() % 12
      : 12
    )
      .toString()
      .padStart(
        2,
        "0",
      )}:${time.getMinutes().toString().padStart(2, "0")} ${time.getHours() > 11 ? "PM" : "AM"}`;
  }

  async function handleSave() {
    setLoading(true);
    await updateTask(openedTask);
    setLoading(false);
  }

  async function handleDelete() {
    setLoading(true);
    await deleteTask(openedTask.id);
    setLoading(false);
  }

  useEffect(() => {
    if (task) {
      setOpenedTask(task);
    }
  }, [task]);

  return (
    <div className="w-70 border-l border-l-gray-700 h-full bg-gray-950 p-5 relative overflow-y-auto overflow-x-hidden">
      <motion.div
        initial={{ x: "100%", opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ type: "spring", damping: 15, duration: 0.01 }}
        className="text-gray-300 flex flex-col gap-y-5 overflow-auto text-sm"
      >
        <h2 className="text-lg text-white font-bold">Task details</h2>
        <label className="flex flex-col gap-y-1">
          Task
          <Input
            placeholder="New task"
            value={openedTask.text}
            setValue={(text) => setOpenedTask({ ...openedTask, text })}
            styles="text-sm w-full"
          />
        </label>
        <label className="flex flex-col gap-y-1">
          Description
          <Textarea
            placeholder="This is a task"
            value={openedTask.description || ""}
            setValue={(description) =>
              setOpenedTask({ ...openedTask, description })
            }
          />
        </label>
        <Subtasks taskId={task.id} subtasks={task.subtasks} taskListId={id} />
        <label className="flex flex-col gap-y-1">
          Priority
          <Dropdown
            selected={openedTask.priority || "None"}
            setSelected={(priority) =>
              setOpenedTask({ ...openedTask, priority })
            }
            values={priorities.map((p) => p.name)}
            text="Priority"
            styles={`py-0.5! border-none! bg-gray-900 ${priorities.find((p) => p.name === openedTask.priority)?.color}`}
            hover={false}
          />
        </label>
        {(task.start || task.due) && (
          <div
            className="flex flex-col gap-y-2 cursor-pointer"
            onClick={() => setPicking(true)}
          >
            {task.due && (
              <span
                className="flex items-center gap-x-3"
                title={task.due.toISOString()}
              >
                <FaCalendarCheck size={15} /> Dues {displayTime(task.due)}
              </span>
            )}
            {task.start && (
              <span
                className="flex items-center gap-x-3"
                title={task.start.toISOString()}
              >
                <FaCalendarDay size={15} /> Starts {displayTime(task.start)}
              </span>
            )}
          </div>
        )}
        <div className="flex flex-col gap-y-2">
          Tags
          <div className="flex gap-2 flex-wrap">
            {task.tags.map((tag) => (
              <div
                key={tag.id}
                className="flex gap-x-2 items-center bg-gray-900 rounded px-2 py-1"
                style={{ backgroundColor: tag.color || undefined }}
              >
                {tag.emoji ? <span>{tag.emoji}</span> : <FaTag size={13} />}
                {tag.name}
              </div>
            ))}
            <div
              className="border-2 border-gray-700 rounded px-2 py-1 flex gap-x-1 items-center cursor-pointer
             hover:bg-gray-900 w-fit"
              onClick={() => setAdding(true)}
            >
              <FaPlusCircle size={15} /> Add tags
            </div>
          </div>
        </div>
        <Checkbox
          text="Completed"
          checked={openedTask.completed}
          setChecked={(completed) =>
            setOpenedTask({ ...openedTask, completed })
          }
        />
        <Checkbox
          text="Starred"
          checked={openedTask.starred}
          setChecked={(starred) => setOpenedTask({ ...openedTask, starred })}
        />
        <span title={openedTask.createdAt.toISOString()}>
          Created {displayTime(openedTask.createdAt)}
        </span>
        <span title={openedTask.updatedAt.toISOString()}>
          Updated {displayTime(openedTask.updatedAt)}
        </span>
        <span className="text-xs">ID: {openedTask.id}</span>
        <div className="flex gap-x-3">
          <Btn
            text={loading ? "Saving..." : "Save"}
            onclick={handleSave}
            styles="w-fit text-sm"
            primary
          />
          <Btn
            text="Delete"
            onclick={() => setDeleting(true)}
            styles="w-fit text-sm"
          />
        </div>
      </motion.div>
      <FaXmark
        size={20}
        className="cursor-pointer text-gray-300 absolute top-3 right-3"
        onClick={() => setDetails(null)}
        title="Close panel"
      />
      <AnimatePresence>
        {deleting && (
          <WarningModal
            title="Delete confirmation"
            description={`Are you sure you want to delete the task ${openedTask.text}? This action cannot be undone.`}
            confirm={handleDelete}
            closeModal={() => setDeleting(false)}
            loading={loading}
          />
        )}
        {adding && (
          <TagModal
            tags={tags}
            closeModal={() => setAdding(false)}
            taskListId={id}
            selected={task.tags.map((t) => t.id)}
            taskId={task.id}
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
  );
}

export default Details;
