import mongoose from "mongoose";

const newsSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Please provide a title"],
    trim: true,
    maxlength: [200, "Title cannot exceed 200 characters"]
  },
  category: {
    type: String,
    required: [true, "Please provide a category"],
    enum: ["technology", "business", "sports", "entertainment", "health", "politics", "science", "other"],
    lowercase: true
  },
  excerpt: {
    type: String,
    required: [true, "Please provide an excerpt"],
    trim: true,
    maxlength: [300, "Excerpt cannot exceed 300 characters"]
  },
  content: {
    type: String,
    required: [true, "Please provide content"],
    trim: true
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