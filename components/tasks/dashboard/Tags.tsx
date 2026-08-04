"use client";

import type { Tag, Task } from "@/generated/prisma/client";
import { useState } from "react";
import Dropdown from "@/components/ui/Dropdown";

type TagType = Tag & {
  tasks: Task[];
};

function Tags({ tags }: { tags: TagType[] }) {
  const [selectedTag, setSelectedTag] = useState<Tag>(tags[0]);

  return (
    <div className="border-2 border-gray-700 rounded p-5 flex flex-col gap-y-5 flex-1 min-w-[40%]">
      <h2 className="text-white text-xl font-bold">
        Tasks with{" "}
        <Dropdown
          selected={selectedTag.id}
          setSelected={(t) => setSelectedTag(tags.find((tag) => tag.id === t)!)}
          values={tags.map((t) => t.name)}
        />{" "}
        tag
      </h2>
      {/* TODO: make this work */}
    </div>
  );
}

export default Tags;
