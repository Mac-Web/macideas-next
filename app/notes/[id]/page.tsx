import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import Editor from "@/components/notes/Editor";

async function fetchNoteData(id: string) {
  const session = await getSession();
  if (!session) redirect("/");
  const existingNote = await prisma.note.findUnique({
    where: { id, userId: session.user.id },
    include: { folder: true },
  });
  if (!existingNote) redirect("/notes");
  return existingNote;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const note = await fetchNoteData(id);

  return {
    title: `${note.name} | Notes | MacIdeas`,
    description: `You can edit, view, and manage the contents of your ${note.name} note on this page!`,
    authors: [{ name: "MacWeb", url: "https://macweb.app" }],
    openGraph: {
      title: `${note.name} | Notes | MacIdeas`,
      description: `You can edit, view, and manage the contents of your ${note.name} note on this page!`,
      url: `https://macideas.macweb.app/notes/${note.id}`,
      siteName: "MacIdeas",
      images: [
        {
          url: "/logo.png",
          width: 100,
          height: 100,
        },
      ],
      type: "website",
    },
  };
}

async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const existingNote = await fetchNoteData(id);

  return (
    <div
      className="flex flex-col items-center flex-1 relative h-[calc(100vh-68px)] bg-center! bg-cover!"
      style={{
        background: existingNote.backgroundImage
          ? `linear-gradient(rgba(0,0,0,0.8),rgba(0,0,0,0.8)),url('${existingNote.backgroundImage}')`
          : "",
      }}
    >
      <Editor existingNote={existingNote} />
    </div>
  );
}

export default Page;
