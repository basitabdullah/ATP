// Role-based middleware for news system
export const roleMiddleware = (allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Authentication required"
      });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: "Access denied. Insufficient permissions"
      });
    }

    next();
  };
};

// Specific role middlewares for news operations
export const adminOnly = roleMiddleware(["admin"]);
export const adminOrEditor = roleMiddleware(["admin", "editor"]);
export const allRoles = roleMiddleware(["admin", "editor", "author"]);

// Custom middleware for news creation permissions
export const canCreateNews = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: "Authentication required"
    });
  }

  const userRole = req.user.role;
  
  // All roles can create news, but with different default status
  if (["admin", "editor", "author"].includes(userRole)) {
    // Ensure req.body exists
    if (!req.body) {
      req.body = {};
    }
    
    // Authors can only create drafts
    if (userRole === "author" && req.body.status === "published") {
      req.body.status = "draft";
    }
    
    // Set default status if not provided
    if (!req.body.status) {
      req.body.status = userRole === "author" ? "draft" : "draft";
    }
    
    return next();
  }

  return res.status(403).json({
    success: false,
    message: "Only admin, editor, or author can create news"
  });
};

// Middleware to check if user can publish/unpublish news
export const canChangeStatus = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: "Authentication required"
    });
  }

  const userRole = req.user.role;
  
  if (["admin", "editor"].includes(userRole)) {
    return next();
  }

  return res.status(403).json({
    success: false,
    message: "Only admin or editor can change news status"
  });
};

// Middleware to check if user can delete news
export const canDeleteNews = (req, res, next) => {
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

  next();
}; 