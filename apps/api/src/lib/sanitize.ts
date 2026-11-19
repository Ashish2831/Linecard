export function sanitizeString(input: string | undefined, maxLen = 2000): string {
  if (!input) return '';
  return input.trim().replace(/[<>]/g, '').slice(0, maxLen);
}

export function sanitizeEmail(input: string): string {
  return sanitizeString(input, 320).toLowerCase();
}
