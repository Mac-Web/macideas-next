"use client";

import { FaHome } from "react-icons/fa";
import { usePathname } from "next/navigation";
import Link from "next/link";

function Home() {
  const pathname = usePathname();

  return (
    <Link
      href="/tasks"
      className={`font-bold flex gap-x-3 p-2 rounded items-center ${pathname === "/tasks" ? "bg-gray-900 text-teal-600" : "hover:bg-gray-900 text-white"}`}
    >
      <FaHome size={15} /> Home
    </Link>
  );
}

export default Home;
