import React, { useRef } from "react";

interface Props {
  value: string;
  onChange: (val: string) => void;
  id?: string;
  className?: string;
}

export default function AdminRichEditor({
  value,
  onChange,
  id,
  className,
}: Props) {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const insertAtCursor = (before: string, after = "", replace = "") => {
    const ta = textareaRef.current;
    if (!ta) return;
    const start = ta.selectionStart || 0;
    const end = ta.selectionEnd || 0;
    const selected = value.substring(start, end) || replace;
    const newText =
      value.substring(0, start) +
      before +
      selected +
      after +
      value.substring(end);
    onChange(newText);

    // restore focus and set caret after inserted content
    requestAnimationFrame(() => {
      if (!textareaRef.current) return;
      const pos = start + before.length + selected.length + after.length;
      textareaRef.current.focus();
      textareaRef.current.selectionStart = textareaRef.current.selectionEnd =
        pos;
    });
  };

  return (
    <div className={`space-y-2 ${className || ""}`}>
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          className="px-3 py-1 bg-gaming-card border border-gaming-border rounded text-sm"
          onClick={() => insertAtCursor("**", "**")}
        >
          B
        </button>
        <button
          type="button"
          className="px-3 py-1 bg-gaming-card border border-gaming-border rounded text-sm"
          onClick={() => insertAtCursor("*", "*")}
        >
          I
        </button>
        <button
          type="button"
          className="px-3 py-1 bg-gaming-card border border-gaming-border rounded text-sm"
          onClick={() => insertAtCursor("# ", "\n")}
        >
          H1
        </button>
        <button
          type="button"
          className="px-3 py-1 bg-gaming-card border border-gaming-border rounded text-sm"
          onClick={() => insertAtCursor("## ", "\n")}
        >
          H2
        </button>
        <button
          type="button"
          className="px-3 py-1 bg-gaming-card border border-gaming-border rounded text-sm"
          onClick={() => insertAtCursor("- ", "\n")}
        >
          • List
        </button>
        <button
          type="button"
          className="px-3 py-1 bg-gaming-card border border-gaming-border rounded text-sm"
          onClick={() => insertAtCursor("1. ", "\n")}
        >
          1. List
        </button>
        <button
          type="button"
          className="px-3 py-1 bg-gaming-card border border-gaming-border rounded text-sm"
          onClick={() => {
            const table =
              "| Header 1 | Header 2 |\n| --- | --- |\n| Cell 1 | Cell 2 |\n";
            insertAtCursor(table);
          }}
        >
          Table
        </button>
        <button
          type="button"
          className="px-3 py-1 bg-gaming-card border border-gaming-border rounded text-sm"
          onClick={() => insertAtCursor("\n**", "**\n")}
        >
          Highlight
        </button>
        <button
          type="button"
          className="px-3 py-1 bg-gaming-card border border-gaming-border rounded text-sm"
          onClick={() => insertAtCursor("\n", "\n\n")}
        >
          BR
        </button>
      </div>
      <textarea
        id={id}
        ref={textareaRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-gaming-bg border border-gaming-border text-gaming-text p-3 rounded min-h-[300px] resize-vertical"
      />
    </div>
  );
}
