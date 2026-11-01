export const THEME_STORAGE_KEY = "utsho-theme";

export const themeScript = `(function(){try{var key="${THEME_STORAGE_KEY}";var stored=localStorage.getItem(key);var dark=stored?stored==="dark":window.matchMedia("(prefers-color-scheme: dark)").matches;var root=document.documentElement;if(dark){root.classList.add("dark")}root.style.colorScheme=dark?"dark":"light"}catch(e){}})();`;
