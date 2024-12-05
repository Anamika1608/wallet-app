import { PrismaClient } from '@prisma/client';
import { Request, Response } from 'express';
import { z } from 'zod';
import { transactionValidation, Transaction } from '../validations/transaction';
const prisma = new PrismaClient();


export const createTransaction = async (req: any, res: Response) => {
    try {
        const validatedData = transactionValidation.parse(req.body);

        const wallet = await prisma.wallet.findUnique({
            where: { userId: req.user.userId }
        });

        if (!wallet) {
            return res.status(404).json({
                success: false,
                message: "Wallet not found. Please create a wallet first."
            });
        }

        const transaction : Transaction = await prisma.transaction.create({
            data: {
                walletId: wallet.id,
                type: validatedData.type,
                amount: validatedData.amount,
                category: validatedData.category
            }
        });

        // Update wallet balance
        const currentBalance = parseFloat(wallet.balance);
        const transactionAmount = parseFloat(validatedData.amount);

        const newBalance = validatedData.type === 'Income'
            ? (currentBalance + transactionAmount).toString()
            : (currentBalance - transactionAmount).toString();

        await prisma.wallet.update({
            where: { id: wallet.id },
            data: { balance: newBalance }
        });

        return res.status(201).json({
            success: true,
            message: "Transaction created successfully",
            transaction
        });

    } catch (error) {
        console.error('Transaction creation error:', error);

        if (error instanceof z.ZodError) {
            return res.status(400).json({
                success: false,
                message: "Validation failed",
                errors: error.errors.map(err => ({
                    field: err.path.join('.'),
                    message: err.message
                }))
            });
        }

        return res.status(500).json({
            success: false,
            message: "An error occurred while creating the transaction"
        });
    }
};


export const getAllTransactions = async (req: any, res: Response) => {
    try {
        const wallet = await prisma.wallet.findUnique({
            where: { userId: req.user.userId }
        });

        if (!wallet) {
            return res.status(404).json({
                success: false,
                message: "Wallet not found"
            });
        }

        const whereConditions = {
            walletId: wallet.id
        }

        const [transactions, total] = await Promise.all([
            prisma.transaction.findMany({
                where: whereConditions,

            }),
            prisma.transaction.count({ where: whereConditions })
        ]);

        return res.status(200).json({
            success: true,
            transactions,
            total
        });

    } catch (error) {
        console.error('Fetch transactions error:', error);
        return res.status(500).json({
            success: false,
            message: "An error occurred while fetching transactions"
        });
    }
};


export const filterByCategory = async (req: any, res: Response) => {
    try {
        const wallet = await prisma.wallet.findUnique({
            where: { userId: req.user.userId },
        });

        if (!wallet) {
            return res.status(404).json({
                success: false,
                message: "Wallet not found",
            });
        }

        const { category } = req.query;

        if (!category) {
            return res.status(400).json({
                success: false,
                message: "Category is required",
            });
        }

        const whereConditions = {
            walletId: wallet.id,
            category,
        };

        const [transactions, total] = await Promise.all([
            prisma.transaction.findMany({
                where: whereConditions
            }),
            prisma.transaction.count({
                where: whereConditions,
            }),
        ]);

        return res.status(200).json({
            success: true,
            transactions,
            total
        });
    } catch (error) {
        console.error('Filter by category error:', error);
        return res.status(500).json({
            success: false,
            message: "An error occurred while filtering transactions by category",
        });
    }
};


export const getTransactionById = async (req: any, res: Response) => {
    const transactionId = Number(req.params.id);

    if (isNaN(transactionId)) {
        return res.status(400).json({
            success: false,
            message: "Invalid transaction ID"
        });
    }

    try {
        const wallet = await prisma.wallet.findUnique({
            where: { userId: req.user.userId }
        });

        if (!wallet) {
            return res.status(404).json({
                success: false,
                message: "Wallet not found"
            });
        }

        const transaction = await prisma.transaction.findFirst({
            where: {
                id: transactionId,
                walletId: wallet.id
            }
        });

        if (!transaction) {
            return res.status(404).json({
                success: false,
                message: "Transaction not found"
            });
        }

        return res.status(200).json({
            success: true,
            transaction
        });

    } catch (error) {
        console.error('Get transaction error:', error);
        return res.status(500).json({
            success: false,
            message: "An error occurred while fetching the transaction"
        });
    }
};


export const updateTransaction = async (req: any, res: Response) => {
    const transactionId = Number(req.params.id);

    if (isNaN(transactionId)) {
        return res.status(400).json({
            success: false,
            message: "Invalid transaction ID"
        });
    }

    try {
        const validatedData = transactionValidation.parse(req.body);

        const wallet = await prisma.wallet.findUnique({
            where: { userId: req.user.userId }
        });

        if (!wallet) {
            return res.status(404).json({
                success: false,
                message: "Wallet not found"
            });
        }

        const existingTransaction = await prisma.transaction.findFirst({
            where: {
                id: transactionId,
                walletId: wallet.id
            }
        });

        if (!existingTransaction) {
            return res.status(404).json({
                success: false,
                message: "Transaction not found"
            });
        }

        // Update transaction
        const updatedTransaction = await prisma.transaction.update({
            where: { id: transactionId },
            data: validatedData
        });

        return res.status(200).json({
            success: true,
            message: "Transaction updated successfully",
            transaction: updatedTransaction
        });

    } catch (error) {
        console.error('Transaction update error:', error);

        if (error instanceof z.ZodError) {
            return res.status(400).json({
                success: false,
                message: "Validation failed",
                errors: error.errors.map(err => ({
                    field: err.path.join('.'),
                    message: err.message
                }))
            });
        }

        return res.status(500).json({
            success: false,
            message: "An error occurred while updating the transaction"
        });
    }
};


export const deleteTransaction = async (req: any, res: Response) => {
    const transactionId = Number(req.params.id);

    if (isNaN(transactionId)) {
        return res.status(400).json({
            success: false,
            message: "Invalid transaction ID"
        });
    }

    try {
        // Find user's wallet
        const wallet = await prisma.wallet.findUnique({
            where: { userId: req.user.userId }
        });

        if (!wallet) {
            return res.status(404).json({
                success: false,
                message: "Wallet not found"
            });
        }

        // Find existing transaction
        const existingTransaction = await prisma.transaction.findFirst({
            where: {
                id: transactionId,
                walletId: wallet.id
            }
        });

        if (!existingTransaction) {
            return res.status(404).json({
                success: false,
                message: "Transaction not found"
            });
        }

        // Delete transaction
        await prisma.transaction.delete({
            where: { id: transactionId }
        });

        return res.status(200).json({
            success: true,
            message: `Transaction with ID ${transactionId} deleted successfully`
        });

    } catch (error) {
        console.error('Transaction deletion error:', error);
        return res.status(500).json({
            success: false,
            message: "An error occurred while deleting the transaction"
        });
    }
};

