"use client";

import type { MacIdeasSettings } from "@/generated/prisma/client";
import { FaGear } from "react-icons/fa6";
import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import DashboardModal from "@/components/modals/DashboardModal";

interface SettingsProps {
  settings?: MacIdeasSettings;
  isNote?: boolean;
}

function Settings({ settings, isNote }: SettingsProps) {
  const [menuOpen, setMenuOpen] = useState<boolean>(false);

  return (
    <>
      <div
        onClick={() => setMenuOpen(true)}
        className="absolute top-10 right-10 text-gray-300 cursor-pointer border-2 border-gray-700 rounded p-1.5
      hover:bg-gray-900"
        title="Dashboard settings"
      >
        <FaGear size={20} />
      </div>
      <AnimatePresence>
        {menuOpen && (
          <DashboardModal
            closeModal={() => setMenuOpen(false)}
            settings={settings}
            isNote={isNote}
          />
        )}
      </AnimatePresence>
    </>
  );
}

export default Settings;
