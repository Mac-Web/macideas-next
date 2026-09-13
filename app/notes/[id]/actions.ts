"use server";

import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function addDescription(id: string, description: string) {
  try {
    const session = await getSession();
    if (session) {
      await prisma.note.update({
        where: { id, userId: session.user.id },
        data: { description },
      });
      revalidatePath(`/notes/${id}`);
    }
  } catch (err) {
    console.error("Error: " + err);
  }
}

export async function saveContent(id: string, content: string) {
  try {
    const session = await getSession();
    if (session) {
      await prisma.note.update({
        where: { id, userId: session.user.id },
        data: { content },
      });
    }
  } catch (err) {
    console.error("Error: " + err);
  }
}

export async function updateColor(id: string, color: string) {
  try {
    const session = await getSession();
    if (session) {
      await prisma.note.update({
        where: { id, userId: session.user.id },
        data: { backgroundColor: color },
      });
      revalidatePath(`/notes/${id}`);
    }
  } catch (err) {
    console.error("Error: " + err);
  }
}

export async function resetBg(id: string) {
  try {
    const session = await getSession();
    if (session) {
      await prisma.note.update({
        where: { id, userId: session.user.id },
        data: { backgroundColor: null, backgroundImage: null },
      });
      revalidatePath(`/notes/${id}`);
    }
  } catch (err) {
    console.error("Error: " + err);
  }
}
