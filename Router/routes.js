import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();

import LoginScreen from '../components/login';
import RegisterScreen from '../components/register';
import WelcomeScreen from '../components/welcome';
import MainTabs from './mainTabs';

export default function Routes() {
  return (
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
    </Stack.Navigator>
  );
}

