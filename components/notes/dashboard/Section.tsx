import type { NoteType } from "./Note";
import Hide from "@/components/tasks/dashboard/Hide";
import Note from "./Note";

interface SectionProps {
  title: string;
  notes: NoteType[];
  children: React.ReactNode;
  sectionId: number;
}

function Section({ title, notes, children, sectionId }: SectionProps) {
  return (
    <div className="border-2 border-gray-700 rounded p-5 flex flex-col gap-y-5 flex-1 min-w-[40%]">
      <div className="flex text-gray-300 items-center justify-between group">
        <h2 className="text-white text-xl font-bold w-fit">
          {title} ({notes.length})
        </h2>
        <Hide id={sectionId} isNote />
      </div>
      <div className="w-full flex flex-wrap justify-center gap-3 max-h-70 overflow-auto">
        {notes.length > 0 ? (
          notes.map((note) => <Note key={note.id} note={note} />)
        ) : (
          <div className="flex flex-col gap-y-5 items-center text-gray-300 text-center py-10 justify-center h-full">
            {children}
            You don&apos;t have any {title.toLowerCase()} yet
          </div>
        )}
      </div>
    </div>
  );
}

export default Section;
