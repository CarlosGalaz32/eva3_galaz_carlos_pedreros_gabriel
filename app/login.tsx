import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import getAuth from '../services/auth'; 
import { decodeJwt } from 'jose';
// Clave de almacenamiento para el token
const TOKEN_KEY = '@UserToken';

export interface Usuario {
  email: string
  id: string
  token: string
}

export interface CargaToken {
  sub: string
  email: string
}

export default function LoginScreen() {
  const [email, setEmail] = useState(""); 
  const [password, setPassword] = useState("");

  const handleEmailChange = (text: string) => {
    setEmail(text);
  };
  const handlePasswordChange = (text: string) => {
    setPassword(text);
  };

  const saveSessionToStorage = async (usuario: Usuario) => {
    try {
      const usuarioJson = JSON.stringify(usuario);
      await AsyncStorage.setItem('usuarioSesion', usuarioJson);
    } catch (error) {
      console.error('Error guardando sesión:', error);
    }
  };

  const handleLogin = async () => {
    const auth = getAuth();
    try {
      const respuesta = await auth.login({ email, password });
      const token = respuesta.data.token;
      console.log("Token recibido: ", token);
      const decodedToken = decodeJwt<CargaToken>(token);

      const loginUsuario: Usuario = {
        email: decodedToken.email,
        id: decodedToken.sub,
        token: token
      };

      await saveSessionToStorage(loginUsuario);

      if (respuesta.success) {
        // Almacena el token en lugar del ID
        await AsyncStorage.setItem(TOKEN_KEY, respuesta.data.token);
        router.navigate("/(tabs)");
      } else {
        alert("Credenciales incorrectas");
      }
    } catch (error) {
      alert(error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Login</Text>
      <TextInput
        style={styles.input}
        placeholder="email" 
        autoCapitalize="none"
        keyboardType="email-address"
        onChangeText={handleEmailChange}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        onChangeText={handlePasswordChange}
      />
      <Pressable onPress={handleLogin} style={styles.button}>
        <Text style={styles.buttonText}>Login</Text>
      </Pressable>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 24,
    textAlign: 'center',
    color: '#333',
  },
  input: {
    height: 48,
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  button: {
    height: 48,
    backgroundColor: '#3478f6',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
  },
});

