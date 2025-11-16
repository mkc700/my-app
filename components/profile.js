import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Modal, ActivityIndicator } from 'react-native';
import { useUser } from './UserContext';

export default function ProfileScreen({ navigation }) {
  const [modalVisible, setModalVisible] = useState(false);
  const { user, userProfile, loading, logout } = useUser();

  const handleLogout = async () => {
    try {
      await logout();
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

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Configuración</Text>

            <TouchableOpacity
              style={[styles.modalButton, styles.logoutButton]}
              onPress={handleLogout}
            >
              <Text style={styles.logoutButtonText}>Cerrar sesión</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.modalButton, styles.cancelButton]}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.cancelButtonText}>Cancelar</Text>
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
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center', padding: 20 },
  modalContent: { width: '90%', maxWidth: 400, backgroundColor: '#fff', borderRadius: 16, padding: 24, elevation: 10 },
  modalTitle: { fontSize: 20, fontWeight: '700', marginBottom: 20, textAlign: 'center', color: '#333' },
  modalButton: { padding: 14, borderRadius: 10, alignItems: 'center', marginVertical: 6 },
  logoutButton: { backgroundColor: '#ff4458' },
  logoutButtonText: { color: '#fff', fontWeight: '600', fontSize: 16 },
  cancelButton: { backgroundColor: '#f0f0f0', borderWidth: 1, borderColor: '#ddd' },
  cancelButtonText: { color: '#333', fontWeight: '600', fontSize: 16 },
});
