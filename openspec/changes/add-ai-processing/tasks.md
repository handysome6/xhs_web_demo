## 1. Database Schema Update
- [ ] 1.1 Add ai_labels column (JSON text) to posts table
- [ ] 1.2 Add ai_summary column (text) to posts table
- [ ] 1.3 Add ai_processed_at column (timestamp) to posts table

## 2. OpenRouter AI Service
- [ ] 2.1 Create aiService.js with OpenRouter API client
- [ ] 2.2 Implement model selection based on post type (video vs non-video)
- [ ] 2.3 Implement generateLabels() function using chat completions
- [ ] 2.4 Implement generateSummary() function using chat completions
- [ ] 2.5 Add error handling and retry logic
- [ ] 2.6 Support different API keys for video and non-video posts

## 3. API Integration
- [ ] 3.1 Add POST /api/posts/:id/process endpoint for manual AI processing
- [ ] 3.2 Integrate AI processing into post creation flow (async, non-blocking)
- [ ] 3.3 Update GET /api/posts/:id to include AI fields
- [ ] 3.4 Add GET /api/posts/:id/ai-status endpoint to check processing status

## 4. Environment Configuration
- [ ] 4.1 Add OPENROUTER_API_KEY_VIDEO for video posts
- [ ] 4.2 Add OPENROUTER_MODEL_VIDEO for video post model name
- [ ] 4.3 Add OPENROUTER_API_KEY_IMAGE for non-video posts
- [ ] 4.4 Add OPENROUTER_MODEL_IMAGE for non-video post model name
- [ ] 4.5 Create .env.example with all configuration options
- [ ] 4.6 Document API key setup in README or comments

## 5. Frontend Updates
- [ ] 5.1 Update PostDetail.jsx to use real ai_labels from API
- [ ] 5.2 Update PostDetail.jsx to use real ai_summary from API
- [ ] 5.3 Show loading state while AI is processing
- [ ] 5.4 Add "Re-process with AI" button for manual trigger
- [ ] 5.5 Remove fake label generation code

## 6. Testing
- [ ] 6.1 Test AI processing with video posts
- [ ] 6.2 Test AI processing with image-only posts
- [ ] 6.3 Test error handling when API keys are missing
- [ ] 6.4 Test async processing doesn't block post creation
- [ ] 6.5 Verify labels and summary display correctly on detail page
