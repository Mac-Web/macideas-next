import { FaDiscord, FaEnvelope, FaGithub, FaYoutube } from "react-icons/fa";
import Image from "next/image";
import Link from "next/link";

const footerColumnStyles = "flex flex-col gap-y-2.5 flex-1";
const footerLinkStyles =
  "text-gray-800 dark:text-gray-100 hover:underline w-fit";
const footerColumnTitleStyles =
  "text-gray-800 dark:text-gray-100 mb-2.5 font-bold text-base";

function Footer() {
  return (
    <footer className="border-t border-gray-700 py-12 px-5 md:px-20 lg:px-[calc(50%-550px)]  flex flex-wrap md:flex-nowrap gap-y-15 justify-between items-start gap-x-15 mt-12 text-sm">
      <div className={footerColumnStyles}>
        <Link
          href="/"
          className="flex items-center gap-x-2 text-black dark:text-white text-lg duration-300 pr-5 py-2 font-bold
           hover:text-shadow-gray-400 hover:text-shadow-sm"
        >
          <Image src="/logo.png" alt="MacIdeas Logo" width={35} height={35} />{" "}
          MacIdeas
        </Link>
        <div className="text-gray-800 dark:text-gray-100">
          &copy; {new Date().getFullYear()}{" "}
          <a href="https://macweb.app" target="_blank" className="underline">
            MacWeb
          </a>
        </div>
        <div className="text-gray-800 dark:text-gray-100">
          All rights reserved
        </div>
        <div className="text-gray-800 dark:text-gray-100">
          Made with ❤️ by{" "}
          <a
            href="https://github.com/tonymac129/"
            target="_blank"
            className="underline"
          >
            Tony Macaroni
          </a>
        </div>
        <div className="text-gray-800 dark:text-gray-100">
          <a
            href="https://buymeacoffee.com/tonymac129"
            target="_blank"
            className="underline"
          >
            Buy me a coffee ☕
          </a>
        </div>
      </div>
      <div className={footerColumnStyles}>
        <h2 className={footerColumnTitleStyles}>Browse Tabs</h2>
        <Link href="/" className={footerLinkStyles}>
          Home
        </Link>
        <Link href="/tasks" className={footerLinkStyles}>
          Tasks
        </Link>
        <Link href="/notes" className={footerLinkStyles}>
          Notes
        </Link>
        <Link href="/projects" className={footerLinkStyles}>
          Projects
        </Link>
      </div>
      <div className={footerColumnStyles}>
        <h2 className={footerColumnTitleStyles}>MacIdeas Information</h2>
        <a
          href="https://macweb.app/apps/macideas"
          className={footerLinkStyles}
          target="_blank"
        >
          About
        </a>
        <a
          href="https://macweb.app/apps/macideas/updates"
          className={footerLinkStyles}
          target="_blank"
        >
          Updates
        </a>
        <a
          href="https://forms.gle/iacBWZAYAizBsfyt9"
          className={footerLinkStyles}
          target="_blank"
        >
          Feedback
        </a>
      </div>
      <div className={footerColumnStyles}>
        <h2 className={footerColumnTitleStyles}>MacWeb Apps</h2>
        <a
          href="https://macweb.app"
          className={footerLinkStyles}
          target="_blank"
        >
          MacWeb
        </a>
        <a
          href="https://macvg.macweb.app"
          className={footerLinkStyles}
          target="_blank"
        >
          MacVG
        </a>
        <a
          href="https://maclearn.macweb.app"
          className={footerLinkStyles}
          target="_blank"
        >
          MacLearn
        </a>
        <a
          href="https://macforms.macweb.app"
          className={footerLinkStyles}
          target="_blank"
        >
          MacForms
        </a>
      </div>
      <div className={footerColumnStyles}>
        <h2 className={footerColumnTitleStyles}>Social</h2>
        <div className="flex flex-wrap gap-5 items-center text-gray-300">
          <a href="mailto:hello@macweb.app" target="_blank" title="Email us">
            <FaEnvelope size={25} />
          </a>
          <a
            href="https://www.youtube.com/@MacWebApp"
            target="_blank"
            title="YouTube"
          >
            <FaYoutube size={25} />
          </a>
          <a
            href="https://github.com/Mac-Web/macideas"
            target="_blank"
            title="Source code"
          >
            <FaGithub size={25} />
          </a>
          <a
            href="https://discord.gg/UT7g2S2cBP"
            target="_blank"
            title="Join our server!"
          >
            <FaDiscord size={25} />
          </a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
