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

export async function renameProject(id: string, name: string) {
  try {
    const session = await getSession();
    if (session) {
      await prisma.project.update({
        where: { id, userId: session.user.id },
        data: { name },
      });
      revalidatePath("/projects");
    }
  } catch (err) {
    console.error("Error: " + err);
  }
}

export async function addEmoji(id: string, emoji: string | undefined) {
  try {
    const session = await getSession();
    if (session) {
      await prisma.project.update({
        where: { id, userId: session.user.id },
        data: { emoji },
      });
      revalidatePath(`/projects`);
    }
  } catch (err) {
    console.error("Error: " + err);
  }
}

export async function starProject(id: string, starred: boolean) {
  try {
    const session = await getSession();
    if (session) {
      await prisma.project.update({
        where: { id, userId: session.user.id },
        data: { starred },
      });
      revalidatePath("/projects");
    }
  } catch (err) {
    console.error("Error: " + err);
  }
}

export async function deleteProject(id: string) {
  try {
    const session = await getSession();
    if (session) {
      await prisma.project.delete({
        where: { id, userId: session.user.id },
      });
      revalidatePath("/projects");
    }
  } catch (err) {
    console.error("Error: " + err);
  }
}

export async function addProjects(
  id: string,
  projects: string[],
  pathname: string,
) {
  try {
    const session = await getSession();
    if (session) {
      await prisma.folder.update({
        where: { id, userId: session.user.id },
        data: {
          projects: {
            set: projects.map((id) => {
              return { id };
            }),
          },
        },
      });
      revalidatePath(pathname);
    }
  } catch (err) {
    console.error("Error: " + err);
  }
}
