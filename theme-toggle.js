(function(){
  const toggle = document.getElementById('theme-toggle');
  const icon = toggle && toggle.querySelector('i');
  const storageKey = 'theme';

  function applyTheme(theme) {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      toggle.setAttribute('aria-pressed', 'true');
      toggle.setAttribute('aria-label', 'Enable light mode');
      if (icon) {
        icon.classList.remove('fa-moon');
        icon.classList.add('fa-sun');
      }
    } else {
      document.documentElement.classList.remove('dark');
      toggle.setAttribute('aria-pressed', 'false');
      toggle.setAttribute('aria-label', 'Enable dark mode');
      if (icon) {
        icon.classList.remove('fa-sun');
        icon.classList.add('fa-moon');
      }
    }
  }

  function getPreferredTheme() {
    const saved = localStorage.getItem(storageKey);
    if (saved === 'dark' || saved === 'light') return saved;
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  // initialize
  const initial = getPreferredTheme();
  applyTheme(initial);

  // handle toggle click
  if (toggle) {
    toggle.addEventListener('click', () => {
      const isDark = document.documentElement.classList.contains('dark');
      const newTheme = isDark ? 'light' : 'dark';
      applyTheme(newTheme);
      try {
        localStorage.setItem(storageKey, newTheme);
      } catch (e) {
        // ignore
      }
    });
  }

  // if user has not explicitly set a preference, follow system changes
  const media = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)');
  if (media && !localStorage.getItem(storageKey)) {
    media.addEventListener('change', (e) => {
      applyTheme(e.matches ? 'dark' : 'light');
    });
  }
})();