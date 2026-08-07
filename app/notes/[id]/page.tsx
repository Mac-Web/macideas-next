import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import Bar from "@/components/notes/Bar";

async function Page({ params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session) redirect("/");
  const { id } = await params;
  const existingNote = await prisma.note.findUnique({
    where: { id, userId: session.user.id },
    include: { folder: true },
  });
  if (!existingNote) redirect("/notes");

  return (
    <div
      className="flex flex-col items-center flex-1 relative h-[calc(100vh-68px)] bg-center! bg-cover!"
      style={{
        background: existingNote.backgroundImage
          ? `linear-gradient(rgba(0,0,0,0.8),rgba(0,0,0,0.8)),url('${existingNote.backgroundImage}')`
          : "",
      }}
    >
      <Bar note={existingNote} folder={existingNote.folder} />
      <div className="text-white text-xl font-bold py-5">
        {existingNote.name}
      </div>
    </div>
  );
}

export default Page;
