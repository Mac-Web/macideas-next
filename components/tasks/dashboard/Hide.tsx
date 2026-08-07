"use client";

import { FaEyeSlash } from "react-icons/fa";
import { hideSection } from "@/app/tasks/actions";

interface HideProps {
  id: number;
  isNote?: boolean;
}

function Hide({ id, isNote }: HideProps) {
  return (
    <FaEyeSlash
      size={20}
      title="Hide from dashboard"
      className="cursor-pointer text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity!"
      onClick={async () => await hideSection(id, isNote)}
    />
  );
}

export default Hide;
