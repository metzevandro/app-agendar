import * as z from "zod";

export const SettingsSchema = z
  .object({
    name: z.optional(z.string()),
    email: z.optional(z.string().email()),
    password: z.optional(z.string().min(6)),
    newPassword: z.optional(z.string().min(6)),
  })
  .refine(
    (data) => {
      if (data.password && !data.newPassword) {
        return false;
      }

      return true;
    },
    {
      message: "New password is required!",
      path: ["newPassword"],
    }
  )
  .refine(
    (data) => {
      if (data.newPassword && !data.password) {
        return false;
      }

      return true;
    },
    {
      message: "Password is required!",
      path: ["password"],
    }
  );

export const NovaSenhaSchema = z.object({
  password: z.string().min(8, "É necessário no mínimo 8 caracteres!"),
});

export const ResetSchema = z.object({
  email: z.string().email("É necessário um email!"),
});

export const LoginSchema = z.object({
  email: z.string().email("É necessário um email!"),
  password: z.string().min(1, "É necessário senha!"),
});

export const RegisterSchema = z.object({
  email: z.string().email("É necessário um email!"),
  password: z.string().min(8, "É necessário no mínimo 8 caracteres!"),
  name: z.string().min(1, "É necessário seu nome!"),
});

export const EnterFormSchema = z.object({
  username: z.string().optional(),
  name: z.string().optional(),
  horarios: z.object({
    horaInicio: z.string().optional(),
    horaFim: z.string().optional(),
  }).optional(),
  diasDisponiveis: z.object({
    Domingo: z.boolean().optional(),
    Segunda: z.boolean().optional(),
    Terça: z.boolean().optional(),
    Quarta: z.boolean().optional(),
    Quinta: z.boolean().optional(),
    Sexta: z.boolean().optional(),
    Sábado: z.boolean().optional(),
  }).optional(),
  image: z.string().optional(),
  sobre: z.string().optional(),
});