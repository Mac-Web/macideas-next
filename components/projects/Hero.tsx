"use client";

import { useState } from "react";
import { renameProject } from "@/app/projects/actions";
import { addDescription } from "@/app/projects/[id]/actions";
import Input from "../ui/Input";
import Textarea from "../ui/Textarea";

interface HeroProps {
  id: string;
  name: string;
  description: string | null;
}

function Hero({ id, name, description }: HeroProps) {
  const [newName, setNewName] = useState<string | null>(null);
  const [newDescription, setNewDescription] = useState<string | null>(null);

  async function handleRename() {
    setNewName(null);
    if (newName && newName.trim().length > 0) {
      await renameProject(id, newName);
    }
  }

  async function handleDescription() {
    setNewDescription(null);
    await addDescription(id, newDescription);
  }

  return (
    <div className="flex flex-col items-center gap-y-5 pt-10">
      {newName !== null ? (
        <Input
          placeholder="New project"
          value={newName}
          setValue={(n) => setNewName(n)}
          onblur={handleRename}
        />
      ) : (
        <div
          className="text-white text-2xl font-bold cursor-pointer"
          title="Rename project"
          onClick={() => setNewName(name)}
        >
          {name}
        </div>
      )}
      {newDescription !== null ? (
        <Textarea
          placeholder="Cool project"
          value={newDescription}
          setValue={(n) => setNewDescription(n)}
          onblur={handleDescription}
          styles="w-80"
        />
      ) : description ? (
        <div
          className="cursor-pointer text-gray-300 text-sm text-center"
          title="Edit description"
          onClick={() => setNewDescription(description)}
        >
          {description}
        </div>
      ) : (
        <div
          className="cursor-pointer text-gray-300 text-sm hover:underline"
          onClick={() => setNewDescription("")}
        >
          Add description
        </div>
      )}
    </div>
  );
}

export default Hero;
