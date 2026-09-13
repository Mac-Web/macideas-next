"use client";

import type { Level } from "@tiptap/extension-heading";
import type { Folder, Note } from "@/generated/prisma/client";
import { useEditor, EditorContent } from "@tiptap/react";
import { useState, useEffect, useRef } from "react";
import { saveContent } from "@/app/notes/[id]/actions";
import { Subscript } from "@tiptap/extension-subscript";
import { Superscript } from "@tiptap/extension-superscript";
import {
  TextStyle,
  FontFamily,
  FontSize,
  Color,
} from "@tiptap/extension-text-style";
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
  FaSave,
  FaStrikethrough,
  FaSubscript,
  FaSuperscript,
  FaUnderline,
} from "react-icons/fa";
import { MdFormatListNumbered, MdRedo, MdUndo } from "react-icons/md";
import { FaA, FaTextSlash, FaXmark } from "react-icons/fa6";
import { motion, AnimatePresence } from "framer-motion";
import WarningModal from "../modals/WarningModal";
import StarterKit from "@tiptap/starter-kit";
import Highlight from "@tiptap/extension-highlight";
import TextAlign from "@tiptap/extension-text-align";
import Bar from "./Bar";
import Dropdown from "../ui/Dropdown";
import Input from "../ui/Input";

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
const alignments = ["Left", "Center", "Right", "Justify"];

type NoteType = Note & {
  folder: Folder | null;
};

interface EditorProps {
  existingNote: NoteType;
  background?: boolean;
}

function Editor({ existingNote, background }: EditorProps) {
  const [saved, setSaved] = useState<boolean>(false);
  const [link, setLink] = useState<string | null>(null);
  const [level, setLevel] = useState<string>(levels[4]);
  const [font, setFont] = useState<string>(fonts[0]);
  const [current, setCurrent] = useState<number>(15);
  const [color, setColor] = useState<string>("#CCCCCC");
  const [alignment, setAlignment] = useState<string>(alignments[0]);
  const [clearing, setClearing] = useState<boolean>(false);
  const editor = useEditor({
    extensions: [
      StarterKit,
      Subscript,
      CustomSuperscript,
      TextStyle,
      FontFamily,
      FontSize,
      Color,
      Highlight,
      Placeholder.configure({
        placeholder: "My cool note...",
      }),
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
    ],
    immediatelyRender: false,
    injectCSS: false,
    content: JSON.parse(existingNote.content || "{}"),
  });
  const linkRef = useRef<HTMLDivElement>(null);
  const optionStyles = `cursor-pointer rounded hover:bg-gray-300 dark:hover:bg-gray-900 p-1.5 text-gray-700 dark:text-gray-300 ${background && " text-gray-300! hover:bg-gray-900!"}`;

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

  function handleClear() {
    if (editor) {
      editor.commands.clearContent();
      setClearing(false);
    }
  }

  async function handleSave() {
    if (editor) {
      await saveContent(existingNote.id, JSON.stringify(editor.getJSON()));
      setSaved(true);
      setTimeout(() => {
        setSaved(false);
      }, 2000);
    }
  }

  useEffect(() => {
    const autoSave = setInterval(async () => {
      await handleSave();
    }, 30000); //TODO: add a setting for auto save duration

    const clickHandler = (e: MouseEvent) => {
      if (!linkRef.current?.contains(e.target as Node)) {
        setLink(null);
      }
    };
    const keyHandler = async (e: KeyboardEvent) => {
      if (e.key === "s" && e.ctrlKey) {
        e.preventDefault();
        await handleSave();
      }
    };

    document.addEventListener("click", clickHandler);
    document.addEventListener("keydown", keyHandler);

    return () => {
      clearInterval(autoSave);
      document.removeEventListener("click", clickHandler);
      document.removeEventListener("keydown", keyHandler);
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

  useEffect(() => {
    if (editor) {
      editor.chain().focus().setColor(color).run();
    }
  }, [color, editor]);

  useEffect(() => {
    if (editor) {
      editor.chain().focus().setTextAlign(alignment.toLowerCase()).run();
    }
  }, [alignment, editor]);

  return (
    <>
      <Bar
        note={existingNote}
        folder={existingNote.folder}
        saved={saved}
        background={background}
      />
      {editor && (
        <>
          <div className="flex gap-2 w-full p-2 border-b border-gray-700 text-gray-400 dark:text-gray-700 font-bold items-center flex-wrap">
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
            <Dropdown
              selected={alignment}
              setSelected={(a) => setAlignment(a)}
              values={alignments}
              text="Alignment"
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
            <label>
              <FaA
                size={27}
                className={optionStyles}
                title="Set text color"
                style={{ color: color }}
              />
              <input
                type="color"
                className="hidden"
                value={color}
                onChange={(e) => setColor(e.target.value)}
              />
            </label>
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
            |
            <FaSave
              size={27}
              onClick={handleSave}
              className={optionStyles}
              title="Save note (Ctrl+S)"
            />
            <FaXmark
              size={27}
              onClick={() => setClearing(true)}
              className={optionStyles + " text-red-500!"}
              title="Clear note"
            />
            {/* TODO: add 3 dot menu for overflowing options for responsive deisgn instead of flex-wrap */}
          </div>
          <EditorContent editor={editor} className="w-full h-full" />
        </>
      )}
      <AnimatePresence>
        {clearing && (
          <WarningModal
            title="Clear confirmation"
            description="Are you sure you want to completely clear all the content in this note? This will remove all the text and formatting but keep the empty note."
            confirm={handleClear}
            closeModal={() => setClearing(false)}
          />
        )}
      </AnimatePresence>
    </>
  );
}

export default Editor;
