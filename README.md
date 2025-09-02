# Mi App Firebase 📱

Sistema de Gestión de Usuarios desarrollado con React Native y Firebase para el Instituto Técnico Ricaldone.

## 📋 Descripción

Esta aplicación móvil permite a los estudiantes registrarse, iniciar sesión y gestionar su información personal. Utiliza Firebase como backend para autenticación, base de datos y almacenamiento.

## ✨ Funcionalidades

- **Autenticación de usuarios**: Registro e inicio de sesión seguro con Firebase Auth
- **Gestión de perfil**: Los usuarios pueden editar su información personal
- **Pantalla de bienvenida**: SplashScreen animado al iniciar la aplicación
- **Navegación intuitiva**: Sistema de navegación basado en el estado de autenticación
- **Persistencia de sesión**: Los usuarios permanecen logueados entre sesiones

## 🛠️ Tecnologías Utilizadas

- **React Native**: Framework principal para desarrollo móvil
- **Expo**: Plataforma para desarrollo y despliegue
- **Firebase**: Backend as a Service
  - Firebase Auth (Autenticación)
  - Firestore (Base de datos)
  - Firebase Storage (Almacenamiento)
- **React Navigation**: Navegación entre pantallas
- **AsyncStorage**: Almacenamiento local

## 📱 Pantallas

### Pantallas de Autenticación
- **Login**: Inicio de sesión con email y contraseña
- **Registro**: Creación de nueva cuenta con información del estudiante

### Pantallas Principales
- **Home**: Pantalla principal con información del usuario
- **Profile**: Edición de información personal
- **SplashScreen**: Pantalla de carga inicial

## 🚀 Instalación y Configuración

### Prerrequisitos

- Node.js (versión 18 o superior)
- npm o yarn
- Expo CLI
- Cuenta de Firebase

### Pasos de Instalación

1. **Clonar el repositorio**
   ```bash
   git clone [URL_DEL_REPOSITORIO]
   cd practica-firebase
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   ```

3. **Configurar Firebase**
   
   Crear un archivo `.env` en la raíz del proyecto con las siguientes variables:
   ```env
   API_KEY=tu_api_key
   AUTH_DOMAIN=tu_proyecto.firebaseapp.com
   PROJECT_ID=tu_project_id
   STORAGE_BUCKET=tu_proyecto.appspot.com
   MESSAGING_SENDER_ID=tu_messaging_sender_id
   APP_ID=tu_app_id
   ```

4. **Configurar Firestore**
   
   En la consola de Firebase, crear una colección llamada `usuarios` con la siguiente estructura:
   ```javascript
   {
     name: "string",
     email: "string", 
     edad: number,
     especialidad: "string",
     createdAt: "timestamp",
     updatedAt: "timestamp",
     uid: "string"
   }
   ```

5. **Iniciar la aplicación**
   ```bash
   npm start
   # o
   expo start
   ```

## 📦 Dependencias Principales

```json
{
  "@react-navigation/native": "^7.1.17",
  "@react-navigation/stack": "^7.4.8",
  "expo": "~53.0.22",
  "firebase": "^12.2.1",
  "react-native": "0.79.6",
  "react-native-dotenv": "^3.4.11",
  "@react-native-async-storage/async-storage": "2.1.2"
}
```

## 🏗️ Estructura del Proyecto

```
src/
├── config/
│   └── firebase.js          # Configuración de Firebase
├── context/
│   └── AuthContext.js       # Context para manejo de autenticación
├── navigation/
│   └── Navigation.js        # Configuración de navegación
└── screens/
    ├── Login.js            # Pantalla de inicio de sesión
    ├── Registrar.js        # Pantalla de registro
    ├── Home.js             # Pantalla principal
    ├── Profile.js          # Pantalla de perfil
    └── SplashScreen.js     # Pantalla de carga
```

## 🔧 Configuración de Firebase

### 1. Crear proyecto en Firebase Console
- Ir a [Firebase Console](https://console.firebase.google.com/)
- Crear nuevo proyecto
- Habilitar Authentication y Firestore

### 2. Configurar Authentication
- Habilitar el método de "Email/Password"
- Configurar dominios autorizados si es necesario

### 3. Configurar Firestore
- Crear base de datos en modo de prueba
- Configurar reglas de seguridad según necesidades

### Reglas de Firestore recomendadas:
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /usuarios/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

## 🎯 Campos del Usuario

La aplicación maneja los siguientes campos para cada usuario:

- **Nombre**: Nombre completo del estudiante
- **Email**: Correo electrónico (usado para autenticación)
- **Edad**: Edad del estudiante (15-100 años)
- **Especialidad**: Área de estudio o especialización


## 🎥 Video Demostrativo

*[https://drive.google.com/file/d/1WhKkbI0NApRxxx8laMLP5Lq-0_vgEUJE/view?usp=sharing](https://drive.google.com/file/d/1WhKkbI0NApRxxx8laMLP5Lq-0_vgEUJE/view?usp=sharing)*

## 🔒 Seguridad

- Autenticación segura con Firebase Auth
- Validación de datos en cliente y servidor
- Reglas de seguridad en Firestore
- Reautenticación para cambios sensibles

## 🧪 Testing

Para ejecutar las pruebas (cuando estén implementadas):
```bash
npm test
```

## 🚀 Despliegue

### Para Android:
```bash
expo build:android
```

### Para iOS:
```bash
expo build:ios
```

## 🤝 Contribución

1. Fork del proyecto
2. Crear rama para nueva funcionalidad (`git checkout -b feature/nueva-funcionalidad`)
3. Commit de cambios (`git commit -am 'Agregar nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Crear Pull Request

## 📄 Licencia

Este proyecto es desarrollado con fines educativos para el Instituto Técnico Ricaldone.

- **Nombre del Estudiante** - *Luis Escobar* - Instituto Técnico Ricaldone
- **Carnet**: 20230639
- **Especialidad**: Desarrollo de Software

