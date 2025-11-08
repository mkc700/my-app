import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { useRoute } from '@react-navigation/native';

export default function ChatPerfil() {
  const route = useRoute();
  const { name } = route.params;

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Image
          source={{ uri: 'https://via.placeholder.com/150' }}
          style={styles.profileImage}
        />
        <Text style={styles.name}>{name}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Configuración del Chat</Text>
        
        <TouchableOpacity style={styles.option}>
          <Text style={styles.optionText}>Silenciar notificaciones</Text>
          <Text style={styles.optionStatus}>Off</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.option}>
          <Text style={styles.optionText}>Bloquear mensajes</Text>
          <Text style={styles.optionStatus}>No</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.option}>
          <Text style={styles.optionText}>Multimedia autoguardada</Text>
          <Text style={styles.optionStatus}>Sí</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Información del Perfil</Text>
        
        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>Carrera</Text>
          <Text style={styles.infoValue}>Ingeniería en Sistemas</Text>
        </View>

        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>Semestre</Text>
          <Text style={styles.infoValue}>6to</Text>
        </View>

        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>Intereses</Text>
          <Text style={styles.infoValue}>Deportes, Música, Tecnología</Text>
        </View>
      </View>

      <TouchableOpacity style={styles.reportButton}>
        <Text style={styles.reportButtonText}>Reportar Usuario</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e1e2e6',
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 12,
  },
  name: {
    fontSize: 24,
    fontWeight: '600',
    color: '#333',
  },
  section: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e1e2e6',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
  },
  option: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  optionText: {
    fontSize: 16,
    color: '#333',
  },
  optionStatus: {
    fontSize: 16,
    color: '#666',
  },
  infoItem: {
    marginBottom: 12,
  },
  infoLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 16,
    color: '#333',
  },
  reportButton: {
    margin: 16,
    padding: 16,
    backgroundColor: '#ff3b30',
    borderRadius: 8,
    alignItems: 'center',
  },
  reportButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});