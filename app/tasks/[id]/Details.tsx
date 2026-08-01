"use client";

import type { Task } from "@/generated/prisma/client";
import { AnimatePresence, motion } from "framer-motion";
import { useState, useEffect } from "react";
import { FaXmark } from "react-icons/fa6";
import { deleteTask, updateTask } from "./actions";
import Input from "@/components/ui/Input";
import Textarea from "@/components/ui/Textarea";
import Btn from "@/components/ui/Btn";
import Checkbox from "@/components/ui/Checkbox";
import WarningModal from "@/components/modals/WarningModal";

interface DetailsProps {
  task: Task;
  setDetails: React.Dispatch<React.SetStateAction<string | null>>;
}

function Details({ task, setDetails }: DetailsProps) {
  const [openedTask, setOpenedTask] = useState<Task>(task);
  const [loading, setLoading] = useState<boolean>(false);
  const [deleting, setDeleting] = useState<boolean>(false);

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
    <div className="w-70 border-l border-l-gray-700 h-full bg-gray-950 p-5 relative">
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
      </AnimatePresence>
    </div>
  );
}

export default Details;
