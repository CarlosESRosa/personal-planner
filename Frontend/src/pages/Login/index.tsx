import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import EmailInput from "../../components/ui/inputs/EmailInput";
import PasswordInput from "../../components/ui/inputs/PasswordInput";
import PrimaryButton from "../../components/ui/PrimaryButton";

import { loginSchema, type LoginFormData } from "../../schemas/auth";
import { showAlert } from "../../utils/alert";

export default function Login() {
    const { login } = useAuth();
    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
        mode: "onBlur",
    });

    const onSubmit = async (data: LoginFormData) => {
        try {
            await login(data.email, data.senha);
            navigate("/tarefas");
        } catch {
            showAlert({
                title: "Erro ao entrar",
                text: "Credenciais inválidas. Verifique seu e-mail e senha.",
                icon: "error",
            });
        }
    };

    return (
        <main className="min-h-screen flex items-center justify-center bg-bg px-4">
            <div className="w-full max-w-md bg-surface shadow-xl rounded-2xl p-10">
                <h1 className="text-center text-3xl font-semibold text-primary mb-8">
                    Entrar
                </h1>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <EmailInput
                        label="E-mail"
                        placeholder="email@exemplo.com"
                        register={register("email")}
                        error={errors.email?.message}
                        required
                    />

                    <PasswordInput
                        label="Senha"
                        placeholder="••••••••"
                        register={register("senha")}
                        error={errors.senha?.message}
                        required
                    />

                    <PrimaryButton
                        type="submit"
                        loading={isSubmitting}
                        className="w-full"
                    >
                        Entrar
                    </PrimaryButton>
                </form>

                <p className="mt-6 text-center text-sm">
                    Ainda não tem conta?{" "}
                    <a
                        href="/cadastro"
                        className="text-secondary font-bold underline"
                    >
                        Cadastre-se agora
                    </a>
                </p>
            </div>
        </main>
    );
}
