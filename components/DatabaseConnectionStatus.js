import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { getDatabase, ref, onValue } from 'firebase/database';
import { app } from '../firebase-config';

export const DatabaseConnectionStatus = () => {
  const [connectionStatus, setConnectionStatus] = useState('checking');

  useEffect(() => {
    const db = getDatabase(app);
    const connectedRef = ref(db, '.info/connected');

    const unsubscribe = onValue(connectedRef, (snap) => {
      setConnectionStatus(snap.val() ? 'connected' : 'disconnected');
    }, (error) => {
      console.error('Error checking connection:', error);
      setConnectionStatus('error');
    });

    return () => unsubscribe();
  }, []);

  const getStatusColor = () => {
    switch (connectionStatus) {
      case 'connected':
        return '#4CAF50'; // verde
      case 'disconnected':
        return '#F44336'; // rojo
      case 'error':
        return '#FF9800'; // naranja
      default:
        return '#9E9E9E'; // gris
    }
  };

  return (
    <View style={styles.container}>
      <View style={[styles.indicator, { backgroundColor: getStatusColor() }]} />
      <Text style={styles.text}>
        Firebase: {connectionStatus.charAt(0).toUpperCase() + connectionStatus.slice(1)}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    borderRadius: 8,
    margin: 8,
  },
  indicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 8,
  },
  text: {
    fontSize: 14,
    color: '#333',
  },
});