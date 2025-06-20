import mongoose from "mongoose";

const newsSchema = new mongoose.Schema({
  title: {
    type: String,
    trim: true,
    maxlength: [200, "Title cannot exceed 200 characters"],
    default: ""
  },
  category: {
    type: String,
    enum: ["technology", "business", "sports", "entertainment", "health", "politics", "science", "important", "market-updates", "other"],
    lowercase: true,
    default: "other"
  },
  excerpt: {
    type: String,
    trim: true,
    maxlength: [300, "Excerpt cannot exceed 300 characters"],
    default: ""
  },
  content: {
    type: String,
    trim: true,
    default: ""
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  authorName: {
    type: String,
    required: true
  },
  publishTime: {
    type: Date,
    default: null
  },
  description: {
    type: String,
    trim: true,
    maxlength: [500, "Description cannot exceed 500 characters"]
  },
  tags: [{
    type: String,
    trim: true,
    lowercase: true
  }],
  status: {
    type: String,
    enum: ["draft", "published"],
    default: "draft"
  },
  image: {
    type: String,
    default: null
  },
  views: {
    type: Number,
    default: 0
  },
  downloads: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Index for better search performance
newsSchema.index({ title: "text", content: "text", description: "text" });
newsSchema.index({ category: 1, status: 1 });
newsSchema.index({ author: 1 });
newsSchema.index({ createdAt: -1 });

// Pre-save middleware to set publishTime when status changes to published
newsSchema.pre("save", function(next) {
  if (this.isModified("status") && this.status === "published" && !this.publishTime) {
    this.publishTime = new Date();
  }
  
  // Validate required fields for published news
  if (this.status === "published") {
    if (!this.title || this.title.trim().length < 5) {
      return next(new Error("Title must be at least 5 characters for published news"));
    }
    if (!this.excerpt || this.excerpt.trim().length < 10) {
      return next(new Error("Excerpt must be at least 10 characters for published news"));
    }
    if (!this.content || this.content.trim().length < 50) {
      return next(new Error("Content must be at least 50 characters for published news"));
    }
  }
  
  next();
});

// Method to increment views
newsSchema.methods.incrementViews = function() {
  this.views += 1;
  return this.save();
};

// Method to increment downloads
newsSchema.methods.incrementDownloads = function() {
  this.downloads += 1;
  return this.save();
};

export default mongoose.model("News", newsSchema); 