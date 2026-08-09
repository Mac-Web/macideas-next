"use server";

import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function addDescription(id: string, description: string | null) {
  try {
    const session = await getSession();
    if (session) {
      await prisma.project.update({
        where: { id, userId: session.user.id },
        data: { description: description || null },
      });
      revalidatePath(`/projects/${id}`);
    }
  } catch (err) {
    console.error("Error: " + err);
  }
}
