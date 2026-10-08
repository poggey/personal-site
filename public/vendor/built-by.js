/*!
 * Vendored from github.com/poggey/built-by for this site. Two local edits to meet the
 * site copy rules: no dash in the aria-label, and no monospace for the glyph.
 *
 * built-by.js (a small, self-contained attribution badge).
 *
 * Usage: add ONE line before </body> in any project:
 *
 *   <script src="built-by.js"
 *           data-name="Your Name"
 *           data-github="https://github.com/yourusername"
 *           data-site="https://yourportfolio.com"
 *           defer></script>
 *
 * Optional attributes:
 *   data-position="bottom-right" (default) | "bottom-left"
 *   data-theme="auto" (default) | "light" | "dark"
 *   data-avatar="https://..."  (defaults to your GitHub profile picture,
 *                               derived from data-github — so changing your
 *                               GitHub avatar updates every project)
 */
(function () {
  "use strict";

  var script = document.currentScript;
  var cfg = {
    name: (script && script.dataset.name) || "Your Name",
    github: (script && script.dataset.github) || "",
    site: (script && script.dataset.site) || "",
    position: (script && script.dataset.position) || "bottom-right",
    theme: (script && script.dataset.theme) || "auto",
    avatar: (script && script.dataset.avatar) || "",
  };

  // Default avatar: your GitHub profile picture. github.com/<user>.png
  // always redirects to your current avatar, so updating it on GitHub
  // updates it everywhere this badge is used.
  if (!cfg.avatar && cfg.github) {
    var gh = cfg.github.match(/github\.com\/([^\/?#]+)/i);
    if (gh) cfg.avatar = "https://github.com/" + gh[1] + ".png?size=120";
  }

  function init() {
    var host = document.createElement("div");
    host.setAttribute("data-built-by", "");
    var shadow = host.attachShadow({ mode: "open" });

    // --- Detect whether the page behind the badge is light or dark ---
    function pageIsDark() {
      if (cfg.theme === "dark") return true;
      if (cfg.theme === "light") return false;
      var el = document.body;
      var rgb = null;
      while (el) {
        var bg = getComputedStyle(el).backgroundColor;
        var m = bg && bg.match(/rgba?\(([^)]+)\)/);
        if (m) {
          var parts = m[1].split(",").map(parseFloat);
          var alpha = parts.length > 3 ? parts[3] : 1;
          if (alpha > 0.1) {
            rgb = parts;
            break;
          }
        }
        el = el === document.body ? document.documentElement : null;
      }
      if (!rgb) return false; // default: assume light page
      var lum = (0.2126 * rgb[0] + 0.7152 * rgb[1] + 0.0722 * rgb[2]) / 255;
      return lum < 0.5;
    }

    var dark = pageIsDark();

    var side = cfg.position === "bottom-left" ? "left" : "right";

    var style = document.createElement("style");
    style.textContent =
      ":host{all:initial}" +
      ".wrap{position:fixed;bottom:16px;" +
      side +
      ":16px;z-index:2147483000;" +
      'font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif;' +
      "font-size:12px;line-height:1;-webkit-font-smoothing:antialiased}" +
      ".badge{display:flex;align-items:center;gap:7px;padding:8px 12px;border-radius:999px;" +
      "cursor:pointer;user-select:none;-webkit-user-select:none;text-decoration:none;" +
      "backdrop-filter:blur(12px) saturate(1.4);-webkit-backdrop-filter:blur(12px) saturate(1.4);" +
      "transition:opacity .18s ease, box-shadow .18s ease, transform .18s ease;" +
      "opacity:.72;border:1px solid;box-shadow:0 2px 10px rgba(0,0,0,.12)}" +
      ".badge:hover,.badge:focus-visible,.wrap.open .badge{opacity:1;box-shadow:0 4px 18px rgba(0,0,0,.18)}" +
      ".badge:focus-visible{outline:2px solid #6ea8fe;outline-offset:2px}" +
      /* light-page variant (dark glass) */
      ".wrap.on-light .badge{background:rgba(28,28,32,.82);color:#fff;border-color:rgba(255,255,255,.14)}" +
      ".wrap.on-light .panel{background:rgba(28,28,32,.92);color:#fff;border-color:rgba(255,255,255,.14)}" +
      ".wrap.on-light a.link{color:#fff}" +
      ".wrap.on-light a.link:hover{background:rgba(255,255,255,.12)}" +
      /* dark-page variant (light glass) */
      ".wrap.on-dark .badge{background:rgba(255,255,255,.85);color:#1c1c20;border-color:rgba(0,0,0,.08)}" +
      ".wrap.on-dark .panel{background:rgba(255,255,255,.95);color:#1c1c20;border-color:rgba(0,0,0,.08)}" +
      ".wrap.on-dark a.link{color:#1c1c20}" +
      ".wrap.on-dark a.link:hover{background:rgba(0,0,0,.07)}" +
      ".glyph{font-size:11px;font-weight:600;opacity:.85}" +
      ".label{font-weight:500;letter-spacing:.01em;white-space:nowrap}" +
      ".panel{position:absolute;bottom:calc(100% + 8px);" +
      side +
      ":0;min-width:200px;" +
      "border-radius:12px;border:1px solid;padding:6px;box-shadow:0 8px 30px rgba(0,0,0,.22);" +
      "backdrop-filter:blur(14px) saturate(1.4);-webkit-backdrop-filter:blur(14px) saturate(1.4);" +
      "opacity:0;transform:translateY(4px);pointer-events:none;transition:opacity .18s ease, transform .18s ease}" +
      ".wrap.open .panel{opacity:1;transform:none;pointer-events:auto}" +
      /* invisible bridge so the mouse can cross the gap to the panel */
      '.panel::after{content:"";position:absolute;top:100%;left:0;right:0;height:14px}' +
      "a.link{display:flex;align-items:center;gap:9px;padding:8px 10px;border-radius:8px;" +
      "text-decoration:none;font-size:12.5px;font-weight:500;transition:background .15s ease}" +
      "a.link svg{width:15px;height:15px;flex:none}" +
      ".who{display:flex;align-items:center;gap:10px;padding:9px 10px 8px}" +
      ".who img{width:34px;height:34px;border-radius:50%;object-fit:cover;flex:none;" +
      "border:1px solid rgba(128,128,128,.25)}" +
      ".who .nm{font-size:12.5px;font-weight:600;line-height:1.25}" +
      ".who .sub{font-size:10.5px;opacity:.55;margin-top:2px}" +
      "@media (prefers-reduced-motion: reduce){.badge,.panel,a.link{transition:none}}" +
      "@media (max-width:480px){.wrap{bottom:12px;" +
      side +
      ":12px}}";

    var wrap = document.createElement("div");
    wrap.className = "wrap " + (dark ? "on-dark" : "on-light");

    var badge = document.createElement("button");
    badge.className = "badge";
    badge.type = "button";
    badge.setAttribute("aria-haspopup", "true");
    badge.setAttribute("aria-expanded", "false");
    badge.setAttribute("aria-label", "Built by " + cfg.name + ", view links");
    badge.innerHTML =
      '<span class="glyph">&lt;/&gt;</span><span class="label">Built by ' +
      escapeHtml(cfg.name) +
      "</span>";

    var panel = document.createElement("div");
    panel.className = "panel";
    panel.setAttribute("role", "menu");

    var inner =
      '<div class="who">' +
      (cfg.avatar
        ? '<img src="' +
          escapeAttr(cfg.avatar) +
          '" alt="" loading="lazy" ' +
          'onerror="this.remove()">'
        : "") +
      '<div><div class="nm">' +
      escapeHtml(cfg.name) +
      "</div>" +
      '<div class="sub">Designed &amp; built by me</div></div></div>';
    if (cfg.github) {
      inner += link(
        cfg.github,
        "GitHub",
        '<svg viewBox="0 0 16 16" fill="currentColor" aria-hidden="true"><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27s1.36.09 2 .27c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8Z"/></svg>',
      );
    }
    if (cfg.site) {
      inner += link(
        cfg.site,
        "Portfolio",
        '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" aria-hidden="true"><circle cx="8" cy="8" r="6.3"/><path d="M1.7 8h12.6M8 1.7c1.8 1.7 2.7 3.9 2.7 6.3S9.8 12.6 8 14.3C6.2 12.6 5.3 10.4 5.3 8S6.2 3.4 8 1.7Z"/></svg>',
      );
    }
    panel.innerHTML = inner;

    function link(href, text, icon) {
      return (
        '<a class="link" role="menuitem" target="_blank" rel="noopener noreferrer" href="' +
        escapeAttr(href) +
        '">' +
        icon +
        "<span>" +
        text +
        "</span></a>"
      );
    }

    var closeTimer = null;
    function toggle(force) {
      var open = typeof force === "boolean" ? force : !wrap.classList.contains("open");
      wrap.classList.toggle("open", open);
      badge.setAttribute("aria-expanded", String(open));
    }

    badge.addEventListener("click", function () {
      toggle();
    });
    wrap.addEventListener("mouseenter", function () {
      clearTimeout(closeTimer);
      toggle(true);
    });
    wrap.addEventListener("mouseleave", function () {
      clearTimeout(closeTimer);
      closeTimer = setTimeout(function () {
        toggle(false);
      }, 300);
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") toggle(false);
    });
    document.addEventListener("click", function (e) {
      if (!host.contains(e.target)) toggle(false);
    });

    wrap.appendChild(panel);
    wrap.appendChild(badge);
    shadow.appendChild(style);
    shadow.appendChild(wrap);
    document.body.appendChild(host);
  }

  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  function escapeAttr(s) {
    return escapeHtml(s);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
