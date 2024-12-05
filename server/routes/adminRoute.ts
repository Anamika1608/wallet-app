import { adminLogin } from "../controllers/authController";
import express from "express";

import { authenticateAdmin }  from '../middleware/authenticateAdmin'
const router = express.Router();

router.post("/login", authenticateAdmin, adminLogin);

export default router