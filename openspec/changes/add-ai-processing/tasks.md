## 1. Database Schema Update
- [x] 1.1 Add ai_labels column (JSON text) to posts table
- [x] 1.2 Add ai_summary column (text) to posts table
- [x] 1.3 Add ai_processed_at column (timestamp) to posts table

## 2. OpenRouter AI Service
- [x] 2.1 Create aiService.js with OpenRouter API client
- [x] 2.2 Implement model selection based on post type (video vs non-video)
- [x] 2.3 Implement generateLabels() function using chat completions
- [x] 2.4 Implement generateSummary() function using chat completions
- [x] 2.5 Add error handling and retry logic
- [x] 2.6 Support different API keys for video and non-video posts

## 3. API Integration
- [x] 3.1 Add POST /api/posts/:id/process endpoint for manual AI processing
- [x] 3.2 Integrate AI processing into post creation flow (async, non-blocking)
- [x] 3.3 Update GET /api/posts/:id to include AI fields
- [ ] 3.4 Add GET /api/posts/:id/ai-status endpoint to check processing status

## 4. Environment Configuration
- [x] 4.1 Add OPENROUTER_API_KEY_VIDEO for video posts
- [x] 4.2 Add OPENROUTER_MODEL_VIDEO for video post model name
- [x] 4.3 Add OPENROUTER_API_KEY_IMAGE for non-video posts
- [x] 4.4 Add OPENROUTER_MODEL_IMAGE for non-video post model name
- [x] 4.5 Create .env.example with all configuration options
- [x] 4.6 Document API key setup in README or comments

## 5. Frontend Updates
- [x] 5.1 Update PostDetail.jsx to use real ai_labels from API
- [x] 5.2 Update PostDetail.jsx to use real ai_summary from API
- [x] 5.3 Show loading state while AI is processing
- [x] 5.4 Add "Re-process with AI" button for manual trigger
- [x] 5.5 Remove fake label generation code

## 6. Testing
- [ ] 6.1 Test AI processing with video posts
- [ ] 6.2 Test AI processing with image-only posts
- [ ] 6.3 Test error handling when API keys are missing
- [ ] 6.4 Test async processing doesn't block post creation
- [ ] 6.5 Verify labels and summary display correctly on detail page
