import News from "../models/newsModel.js";

// Middleware to check if user owns the news or has admin/editor privileges
export const checkNewsOwnership = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Authentication required"
      });
    }

    const { id } = req.params;
    const news = await News.findById(id);

    if (!news) {
      return res.status(404).json({
        success: false,
        message: "News not found"
      });
    }

    const userRole = req.user.role;
    const isAuthor = news.author.toString() === req.user._id.toString();

    // Admin can access any news
    if (userRole === "admin") {
      req.news = news;
      return next();
    }

    // Editor can access any news for reading/updating (but not deleting non-owned)
    if (userRole === "editor") {
      req.news = news;
      return next();
    }

    // Author can only access their own news
    if (userRole === "author" && isAuthor) {
      req.news = news;
      return next();
    }

    return res.status(403).json({
      success: false,
      message: "Access denied. You can only access your own news"
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message
    });
  }
};

// Middleware specifically for update operations with role-based restrictions
export const checkUpdatePermission = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Authentication required"
      });
    }

    const { id } = req.params;
    const news = await News.findById(id);

    if (!news) {
      return res.status(404).json({
        success: false,
        message: "News not found"
      });
    }

    const userRole = req.user.role;
    const isAuthor = news.author.toString() === req.user._id.toString();

    // Admin can update any news
    if (userRole === "admin") {
      req.news = news;
      return next();
    }

    // Editor can update any news
    if (userRole === "editor") {
      req.news = news;
      return next();
    }

    // Author can only update their own news and cannot change status
    if (userRole === "author") {
      if (!isAuthor) {
        return res.status(403).json({
          success: false,
          message: "Access denied. You can only update your own news"
        });
      }

      // Prevent authors from changing status
      if (req.body.status && req.body.status !== news.status) {
        return res.status(403).json({
          success: false,
          message: "Authors cannot change news status"
        });
      }

      req.news = news;
      return next();
    }

    return res.status(403).json({
      success: false,
      message: "Access denied"
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message
    });
  }
};

// Middleware for delete operations (admin only, but with ownership check for cleanup)
export const checkDeletePermission = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Authentication required"
      });
    }

    if (req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Only admin can delete news"
      });
    }

    const { id } = req.params;
    const news = await News.findById(id);

    if (!news) {
      return res.status(404).json({
        success: false,
        message: "News not found"
      });
    }

    req.news = news;
    next();

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message
    });
  }
}; 