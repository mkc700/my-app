import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useUser } from '../components/UserContext';
import { View, ActivityIndicator } from 'react-native';

const Stack = createNativeStackNavigator();

import LoginScreen from '../components/login';
import RegisterScreen from '../components/register';
import WelcomeScreen from '../components/welcome';
import MainTabs from './mainTabs';
import ChatConversacion from '../components/ChatConversacion';
import ChatPerfil from '../components/ChatPerfil';
import EditProfileScreen from '../components/EditProfile';
import FriendRequestsScreen from '../components/FriendRequests';

function RoutesContent() {
  const { user, loading } = useUser();

  // Show loading screen while checking auth state
  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' }}>
        <ActivityIndicator size="large" color="#ff4458" />
      </View>
    );
  }

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        HeaderBackVisible: false,
        headerLeft: () => null,
      }}>
      {/* Auth screens - only show if not authenticated */}
      {!user && (
        <>
          <Stack.Screen name="Welcome" component={WelcomeScreen} />
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
        </>
      )}

      {/* Main app screens - only show if authenticated */}
      {user && (
        <>
          <Stack.Screen name="Main" component={MainTabs} />
          <Stack.Screen
            name="EditProfile"
            component={EditProfileScreen}
            options={{
              headerShown: true,
              headerBackVisible: true,
              headerLeft: undefined,
              title: 'Editar Perfil'
            }}
          />
          <Stack.Screen
            name="FriendRequests"
            component={FriendRequestsScreen}
            options={{
              headerShown: true,
              headerBackVisible: true,
              headerLeft: undefined,
              title: 'Solicitudes'
            }}
          />
          <Stack.Screen
            name="ChatConversacion"
            component={ChatConversacion}
            options={{
              headerShown: true,
              headerBackVisible: true,
              headerLeft: undefined,
            }}
          />
          <Stack.Screen
            name="ChatPerfil"
            component={ChatPerfil}
            options={{
              headerShown: true,
              headerBackVisible: true,
              headerLeft: undefined,
              title: 'Detalles del perfil'
            }}
          />
        </>
      )}
    </Stack.Navigator>
  );
}

export default function Routes() {
  return (
    <SafeAreaProvider>
      <RoutesContent />
    </SafeAreaProvider>
  );
}
