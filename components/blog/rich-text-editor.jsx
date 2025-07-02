"use client";

import { useState, useRef, useEffect } from "react";

export default function RichTextEditor({
  value,
  onChange,
  placeholder = "Start writing...",
}) {
  const editorRef = useRef(null);
  const [isToolbarVisible, setIsToolbarVisible] = useState(false);

  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== value) {
      editorRef.current.innerHTML = value;
    }
  }, [value]);

  const handleInput = () => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  const execCommand = (command, value) => {
    document.execCommand(command, false, value);
    editorRef.current?.focus();
  };

  const handleFocus = () => {
    setIsToolbarVisible(true);
  };

  const handleBlur = (e) => {
    // Keep toolbar visible if clicking on toolbar buttons
    if (!e.relatedTarget || !e.currentTarget.contains(e.relatedTarget)) {
      setTimeout(() => setIsToolbarVisible(false), 100);
    }
  };

  return (
    <div className="border border-gray-300 rounded-lg overflow-hidden">
      {isToolbarVisible && (
        <div className="bg-gray-50 border-b border-gray-300 p-2 flex flex-wrap gap-1">
          <button
            type="button"
            onClick={() => execCommand("bold")}
            className="px-3 py-1 text-sm bg-white border border-gray-300 rounded hover:bg-gray-100 font-bold"
          >
            B
          </button>
          <button
            type="button"
            onClick={() => execCommand("italic")}
            className="px-3 py-1 text-sm bg-white border border-gray-300 rounded hover:bg-gray-100 italic"
          >
            I
          </button>
          <button
            type="button"
            onClick={() => execCommand("underline")}
            className="px-3 py-1 text-sm bg-white border border-gray-300 rounded hover:bg-gray-100 underline"
          >
            U
          </button>
          <div className="w-px bg-gray-300 mx-1"></div>
          <button
            type="button"
            onClick={() => execCommand("formatBlock", "h1")}
            className="px-3 py-1 text-sm bg-white border border-gray-300 rounded hover:bg-gray-100"
          >
            H1
          </button>
          <button
            type="button"
            onClick={() => execCommand("formatBlock", "h2")}
            className="px-3 py-1 text-sm bg-white border border-gray-300 rounded hover:bg-gray-100"
          >
            H2
          </button>
          <button
            type="button"
            onClick={() => execCommand("formatBlock", "p")}
            className="px-3 py-1 text-sm bg-white border border-gray-300 rounded hover:bg-gray-100"
          >
            P
          </button>
          <div className="w-px bg-gray-300 mx-1"></div>
          <button
            type="button"
            onClick={() => execCommand("insertUnorderedList")}
            className="px-3 py-1 text-sm bg-white border border-gray-300 rounded hover:bg-gray-100"
          >
            • List
          </button>
          <button
            type="button"
            onClick={() => execCommand("insertOrderedList")}
            className="px-3 py-1 text-sm bg-white border border-gray-300 rounded hover:bg-gray-100"
          >
            1. List
          </button>
          <div className="w-px bg-gray-300 mx-1"></div>
          <button
            type="button"
            onClick={() => {
              const url = prompt("Enter URL:");
              if (url) execCommand("createLink", url);
            }}
            className="px-3 py-1 text-sm bg-white border border-gray-300 rounded hover:bg-gray-100"
          >
            Link
          </button>
        </div>
      )}
      <div className="relative">
        <div
          ref={editorRef}
          contentEditable
          onInput={handleInput}
          onFocus={handleFocus}
          onBlur={handleBlur}
          className="min-h-[200px] p-4 outline-none prose prose-sm max-w-none"
          style={{ minHeight: "200px" }}
          suppressContentEditableWarning={true}
        />
        {!value && (
          <div
            className="absolute top-0 left-0 p-4 text-gray-400 pointer-events-none select-none"
            style={{ minHeight: "200px" }}
          >
            {placeholder}
          </div>
        )}
      </div>
    </div>
  );
}
