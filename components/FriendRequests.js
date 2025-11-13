import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  Image,
} from 'react-native';
import { useUser } from './UserContext';
import {
  getPendingFriendRequests,
  acceptFriendRequest,
  rejectFriendRequest,
  getUserById
} from './FriendService';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../firebase.js';

const DEFAULT_PROFILE_IMAGE = 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400';

export default function FriendRequestsScreen({ navigation }) {
  const { user } = useUser();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processingRequests, setProcessingRequests] = useState(new Set());

  useEffect(() => {
    if (!user) return;

    const unsubscribe = getPendingFriendRequests(user.uid, (requestsData) => {
      // Load sender details for each request
      const loadRequestsWithDetails = async () => {
        const requestsWithDetails = await Promise.all(
          requestsData.map(async (request) => {
            try {
              const usersRef = collection(db, 'users');
              const q = query(usersRef, where('__name__', '==', request.fromUserId));
              const querySnapshot = await getDocs(q);

              let senderData = null;
              querySnapshot.forEach((doc) => {
                senderData = { uid: doc.id, ...doc.data() };
              });

              return {
                ...request,
                sender: senderData,
              };
            } catch (error) {
              console.error('Error loading sender data:', error);
              return {
                ...request,
                sender: null,
              };
            }
          })
        );
        setRequests(requestsWithDetails);
        setLoading(false);
      };

      loadRequestsWithDetails();
    });

    return unsubscribe;
  }, [user]);

  const handleAccept = async (requestId) => {
    if (!user) return;

    setProcessingRequests(prev => new Set(prev).add(requestId));

    try {
      await acceptFriendRequest(requestId);
      Alert.alert('¡Éxito!', 'Solicitud de amistad aceptada');

      // Remove from local state
      setRequests(prev => prev.filter(req => req.id !== requestId));
    } catch (error) {
      console.error('Error accepting friend request:', error);
      Alert.alert('Error', 'No se pudo aceptar la solicitud');
    } finally {
      setProcessingRequests(prev => {
        const newSet = new Set(prev);
        newSet.delete(requestId);
        return newSet;
      });
    }
  };

  const handleReject = async (requestId) => {
    if (!user) return;

    setProcessingRequests(prev => new Set(prev).add(requestId));

    try {
      await rejectFriendRequest(requestId);
      Alert.alert('Solicitud rechazada', 'La solicitud ha sido rechazada');

      // Remove from local state
      setRequests(prev => prev.filter(req => req.id !== requestId));
    } catch (error) {
      console.error('Error rejecting friend request:', error);
      Alert.alert('Error', 'No se pudo rechazar la solicitud');
    } finally {
      setProcessingRequests(prev => {
        const newSet = new Set(prev);
        newSet.delete(requestId);
        return newSet;
      });
    }
  };

  const renderRequest = ({ item }) => {
    const isProcessing = processingRequests.has(item.id);

    return (
      <View style={styles.requestCard}>
        <View style={styles.requestContent}>
          <Image
            source={{ uri: item.sender?.photos?.[0] || DEFAULT_PROFILE_IMAGE }}
            style={styles.profileImage}
          />
          <View style={styles.requestInfo}>
            <Text style={styles.senderName}>
              {item.sender?.displayName || 'Usuario desconocido'}
            </Text>
            <Text style={styles.requestTime}>
              {item.createdAt?.toDate ?
                item.createdAt.toDate().toLocaleDateString() :
                'Fecha desconocida'
              }
            </Text>
          </View>
        </View>

        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={[styles.rejectButton, isProcessing && styles.disabledButton]}
            onPress={() => handleReject(item.id)}
            disabled={isProcessing}
          >
            <Text style={styles.rejectButtonText}>
              {isProcessing ? '...' : 'Rechazar'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.acceptButton, isProcessing && styles.disabledButton]}
            onPress={() => handleAccept(item.id)}
            disabled={isProcessing}
          >
            <Text style={styles.acceptButtonText}>
              {isProcessing ? '...' : 'Aceptar'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#ff4458" />
        <Text style={styles.loadingText}>Cargando solicitudes...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Solicitudes de Amistad</Text>
        <Text style={styles.subtitle}>
          {requests.length} {requests.length === 1 ? 'solicitud pendiente' : 'solicitudes pendientes'}
        </Text>
      </View>

      {requests.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No tienes solicitudes pendientes</Text>
          <Text style={styles.emptySubtext}>
            Las solicitudes aparecerán aquí cuando otros usuarios te envíen solicitudes de amistad
          </Text>
        </View>
      ) : (
        <FlatList
          data={requests}
          renderItem={renderRequest}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 50,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e1e2e6',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#333',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
  listContainer: {
    padding: 16,
  },
  requestCard: {
    backgroundColor: '#f8f9fb',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  requestContent: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  requestInfo: {
    flex: 1,
  },
  senderName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  requestTime: {
    fontSize: 14,
    color: '#666',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  rejectButton: {
    flex: 1,
    backgroundColor: '#ff6b6b',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  rejectButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  acceptButton: {
    flex: 1,
    backgroundColor: '#00eda6',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  acceptButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  disabledButton: {
    opacity: 0.6,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 22,
  },
});
