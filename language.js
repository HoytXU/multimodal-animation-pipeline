(() => {
  const storageKey = 'animation-language';
  const button = document.getElementById('language-switch');
  const textElements = document.querySelectorAll('[data-en][data-zh]');
  const attributes = ['alt', 'aria-label', 'content'];
  const attributeElements = attributes.map(attribute => ({
    attribute,
    elements: document.querySelectorAll(`[data-en-${attribute}]`),
  }));

  function setLanguage(language) {
    const english = language === 'en';
    const key = english ? 'en' : 'zh';
    document.documentElement.lang = english ? 'en' : 'zh-CN';
    textElements.forEach(element => {
      element.textContent = element.getAttribute(`data-${key}`);
    });
    attributeElements.forEach(({ attribute, elements }) => {
      elements.forEach(element => {
        element.setAttribute(attribute, element.getAttribute(`data-${key}-${attribute}`));
      });
    });
    button.textContent = english ? '简体中文' : 'English';
    button.lang = english ? 'zh-CN' : 'en';
    button.setAttribute('aria-label', english ? '切换到简体中文' : 'Switch to English');
  }

  let language = 'zh-CN';
  try {
    if (localStorage.getItem(storageKey) === 'en') language = 'en';
  } catch { /* Chinese remains the default if storage is unavailable. */ }
  setLanguage(language);
  button.hidden = false;
  button.addEventListener('click', () => {
    const next = document.documentElement.lang === 'en' ? 'zh-CN' : 'en';
    setLanguage(next);
    try { localStorage.setItem(storageKey, next); } catch { /* Switching still works. */ }
  });
})();
