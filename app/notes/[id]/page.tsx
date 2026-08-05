import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";

async function Page({ params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session) redirect("/");
  const { id } = await params;
  const existingNote = await prisma.note.findUnique({
    where: { id, userId: session.user.id },
  });
  if (!existingNote) redirect("/notes");

  return <div>{existingNote.id}</div>;
}

export default Page;
