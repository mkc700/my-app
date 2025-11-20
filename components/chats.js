import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, FlatList, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { useUser } from './UserContext';
import { getUserChats } from './FriendService';
import { supabase } from '../supabase.js';

const DEFAULT_PROFILE_IMAGE = 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400';

export default function ChatsScreen() {
  const navigation = useNavigation();
  const { user } = useUser();
  const [friends, setFriends] = useState([]);
  const [chats, setChats] = useState([]);

  useEffect(() => {
    if (!user) return;

    const loadData = async () => {
      try {
        // Load chats first
        const chatsData = await getUserChats(user.uid);
        setChats(chatsData);

        // Get unique friend IDs from chats
        const friendIds = new Set();
        chatsData.forEach(chat => {
          chat.participants.forEach(participant => {
            if (participant !== user.uid) {
              friendIds.add(participant);
            }
          });
        });

        // Load friend details
        if (friendIds.size > 0) {
          const { data: friendsData, error } = await supabase
            .from('users')
            .select('*')
            .in('uid', Array.from(friendIds));

          if (!error && friendsData) {
            setFriends(friendsData);
          }
        }
      } catch (error) {
        console.error('Error loading data:', error);
      }
    };

    loadData();

    const channel = supabase
      .channel(`chats-${user.uid}`)
      .on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: 'chats',
        filter: `participants=cs.{"${user.uid}"}`,
      }, () => loadData())
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'chats',
        filter: `participants=cs.{"${user.uid}"}`,
      }, () => loadData())
      .on('postgres_changes', {
        event: 'DELETE',
        schema: 'public',
        table: 'chats',
        filter: `participants=cs.{"${user.uid}"}`,
      }, () => loadData())
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, [user]);

  const handleChatPress = (friend) => {
    // Create or get existing chat
    const participants = [user.uid, friend.uid].sort();
    const chatId = participants.join('_');
    navigation.navigate('ChatConversacion', {
      chatId,
      friendName: friend.displayName || 'Usuario',
      friendId: friend.uid,
      friendAvatar: friend.photos?.[0] || DEFAULT_PROFILE_IMAGE,
    });
  };

  const handleProfilePress = (friend) => {
    navigation.navigate('ChatPerfil', {
      userId: friend.uid,
      name: friend.displayName || 'Usuario',
      photos: friend.photos || [],
      bio: friend.bio || '',
      carrera: friend.carrera || 'No especificada',
      semestre: friend.semestre || 'N/A'
    });
  };

  const renderFriend = ({ item }) => {
    // Find the chat for this friend
    const chatId = [user.uid, item.uid].sort().join('_');
    const chat = chats.find(c => c.id === chatId);

    const lastMessage = chat?.last_message || 'Toca para chatear';
    const lastMessageTime = chat?.last_message_time ? new Date(chat.last_message_time) : null;

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

  return (
    <LinearGradient colors={['#ff5f6d', '#ffc371']} style={styles.gradient}>
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
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  container: { 
    flex: 1, 
    paddingTop: 50,
    paddingHorizontal: 18,
    paddingBottom: 24,
  },
  title: { 
    fontSize: 26, 
    fontWeight: '700', 
    marginBottom: 16, 
    color: '#fff',
    letterSpacing: 0.4,
  },
  chatRow: {
    flexDirection: 'row',
    padding: 12,
    borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.18)',
    marginBottom: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.25)'
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
    fontWeight: '700',
    flex: 1,
    color: '#fff'
  },
  time: {
    fontSize: 12,
    color: '#ffeef3',
    marginLeft: 8,
  },
  last: {
    color: '#ffe6ef',
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
    fontSize: 20,
    fontWeight: '700',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 16,
    color: '#ffeef3',
    textAlign: 'center',
    lineHeight: 22,
  },
});
