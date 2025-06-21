import { useAuth } from "../../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import TextInput from "../../components/ui/inputs/TextInput";
import EmailInput from "../../components/ui/inputs/EmailInput";
import PasswordInput from "../../components/ui/inputs/PasswordInput";
import PrimaryButton from "../../components/ui/PrimaryButton";

import {
    registerSchema,
    type RegisterFormData,
} from "../../schemas/auth";
import { showAlert } from "../../utils/alert";

export default function Register() {
    const { register: signup } = useAuth();
    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        watch,
    } = useForm<RegisterFormData>({
        resolver: zodResolver(registerSchema),
        mode: "onBlur",
    });

    const onSubmit = async (data: RegisterFormData) => {
        try {
            await signup(data.name, data.email, data.password);
            navigate("/tarefas");
        } catch {
            showAlert({
                title: "Erro ao cadastrar",
                text: "Tente novamente mais tarde.",
                icon: "error",
            });
        }
    };

    /* opcional: para exibir a força da senha em tempo-real */
    const currentPassword = watch("password");

    return (
        <main className="min-h-screen flex items-center justify-center bg-bg px-4">
            <div className="w-full max-w-md bg-surface shadow-xl rounded-2xl p-10">
                <h1 className="text-center text-3xl font-semibold text-primary mb-8">
                    Criar conta
                </h1>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <TextInput
                        label="Nome"
                        placeholder="Seu nome"
                        register={register("name")}
                        error={errors.name?.message}
                        required
                    />

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
                        register={register("password")}
                        error={errors.password?.message}
                        required
                    />

                    <PasswordInput
                        label="Repetir senha"
                        placeholder="••••••••"
                        register={register("confirmPassword")}
                        error={errors.confirmPassword?.message}
                        required
                    />

                    <PrimaryButton
                        type="submit"
                        loading={isSubmitting}
                        className="w-full"
                    >
                        Cadastrar
                    </PrimaryButton>
                </form>

                <p className="mt-6 text-center text-sm">
                    Já tem conta?{" "}
                    <Link to="/login" className="text-secondary font-bold underline">
                        Entrar
                    </Link>
                </p>
            </div>
        </main>
    );
}
