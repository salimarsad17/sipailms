/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface VideoEmbedResult {
  type: "youtube" | "googledrive" | "vimeo" | "direct" | "generic";
  embedUrl: string;
  watchUrl: string;
  isPlaceholder?: boolean;
}

const PLACEHOLDER_YOUTUBE_IDS = new Set(["dQw4w9WgXcQ"]);

// Verified, active, embeddable Indonesian PAI SMP YouTube videos (Kelas 7, 8, & 9)
export const VERIFIED_PAI_YOUTUBE_VIDEOS: Record<string, string> = {
  "vid-1": "https://www.youtube.com/watch?v=dRp5ZKC9jU8", // Kelas 7 - Thaharah (Najis & Hadas)
  "vid-2": "https://www.youtube.com/watch?v=7zYAxgLHO6o", // Kelas 7 - Asmaul Husna
  "vid-3": "https://www.youtube.com/watch?v=SLti0Qv_UGQ", // Kelas 8 - Shalat Gerhana & Istisqa
  "vid-4": "https://www.youtube.com/watch?v=CYoT8DvjIBU", // Kelas 8 - Menghindari Khamr, Judi & Pertengkaran
  "vid-5": "https://www.youtube.com/watch?v=fWxTcc3jtG8", // Kelas 9 - Meyakini Hari Akhir
  "vid-6": "https://www.youtube.com/watch?v=FvS-Hyh8mjI"  // Kelas 9 - Akikah, Kurban & Penyembelihan Hewan
};

export function getDefaultPaiYoutubeUrl(kelas?: string, topicText = ""): string {
  const lower = topicText.toLowerCase();
  if (lower.includes("qurban") || lower.includes("kurban") || lower.includes("aqiqah") || lower.includes("akikah") || lower.includes("sembelih")) {
    return VERIFIED_PAI_YOUTUBE_VIDEOS["vid-6"];
  }
  if (lower.includes("hari akhir") || lower.includes("kiamat") || lower.includes("mizan")) {
    return VERIFIED_PAI_YOUTUBE_VIDEOS["vid-5"];
  }
  if (lower.includes("khamr") || lower.includes("minuman keras") || lower.includes("judi") || lower.includes("pertengkaran")) {
    return VERIFIED_PAI_YOUTUBE_VIDEOS["vid-4"];
  }
  if (lower.includes("gerhana") || lower.includes("istisqa") || lower.includes("kusuf") || lower.includes("khusuf")) {
    return VERIFIED_PAI_YOUTUBE_VIDEOS["vid-3"];
  }
  if (lower.includes("asmaul") || lower.includes("alim") || lower.includes("khabir") || lower.includes("bashir")) {
    return VERIFIED_PAI_YOUTUBE_VIDEOS["vid-2"];
  }
  if (lower.includes("thaharah") || lower.includes("taharah") || lower.includes("najis") || lower.includes("hadas") || lower.includes("bersuci")) {
    return VERIFIED_PAI_YOUTUBE_VIDEOS["vid-1"];
  }

  if (kelas === "9") return VERIFIED_PAI_YOUTUBE_VIDEOS["vid-6"];
  if (kelas === "8") return VERIFIED_PAI_YOUTUBE_VIDEOS["vid-3"];
  return VERIFIED_PAI_YOUTUBE_VIDEOS["vid-1"];
}

export function extractYouTubeId(url: string): string | null {
  const cleanUrl = url.trim();
  const patterns = [
    /(?:youtu\.be\/)([\w-]{11})/,
    /(?:youtube\.com|youtube-nocookie\.com)\/(?:embed|shorts|live|v)\/([\w-]{11})/,
    /(?:youtube\.com|m\.youtube\.com)\/watch\?(?:.*&)?v=([\w-]{11})/
  ];
  for (const pattern of patterns) {
    const match = cleanUrl.match(pattern);
    if (match && match[1]) return match[1];
  }
  return null;
}

export function isDirectVideoUrl(url: string): boolean {
  const cleanUrl = url.trim().toLowerCase();
  return (
    cleanUrl.startsWith("data:video") ||
    cleanUrl.startsWith("blob:") ||
    cleanUrl.startsWith("idb://") ||
    /\.(mp4|webm|ogg|mov|m4v)(\?.*|#.*)?$/i.test(cleanUrl)
  );
}

export function isPlaceholderVideoUrl(url?: string): boolean {
  if (!url) return true;
  const clean = url.trim();
  if (!clean || clean === "#") return true;
  const ytId = extractYouTubeId(clean);
  if (ytId && PLACEHOLDER_YOUTUBE_IDS.has(ytId)) return true;
  return false;
}

export function getEmbedInfo(url?: string, autoplay = false): VideoEmbedResult {
  if (!url) {
    return { type: "generic", embedUrl: "", watchUrl: "", isPlaceholder: true };
  }

  let cleanUrl = url.trim();
  if (!cleanUrl || cleanUrl === "#") {
    return { type: "generic", embedUrl: "", watchUrl: "", isPlaceholder: true };
  }

  if (isDirectVideoUrl(cleanUrl)) {
    return {
      type: "direct",
      embedUrl: cleanUrl,
      watchUrl: cleanUrl,
      isPlaceholder: false
    };
  }

  if (
    !cleanUrl.startsWith("http://") &&
    !cleanUrl.startsWith("https://") &&
    (cleanUrl.includes("youtu") || cleanUrl.includes("drive.google") || cleanUrl.includes("vimeo"))
  ) {
    cleanUrl = `https://${cleanUrl}`;
  }

  // YouTube
  const ytId = extractYouTubeId(cleanUrl);
  if (ytId) {
    const isPlaceholder = PLACEHOLDER_YOUTUBE_IDS.has(ytId);
    const params = new URLSearchParams({
      rel: "0",
      playsinline: "1",
      modestbranding: "1",
      enablejsapi: "1"
    });
    if (autoplay) params.set("autoplay", "1");
    return {
      type: "youtube",
      embedUrl: `https://www.youtube.com/embed/${ytId}?${params.toString()}`,
      watchUrl: `https://www.youtube.com/watch?v=${ytId}`,
      isPlaceholder
    };
  }

  // Google Drive
  const gdMatch = cleanUrl.match(/drive\.google\.com\/(?:file\/d\/|open\?id=|uc\?id=)([\w-]+)/);
  if (gdMatch && gdMatch[1]) {
    return {
      type: "googledrive",
      embedUrl: `https://drive.google.com/file/d/${gdMatch[1]}/preview`,
      watchUrl: `https://drive.google.com/file/d/${gdMatch[1]}/view`,
      isPlaceholder: false
    };
  }

  // Vimeo
  const vimeoMatch = cleanUrl.match(/(?:player\.)?vimeo\.com\/(?:video\/)?(\d+)/);
  if (vimeoMatch && vimeoMatch[1]) {
    return {
      type: "vimeo",
      embedUrl: `https://player.vimeo.com/video/${vimeoMatch[1]}${autoplay ? "?autoplay=1" : ""}`,
      watchUrl: `https://vimeo.com/${vimeoMatch[1]}`,
      isPlaceholder: false
    };
  }

  return {
    type: "generic",
    embedUrl: cleanUrl,
    watchUrl: cleanUrl,
    isPlaceholder: false
  };
}
