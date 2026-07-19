/**
 * Dependency-free HTML sanitizer for rich-text content.
 *
 * Uses an allowlist of tags/attributes and strips everything else, including
 * script/style/iframe elements, event handlers, and javascript: URLs. Intended
 * for the limited markup produced by RichTextEditor; not a general-purpose
 * replacement for a full sanitizer library.
 *
 * Usage:
 *   import { sanitizeHtml } from "@/src/lib/sanitize-html";
 *   <div dangerouslySetInnerHTML={{ __html: sanitizeHtml(untrusted) }} />
 */

const ALLOWED_TAGS = new Set([
  "p",
  "div",
  "br",
  "b",
  "strong",
  "i",
  "em",
  "u",
  "s",
  "ul",
  "ol",
  "li",
  "a",
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
  "span",
  "blockquote",
]);

const ALLOWED_TEXT_ALIGN = new Set(["left", "center", "right", "justify"]);

function isSafeHref(href: string): boolean {
  const value = href.trim().toLowerCase();
  return (
    value.startsWith("http://") ||
    value.startsWith("https://") ||
    value.startsWith("mailto:") ||
    value.startsWith("/") ||
    value.startsWith("#")
  );
}

function sanitizeElement(el: Element): void {
  // Copy attribute list first – removing while iterating skips entries.
  for (const attr of [...el.attributes]) {
    const name = attr.name.toLowerCase();

    if (name === "href" && el.tagName.toLowerCase() === "a" && isSafeHref(attr.value)) {
      el.setAttribute("rel", "noopener noreferrer");
      continue;
    }

    if (name === "style") {
      // Only text-align survives (produced by editor justify buttons).
      const match = /text-align:\s*(left|center|right|justify)/i.exec(attr.value);
      if (match && ALLOWED_TEXT_ALIGN.has(match[1].toLowerCase())) {
        el.setAttribute("style", `text-align: ${match[1].toLowerCase()}`);
        continue;
      }
    }

    if (name === "rel") continue;

    el.removeAttribute(attr.name);
  }
}

/**
 * Sanitize an untrusted HTML string, keeping only allowlisted tags/attributes.
 * Returns an empty string on the server (no DOM available) unless the input
 * is empty/plain – callers render sanitized HTML client-side.
 */
export function sanitizeHtml(html: string): string {
  if (!html) return "";
  if (typeof window === "undefined" || typeof DOMParser === "undefined") {
    // Server-side: strip all tags as a conservative fallback.
    return html.replace(/<[^>]*>/g, "");
  }

  const doc = new DOMParser().parseFromString(html, "text/html");

  const walk = (node: Node): void => {
    for (const child of [...node.childNodes]) {
      if (child.nodeType === Node.ELEMENT_NODE) {
        const el = child as Element;
        const tag = el.tagName.toLowerCase();

        if (!ALLOWED_TAGS.has(tag)) {
          // Dangerous containers are removed entirely; unknown wrappers are
          // unwrapped so their (sanitized) children survive.
          if (["script", "style", "iframe", "object", "embed", "link", "meta"].includes(tag)) {
            el.remove();
          } else {
            // Sanitize the subtree first, then unwrap so the clean children survive.
            walk(el);
            const parent = el.parentNode;
            while (el.firstChild) parent?.insertBefore(el.firstChild, el);
            el.remove();
          }
          continue;
        }

        sanitizeElement(el);
        walk(el);
      } else if (child.nodeType === Node.COMMENT_NODE) {
        child.remove();
      }
    }
  };

  walk(doc.body);
  return doc.body.innerHTML;
}

export default sanitizeHtml;
