import Category from "../models/categoryModel.js";
import { validationResult } from "express-validator";

// Get all categories
export const getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find().sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      count: categories.length,
      categories
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message
    });
  }
};

// Create new category
export const createCategory = async (req, res) => {
  try {
    // Check validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Validation errors",
        errors: errors.array()
      });
    }

    const { name, description } = req.body;

    // Check if category already exists
    const existingCategory = await Category.findOne({ 
      name: { $regex: new RegExp(`^${name}$`, 'i') } 
    });

    if (existingCategory) {
      return res.status(400).json({
        success: false,
        message: "Category with this name already exists"
      });
    }

    const category = await Category.create({
      name: name.trim(),
      description: description?.trim() || ""
    });

    res.status(201).json({
      success: true,
      message: "Category created successfully",
      category
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message
    });
  }
};

// Delete category
export const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    const category = await Category.findById(id);
    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found"
      });
    }

    await Category.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "Category deleted successfully"
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message
    });
  }
}; 