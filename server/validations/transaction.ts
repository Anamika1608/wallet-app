import { z } from "zod";

export const TRANSACTION_CATEGORIES = [
    'Salary', 'Food', 'Savings', 'Transportation'
] as const;

const TransactionType = z.enum(['Income', 'Expense']);

export const transactionValidation = z.object({
    walletId: z.number(),
    type: TransactionType,
    amount: z.string().refine(value => {
        const numValue = parseFloat(value);
        return !isNaN(numValue) && numValue > 0;
    }, { message: "Amount must be a positive number" }),
    category: z.enum(TRANSACTION_CATEGORIES)
});


export type Transaction = z.infer<typeof transactionValidation>;
