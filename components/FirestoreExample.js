import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { db, usuariosRef } from '../firebase-config';
import { 
  getDocs,
  addDoc,
  query,
  limit 
} from 'firebase/firestore';

export const FirestoreExample = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Función para cargar usuarios
  const cargarUsuarios = async () => {
    try {
      setLoading(true);
      const q = query(usuariosRef, limit(5)); // Limitar a 5 usuarios como ejemplo
      const querySnapshot = await getDocs(q);
      
      const usuariosData = [];
      querySnapshot.forEach((doc) => {
        usuariosData.push({
          id: doc.id,
          ...doc.data()
        });
      });
      
      setUsuarios(usuariosData);
      setError(null);
    } catch (err) {
      console.error('Error al cargar usuarios:', err);
      setError('Error al cargar usuarios');
    } finally {
      setLoading(false);
    }
  };

  // Función para añadir un usuario de prueba
  const agregarUsuarioPrueba = async () => {
    try {
      const nuevoUsuario = {
        nombre: 'Usuario Prueba',
        email: 'prueba@test.com',
        createdAt: new Date().toISOString()
      };

      const docRef = await addDoc(usuariosRef, nuevoUsuario);
      console.log('Usuario agregado con ID:', docRef.id);
      
      // Recargar la lista
      cargarUsuarios();
    } catch (err) {
      console.error('Error al agregar usuario:', err);
      setError('Error al agregar usuario');
    }
  };

  // Cargar usuarios al montar el componente
  useEffect(() => {
    cargarUsuarios();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Prueba de Firestore</Text>
      
      {error && (
        <Text style={styles.error}>{error}</Text>
      )}
      
      {loading ? (
        <Text>Cargando...</Text>
      ) : (
        <>
          <Text style={styles.subtitle}>Usuarios ({usuarios.length}):</Text>
          {usuarios.map(usuario => (
            <View key={usuario.id} style={styles.userCard}>
              <Text>ID: {usuario.id}</Text>
              <Text>Nombre: {usuario.nombre}</Text>
              <Text>Email: {usuario.email}</Text>
            </View>
          ))}
        </>
      )}
      
      <Button 
        title="Agregar Usuario de Prueba" 
        onPress={agregarUsuarioPrueba}
      />
      
      <Button 
        title="Recargar Lista" 
        onPress={cargarUsuarios}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    flex: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '600',
    marginVertical: 8,
  },
  userCard: {
    padding: 12,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    marginBottom: 8,
  },
  error: {
    color: 'red',
    marginBottom: 8,
  }
});