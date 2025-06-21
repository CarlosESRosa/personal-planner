/* ./src/lib/utils.ts */
import clsx, { type ClassValue } from "classnames";
import { twMerge } from "tailwind-merge";

/**
 * Junta classes utilitárias de forma segura,
 * fazendo merge de regras duplicadas do Tailwind.
 */
export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(...inputs));
}
