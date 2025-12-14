import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router, useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { Alert, FlatList, Image, Pressable, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import getTodoServicio, { Todo } from '../../services/todo-servicio'; // Importa Todo
import { Usuario } from '../login';

interface TaskItemProps {
  task: Todo;
  onToggleComplete: (taskId: string, completed: boolean) => void;
  onDelete: (taskId: string) => void;
}

const TaskItem = ({ task, onToggleComplete, onDelete }: TaskItemProps) => {
  return (
    <View style={styles.taskItem}>
      <TouchableOpacity onPress={() => onToggleComplete(task.id, !task.completed)} style={styles.taskTitleContainer}>
        <Ionicons
          name={task.completed ? "checkbox-outline" : "square-outline"}
          size={24}
          color={task.completed ? "green" : "gray"}
          style={styles.checkbox}
        />
        <View style={styles.taskTextContainer}>
          <Text style={[styles.taskTitle, task.completed && styles.taskTitleCompleted]}>
            {task.title}
          </Text>
          {task.location && (  
            <Text style={styles.taskLocation}>
              Lat: {task.location.latitude.toFixed(4)}, Lon: {task.location.longitude.toFixed(4)}
            </Text>
          )}
        </View>
      </TouchableOpacity>

      {task.photoUri && task.photoUri !== '' && (
        <Image source={{ uri: task.photoUri }} style={styles.taskImage} />
      )}

      <TouchableOpacity onPress={() => onDelete(task.id)} style={styles.deleteButton}>
        <Ionicons name="trash-outline" size={24} color="red" />
      </TouchableOpacity>
    </View>
  );
};

export default function TodoListScreen() {
  const [tasks, setTasks] = useState<Todo[]>([]);
  const [isLoading, setIsLoading] = useState(true);

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

  const loadTasks = async () => {
    setIsLoading(true);
    const token = await getToken();
    if (!token) {
      setTasks([]);
      setIsLoading(false);
      return;
    }

    const todoService = getTodoServicio({ token });
    try {
      const respuesta = await todoService.getTodos();
      if (respuesta.success) {
        setTasks(respuesta.data.map(task => ({ ...task, completed: task.completed })));
      } else {
        setTasks([]);
      }
    } catch (error) {
      console.error('Error obteniendo tareas de la API:', error);
      setTasks([]);
    } finally {
      setIsLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadTasks();
    }, [])
  );

  const handleToggleComplete = async (taskId: string, completed: boolean) => {
    const token = await getToken();
    if (!token) {
      Alert.alert('Error', 'Sesión expirada. Inicia sesión de nuevo.');
      return;
    }

    const todoService = getTodoServicio({ token });
    try {
      await todoService.updateTodo(taskId, { completed });
      setTasks(prevTasks => prevTasks.map(t =>
        t.id === taskId ? { ...t, completed } : t 
      ));
    } catch (error) {
      console.error('Error actualizando tarea:', error);
      Alert.alert('Error', 'No se pudo actualizar la tarea. Inténtalo de nuevo.');
    }
  };

const handleDeleteTask = async (taskId: string) => {
    Alert.alert(
        "Confirmar Eliminación",
        "¿Estás seguro de que quieres eliminar esta tarea?",
        [
            { text: "Cancelar", style: "cancel" },
            {
                text: "Eliminar",
                style: "destructive",
                onPress: async () => {
                    const token = await getToken();
                    if (!token) {
                        Alert.alert('Error', 'Sesión expirada. Inicia sesión de nuevo.');
                        return;
                    }

                    const todoService = getTodoServicio({ token });
                    try {
                        await todoService.deleteTodo(taskId);
                        setTasks(prevTasks => prevTasks.filter(t => t.id !== taskId));
                    } catch (error) {
                        console.error('Error eliminando tarea:', error);
                        Alert.alert('Error', 'No se pudo eliminar la tarea. Inténtalo de nuevo.');
                    }
                }
            },
        ]
    );
};

  if (isLoading) {
    return <View style={styles.centerContainer}><Text>Cargando tareas...</Text></View>;
  }

  if (!tasks.length) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centerContainer}>
          <Text style={styles.emptyText}>No hay sesión activa. Inicia sesión para ver tus tareas.</Text>
          <Pressable onPress={() => router.replace('/login')} style={styles.loginButton}>
            <Text style={styles.buttonText}>Ir al Login</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>Mis Tareas Pendientes</Text>

      <FlatList
        data={tasks}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TaskItem
            task={item}
            onToggleComplete={handleToggleComplete}
            onDelete={handleDeleteTask}
          />
        )}
        ListEmptyComponent={() => (
          <Text style={styles.emptyText}>No tienes tareas. ¡Crea una!</Text>
        )}
      />

      <Pressable
        style={styles.floatingButton}
        onPress={() => router.navigate("/create")}
      >
        <Ionicons name="add" size={32} color="white" />
      </Pressable>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#f0f4f7',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
    paddingHorizontal: 10,
  },
  taskItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    marginVertical: 5,
    backgroundColor: '#fff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 3,
  },
    taskImage: {
    width: 50,
    height: 50,
    borderRadius: 5,
    marginLeft: 10,
  },
  taskTextContainer: {
    flex: 1,
  },
  taskLocation: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  taskTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  checkbox: {
    marginRight: 10,
  },
  taskTitle: {
    fontSize: 16,
    flexShrink: 1,
  },
  taskTitleCompleted: {
    textDecorationLine: 'line-through',
    color: 'gray',
  },
  deleteButton: {
    marginLeft: 10,
    padding: 5,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 50,
    fontSize: 16,
    color: '#666',
  },
  floatingButton: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#3478f6',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  loginButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#3478f6',
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
});