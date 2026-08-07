"use client";

import type { MacIdeasSettings } from "@/generated/prisma/client";
import { useState } from "react";
import { resetSettings, saveSettings } from "@/app/tasks/actions";
import { dashboardSettings, noteDashboardSettings } from "@/lib/constants";
import { AnimatePresence } from "framer-motion";
import WarningModal from "./WarningModal";
import Modal from "../ui/Modal";
import Checkbox from "../ui/Checkbox";
import Btn from "../ui/Btn";

interface DashboardModalProps {
  closeModal: () => void;
  settings?: MacIdeasSettings;
  isNote?: boolean;
}

function DashboardModal({ closeModal, settings, isNote }: DashboardModalProps) {
  const [loading, setLoading] = useState<boolean>(false);
  const [resetting, setResetting] = useState<boolean>(false);
  const [selectedSettings, setSelectedSettings] = useState<MacIdeasSettings>(
    settings || {
      id: "",
      selected: Array(dashboardSettings.length)
        .fill(0)
        .map((j, i) => j + i),
      selectedNotes: Array(noteDashboardSettings.length)
        .fill(0)
        .map((j, i) => j + i),
      showCompleted: false,
      showOverdue: false,
      userId: "",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  );

  async function handleSave() {
    setLoading(true);
    await saveSettings(selectedSettings);
    setLoading(false);
    closeModal();
  }

  async function handleReset() {
    setLoading(true);
    await resetSettings();
    setLoading(false);
    closeModal();
  }

  return (
    <Modal closeModal={closeModal}>
      <div className="flex flex-col gap-y-5 text-gray-300">
        <h2 className="text-white text-xl font-bold">Dashboard settings</h2>
        <div className="flex flex-col gap-y-3">
          {!isNote && (
            <>
              <Checkbox
                text="Show completed tasks"
                checked={selectedSettings.showCompleted}
                setChecked={(showCompleted) =>
                  setSelectedSettings({ ...selectedSettings, showCompleted })
                }
              />
              <Checkbox
                text="Show overdue tasks"
                checked={selectedSettings.showOverdue}
                setChecked={(showOverdue) =>
                  setSelectedSettings({ ...selectedSettings, showOverdue })
                }
              />
            </>
          )}
          <h2 className="text-white my-2 font-bold">Displayed widgets</h2>
          {(isNote ? noteDashboardSettings : dashboardSettings).map(
            (setting) => {
              return (
                <Checkbox
                  key={setting.id}
                  text={setting.name}
                  checked={(isNote
                    ? selectedSettings.selectedNotes
                    : selectedSettings.selected
                  ).includes(setting.id)}
                  setChecked={(c) =>
                    setSelectedSettings(
                      isNote
                        ? {
                            ...selectedSettings,
                            selectedNotes: c
                              ? [...selectedSettings.selectedNotes, setting.id]
                              : selectedSettings.selectedNotes.filter(
                                  (s) => s !== setting.id,
                                ),
                          }
                        : {
                            ...selectedSettings,
                            selected: c
                              ? [...selectedSettings.selected, setting.id]
                              : selectedSettings.selected.filter(
                                  (s) => s !== setting.id,
                                ),
                          },
                    )
                  }
                />
              );
            },
          )}
        </div>
        <div
          className="text-red-500 hover:underline w-fit cursor-pointer"
          onClick={() => setResetting(true)}
        >
          Reset settings
        </div>
        <div className="flex gap-x-3">
          <Btn
            text={loading ? "Loading..." : "Save"}
            onclick={handleSave}
            primary
          />
          <Btn text="Cancel" onclick={closeModal} />
        </div>
      </div>
      <AnimatePresence>
        {resetting && (
          <WarningModal
            title="Reset confirmation"
            description="Are you sure you want to reset your MacIdeas dashboard settings back to the original defaults? This applies to both the tasks and notes pages. This action cannot be undone."
            confirm={handleReset}
            closeModal={() => setResetting(false)}
            loading={loading}
          />
        )}
      </AnimatePresence>
    </Modal>
  );
}

export default DashboardModal;
