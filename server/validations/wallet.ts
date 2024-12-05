import { z } from "zod";

export const WalletStatusEnum = z.enum(['unfreeze', 'freeze']);

export const walletValidation = z.object({
    balance: z.string().refine(value => {
        const numValue = parseFloat(value);
        return !isNaN(numValue) && numValue >= 0;
    }, { message: "Balance must be a non-negative number" }),

    userId: z.number().int(),

    status: WalletStatusEnum.optional(),
});

export type Wallet = z.infer<typeof walletValidation>;


