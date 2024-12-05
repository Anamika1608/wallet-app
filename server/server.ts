import express, { Application } from "express";
import db from "./config/db_connection";
import cookieParser from "cookie-parser";
import cors from "cors";

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
    app.get("/", (req, res) => {
        res.send("Hello there!");
    });
}
