import {
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  updateDoc,
  query,
  where,
  onSnapshot,
  deleteDoc,
  addDoc,
  orderBy,
  limit
} from 'firebase/firestore';
import { db } from '../firebase.js';

// Friend Request Functions
export const sendFriendRequest = async (fromUserId, toUserId) => {
  try {
    // Check if request already exists
    const existingRequest = await getFriendRequest(fromUserId, toUserId);
    if (existingRequest) {
      throw new Error('Friend request already exists');
    }

    const requestId = `${fromUserId}_${toUserId}`;
    await setDoc(doc(db, 'friendRequests', requestId), {
      fromUserId,
      toUserId,
      status: 'pending',
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return requestId;
  } catch (error) {
    console.error('Error sending friend request:', error);
    throw error;
  }
};

export const getFriendRequest = async (fromUserId, toUserId) => {
  try {
    const requestId = `${fromUserId}_${toUserId}`;
    const docSnap = await getDoc(doc(db, 'friendRequests', requestId));
    return docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } : null;
  } catch (error) {
    console.error('Error getting friend request:', error);
    throw error;
  }
};

export const acceptFriendRequest = async (requestId) => {
  try {
    const requestRef = doc(db, 'friendRequests', requestId);
    await updateDoc(requestRef, {
      status: 'accepted',
      updatedAt: new Date(),
    });

    // Add to friends collection
    const request = await getDoc(requestRef);
    if (request.exists()) {
      const { fromUserId, toUserId } = request.data();
      const friendshipId = [fromUserId, toUserId].sort().join('_');

      await setDoc(doc(db, 'friends', friendshipId), {
        users: [fromUserId, toUserId],
        createdAt: new Date(),
      });
    }
  } catch (error) {
    console.error('Error accepting friend request:', error);
    throw error;
  }
};

export const rejectFriendRequest = async (requestId) => {
  try {
    await updateDoc(doc(db, 'friendRequests', requestId), {
      status: 'rejected',
      updatedAt: new Date(),
    });
  } catch (error) {
    console.error('Error rejecting friend request:', error);
    throw error;
  }
};

export const getPendingFriendRequests = (userId, callback) => {
  const q = query(
    collection(db, 'friendRequests'),
    where('toUserId', '==', userId),
    where('status', '==', 'pending')
  );

  return onSnapshot(q, (querySnapshot) => {
    const requests = [];
    querySnapshot.forEach((doc) => {
      requests.push({ id: doc.id, ...doc.data() });
    });
    callback(requests);
  });
};

export const getSentFriendRequests = (userId, callback) => {
  const q = query(
    collection(db, 'friendRequests'),
    where('fromUserId', '==', userId),
    where('status', '==', 'pending')
  );

  return onSnapshot(q, (querySnapshot) => {
    const requests = [];
    querySnapshot.forEach((doc) => {
      requests.push({ id: doc.id, ...doc.data() });
    });
    callback(requests);
  });
};

export const getFriends = (userId, callback) => {
  const q = query(
    collection(db, 'friends'),
    where('users', 'array-contains', userId)
  );

  return onSnapshot(q, (querySnapshot) => {
    const friends = [];
    querySnapshot.forEach((doc) => {
      const friendship = doc.data();
      const friendId = friendship.users.find(id => id !== userId);
      friends.push(friendId);
    });
    callback(friends);
  });
};

// Chat Functions
export const createChat = async (participants) => {
  try {
    // Sort participants for consistent chat ID
    const sortedParticipants = participants.sort();
    const chatId = sortedParticipants.join('_');

    // Check if chat already exists
    const chatRef = doc(db, 'chats', chatId);
    const chatSnap = await getDoc(chatRef);

    if (!chatSnap.exists()) {
      await setDoc(chatRef, {
        participants: sortedParticipants,
        createdAt: new Date(),
        lastMessage: null,
        lastMessageTime: null,
      });
    }

    return chatId;
  } catch (error) {
    console.error('Error creating chat:', error);
    throw error;
  }
};

export const sendMessage = async (chatId, senderId, messageText, messageType = 'text') => {
  try {
    const messageData = {
      chatId,
      senderId,
      text: messageText,
      type: messageType,
      timestamp: new Date(),
      readBy: [senderId], // Mark as read by sender
    };

    const messageRef = await addDoc(collection(db, 'messages'), messageData);

    // Update chat's last message
    await updateDoc(doc(db, 'chats', chatId), {
      lastMessage: messageText,
      lastMessageTime: new Date(),
      lastMessageSender: senderId,
    });

    return messageRef.id;
  } catch (error) {
    console.error('Error sending message:', error);
    throw error;
  }
};

export const getChatMessages = (chatId, callback) => {
  const q = query(
    collection(db, 'messages'),
    where('chatId', '==', chatId),
    orderBy('timestamp', 'asc')
  );

  return onSnapshot(q, (querySnapshot) => {
    const messages = [];
    querySnapshot.forEach((doc) => {
      messages.push({ id: doc.id, ...doc.data() });
    });
    callback(messages);
  });
};

export const getUserChats = (userId, callback) => {
  const q = query(
    collection(db, 'chats'),
    where('participants', 'array-contains', userId),
    orderBy('lastMessageTime', 'desc')
  );

  return onSnapshot(q, (querySnapshot) => {
    const chats = [];
    querySnapshot.forEach((doc) => {
      chats.push({ id: doc.id, ...doc.data() });
    });
    callback(chats);
  });
};

export const markMessagesAsRead = async (chatId, userId) => {
  try {
    const q = query(
      collection(db, 'messages'),
      where('chatId', '==', chatId),
      where('readBy', 'not-in', [userId])
    );

    const querySnapshot = await getDocs(q);
    const updatePromises = [];

    querySnapshot.forEach((doc) => {
      const messageRef = doc.ref;
      const currentReadBy = doc.data().readBy || [];
      if (!currentReadBy.includes(userId)) {
        updatePromises.push(
          updateDoc(messageRef, {
            readBy: [...currentReadBy, userId],
          })
        );
      }
    });

    await Promise.all(updatePromises);
  } catch (error) {
    console.error('Error marking messages as read:', error);
    throw error;
  }
};

// Delete all messages from a chat
export const deleteChatMessages = async (chatId) => {
  try {
    const q = query(
      collection(db, 'messages'),
      where('chatId', '==', chatId)
    );

    const querySnapshot = await getDocs(q);
    const deletePromises = [];

    querySnapshot.forEach((doc) => {
      deletePromises.push(deleteDoc(doc.ref));
    });

    await Promise.all(deletePromises);

    // Update chat to reset last message
    const chatRef = doc(db, 'chats', chatId);
    await updateDoc(chatRef, {
      lastMessage: null,
      lastMessageTime: null,
      lastMessageSender: null,
    });

    return true;
  } catch (error) {
    console.error('Error deleting chat messages:', error);
    throw error;
  }
};

// Get message count for a chat
export const getChatMessageCount = async (chatId) => {
  try {
    const q = query(
      collection(db, 'messages'),
      where('chatId', '==', chatId)
    );

    const querySnapshot = await getDocs(q);
    return querySnapshot.size;
  } catch (error) {
    console.error('Error getting message count:', error);
    throw error;
  }
};

// User search function
export const searchUsers = async (searchTerm, currentUserId, limitCount = 20) => {
  try {
    // This is a simplified search - in production you'd want a more sophisticated search
    const usersRef = collection(db, 'users');
    const q = query(usersRef, limit(limitCount));
    const querySnapshot = await getDocs(q);

    const users = [];
    querySnapshot.forEach((doc) => {
      const userData = doc.data();
      // Simple search by display name or email
      if (
        doc.id !== currentUserId &&
        (userData.displayName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
         userData.email?.toLowerCase().includes(searchTerm.toLowerCase()))
      ) {
        users.push({ uid: doc.id, ...userData });
      }
    });

    return users;
  } catch (error) {
    console.error('Error searching users:', error);
    throw error;
  }
};
