// Parse Instagram post / reel / tv URLs into an embeddable iframe URL.
// No API key needed — uses Instagram's public /embed endpoint.

const SHORTCODE = /instagram\.com\/(?:[^/]+\/)?(p|reel|reels|tv)\/([A-Za-z0-9_-]+)/i;

export interface InstagramRef {
  type: "p" | "reel" | "tv";
  shortcode: string;
  /** Canonical post URL */
  url: string;
  /** Iframe src for inline embedding */
  embedUrl: string;
}

export function parseInstagram(input: string): InstagramRef | null {
  if (!input) return null;
  const m = input.match(SHORTCODE);
  if (!m) return null;
  const rawType = m[1].toLowerCase();
  const type = rawType === "reels" ? "reel" : (rawType as "p" | "reel" | "tv");
  const shortcode = m[2];
  return {
    type,
    shortcode,
    url: `https://www.instagram.com/${type}/${shortcode}/`,
    embedUrl: `https://www.instagram.com/${type}/${shortcode}/embed`,
  };
}

export function isInstagramUrl(input: string): boolean {
  return SHORTCODE.test(input);
}
