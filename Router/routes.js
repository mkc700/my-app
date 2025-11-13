import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';

const Stack = createNativeStackNavigator();

import LoginScreen from '../components/login';
import RegisterScreen from '../components/register';
import WelcomeScreen from '../components/welcome';
import MainTabs from './mainTabs';
import ChatConversacion from '../components/ChatConversacion';
import ChatPerfil from '../components/ChatPerfil';
import EditProfileScreen from '../components/EditProfile';
import FriendRequestsScreen from '../components/FriendRequests';

export default function Routes() {
  return (
    <SafeAreaProvider>
      <Stack.Navigator
      screenOptions={{
        headerShown: false,
        HeaderBackVisible: false,
        headerLeft: () => null,
      }}>
      <Stack.Screen name="Welcome" component={WelcomeScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
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
    </Stack.Navigator>
    </SafeAreaProvider>
  );
}
