import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { Provider as PaperProvider } from 'react-native-paper';
import AppNavigator from './src/navigation/AppNavigator';
import { colors } from './src/utils/theme';

export default function App() {
  return (
    <PaperProvider>
      <StatusBar style="auto" backgroundColor={colors.background} />
      <AppNavigator />
    </PaperProvider>
  );
}
