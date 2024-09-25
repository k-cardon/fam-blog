export function getBaseUrl() {
  const url = process.env.VERCEL_URL 
    ? `https://${process.env.VERCEL_URL}` 
    : process.env.NODE_ENV === 'development'
    ? 'http://localhost:3000'
    : '';
  console.log('Base URL:', url);
  return url;
}