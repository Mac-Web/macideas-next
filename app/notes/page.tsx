import Options from "@/components/notes/dashboard/Options";

function Page() {
  return (
    <div className="flex flex-col items-center py-10 gap-y-5 flex-1 h-[calc(100vh-68px)] overflow-auto relative">
      <h2 className="text-white font-bold text-2xl">Notes Dashboard</h2>
      <p className="text-gray-300 text-center w-[60%]">
        Easily view and manage all your daily, starred, upcoming, and recent
        tasks, organized tags, and other information about your notes on this
        dashboard!
      </p>
      <Options />
    </div>
  );
}

export default Page;
