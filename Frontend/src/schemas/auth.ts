import { z } from "zod";

export const loginSchema = z.object({
    email: z.string().email("E-mail inválido"),
    senha: z.string().min(8, "Min. 8 caracteres"),
});

export const registerSchema = z
    .object({
        name: z
            .string()
            .min(2, "Nome muito curto")
            .max(60, "Máx. 60 caracteres"),
        email: z.string().email("E-mail inválido"),
        password: z
            .string()
            .min(8, "Min. 8 caracteres")
            .regex(/[A-Z]/, "1 letra maiúscula")
            .regex(/[a-z]/, "1 letra minúscula")
            .regex(/[0-9]/, "1 número"),
        confirmPassword: z.string(),
    })
    .refine((data) => data.password === data.confirmPassword, {
        path: ["confirmPassword"],
        message: "As senhas precisam ser iguais",
    });

export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;