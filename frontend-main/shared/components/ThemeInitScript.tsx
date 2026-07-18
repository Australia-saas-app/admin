import Script from "next/script";

const THEME_INIT = `(function(){try{var t=localStorage.getItem('system-db-theme');if(t==='dark'||(t!=='light'&&window.matchMedia('(prefers-color-scheme: dark)').matches)){document.documentElement.classList.add('dark');document.documentElement.style.colorScheme='dark'}else{document.documentElement.classList.remove('dark');document.documentElement.style.colorScheme='light'}}catch(e){}})();`;

/** Inject theme class before paint to avoid light/dark flash. */
export function ThemeInitScript() {
  return (
    <Script id="system-db-theme-init" strategy="beforeInteractive">
      {THEME_INIT}
    </Script>
  );
}
