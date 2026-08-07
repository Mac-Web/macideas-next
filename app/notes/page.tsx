import type { NoteType } from "@/components/notes/dashboard/Note";
import { prisma } from "@/lib/prisma";
import { noteDashboardSettings } from "@/lib/constants";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import Tags from "@/components/notes/dashboard/Tags";
import Options from "@/components/notes/dashboard/Options";
import Section from "@/components/notes/dashboard/Section";
import Settings from "@/components/tasks/dashboard/Settings";
import { FaFaceFrown } from "react-icons/fa6";

async function Page() {
  const session = await getSession();
  if (!session) redirect("/");
  const userSettings = await prisma.macIdeasSettings.findUnique({
    where: { userId: session.user.id },
  });
  const notes = await prisma.note.findMany({
    where: { userId: session.user.id },
    include: { tags: true },
    orderBy: { createdAt: "desc" },
  });
  const tags = await prisma.tag.findMany({
    where: { userId: session.user.id },
    include: { notes: { include: { tags: true } } },
  });
  const allNotes: Record<number, NoteType[]> = {
    0: notes.filter((note) => note.starred),
    2: notes.slice(0, 5),
  };
  const displayedSections = noteDashboardSettings.filter(
    (setting) =>
      !userSettings || userSettings.selectedNotes.includes(setting.id),
  );

  return (
    <div className="flex flex-col items-center py-10 gap-y-5 flex-1 h-[calc(100vh-68px)] overflow-auto relative">
      <h2 className="text-white font-bold text-2xl">Notes Dashboard</h2>
      <p className="text-gray-300 text-center w-[60%]">
        Easily view and manage all your starred and recent notes, organized
        tags, and other information about your notes on this dashboard!
      </p>
      <Options />
      <div className="flex flex-wrap w-full px-10 gap-5">
        {displayedSections.length > 0 ? (
          displayedSections.map((setting) => {
            return setting.id === 1 ? (
              <Tags key={setting.id} tags={tags} />
            ) : (
              <Section
                key={setting.id}
                title={setting.name}
                notes={allNotes[setting.id]}
                sectionId={setting.id}
              >
                {setting.icon}
              </Section>
            );
          })
        ) : (
          <div className="h-100 w-full flex flex-col gap-y-5 justify-center items-center text-gray-300">
            <FaFaceFrown size={50} />
            <div className="text-center w-[60%]">
              You don&apos;t have any pinned sections on the homepage. Click on
              the settings icon on the top right to customize your dashboard!
            </div>
          </div>
        )}
      </div>
      <Settings settings={userSettings || undefined} isNote />
    </div>
  );
}

export default Page;
