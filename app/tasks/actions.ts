"use server";

import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createTaskList(path: string, folderId?: string) {
  try {
    const session = await getSession();
    if (session) {
      const newTaskList = await prisma.taskList.create({
        data: { name: "Untitled list", userId: session.user.id, folderId },
      });
      revalidatePath(path);
      return newTaskList.id;
    }
  } catch (err) {
    console.error("Error: " + err);
  }
}

export async function deleteTaskList(id: string) {
  try {
    const session = await getSession();
    if (session) {
      await prisma.taskList.delete({
        where: { id, userId: session.user.id },
      });
      revalidatePath("/tasks");
    }
  } catch (err) {
    console.error("Error: " + err);
  }
}

export async function renameTaskList(id: string, name: string) {
  try {
    const session = await getSession();
    if (session) {
      await prisma.taskList.update({
        where: { id, userId: session.user.id },
        data: { name },
      });
      revalidatePath("/tasks");
    }
  } catch (err) {
    console.error("Error: " + err);
  }
}

export async function starTaskList(id: string, starred: boolean) {
  try {
    const session = await getSession();
    if (session) {
      await prisma.taskList.update({
        where: { id, userId: session.user.id },
        data: {
          starred,
        },
      });
      revalidatePath("/tasks");
    }
  } catch (err) {
    console.error("Error: " + err);
  }
}

export async function addEmoji(id: string, emoji?: string) {
  try {
    const session = await getSession();
    if (session) {
      await prisma.taskList.update({
        where: { id, userId: session.user.id },
        data: { emoji },
      });
      revalidatePath("/tasks");
    }
  } catch (err) {
    console.error("Error: " + err);
  }
}

export async function createFolder(path: string) {
  try {
    const session = await getSession();
    if (session) {
      await prisma.folder.create({
        data: { name: "New folder", userId: session.user.id },
      });
      revalidatePath(path);
    }
  } catch (err) {
    console.error("Error: " + err);
  }
}

export async function renameFolder(id: string, name: string, path: string) {
  try {
    const session = await getSession();
    if (session) {
      await prisma.folder.update({
        where: { id, userId: session.user.id },
        data: { name },
      });
      revalidatePath(path);
    }
  } catch (err) {
    console.error("Error: " + err);
  }
}

export async function deleteFolder(id: string, path: string) {
  try {
    const session = await getSession();
    if (session) {
      await prisma.folder.delete({ where: { id, userId: session.user.id } });
      revalidatePath(path);
    }
  } catch (err) {
    console.error("Error: " + err);
  }
}

export async function colorFolder(id: string, color: string, path: string) {
  try {
    const session = await getSession();
    if (session) {
      await prisma.folder.update({
        where: { id, userId: session.user.id },
        data: { color },
      });
      revalidatePath(path);
    }
  } catch (err) {
    console.error("Error: " + err);
  }
}

export async function selectFolder(
  id: string,
  taskLists: string[],
  path: string,
) {
  try {
    const session = await getSession();
    if (session) {
      await prisma.folder.update({
        where: { id, userId: session.user.id },
        data: {
          taskLists: {
            set: taskLists.map((id) => {
              return { id };
            }),
          },
        },
      });
      revalidatePath(path);
    }
  } catch (err) {
    console.error("Error: " + err);
  }
}

export async function moveFolder(id: string, folderId: string, path: string) {
  try {
    const session = await getSession();
    if (session) {
      await prisma.taskList.update({
        where: { id, userId: session.user.id },
        data: { folderId: folderId || null },
      });
      revalidatePath(path);
    }
  } catch (err) {
    console.error("Error: " + err);
  }
}
