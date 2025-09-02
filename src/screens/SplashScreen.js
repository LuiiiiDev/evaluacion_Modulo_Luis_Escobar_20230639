import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Dimensions
} from 'react-native';

const { width, height } = Dimensions.get('window');

export default function SplashScreen({ onFinish }) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.5)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  useEffect(() => {
    // Secuencia de animaciones con duración mucho mayor
    Animated.sequence([
      // Logo aparece con escala y fade (más lento)
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 2000, // 2 segundos para aparecer
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 30, // Más suave
          friction: 8,
          useNativeDriver: true,
        })
      ]),
      // Texto desliza hacia arriba
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 1500, // 1.5 segundos
        useNativeDriver: true,
      }),
      // Pausa larga para mostrar el contenido completo
      Animated.delay(4000), // 4 segundos de pausa
      // Fade out lento
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 1000, // 1 segundo para desaparecer
        useNativeDriver: true,
      })
    ]).start(() => {
      onFinish && onFinish();
    });
  }, [fadeAnim, scaleAnim, slideAnim, onFinish]);

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.logoContainer,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }]
          }
        ]}
      >
        <View style={styles.logo}>
          <Text style={styles.logoText}>📱</Text>
        </View>
        
        <Animated.View
          style={[
            styles.textContainer,
            {
              transform: [{ translateY: slideAnim }],
              opacity: fadeAnim
            }
          ]}
        >
          <Text style={styles.appName}>Mi App Firebase</Text>
          <Text style={styles.subtitle}>Sistema de Gestión de Usuarios</Text>
        </Animated.View>
      </Animated.View>
      
      <View style={styles.footer}>
        <Text style={styles.footerText}>Instituto Técnico Ricaldone</Text>
        <Text style={styles.footerSubtext}>Desarrollo de Software</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  logo: {
    width: 120,
    height: 120,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  logoText: {
    fontSize: 60,
  },
  textContainer: {
    alignItems: 'center',
  },
  appName: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 10,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 5,
  },
  subtitle: {
    fontSize: 18,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    fontWeight: '300',
  },
  footer: {
    position: 'absolute',
    bottom: 50,
    alignItems: 'center',
  },
  footerText: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 16,
    fontWeight: '600',
  },
  footerSubtext: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 14,
    marginTop: 5,
  },
});