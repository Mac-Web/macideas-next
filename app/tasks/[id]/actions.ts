"use server";

import type { TaskType } from "@/types/tasks";
import type { Task } from "@/generated/prisma/client";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function addDescription(id: string, description: string) {
  try {
    const session = await getSession();
    if (session) {
      await prisma.taskList.update({
        where: { id, userId: session.user.id },
        data: { description },
      });
      revalidatePath(`/tasks/${id}`);
    }
  } catch (err) {
    console.error("Error: " + err);
  }
}

export async function addTask(newTask: TaskType, taskListId: string) {
  try {
    const session = await getSession();
    if (session) {
      const { text, start, due, tags, starred } = newTask;
      await prisma.taskList.update({
        where: { id: taskListId, userId: session.user.id },
        data: {
          tasks: {
            create: {
              text,
              userId: session.user.id,
              start,
              due,
              starred,
              tags: {
                connect: tags?.map((id) => {
                  return { id };
                }),
              },
            },
          },
        },
        include: { tasks: true },
      });
      revalidatePath(`/tasks/${taskListId}`);
    }
  } catch (err) {
    console.error("Error: " + err);
  }
}

export async function updateTask(task: Task) {
  try {
    const session = await getSession();
    if (session) {
      const { text, description, completed, starred } = task;
      const updated = { text, description, completed, starred };
      await prisma.task.update({
        where: { id: task.id, userId: session.user.id },
        data: { ...updated },
      });
      revalidatePath(`/tasks/${task.taskListId}`);
    }
  } catch (err) {
    console.error("Error: " + err);
  }
}

export async function deleteTask(id: string) {
  try {
    const session = await getSession();
    if (session) {
      const deletedTask = await prisma.task.delete({
        where: { id, userId: session.user.id },
      });
      revalidatePath(`/tasks/${deletedTask.taskListId}`);
    }
  } catch (err) {
    console.error("Error: " + err);
  }
}

export async function starTask(id: string, starred: boolean) {
  try {
    const session = await getSession();
    if (session) {
      const updatedTask = await prisma.task.update({
        where: { id, userId: session.user.id },
        data: { starred },
      });
      revalidatePath(`/tasks/${updatedTask.taskListId}`);
    }
  } catch (err) {
    console.error("Error: " + err);
  }
}

export async function completeTask(id: string, completed: boolean) {
  try {
    const session = await getSession();
    if (session) {
      const updatedTask = await prisma.task.update({
        where: { id, userId: session.user.id },
        data: { completed },
      });
      revalidatePath(`/tasks/${updatedTask.taskListId}`);
    }
  } catch (err) {
    console.error("Error: " + err);
  }
}

export async function createTag(name: string, taskListId: string) {
  try {
    const session = await getSession();
    if (session) {
      await prisma.tag.create({
        data: { name, userId: session.user.id },
      });
      revalidatePath(`/tasks/${taskListId}`);
    }
  } catch (err) {
    console.error("Error: " + err);
  }
}

export async function setTags(id: string, tags: string[]) {
  try {
    const session = await getSession();
    if (session) {
      const updatedTask = await prisma.task.update({
        where: { id, userId: session.user.id },
        data: {
          tags: {
            set: tags.map((id) => {
              return { id };
            }),
          },
        },
      });
      revalidatePath(`/tasks/${updatedTask.taskListId}`);
    }
  } catch (err) {
    console.error("Error: " + err);
  }
}

export async function renameTag(id: string, name: string, taskListId: string) {
  try {
    const session = await getSession();
    if (session) {
      await prisma.tag.update({
        where: { id, userId: session.user.id },
        data: { name },
      });
      revalidatePath(`/tasks/${taskListId}`);
    }
  } catch (err) {
    console.error("Error: " + err);
  }
}

export async function deleteTag(id: string, taskListId: string) {
  try {
    const session = await getSession();
    if (session) {
      await prisma.tag.delete({
        where: { id, userId: session.user.id },
      });
      revalidatePath(`/tasks/${taskListId}`);
    }
  } catch (err) {
    console.error("Error: " + err);
  }
}

export async function colorTag(id: string, color: string, taskListId: string) {
  try {
    const session = await getSession();
    if (session) {
      await prisma.tag.update({
        where: { id, userId: session.user.id },
        data: { color },
      });
      revalidatePath(`/tasks/${taskListId}`);
    }
  } catch (err) {
    console.error("Error: " + err);
  }
}

export async function emojiTag(id: string, emoji: string, taskListId: string) {
  try {
    const session = await getSession();
    if (session) {
      await prisma.tag.update({
        where: { id, userId: session.user.id },
        data: { emoji },
      });
      revalidatePath(`/tasks/${taskListId}`);
    }
  } catch (err) {
    console.error("Error: " + err);
  }
}

//TODO: merge the above functions together and use another parameter to determine what to update

export async function updateDates(id: string, start?: Date, due?: Date) {
  try {
    const session = await getSession();
    if (session) {
      const updatedTask = await prisma.task.update({
        where: { id },
        data: { start: start || null, due: due || null },
      });
      revalidatePath(`/tasks/${updatedTask.taskListId}`);
    }
  } catch (err) {
    console.error("Error: " + err);
  }
}

export async function renameTask(id: string, text: string) {
  try {
    const session = await getSession();
    if (session) {
      const updatedTask = await prisma.task.update({
        where: { id, userId: session.user.id },
        data: { text },
      });
      revalidatePath(`/tasks/${updatedTask.taskListId}`);
    }
  } catch (err) {
    console.error("Error: " + err);
  }
}
