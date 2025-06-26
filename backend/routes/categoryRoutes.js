import express from "express";
import { body } from "express-validator";
import { getAllCategories, createCategory, deleteCategory } from "../controllers/categoryController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { adminOrEditor } from "../middlewares/roleMiddleware.js";

const router = express.Router();

// Validation rules for creating category
const createCategoryValidation = [
  body("name")
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage("Category name must be between 2 and 50 characters")
    .matches(/^[a-zA-Z0-9\s\u0600-\u06FF]+$/)
    .withMessage("Category name can only contain letters, numbers, spaces, and Urdu characters"),
  body("description")
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage("Description cannot exceed 200 characters")
];

// Routes
router.get("/", getAllCategories); // Public route to get all categories

// Protected routes (require authentication)
router.post("/", 
  authMiddleware,
  adminOrEditor,
  createCategoryValidation,
  createCategory
);

router.delete("/:id", 
  authMiddleware,
  adminOrEditor,
  deleteCategory
);

export default router; 