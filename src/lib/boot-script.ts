import { DEFAULT_DEPTH, DEPTHS, DEPTH_STORAGE_KEY } from "./depth";
import { THEME_STORAGE_KEY } from "./theme";

/** Set once the intro has played, so it is skipped for the rest of the visit. */
export const INTRO_STORAGE_KEY = "intro-seen";

// Runs synchronously in <head> before the first paint, so the page never flashes the
// wrong theme or depth. It mirrors readInitialDepth() in depth.ts; keep the two in step.
// "js" on <html> lets CSS tell a scripted page from a no-JS one; "intro" shows the intro
// on the first home-page view of a visit, unless reduced motion is on.
export const bootScript = `(function(){
var d=document.documentElement;d.classList.add("js");
var depths=${JSON.stringify(DEPTHS)};
try{
var q=new URLSearchParams(location.search).get("depth");
var s=sessionStorage.getItem(${JSON.stringify(DEPTH_STORAGE_KEY)});
d.dataset.depth=depths.indexOf(q)>-1?q:depths.indexOf(s)>-1?s:${JSON.stringify(DEFAULT_DEPTH)};
var t=localStorage.getItem(${JSON.stringify(THEME_STORAGE_KEY)});
if(t==="light"||t==="dark")d.dataset.theme=t;
if(!sessionStorage.getItem(${JSON.stringify(INTRO_STORAGE_KEY)})&&!matchMedia("(prefers-reduced-motion: reduce)").matches&&location.pathname==="/")d.classList.add("intro");
}catch(e){}
})();`;
