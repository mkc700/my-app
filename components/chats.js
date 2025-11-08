import React from 'react';
import { StyleSheet, View, Text, FlatList } from 'react-native';

const demoChats = [
  { id: '1', name: 'Ana', last: 'Hola, ¿cómo estás?' },
  { id: '2', name: 'Carlos', last: '¿Nos vemos mañana?' },
];

export default function ChatsScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Chats</Text>
      <FlatList
        data={demoChats}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.chatRow}>
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.last}>{item.last}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 16 },
  title: { fontSize: 22, fontWeight: '700', marginBottom: 12, color: '#333' },
  chatRow: {
    padding: 12,
    borderRadius: 10,
    backgroundColor: '#f6f7fb',
    marginBottom: 10,
  },
  name: { fontSize: 16, fontWeight: '600' },
  last: { color: '#666', marginTop: 6 },
});
