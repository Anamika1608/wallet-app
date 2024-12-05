import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const createWallet = async function (userId: number, balance: string) {
    const wallet = await prisma.wallet.create({
        data: { userId, balance },
    });
    return wallet;
}

export const getAllWallets = async function () {
    const wallets = await prisma.wallet.findMany({
        include: { user: true },
    });
    return wallets;
}

export const getWalletById = async function (walletId: number) {
    const wallet = await prisma.wallet.findUnique({
        where: { id: walletId },
        include: { user: true },
    });
    return wallet;
}

export const updateWallet = async function (walletId: number, data: { balance?: string }) {
    const wallet = await prisma.wallet.update({
        where: { id: walletId },
        data,
    });
    return wallet;
}

export const deleteWallet = async function (walletId: number) {
    await prisma.wallet.delete({
        where: { id: walletId },
    });
    console.log(`Wallet with ID ${walletId} deleted.`);
}
