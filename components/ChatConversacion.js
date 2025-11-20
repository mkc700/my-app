import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { GiftedChat, Send, InputToolbar } from 'react-native-gifted-chat';
import { useRoute, useNavigation } from '@react-navigation/native';
import { useUser } from './UserContext';
import { sendMessage, getChatMessages, createChat, deleteChatMessages, getChatMessageCount } from './FriendService';
import { supabase } from '../supabase.js';

const DEFAULT_PROFILE_IMAGE = 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400';

export default function ChatConversacion() {
  const route = useRoute();
  const navigation = useNavigation();
  const { user } = useUser();
  const { chatId, friendName, friendId, friendAvatar } = route.params;

  const [messages, setMessages] = useState([]);
  const [messageCount, setMessageCount] = useState(0);

  useEffect(() => {
    if (!user || !chatId) return;
    const userAvatar = user?.photos?.[0] || DEFAULT_PROFILE_IMAGE;
    const targetAvatar = friendAvatar || DEFAULT_PROFILE_IMAGE;

    // Create chat if it doesn't exist
    const loadMessages = async () => {
      try {
        await createChat([user.uid, friendId]);
        // Load existing messages
        const messagesData = await getChatMessages(chatId);
        const messageCountData = await getChatMessageCount(chatId);

        // Convert Supabase messages to GiftedChat format
        const giftedChatMessages = messagesData.map(msg => ({
          _id: msg.id,
          text: msg.text,
          createdAt: new Date(msg.timestamp),
          user: {
            _id: msg.sender_id,
            name: msg.sender_id === user.uid ? 'Tú' : friendName,
            avatar: msg.sender_id === user.uid ? userAvatar : targetAvatar,
          },
        }));

        // Sort messages by timestamp (most recent first for GiftedChat)
        giftedChatMessages.sort((a, b) => b.createdAt - a.createdAt);

        setMessages(giftedChatMessages);
        setMessageCount(messageCountData);
      } catch (error) {
        console.error('Error initializing chat:', error);
      }
    };

    loadMessages();

    // Setup real-time listener for new messages
    const channel = supabase
      .channel(`messages-${chatId}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
        filter: `chat_id=eq.${chatId}`,
      }, loadMessages)
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, [user, chatId, friendName, friendId, friendAvatar]);

  const onSend = useCallback(async (messagesToSend = []) => {
    if (!user || messagesToSend.length === 0) return;

    const message = messagesToSend[0];

    try {
      // Send message to Firebase
      await sendMessage(chatId, user.uid, message.text);

      // Add message to local state immediately for better UX
      setMessages(previousMessages =>
        GiftedChat.append(previousMessages, messagesToSend)
      );
    } catch (error) {
      console.error('Error sending message:', error);
      // You could show an error alert here
    }
  }, [user, chatId]);

  const renderSend = (props) => {
    return (
      <Send {...props}>
        <View style={styles.sendButton}>
          <View style={styles.sendIcon} />
        </View>
      </Send>
    );
  };

  const renderInputToolbar = (props) => {
    return (
      <InputToolbar
        {...props}
        containerStyle={styles.inputToolbar}
        primaryStyle={styles.inputPrimary}
      />
    );
  };

  const handleDeleteChat = async () => {
    Alert.alert(
      'Eliminar conversación',
      `¿Estás seguro de que deseas eliminar todos los mensajes? (${messageCount} mensajes)\n\nEsta acción no se puede deshacer.`,
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteChatMessages(chatId);
              Alert.alert('Éxito', 'La conversación ha sido eliminada.');
            } catch (error) {
              console.error('Error deleting chat:', error);
              Alert.alert('Error', 'No se pudo eliminar la conversación.');
            }
          },
        },
      ]
    );
  };

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: friendName || 'Chat',
      headerRight: () => (
        <TouchableOpacity
          onPress={handleDeleteChat}
          style={styles.deleteButton}
          disabled={messageCount === 0}
        >
          <Text style={[styles.deleteButtonText, messageCount === 0 && styles.deleteButtonDisabled]}>
            🗑️ Eliminar ({messageCount})
          </Text>
        </TouchableOpacity>
      ),
    });
  }, [navigation, messageCount, friendName]);

  if (!user) {
    return <View style={styles.container} />;
  }

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <GiftedChat
        messages={messages}
        onSend={onSend}
        user={{
          _id: user.uid,
          name: 'Tú',
          avatar: user?.photos?.[0] || DEFAULT_PROFILE_IMAGE,
        }}
        placeholder="Escribe un mensaje..."
        showAvatarForEveryMessage
        renderAvatarOnTop
        renderSend={renderSend}
        renderInputToolbar={renderInputToolbar}
        messagesContainerStyle={styles.messagesContainer}
        textInputStyle={styles.textInput}
        scrollToBottomStyle={styles.scrollToBottom}
        alwaysShowSend
        renderUsernameOnMessage={false}
        // Custom styling
        textStyle={{
          right: { color: '#fff' },
          left: { color: '#333' },
        }}
        wrapperStyle={{
          right: { backgroundColor: '#ff4458' },
          left: { backgroundColor: '#f0f0f0' },
        }}
        bottomOffset={10}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
   backgroundColor: '#fff',

  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#ff4458',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,

  },
  sendIcon: {
    width: 0,
    height: 0,
    borderLeftWidth: 12,
    borderRightWidth: 0,
    borderTopWidth: 8,
    borderBottomWidth: 8,
    borderLeftColor: '#fff',
    borderTopColor: 'transparent',
    borderBottomColor: 'transparent',
    marginLeft: 2,
  },
  inputToolbar: {
    backgroundColor: '#fff',
    borderTopColor: '#e1e2e6',
    borderTopWidth: 1,
    paddingHorizontal: 8,
   
  },
  inputPrimary: {
    alignItems: 'center',
  },
  messagesContainer: {
    backgroundColor: '#fff',
  },
  textInput: {
    backgroundColor: '#f8f9fb',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#e6e9ee',
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginHorizontal: 8,
  },
  scrollToBottom: {
    backgroundColor: '#ff4458',
  },
  deleteButton: {
    marginRight: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: '#ffe6e6',
  },
  deleteButtonText: {
    color: '#ff4458',
    fontSize: 14,
    fontWeight: '600',
  },
  deleteButtonDisabled: {
    opacity: 0.4,
  },
  navBarPlaceholder: {
    height: 10,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  navBarText: {
    fontSize: 16,
    color: '#ff4458',
    fontWeight: 'bold',
  },
});
