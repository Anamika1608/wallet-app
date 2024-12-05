import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const createUser = async function (username: string, email: string) {
    const user = await prisma.user.create({
        data: { username, email },
    });
    return user;
}

export const getAllUsers = async function () {
    const users = await prisma.user.findMany();
    return users;
}

export const getUserById = async function (userId: number) {
    const user = await prisma.user.findUnique({
        where: { id: userId },
    });
    return user;
}

export const updateUser = async function (userId: number, data: { username?: string; email?: string }) {
    const user = await prisma.user.update({
        where: { id: userId },
        data,
    });
    return user;
}

export const deleteUser = async function (userId: number) {
    await prisma.user.delete({
        where: { id: userId },
    });
    console.log(`User with ID ${userId} deleted.`);
}
