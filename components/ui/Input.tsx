"use client";

import { FaXmark } from "react-icons/fa6";
import { useRef } from "react";

interface InputProps {
  placeholder: string;
  value: string;
  setValue: (value: string) => void;
  onblur?: () => void;
  styles?: string;
  clear?: boolean;
  full?: boolean;
}

function Input({
  placeholder,
  value,
  setValue,
  onblur,
  styles,
  clear,
  full,
}: InputProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  function handleClear() {
    setValue("");
    inputRef.current?.focus();
  }

  return (
    <div
      className={`flex items-center relative bg-gray-900 rounded ${full && "w-full"}`}
    >
      <input
        placeholder={placeholder}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onBlur={onblur}
        className={`px-3 py-1.5 outline-none text-white text-lg ${styles}
        ${clear && "w-[calc(100%-30px)]"}`}
        ref={inputRef}
      />
      {clear && value.length > 0 && (
        <div
          className="flex items-center justify-center hover:bg-gray-300 hover:dark:bg-gray-800 rounded cursor-pointer 
                  duration-300 w-7.5 h-7.5 absolute right-2 text-gray-300"
          title="Clear"
          onClick={handleClear}
        >
          <FaXmark size={20} title="Clear" />
        </div>
      )}
    </div>
  );
}

export default Input;
