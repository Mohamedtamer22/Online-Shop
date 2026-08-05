export const API_BASE_URL = `${window.location.protocol}//${window.location.hostname}:8080`;

export function assetImagePath(value?: string): string {
  if (!value) return 'assets/images/ntg-logo.png';
  if (value.startsWith('http') || value.startsWith('assets/')) return value;
  return `assets/images/${value}`;
}
