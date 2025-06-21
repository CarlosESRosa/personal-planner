import { api } from "./api";

export interface User {
    id: string;
    name: string;
    email: string;
}

/* ---------- login → só token ---------- */
export async function loginService(credentials: {
    email: string;
    password: string;
}) {
    const { data } = await api.post<{ token: string }>(
        "/users/login",
        credentials,
    );
    return data; // { token }
}

/* ---------- register → só token ---------- */
export async function registerService(payload: {
    name: string;
    email: string;
    password: string;
}) {
    const { data } = await api.post<{ token: string }>(
        "/users/register",
        payload,
    );
    return data; // { token }
}

/* ---------- usuário logado ---------- */
export async function meService() {
    const { data } = await api.get<User>("/users/me");
    return data; // { id, name, email }
}
