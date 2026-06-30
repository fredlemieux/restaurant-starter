export function absoluteUrl(path: string, base = import.meta.env.PUBLIC_SITE_URL): string {
  const baseUrl = base.endsWith('/') ? base.slice(0, -1) : base;
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${baseUrl}${cleanPath}`;
}
