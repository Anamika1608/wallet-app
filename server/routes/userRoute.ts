import express from "express";

import {
    registerUser,
    loginUser,
    logout
} from '../controllers/authController';

import {
    createTransaction,
    getAllTransactions,
    filterByCategory,
    getTransactionById,
    updateTransaction,
    deleteTransaction
} from '../controllers/transactionController';

import {
    getUserWallet,
    createWallet
} from '../controllers/walletController';

import { authenticateUser } from '../middleware/authenticateUser';

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", authenticateUser, logout);

router.get("/wallet", authenticateUser, getUserWallet);
router.post("/wallet", authenticateUser, createWallet);

router.post("/transactions", authenticateUser, createTransaction);
router.get("/transactions", authenticateUser, getAllTransactions);
router.get("/transactions/category", authenticateUser, filterByCategory);
router.get("/transactions/:id", authenticateUser, getTransactionById);
router.put("/transactions/:id", authenticateUser, updateTransaction);
router.delete("/transactions/:id", authenticateUser, deleteTransaction);

export default router;