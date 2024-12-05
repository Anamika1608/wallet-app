import {Response } from 'express';
import jwt from 'jsonwebtoken';

export const authenticateUser = (req: any, res: any, next: any) => {
    const token = req.cookies.auth_token;

    if (!token) {
        return res.status(401).json({
            success: false,
            message: "Unauthorized: No token provided"
        });
    }

    try {
        const JWT_SECRET:any = process.env.JWT_SECRET ;
        const decoded: any = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: "Unauthorized: Invalid token"
        });
    }
};