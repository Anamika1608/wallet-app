import express, { Application } from "express";
import db from "./config/db_connection";
import cookieParser from "cookie-parser";
import cors from "cors";
import adminRoutes from './routes/adminRoute'

export default function initializeServer(app: Application) {

    app.use(cors(
        {
            credentials: true,
            origin: process.env.FRONTEND_URL
        }
    ));

    db.connect()
        .then(() => console.log("Database connected successfully"))
        .catch(err => console.error("Database connection error:", err));

    app.use(express.static('public'));
    app.use(cookieParser());
    app.use(express.json());
    app.use('/api/admin', adminRoutes);
    app.get("/", (req, res) => {
        res.send("Hello there!");
    });
}
