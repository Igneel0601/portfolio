// Extensions for files that don't vary by User-Agent. Single source of truth
// used by both proxy.ts (skip UA rewriting) and next.config.ts (skip the
// Vary: User-Agent header). Keep these in sync — adding to one without the
// other causes CDN cache fragmentation or cross-shell serving.

export const STATIC_EXTENSIONS = [
  "png", "jpg", "jpeg", "webp", "avif", "gif", "svg", "ico", "bmp", "tif", "tiff",
  "css", "js", "mjs", "map", "woff", "woff2", "ttf", "otf", "eot",
  "txt", "xml", "json", "pdf",
  "mp4", "webm", "mov", "mp3", "ogg", "wav", "zip",
] as const;

// Pipe-joined for embedding inside larger regex patterns (e.g. negative
// lookaheads in next.config.ts header source: strings).
export const STATIC_EXTENSIONS_PATTERN = STATIC_EXTENSIONS.join("|");

// Standalone matcher: true when pathname ends in one of the listed extensions.
export const STATIC_EXTENSIONS_RE = new RegExp(
  `\\.(?:${STATIC_EXTENSIONS_PATTERN})$`,
  "i",
);
