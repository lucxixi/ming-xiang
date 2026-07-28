const mediaBaseUrl = (import.meta.env.VITE_MEDIA_BASE_URL || '').replace(/\/+$/, '');

export function mediaUrl(path: string) {
  if (!mediaBaseUrl) return path;
  return `${mediaBaseUrl}${path.startsWith('/') ? path : `/${path}`}`;
}

