import { supabase } from '../supabase.js';

// Friend Request Functions
export const sendFriendRequest = async (fromUserId, toUserId) => {
  try {
    // Check if request already exists
    const { data: existingRequest } = await supabase
      .from('friend_requests')
      .select('*')
      .or(`and(sender_id.eq.${fromUserId},receiver_id.eq.${toUserId}),and(sender_id.eq.${toUserId},receiver_id.eq.${fromUserId})`)
      .eq('status', 'pending')
      .single();

    if (existingRequest) {
      throw new Error('Friend request already exists');
    }

    const { data, error } = await supabase
      .from('friend_requests')
      .insert({
        sender_id: fromUserId,
        receiver_id: toUserId,
        status: 'pending',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) throw error;
    return data.id;
  } catch (error) {
    console.error('Error sending friend request:', error);
    throw error;
  }
};

export const getFriendRequest = async (fromUserId, toUserId) => {
  try {
    const { data, error } = await supabase
      .from('friend_requests')
      .select('*')
      .or(`and(sender_id.eq.${fromUserId},receiver_id.eq.${toUserId}),and(sender_id.eq.${toUserId},receiver_id.eq.${fromUserId})`)
      .eq('status', 'pending')
      .single();

    return data;
  } catch (error) {
    console.error('Error getting friend request:', error);
    return null;
  }
};

export const acceptFriendRequest = async (requestId) => {
  try {
    const { error } = await supabase
      .from('friend_requests')
      .update({
        status: 'accepted',
        updated_at: new Date().toISOString(),
      })
      .eq('id', requestId);

    if (error) throw error;
  } catch (error) {
    console.error('Error accepting friend request:', error);
    throw error;
  }
};

export const rejectFriendRequest = async (requestId) => {
  try {
    const { error } = await supabase
      .from('friend_requests')
      .update({
        status: 'rejected',
        updated_at: new Date().toISOString(),
      })
      .eq('id', requestId);

    if (error) throw error;
  } catch (error) {
    console.error('Error rejecting friend request:', error);
    throw error;
  }
};

// Simplified functions for basic functionality
export const getPendingFriendRequests = async (userId) => {
  try {
    const { data, error } = await supabase
      .from('friend_requests')
      .select(`
        *,
        sender:users!friend_requests_sender_id_fkey(*),
        receiver:users!friend_requests_receiver_id_fkey(*)
      `)
      .eq('receiver_id', userId)
      .eq('status', 'pending');

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error getting pending friend requests:', error);
    return [];
  }
};

export const getSentFriendRequests = async (userId) => {
  try {
    const { data, error } = await supabase
      .from('friend_requests')
      .select(`
        *,
        sender:users!friend_requests_sender_id_fkey(*),
        receiver:users!friend_requests_receiver_id_fkey(*)
      `)
      .eq('sender_id', userId)
      .eq('status', 'pending');

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error getting sent friend requests:', error);
    return [];
  }
};

// Chat Functions (simplified)
export const createChat = async (participants) => {
  try {
    // Sort participants for consistent chat ID
    const sortedParticipants = participants.sort();
    const chatId = sortedParticipants.join('_');

    // Check if chat already exists
    const { data: existingChat } = await supabase
      .from('chats')
      .select('*')
      .eq('id', chatId)
      .single();

    if (!existingChat) {
      const { error } = await supabase
        .from('chats')
        .insert({
          id: chatId,
          participants: sortedParticipants,
          created_at: new Date().toISOString(),
        });

      if (error) throw error;
    }

    return chatId;
  } catch (error) {
    console.error('Error creating chat:', error);
    throw error;
  }
};

export const sendMessage = async (chatId, senderId, messageText, messageType = 'text') => {
  try {
    const { data, error } = await supabase
      .from('messages')
      .insert({
        chat_id: chatId,
        sender_id: senderId,
        text: messageText,
        type: messageType,
        timestamp: new Date().toISOString(),
        read_by: [senderId],
      })
      .select()
      .single();

    if (error) throw error;

    // Update chat's last message
    await supabase
      .from('chats')
      .update({
        last_message: messageText,
        last_message_time: new Date().toISOString(),
        last_message_sender: senderId,
      })
      .eq('id', chatId);

    return data.id;
  } catch (error) {
    console.error('Error sending message:', error);
    throw error;
  }
};

export const getChatMessages = async (chatId) => {
  try {
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .eq('chat_id', chatId)
      .order('timestamp', { ascending: true });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error getting chat messages:', error);
    return [];
  }
};

export const getUserChats = async (userId) => {
  try {
    const { data, error } = await supabase
      .from('chats')
      .select('*')
      .contains('participants', [userId])
      .order('last_message_time', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error getting user chats:', error);
    return [];
  }
};

// User search function
export const searchUsers = async (searchTerm, currentUserId, limitCount = 20) => {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .neq('uid', currentUserId)
      .or(`display_name.ilike.%${searchTerm}%,email.ilike.%${searchTerm}%`)
      .limit(limitCount);

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error searching users:', error);
    return [];
  }
};
