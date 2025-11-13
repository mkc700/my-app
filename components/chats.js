import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, FlatList, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useUser } from './UserContext';
import { getFriends, getUserChats } from './FriendService';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../firebase.js';

const DEFAULT_PROFILE_IMAGE = 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400';

export default function ChatsScreen() {
  const navigation = useNavigation();
  const { user } = useUser();
  const [friends, setFriends] = useState([]);
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    // Load friends
    const unsubscribeFriends = getFriends(user.uid, async (friendIds) => {
      if (friendIds.length === 0) {
        setFriends([]);
        setLoading(false);
        return;
      }

      // Load friend details
      try {
        const friendsData = [];
        for (const friendId of friendIds) {
          const usersRef = collection(db, 'users');
          const q = query(usersRef, where('__name__', '==', friendId));
          const querySnapshot = await getDocs(q);

          querySnapshot.forEach((doc) => {
            friendsData.push({ uid: doc.id, ...doc.data() });
          });
        }
        setFriends(friendsData);
      } catch (error) {
        console.error('Error loading friends:', error);
      }
    });

    // Load chats
    const unsubscribeChats = getUserChats(user.uid, (chatsData) => {
      setChats(chatsData);
      setLoading(false);
    });

    return () => {
      unsubscribeFriends();
      unsubscribeChats();
    };
  }, [user]);

  const handleChatPress = (friend) => {
    // Create or get existing chat
    const participants = [user.uid, friend.uid].sort();
    const chatId = participants.join('_');
    navigation.navigate('ChatConversacion', {
      chatId,
      friendName: friend.displayName || 'Usuario',
      friendId: friend.uid
    });
  };

  const handleProfilePress = (friend) => {
    navigation.navigate('ChatPerfil', {
      userId: friend.uid,
      name: friend.displayName || 'Usuario'
    });
  };

  const renderFriend = ({ item }) => {
    // Find the chat for this friend
    const chatId = [user.uid, item.uid].sort().join('_');
    const chat = chats.find(c => c.id === chatId);

    const lastMessage = chat?.lastMessage || 'Toca para chatear';
    const lastMessageTime = chat?.lastMessageTime?.toDate();

    const formatTime = (date) => {
      if (!date) return '';
      const now = new Date();
      const diff = now - date;
      const minutes = Math.floor(diff / 60000);
      const hours = Math.floor(diff / 3600000);
      const days = Math.floor(diff / 86400000);

      if (days > 0) return `${days}d`;
      if (hours > 0) return `${hours}h`;
      if (minutes > 0) return `${minutes}m`;
      return 'ahora';
    };

    return (
      <TouchableOpacity
        style={styles.chatRow}
        onPress={() => handleChatPress(item)}
      >
        <TouchableOpacity
          style={styles.avatarContainer}
          onPress={() => handleProfilePress(item)}
        >
          <Image
            source={{ uri: item.photos?.[0] || DEFAULT_PROFILE_IMAGE }}
            style={styles.avatar}
          />
        </TouchableOpacity>
        <View style={styles.chatInfo}>
          <View style={styles.nameRow}>
            <Text style={styles.name} numberOfLines={1}>
              {item.displayName || 'Usuario'}
            </Text>
            {lastMessageTime && (
              <Text style={styles.time}>
                {formatTime(lastMessageTime)}
              </Text>
            )}
          </View>
          <Text style={styles.last} numberOfLines={1}>
            {lastMessage}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#ff4458" />
        <Text style={{ marginTop: 16, color: '#666' }}>Cargando amigos...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Chats</Text>
      {friends.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No tienes amigos aún</Text>
          <Text style={styles.emptySubtext}>
            Ve al inicio y desliza a la derecha en perfiles que te gusten para enviar solicitudes de amistad
          </Text>
        </View>
      ) : (
        <FlatList
          data={friends}
          keyExtractor={(item) => item.uid}
          renderItem={renderFriend}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#fff', 
    padding: 16 
  },
  title: { 
    fontSize: 22, 
    fontWeight: '700', 
    marginBottom: 12, 
    color: '#333' 
  },
  chatRow: {
    flexDirection: 'row',
    padding: 12,
    borderRadius: 10,
    backgroundColor: '#f6f7fb',
    marginBottom: 10,
    alignItems: 'center',
  },
  avatarContainer: {
    marginRight: 12,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  chatInfo: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
  },
  time: {
    fontSize: 12,
    color: '#666',
    marginLeft: 8,
  },
  last: {
    color: '#666',
    marginTop: 4,
    fontSize: 14,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 22,
  },
});
