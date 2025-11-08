import React from 'react';
import { StyleSheet, View, Text, FlatList, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const demoChats = [
  { 
    id: '1', 
    name: 'Ana', 
    last: 'Hola, ¿cómo estás?',
    avatar: 'https://via.placeholder.com/50'
  },
  { 
    id: '2', 
    name: 'Carlos', 
    last: '¿Nos vemos mañana?',
    avatar: 'https://via.placeholder.com/50'
  },
];

export default function ChatsScreen() {
  const navigation = useNavigation();

  const handleChatPress = (item) => {
    navigation.navigate('ChatConversacion', { chatId: item.id, name: item.name });
  };

  const handleProfilePress = (item) => {
    navigation.navigate('ChatPerfil', { userId: item.id, name: item.name });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Chats</Text>
      <FlatList
        data={demoChats}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity 
            style={styles.chatRow}
            onPress={() => handleChatPress(item)}
          >
            <TouchableOpacity 
              style={styles.avatarContainer}
              onPress={() => handleProfilePress(item)}
            >
              <Image 
                source={{ uri: item.avatar }} 
                style={styles.avatar}
              />
            </TouchableOpacity>
            <View style={styles.chatInfo}>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.last}>{item.last}</Text>
            </View>
          </TouchableOpacity>
        )}
      />
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
  name: { 
    fontSize: 16, 
    fontWeight: '600' 
  },
  last: { 
    color: '#666', 
    marginTop: 6 
  },
});
