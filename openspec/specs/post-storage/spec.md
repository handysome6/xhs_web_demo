# post-storage Specification

## Purpose
TBD - created by archiving change add-core-post-storage. Update Purpose after archive.
## Requirements
### Requirement: Share Link Submission
The system SHALL accept XiaoHongShu share text input from users and extract the embedded URL.

#### Scenario: Valid share link submitted
- **WHEN** user submits share text containing a valid XHS short URL
- **THEN** the system extracts the full URL by following redirects
- **AND** initiates content extraction

#### Scenario: Invalid share text submitted
- **WHEN** user submits text without a valid XHS URL
- **THEN** the system returns an error message indicating invalid input

### Requirement: Content Extraction
The system SHALL extract post metadata from XiaoHongShu pages including title, description text, image URLs, and video URLs.

#### Scenario: Image post extraction
- **WHEN** a valid XHS image post URL is processed
- **THEN** the system extracts the post title
- **AND** extracts the description text
- **AND** extracts all image URLs from the post

#### Scenario: Video post extraction
- **WHEN** a valid XHS video post URL is processed
- **THEN** the system extracts the post title
- **AND** extracts the description text
- **AND** extracts the video URL

#### Scenario: Extraction requires authentication
- **WHEN** extraction fails due to missing authentication
- **THEN** the system returns an error indicating cookie is required

### Requirement: Media Download
The system SHALL download extracted images and videos to local storage using the correct CDN URL format and headers.

#### Scenario: Image download success
- **WHEN** image URLs are extracted from a post
- **THEN** the system uses the original SNS CDN URL with format suffix (e.g., `!nd_dft_wlteh_webp_3`)
- **AND** ensures HTTPS protocol
- **AND** includes proper headers (User-Agent, Referer, Cookie if provided)
- **AND** downloads each image to `storage/images/`
- **AND** stores the local file path in the database

#### Scenario: Video download success
- **WHEN** a video URL is extracted from a post
- **THEN** the system uses the original masterUrl directly
- **AND** downloads the video to `storage/videos/`
- **AND** stores the local file path in the database

#### Scenario: Authenticated download
- **WHEN** user provides XHS cookie for authentication
- **THEN** the system passes the cookie to the media downloader
- **AND** includes Cookie header in download requests

#### Scenario: Download failure handling
- **WHEN** media download fails (network error, expired URL, 403/500 errors)
- **THEN** the system logs the error with status code
- **AND** stores the original URL without local path

### Requirement: Post Persistence
The system SHALL persist extracted posts in a SQLite database with all metadata and media references.

#### Scenario: Post saved successfully
- **WHEN** content extraction and media download complete
- **THEN** the system creates a database record with:
  - Original share URL
  - Post title
  - Description text
  - Array of media file paths
  - Extraction timestamp
  - AI status (initially 'pending')
  - AI labels (initially null)
  - AI summary (initially null)
  - AI processed timestamp (initially null)
- **AND** returns the created post ID
- **AND** triggers async AI processing

#### Scenario: Duplicate post handling
- **WHEN** user submits a share link for an already-saved post
- **THEN** the system returns the existing post without re-downloading

### Requirement: Post Retrieval
The system SHALL provide API endpoints to list and view saved posts.

#### Scenario: List all posts
- **WHEN** client requests GET /api/posts
- **THEN** the system returns a paginated list of saved posts
- **AND** each post includes id, title, thumbnail, and timestamp

#### Scenario: View single post
- **WHEN** client requests GET /api/posts/:id
- **THEN** the system returns the full post details including all media paths

#### Scenario: Post not found
- **WHEN** client requests a non-existent post ID
- **THEN** the system returns a 404 error

### Requirement: Post Deletion
The system SHALL allow users to delete saved posts and associated media files.

#### Scenario: Delete post with media
- **WHEN** client requests DELETE /api/posts/:id
- **THEN** the system removes the database record
- **AND** deletes associated media files from storage
- **AND** returns success confirmation

### Requirement: Post Detail View
The system SHALL provide a dedicated detail page for viewing complete post content and AI-generated insights.

#### Scenario: Navigate to detail page
- **WHEN** user clicks on a post card in the post list
- **THEN** the system navigates to the detail page for that post
- **AND** the URL updates to `/posts/:id`

#### Scenario: Display full post content
- **WHEN** user views a post detail page
- **THEN** the system displays the complete post title
- **AND** displays the full description text without truncation
- **AND** displays the creation date

#### Scenario: Display post images
- **WHEN** viewing a post with images
- **THEN** the system displays all images in a gallery layout
- **AND** images are displayed at a readable size

#### Scenario: Display post video
- **WHEN** viewing a post with video
- **THEN** the system displays a video player
- **AND** the user can play/pause the video

#### Scenario: Back navigation
- **WHEN** user clicks the back button on detail page
- **THEN** the system navigates back to the post list

#### Scenario: Post not found
- **WHEN** user navigates to a detail page for non-existent post
- **THEN** the system displays an error message
- **AND** provides a link to return to the post list

### Requirement: AI Labels Display
The system SHALL display AI-generated labels for each post on the detail page.

#### Scenario: Display labels
- **WHEN** user views a post detail page with ai_status 'completed' and AI labels exist
- **THEN** the system displays the labels section
- **AND** shows all AI-generated labels as visual tags/chips

#### Scenario: No labels available
- **WHEN** ai_status is 'failed' or labels are empty after completion
- **THEN** the system displays "AI处理失败" message
- **AND** provides a button to manually trigger AI processing

#### Scenario: AI processing in progress
- **WHEN** ai_status is 'pending' or 'processing'
- **THEN** the system displays a loading spinner in the labels section
- **AND** shows "AI 处理中..." text

### Requirement: AI Summary Display
The system SHALL display an AI-generated summary for each post on the detail page, with support for markdown formatting.

#### Scenario: Display summary
- **WHEN** user views a post detail page with ai_status 'completed' and AI summary exists
- **THEN** the system displays the summary section
- **AND** renders the AI-generated summary as markdown (supporting headers, bullet points, bold, etc.)

#### Scenario: Display summary with bullet points
- **WHEN** the AI summary contains bullet point formatting
- **THEN** the system renders the bullet points as a proper list

#### Scenario: No summary available
- **WHEN** ai_status is 'failed' or summary is empty after completion
- **THEN** the system displays "AI处理失败" message
- **AND** provides a button to manually trigger AI processing

#### Scenario: AI processing in progress
- **WHEN** ai_status is 'pending' or 'processing'
- **THEN** the system displays a loading spinner in the summary section
- **AND** shows "AI 处理中..." text

### Requirement: AI Processing Service
The system SHALL use OpenRouter API to generate labels and summaries for saved posts, with different configurations for video and non-video posts.

#### Scenario: Detect post type for model selection
- **WHEN** AI processing is triggered for a post
- **THEN** the system checks if the post contains video media
- **AND** selects the appropriate API key and model based on post type

#### Scenario: Process video post
- **WHEN** AI processing is triggered for a post with video
- **THEN** the system uses OPENROUTER_API_KEY_VIDEO and OPENROUTER_MODEL_VIDEO
- **AND** sends the post content to the configured video model

#### Scenario: Process non-video post
- **WHEN** AI processing is triggered for a post without video (images only)
- **THEN** the system uses OPENROUTER_API_KEY_IMAGE and OPENROUTER_MODEL_IMAGE
- **AND** sends the post content to the configured image model

#### Scenario: Generate labels for post
- **WHEN** AI processing is triggered for a post
- **THEN** the system sends the post title and description to OpenRouter API
- **AND** requests 3-5 relevant category labels in Chinese
- **AND** stores the generated labels in the database

#### Scenario: Generate summary for post
- **WHEN** AI processing is triggered for a post
- **THEN** the system sends the post title and description to OpenRouter API
- **AND** requests a concise summary (under 200 characters) in Chinese
- **AND** the summary may use markdown formatting (bullet points, etc.)
- **AND** stores the generated summary in the database

#### Scenario: API key not configured
- **WHEN** the required OpenRouter API key is not set for the post type
- **THEN** the system logs a warning
- **AND** sets ai_status to 'failed'
- **AND** skips AI processing without failing the post creation

#### Scenario: API request failure
- **WHEN** OpenRouter API request fails (network error, rate limit, invalid response)
- **THEN** the system logs the error
- **AND** sets ai_status to 'failed'
- **AND** allows manual retry later

### Requirement: Automatic AI Processing
The system SHALL automatically trigger AI processing when a new post is created.

#### Scenario: Post created triggers AI
- **WHEN** a new post is successfully saved
- **THEN** the system sets ai_status to 'pending'
- **AND** triggers AI processing asynchronously
- **AND** does not block the post creation response

#### Scenario: Re-process existing post
- **WHEN** client requests POST /api/posts/:id/process
- **THEN** the system sets ai_status to 'processing' immediately
- **AND** returns response without waiting for AI completion
- **AND** processes AI asynchronously
- **AND** updates ai_status to 'completed' or 'failed' when done

### Requirement: AI Processing Status Tracking
The system SHALL track the status of AI processing for each post to enable seamless user experience.

#### Scenario: Status values
- **WHEN** tracking AI processing status
- **THEN** the system uses one of: 'pending', 'processing', 'completed', 'failed'

#### Scenario: Initial status on post creation
- **WHEN** a new post is created
- **THEN** the system sets ai_status to 'pending'

#### Scenario: Status transition to processing
- **WHEN** AI processing begins (auto or manual)
- **THEN** the system sets ai_status to 'processing' before making API calls

#### Scenario: Status transition to completed
- **WHEN** AI processing succeeds
- **THEN** the system sets ai_status to 'completed'
- **AND** stores the generated labels and summary

#### Scenario: Status transition to failed
- **WHEN** AI processing fails or is skipped
- **THEN** the system sets ai_status to 'failed'

#### Scenario: Include status in API response
- **WHEN** client requests GET /api/posts/:id
- **THEN** the response includes ai_status field

### Requirement: Frontend Status Polling
The system SHALL poll for AI processing status updates to provide seamless user experience.

#### Scenario: Start polling on pending status
- **WHEN** user views post detail page with ai_status 'pending' or 'processing'
- **THEN** the frontend polls GET /api/posts/:id every 2 seconds

#### Scenario: Stop polling on completion
- **WHEN** ai_status changes to 'completed' or 'failed'
- **THEN** the frontend stops polling
- **AND** displays the final AI content or error state

#### Scenario: Polling timeout
- **WHEN** polling continues for more than 60 seconds
- **THEN** the frontend stops polling
- **AND** displays a timeout message with retry option

#### Scenario: Page refresh during processing
- **WHEN** user refreshes page while AI is processing
- **THEN** the frontend detects ai_status and resumes polling if needed

