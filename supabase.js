import { createClient } from '@supabase/supabase-js';

// Supabase configuration
const supabaseUrl = 'https://muxdxjxprausaltziyxo.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im11eGR4anhwcmF1c2FsdHppeXhvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMxNTI1MDYsImV4cCI6MjA3ODcyODUwNn0.4nFyeS0k0E61al8xS1UmWxWlDgkhgmr8cRZInCTEJ38'
// Initialize Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Storage bucket names
export const PROFILE_IMAGES_BUCKET = 'profile-images';

// Auth helpers
export const auth = {
  signIn: async ({ email, password }) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { data, error };
  },

  signUp: async ({ email, password }) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });
    return { data, error };
  },

  signOut: async () => {
    const { error } = await supabase.auth.signOut();
    return { error };
  },

  onAuthStateChange: (callback) => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(callback);
    return {
      data: { subscription },
      unsubscribe: () => subscription.unsubscribe()
    };
  },

  getCurrentUser: async () => {
    const { data: { user }, error } = await supabase.auth.getUser();
    return { user, error };
  },
};

// Database helpers
export const db = {
  // Users collection operations
  getUser: async (userId) => {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('uid', userId)
      .single();
    return { data, error };
  },

  setUser: async (userId, userData) => {
    const { data, error } = await supabase
      .from('users')
      .upsert({ uid: userId, ...userData })
      .select();
    return { data, error };
  },

  updateUser: async (userId, updates) => {
    const { data, error } = await supabase
      .from('users')
      .update(updates)
      .eq('uid', userId)
      .select();
    return { data, error };
  },

  // Friends operations
  getUsers: async (limit = 50) => {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .limit(limit);
    return { data, error };
  },

  // Friend requests
  getFriendRequests: async (userId) => {
    const { data, error } = await supabase
      .from('friend_requests')
      .select(`
        *,
        sender:users!friend_requests_sender_id_fkey(*),
        receiver:users!friend_requests_receiver_id_fkey(*)
      `)
      .or(`sender_id.eq.${userId},receiver_id.eq.${userId}`)
      .eq('status', 'pending');
    return { data, error };
  },

  // Chats
  getUserChats: async (userId) => {
    const { data, error } = await supabase
      .from('chats')
      .select(`
        *,
        participants:chat_participants(
          user:users(*)
        )
      `)
      .eq('chat_participants.user_id', userId);
    return { data, error };
  },
};
