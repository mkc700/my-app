import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Modal, ActivityIndicator } from 'react-native';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase.js';
import { useUser } from './UserContext';

export default function ProfileScreen({ navigation }) {
  const [modalVisible, setModalVisible] = useState(false);
  const { user, userProfile, loading } = useUser();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      // Reset navigation stack and go to Welcome
      navigation.reset({ index: 0, routes: [{ name: 'Welcome' }] });
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#ff4458" />
      </View>
    );
  }

  if (!user || !userProfile) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={styles.title}>No has iniciado sesión</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mi Perfil</Text>
      <View style={styles.card}>
        <Text style={styles.name}>
          {userProfile.displayName || 'Sin nombre'}
        </Text>
        <Text style={styles.email}>{userProfile.email}</Text>
        {userProfile.bio ? (
          <Text style={styles.bio}>{userProfile.bio}</Text>
        ) : null}
        {userProfile.age ? (
          <Text style={styles.detail}>Edad: {userProfile.age} años</Text>
        ) : null}
        {userProfile.work ? (
          <Text style={styles.detail}>💼 {userProfile.work}</Text>
        ) : null}
        {userProfile.school ? (
          <Text style={styles.detail}>🎓 {userProfile.school}</Text>
        ) : null}
        {userProfile.location ? (
          <Text style={styles.detail}>📍 {userProfile.location}</Text>
        ) : null}
      </View>

      <TouchableOpacity
        style={[styles.button, { marginBottom: 12 }]}
        onPress={() => navigation.navigate('EditProfile')}
      >
        <Text style={styles.buttonText}>Editar Perfil</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, { marginBottom: 12, backgroundColor: '#00eda6' }]}
        onPress={() => navigation.navigate('FriendRequests')}
      >
        <Text style={styles.buttonText}>Solicitudes</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.buttonSecondary} onPress={() => setModalVisible(true)}>
        <Text style={styles.buttonTextSecondary}>Configuración</Text>
      </TouchableOpacity>

      <Modal animationType="slide" transparent={true} visible={modalVisible} onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Configuración</Text>

            <TouchableOpacity style={styles.modalButton} onPress={handleLogout}>
              <Text style={[styles.buttonText, { color: '#ff4458' }]}>Cerrar sesión</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.modalButton, { marginTop: 8 }]} onPress={() => setModalVisible(false)}>
              <Text style={styles.buttonText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 16 },
  title: { fontSize: 22, fontWeight: '700', marginBottom: 12, color: '#333' },
  card: { backgroundColor: '#f6f7fb', padding: 12, borderRadius: 10, marginBottom: 14 },
  name: { fontSize: 18, fontWeight: '700' },
  email: { color: '#666', marginTop: 6 },
  bio: { color: '#666', marginTop: 8, fontStyle: 'italic' },
  detail: { color: '#666', marginTop: 4, fontSize: 14 },
  button: { backgroundColor: '#ff4458', padding: 12, borderRadius: 10, alignItems: 'center' },
  buttonText: { color: '#fff', fontWeight: '700' },
  buttonSecondary: { backgroundColor: '#f2f3f6', padding: 12, borderRadius: 10, alignItems: 'center' },
  buttonTextSecondary: { color: '#333', fontWeight: '700' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'center', alignItems: 'center' },
  modalContent: { width: '85%', backgroundColor: '#fff', borderRadius: 12, padding: 18 },
  modalTitle: { fontSize: 18, fontWeight: '700', marginBottom: 12 },
  modalButton: { padding: 12, borderRadius: 8, backgroundColor: '#f2f3f6', alignItems: 'center' },
});
