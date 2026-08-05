"use client";

import type { TaskType } from "../Task";
import type { Tag } from "@/generated/prisma/client";
import { useState } from "react";
import { FaCircleCheck } from "react-icons/fa6";
import Task from "./Task";
import Dropdown from "@/components/ui/Dropdown";
import Hide from "./Hide";

type TagType = Tag & {
  tasks: TaskType[];
};

interface TagsProps {
  tags: TagType[];
  showCompleted?: boolean;
}

function Tags({ tags, showCompleted }: TagsProps) {
  const [selectedTag, setSelectedTag] = useState<TagType>(tags[0]);
  const tasks = selectedTag.tasks.filter((t) =>
    showCompleted ? true : !t.completed,
  ); //TODO: handle tags with same name id problem and show the tag's emoji and background color

  return (
    <div className="border-2 border-gray-700 rounded p-5 flex flex-col gap-y-5 flex-1 min-w-[40%]">
      <div className="flex gap-x-3 items-center relative group">
        <div className="text-white text-xl font-bold">
          Task{tasks.length === 1 ? "" : "s"} with
        </div>
        <Dropdown
          selected={selectedTag.name}
          setSelected={(t) =>
            setSelectedTag(tags.find((tag) => tag.name === t)!)
          }
          values={tags.map((t) => t.name)}
          styles="text-sm!"
        />
        <div className="text-white text-xl font-bold">tag ({tasks.length})</div>
        <div className="absolute right-0">
          <Hide id={5} />
        </div>
      </div>
      {tasks.length > 0 ? (
        <div className="flex flex-col gap-y-3">
          {tasks.map((task) => (
            <Task key={task.id} task={task} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col gap-y-5 items-center text-gray-300 text-center py-10 justify-center h-full">
          <FaCircleCheck size={40} />
          You don&apos;t have any tasks with the {selectedTag.name} tag
        </div>
      )}
    </div>
  );
}

export default Tags;
