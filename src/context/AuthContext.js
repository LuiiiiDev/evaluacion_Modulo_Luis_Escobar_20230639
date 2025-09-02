import React, { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../config/firebase';

const AuthContext = createContext({});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('🔧 Configurando listener de autenticación...');
    
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      console.log('👤 Estado de autenticación cambió:', user ? `Usuario: ${user.email}` : 'No hay usuario');
      setUser(user);
      setLoading(false);
    });

    // Cleanup function
    return () => {
      console.log('🧹 Limpiando listener de autenticación');
      unsubscribe();
    };
  }, []);

  const value = {
    user,
    loading,
    // Puedes agregar más funciones aquí si las necesitas
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};