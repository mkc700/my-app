import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useRoute } from '@react-navigation/native';

// Mensajes de ejemplo
const demoMessages = [
  { id: '1', text: 'Hola, ¿cómo estás?', sender: 'them', timestamp: '10:00' },
  { id: '2', text: '¡Hola! Muy bien, ¿y tú?', sender: 'me', timestamp: '10:01' },
  { id: '3', text: 'Todo bien, gracias', sender: 'them', timestamp: '10:02' },
];

export default function ChatConversacion() {
  const route = useRoute();
  const { name } = route.params;
  const [mensaje, setMensaje] = useState('');
  const [messages, setMessages] = useState(demoMessages);

  const enviarMensaje = () => {
    if (mensaje.trim().length > 0) {
      const newMessage = {
        id: Date.now().toString(),
        text: mensaje,
        sender: 'me',
        timestamp: new Date().toLocaleTimeString().slice(0, 5),
      };
      setMessages([...messages, newMessage]);
      setMensaje('');
    }
  };

  const renderMessage = ({ item }) => (
    <View style={[
      styles.messageContainer,
      item.sender === 'me' ? styles.myMessage : styles.theirMessage
    ]}>
      <Text style={styles.messageText}>{item.text}</Text>
      <Text style={styles.timestamp}>{item.timestamp}</Text>
    </View>
  );

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <View style={styles.header}>
        <Text style={styles.headerText}>{name}</Text>
      </View>
      
      <FlatList
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={renderMessage}
        contentContainerStyle={styles.messagesList}
        inverted={false}
      />

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={mensaje}
          onChangeText={setMensaje}
          placeholder="Escribe un mensaje..."
          multiline
        />
        <TouchableOpacity 
          style={styles.sendButton}
          onPress={enviarMensaje}
        >
          <Text style={styles.sendButtonText}>Enviar</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    padding: 16,
    backgroundColor: '#f6f7fb',
    borderBottomWidth: 1,
    borderBottomColor: '#e1e2e6',
  },
  headerText: {
    fontSize: 18,
    fontWeight: '600',
  },
  messagesList: {
    padding: 16,
  },
  messageContainer: {
    maxWidth: '80%',
    marginVertical: 4,
    padding: 12,
    borderRadius: 16,
  },
  myMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#007AFF',
  },
  theirMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#E9ECEF',
  },
  messageText: {
    color: '#fff',
    fontSize: 16,
  },
  timestamp: {
    fontSize: 12,
    color: '#rgba(255,255,255,0.7)',
    marginTop: 4,
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#e1e2e6',
    backgroundColor: '#fff',
  },
  input: {
    flex: 1,
    backgroundColor: '#f6f7fb',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    fontSize: 16,
  },
  sendButton: {
    backgroundColor: '#007AFF',
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 8,
    justifyContent: 'center',
  },
  sendButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});