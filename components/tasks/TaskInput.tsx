"use client";

import type { TaskType } from "@/types/tasks";
import React, { useState } from "react";
import Input from "../ui/Input";
import Btn from "../ui/Btn";
import { FaCalendar, FaRegStar, FaStar, FaTag } from "react-icons/fa";

const blankTask = { text: "" };

function TaskInput() {
  const [newTask, setNewTask] = useState<TaskType>(blankTask);
  const [loading, setLoading] = useState<boolean>(false);

  async function handleSubmit(e: React.SubmitEvent) {
    e.preventDefault();
    if (newTask.text.trim().length > 0) {
      setLoading(true);
      console.log(newTask);
      setLoading(false);
      setNewTask(blankTask);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="border-2 border-gray-700 rounded flex flex-col pt-3.5 pb-2 gap-y-2 w-[calc(100%-24px)] absolute bottom-3"
    >
      <div className="flex gap-x-5 text-gray-300 px-3">
        <FaCalendar size={17} title="Due date" className="cursor-pointer" />
        <FaTag size={17} title="Add tags" className="cursor-pointer" />
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
    </form>
  );
}

export default TaskInput;
