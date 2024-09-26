export function getBaseUrl() {
  if (typeof window !== 'undefined') return ''; 
  if (process.env.VERCEL_URL) return `https://nodracs.vercel.app/`; 
  return 'http://localhost:3000'; 
}