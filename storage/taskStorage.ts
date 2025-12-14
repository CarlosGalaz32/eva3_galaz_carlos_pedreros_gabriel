import AsyncStorage from '@react-native-async-storage/async-storage';

const USER_ID_KEY = '@UserLoggedInId';

export const getLoggedInUserId = async (): Promise<string | null> => {
    try {
        return await AsyncStorage.getItem(USER_ID_KEY);
    } catch (e) {
        console.error('Error al obtener el ID del usuario:', e);
        return null;
    }
};

// Define la interfaz del modelo de tarea
export interface Task {
    id: string;
    userId: string;
    title: string;
    isCompleted: boolean;
    photoUri?: string;
    location?: {
        latitude: number;
        longitude: number;
        timestamp: number;
    };
}

const TASKS_STORAGE_KEY = '@TodoApp:tasks';

//Obtiene todas las tareas guardadas.
export const getTasks = async (): Promise<Task[]> => {
    try {
        const jsonValue = await AsyncStorage.getItem(TASKS_STORAGE_KEY);
        return jsonValue != null ? JSON.parse(jsonValue) : [];
    } catch (e) {
        console.error('Error al obtener tareas:', e);
        return [];
    }
};

// Guarda un array de tareas en AsyncStorage.
export const saveTasks = async (tasks: Task[]): Promise<void> => {
    try {
        const jsonValue = JSON.stringify(tasks);
        await AsyncStorage.setItem(TASKS_STORAGE_KEY, jsonValue);
    } catch (e) {
        console.error('Error al guardar tareas:', e);
    }
};

//Añade una nueva tarea a la lista existente.
export const addTask = async (newTask: Task): Promise<void> => {
    const currentTasks = await getTasks();
    // Verifica que solo se añada si la tarea no existe ya (usando el ID)
    if (currentTasks.some(task => task.id === newTask.id)) {
        return;
    }
    const updatedTasks = [...currentTasks, newTask];
    await saveTasks(updatedTasks);
};

// Actualiza una tarea por su ID.
export const updateTask = async (updatedTask: Task): Promise<void> => {
    const currentTasks = await getTasks();
    const updatedTasks = currentTasks.map(task =>
        task.id === updatedTask.id ? updatedTask : task
    );
    await saveTasks(updatedTasks);
};


 // Elimina una tarea por su ID.
 
export const deleteTask = async (taskId: string): Promise<void> => {
    const currentTasks = await getTasks();
    const updatedTasks = currentTasks.filter(task => task.id !== taskId);
    await saveTasks(updatedTasks);
};