import express from "express";
import {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  updatePassword
} from "../controllers/userController.js";
import {
  authMiddleware,
  authorizeRoles,
  authorizeOwnerOrAdmin
} from "../middlewares/authMiddleware.js";

const router = express.Router();

// All routes require authentication
router.use(authMiddleware);

// Get all users - admin only
router.get("/", authorizeRoles("admin"), getAllUsers);

// Get single user by ID - admin or self
router.get("/:id", authorizeOwnerOrAdmin, getUserById);

// Update user by ID - admin or self
router.put("/:id", authorizeOwnerOrAdmin, updateUser);

// Update password - admin or self
router.put("/:id/password", authorizeOwnerOrAdmin, updatePassword);

// Delete user by ID - admin only
router.delete("/:id", authorizeRoles("admin"), deleteUser);

export default router; 