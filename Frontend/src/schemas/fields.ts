/* ./src/schemas/fields.ts */
import { z } from "zod";

export const textSchema = z
    .string()
    .min(1, "Campo obrigatório")
    .max(100, "Máx. 100 caracteres");

export const emailSchema = z
    .string()
    .email("E-mail inválido")
    .min(1, "Campo obrigatório");

export const passwordSchema = z
    .string()
    .min(8, "Min. 8 caracteres")
    .regex(/[A-Z]/, "1 letra maiúscula")
    .regex(/[a-z]/, "1 letra minúscula")
    .regex(/[0-9]/, "1 número");
