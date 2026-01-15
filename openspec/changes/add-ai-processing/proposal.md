# Change: Add AI Labeling and Summary Processing

## Why
Currently, the post detail page displays placeholder AI labels and summaries. Users need real AI-generated content to help organize and understand their saved posts. This implements the actual AI processing using OpenRouter API with different models optimized for different post types, along with seamless status tracking for optimal user experience.

## What Changes
- Add OpenRouter API integration service for AI processing
- Support different API keys and models for video vs non-video posts:
  - **Video posts**: Dedicated API key and multimodal model for video understanding
  - **Non-video posts**: Separate API key and text/image model for efficiency
- Update database schema to store AI-generated labels, summaries, and processing status
- Add `ai_status` field to track processing state: 'pending', 'processing', 'completed', 'failed'
- Auto-trigger AI processing after a new post is created (async, non-blocking)
- Add manual re-process API endpoint that returns immediately and processes async
- Update frontend with polling mechanism for seamless status updates
- Support markdown formatting in AI summaries
- Add environment configuration for both API keys and model names

## Impact
- Affected specs: `post-storage`
- Affected code:
  - `server/services/aiService.js` - AI service with OpenRouter integration
  - `server/db/database.js` - Add ai_labels, ai_summary, ai_status columns
  - `server/routes/posts.js` - AI processing endpoints with async handling
  - `client/src/pages/PostDetail.jsx` - Polling, status-based UI, markdown rendering
  - `client/src/services/api.js` - API client updates
  - `.env` - OpenRouter configuration for both post types
