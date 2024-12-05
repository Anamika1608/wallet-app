import { PrismaClient } from '@prisma/client';
import { Request, Response } from 'express';
import { registerUser } from '../validations/user';

const prisma = new PrismaClient();


export const createUser = async (req: Request, res: Response) => {
    try {
        const data: registerUser = req.body;

        if (!data.username || !data.email) {
            return res.status(400).json({
                success: false,
                message: "Username and email are required.",
            });
        }

        const existingUser = await prisma.user.findFirst({
            where: {
                OR: [{ username: data.username }, { email: data.email }],
            },
        });

        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: "Username or email already exists.",
            });
        }

        const user = await prisma.user.create({ data });

        return res.status(201).json({
            success: true,
            message: "User is registered successfully.",
            user,
        });
    } catch (error: any) {
        return res.status(500).json({
            success: false,
            message: "An error occurred while creating the user.",
            error: error.message,
        });
    }
};


export const getAllUsers = async (req: Request, res: Response) => {
    try {
        const users = await prisma.user.findMany();
        return res.status(200).json({
            success: true,
            users,
        });
    } catch (error: any) {
        return res.status(500).json({
            success: false,
            message: "An error occurred while fetching users.",
            error: error.message,
        });
    }
};


export const getUserById = async (req: Request, res: Response) => {
    const userId = Number(req.params.id);

    if (isNaN(userId)) {
        return res.status(400).json({
            success: false,
            message: "Invalid user ID.",
        });
    }

    try {
        const user = await prisma.user.findUnique({
            where: { id: userId },
        });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found.",
            });
        }

        return res.status(200).json({
            success: true,
            user,
        });
    } catch (error: any) {
        return res.status(500).json({
            success: false,
            message: "An error occurred while fetching the user.",
            error: error.message,
        });
    }
};


export const updateUser = async (req: Request, res: Response) => {
    const userId = Number(req.params.id);

    if (isNaN(userId)) {
        return res.status(400).json({
            success: false,
            message: "Invalid user ID.",
        });
    }

    const data: { username?: string; email?: string } = req.body;

    try {
        const user = await prisma.user.findUnique({ where: { id: userId } });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found.",
            });
        }

        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data,
        });

        return res.status(200).json({
            success: true,
            message: "User updated successfully.",
            updatedUser,
        });
    } catch (error: any) {
        return res.status(500).json({
            success: false,
            message: "An error occurred while updating the user.",
            error: error.message,
        });
    }
};


export const deleteUser = async (req: Request, res: Response) => {
    const userId = Number(req.params.id);

    if (isNaN(userId)) {
        return res.status(400).json({
            success: false,
            message: "Invalid user ID.",
        });
    }

    try {
        const user = await prisma.user.findUnique({ where: { id: userId } });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found.",
            });
        }

        await prisma.user.delete({ where: { id: userId } });

        return res.status(200).json({
            success: true,
            message: `User with ID ${userId} deleted successfully.`,
        });
    } catch (error: any) {
        return res.status(500).json({
            success: false,
            message: "An error occurred while deleting the user.",
            error: error.message,
        });
    }
};


export const deactivateUser = async (req: Request, res: Response) => {
    const userId = Number(req.params.id);

    if (isNaN(userId)) {
        return res.status(400).json({
            success: false,
            message: "Invalid user ID.",
        });
    }

    try {
        const user = await prisma.user.findUnique({ 
            where: { id: userId } 
        });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found.",
            });
        }

        if (user.status === 'INACTIVE') {
            return res.status(400).json({
                success: false,
                message: "User account is already deactivated.",
            });
        }

        const deactivatedUser = await prisma.user.update({
            where: { id: userId },
            data: { 
                status: 'INACTIVE'
            }
        });

        return res.status(200).json({
            success: true,
            message: `User with ID ${userId} deactivated successfully.`,
            user: {
                id: deactivatedUser.id,
                username: deactivatedUser.username,
                status: deactivatedUser.status
            }
        });

    } catch (error: any) {
        return res.status(500).json({
            success: false,
            message: "An error occurred while deactivating the user.",
            error: error.message,
        });
    }
};


export const activateUser = async (req: Request, res: Response) => {
    const userId = Number(req.params.id);

    if (isNaN(userId)) {
        return res.status(400).json({
            success: false,
            message: "Invalid user ID.",
        });
    }

    try {
        const user = await prisma.user.findUnique({ 
            where: { id: userId } 
        });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found.",
            });
        }

        if (user.status === 'ACTIVE') {
            return res.status(400).json({
                success: false,
                message: "User account is already active.",
            });
        }

        const activatedUser = await prisma.user.update({
            where: { id: userId },
            data: { 
                status: 'ACTIVE'
            }
        });

        return res.status(200).json({
            success: true,
            message: `User with ID ${userId} activated successfully.`,
            user: {
                id: activatedUser.id,
                username: activatedUser.username,
                status: activatedUser.status
            }
        });

    } catch (error: any) {
        return res.status(500).json({
            success: false,
            message: "An error occurred while activating the user.",
            error: error.message,
        });
    }
};

