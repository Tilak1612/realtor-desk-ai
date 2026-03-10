export const config = {
  supabaseUrl: import.meta.env.VITE_SUPABASE_URL as string,
  supabaseKey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string,
};

if (!config.supabaseUrl || !config.supabaseKey) {
  console.error('Missing Supabase environment variables. Check your .env file or Vercel environment settings.');
}
