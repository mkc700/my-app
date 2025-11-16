import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import bcrypt from 'bcryptjs';

// Supabase configuration
const supabaseUrl = 'https://muxdxjxprausaltziyxo.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im11eGR4anhwcmF1c2FsdHppeXhvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMxNTI1MDYsImV4cCI6MjA3ODcyODUwNn0.4nFyeS0k0E61al8xS1UmWxWlDgkhgmr8cRZInCTEJ38'
// Initialize Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Storage bucket names
export const PROFILE_IMAGES_BUCKET = 'profile-images';

// Custom Auth helpers (using users table)
export const auth = {
  signIn: async ({ email, password }) => {
    // Query user by email
    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();

    if (error || !user) {
      return { data: null, error: { message: 'Invalid credentials' } };
    }

    // Check password
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return { data: null, error: { message: 'Invalid credentials' } };
    }

    // Store user id in AsyncStorage
    await AsyncStorage.setItem('userId', user.uid);

    // Return user without password
    const { password: _, ...userWithoutPassword } = user;
    return { data: { user: userWithoutPassword }, error: null };
  },

  signUp: async ({ email, password, ...userData }) => {
    // Check if user already exists
    const { data: existingUser } = await supabase
      .from('users')
      .select('uid')
      .eq('email', email)
      .single();

    if (existingUser) {
      return { data: null, error: { message: 'User already exists' } };
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate uid
    const uid = Date.now().toString() + Math.random().toString(36).substr(2, 9);

    // Insert user
    const { data, error } = await supabase
      .from('users')
      .insert({
        uid,
        email,
        password: hashedPassword,
        ...userData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      return { data: null, error };
    }

    // Store user id
    await AsyncStorage.setItem('userId', uid);

    // Return user without password
    const { password: _, ...userWithoutPassword } = data;
    return { data: { user: userWithoutPassword }, error: null };
  },

  signOut: async () => {
    await AsyncStorage.removeItem('userId');
    return { error: null };
  },

  getCurrentUser: async () => {
    const userId = await AsyncStorage.getItem('userId');
    if (!userId) {
      return { user: null, error: null };
    }

    const { data: user, error } = await supabase
      .from('users')
      .select('uid, email, displayName, bio, age, work, school, location, photos, interests, createdAt, updatedAt')
      .eq('uid', userId)
      .single();

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
  getUsers: async (limit = 50, offset = 0) => {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .range(offset, offset + limit - 1);
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
