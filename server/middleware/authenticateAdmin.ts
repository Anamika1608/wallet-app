import jwt from 'jsonwebtoken';

export const authenticateAdmin = (req: any, res: any, next: any) => {
    const token = req.headers.authorization?.split(' ')[1];

    console.log(token)

    if (!token) {
        return res.status(401).json({
            success: false,
            message: "Unauthorized: No token provided"
        });
    }

    try {
        const JWT_SECRET: any = process.env.JWT_SECRET;
        const decoded: any = jwt.verify(token, JWT_SECRET);
        if (!decoded.isAdmin) {
            return res.status(403).json({ message: 'Forbidden' });
        }

        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: "Unauthorized: Invalid token"
        });
    }
};
