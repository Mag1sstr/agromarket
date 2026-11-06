import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().trim().min(2, "Имя — минимум 2 символа").max(100),
  email: z.string().trim().toLowerCase().email("Некорректный e-mail"),
  password: z.string().min(8, "Пароль — минимум 8 символов").max(72),
});

export const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email(),
  password: z.string().min(1).max(72),
});

export const productSchema = z.object({
  name: z.string().trim().min(2).max(200),
  price: z.coerce.number().int().positive("Цена должна быть больше 0").max(10_000_000),
  category: z.string().trim().max(50).nullable().optional(),
  unit: z.string().trim().min(1).max(20).optional(),
  image: z.string().url().nullable().optional(),
});

// для PATCH/PUT: все поля необязательны, но хотя бы одно должно быть
export const productUpdateSchema = productSchema
  .partial()
  .refine((d) => Object.keys(d).length > 0, "Нет полей для обновления");

export const idParam = z.object({ id: z.coerce.number().int().positive() });
