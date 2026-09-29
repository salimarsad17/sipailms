/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface VideoEmbedResult {
  type: "youtube" | "googledrive" | "direct" | "generic";
  embedUrl: string;
}

export function getEmbedInfo(url?: string): VideoEmbedResult {
  if (!url) return { type: "generic", embedUrl: "" };
  const cleanUrl = url.trim();

  // YouTube Matchers (standard, short, embed)
  const ytMatch = cleanUrl.match(
    /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/
  );
  if (ytMatch && ytMatch[1]) {
    return {
      type: "youtube",
      embedUrl: `https://www.youtube.com/embed/${ytMatch[1]}?rel=0`
    };
  }

  // Google Drive
  const gdMatch = cleanUrl.match(/drive\.google\.com\/(?:file\/d\/|open\?id=)([\w-]+)/);
  if (gdMatch && gdMatch[1]) {
    return {
      type: "googledrive",
      embedUrl: `https://drive.google.com/file/d/${gdMatch[1]}/preview`
    };
  }

  // Direct video files (MP4, WebM, Ogg, Mov, or Data URL)
  if (/\.(mp4|webm|ogg|mov)(?:\?|$)/i.test(cleanUrl) || cleanUrl.startsWith("data:video")) {
    return {
      type: "direct",
      embedUrl: cleanUrl
    };
  }

  return {
    type: "generic",
    embedUrl: cleanUrl
  };
}
