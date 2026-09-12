"use client";

import type { Level } from "@tiptap/extension-heading";
import type { Folder, Note } from "@/generated/prisma/client";
import { useEditor, EditorContent } from "@tiptap/react";
import { useState, useEffect, useRef } from "react";
import { Subscript } from "@tiptap/extension-subscript";
import { Superscript } from "@tiptap/extension-superscript";
import { TextStyle, FontFamily, FontSize } from "@tiptap/extension-text-style";
import { Placeholder } from "@tiptap/extensions";
import {
  FaAt,
  FaBold,
  FaCode,
  FaHighlighter,
  FaItalic,
  FaLink,
  FaList,
  FaMinus,
  FaPlus,
  FaQuoteLeft,
  FaStrikethrough,
  FaSubscript,
  FaSuperscript,
  FaUnderline,
} from "react-icons/fa";
import { MdFormatListNumbered, MdRedo, MdUndo } from "react-icons/md";
import { FaTextSlash } from "react-icons/fa6";
import { motion, AnimatePresence } from "framer-motion";
import { TaskList, TaskItem } from "@tiptap/extension-list";
import StarterKit from "@tiptap/starter-kit";
import Highlight from "@tiptap/extension-highlight";
import Bar from "./Bar";
import Dropdown from "../ui/Dropdown";
import Input from "../ui/Input";
import { BsCheck2 } from "react-icons/bs";

const optionStyles =
  "cursor-pointer rounded hover:bg-gray-300 dark:hover:bg-gray-900 p-1.5 text-gray-700 dark:text-gray-300";
const CustomSuperscript = Superscript.extend({
  addKeyboardShortcuts() {
    return {
      "Mod-p": () => this.editor.commands.toggleSuperscript(),
    };
  },
});
const levels = [
  "Heading 1",
  "Heading 2",
  "Heading 3",
  "Heading 4",
  "Paragraph",
];
const fonts = ["Inter", "Comic Sans", "Serif", "Monospace", "Cursive", "Exo 2"];

type NoteType = Note & {
  folder: Folder | null;
};

function Editor({ existingNote }: { existingNote: NoteType }) {
  const [saved, setSaved] = useState<boolean>(false);
  const [link, setLink] = useState<string | null>(null);
  const [level, setLevel] = useState<string>(levels[4]);
  const [font, setFont] = useState<string>(fonts[0]);
  const [current, setCurrent] = useState<number>(15);
  const editor = useEditor({
    extensions: [
      StarterKit,
      Subscript,
      CustomSuperscript,
      TextStyle,
      FontFamily,
      FontSize,
      Highlight,
      TaskList,
      TaskItem.configure({
        nested: true,
      }),
      Placeholder.configure({
        placeholder: "My cool note...",
      }), //TODO: add text color option
    ],
    immediatelyRender: false,
    injectCSS: false,
  });
  const linkRef = useRef<HTMLDivElement>(null);

  function handleLink(e: React.SubmitEvent) {
    e.preventDefault();
    if (link && editor)
      editor
        ?.chain()
        .focus()
        .setLink({
          href:
            "https://" + link.replace("https://", "").replace("http://", ""),
        })
        .run();
    setLink(null);
  }

  useEffect(() => {
    const autoSave = setInterval(async () => {
      if (editor) {
        setSaved(true);
        setTimeout(() => {
          setSaved(false);
        }, 2000);
      }
    }, 30000); //TODO: add a setting for auto save duration

    const clickHandler = (e: MouseEvent) => {
      if (!linkRef.current?.contains(e.target as Node)) {
        setLink(null);
      }
    };
    document.addEventListener("click", clickHandler);

    return () => {
      clearInterval(autoSave);
      document.removeEventListener("click", clickHandler);
    };
  }, [editor]);

  useEffect(() => {
    if (editor) {
      const index = levels.indexOf(level) + 1;
      if (index == 5) {
        editor.chain().focus().clearNodes().run();
      } else {
        editor
          .chain()
          .focus()
          .setHeading({ level: (levels.indexOf(level) + 1) as Level })
          .run();
      }
    }
  }, [level, editor]);

  useEffect(() => {
    if (editor) {
      editor.chain().focus().setFontFamily(font).run();
    }
  }, [font, editor]);

  useEffect(() => {
    if (editor) {
      editor.commands.setFontSize(current + "px");
    }
  }, [current, editor]);

  return (
    <>
      <Bar note={existingNote} folder={existingNote.folder} saved={saved} />
      {editor && (
        <>
          <div className="flex gap-x-2 py-2 w-full px-8 border-b border-gray-700 text-gray-400 dark:text-gray-700 font-bold items-center">
            <MdUndo
              size={27}
              onClick={() => editor.commands.undo()}
              className={optionStyles}
              title="Undo (Ctrl+Z)"
            />
            <MdRedo
              size={27}
              onClick={() => editor.commands.redo()}
              className={optionStyles}
              title="Redo (Ctrl+Y)"
            />
            <FaTextSlash
              size={27}
              onClick={() =>
                editor.chain().focus().clearNodes().unsetAllMarks().run()
              }
              className={optionStyles}
              title="Remove formatting"
            />
            |
            <Dropdown
              selected={level}
              setSelected={(l) => setLevel(l)}
              values={levels}
              text="Text type"
            />
            <Dropdown
              selected={font}
              setSelected={(f) => setFont(f)}
              values={fonts}
              text="Font family"
            />
            <FaMinus
              size={27}
              onClick={() => setCurrent(Math.max(2, current - 2))}
              className={optionStyles}
              title="Decrease font size"
            />
            <Input
              placeholder="0"
              value={current.toString()}
              setValue={(c) =>
                setCurrent(Math.max(2, Math.min(100, Number(c))))
              }
              styles="w-10 text-xs font-normal text-center px-1!"
            />
            <FaPlus
              size={27}
              onClick={() => setCurrent(Math.min(100, current + 2))}
              className={optionStyles}
              title="Increase font size"
            />
            |
            <FaBold
              size={27}
              onClick={() => editor.chain().focus().toggleBold().run()}
              className={optionStyles}
              title="Bold text (Ctrl+B)"
            />
            <FaItalic
              size={27}
              onClick={() => editor.chain().focus().toggleItalic().run()}
              className={optionStyles}
              title="Italicize text (Ctrl+I)"
            />
            <FaUnderline
              size={27}
              onClick={() => editor.chain().focus().toggleUnderline().run()}
              className={optionStyles}
              title="Underline text (Ctrl+U)"
            />
            <FaStrikethrough
              size={27}
              onClick={() => editor.chain().focus().toggleStrike().run()}
              className={optionStyles}
              title="Strike through text (Ctrl+Shift+S)"
            />
            <FaHighlighter
              size={27}
              onClick={() => editor.commands.toggleHighlight()}
              className={optionStyles}
              title="Highlight text (Ctrl+Shift+H)"
            />
            |
            <FaList
              size={27}
              onClick={() => editor.chain().focus().toggleBulletList().run()}
              className={optionStyles}
              title="Bullet list (Ctrl+Shift+8)"
            />
            <MdFormatListNumbered
              size={27}
              onClick={() => editor.chain().focus().toggleOrderedList().run()}
              className={optionStyles}
              title="Numbered list (Ctrl+Shift+7)"
            />
            <BsCheck2
              size={27}
              onClick={() => editor.chain().focus().toggleTaskList().run()}
              className={optionStyles}
              title="Task list`"
            />
            |
            <div className="relative" ref={linkRef}>
              <FaLink
                size={27}
                onClick={() => setLink("")}
                className={optionStyles}
                title="Insert link"
              />
              <AnimatePresence>
                {link !== null && (
                  <motion.form
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute top-[calc(100%+15px)] border-2 border-gray-700 rounded"
                    onSubmit={handleLink}
                  >
                    <Input
                      placeholder="google.com"
                      value={link}
                      setValue={(l) => setLink(l)}
                      styles="text-sm font-normal"
                    />
                  </motion.form>
                )}
              </AnimatePresence>
            </div>
            <FaAt
              size={27}
              onClick={() => editor.chain().focus().toggleCode().run()}
              className={optionStyles}
              title="Inline (Ctrl+E)"
            />
            <FaCode
              size={27}
              onClick={() => editor.chain().focus().toggleCodeBlock().run()}
              className={optionStyles}
              title="Code block (Ctrl+Alt+C)"
            />
            <FaQuoteLeft
              size={27}
              onClick={() => editor.chain().focus().toggleBlockquote().run()}
              className={optionStyles}
              title="Blockquote (Ctrl+Shift+B)"
            />
            <FaSubscript
              size={27}
              onClick={() => editor.chain().focus().toggleSubscript().run()}
              className={optionStyles}
              title="Subscript (Ctrl+,)"
            />
            <FaSuperscript
              size={27}
              onClick={() => editor.chain().focus().toggleSuperscript().run()}
              className={optionStyles}
              title="Superscript (Ctrl+P)"
            />
          </div>
          <EditorContent editor={editor} className="w-full h-full" />
        </>
      )}
    </>
  );
}

export default Editor;
