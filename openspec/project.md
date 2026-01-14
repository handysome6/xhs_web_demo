# Project Context

## Purpose
A web application that helps users save, organize, and analyze XiaoHongShu (小红书/RED) posts. Users paste a share link, and the app automatically extracts content (title, text, images, videos), stores it locally, and uses AI to generate labels and summaries for easy organization.

### Core Features (MVP)
1. **Link Input**: Paste XiaoHongShu share link to create a new post entry
2. **Content Extraction**: Automatically extract title, text, image URLs, and video URLs
3. **Media Download**: Download and store images/videos locally
4. **AI Processing**: Generate labels and summaries for each post via OpenRouter
5. **Organization**: Filter and browse saved posts by AI-generated labels

## Tech Stack
- **Frontend**: React (with Vite for build tooling)
- **Backend**: Node.js + Express (monolithic architecture)
- **Database**: SQLite (simple, file-based, good for demo)
- **File Storage**: Local filesystem for downloaded media
- **HTTP Client**: Axios (for fetching XiaoHongShu content)
- **HTML Parsing**: Cheerio (for extracting page data)
- **AI Service**: OpenRouter API (Gemini Flash or similar cost-effective models)
- **Language**: JavaScript (TypeScript optional for future)

## Project Conventions

### Code Style
- Use ES6+ features (async/await, arrow functions, destructuring)
- camelCase for variables and functions
- PascalCase for React components
- Keep functions small and focused
- Chinese comments are acceptable for domain-specific logic

### Architecture Patterns
- **Monolithic**: Single Express server serves both API and React frontend
- **REST API**: `/api/posts`, `/api/posts/:id`, `/api/labels`
- **Component-based UI**: Reusable React components
- **Service layer**: Separate modules for XHS extraction, AI processing, file storage

### Directory Structure
```
xhs_web_demo/
├── client/              # React frontend
│   ├── src/
│   │   ├── components/  # React components
│   │   ├── pages/       # Page components
│   │   └── services/    # API client functions
├── server/              # Express backend
│   ├── routes/          # API route handlers
│   ├── services/        # Business logic (xhs, ai, storage)
│   └── db/              # SQLite database and migrations
├── storage/             # Downloaded media files
│   ├── images/
│   └── videos/
└── main.js              # Existing XHS extraction logic
```

### Testing Strategy
- Manual testing for MVP phase
- Add unit tests for critical extraction logic as needed

### Git Workflow
- Main branch for stable code
- Feature branches for new development
- Descriptive commit messages in English

## Domain Context
- **XiaoHongShu (小红书)**: A Chinese social media platform for lifestyle content
- **Share Link**: Users copy share text from the XHS app, which contains a short URL
- **Post Types**: Can be image posts (multiple images) or video posts
- **Content Structure**: Posts have title, description text, images/videos, and user info
- **Live Photos**: Some images have associated short video clips

## Important Constraints
- XiaoHongShu requires specific headers and may need cookies for some content
- Rate limiting: Avoid rapid requests to prevent blocking
- Media URLs may expire; download promptly after extraction
- Chinese language content is primary; AI should handle Chinese text
- This is a personal tool/demo, not for public deployment

## External Dependencies
- **XiaoHongShu**: Web scraping target (no official API)
- **OpenRouter API**: For AI labeling and summarization
  - API Key required
  - Model: Gemini Flash or similar cost-effective option
  - Endpoints: Chat completions for text analysis
