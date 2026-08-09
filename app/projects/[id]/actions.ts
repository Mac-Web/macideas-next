"use server";

import { SelectionType } from "@/components/modals/AddModal";
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

export async function addItems(id: string, selected: SelectionType[]) {
  try {
    const session = await getSession();
    if (session) {
      const sorted = selected.reduce((acc: Record<string, string[]>, item) => {
        acc[item.type] = acc[item.type]
          ? [...acc[item.type], item.id]
          : [item.id];
        return acc;
      }, {});
      await prisma.project.update({
        where: { id, userId: session.user.id },
        data: {
          folders: {
            set: sorted["Folders"].map((id) => {
              return { id };
            }),
          },
          taskLists: {
            set: sorted["Task lists"].map((id) => {
              return { id };
            }),
          },
          tasks: {
            set: sorted["Tasks"].map((id) => {
              return { id };
            }),
          },
          notes: {
            set: sorted["Notes"].map((id) => {
              return { id };
            }),
          },
        },
      });
      revalidatePath(`/projects/${id}`);
    }
  } catch (err) {
    console.error("Error: " + err);
  }
}
