import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/use-color-scheme';

export const unstable_settings = {
  // Define la ruta inicial al cargar la aplicación (debe ser la pantalla de login)
  initialRouteName: 'login',
};

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        {/* 1. Ruta de Login (Pantalla inicial sin encabezado) */}
        <Stack.Screen name="login" options={{ headerShown: false }} />

        {/* 2. Ruta de Pestañas (Contiene el listado de tareas) */}
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />

        {/* 3. ¡NUEVA RUTA! Ruta para la Creación de Tareas */}
        {/* Asumiendo que el archivo de creación está en app/create.tsx */}
        <Stack.Screen
          name="create"
          options={{
            presentation: 'modal',
            title: 'Crear Tarea'
          }}
        />

        {/* 4. Ruta Modal (Si la tienes, déjala aquí) */}
        <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />

      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}