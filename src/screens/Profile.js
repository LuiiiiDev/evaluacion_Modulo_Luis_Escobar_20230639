import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  ScrollView,
  SafeAreaView
} from 'react-native';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { updateProfile, updateEmail, updatePassword, reauthenticateWithCredential, EmailAuthProvider } from 'firebase/auth';
import { auth, database } from '../config/firebase';

export default function Profile() {
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    edad: '',
    especialidad: ''
  });
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const user = auth.currentUser;
      if (user) {
        const userDoc = await getDoc(doc(database, 'usuarios', user.uid));
        if (userDoc.exists()) {
          const data = userDoc.data();
          setUserData({
            name: data.name || '',
            email: data.email || user.email || '',
            edad: data.edad?.toString() || '',
            especialidad: data.especialidad || ''
          });
        }
      }
    } catch (error) {
      console.log('Error loading user data:', error);
      Alert.alert('Error', 'No se pudo cargar la información del usuario');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setUserData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const validateForm = () => {
    if (!userData.name || !userData.email || !userData.edad || !userData.especialidad) {
      Alert.alert('Error', 'Por favor completa todos los campos');
      return false;
    }

    const edadNum = parseInt(userData.edad);
    if (isNaN(edadNum) || edadNum < 15 || edadNum > 100) {
      Alert.alert('Error', 'Por favor ingresa una edad válida (15-100 años)');
      return false;
    }

    return true;
  };

  const reauthenticate = async () => {
    if (!currentPassword) {
      Alert.alert('Error', 'Para actualizar información sensible, ingresa tu contraseña actual');
      return false;
    }

    try {
      const user = auth.currentUser;
      const credential = EmailAuthProvider.credential(user.email, currentPassword);
      await reauthenticateWithCredential(user, credential);
      return true;
    } catch (error) {
      Alert.alert('Error', 'Contraseña actual incorrecta');
      return false;
    }
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    setSaving(true);
    try {
      const user = auth.currentUser;
      const originalEmail = user.email;
      const emailChanged = userData.email !== originalEmail;

      // Si el email cambió o hay nueva contraseña, reautenticar
      if (emailChanged || newPassword) {
        const reauth = await reauthenticate();
        if (!reauth) {
          setSaving(false);
          return;
        }
      }

      // Actualizar perfil en Auth
      await updateProfile(user, {
        displayName: userData.name
      });

      // Actualizar email si cambió
      if (emailChanged) {
        await updateEmail(user, userData.email);
      }

      // Actualizar contraseña si se proporcionó una nueva
      if (newPassword) {
        if (newPassword.length < 6) {
          Alert.alert('Error', 'La nueva contraseña debe tener al menos 6 caracteres');
          setSaving(false);
          return;
        }
        await updatePassword(user, newPassword);
      }

      // Actualizar datos en Firestore
      await updateDoc(doc(database, 'usuarios', user.uid), {
        name: userData.name,
        email: userData.email,
        edad: parseInt(userData.edad),
        especialidad: userData.especialidad,
        updatedAt: new Date().toISOString()
      });

      setIsEditing(false);
      setCurrentPassword('');
      setNewPassword('');
      
      Alert.alert('Éxito', 'Información actualizada correctamente');

    } catch (error) {
      console.log('Error updating profile:', error);
      let errorMessage = 'Error al actualizar la información';
      
      switch (error.code) {
        case 'auth/email-already-in-use':
          errorMessage = 'Este email ya está en uso';
          break;
        case 'auth/invalid-email':
          errorMessage = 'Email inválido';
          break;
        case 'auth/requires-recent-login':
          errorMessage = 'Necesitas volver a iniciar sesión para hacer este cambio';
          break;
        default:
          errorMessage = error.message;
      }
      
      Alert.alert('Error', errorMessage);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setCurrentPassword('');
    setNewPassword('');
    loadUserData(); // Recargar datos originales
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Cargando perfil...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.profileContainer}>
          <Text style={styles.title}>Mi Perfil</Text>
          
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Nombre:</Text>
            <TextInput
              style={[styles.input, !isEditing && styles.inputDisabled]}
              value={userData.name}
              onChangeText={(value) => handleInputChange('name', value)}
              editable={isEditing}
              placeholder="Nombre completo"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Email:</Text>
            <TextInput
              style={[styles.input, !isEditing && styles.inputDisabled]}
              value={userData.email}
              onChangeText={(value) => handleInputChange('email', value)}
              editable={isEditing}
              placeholder="Correo electrónico"
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Edad:</Text>
            <TextInput
              style={[styles.input, !isEditing && styles.inputDisabled]}
              value={userData.edad}
              onChangeText={(value) => handleInputChange('edad', value)}
              editable={isEditing}
              placeholder="Edad"
              keyboardType="numeric"
              maxLength={2}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Especialidad:</Text>
            <TextInput
              style={[styles.input, !isEditing && styles.inputDisabled]}
              value={userData.especialidad}
              onChangeText={(value) => handleInputChange('especialidad', value)}
              editable={isEditing}
              placeholder="Especialidad"
              autoCapitalize="words"
            />
          </View>

          {isEditing && (
            <>
              <Text style={styles.sectionTitle}>Cambiar Contraseña (Opcional)</Text>
              
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Contraseña Actual:</Text>
                <TextInput
                  style={styles.input}
                  value={currentPassword}
                  onChangeText={setCurrentPassword}
                  placeholder="Contraseña actual (requerida para cambios)"
                  secureTextEntry
                  autoCapitalize="none"
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>Nueva Contraseña:</Text>
                <TextInput
                  style={styles.input}
                  value={newPassword}
                  onChangeText={setNewPassword}
                  placeholder="Nueva contraseña (opcional)"
                  secureTextEntry
                  autoCapitalize="none"
                />
              </View>
            </>
          )}

          <View style={styles.buttonContainer}>
            {!isEditing ? (
              <TouchableOpacity
                style={styles.editButton}
                onPress={() => setIsEditing(true)}
              >
                <Text style={styles.editButtonText}>Editar Información</Text>
              </TouchableOpacity>
            ) : (
              <View style={styles.editButtonsContainer}>
                <TouchableOpacity
                  style={[styles.button, styles.saveButton, saving && styles.buttonDisabled]}
                  onPress={handleSave}
                  disabled={saving}
                >
                  {saving ? (
                    <ActivityIndicator color="#fff" size="small" />
                  ) : (
                    <Text style={styles.buttonText}>Guardar</Text>
                  )}
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.button, styles.cancelButton]}
                  onPress={handleCancel}
                  disabled={saving}
                >
                  <Text style={styles.buttonText}>Cancelar</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 20,
  },
  profileContainer: {
    backgroundColor: '#fff',
    padding: 30,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30,
    color: '#333',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 20,
    marginBottom: 15,
    color: '#333',
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 15,
    borderRadius: 8,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
  },
  inputDisabled: {
    backgroundColor: '#f0f0f0',
    color: '#666',
  },
  buttonContainer: {
    marginTop: 20,
  },
  editButton: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  editButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  editButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 15,
  },
  button: {
    flex: 1,
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  saveButton: {
    backgroundColor: '#28A745',
  },
  cancelButton: {
    backgroundColor: '#6C757D',
  },
  buttonDisabled: {
    backgroundColor: '#ccc',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});