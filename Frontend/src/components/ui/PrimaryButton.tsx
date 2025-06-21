import { forwardRef } from "react";
import type { ButtonHTMLAttributes, ReactElement } from "react";

import {
    LockClosedIcon,
    ArrowPathIcon,
} from "@heroicons/react/24/solid";

import { cn } from "../../lib/utils";

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
    /** Ícone que acompanha o texto (ignorando quando `loading` estiver true). */
    icon?: ReactElement;
    /** Posição do ícone em relação ao texto. */
    iconPosition?: "left" | "right";
    /** Estado de carregamento. Ativa spinner, texto "Carregando…" e `cursor-wait`. */
    loading?: boolean;
}

const PrimaryButton = forwardRef<HTMLButtonElement, Props>(
    (
        {
            className,
            children,
            disabled = false,
            icon,
            iconPosition = "left",
            loading = false,
            ...rest
        },
        ref,
    ) => {
        // Botão fica desativado tanto se `disabled` quanto `loading` forem verdadeiros
        const isDisabled = disabled || loading;

        // Ícone para estados específicos
        const spinnerIcon = (
            <ArrowPathIcon className="w-4 h-4 shrink-0 animate-spin" />
        );

        const lockIcon = (
            <LockClosedIcon className="w-4 h-4 shrink-0" />
        );

        // Decide qual ícone será renderizado
        const effectiveIcon = loading
            ? spinnerIcon
            : isDisabled && !icon
                ? lockIcon
                : icon;

        return (
            <button
                ref={ref}
                className={cn(
                    // layout
                    "inline-flex items-center justify-center gap-2 px-5 py-2.5",
                    // typography & radius
                    "font-semibold text-sm md:text-base rounded-2xl",
                    // colors
                    "bg-primary text-on-primary",
                    // states
                    "hover:bg-primary-dark focus-visible:outline-none",
                    "focus-visible:ring-2 focus-visible:ring-primary-dark focus-visible:ring-offset-2 focus-visible:ring-offset-bg",
                    isDisabled ? "opacity-60 cursor-not-allowed" : "cursor-pointer",
                    loading && "cursor-wait",
                    // animation / depth
                    "transition-all duration-200 active:scale-95 shadow-soft hover:shadow-lg",
                    className,
                )}
                disabled={isDisabled}
                {...rest}
            >
                {iconPosition === "left" && effectiveIcon}
                <span>{loading ? "Carregando…" : children}</span>
                {iconPosition === "right" && effectiveIcon}
            </button>
        );
    },
);

PrimaryButton.displayName = "PrimaryButton";
export default PrimaryButton;
