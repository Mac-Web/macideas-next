"use client";

import { useState, useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FaFaceSmile } from "react-icons/fa6";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";

interface EmojiProps {
  setSelected: (emoji: string | undefined) => void;
  placeholder?: string | React.ReactNode;
  ref?: React.RefObject<HTMLDivElement | null>;
  styles?: string;
}

function Emoji({ setSelected, placeholder, ref, styles }: EmojiProps) {
  const [picking, setPicking] = useState<boolean>(false);
  const menuRef = useRef<HTMLDivElement>(null);

  function handleSelect(e: React.MouseEvent) {
    e.preventDefault();
    setPicking(!picking);
  }

  function handlePick(emoji: string) {
    setSelected(emoji);
    setPicking(false);
  }

  useEffect(() => {
    const clickHandler = (e: MouseEvent) => {
      if (!ref && !menuRef.current?.contains(e.target as Node)) {
        setPicking(false);
      }
    };
    document.addEventListener("click", clickHandler);
    return () => {
      document.removeEventListener("click", clickHandler);
    };
  }, [ref]);

  return (
    <div className="relative text-gray-300 cursor-pointer" ref={menuRef}>
      <div
        title="Select emoji"
        onClick={handleSelect}
        ref={ref}
        className={styles}
      >
        {placeholder || <FaFaceSmile size={15} />}
      </div>
      <AnimatePresence>
        {picking && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="border-2 border-gray-700 rounded bg-gray-950 fixed left-25 top-45 z-10"
          >
            <Picker
              data={data}
              onEmojiSelect={(e: { native: string }) => handlePick(e.native)}
              maxFrequentRows={0}
              previewPosition="none"
              perLine={7}
            />
            {placeholder && (
              <div
                className="cursor-pointer text-center py-1 m-2 hover:bg-gray-900"
                onClick={() => handlePick("")}
              >
                Clear emoji
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default Emoji;
