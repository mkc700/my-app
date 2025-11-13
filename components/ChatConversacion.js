import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet } from 'react-native';
import { GiftedChat, Send, InputToolbar } from 'react-native-gifted-chat';
import { useRoute } from '@react-navigation/native';
import { useUser } from './UserContext';
import { sendMessage, getChatMessages } from './FriendService';

export default function ChatConversacion() {
  const route = useRoute();
  const { user } = useUser();
  const { chatId, friendName, friendId } = route.params;

  const [messages, setMessages] = useState([]);

  useEffect(() => {
    if (!user || !chatId) return;

    // Load existing messages
    const unsubscribe = getChatMessages(chatId, (messagesData) => {
      // Convert Firebase messages to GiftedChat format
      const giftedChatMessages = messagesData.map(msg => ({
        _id: msg.id,
        text: msg.text,
        createdAt: msg.timestamp?.toDate() || new Date(msg.timestamp),
        user: {
          _id: msg.senderId,
          name: msg.senderId === user.uid ? 'Tú' : friendName,
        },
      }));

      // Sort messages by timestamp (most recent first for GiftedChat)
      giftedChatMessages.sort((a, b) => b.createdAt - a.createdAt);

      setMessages(giftedChatMessages);
    });

    return unsubscribe;
  }, [user, chatId, friendName]);

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

  if (!user) {
    return <View style={styles.container} />;
  }

  return (
    <View style={styles.container}>
      <GiftedChat
        messages={messages}
        onSend={onSend}
        user={{
          _id: user.uid,
        }}
        placeholder="Escribe un mensaje..."
        showAvatarForEveryMessage={false}
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
      />
    </View>
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
    marginBottom: 8,
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
    paddingVertical: 8,
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
});
