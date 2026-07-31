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
      await prisma.taskList.update({
        where: { id: taskListId, userId: session.user.id },
        data: {
          tasks: { create: { text: newTask.text, userId: session.user.id } },
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
