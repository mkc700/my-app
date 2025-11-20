import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Modal, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useUser } from './UserContext';

export default function ProfileScreen({ navigation }) {
  const [modalVisible, setModalVisible] = useState(false);
  const { user, userProfile, loading, logout } = useUser();

  const handleLogout = async () => {
    try {
      await logout();
      // UserContext sets user=null and RoutesContent volverá a mostrar las pantallas de auth.
      // No necesitamos forzar un reset manual aquí.
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const renderContent = () => {
    if (loading) {
      return (
        <View style={styles.centerContent}>
          <ActivityIndicator size="large" color="#fff" />
          <Text style={styles.loadingText}>Cargando perfil...</Text>
        </View>
      );
    }

    if (!user || !userProfile) {
      return (
        <View style={styles.centerContent}>
          <Text style={styles.title}>No has iniciado sesión</Text>
        </View>
      );
    }

    return (
      <>
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
          style={[styles.button, styles.secondaryButton]}
          onPress={() => navigation.navigate('FriendRequests')}
        >
          <Text style={[styles.buttonText, styles.secondaryButtonText]}>Solicitudes</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.buttonGhost} onPress={() => setModalVisible(true)}>
          <Text style={styles.buttonGhostText}>Configuración</Text>
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
      </>
    );
  };

  return (
    <LinearGradient colors={['#ff5f6d', '#ffc371']} style={styles.gradient}>
      <View style={styles.container}>{renderContent()}</View>
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
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#fff',
    marginTop: 12,
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 16,
    letterSpacing: 0.4,
  },
  card: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    padding: 20,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.35)',
    marginBottom: 18,
  },
  name: {
    fontSize: 22,
    fontWeight: '700',
    color: '#fff',
  },
  email: {
    color: '#ffe6ef',
    marginTop: 6,
  },
  bio: {
    color: '#fff',
    marginTop: 10,
    fontStyle: 'italic',
  },
  detail: {
    color: '#ffe6ef',
    marginTop: 6,
    fontSize: 15,
  },
  button: {
    backgroundColor: '#fff',
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 6,
    marginBottom: 12,
  },
  buttonText: {
    color: '#ff4458',
    fontWeight: '700',
    fontSize: 16,
  },
  secondaryButton: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.35)',
  },
  secondaryButtonText: {
    color: '#fff',
  },
  buttonGhost: {
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.4)',
    backgroundColor: 'transparent',
  },
  buttonGhostText: {
    color: '#fff',
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    width: '90%',
    maxWidth: 400,
    backgroundColor: '#fff7f3',
    borderRadius: 18,
    padding: 24,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 20,
    textAlign: 'center',
    color: '#ff4458',
  },
  modalButton: {
    padding: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginVertical: 6,
  },
  logoutButton: {
    backgroundColor: '#ff4458',
  },
  logoutButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  cancelButton: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ffd1c8',
  },
  cancelButtonText: {
    color: '#ff4458',
    fontWeight: '600',
    fontSize: 16,
  },
});
