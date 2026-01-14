# Implementation Tasks

## 1. Project Setup
- [x] 1.1 Initialize npm project with package.json
- [x] 1.2 Install backend dependencies (express, better-sqlite3, axios, cheerio)
- [x] 1.3 Install frontend dependencies (react, vite)
- [x] 1.4 Create directory structure (server/, client/, storage/)

## 2. Database Layer
- [x] 2.1 Create SQLite database initialization script
- [x] 2.2 Define posts table schema (id, url, title, description, media_paths, created_at)
- [x] 2.3 Create database access functions (create, findById, findAll, delete)

## 3. XHS Extraction Service
- [x] 3.1 Refactor main.js into server/services/xhsExtractor.js
- [x] 3.2 Add title and description extraction (currently only extracts media URLs)
- [x] 3.3 Add error handling for authentication requirements
- [x] 3.4 Add duplicate URL detection

## 4. Media Download Service
- [x] 4.1 Create server/services/mediaDownloader.js
- [x] 4.2 Implement image download with proper naming
- [x] 4.3 Implement video download with proper naming
- [x] 4.4 Add download error handling and fallback to URL storage
- [x] 4.5 Preserve full image URL with CDN format suffix
- [x] 4.6 Enforce HTTPS protocol for CDN requests
- [x] 4.7 Support cookie passthrough for authenticated downloads

## 5. REST API
- [x] 5.1 Create Express app in server/index.js
- [x] 5.2 Implement POST /api/posts (submit share link)
- [x] 5.3 Implement GET /api/posts (list posts with pagination)
- [x] 5.4 Implement GET /api/posts/:id (get single post)
- [x] 5.5 Implement DELETE /api/posts/:id (delete post and media)
- [x] 5.6 Add static file serving for storage/ directory

## 6. React Frontend
- [x] 6.1 Set up Vite + React project in client/
- [x] 6.2 Create LinkInput component (text input + submit button)
- [x] 6.3 Create PostList component (grid of saved posts)
- [x] 6.4 Create PostCard component (thumbnail, title, actions)
- [x] 6.5 Create PostDetail component (full post view with all media)
- [x] 6.6 Add API client service for backend calls

## 7. Integration
- [x] 7.1 Configure Vite proxy for API calls during development
- [x] 7.2 Configure Express to serve React build in production
- [x] 7.3 Add npm scripts for dev and build

## 8. Testing
- [x] 8.1 Manual test: submit valid image post link
- [x] 8.2 Manual test: submit valid video post link
- [x] 8.3 Manual test: submit invalid link
- [x] 8.4 Manual test: view and delete saved post
