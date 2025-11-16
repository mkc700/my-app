import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import { enableScreens } from 'react-native-screens';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { UserProvider } from './components/UserContext';

// Enable native screens for better performance
enableScreens();


import Routes from './Router/routes';

export default function App() {
  return (
    <SafeAreaProvider>
      <GestureHandlerRootView style={{flex: 1}}>
        <UserProvider>
          <NavigationContainer>
            <Routes />
          </NavigationContainer>
        </UserProvider>
      </GestureHandlerRootView>
    </SafeAreaProvider>
  );
}
