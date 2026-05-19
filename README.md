# wikitext2markdown

a tool for converting mediawiki text to clean markdown. made with html, css and javascript

## features

these are probably some notiable features on this...

- **live conversion** — converts as you type, 
- **raw / rendered toggle** on both input (wikitext) and output (markdown) panels
- **mobile responsive probably** — two-panel layout on desktop, stacked on mobile
- **no dependencies** — works offline after first load (google fonts cached)

## usage

open the `src/index.html` directly in any browser. paste your wikitext in the left panel and the converted markdown appears instantly on the right. and thats very easy

| shortcut | action |
|----------|--------|
| `Ctrl+Enter` | force re-convert probably |

## supported wikitext

| wikitext | markdown |
|----------|----------|
| `= Heading =` | `# Heading` |
| `=== Heading ===` | `### Heading` |
| `'''bold'''` | `**bold**` |
| `''italic''` | `*italic*` |
| `'''''both'''''` | `***both***` |
| `[[Page]]` | `[Page](Page)` |
| `[[Page\|text]]` | `[text](Page)` |
| `[https://... text]` | `[text](https://...)` |
| `* item` | `- item` |
| `# item` | `1. item` |
| `----` | `---` |

## the project structure

```
wikitext2markdown/
├── .gitignore
├── README.md
└── src/
    ├── index.html
    ├── css/
    │   └── styles.css
    └── js/
        ├── patterns.js    # the wikitext regex patterns
        ├── converter.js   # the conversion engine plus markdown renderer
        └── app.js         # ui logic, events, clipboard
```

and thats it.
