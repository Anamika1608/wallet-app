import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function createUser(username: string, email: string) {
    const user = await prisma.user.create({
        data: { username, email },
    });
    return user;
}

async function getAllUsers() {
    const users = await prisma.user.findMany();
    return users;
}

async function getUserById(userId: number) {
    const user = await prisma.user.findUnique({
        where: { id: userId },
    });
    return user;
}

async function updateUser(userId: number, data: { username?: string; email?: string }) {
    const user = await prisma.user.update({
        where: { id: userId },
        data,
    });
    return user;
}

async function deleteUser(userId: number) {
    await prisma.user.delete({
        where: { id: userId },
    });
    console.log(`User with ID ${userId} deleted.`);
}
