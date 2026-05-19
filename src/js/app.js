function debounce(fn, delay) {
  let timer;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), delay);
  };
}

document.addEventListener('DOMContentLoaded', () => {
  const inputEl = document.getElementById('wikitext-input');
  const outputEl = document.getElementById('output');
  const wikitextRendered = document.getElementById('wikitext-rendered');
  const copyBtn = document.getElementById('copyBtn');
  const renderToggle = document.getElementById('renderToggle');
  const inputRenderToggle = document.getElementById('inputRenderToggle');
  const charCount = document.getElementById('charCount');
  const rawLabel = document.getElementById('rawLabel');
  const renderedLabel = document.getElementById('renderedLabel');
  const inputRawLabel = document.getElementById('inputRawLabel');
  const inputRenderedLabel = document.getElementById('inputRenderedLabel');

  let isRendered = false;
  let isInputRendered = false;

  function updateOutput() {
    const wikitext = inputEl.value;
    const markdown = convert(wikitext);

    if (isRendered) {
      outputEl.className = 'output-area rendered';
      outputEl.innerHTML = renderMarkdown(markdown);
    } else {
      outputEl.className = 'output-area';
      outputEl.textContent = markdown || 'the converted markdown will appear here...';
    }

    const lineCount = wikitext ? wikitext.split('\n').length : 0;
    const wordCount = wikitext ? wikitext.trim().split(/\s+/).filter(Boolean).length : 0;
    if (charCount) {
      charCount.textContent = `${lineCount} lines · ${wordCount} words`;
    }
  }

  function updateInputRendered() {
    if (!isInputRendered) return;
    wikitextRendered.innerHTML = renderWikitext(inputEl.value);
  }

  const debouncedUpdate = debounce(updateOutput, 300);
  const debouncedInputRender = debounce(updateInputRendered, 300);

  function onInput() {
    debouncedUpdate();
    debouncedInputRender();
  }

  inputEl.addEventListener('input', onInput);

  renderToggle.addEventListener('change', () => {
    isRendered = renderToggle.checked;
    rawLabel.classList.toggle('active', !isRendered);
    renderedLabel.classList.toggle('active', isRendered);
    updateOutput();
  });

  inputRenderToggle.addEventListener('change', () => {
    isInputRendered = inputRenderToggle.checked;
    inputRawLabel.classList.toggle('active', !isInputRendered);
    inputRenderedLabel.classList.toggle('active', isInputRendered);
    inputEl.style.display = isInputRendered ? 'none' : '';
    wikitextRendered.style.display = isInputRendered ? '' : 'none';
    if (isInputRendered) updateInputRendered();
  });

  copyBtn.addEventListener('click', async () => {
    let text;
    if (isRendered) {
      text = outputEl.innerText;
    } else {
      text = outputEl.textContent;
    }

    if (!text || text === 'the converted markdown will appear here...') {
      return;
    }

    try {
      await navigator.clipboard.writeText(text);
      copyBtn.textContent = 'copied!';
      copyBtn.classList.add('copied');
      setTimeout(() => {
        copyBtn.textContent = 'Copy';
        copyBtn.classList.remove('copied');
      }, 2000);
    } catch {
      const ta = document.createElement('textarea');
      ta.value = text;
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      copyBtn.textContent = 'copied!';
      copyBtn.classList.add('copied');
      setTimeout(() => {
        copyBtn.textContent = 'Copy';
        copyBtn.classList.remove('copied');
      }, 2000);
    }
  });

  document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      updateOutput();
    }
  });

  inputEl.focus();
});
