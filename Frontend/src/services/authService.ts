import { api } from "./api";

export interface User {
    id: string;
    name: string;
    email: string;
    createdAt: string;
}

type AuthResponse = { token: string; user: User };

/* login */
export async function loginService(credentials: {
    email: string;
    password: string;
}) {
    const { data } = await api.post<AuthResponse>("/users/login", credentials);
    return data;
}

/* register */
export async function registerService(payload: {
    name: string;
    email: string;
    password: string;
}) {
    const { data } = await api.post<AuthResponse>("/users/register", payload);
    return data;
}

/*  útil para hidratação automática ou refresh */
export async function meService() {
    const { data } = await api.get<User>("/users/me");
    return data;
}
