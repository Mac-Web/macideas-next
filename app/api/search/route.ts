import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const query = req.nextUrl.searchParams.get("q");
    if (!query) return NextResponse.json({ message: "No query provided" });
    const session = await getSession();
    if (!session) return NextResponse.json({ message: "Not authorized" });
    const taskLists = await prisma.taskList.findMany({
      where: {
        userId: session.user.id,
        OR: [
          {
            name: { contains: query, mode: "insensitive" },
          },
          {
            description: { contains: query, mode: "insensitive" },
          },
        ],
      },
      take: 5,
    });
    const tasks = await prisma.task.findMany({
      where: {
        userId: session.user.id,
        OR: [
          {
            text: { contains: query, mode: "insensitive" },
          },
          {
            description: { contains: query, mode: "insensitive" },
          },
          {
            tags: { some: { name: { contains: query, mode: "insensitive" } } },
          }, //TODO: search other data about tasks too
        ],
      },
      take: 5,
    });
    const folders = await prisma.folder.findMany({
      where: {
        userId: session.user.id,
        name: { contains: query, mode: "insensitive" },
      },
      include: { taskLists: true, notes: true },
      take: 5,
    });
    const notes = await prisma.note.findMany({
      where: {
        userId: session.user.id,
        OR: [
          {
            name: { contains: query, mode: "insensitive" },
          },
          {
            content: { contains: query, mode: "insensitive" },
          },
          {
            description: { contains: query, mode: "insensitive" },
          },
        ],
      },
      take: 5,
    });
    const projects = await prisma.project.findMany({
      where: {
        userId: session.user.id,
        OR: [
          {
            name: { contains: query, mode: "insensitive" },
          },
          {
            description: { contains: query, mode: "insensitive" },
          },
        ],
      },
      take: 5,
    });
    const result = [
      ...taskLists.map((t) => {
        return { ...t, type: "task-list" };
      }),
      ...tasks.map((t) => {
        return { ...t, type: "task" };
      }),
      ...folders.map((f) => {
        return {
          ...f,
          type:
            f.taskLists.length > f.notes.length ? "task-folder" : "note-folder",
        };
      }),
      ...notes.map((n) => {
        return { ...n, type: "note" };
      }),
      ...projects.map((p) => {
        return { ...p, type: "project" };
      }),
    ];
    return NextResponse.json(result);
  } catch (err) {
    console.error("Error: " + err);
  }
}
