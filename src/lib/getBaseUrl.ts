export function getBaseUrl() {
  if (typeof window !== 'undefined') return ''; 
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`; 
  return 'https://nodracs.vercel.app'; 
}