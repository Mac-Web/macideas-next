"use client";

import Modal from "../ui/Modal";
import Btn from "../ui/Btn";

interface WarningModalProps {
  title: string;
  description: string;
  confirm: () => void;
  closeModal: () => void;
  loading?: boolean;
}

function WarningModal({
  title,
  description,
  confirm,
  closeModal,
  loading,
}: WarningModalProps) {
  return (
    <Modal closeModal={closeModal}>
      <div className="flex flex-col gap-y-5">
        <h2 className="text-white text-xl font-bold">{title}</h2>
        <p className="text-gray-300">{description}</p>
        <div className="flex gap-x-3">
          <Btn
            text={loading ? "Loading..." : "Confirm"}
            onclick={confirm}
            styles="bg-red-600! hover:bg-red-700! border-red-600! hover:border-red-700!"
            primary
          />
          <Btn text="Cancel" onclick={closeModal} />
        </div>
      </div>
    </Modal>
  );
}

export default WarningModal;
