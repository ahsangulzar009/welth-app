import { z } from "zod";

export const signUpFormSchema = z.object({
  firstName: z.string().trim().min(1, "First name is required"),
  lastName: z.string().trim().min(1, "Last name is required"),
  email: z.email("Enter a valid email").trim(),
  password: z.string().min(8, "Password must be at least 8 characters")
})

export const signInFormSchema = z.object({
  email: z.email("Enter a valid email").trim(),
  password: z.string().min(8, "Password must be at least 8 characters")
})

export const codeFormSchema = z.object({
  code: z.string().min(1, "Enter the verification code.")
})

export type SignUpFromSchema = z.infer<typeof signUpFormSchema>
export type SignInFromSchema = z.infer<typeof signInFormSchema>
export type CodeFormValues = z.infer<typeof codeFormSchema>