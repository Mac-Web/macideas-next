"use client";

import type { PutBlobResult } from "@vercel/blob";
import { useState, useRef } from "react";
import { FaUpload } from "react-icons/fa";
import { uploadBackground } from "@/app/tasks/[id]/actions";
import Modal from "../ui/Modal";
import Btn from "../ui/Btn";
import Image from "next/image";

interface UploadModalProps {
  id: string;
  closeModal: () => void;
}

function UploadModal({ id, closeModal }: UploadModalProps) {
  const [loading, setLoading] = useState<boolean>(false);
  const [blob, setBlob] = useState<PutBlobResult | null>(null);
  const [uploading, setUploading] = useState<boolean>(false);
  const inputFileRef = useRef<HTMLInputElement>(null);

  async function handleSave() {
    if (blob) {
      setLoading(true);
      await uploadBackground(id, blob.url);
      setLoading(false);
      closeModal();
    }
  }

  async function handleSubmit(e: React.ChangeEvent) {
    e.preventDefault();
    setUploading(true);
    if (!inputFileRef.current?.files) {
      throw new Error("No file selected");
    }
    const file = inputFileRef.current.files[0];
    const response = await fetch(`/api/upload?filename=${file.name}`, {
      method: "POST",
      body: file,
    });
    const newBlob = (await response.json()) as PutBlobResult;
    setBlob(newBlob);
    setUploading(false);
  }

  return (
    <Modal closeModal={closeModal}>
      <div className="flex flex-col gap-y-5">
        <h2 className="text-white text-xl font-bold">Upload background</h2>
        <label className="break-all rounded flex items-center gap-y-3 text-gray-300 flex-col cursor-pointer text-center text-sm">
          <input
            name="file"
            ref={inputFileRef}
            type="file"
            accept="image/jpeg, image/png, image/webp"
            onChange={(e) => handleSubmit(e)}
            required
            className="hidden"
          />
          {uploading ? (
            "Uploading..."
          ) : blob ? (
            <>
              <Image
                src={blob.url}
                alt="Uploaded image"
                width={400}
                height={200}
                className="rounded"
              />
              {blob.pathname}
            </>
          ) : (
            <div className="rounded border-2 border-gray-700 hover:bg-gray-900 w-full flex gap-y-3 py-5 items-center flex-col">
              <FaUpload size={35} />
              Upload
            </div>
          )}
        </label>
        <div className="flex gap-x-3">
          <Btn
            text={loading ? "Saving..." : "Save"}
            onclick={handleSave}
            primary
          />
          <Btn text="Cancel" onclick={closeModal} />
        </div>
      </div>
    </Modal>
  );
}

export default UploadModal;
