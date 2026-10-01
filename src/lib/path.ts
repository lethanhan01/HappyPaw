export function parsePath(path: string) {
  const [p, q = ''] = path.split('?')
  return {
    seg: p.split('/').filter(Boolean),
    query: Object.fromEntries(new URLSearchParams(q)) as Record<string, string>,
  }
}
