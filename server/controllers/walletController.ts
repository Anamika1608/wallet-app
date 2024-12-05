import { PrismaClient } from '@prisma/client';
import { Request } from 'express';
import { z } from 'zod';
import { walletValidation, WalletStatusEnum } from '../validations/wallet'; 

const prisma = new PrismaClient();

export const createWallet = async (req: any, res: any) => {
    try {
        const validatedData = walletValidation.parse({
            userId: req.user.userId,
            balance: req.body.balance || '0',
            status: 'unfreeze'
        });

        const existingWallet = await prisma.wallet.findUnique({
            where: { userId: req.user.userId }
        });

        if (existingWallet) {
            return res.status(400).json({
                success: false,
                message: "Wallet already exists for this user"
            });
        }

        const wallet = await prisma.wallet.create({
            data: {
                userId: validatedData.userId,
                balance: validatedData.balance,
                status: validatedData.status
            }
        });

        return res.status(201).json({
            success: true,
            message: "Wallet created successfully",
            wallet
        });

    } catch (error) {
        console.error('Wallet creation error:', error);

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
            message: "An error occurred while creating the wallet"
        });
    }
};

export const getUserWallet = async (req: any, res: any) => {
    try {
        const wallet = await prisma.wallet.findUnique({
            where: { userId: req.user.userId },
            include: { user: { select: { id: true, username: true } } }
        });

        if (!wallet) {
            return res.status(404).json({
                success: false,
                message: "Wallet not found"
            });
        }

        return res.status(200).json({
            success: true,
            wallet
        });

    } catch (error) {
        console.error('Get wallet error:', error);
        return res.status(500).json({
            success: false,
            message: "An error occurred while fetching the wallet"
        });
    }
};

// Admin: Get All Wallets
export const getAllWallets = async (req: Request, res: any) => {
    try {
        const [wallets, total] = await Promise.all([
            prisma.wallet.findMany({
                include: { user: { select: { id: true, username: true } } }
            }),
            prisma.wallet.count()
        ]);

        return res.status(200).json({
            success: true,
            wallets,
            total
        });

    } catch (error) {
        console.error('Get all wallets error:', error);
        return res.status(500).json({
            success: false,
            message: "An error occurred while fetching wallets"
        });
    }
};

// Admin: Get Wallet by ID
export const getWalletById = async (req: Request, res: any) => {
    const walletId = Number(req.params.id);

    if (isNaN(walletId)) {
        return res.status(400).json({
            success: false,
            message: "Invalid wallet ID"
        });
    }

    try {
        const wallet = await prisma.wallet.findUnique({
            where: { id: walletId },
            include: { user: { select: { id: true, username: true } } }
        });

        if (!wallet) {
            return res.status(404).json({
                success: false,
                message: "Wallet not found"
            });
        }

        return res.status(200).json({
            success: true,
            wallet
        });

    } catch (error) {
        console.error('Get wallet by ID error:', error);
        return res.status(500).json({
            success: false,
            message: "An error occurred while fetching the wallet"
        });
    }
};

// Admin: Freeze/Unfreeze Wallet
export const toggleWalletStatus = async (req: Request, res: any) => {
    const walletId = Number(req.params.id);
    const { status } = req.body;

    if (isNaN(walletId)) {
        return res.status(400).json({
            success: false,
            message: "Invalid wallet ID"
        });
    }

    try {
        const validatedStatus = WalletStatusEnum.parse(status);

        const existingWallet = await prisma.wallet.findUnique({
            where: { id: walletId }
        });

        if (!existingWallet) {
            return res.status(404).json({
                success: false,
                message: "Wallet not found"
            });
        }

        const updatedWallet = await prisma.wallet.update({
            where: { id: walletId },
            data: { status: validatedStatus }
        });

        return res.status(200).json({
            success: true,
            message: `Wallet ${validatedStatus}d successfully`,
            wallet: updatedWallet
        });

    } catch (error) {
        console.error('Toggle wallet status error:', error);

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
            message: "An error occurred while updating wallet status"
        });
    }
};

// Admin: Delete Wallet
export const deleteWallet = async (req: Request, res: any) => {
    const walletId = Number(req.params.id);

    if (isNaN(walletId)) {
        return res.status(400).json({
            success: false,
            message: "Invalid wallet ID"
        });
    }

    try {
        const existingWallet = await prisma.wallet.findUnique({
            where: { id: walletId }
        });

        if (!existingWallet) {
            return res.status(404).json({
                success: false,
                message: "Wallet not found"
            });
        }

        await prisma.wallet.delete({
            where: { id: walletId }
        });

        return res.status(200).json({
            success: true,
            message: `Wallet with ID ${walletId} deleted successfully`
        });

    } catch (error) {
        console.error('Wallet deletion error:', error);
        return res.status(500).json({
            success: false,
            message: "An error occurred while deleting the wallet"
        });
    }
};