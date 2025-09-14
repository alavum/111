import React from "react";

// Lightweight rich text renderer supporting headings, lists, inline bold/italic and simple tables.
export function renderRichText(text: string) {
  if (!text) return null;

  const lines = text.replace(/\r\n/g, "\n").split("\n");
  const nodes: React.ReactNode[] = [];

  let i = 0;
  while (i < lines.length) {
    const line = lines[i];

    // Table block detection: consecutive lines containing '|'
    if (line.includes("|") && line.trim().length > 0) {
      const tableLines = [];
      while (i < lines.length && lines[i].includes("|")) {
        if (lines[i].trim()) tableLines.push(lines[i]);
        i++;
      }

      if (tableLines.length > 0) {
        const rows = tableLines.map((l) =>
          l
            .split("|")
            .map((c) => c.trim())
            .filter((c) => c.length > 0),
        );
        const header = rows[0];
        const body = rows.slice(1);

        nodes.push(
          <div key={`table-${i}`} className="overflow-auto my-4">
            <table className="min-w-full text-left border-collapse">
              <thead>
                <tr>
                  {header.map((cell, idx) => (
                    <th
                      key={idx}
                      className="px-4 py-2 font-medium text-gaming-text-muted border-b border-gaming-border"
                    >
                      {renderInline(cell)}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {body.map((r, ridx) => (
                  <tr key={ridx} className="odd:bg-gaming-card">
                    {r.map((cell, cidx) => (
                      <td
                        key={cidx}
                        className="px-4 py-2 border-b border-gaming-border"
                      >
                        {renderInline(cell)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>,
        );
      }

      continue;
    }

    // Heading
    if (line.startsWith("# ")) {
      nodes.push(
        <h1 key={i} className="text-3xl font-bold text-gaming-accent my-4">
          {renderInline(line.substring(2))}
        </h1>,
      );
      i++;
      continue;
    }
    if (line.startsWith("## ")) {
      nodes.push(
        <h2 key={i} className="text-2xl font-bold text-gaming-text my-3">
          {renderInline(line.substring(3))}
        </h2>,
      );
      i++;
      continue;
    }
    if (line.startsWith("### ")) {
      nodes.push(
        <h3 key={i} className="text-xl font-semibold text-gaming-accent my-2">
          {renderInline(line.substring(4))}
        </h3>,
      );
      i++;
      continue;
    }

    // Ordered / numbered items (including nested like 2.1.3)
    const numberedMatch = line.match(/^(\d+(?:\.\d+)*)\.?\s*(.*)/);
    if (numberedMatch) {
      const number = numberedMatch[1];
      const rest = numberedMatch[2] || "";
      nodes.push(
        <p key={i} className="text-gaming-text mb-2 pl-4">
          <span className="font-semibold text-gaming-accent mr-2">
            {number}.
          </span>
          {renderInline(rest)}
        </p>,
      );
      i++;
      continue;
    }

    // Bullets
    if (line.trim().startsWith("-") || line.trim().startsWith("●")) {
      const content = line.replace(/^[-●]\s*/, "");
      nodes.push(
        <p key={i} className="text-gaming-text mb-2 pl-4">
          <span className="text-gaming-accent mr-2">•</span>
          {renderInline(content)}
        </p>,
      );
      i++;
      continue;
    }

    if (line.trim()) {
      nodes.push(
        <p key={i} className="text-gaming-text mb-3 leading-relaxed">
          {renderInline(line)}
        </p>,
      );
    } else {
      nodes.push(<br key={i} />);
    }

    i++;
  }

  return nodes;
}

function renderInline(text: string) {
  if (!text) return null;
  const elements: React.ReactNode[] = [];
  let remaining = text;
  let index = 0;

  const mdPattern = /(\*\*([^*]+)\*\*)|(\*([^*]+)\*)|(\[([^\]]+)\]\(([^)]+)\))/;
  const urlPattern = /(https?:\/\/[^\s)]+)/i;

  let safety = 0;
  const MAX_ITER = 2000;
  while (remaining.length > 0) {
    if (++safety > MAX_ITER) {
      elements.push(remaining);
      break;
    }

    const mdMatch = remaining.match(mdPattern);
    const urlMatch = remaining.match(urlPattern);

    if (!mdMatch && !urlMatch) {
      elements.push(remaining);
      break;
    }

    const mdIndex = mdMatch?.index ?? Infinity;
    const urlIndex = urlMatch?.index ?? Infinity;

    if (mdIndex > 0 || urlIndex > 0) {
      const firstIndex = Math.min(mdIndex, urlIndex);
      if (firstIndex <= 0) {
        // avoid infinite loop
        elements.push(remaining);
        break;
      }
      elements.push(remaining.slice(0, firstIndex));
      remaining = remaining.slice(firstIndex);
      continue;
    }

    if (mdMatch && mdMatch.index === 0) {
      const matchText = mdMatch[0] || "";
      if (!matchText) {
        elements.push(remaining);
        break;
      }

      if (mdMatch[1]) {
        elements.push(
          <strong key={index++} className="font-semibold text-gaming-accent">
            {mdMatch[2]}
          </strong>,
        );
      } else if (mdMatch[3]) {
        elements.push(<em key={index++} className="italic">{mdMatch[4]}</em>);
      } else if (mdMatch[5]) {
        elements.push(
          <a
            key={index++}
            href={mdMatch[7]}
            target="_blank"
            rel="noopener noreferrer"
            className="text-gaming-accent underline"
          >
            {mdMatch[6]}
          </a>,
        );
      }

      remaining = remaining.slice(matchText.length);
      continue;
    }

    if (urlMatch && urlMatch.index === 0) {
      const url = urlMatch[0] || "";
      if (!url) {
        elements.push(remaining);
        break;
      }
      elements.push(
        <a
          key={index++}
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-gaming-accent underline"
        >
          {url}
        </a>,
      );
      remaining = remaining.slice(url.length);
      continue;
    }

    elements.push(remaining);
    break;
  }

  return elements;
}
