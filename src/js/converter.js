// the js file for the converter that converts wikitext to markdown
function convert(wikitext) {
  if (!wikitext || !wikitext.trim()) return '';

  let result = wikitext;
  const codeBlocks = [];
  let codeIdx = 0;

  result = result.replace(/```[\s\S]*?```/g, (match) => {
    const idx = `\x00CODEBLOCK${codeIdx}\x00`;
    codeBlocks.push(match);
    codeIdx++;
    return idx;
  });

  result = result.replace(/`[^`]+`/g, (match) => {
    const idx = `\x00CODESPAN${codeIdx}\x00`;
    codeBlocks.push(match);
    codeIdx++;
    return idx;
  });

  const blockPatterns = patterns.filter(p => p.block);
  for (const p of blockPatterns) {
    result = result.replace(p.regex, p.replace);
  }

  const inlinePatterns = patterns.filter(p => !p.block);
  const lines = result.split('\n');
  const processedLines = lines.map(line => {
    let processed = line;
    for (const p of inlinePatterns) {
      processed = processed.replace(p.regex, p.replace);
    }
    return processed;
  });
  result = processedLines.join('\n');

  result = result.replace(/\x00CODEBLOCK(\d+)\x00/g, (_, n) => codeBlocks[parseInt(n)]);
  result = result.replace(/\x00CODESPAN(\d+)\x00/g, (_, n) => codeBlocks[parseInt(n)]);

  return result;
}

function escapeHtml(str) {
  const map = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
  return str.replace(/[&<>"']/g, c => map[c]);
}

function renderMarkdownInline(text) {
  let result = text;

  result = result.replace(/`([^`]+)`/g, '<code>$1</code>');

  result = result.replace(/\*\*\*(.+?)\*\*\*/g, '<strong><em>$1</em></strong>');

  result = result.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');

  result = result.replace(/\*(.+?)\*/g, '<em>$1</em>');

  result = result.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');

  result = result.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1">');

  return result;
}

function renderMarkdown(markdown) {
  if (!markdown || !markdown.trim()) return '<p style="color: var(--muted);">No output yet</p>';

  const lines = markdown.split('\n');
  const htmlParts = [];
  let inCodeBlock = false;
  let codeContent = [];
  let inList = false;
  let listItems = [];
  let listType = null;
  let paragraphBuffer = [];

  function flushParagraph() {
    if (paragraphBuffer.length === 0) return;
    const text = paragraphBuffer.join('<br>');
    htmlParts.push(`<p>${renderMarkdownInline(text)}</p>`);
    paragraphBuffer = [];
  }

  function flushList() {
    if (listItems.length === 0) return;
    const tag = listType === 'ul' ? 'ul' : 'ol';
    const items = listItems.map(item => `<li>${renderMarkdownInline(item)}</li>`).join('');
    htmlParts.push(`<${tag}>${items}</${tag}>`);
    listItems = [];
    listType = null;
    inList = false;
  }

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    if (line.startsWith('```')) {
      if (inCodeBlock) {
        htmlParts.push(`<pre><code>${escapeHtml(codeContent.join('\n'))}</code></pre>`);
        codeContent = [];
        inCodeBlock = false;
      } else {
        flushParagraph();
        flushList();
        inCodeBlock = true;
      }
      continue;
    }

    if (inCodeBlock) {
      codeContent.push(line);
      continue;
    }

    if (/^#{1,6}\s/.test(line)) {
      flushParagraph();
      flushList();
      const match = line.match(/^(#{1,6})\s+(.+)$/);
      if (match) {
        const level = match[1].length;
        const content = renderMarkdownInline(match[2]);
        htmlParts.push(`<h${level}>${content}</h${level}>`);
      }
      continue;
    }

    if (/^-{3,}$/.test(line.trim())) {
      flushParagraph();
      flushList();
      htmlParts.push('<hr>');
      continue;
    }

    if (/^\s*[-*+]\s/.test(line)) {
      flushParagraph();
      if (!inList || listType !== 'ul') {
        flushList();
        inList = true;
        listType = 'ul';
      }
      listItems.push(line.replace(/^\s*[-*+]\s+/, ''));
      continue;
    }

    if (/^\s*\d+\.\s/.test(line)) {
      flushParagraph();
      if (!inList || listType !== 'ol') {
        flushList();
        inList = true;
        listType = 'ol';
      }
      listItems.push(line.replace(/^\s*\d+\.\s+/, ''));
      continue;
    }

    flushList();

    if (line.trim() === '') {
      flushParagraph();
      htmlParts.push('');
    } else {
      paragraphBuffer.push(line);
    }
  }

  flushParagraph();
  flushList();

  if (inCodeBlock) {
    htmlParts.push(`<pre><code>${escapeHtml(codeContent.join('\n'))}</code></pre>`);
  }

  return htmlParts.join('\n');
}

function renderWikitext(wikitext) {
  return renderMarkdown(convert(wikitext));
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { convert, renderMarkdown, renderWikitext };
}
