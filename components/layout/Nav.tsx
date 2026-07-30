import { getSession } from "@/lib/auth";
import NavSearch from "./NavSearch";
import NavUser from "./NavUser";
import Image from "next/image";
import Link from "next/link";

const navLinkStyles =
  "text-gray-800 dark:text-gray-300 transition-colors p-2.5 hover:text-teal-600";

async function Nav() {
  const session = await getSession();

  return (
    <nav
      className="flex items-center justify-between gap-x-3 border-b border-gray-700 px-5 md:px-20 lg:px-[calc(50%-550px)] h-17
       z-5 sticky top-0 bg-gray-200 dark:bg-gray-950"
    >
      <Link
        href="/"
        className="flex items-center gap-x-2 text-black dark:text-white text-lg duration-300 pr-6 py-2 font-bold
       hover:text-shadow-gray-400 hover:text-shadow-sm"
      >
        <Image src="/logo.png" alt="MacIdeas Logo" width={35} height={35} />{" "}
        MacIdeas
      </Link>
      <NavSearch />
      <div className="flex gap-x-3 items-center">
        <div className="hidden md:flex items-center gap-x-3">
          <Link href="/tasks" className={navLinkStyles}>
            Tasks
          </Link>
          <Link href="/notes" className={navLinkStyles}>
            Notes
          </Link>
          <Link href="/projects" className={navLinkStyles}>
            Projects
          </Link>
        </div>
        <NavUser user={session?.user} />
      </div>
    </nav>
  );
}

export default Nav;
