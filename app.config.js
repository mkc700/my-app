const dotenv = require('dotenv');
dotenv.config();

module.exports = ({ config }) => {
  const existingExtra = (config && config.extra) || {};

  const SUPABASE_URL =
    process.env.SUPABASE_URL ||
    process.env.EXPO_PUBLIC_SUPABASE_URL ||
    process.env.REACT_APP_SUPABASE_URL ||
    existingExtra.supabaseUrl ||
    existingExtra.SUPABASE_URL ||
    existingExtra.EXPO_PUBLIC_SUPABASE_URL ||
    existingExtra.REACT_APP_SUPABASE_URL;

  const SUPABASE_ANON_KEY =
    process.env.SUPABASE_ANON_KEY ||
    process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ||
    process.env.REACT_APP_SUPABASE_ANON_KEY ||
    existingExtra.supabaseAnonKey ||
    existingExtra.SUPABASE_ANON_KEY ||
    existingExtra.EXPO_PUBLIC_SUPABASE_ANON_KEY ||
    existingExtra.REACT_APP_SUPABASE_ANON_KEY;

  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    console.warn('Warning: Supabase keys not found in environment. Make sure to create a .env or set build-time variables.');
  }

  return {
    ...config,
    extra: {
      ...existingExtra,
      supabaseUrl: SUPABASE_URL,
      supabaseAnonKey: SUPABASE_ANON_KEY,
    },
  };
};
