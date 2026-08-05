"use server";

import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function createProject(path: string) {
  try {
    const session = await getSession();
    if (session) {
      const newProject = await prisma.project.create({
        data: {
          name: "New project",
          userId: session.user.id,
        },
      });
      revalidatePath(path);
      return newProject.id;
    }
  } catch (err) {
    console.error("Error: " + err);
  }
}
