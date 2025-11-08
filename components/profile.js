import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Modal } from 'react-native';

export default function ProfileScreen({ navigation }) {
  const [modalVisible, setModalVisible] = useState(false);

  const handleLogout = () => {
    // Reset navigation stack and go to Welcome
    navigation.reset({ index: 0, routes: [{ name: 'Welcome' }] });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mi Perfil</Text>
      <View style={styles.card}>
        <Text style={styles.name}>Usuario Demo</Text>
        <Text style={styles.email}>demo@tindertec.com</Text>
      </View>

      <TouchableOpacity style={styles.button} onPress={() => setModalVisible(true)}>
        <Text style={styles.buttonText}>Configuración</Text>
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
  button: { backgroundColor: '#ff4458', padding: 12, borderRadius: 10, alignItems: 'center' },
  buttonText: { color: '#fff', fontWeight: '700' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'center', alignItems: 'center' },
  modalContent: { width: '85%', backgroundColor: '#fff', borderRadius: 12, padding: 18 },
  modalTitle: { fontSize: 18, fontWeight: '700', marginBottom: 12 },
  modalButton: { padding: 12, borderRadius: 8, backgroundColor: '#f2f3f6', alignItems: 'center' },
});
