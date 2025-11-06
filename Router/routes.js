import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();

import Login from '../components/login';
import Register from '../components/register';
import Welcome from '../components/welcome';

export default function Routes() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        HeaderBackVisible: false,
        headerLeft: () => null,
      }}>
  <Stack.Screen name="Welcome" component={Welcome} />
  <Stack.Screen name="Login" component={Login} />
  <Stack.Screen name="Register" component={Register} />
    </Stack.Navigator>
  );
}

