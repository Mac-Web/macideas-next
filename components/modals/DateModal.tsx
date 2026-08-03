"use client";

import { useState } from "react";
import { FaXmark } from "react-icons/fa6";
import { updateDates } from "@/app/tasks/[id]/actions";
import Flatpickr from "react-flatpickr";
import Modal from "../ui/Modal";
import Btn from "../ui/Btn";

interface DateModalProps {
  taskId?: string;
  setDates?: (s: Date | undefined, due: Date | undefined) => void;
  closeModal: () => void;
  startDate?: Date;
  dueDate?: Date;
}

function DateModal({
  taskId,
  setDates,
  closeModal,
  startDate,
  dueDate,
}: DateModalProps) {
  const [start, setStart] = useState<Date | undefined>(startDate);
  const [due, setDue] = useState<Date | undefined>(dueDate);
  const [loading, setLoading] = useState<boolean>(false);

  async function handleSelect() {
    if (taskId) {
      setLoading(true);
      await updateDates(taskId, start, due);
      setLoading(false);
      closeModal();
    }
    if (setDates) {
      setDates(start, due);
      closeModal();
    }
  }

  return (
    <Modal closeModal={closeModal}>
      <div className="flex flex-col gap-y-5 text-gray-300">
        <h2 className="text-white text-xl font-bold">Start & due dates</h2>
        <div className="flex flex-col gap-y-1">
          Start time
          <div className="flex gap-x-3 items-center">
            <Flatpickr
              value={start || ""}
              onChange={([date]) => {
                if (date) {
                  setStart(date);
                }
              }}
              options={{
                enableTime: true,
                dateFormat: "m/d/Y H:i",
                static: true,
              }}
              className="bg-gray-900 rounded cursor-pointer px-3 py-1.5 outline-none"
            />
            {start && (
              <FaXmark
                size={17}
                onMouseDown={() => setStart(undefined)}
                title="Clear date"
                className="cursor-pointer"
              />
            )}
          </div>
        </div>
        <div className="flex flex-col gap-y-1">
          Due time
          <div className="flex gap-x-3 items-center">
            <Flatpickr
              value={due || ""}
              onChange={([date]) => {
                if (date) {
                  setDue(date);
                }
              }}
              options={{
                enableTime: true,
                dateFormat: "m/d/Y H:i",
                static: true,
              }}
              className="bg-gray-900 rounded cursor-pointer px-3 py-1.5 outline-none"
            />
            {due && (
              <FaXmark
                size={17}
                onMouseDown={() => setDue(undefined)}
                title="Clear date"
                className="cursor-pointer"
              />
            )}
          </div>
        </div>
        <div className="flex gap-x-3">
          <Btn
            text={loading ? "Saving..." : "Save"}
            onclick={handleSelect}
            primary
          />
          <Btn text="Cancel" onclick={closeModal} />
        </div>
      </div>
    </Modal>
  );
}

export default DateModal;
