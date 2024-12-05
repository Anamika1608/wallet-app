import { PrismaClient } from '@prisma/client';
import { Request, Response } from 'express';
import { z } from 'zod';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { usernameValidation, userValidation, loginValidation } from '../validations/user';
import 'dotenv/config';

const prisma = new PrismaClient();

const JWT_SECRET: any = process.env.JWT_SECRET;
const JWT_EXPIRES_IN: any = process.env.JWT_EXPIRES_IN || '7d';


export const registerUser = async (req: Request, res: Response) => {
    try {
        const validatedData = userValidation.parse(req.body);

        const existingUser = await prisma.user.findFirst({
            where: {
                OR: [
                    { username: validatedData.username },
                    { email: validatedData.email }
                ]
            }
        });

        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: existingUser.username === validatedData.username
                    ? "Username already exists"
                    : "Email already exists"
            });
        }

        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(validatedData.password, saltRounds);

        const user = await prisma.user.create({
            data: {
                username: validatedData.username,
                email: validatedData.email,
                password: hashedPassword
            },
            select: {
                id: true,
                username: true,
                email: true
            }
        });

        const token = jwt.sign(
            { userId: user.id, username: user.username },
            JWT_SECRET,
            { expiresIn: JWT_EXPIRES_IN }
        );

        res.cookie('auth_token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        });

        return res.status(201).json({
            success: true,
            message: "User registered successfully",
            user
        });

    } catch (error) {
        console.error('Registration error:', error);

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
            message: "An error occurred during registration"
        });
    }
};


export const loginUser = async (req: Request, res: Response) => {
    try {
        const validatedData = loginValidation.parse(req.body);

        const user = await prisma.user.findFirst({
            where: {
                OR: [
                    { username: validatedData.identifier },
                    { email: validatedData.identifier }
                ]
            }
        });

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Invalid credentials"
            });
        }

        if (user.status === 'INACTIVE') {
            return res.status(403).json({
                success: false,
                message: "Account is deactivated. Please contact support."
            });
        }

        const isPasswordValid = await bcrypt.compare(
            validatedData.password,
            user.password
        );

        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: "Invalid credentials"
            });
        }

        const token = jwt.sign(
            { userId: user.id, username: user.username },
            JWT_SECRET,
            { expiresIn: JWT_EXPIRES_IN }
        );

        res.cookie('auth_token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        });

        return res.status(200).json({
            success: true,
            message: "Login successful",
            user: {
                id: user.id,
                username: user.username,
                email: user.email
            }
        });

    } catch (error) {
        console.error('Login error:', error);

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
            message: "An error occurred during login"
        });
    }
};


export const logout = (req: Request, res: Response) => {
    res.clearCookie('auth_token', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict'
    });

    return res.status(200).json({
        success: true,
        message: "Logged out successfully"
    });
};


export const adminLogin = async (req: Request, res: any) => {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !user.isAdmin) {
        return res.status(401).json({ message: 'Unauthorized access' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
        return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user.id, isAdmin: user.isAdmin }, JWT_SECRET, { expiresIn: '1h' });

    return res.status(200).json({
        success: true,
        token,
        message: "Logged in successfully"
    });
};

// debouncing username check