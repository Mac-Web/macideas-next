"use client";

import { FaEyeSlash } from "react-icons/fa";
import { hideSection } from "@/app/tasks/actions";

function Hide({ id }: { id: number }) {
  return (
    <FaEyeSlash
      size={20}
      title="Hide from dashboard"
      className="cursor-pointer text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity!"
      onClick={async () => await hideSection(id)}
    />
  );
}

export default Hide;
