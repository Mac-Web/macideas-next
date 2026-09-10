"use client";

interface TextareaProps {
  placeholder: string;
  value: string;
  setValue: (value: string) => void;
  styles?: string;
  onblur?: () => void;
}

function Textarea({
  placeholder,
  value,
  setValue,
  styles,
  onblur,
}: TextareaProps) {
  return (
    <textarea
      placeholder={placeholder}
      value={value}
      onChange={(e) => setValue(e.target.value)}
      className={`bg-gray-300 dark:bg-gray-900 rounded px-3 py-1.5 outline-none text-black dark:text-white resize-x-none text-sm ${styles}`}
      onBlur={onblur}
    ></textarea>
  );
}

export default Textarea;
