function Page() {
  return (
    <div className="flex flex-col items-center py-10 gap-y-5 flex-1 h-[calc(100vh-68px)] overflow-auto relative">
      <h2 className="text-white font-bold text-2xl">Projects Dashboard</h2>
      <p className="text-gray-300 text-center w-[60%]">
        Easily view, manage, and organize all your recent, starred, and other
        projects, as well as their tasks, task lists, notes, and folders on this
        dashboard!
      </p>
    </div>
  );
}

export default Page;
