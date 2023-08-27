import { z } from "zod";

export const inputvalidation = z.object({
  full_name: z
    .string({
      required_error: "full_name is required,",
      invalid_type_error: "full_name must be a string",
    })
    .transform((value) => value.trim().toLowerCase()),

  email: z
    .string({ required_error: "email is required" })
    .email("not a valid email")
    .transform((value) => value.trim().toLowerCase()),

  password: z
    .string({
      required_error: "password is required",
      invalid_type_error: "password must be a string",
    })
    .min(8, { message: "password must be at least 8 characters long" }),
});
