import { z } from "zod"
import { CategoryKey } from "../constants/categories";

export const transactionFormSchema = z.object({
  type: z.enum(["EXPENSE", "INCOME"]),
  amount: z
    .string()
    .min(1, "Enter an amount.")
    .refine((v) => {
      const parsed = parseFloat(v.replace(/,/g, ""))
      return !Number.isNaN(parsed) && parsed > 0
    })
  ,
  category: z.custom<CategoryKey>((v) => typeof v === 'string'),
  accountId: z.string().optional(),
  description: z.string().optional(),
  date: z.date()
});

export type TransactionFormSchema = z.infer<typeof transactionFormSchema>