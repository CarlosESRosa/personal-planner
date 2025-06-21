import {
    forwardRef,
    type InputHTMLAttributes,
    type ReactNode,
} from "react";
import type { UseFormRegisterReturn } from "react-hook-form";
import { cn } from "../../../lib/utils";

interface BaseInputProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    icon?: ReactNode;
    register?: UseFormRegisterReturn;
    required?: boolean;
    /** Conteúdo adicional (ex.: botão de visibilidade) renderizado dentro do wrapper, NÃO como filho do <input>. */
    children?: ReactNode;
}

/**
 * Componente base para todos os inputs. Evita que a propriedade `children`
 * seja repassada ao <input>, pois ele é um elemento void.
 */
const BaseInput = forwardRef<HTMLInputElement, BaseInputProps>(
    (
        {
            className,
            label,
            error,
            icon,
            required,
            register,
            children, // ⚠️ NÃO repassar ao <input>
            ...props
        },
        ref,
    ) => (
        <div className="space-y-1">
            {label && (
                <label className="block text-sm font-medium text-accent">
                    {label}
                    {required && <span className="text-error ml-px">*</span>}
                </label>
            )}

            <div className="relative">
                {icon && (
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        {icon}
                    </span>
                )}

                {/* Input real */}
                <input
                    ref={ref}
                    className={cn(
                        "w-full rounded-md px-4 py-2 bg-surface",
                        "border text-accent placeholder-accent-light",
                        "focus:outline-none focus:ring-2 focus:ring-primary/20",
                        "disabled:opacity-50 disabled:cursor-not-allowed",
                        error ? "border-error focus:ring-error/25" : "border-gray-500/40",
                        icon && "pl-10",
                        children && "pr-10", // espaço p/ botão à direita
                        className,
                    )}
                    required={required}
                    // REGISTRAR primeiro p/ não sobrescrever handlers do RHF
                    {...register}
                    {...props}
                />

                {/* Slot para conteúdo extra, ex.: toggle de senha */}
                {children && (
                    <span className="absolute inset-y-0 right-0 flex items-center pr-3">
                        {children}
                    </span>
                )}
            </div>

            {error && (
                <p className="text-sm text-error animate-fade-in">{error}</p>
            )}
        </div>
    ),
);

BaseInput.displayName = "BaseInput";
export default BaseInput;
