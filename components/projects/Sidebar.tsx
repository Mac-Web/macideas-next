import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { FaBookOpen, FaRegStar } from "react-icons/fa";
import Home from "./Home";
import Create from "./Create";
import Project from "./Project";

async function Sidebar() {
  const session = await getSession();
  if (!session) redirect("/");
  const projects = await prisma.project.findMany({
    where: { userId: session.user.id },
    orderBy: { name: "asc" },
  });
  const starredProjects = projects.filter((project) => project.starred);

  return (
    <div className="w-70 border-r border-gray-700 h-[calc(100vh-68px)] py-5 relative">
      <div className="flex flex-col gap-y-3 flex-1 h-[calc(100%-45px)] px-3 overflow-auto">
        <Home />
        {starredProjects.length > 0 && (
          <>
            <h2 className="text-white font-bold flex gap-x-3 px-2 mb-2 items-center">
              <FaRegStar size={15} /> Starred projects
            </h2>
            {starredProjects.map((project) => {
              return <Project key={project.id} project={project} starred />;
            })}
          </>
        )}
        <h2 className="text-white font-bold flex gap-x-3 px-2 items-center mb-2">
          <FaBookOpen size={15} /> All projects
        </h2>
        {/* TODO: add drag and drop folders and starred folders? */}
        {projects.length > 0 ? (
          projects.map((project) => {
            return <Project key={project.id} project={project} />;
          })
        ) : (
          <div className="text-sm text-center text-gray-300 py-5">
            No projects found
          </div>
        )}
      </div>
      <Create />
    </div>
  );
}

export default Sidebar;
