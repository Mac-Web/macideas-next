import { getSession } from "@/lib/auth";
import { FaBook, FaStickyNote, FaTasks } from "react-icons/fa";
import Hero from "@/components/layout/Hero";
import Footer from "@/components/layout/Footer";
import Btn from "@/components/ui/Btn";

export default async function Home() {
  const session = await getSession();

  return (
    <>
      <div className="px-5 md:px-20 lg:px-[calc(50%-550px)] flex flex-col items-center">
        <Hero
          title="Welcome to MacIdeas!"
          description="A simple productivity app for managing and keeping track of your work!"
        >
          <div className="mb-10 flex gap-x-5">
            <Btn
              text={session ? "Tasks" : "Sign in"}
              link={
                session
                  ? "/tasks"
                  : process.env.NEXT_PUBLIC_ROOT_DOMAIN + "?redirect=macideas"
              }
              primary
            />
            {session && <Btn text="Notes" link="/notes" primary />}
            {session && <Btn text="Projects" link="/projects" primary />}
            <Btn
              text="Learn more"
              link="https://github.com/Mac-Web/macideas-next"
            />
            {/* TODO: replace learn more with macweb.app/apps/macideas info */}
          </div>
        </Hero>
        <div className="flex flex-col gap-y-20 pb-10">
          <div className="flex flex-col gap-y-10 md:flex-row gap-x-20 items-center">
            <FaTasks size={300} className="h-20" />
            <div className="flex flex-col gap-y-5">
              <h2 className="text-black dark:text-white font-bold text-2xl">
                Powerful & customizable task management
              </h2>
              <p className="text-black dark:text-gray-300">
                Create, organize, browse, and view tasks easily by editing their
                information, assigning custom tags, marking them as completed,
                and starring them. Search, filter, and sort tasks with a ton of
                different options to easily browse and manage your tasks. View
                additional details and advanced edit options for tasks with the
                task details panel. View your daily, starred, due/start soon,
                recent tasks, and more on the tasks dashboard.
              </p>
            </div>
          </div>
          <div className="flex flex-col gap-y-10 md:flex-row gap-x-20 items-center">
            <div className="flex flex-col gap-y-5">
              <h2 className="text-black dark:text-white font-bold text-2xl">
                Feature-rich note taking editor
              </h2>
              <p className="text-black dark:text-gray-300">
                Easily create and edit sophisticated notes through the
                full-featured powerful rich text editor powered by Tiptap.
                Editing features include typography, formatting, color, size,
                lists, links, embeds, code blocks, quotes, and more. Organize
                and visualize all your ideas and text with the easy to use
                WYSIWYG editor with extensive keyboard shortcut support and
                autosave.
              </p>
            </div>
            <FaStickyNote size={200} className="h-20" />
          </div>
          <div className="flex flex-col gap-y-10 md:flex-row gap-x-20 items-center">
            <FaBook size={300} className="h-20" />
            <div className="flex flex-col gap-y-5">
              <h2 className="text-black dark:text-white font-bold text-2xl">
                Integrated project organization
              </h2>
              <p className="text-black dark:text-gray-300">
                Organize all your tasks, notes, and folders effectively by
                grouping them into projects. Customize each project&apos;s
                content, information, and appearance to easily organize all your
                information. Easily browse through all the project&apos;s
                content with the search bar and the intuitive file browser
              </p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
