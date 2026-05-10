// API Configuration for local and production (Vercel)
const isProd = import.meta.env.PROD
export const API_BASE = isProd ? '/api' : 'http://localhost:8000'
