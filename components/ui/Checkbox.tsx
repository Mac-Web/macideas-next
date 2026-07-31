"use client";

import { FaCheck } from "react-icons/fa";

interface CheckboxProps {
  text: string;
  checked: boolean;
  setChecked: (value: boolean) => void;
}

function Checkbox({ text, checked, setChecked }: CheckboxProps) {
  return (
    <label className="flex items-center gap-x-3 text-gray-300 cursor-pointer w-fit">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => setChecked(e.target.checked)}
        className="hidden"
      />
      <div
        className={`h-4 w-4 border-2 border-gray-700 rounded flex items-center justify-center ${checked && "bg-gray-700"}`}
      >
        <FaCheck
          size={14}
          className={`${checked ? "opacity-100" : "opacity-0"} transition-opacity! absolute`}
        />
      </div>
      {text}
    </label>
  );
}

export default Checkbox;
