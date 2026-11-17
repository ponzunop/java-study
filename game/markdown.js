(function (root, factory) {
  if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.JavaQuestMarkdown = factory();
  }
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  function escapeHtml(text) {
    return String(text)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function parseInline(text) {
    const tokens = [];
    const str = String(text);
    // Extract inline code spans first so markdown characters inside `...` are preserved literally
    const codeSplit = str.split(/(`[^`]+`)/g);

    for (const part of codeSplit) {
      if (!part) continue;
      if (part.startsWith('`') && part.endsWith('`') && part.length >= 2) {
        tokens.push(`<code class="lecture-inline-code">${escapeHtml(part.slice(1, -1))}</code>`);
        continue;
      }

      // Preserve inline HTML tags like <span ...>, <strong>, <code>, <br>, <a ...> while formatting markdown around them
      const htmlSplit = part.split(/(<\/?[a-zA-Z][^>]*>)/g);
      for (const seg of htmlSplit) {
        if (!seg) continue;
        if (seg.startsWith('<') && seg.endsWith('>') && /^<\/?[a-zA-Z]/.test(seg)) {
          tokens.push(seg);
          continue;
        }
        let chunk = escapeHtml(seg);
        // Markdown links [text](url)
        chunk = chunk.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_, label, url) => {
          const safeUrl = url.replace(/"/g, '&quot;');
          return `<a href="${safeUrl}" class="lecture-link">${label}</a>`;
        });
        // Bold **text**
        chunk = chunk.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
        tokens.push(chunk);
      }
    }
    return tokens.join('');
  }

  function splitTableCells(line) {
    let trimmed = line.trim();
    if (trimmed.startsWith('|')) trimmed = trimmed.slice(1);
    if (trimmed.endsWith('|')) trimmed = trimmed.slice(0, -1);
    return trimmed.split('|').map((cell) => cell.trim());
  }

  function isTableSeparator(line) {
    const trimmed = line.trim();
    if (!trimmed.includes('|')) return false;
    const cells = splitTableCells(trimmed);
    return cells.length > 0 && cells.every((c) => /^:?-{2,}:?$/.test(c));
  }

  function parseTableAlignments(line) {
    return splitTableCells(line).map((c) => {
      if (c.startsWith(':') && c.endsWith(':')) return 'center';
      if (c.endsWith(':')) return 'right';
      return 'left';
    });
  }

  function countTagDelta(line, tagName) {
    const openMatches = line.match(new RegExp(`<${tagName}\\b[^>]*>`, 'gi')) || [];
    const closeMatches = line.match(new RegExp(`</${tagName}>`, 'gi')) || [];
    return openMatches.length - closeMatches.length;
  }

  function renderMarkdown(markdownText) {
    const lines = String(markdownText || '').replace(/\r\n/g, '\n').split('\n');
    const out = [];
    let i = 0;

    while (i < lines.length) {
      const line = lines[i];
      const trimmed = line.trim();

      // Blank line
      if (!trimmed) {
        i += 1;
        continue;
      }

      // Fenced code block ```lang ... ```
      if (trimmed.startsWith('```')) {
        const fenceIndent = line.match(/^\s*/)[0].length;
        const lang = trimmed.slice(3).trim();
        const codeLines = [];
        i += 1;
        while (i < lines.length && !lines[i].trim().startsWith('```')) {
          let codeLine = lines[i];
          if (fenceIndent > 0) {
            const leadMatch = codeLine.match(/^\s*/)[0].length;
            codeLine = codeLine.slice(Math.min(fenceIndent, leadMatch));
          }
          codeLines.push(codeLine);
          i += 1;
        }
        if (i < lines.length && lines[i].trim().startsWith('```')) {
          i += 1;
        }
        const codeText = codeLines.join('\n');
        if (lang.toLowerCase() === 'mermaid') {
          out.push(
            `<div class="lecture-mermaid"><div class="lecture-mermaid-label">📊 フロー図・構成図</div><pre class="mermaid">${escapeHtml(codeText)}</pre></div>`
          );
        } else {
          const langBadge = lang ? `<div class="lecture-code-lang">${escapeHtml(lang)}</div>` : '';
          out.push(
            `<div class="lecture-code-wrap">${langBadge}<pre class="lecture-code"><code>${escapeHtml(codeText)}</code></pre></div>`
          );
        }
        continue;
      }

      // <details> and </details> and <summary> blocks (allow Markdown inside <details>)
      if (/^<details\b/i.test(trimmed)) {
        out.push('<details class="lecture-details">');
        i += 1;
        continue;
      }
      if (/^<\/details>/i.test(trimmed)) {
        out.push('</details>');
        i += 1;
        continue;
      }
      if (/^<summary\b/i.test(trimmed)) {
        const sumLines = [line];
        while (!sumLines[sumLines.length - 1].includes('</summary>') && i + 1 < lines.length) {
          i += 1;
          sumLines.push(lines[i]);
        }
        out.push(sumLines.join('\n'));
        i += 1;
        continue;
      }

      // HTML comments
      if (/^<!--/.test(trimmed)) {
        while (i < lines.length && !lines[i].includes('-->')) {
          i += 1;
        }
        i += 1;
        continue;
      }

      // Raw HTML block containers
      const blockTagMatch = trimmed.match(/^<(div|table|ul|ol|blockquote|h[1-6]|p)\b/i);
      if (blockTagMatch) {
        const tag = blockTagMatch[1].toLowerCase();
        const htmlLines = [line];
        let depth = countTagDelta(line, tag);
        while (depth > 0 && i + 1 < lines.length) {
          i += 1;
          htmlLines.push(lines[i]);
          depth += countTagDelta(lines[i], tag);
        }
        out.push(htmlLines.join('\n'));
        i += 1;
        continue;
      }

      // Horizontal rule
      if (/^(-{3,}|\*{3,}|_{3,})$/.test(trimmed)) {
        out.push('<hr class="lecture-hr" />');
        i += 1;
        continue;
      }

      // Headings (# .. ####)
      const headingMatch = trimmed.match(/^(#{1,4})\s+(.+)$/);
      if (headingMatch) {
        const level = headingMatch[1].length;
        out.push(`<h${level} class="lecture-h${level}">${parseInline(headingMatch[2])}</h${level}>`);
        i += 1;
        continue;
      }

      // Blockquote (> ...)
      if (trimmed.startsWith('>')) {
        const quoteLines = [];
        while (i < lines.length && lines[i].trim().startsWith('>')) {
          quoteLines.push(lines[i].trim().replace(/^>\s?/, ''));
          i += 1;
        }
        out.push(`<blockquote class="lecture-quote">${renderMarkdown(quoteLines.join('\n'))}</blockquote>`);
        continue;
      }

      // Markdown table
      if (trimmed.includes('|') && i + 1 < lines.length && isTableSeparator(lines[i + 1])) {
        const headers = splitTableCells(trimmed);
        const aligns = parseTableAlignments(lines[i + 1]);
        i += 2;
        const rows = [];
        while (i < lines.length && lines[i].trim().includes('|') && !lines[i].trim().startsWith('```')) {
          rows.push(splitTableCells(lines[i]));
          i += 1;
        }
        const thHtml = headers
          .map((h, idx) => `<th style="text-align:${aligns[idx] || 'left'}">${parseInline(h)}</th>`)
          .join('');
        const bodyHtml = rows
          .map(
            (row) =>
              `<tr>${headers
                .map((_, idx) => `<td style="text-align:${aligns[idx] || 'left'}">${parseInline(row[idx] || '')}</td>`)
                .join('')}</tr>`
          )
          .join('');
        out.push(
          `<div class="lecture-table-wrap"><table class="lecture-table"><thead><tr>${thHtml}</tr></thead><tbody>${bodyHtml}</tbody></table></div>`
        );
        continue;
      }

      // Unordered or Ordered list
      if (/^[-*]\s+/.test(trimmed) || /^\d+\.\s+/.test(trimmed)) {
        const isOrdered = /^\d+\.\s+/.test(trimmed);
        const listTag = isOrdered ? 'ol' : 'ul';
        const items = [];
        while (i < lines.length) {
          const cur = lines[i];
          const curTrim = cur.trim();
          if (!curTrim) break;
          if (/^[-*]\s+/.test(curTrim) && !isOrdered) {
            const indent = cur.search(/\S/);
            const itemText = curTrim.replace(/^[-*]\s+/, '');
            if (indent >= 2 && items.length > 0) {
              items[items.length - 1].sub.push(itemText);
            } else {
              items.push({ text: itemText, sub: [] });
            }
            i += 1;
          } else if (/^\d+\.\s+/.test(curTrim) && isOrdered) {
            items.push({ text: curTrim.replace(/^\d+\.\s+/, ''), sub: [] });
            i += 1;
          } else if (/^\s{2,}[-*]\s+/.test(cur) && items.length > 0) {
            items[items.length - 1].sub.push(curTrim.replace(/^[-*]\s+/, ''));
            i += 1;
          } else if (/^\s{2,}\S/.test(cur) && items.length > 0 && !curTrim.startsWith('<') && !curTrim.startsWith('```')) {
            items[items.length - 1].text += '<br />' + curTrim;
            i += 1;
          } else {
            break;
          }
        }
        const itemsHtml = items
          .map((it) => {
            const subHtml =
              it.sub.length > 0
                ? `<ul>${it.sub.map((s) => `<li>${parseInline(s)}</li>`).join('')}</ul>`
                : '';
            return `<li>${parseInline(it.text)}${subHtml}</li>`;
          })
          .join('');
        out.push(`<${listTag} class="lecture-list">${itemsHtml}</${listTag}>`);
        continue;
      }

      // Paragraph
      const paraLines = [];
      while (i < lines.length) {
        const curTrim = lines[i].trim();
        if (
          !curTrim ||
          curTrim.startsWith('```') ||
          /^#{1,4}\s+/.test(curTrim) ||
          /^(-{3,}|\*{3,}|_{3,})$/.test(curTrim) ||
          curTrim.startsWith('>') ||
          /^[-*]\s+/.test(curTrim) ||
          /^\d+\.\s+/.test(curTrim) ||
          /^<(div|table|ul|ol|details|\/details|summary|blockquote|h[1-6]|p|!--)/i.test(curTrim)
        ) {
          break;
        }
        paraLines.push(curTrim);
        i += 1;
      }
      if (paraLines.length > 0) {
        out.push(`<p class="lecture-p">${paraLines.map((l) => parseInline(l)).join('<br />')}</p>`);
      } else {
        out.push(`<p class="lecture-p">${parseInline(trimmed)}</p>`);
        i += 1;
      }
    }

    return out.join('\n');
  }

  return {
    escapeHtml,
    parseInline,
    renderMarkdown,
  };
});
