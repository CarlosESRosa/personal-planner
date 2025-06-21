import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import Swal from "sweetalert2";
import { loginService, registerService, meService, type User } from "../services/authService";
import { api } from "../services/api";

interface AuthContextData {
    user: User | null;
    token: string | null;
    loading: boolean;
    login: (email: string, password: string) => Promise<void>;
    register: (n: string, e: string, p: string) => Promise<void>;
    logout: () => void;
}

// util p/ setar/remover Authorization global no Axios
function setAuthHeader(token: string | null) {
    if (token) {
        api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    } else {
        delete api.defaults.headers.common["Authorization"];
    }
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    /* ---------- hidratar do localStorage ---------- */
    useEffect(() => {
        const storagedToken = localStorage.getItem("access_token");

        if (storagedToken) {
            setToken(storagedToken);
            setAuthHeader(storagedToken);

            // tenta buscar o usuário
            meService()
                .then(setUser)
                .catch(() => {
                    // token inválido → limpa tudo
                    localStorage.removeItem("access_token");
                    setAuthHeader(null);
                    setToken(null);
                })
                .finally(() => setLoading(false));
        } else {
            setLoading(false);
        }
    }, []);

    /* ---------- login ---------- */
    const login = async (email: string, password: string) => {
        try {
            setLoading(true);
            const { token, user } = await loginService({ email, password });

            localStorage.setItem("access_token", token);
            localStorage.setItem("user", JSON.stringify(user));
            api.defaults.headers.common.Authorization = `Bearer ${token}`;

            setToken(token);
            setUser(user);
        } finally {
            setLoading(false);
        }
    };

    /* ---------- register ---------- */
    const register = async (name: string, email: string, password: string) => {
        try {
            setLoading(true);
            const { token, user } = await registerService({ name, email, password });

            localStorage.setItem("access_token", token);
            localStorage.setItem("user", JSON.stringify(user));
            api.defaults.headers.common.Authorization = `Bearer ${token}`;

            setToken(token);
            setUser(user);
        } finally {
            setLoading(false);
        }
    };

    /* ---------- logout ---------- */
    const logout = () => {
        localStorage.clear();
        setAuthHeader(null);
        setToken(null);
        setUser(null);
    };

    return (
        <AuthContext.Provider
            value={{ user, token, loading, login, register, logout }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
