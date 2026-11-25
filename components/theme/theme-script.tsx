import { STORAGE_NAMESPACE } from "@/config/site";
import { DEFAULT_THEME_ID, STORAGE_KEY_THEME } from "@/config/themes";

// sets theme, mode and font before first paint, otherwise the page flashes defaults
// until hydration. must stay inline and synchronous, an external file lands too late
export function ThemeScript() {
  const script = `(function(){try{
var r=document.documentElement;
var raw=localStorage.getItem(${JSON.stringify(STORAGE_KEY_THEME)});
var p=raw?JSON.parse(raw):null;
var t=(p&&p.themeId)||${JSON.stringify(DEFAULT_THEME_ID)};
var s=(p&&p.scheme)||"system";
var dark=s==="dark"||(s==="system"&&matchMedia("(prefers-color-scheme: dark)").matches);
r.setAttribute("data-theme",t);
r.classList.toggle("dark",dark);
var prefs=localStorage.getItem(${JSON.stringify(`${STORAGE_NAMESPACE}:preferences`)});
var font=prefs?JSON.parse(prefs).fontFamily:null;
if(font&&font!=="auto")r.setAttribute("data-font",font);
}catch(e){document.documentElement.setAttribute("data-theme",${JSON.stringify(DEFAULT_THEME_ID)});}})();`;

  return <script dangerouslySetInnerHTML={{ __html: script }} suppressHydrationWarning />;
}
