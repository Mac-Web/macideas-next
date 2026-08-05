"use server";

import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createNote(path: string, folderId?: string) {
  try {
    const session = await getSession();
    if (session) {
      const newNote = await prisma.note.create({
        data: {
          name: "Untitled note",
          userId: session.user.id,
          content: "",
          folderId,
        },
      });
      revalidatePath(path);
      return newNote.id;
    }
  } catch (err) {
    console.error("Error: " + err);
  }
}

export async function starNote(id: string, starred: boolean) {
  try {
    const session = await getSession();
    if (session) {
      await prisma.note.update({
        where: { id, userId: session.user.id },
        data: { starred },
      });
      revalidatePath("/notes");
    }
  } catch (err) {
    console.error("Error: " + err);
  }
}

export async function addEmoji(id: string, emoji: string | undefined) {
  try {
    const session = await getSession();
    if (session) {
      await prisma.note.update({
        where: { id, userId: session.user.id },
        data: { emoji },
      });
      revalidatePath("/notes");
    }
  } catch (err) {
    console.error("Error: " + err);
  }
}

export async function renameNote(id: string, name: string) {
  try {
    const session = await getSession();
    if (session) {
      await prisma.note.update({
        where: { id, userId: session.user.id },
        data: { name },
      });
      revalidatePath("/notes");
    }
  } catch (err) {
    console.error("Error: " + err);
  }
}

export async function deleteNote(id: string) {
  try {
    const session = await getSession();
    if (session) {
      await prisma.note.delete({
        where: { id, userId: session.user.id },
      });
      revalidatePath("/notes");
    }
  } catch (err) {
    console.error("Error: " + err);
  }
}
