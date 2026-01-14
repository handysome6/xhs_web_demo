# Change: Add AI Labeling and Summary Processing

## Why
Currently, the post detail page displays placeholder AI labels and summaries. Users need real AI-generated content to help organize and understand their saved posts. This implements the actual AI processing using OpenRouter API with different models optimized for different post types.

## What Changes
- Add OpenRouter API integration service for AI processing
- Support different API keys and models for video vs non-video posts:
  - **Video posts**: Dedicated API key and multimodal model for video understanding
  - **Non-video posts**: Separate API key and text/image model for efficiency
- Update database schema to store AI-generated labels and summaries
- Auto-trigger AI processing after a new post is created
- Add manual re-process API endpoint for existing posts
- Update frontend to display real AI labels and summaries (remove placeholders)
- Add environment configuration for both API keys and model names

## Impact
- Affected specs: `post-storage`
- Affected code:
  - `server/services/aiService.js` - New AI service (to be created)
  - `server/db/database.js` - Add ai_labels and ai_summary columns
  - `server/routes/posts.js` - Add AI processing endpoint, integrate into post creation
  - `client/src/pages/PostDetail.jsx` - Display real AI data instead of placeholders
  - `.env` - Add OpenRouter configuration for both post types
