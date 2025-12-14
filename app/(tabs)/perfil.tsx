import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Usuario } from '../login'; // Importa la interfaz

export default function PerfilScreen() {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadSession = async () => {
      try {
        const usuarioJson = await AsyncStorage.getItem('usuarioSesion');
        if (usuarioJson) {
          const parsedUsuario: Usuario = JSON.parse(usuarioJson);
          setUsuario(parsedUsuario);
        } // No redirigir aquí, ya se maneja en raíz
      } catch (error) {
        console.error('Error cargando sesión:', error);
      } finally {
        setLoading(false);
      }
    };
    loadSession();
  }, []);

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('usuarioSesion');
      await AsyncStorage.removeItem('@UserToken');
      router.replace('/login');
    } catch (error) {
      console.error('Error en logout:', error);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <Text>Cargando perfil...</Text>
      </SafeAreaView>
    );
  }

  if (!usuario) {
    return (
      <SafeAreaView style={styles.container}>
        <Text>No hay datos de usuario.</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Perfil</Text>
      <View style={styles.infoContainer}>
        <Text style={styles.label}>Usuario: {usuario.email}</Text>
      </View>
      <Pressable onPress={handleLogout} style={styles.logoutButton}>
        <Text style={styles.buttonText}>Logout</Text>
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
    infoContainer: {
        marginBottom: 24,
    },
    label: {
        fontSize: 18,
        marginBottom: 8,
        color: '#333',
    },
    button: {
        height: 48,
        backgroundColor: '#3478f6',
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 8,
    },
    logoutButton: {
        height: 48,
        backgroundColor: '#ff4444',
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