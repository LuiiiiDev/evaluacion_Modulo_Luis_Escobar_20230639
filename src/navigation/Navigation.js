import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { View, ActivityIndicator, StyleSheet } from 'react-native';

import { AuthProvider, useAuth } from '../context/AuthContext';
import Login from '../screens/Login';
import Registrar from '../screens/Registrar';
import Home from '../screens/Home';
import Profile from '../screens/Profile';
import SplashScreen from '../screens/SplashScreen';

const Stack = createStackNavigator();

function LoadingScreen() {
  return (
    <View style={styles.loadingContainer}>
      <ActivityIndicator size="large" color="#007AFF" />
    </View>
  );
}

function AuthStack() {
  return (
    <Stack.Navigator
      initialRouteName="Login"
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen 
        name="Login" 
        component={Login}
        options={{
          animationTypeForReplace: 'pop',
        }}
      />
      <Stack.Screen 
        name="Registrar" 
        component={Registrar}
        options={{
          headerShown: true,
          title: 'Crear Cuenta',
          headerStyle: {
            backgroundColor: '#28A745',
          },
          headerTintColor: '#fff',
        }}
      />
    </Stack.Navigator>
  );
}

function AppStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: '#007AFF',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Stack.Screen 
        name="Home" 
        component={Home} 
        options={{ 
          title: 'Inicio',
          headerLeft: null,
          gestureEnabled: false,
        }} 
      />
      <Stack.Screen 
        name="Profile" 
        component={Profile} 
        options={{ 
          title: 'Mi Perfil',
          headerBackTitle: 'Inicio',
        }} 
      />
    </Stack.Navigator>
  );
}

// Componente separado para manejar mejor el estado
function AppNavigator() {
  const [showSplash, setShowSplash] = useState(true);
  
  const handleSplashFinish = React.useCallback(() => {
    setShowSplash(false);
  }, []);

  // Si se está mostrando el splash, mostrar la pantalla de carga
  if (showSplash) {
    return (
      <SplashScreen 
        onFinish={handleSplashFinish} 
      />
    );
  }

  // Después del splash, mostrar el AuthNavigator que maneja la autenticación
  return <AuthNavigator />;
}

// Separamos la lógica de autenticación
function AuthNavigator() {
  const { user, loading } = useAuth();

  // Si Firebase aún está cargando
  if (loading) {
    return <LoadingScreen />;
  }

  return user ? <AppStack /> : <AuthStack />;
}

export default function Navigation() {
  return (
    <AuthProvider>
      <NavigationContainer>
        <AppNavigator />
      </NavigationContainer>
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
});