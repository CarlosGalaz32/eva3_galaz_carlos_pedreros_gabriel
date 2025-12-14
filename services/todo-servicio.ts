import { API_URL } from "@/constants/config";
import axios from "axios";

export interface Todo {
    id: string;
    title: string;
    completed: boolean;
    location?: {
        latitude: number;
        longitude: number;
    };
    photoUri: string;
}

export interface TodoRespuesta {
    success: boolean;
    data: Todo[];
    count: number;
}

export interface NuevaTarea{
    title: string;
    completed: boolean;
    location :{
        latitude: number;
        longitude: number;
    };
    photoUri: string;
}

export interface UpdateTodoPayload {
    completed: boolean;
}

export default function getTodoServicio({token}: {token: string}) {
    const clienteT = axios.create({
        baseURL: `${API_URL}/`,
        headers: {
            Authorization: `Bearer ${token}`,
        },
    })

    async function getTodos(): Promise<TodoRespuesta> {
        try {       
            const respuesta = await clienteT.get<TodoRespuesta>('todos');      
            return respuesta.data;     
        } catch (error) {
            throw error;
        }
        
    }

    async function nuevaTarea(tarea: NuevaTarea): Promise<void> {
        try {       
            await clienteT.post('todos', tarea);      
        } catch (error) {
            throw error;
        }
        
    }
    
    async function updateTodo(id: string, payload: UpdateTodoPayload): Promise<void> {
        try {
            await clienteT.patch(`/todos/${id}`, payload);
        } catch (error) {
            throw error;
        }
    }

    async function deleteTodo(id: string): Promise<void> {
        try {
            await clienteT.delete(`/todos/${id}`);
        } catch (error) {
            throw error;
        }
    }

    async function uploadImage(imageUri: string): Promise<string> {
    const formData = new FormData();
    formData.append('image', {
        uri: imageUri,
        name: 'photo.jpg',
        type: 'image/jpeg',
    } as any);

    try {
        const respuesta = await clienteT.post('/images', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return respuesta.data.data.url;
    } catch (error) {
        throw error;
    }
}

    return {
        getTodos,
        nuevaTarea,
        updateTodo,
        deleteTodo,
        uploadImage,
    }
}