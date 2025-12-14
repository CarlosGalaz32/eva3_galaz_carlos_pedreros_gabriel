import { Camera, CameraView } from 'expo-camera';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Location from 'expo-location';
import { router } from 'expo-router';
import { useState } from 'react';
import { Alert, Button, Image, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import 'react-native-get-random-values';
import { SafeAreaView } from 'react-native-safe-area-context';
import getTodoServicio, { NuevaTarea } from '../services/todo-servicio'; // Importa la interfaz desde el servicio
import { Usuario } from './login';

export default function CreateTaskScreen() {
    const [title, setTitle] = useState('');
    const [photoUri, setPhotoUri] = useState<string | undefined>(undefined);
    const [taskLocation, setTaskLocation] = useState<{ latitude: number; longitude: number } | undefined>(undefined);
    const [isCameraActive, setIsCameraActive] = useState(false);
    let cameraRef: any | null = null;

    // Función para obtener el token de la sesión
    const getToken = async (): Promise<string | null> => {
        try {
            const usuarioJson = await AsyncStorage.getItem('usuarioSesion');
            if (usuarioJson) {
                const usuario: Usuario = JSON.parse(usuarioJson);
                return usuario.token;
            }
        } catch (error) {
            console.error('Error obteniendo token:', error);
        }
        return null;
    };

    // Manejo de la Cámara (sin cambios)
    const requestCameraPermission = async () => {
        const { status } = await Camera.requestCameraPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Permiso Requerido', 'Necesitamos permiso para acceder a la cámara.');
            return false;
        }
        return true;
    };

    const takePicture = async () => {
        if (cameraRef) {
            if (cameraRef.takePictureAsync) {
                const photo = await cameraRef.takePictureAsync();
                setPhotoUri(photo.uri);
                setIsCameraActive(false);
            } else {
                alert("Error: La referencia de la cámara no está lista para tomar fotos.");
            }
        }
    };

    // Manejo de la Localización (sin cambios)
    const getLocation = async () => {
        try {
            const hasServices = await Location.hasServicesEnabledAsync();
            if (!hasServices) {
                Alert.alert('Servicios Desactivados', 'Por favor, activa la ubicación (GPS) en tu dispositivo.');
                return;
            }

            const { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert('Permiso Requerido', 'Necesitamos permiso para acceder a la ubicación.');
                setTaskLocation(undefined);
                return;
            }

            const location = await Location.getCurrentPositionAsync({
                accuracy: Location.Accuracy.High,
            });

            setTaskLocation({
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
            });
        } catch (error) {
            console.error("Error obteniendo ubicación:", error);
            Alert.alert('Error', 'No se pudo obtener la ubicación. Inténtalo de nuevo.');
        }
    };

    // Manejo de la Persistencia 
    const handleSaveTask = async () => {
        const token = await getToken();
        if (!token) {
            Alert.alert('Error de Sesión', 'Debe iniciar sesión para crear una tarea.');
            return;
        }

        if (!taskLocation) {
            Alert.alert('Error', 'Debe obtener la ubicación antes de guardar.');
            return;
        }

        // Crea el payload usando la interfaz NuevaTarea
        const nuevaTareaPayload: NuevaTarea = {
            title: title,
            completed: false,
            location: taskLocation, 
            photoUri: photoUri || 'https://picsum.photos/300/200.jpg', // Valor por defecto si no hay foto
        };

        console.log('Token usado:', token); 
        console.log('Payload enviado:', nuevaTareaPayload); 

        const todoService = getTodoServicio({ token });
        try {
            await todoService.nuevaTarea(nuevaTareaPayload);
            Alert.alert('Éxito', 'Tarea creada correctamente en el backend.');
            router.back();
        } catch (error: any) {
            Alert.alert('Error', `No se pudo crear la tarea. Detalles: ${error.message || 'Error desconocido'}`);
        }
    };

    // Renderizado (sin cambios)
    if (isCameraActive) {
        return (
            <CameraView
                style={StyleSheet.absoluteFill}
                facing={'back'}
                ref={ref => { cameraRef = ref; }}
            >
                <View style={styles.cameraControls}>
                    <Button title="Tomar Foto" onPress={takePicture} />
                    <Button title="Cancelar" onPress={() => setIsCameraActive(false)} color="red" />
                </View>
            </CameraView>
        );
    }

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
            <ScrollView style={styles.container}>
                <Text style={styles.title}>Crear Nueva Tarea</Text>

                <TextInput
                    style={styles.input}
                    placeholder="Título de la Tarea"
                    value={title}
                    onChangeText={setTitle}
                />

                <View style={styles.buttonContainer}>
                    <Button title="📸 Añadir Foto" onPress={() => { requestCameraPermission().then(granted => granted && setIsCameraActive(true)) }} />
                    <Button title="📍 Obtener Ubicación" onPress={getLocation} />
                </View>

                {photoUri && (
                    <View style={styles.mediaPreview}>
                        <Text style={styles.previewTitle}>Foto Adjunta:</Text>
                        <Image source={{ uri: photoUri }} style={styles.imagePreview} />
                    </View>
                )}

                {taskLocation && (
                    <View style={styles.mediaPreview}>
                        <Text style={styles.previewTitle}>Ubicación:</Text>
                        <Text>Lat: {taskLocation.latitude.toFixed(4)}, Lon: {taskLocation.longitude.toFixed(4)}</Text>
                    </View>
                )}

                <Button title="Guardar Tarea" onPress={handleSaveTask} disabled={!title || !location} />
            </ScrollView>
        </SafeAreaView>
    );
}

// Estilos 
const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 10,
        marginBottom: 15,
        borderRadius: 5,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: 20,
    },
    mediaPreview: {
        marginBottom: 20,
        padding: 10,
        backgroundColor: '#f9f9f9',
        borderRadius: 5,
        borderLeftWidth: 3,
        borderLeftColor: '#3478f6',
    },
    previewTitle: {
        fontWeight: '600',
        marginBottom: 5,
    },
    imagePreview: {
        width: '100%',
        height: 200,
        borderRadius: 5,
        marginTop: 5,
    },
    cameraControls: {
        flex: 1,
        backgroundColor: 'transparent',
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'flex-end',
        padding: 20,
    }
});