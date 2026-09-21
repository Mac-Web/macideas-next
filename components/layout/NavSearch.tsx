"use client";

import type { Note, Task } from "@/generated/prisma/client";
import { useState, useEffect, useRef } from "react";
import { FaBars, FaCheckCircle, FaStickyNote, FaBook } from "react-icons/fa";
import { FaFolder } from "react-icons/fa6";
import { usePathname } from "next/navigation";
import Input from "../ui/Input";
import Link from "next/link";

type TaskType = Task & {
  color: string;
  name: string;
  type: string;
  taskLists: Task[];
  notes: Note[];
};

function NavSearch() {
  const [search, setSearch] = useState<string>("");
  const [result, setResult] = useState<TaskType[]>([]);
  const [searching, setSearching] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  //TODO: more powerful filters, parameters, and ranges for the search

  async function handleSearch(e: React.SubmitEvent) {
    e.preventDefault();
    if (search.trim().length > 0) {
      setSearching(true);
      setLoading(true);
      const res = await fetch(`/api/search?q=${search.trim()}`).then((res) =>
        res.json(),
      );
      setResult(res);
      setLoading(false);
    }
  }

  useEffect(() => {
    const clickHandler = (e: MouseEvent) => {
      if (!searchRef.current?.contains(e.target as Node)) {
        setSearching(false);
      }
    };

    document.addEventListener("click", clickHandler);

    return () => {
      document.removeEventListener("click", clickHandler);
    };
  }, []);

  useEffect(() => {
    setSearching(false);
  }, [pathname]);

  return (
    <div className="flex-1 relative" ref={searchRef}>
      <form onSubmit={handleSearch}>
        <Input
          placeholder="Search MacIdeas"
          value={search}
          setValue={(s) => setSearch(s)}
          styles="w-full"
          onclear={() => setSearching(false)}
          clear
        />
      </form>
      {searching && (
        <div className="absolute bg-gray-300 dark:bg-gray-900 rounded-b top-[calc(100%-5px)] p-2 pt-4 flex flex-col gap-y-1 w-full">
          {loading || result.length == 0 ? (
            <div className="text-sm text-center pt-2 pb-5 text-gray-700 dark:text-gray-300">
              {loading
                ? "Searching everything..."
                : "No results found. Try a different search?"}
            </div>
          ) : (
            result.map((res) => {
              return (
                <Link
                  key={res.id}
                  href={`/${res.type.includes("task") ? "task" : res.type.includes("note") ? "note" : res.type}s/${res.taskListId ? res.taskListId : res.type.includes("folder") ? (res.type === "task-folder" ? res.taskLists[0] || "" : res.notes[0] || "").id : res.id}`}
                  className="rounded px-4 py-2 hover:bg-gray-200 dark:hover:bg-gray-950/50 flex items-center gap-x-4"
                >
                  {res.type === "task-list" && <FaBars size={20} />}
                  {res.type === "task" && <FaCheckCircle size={20} />}
                  {res.type.includes("folder") && (
                    <FaFolder style={{ color: res.color }} size={20} />
                  )}
                  {res.type === "note" && <FaStickyNote size={20} />}
                  {res.type === "project" && <FaBook size={20} />}
                  {/* TODO: display custom emoji if applicable */}
                  <div className="flex flex-col gap-y-0.5 text-sm">
                    {res.text || res.name}
                    <span className="text-gray-700 dark:text-gray-300 text-xs">
                      {res.type[0].toUpperCase() +
                        res.type.slice(1).replaceAll("-", " ")}
                    </span>
                  </div>
                </Link>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}

export default NavSearch;
