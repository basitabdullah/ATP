# News Management System API Guide

A complete News/Blog CMS backend with role-based permissions, file uploads, and advanced filtering.

## 🎭 User Roles & Permissions

### **Admin**
- ✅ Create, read, update, delete **any** news
- ✅ Publish/unpublish **any** news
- ✅ View statistics and analytics
- ✅ Access all endpoints

### **Editor**
- ✅ Create, read, update **any** news
- ✅ Publish/unpublish **any** news
- ❌ Cannot delete other users' news (only admin can delete)
- ✅ View all news regardless of author

### **Author**
- ✅ Create news (always in `draft` status)
- ✅ Read and update **only own** news
- ❌ Cannot publish/unpublish news
- ❌ Cannot delete news
- ❌ Cannot see other authors' news

## 📰 News Schema

```javascript
{
  title: String (required, 5-200 chars),
  category: String (enum: technology, business, sports, entertainment, health, politics, science, other),
  excerpt: String (required, 10-300 chars),
  content: String (required, min 50 chars),
  author: ObjectId (auto-set from JWT),
  authorName: String (auto-set from user),
  publishTime: Date (auto-set when published),
  description: String (optional, max 500 chars),
  tags: [String] (optional),
  status: String (draft | published),
  image: String (filename of uploaded image),
  views: Number (default: 0),
  downloads: Number (default: 0),
  createdAt: Date (auto-set)
}
```

## 📋 API Endpoints

### **Public Endpoints** (No Auth Required)

#### 1. Get All Published News
```http
GET /api/news
```

**Query Parameters:**
- `page` (default: 1)
- `limit` (default: 10)
- `category` (filter by category)
- `search` (search in title, content, description, tags)
- `sortBy` (default: "createdAt")
- `sortOrder` ("asc" | "desc", default: "desc")

**Example:**
```
GET /api/news?category=technology&search=bitcoin&page=1&limit=5
```

#### 2. Get Single Published News
```http
GET /api/news/:id
```

#### 3. Increment Download Count
```http
PATCH /api/news/:id/download
```

---

### **Protected Endpoints** (Auth Required)

#### 4. Create News
```http
POST /api/news
Content-Type: multipart/form-data
Cookie: token=jwt_token_here
```

**Form Data:**
```json
{
  "title": "Breaking: New Technology Breakthrough",
  "category": "technology",
  "excerpt": "Scientists discover revolutionary new method...",
  "content": "Full article content here with detailed information about the breakthrough...",
  "description": "Optional meta description for SEO",
  "tags": "technology,science,breakthrough", // or ["technology", "science", "breakthrough"]
  "status": "draft", // or "published" (authors always get draft)
  "image": (file) // Optional image file
}
```

#### 5. Update News
```http
PUT /api/news/:id
Content-Type: multipart/form-data
Cookie: token=jwt_token_here
```

**Form Data:** (all fields optional)
```json
{
  "title": "Updated Title",
  "category": "science",
  "excerpt": "Updated excerpt...",
  "content": "Updated content...",
  "description": "Updated description",
  "tags": "updated,tags",
  "status": "published", // Only admin/editor can change status
  "image": (file) // New image file (replaces old one)
}
```

#### 6. Delete News (Admin Only)
```http
DELETE /api/news/:id
Cookie: token=jwt_token_here
```

#### 7. Update News Status (Admin/Editor Only)
```http
PATCH /api/news/:id/status
Content-Type: application/json
Cookie: token=jwt_token_here

{
  "status": "published" // or "draft"
}
```

#### 8. Get Statistics (Admin Only)
```http
GET /api/news/admin/stats
Cookie: token=jwt_token_here
```

---

## 🔍 Advanced Filtering Examples

### **Search & Filter Combinations:**
```bash
# Technology news with "AI" in content
GET /api/news?category=technology&search=AI

# Published sports news, sorted by views
GET /api/news?category=sports&status=published&sortBy=views&sortOrder=desc

# News by specific author
GET /api/news?author=USER_ID_HERE

# Paginated results
GET /api/news?page=2&limit=20

# Multiple filters
GET /api/news?category=business&status=published&search=crypto&sortBy=publishTime&sortOrder=desc
```

## 📝 Postman Examples

### **1. Create News (Author)**
```json
POST /api/news
{
  "title": "My First Blog Post",
  "category": "technology", 
  "excerpt": "This is an exciting post about new technology trends in 2024.",
  "content": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat...",
  "description": "A comprehensive look at technology trends",
  "tags": ["technology", "trends", "2024"],
  "status": "draft"
}
```

### **2. Update News (Editor)**
```json
PUT /api/news/65f1234567890abcdef12345
{
  "title": "Updated: Technology Trends 2024",
  "status": "published"
}
```

### **3. Publish News (Admin/Editor)**
```json
PATCH /api/news/65f1234567890abcdef12345/status
{
  "status": "published"
}
```

## 📊 Response Examples

### **Get All News Response:**
```json
{
  "success": true,
  "count": 5,
  "total": 25,
  "totalPages": 5,
  "currentPage": 1,
  "news": [
    {
      "_id": "65f1234567890abcdef12345",
      "title": "Breaking Tech News",
      "category": "technology",
      "excerpt": "Exciting developments in AI...",
      "content": "Full content here...",
      "author": {
        "_id": "65f1234567890abcdef12346",
        "name": "John Doe",
        "email": "john@example.com",
        "role": "author"
      },
      "authorName": "John Doe",
      "status": "published",
      "publishTime": "2024-01-15T10:30:00.000Z",
      "image": "news-1642234567890-123456789.jpg",
      "views": 156,
      "downloads": 23,
      "tags": ["technology", "AI"],
      "createdAt": "2024-01-15T09:00:00.000Z"
    }
  ]
}
```

### **Statistics Response (Admin):**
```json
{
  "success": true,
  "stats": {
    "totalNews": 150,
    "publishedNews": 120,
    "draftNews": 30,
    "totalViews": 45230,
    "totalDownloads": 8790
  },
  "categoryStats": [
    {
      "_id": "technology",
      "count": 45,
      "totalViews": 15230
    },
    {
      "_id": "business", 
      "count": 32,
      "totalViews": 12100
    }
  ]
}
```

## 🖼️ Image Upload

### **Supported Formats:**
- JPEG, JPG, PNG, GIF, WebP
- Maximum size: 5MB
- Automatically generates unique filenames
- Stored in `/uploads/` directory
- Accessible via: `http://localhost:5000/uploads/filename.jpg`

### **Image Handling:**
- Upload new image → Old image is automatically deleted
- Delete news → Associated image is automatically deleted
- Failed upload → Temporary image is cleaned up

## 🔐 Authentication Flow

1. **Login** to get JWT cookie: `POST /api/auth/login`
2. **Cookie is automatically sent** with subsequent requests
3. **Role-based access** is enforced on each endpoint
4. **Ownership checks** prevent unauthorized access

## 🚨 Error Handling

### **Common Error Responses:**
```json
// Validation Error
{
  "success": false,
  "message": "Validation errors",
  "errors": [
    {
      "field": "title",
      "message": "Title must be between 5 and 200 characters"
    }
  ]
}

// Permission Denied
{
  "success": false,
  "message": "Access denied. You can only update your own news"
}

// File Upload Error
{
  "success": false,
  "message": "File too large. Maximum size is 5MB"
}
```

## 🎯 Testing Checklist

**As Author:**
- ✅ Create news (always draft)
- ✅ View own news only
- ✅ Update own news (except status)
- ❌ Cannot publish news
- ❌ Cannot see other authors' news
- ❌ Cannot delete news

**As Editor:**
- ✅ Create news (can set published)
- ✅ View all news
- ✅ Update any news
- ✅ Publish/unpublish any news
- ❌ Cannot delete news

**As Admin:**
- ✅ Full access to everything
- ✅ Delete any news
- ✅ View statistics
- ✅ Manage all operations

This API is production-ready with comprehensive error handling, file management, and security measures! 