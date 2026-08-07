import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await getSession();
  if (!session) redirect("/");
  const project = await prisma.project.findUnique({
    where: { id, userId: session.user.id },
  });
  if (!project) redirect("/projects");

  return (
    <div className="flex flex-col items-center flex-1 relative h-[calc(100vh-68px)]">
      <div className="text-white text-xl font-bold mt-10">
        Project page coming soon!
      </div>
      <div className="text-gray-300 mt-5">{project.name}</div>
    </div>
  );
}

export default Page;
