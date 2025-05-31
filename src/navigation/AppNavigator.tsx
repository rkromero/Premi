import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { useAuthStore } from '../store';
import LoginScreen from '../screens/auth/LoginScreen';
import { RootStackParamList } from '../types';

const Stack = createStackNavigator<RootStackParamList>();

const AppNavigator: React.FC = () => {
  const { isAuthenticated, loadStoredAuth } = useAuthStore();

  useEffect(() => {
    // Cargar datos de autenticación al iniciar la app
    loadStoredAuth();
  }, [loadStoredAuth]);

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
      >
        {!isAuthenticated ? (
          // Pantallas de autenticación
          <Stack.Group>
            <Stack.Screen name="Auth" component={AuthStackNavigator} />
          </Stack.Group>
        ) : (
          // Pantallas principales (cuando esté autenticado)
          <Stack.Group>
            <Stack.Screen name="MainTabs" component={MainTabNavigator} />
          </Stack.Group>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

// Navegador de autenticación
const AuthStack = createStackNavigator();

const AuthStackNavigator: React.FC = () => {
  return (
    <AuthStack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <AuthStack.Screen name="Login" component={LoginScreen} />
      {/* Agregar más pantallas de auth aquí */}
    </AuthStack.Navigator>
  );
};

// Navegador principal (placeholder)
const MainTabNavigator: React.FC = () => {
  // Placeholder por ahora
  return <LoginScreen navigation={undefined} />;
};

export default AppNavigator; 