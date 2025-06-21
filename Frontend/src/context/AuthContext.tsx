import {
    createContext,
    useContext,
    useEffect,
    useState,
    type ReactNode,
} from "react";

import {
    loginService,
    registerService,
    meService,
    type User,
} from "../services/authService";
import { api } from "../services/api";
import { scheduleSessionExpiry } from "../utils/session";
import { useAlert } from "../components/ui/AlertProvider";

interface AuthContextData {
    user: User | null;
    token: string | null;
    loading: boolean;
    login: (email: string, password: string) => Promise<void>;
    register: (n: string, e: string, p: string) => Promise<void>;
    logout: () => void;
}

/* ---------- helper p/ header ---------- */
function setAuthHeader(token: string | null) {
    if (token) {
        api.defaults.headers.common.Authorization = `Bearer ${token}`;
    } else {
        delete api.defaults.headers.common.Authorization;
    }
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const { show } = useAlert();

    /* ---------- quando token expira ---------- */
    function handleSessionExpire() {
        logout(false); // não mostrar toast duplo
        show({
            variant: "error",
            title: "Sessão expirada",
            message: "Faça login novamente.",
        });
    }

    /* ---------- hidratação localStorage ---------- */
    useEffect(() => {
        const storagedToken = localStorage.getItem("access_token");
        const storagedUser = localStorage.getItem("user");

        if (storagedToken) {
            setToken(storagedToken);
            setAuthHeader(storagedToken);
            scheduleSessionExpiry(storagedToken, handleSessionExpire);

            if (storagedUser && storagedUser !== "undefined") {
                setUser(JSON.parse(storagedUser));
                setLoading(false);
            } else {
                // se não houver user salvo, busca na API
                meService()
                    .then((u) => {
                        setUser(u);
                        localStorage.setItem("user", JSON.stringify(u));
                    })
                    .catch(() => logout(false))
                    .finally(() => setLoading(false));
            }
        } else {
            setLoading(false);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    /* ---------- login ---------- */
    const login = async (email: string, password: string) => {
        try {
            setLoading(true);

            const { token, user } = await loginService({ email, password });

            localStorage.setItem("access_token", token);
            localStorage.setItem("user", JSON.stringify(user));
            setAuthHeader(token);
            scheduleSessionExpiry(token, handleSessionExpire);

            setToken(token);
            setUser(user);

            show({ variant: "success", title: "Bem-vindo!" });
        } catch (err: any) {
            show({
                variant: "error",
                title: "Erro ao entrar",
                message: err?.response?.data?.message ?? "Credenciais inválidas.",
            });
            throw err;
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
            setAuthHeader(token);
            scheduleSessionExpiry(token, handleSessionExpire);

            setToken(token);
            setUser(user);

            show({ variant: "success", title: "Conta criada!" });
        } catch (err: any) {
            show({
                variant: "error",
                title: "Erro ao cadastrar",
                message: err?.response?.data?.message ?? "Tente novamente.",
            });
            throw err;
        } finally {
            setLoading(false);
        }
    };

    /* ---------- logout ---------- */
    const logout = (withToast = true) => {
        localStorage.clear();
        setAuthHeader(null);
        setToken(null);
        setUser(null);
        if (withToast) {
            show({ variant: "info", title: "Você saiu." });
        }
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
