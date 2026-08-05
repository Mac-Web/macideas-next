"use client";

import { FaSun } from "react-icons/fa";
import { usePathname } from "next/navigation";
import Link from "next/link";

function Day() {
  const pathname = usePathname();

  return (
    <Link
      href="/tasks/day"
      className={`font-bold flex gap-x-3 mb-2 p-2 rounded items-center
        ${pathname === "/tasks/day" ? "bg-gray-900 text-teal-600" : "hover:bg-gray-900 text-white"}`}
    >
      <FaSun size={15} /> My Day
    </Link>
  );
}

export default Day;
