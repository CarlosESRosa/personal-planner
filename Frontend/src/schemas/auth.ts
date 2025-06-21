import { z } from "zod";

export const loginSchema = z.object({
    email: z.string().email("E-mail inválido"),
    senha: z.string().min(8, "Min. 8 caracteres"),
});

export type LoginFormData = z.infer<typeof loginSchema>;
