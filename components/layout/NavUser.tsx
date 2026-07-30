"use client";

import type { User } from "better-auth";
import { motion } from "framer-motion";
import { useState, useRef, useEffect } from "react";
import { useTheme } from "next-themes";
import { authClient } from "@/lib/auth-client";
import { FaUser } from "react-icons/fa";
import { MdLightMode, MdDarkMode, MdLogout } from "react-icons/md";
import Btn from "../ui/Btn";
import Image from "next/image";

const menuOptionStyles =
  "flex gap-x-3 items-center text-gray-800 dark:text-gray-100 py-2 px-3 hover:bg-gray-200 dark:hover:bg-gray-800 cursor-pointer duration-300 rounded group";
const iconStyles =
  "group-hover:scale-120 group-hover:-translate-y-1 duration-300 transition-transform!";

function NavUser({ user }: { user: User | undefined }) {
  const [menuOpen, setMenuOpen] = useState<boolean>(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const { theme, setTheme } = useTheme();

  async function handleSignout() {
    await authClient.signOut({
      fetchOptions: {
        mode: "cors",
        onRequest: () => {
          setTimeout(() => {
            window.location.reload();
          }, 1000);
        },
      },
    });
  }
  useEffect(() => {
    const clickHandler = (e: MouseEvent) => {
      if (!menuRef.current?.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("click", clickHandler);
    return () => {
      document.removeEventListener("click", clickHandler);
    };
  }, []);

  return user ? (
    <div className="relative" ref={menuRef}>
      <motion.div
        whileHover={{ scale: 1.15 }}
        className="rounded-full cursor-pointer w-10 h-10 border-2 border-gray-700 overflow-hidden"
        onClick={() => setMenuOpen(true)}
      >
        {user?.image ? (
          <Image
            src={user.image}
            alt="Avatar"
            title="Avatar"
            width={40}
            height={40}
          />
        ) : (
          <Image
            src="/icons/profile/user.svg"
            alt="Avatar"
            title="Avatar"
            width={40}
            height={40}
          />
        )}
      </motion.div>
      {menuOpen && (
        <div className="absolute right-0 top-[120%] flex flex-col rounded-lg p-2 bg-gray-100 dark:bg-gray-900 w-35">
          <div
            className={`${menuOptionStyles} font-bold hover:bg-gray-100!  dark:hover:bg-gray-900! cursor-default!`}
          >
            {user?.name}
          </div>
          <a
            href={`${process.env.NEXT_PUBLIC_ROOT_DOMAIN}/profile`}
            className={menuOptionStyles}
            onClick={() => setMenuOpen(false)}
          >
            <FaUser size={20} className={iconStyles} />
            Profile
          </a>
          <div
            className={menuOptionStyles}
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
          >
            {theme === "light" ? (
              <MdLightMode size={20} className={iconStyles} />
            ) : (
              <MdDarkMode size={20} className={iconStyles} />
            )}
            Theme
          </div>
          <div className={menuOptionStyles} onClick={handleSignout}>
            <MdLogout className={iconStyles} size={20} />
            Log out
          </div>
        </div>
      )}
    </div>
  ) : (
    <Btn
      text="Sign in"
      link={`${process.env.NEXT_PUBLIC_ROOT_DOMAIN}/?redirect=macideas`}
      primary
    />
  );
}

export default NavUser;
