const patterns = [

  {
    name: 'hr',
    block: true,
    regex: /^-{4,}$/gm,
    replace: () => '---',
  },

  {
    name: 'heading',
    block: true,
    regex: /^(={1,6})\s*(.+?)\s*\1$/gm,
    replace: (match, level, content) => {
      const hash = '#'.repeat(level.length);
      return `${hash} ${content}`;
    },
  },

  {
    name: 'boldItalic',
    block: false,
    regex: /'''''(.+?)'''''/g,
    replace: (match, content) => `***${content}***`,
  },

  {
    name: 'bold',
    block: false,
    regex: /'''(.+?)'''/g,
    replace: (match, content) => `**${content}**`,
  },

  {
    name: 'italic',
    block: false,
    regex: /''(.+?)''/g,
    replace: (match, content) => `*${content}*`,
  },

  {
    name: 'internalLinkAlias',
    block: false,
    regex: /\[\[([^|\]]+)\|([^\]]+)\]\]/g,
    replace: (match, page, text) => `[${text}](${page})`,
  },

  {
    name: 'internalLink',
    block: false,
    regex: /\[\[([^\]]+)\]\]/g,
    replace: (match, page) => `[${page}](${page})`,
  },

  {
    name: 'externalLink',
    block: false,
    regex: /\[(https?:\/\/[^\s\]]+)\s+([^\]]+)\]/g,
    replace: (match, url, text) => `[${text}](${url})`,
  },

  {
    name: 'unorderedList',
    block: true,
    regex: /^(\s*)\*\s+(.+)$/gm,
    replace: (match, indent, content) => `${indent}- ${content}`,
  },

  {
    name: 'orderedList',
    block: true,
    regex: /^(\s*)#\s+(.+)$/gm,
    replace: (match, indent, content) => {
      const depth = Math.floor(indent.length / 2) + 1;
      return `${indent}${depth}. ${content}`;
    },
  },

];

if (typeof module !== 'undefined' && module.exports) {
  module.exports = patterns;
}
