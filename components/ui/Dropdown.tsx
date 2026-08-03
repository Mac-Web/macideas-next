"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState, useEffect, useRef } from "react";

interface DropdownProps {
  selected: string;
  setSelected: (value: string) => void;
  values: string[];
  open?: boolean;
  setOpen?: () => void;
  children?: React.ReactNode;
  styles?: string;
  text?: string;
  hover?: boolean;
  above?: boolean;
}

function Dropdown({
  selected,
  setSelected,
  values,
  open = true,
  setOpen,
  children,
  styles,
  text,
  hover = true,
  above,
}: DropdownProps) {
  const [menuOpen, setMenuOpen] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const clickHandler = (e: MouseEvent) => {
      if (!dropdownRef.current?.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("click", clickHandler);
    return () => {
      document.removeEventListener("click", clickHandler);
    };
  }, []);

  function handleSelect(value: string) {
    setSelected(value);
    setMenuOpen(false);
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <div
        className={`border-2 border-gray-700 text-sm ${hover ? "hover:bg-gray-900" : ""} rounded px-2 py-1 cursor-pointer text-gray-300
      text-center whitespace-nowrap ${styles}`}
        onClick={() => {
          setMenuOpen(true);
          if (setOpen) setOpen();
        }}
      >
        {selected}
      </div>
      <AnimatePresence>
        {menuOpen && open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={`absolute bg-gray-950 border-2 border-gray-700 rounded flex flex-col gap-y-1 p-2
              ${above ? "bottom-[calc(100%+10px)]" : "top-[calc(100%+10px)]"}
        z-5 text-gray-300 w-40 left-[50%] translate-x-[-50%] max-h-100 overflow-y-auto`}
          >
            {text && <div className="text-center">{text}</div>}
            {values.map((value, i) => {
              return (
                <div
                  key={i}
                  className={`cursor-pointer hover:bg-gray-900 px-2 py-1 rounded
                    ${selected === value && "font-bold text-teal-600"}`}
                  onClick={() => handleSelect(value)}
                >
                  {value}
                </div>
              );
            })}
            {children && (
              <>
                <hr className="my-2 border-0 min-h-0.5 bg-gray-700 rounded" />
                {children}
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default Dropdown;
