export function isZodImportSource(source: string): boolean {
  return source === 'zod' || source.startsWith('zod/');
}
