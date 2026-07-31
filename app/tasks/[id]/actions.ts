"use server";

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
