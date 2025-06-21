import { ArrowDownTrayIcon } from "@heroicons/react/24/solid";
import PrimaryButton from "../../components/ui/PrimaryButton";
import TextInput from "../../components/ui/inputs/TextInput";
import EmailInput from "../../components/ui/inputs/EmailInput";
import PasswordInput from "../../components/ui/inputs/PasswordInput";

export default function StyleGuide() {
    return (
        <div className="space-y-12 p-8 bg-bg text-accent">
            <h1 className="text-3xl font-bold">Style Guide</h1>

            {/* === Botões ======================================================= */}
            <section className="space-y-6">
                <h2 className="text-2xl font-semibold">Botões</h2>
                <div className="flex flex-wrap gap-4">
                    <PrimaryButton>Default</PrimaryButton>
                    <PrimaryButton icon={<ArrowDownTrayIcon className="w-4 h-4" />}>Com ícone</PrimaryButton>
                    <PrimaryButton loading>Salvando</PrimaryButton>
                    <PrimaryButton disabled>Desabilitado</PrimaryButton>
                </div>
            </section>

            {/* === Inputs ======================================================= */}
            <section className="space-y-6">
                <h2 className="text-2xl font-semibold">Inputs</h2>
                <div className="grid gap-6 sm:grid-cols-2">
                    {/* TextInput variants */}
                    <div className="space-y-3">
                        <p className="font-medium">TextInput</p>
                        <TextInput label="Normal" placeholder="Digite algo..." />
                        <TextInput label="Erro" placeholder="Digite algo..." error="Campo obrigatório" />
                        <TextInput label="Desabilitado" placeholder="Não editável" disabled />
                    </div>

                    {/* EmailInput variants */}
                    <div className="space-y-3">
                        <p className="font-medium">EmailInput</p>
                        <EmailInput label="E-mail" placeholder="voce@exemplo.com" />
                        <EmailInput label="E-mail com erro" placeholder="example@" error="E-mail inválido" />
                        <EmailInput label="Desabilitado" placeholder="Desativado" disabled />
                    </div>

                    {/* PasswordInput variants */}
                    <div className="space-y-3">
                        <p className="font-medium">PasswordInput</p>
                        <PasswordInput label="Senha" placeholder="••••••••" />
                        <PasswordInput label="Senha com erro" placeholder="••••••••" error="Senha fraca" />
                        <PasswordInput label="Desabilitado" placeholder="••••••••" disabled />
                    </div>
                </div>
            </section>
        </div>
    );
}
