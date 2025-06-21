import axios from "axios";
import Swal from "sweetalert2";

export const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL ?? "http://localhost:3333/api/v1",
    timeout: 10_000,
});

// Anexa token a todas as requisições
api.interceptors.request.use((config) => {
    const token = localStorage.getItem("access_token");
    if (token) config.headers!["Authorization"] = `Bearer ${token}`;
    return config;
});

// Trata 401 globalmente
api.interceptors.response.use(
    (res) => res,
    (err) => {
        if (err.response?.status === 401) {
            Swal.fire("Sessão expirada", "Faça login novamente", "warning").then(
                () => {
                    localStorage.clear();
                    window.location.href = "/login";
                }
            );
        }
        return Promise.reject(err);
    }
);