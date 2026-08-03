"use client";

import type { TaskType } from "@/types/tasks";
import type { Tag } from "@/generated/prisma/client";
import { useState } from "react";
import { FaCalendar, FaRegStar, FaStar, FaTag } from "react-icons/fa";
import { addTask } from "@/app/tasks/[id]/actions";
import { AnimatePresence } from "framer-motion";
import DateModal from "../modals/DateModal";
import TagModal from "../modals/TagModal";
import Input from "../ui/Input";
import Btn from "../ui/Btn";

const blankTask = { text: "" };

interface TaskInputProps {
  id: string;
  tags: Tag[];
}

function TaskInput({ id, tags }: TaskInputProps) {
  const [newTask, setNewTask] = useState<TaskType>(blankTask);
  const [loading, setLoading] = useState<boolean>(false);
  const [picking, setPicking] = useState<boolean>(false);
  const [tagging, setTagging] = useState<boolean>(false);

  async function handleSubmit(e: React.SubmitEvent) {
    e.preventDefault();
    if (newTask.text.trim().length > 0) {
      setLoading(true);
      await addTask(newTask, id);
      setLoading(false);
      setNewTask(blankTask);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="border-2 border-gray-700 rounded flex flex-col pt-3.5 pb-2 gap-y-2 w-full"
    >
      <div className="flex gap-x-5 text-gray-300 px-3">
        <FaTag
          size={17}
          title="Add tags"
          className="cursor-pointer"
          onClick={() => setTagging(true)}
        />
        <FaCalendar
          size={17}
          title="Pick dates"
          className="cursor-pointer"
          onClick={() => setPicking(true)}
        />
        {newTask.starred ? (
          <FaStar
            size={17}
            title="Unmark as starred"
            className="cursor-pointer text-teal-600"
            onClick={() => setNewTask({ ...newTask, starred: false })}
          />
        ) : (
          <FaRegStar
            size={17}
            title="Mark as starred"
            className="cursor-pointer"
            onClick={() => setNewTask({ ...newTask, starred: true })}
          />
        )}
        {newTask.due && (
          <span className="text-sm" title={newTask.due.toISOString()}>
            Dues {newTask.due.toLocaleDateString()}
          </span>
        )}
        {newTask.start && (
          <span className="text-sm" title={newTask.start.toISOString()}>
            Starts {newTask.start.toLocaleDateString()}
          </span>
        )}
        {/* TODO: add priority dropdown */}
      </div>
      <div className="flex items-center w-full relative pr-2">
        <Input
          placeholder="Enter your task here"
          value={newTask.text}
          setValue={(text) => setNewTask({ ...newTask, text })}
          styles="w-full flex-1 bg-gray-950"
          full
        />
        <Btn text={loading ? "Adding..." : "Add"} type="submit" primary />
      </div>
      <AnimatePresence>
        {picking && (
          <DateModal
            setDates={(start, due) => setNewTask({ ...newTask, start, due })}
            closeModal={() => setPicking(false)}
            startDate={newTask.start}
            dueDate={newTask.due}
          />
        )}
        {tagging && (
          <TagModal
            tags={tags}
            closeModal={() => setTagging(false)}
            selected={newTask.tags || []}
            taskListId={id}
            returnTags={(tags) => setNewTask({ ...newTask, tags })}
          />
        )}
      </AnimatePresence>
    </form>
  );
}

export default TaskInput;
