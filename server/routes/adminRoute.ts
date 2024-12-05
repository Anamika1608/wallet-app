import { adminLogin } from "../controllers/authController";
import { 
    createUser, 
    getAllUsers, 
    getUserById, 
    updateUser, 
    deleteUser, 
    deactivateUser, 
    activateUser 
} from '../controllers/userController';

import { 
    getAllWallets, 
    getWalletById, 
    toggleWalletStatus, 
    deleteWallet 
} from '../controllers/walletController';
import express from "express";
import { authenticateAdmin } from '../middleware/authenticateAdmin';

const router = express.Router();

router.post("/login", authenticateAdmin, adminLogin);

router.post("/users", authenticateAdmin, createUser);
router.get("/users", authenticateAdmin, getAllUsers);
router.get("/users/:id", authenticateAdmin, getUserById);
router.put("/users/:id", authenticateAdmin, updateUser);
router.delete("/users/:id", authenticateAdmin, deleteUser);
router.patch("/users/:id/deactivate", authenticateAdmin, deactivateUser);
router.patch("/users/:id/activate", authenticateAdmin, activateUser);

router.get("/wallets", authenticateAdmin, getAllWallets);
router.get("/wallets/:id", authenticateAdmin, getWalletById);
router.patch("/wallets/:id/toggle-status", authenticateAdmin, toggleWalletStatus);
router.delete("/wallets/:id", authenticateAdmin, deleteWallet);

export default router;