import type { Folder, Task, TaskList } from "@/generated/prisma/client";

export function sortList(
  list: TaskList[] | Folder[] | Task[],
  search: string,
  sort: string | null,
  isTask?: boolean,
) {
  return list
    .filter((i) =>
      (isTask ? (i as Task).text : (i as TaskList).name)
        .toLowerCase()
        .includes(search),
    )
    .sort((a, b) => {
      switch (sort) {
        case "n":
          return (
            isTask ? (a as Task).text : (a as TaskList).name
          ).localeCompare(isTask ? (b as Task).text : (b as TaskList).name);
        case "t":
          return 0;
        case "m":
          return a.updatedAt.getTime() - b.updatedAt.getTime();
        case "c":
          return a.createdAt.getTime() - b.createdAt.getTime();
        default:
          return 0;
      }
    });
}
