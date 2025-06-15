import express from "express";
import { body } from "express-validator";
import {
  createNews,
  getAllNews,
  getNewsById,
  updateNews,
  deleteNews,
  updateNewsStatus,
  getNewsStats,
  incrementDownloads
} from "../controllers/newsController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import {
  canCreateNews,
  canChangeStatus,
  canDeleteNews,
  adminOnly
} from "../middlewares/roleMiddleware.js";
import {
  checkNewsOwnership,
  checkUpdatePermission,
  checkDeletePermission
} from "../middlewares/ownershipMiddleware.js";
import {
  uploadNewsImage,
  handleMulterError
} from "../middlewares/uploadMiddleware.js";

const router = express.Router();

// Validation middleware
const validateNews = [
  body("title")
    .trim()
    .isLength({ min: 5, max: 200 })
    .withMessage("Title must be between 5 and 200 characters"),
  body("category")
    .isIn(["technology", "business", "sports", "entertainment", "health", "politics", "science", "other"])
    .withMessage("Invalid category"),
  body("excerpt")
    .trim()
    .isLength({ min: 10, max: 300 })
    .withMessage("Excerpt must be between 10 and 300 characters"),
  body("content")
    .trim()
    .isLength({ min: 50 })
    .withMessage("Content must be at least 50 characters long"),
  body("description")
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage("Description cannot exceed 500 characters"),
  body("status")
    .optional()
    .isIn(["draft", "published"])
    .withMessage("Status must be either 'draft' or 'published'")
];

const validateNewsUpdate = [
  body("title")
    .optional()
    .trim()
    .isLength({ min: 5, max: 200 })
    .withMessage("Title must be between 5 and 200 characters"),
  body("category")
    .optional()
    .isIn(["technology", "business", "sports", "entertainment", "health", "politics", "science", "other"])
    .withMessage("Invalid category"),
  body("excerpt")
    .optional()
    .trim()
    .isLength({ min: 10, max: 300 })
    .withMessage("Excerpt must be between 10 and 300 characters"),
  body("content")
    .optional()
    .trim()
    .isLength({ min: 50 })
    .withMessage("Content must be at least 50 characters long"),
  body("description")
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage("Description cannot exceed 500 characters"),
  body("status")
    .optional()
    .isIn(["draft", "published"])
    .withMessage("Status must be either 'draft' or 'published'")
];

const validateStatus = [
  body("status")
    .isIn(["draft", "published"])
    .withMessage("Status must be either 'draft' or 'published'")
];

// Public routes (no authentication required)
router.get("/", getAllNews); // Get all published news for public
router.get("/:id", getNewsById); // Get single news (published only for public)
router.patch("/:id/download", incrementDownloads); // Increment download count

// Protected routes (require authentication)
router.use(authMiddleware);

// Create news - All authenticated roles can create, but with restrictions
router.post("/", 
  canCreateNews,
  uploadNewsImage,
  handleMulterError,
  validateNews,
  createNews
);

// Update news - Role-based with ownership check
router.put("/:id",
  checkUpdatePermission,
  uploadNewsImage,
  handleMulterError,
  validateNewsUpdate,
  updateNews
);

// Delete news - Admin only
router.delete("/:id",
  checkDeletePermission,
  deleteNews
);

// Update news status - Admin and Editor only
router.patch("/:id/status",
  canChangeStatus,
  validateStatus,
  updateNewsStatus
);

// Get statistics - Admin only
router.get("/admin/stats", adminOnly, getNewsStats);

export default router; 