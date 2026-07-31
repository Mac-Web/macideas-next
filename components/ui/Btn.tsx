import Link from "next/link";

interface BtnProps {
  text: string;
  link?: string;
  onclick?: () => void;
  type?: "button" | "submit";
  styles?: string;
  primary?: boolean;
}

function Btn({ text, link, onclick, type, styles, primary }: BtnProps) {
  const btnStyles = `px-3 py-1.5 rounded cursor-pointer border-2 font-bold text-white
        ${primary ? "bg-teal-600 hover:bg-teal-700 border-teal-600 hover:border-teal-700" : "border-gray-700"} ${styles}`;

  return link ? (
    <Link href={link} className={btnStyles}>
      {text}
    </Link>
  ) : (
    <button type={type} onClick={onclick} className={btnStyles}>
      {text}
    </button>
  );
}

export default Btn;
