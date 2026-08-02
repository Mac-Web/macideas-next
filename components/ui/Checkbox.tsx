"use client";

import { FaCheck } from "react-icons/fa";

interface CheckboxProps {
  text: string;
  checked: boolean;
  setChecked: (value: boolean) => void;
  icon?: string | React.ReactNode;
  styles?: string;
}

function Checkbox({ text, checked, setChecked, icon, styles }: CheckboxProps) {
  return (
    <label
      className={`flex items-center gap-x-3 text-gray-300 cursor-pointer w-fit ${styles}`}
    >
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => setChecked(e.target.checked)}
        className="hidden"
      />
      <div
        className={`h-4 w-4 border-2 relative border-gray-700 rounded flex items-center justify-center
          ${checked && "bg-gray-700"}`}
      >
        <FaCheck
          size={14}
          className={`${checked ? "opacity-100" : "opacity-0"} transition-opacity! absolute top-0 left-0`}
        />
      </div>
      <span className="text-xs">{icon}</span>
      {text}
    </label>
  );
}

export default Checkbox;
