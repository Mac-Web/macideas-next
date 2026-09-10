"use client";

import { FaCaretDown } from "react-icons/fa";

const optionStyles = "flex-1 cursor-pointer flex gap-x-3 items-center";

interface BarProps {
  sort: string | null;
  setSort: React.Dispatch<React.SetStateAction<string | null>>;
}

function Bar({ sort, setSort }: BarProps) {
  return (
    <div className="flex gap-x-3 w-full text-sm text-black dark:text-gray-300 px-4 bg-gray-300 dark:bg-gray-900 rounded py-2">
      <div className={optionStyles + " flex-4"} onClick={() => setSort("n")}>
        Name {sort === "n" && <FaCaretDown size={15} />}
      </div>
      <div className={optionStyles} onClick={() => setSort("t")}>
        Type {sort === "t" && <FaCaretDown size={15} />}
      </div>
      <div className={optionStyles} onClick={() => setSort("m")}>
        Modified {sort === "m" && <FaCaretDown size={15} />}
      </div>
      <div className={optionStyles} onClick={() => setSort("c")}>
        Created {sort === "c" && <FaCaretDown size={15} />}
      </div>
    </div>
  );
}

export default Bar;
