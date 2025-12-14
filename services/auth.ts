import { API_URL } from "@/constants/config";
import axios from "axios";

export interface CargaLogin {
    email: string;
    password: string;
}

export interface RespuestaLogin {
    success: boolean;
    data: {
        token: string;
    };
}

export type registraUsuario = CargaLogin;

export type RespuestaRegistro = RespuestaLogin;

export default function getAuth() {
    const cliente = axios.create({
        baseURL: `${API_URL}/auth`,
    })

    async function login(carga: CargaLogin): Promise<RespuestaLogin> {
        try {
            const respuesta = await cliente.post<RespuestaLogin>('/login', carga);
            return respuesta.data;
            
        } catch (error: any) {
            if (error.response && error.response.status === 401) {
            throw new Error('Credenciales incorrectas. Verifica tu email y contraseña.');
        }
            throw error;
        }
    }

    async function register(registrar: registraUsuario): Promise<RespuestaRegistro> {
        try {
            const respuesta = await cliente.post<RespuestaRegistro>('/register', registrar);
            return respuesta.data;
        } catch (error) {
            throw error;
        }
    
    }
    return {
        login,
        register,
    }
}