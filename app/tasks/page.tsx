import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";

async function Page() {
  const session = await getSession();
  if (!session) redirect("/");

  return (
    <div className="flex flex-col items-center py-10 gap-y-5 flex-1">
      <h2 className="text-white font-bold text-2xl">Your Tasks</h2>
      <p className="text-gray-300 text-center w-[65%]">
        You&apos;ll be able to see your daily tasks, starred tasks, and other
        information about your tasks on this dashboard!
      </p>
    </div>
  );
}

export default Page;
