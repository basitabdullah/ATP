import News from "../models/newsModel.js";
import { validationResult } from "express-validator";
import { deleteUploadedFile } from "../middlewares/uploadMiddleware.js";
import path from "path";

// Create news
export const createNews = async (req, res) => {
  try {
    // Check validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      // If there's an uploaded file and validation failed, delete it
      if (req.file) {
        deleteUploadedFile(req.file.filename);
      }
      return res.status(400).json({
        success: false,
        message: "Validation errors",
        errors: errors.array()
      });
    }

    const { title, category, excerpt, content, description, tags, status } = req.body;

    // Set author info from authenticated user
    const newsData = {
      title: title || "",
      category: category || "other",
      excerpt: excerpt || "",
      content: content || "",
      description: description || "",
      tags: tags ? (Array.isArray(tags) ? tags : tags.split(",").map(tag => tag.trim())) : [],
      status: status || "draft",
      author: req.user._id,
      authorName: `${req.user.firstName} ${req.user.lastName}`,
      image: req.file ? req.file.filename : null
    };

    // Authors can only create drafts
    if (req.user.role === "author") {
      newsData.status = "draft";
    }

    console.log('📝 Creating news with data:', {
      title: newsData.title,
      status: newsData.status,
      author: newsData.author,
      authorName: newsData.authorName,
      category: newsData.category
    });

    const news = await News.create(newsData);
    await news.populate("author", "firstName lastName email phone role");

    console.log('✅ News created successfully:', {
      id: news._id,
      title: news.title,
      status: news.status,
      author: news.authorName
    });

    res.status(201).json({
      success: true,
      message: "News created successfully",
      news
    });
  } catch (error) {
    // If there's an uploaded file and error occurred, delete it
    if (req.file) {
      deleteUploadedFile(req.file.filename);
    }
    
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message
    });
  }
};

// Get all news with filtering and search
export const getAllNews = async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      category, 
      status, 
      search, 
      author, 
      sortBy = "createdAt", 
      sortOrder = "desc" 
    } = req.query;

    // Build filter object
    const filter = {};
    
    if (category) filter.category = category;
    if (status) filter.status = status;
    if (author) filter.author = author;
    
    console.log('🔍 Initial filter from query params:', { category, status, author });
    
    // Text search across title, content, and description
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { content: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { tags: { $in: [new RegExp(search, "i")] } }
      ];
    }

    // Role-based filtering
    if (req.user) {
      console.log('👤 Authenticated user:', { id: req.user._id, role: req.user.role });
      console.log('📝 Status filter from query:', status);
      
      if (req.user.role === "author") {
        // Authors can only see their own news
        filter.author = req.user._id;
        console.log('👤 Author filter applied - only showing own news');
      } else if (req.user.role === "editor") {
        // Editors can see all news
        console.log('👥 Editor access - can see all news');
      } else if (req.user.role === "admin") {
        // Admins can see all news
        console.log('🔑 Admin access - can see all news');
      }
      
      // For authenticated users, respect the status filter they send
      // Status filter was already set above if provided
      if (status) {
        console.log('✅ Status filter applied for authenticated user:', status);
      } else {
        console.log('ℹ️ No status filter - showing all statuses for authenticated user');
      }
    } else {
      console.log('🚫 No authenticated user - restricting to published only');
      // Public users can only see published news
      // Override any status filter for security
      filter.status = "published";
    }

    console.log('📋 Final filter object:', filter);

    const options = {
      page: parseInt(page),
      limit: parseInt(limit),
      sort: { [sortBy]: sortOrder === "desc" ? -1 : 1 },
              populate: {
          path: "author",
          select: "firstName lastName email phone role"
        }
    };

    const news = await News.find(filter)
      .populate(options.populate)
      .sort(options.sort)
      .limit(options.limit * 1)
      .skip((options.page - 1) * options.limit);

    const total = await News.countDocuments(filter);

    console.log('📊 Query results:', {
      count: news.length,
      total,
      statuses: news.map(n => ({ id: n._id.toString().slice(-6), title: n.title.slice(0, 30), status: n.status }))
    });

    res.status(200).json({
      success: true,
      count: news.length,
      total,
      totalPages: Math.ceil(total / options.limit),
      currentPage: options.page,
      news
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message
    });
  }
};

// Get single news by ID
export const getNewsById = async (req, res) => {
  try {
    const { id } = req.params;
    const news = await News.findById(id).populate("author", "firstName lastName email phone role");

    if (!news) {
      return res.status(404).json({
        success: false,
        message: "News not found"
      });
    }

    // Check if user can access this news
    if (req.user) {
      const userRole = req.user.role;
      const isAuthor = news.author._id.toString() === req.user._id.toString();

      if (userRole === "author" && !isAuthor) {
        return res.status(403).json({
          success: false,
          message: "Access denied. You can only view your own news"
        });
      }
    } else {
      // Public users can only see published news
      if (news.status !== "published") {
        return res.status(404).json({
          success: false,
          message: "News not found"
        });
      }
    }

    // Increment views for published news
    if (news.status === "published") {
      await news.incrementViews();
    }

    res.status(200).json({
      success: true,
      news
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message
    });
  }
};

// Update news
export const updateNews = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      // If there's an uploaded file and validation failed, delete it
      if (req.file) {
        deleteUploadedFile(req.file.filename);
      }
      return res.status(400).json({
        success: false,
        message: "Validation errors",
        errors: errors.array()
      });
    }

    const news = req.news; // From ownership middleware
    const { title, category, excerpt, content, description, tags, status } = req.body;

    // Prepare update data
    const updateData = {};
    if (title) updateData.title = title;
    if (category) updateData.category = category;
    if (excerpt) updateData.excerpt = excerpt;
    if (content) updateData.content = content;
    if (description) updateData.description = description;
    if (tags) updateData.tags = Array.isArray(tags) ? tags : tags.split(",").map(tag => tag.trim());

    // Handle status change (only admin/editor can change status)
    if (status && ["admin", "editor"].includes(req.user.role)) {
      updateData.status = status;
    }

    // Handle image upload
    if (req.file) {
      // Delete old image if exists
      if (news.image) {
        deleteUploadedFile(news.image);
      }
      updateData.image = req.file.filename;
    }

    const updatedNews = await News.findByIdAndUpdate(
      news._id,
      updateData,
      { new: true, runValidators: true }
    ).populate("author", "firstName lastName email phone role");

    res.status(200).json({
      success: true,
      message: "News updated successfully",
      news: updatedNews
    });
  } catch (error) {
    // If there's an uploaded file and error occurred, delete it
    if (req.file) {
      deleteUploadedFile(req.file.filename);
    }
    
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message
    });
  }
};

// Delete news
export const deleteNews = async (req, res) => {
  try {
    console.log("=== DELETE NEWS DEBUG ===");
    console.log("Method:", req.method);
    console.log("URL:", req.url);
    console.log("Params:", req.params);
    console.log("User:", req.user ? { id: req.user._id, role: req.user.role } : 'None');
    
    const news = req.news; // From ownership middleware
    console.log("Deleting news:", { id: news._id, title: news.title });

    // Delete associated image file
    if (news.image) {
      deleteUploadedFile(news.image);
    }

    await News.findByIdAndDelete(news._id);
    console.log("News deleted successfully");

    res.status(200).json({
      success: true,
      message: "News deleted successfully"
    });
  } catch (error) {
    console.error("Error in deleteNews:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message
    });
  }
};

// Update news status (publish/unpublish)
export const updateNewsStatus = async (req, res) => {
  try {
    console.log("=== UPDATE STATUS DEBUG ===");
    console.log("Method:", req.method);
    console.log("URL:", req.url);
    console.log("Params:", req.params);
    console.log("Body:", req.body);
    console.log("User:", req.user ? { id: req.user._id, role: req.user.role } : 'None');
    
    const { id } = req.params;
    const { status } = req.body;

    if (!["draft", "published"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status. Must be 'draft' or 'published'"
      });
    }

    const news = await News.findById(id);
    if (!news) {
      return res.status(404).json({
        success: false,
        message: "News not found"
      });
    }

    console.log("Found news:", { id: news._id, title: news.title, currentStatus: news.status });
    console.log("Changing status to:", status);

    news.status = status;
    await news.save();

    console.log("Status updated successfully. New status:", news.status);

    res.status(200).json({
      success: true,
      message: `News ${status} successfully`,
      news
    });
  } catch (error) {
    console.error("Error in updateNewsStatus:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message
    });
  }
};

// Get news statistics (admin only)
export const getNewsStats = async (req, res) => {
  try {
    const stats = await News.aggregate([
      {
        $group: {
          _id: null,
          totalNews: { $sum: 1 },
          publishedNews: {
            $sum: { $cond: [{ $eq: ["$status", "published"] }, 1, 0] }
          },
          draftNews: {
            $sum: { $cond: [{ $eq: ["$status", "draft"] }, 1, 0] }
          },
          totalViews: { $sum: "$views" },
          totalDownloads: { $sum: "$downloads" }
        }
      }
    ]);

    const categoryStats = await News.aggregate([
      { $match: { status: "published" } },
      {
        $group: {
          _id: "$category",
          count: { $sum: 1 },
          totalViews: { $sum: "$views" }
        }
      },
      { $sort: { count: -1 } }
    ]);

    res.status(200).json({
      success: true,
      stats: stats[0] || {
        totalNews: 0,
        publishedNews: 0,
        draftNews: 0,
        totalViews: 0,
        totalDownloads: 0
      },
      categoryStats
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message
    });
  }
};

// Increment downloads
export const incrementDownloads = async (req, res) => {
  try {
    const { id } = req.params;
    const news = await News.findById(id);

    if (!news) {
      return res.status(404).json({
        success: false,
        message: "News not found"
      });
    }

    if (news.status !== "published") {
      return res.status(400).json({
        success: false,
        message: "Can only download published news"
      });
    }

    await news.incrementDownloads();

    res.status(200).json({
      success: true,
      message: "Download count updated",
      downloads: news.downloads + 1
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message
    });
  }
}; 