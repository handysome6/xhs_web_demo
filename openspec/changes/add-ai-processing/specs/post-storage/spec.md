## ADDED Requirements

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
- **AND** skips AI processing without failing the post creation

#### Scenario: API request failure
- **WHEN** OpenRouter API request fails (network error, rate limit, invalid response)
- **THEN** the system logs the error
- **AND** marks the post as not processed
- **AND** allows manual retry later

### Requirement: Automatic AI Processing
The system SHALL automatically trigger AI processing when a new post is created.

#### Scenario: Post created triggers AI
- **WHEN** a new post is successfully saved
- **THEN** the system triggers AI processing asynchronously
- **AND** does not block the post creation response

#### Scenario: Re-process existing post
- **WHEN** client requests POST /api/posts/:id/process
- **THEN** the system triggers AI processing for that post
- **AND** updates the stored labels and summary

## MODIFIED Requirements

### Requirement: AI Labels Display
The system SHALL display AI-generated labels for each post on the detail page.

#### Scenario: Display labels
- **WHEN** user views a post detail page with AI labels
- **THEN** the system displays the labels section
- **AND** shows all AI-generated labels as visual tags/chips

#### Scenario: No labels available
- **WHEN** AI labels have not been generated for a post
- **THEN** the system displays a "Processing..." indicator
- **AND** provides a button to manually trigger AI processing

#### Scenario: AI processing in progress
- **WHEN** AI processing is currently running for a post
- **THEN** the system displays a loading spinner in the labels section

### Requirement: AI Summary Display
The system SHALL display an AI-generated summary for each post on the detail page, with support for markdown formatting.

#### Scenario: Display summary
- **WHEN** user views a post detail page with AI summary
- **THEN** the system displays the summary section
- **AND** renders the AI-generated summary as markdown (supporting headers, bullet points, bold, etc.)

#### Scenario: Display summary with bullet points
- **WHEN** the AI summary contains bullet point formatting
- **THEN** the system renders the bullet points as a proper list

#### Scenario: No summary available
- **WHEN** AI summary has not been generated for a post
- **THEN** the system displays a "Processing..." indicator
- **AND** provides a button to manually trigger AI processing

#### Scenario: AI processing in progress
- **WHEN** AI processing is currently running for a post
- **THEN** the system displays a loading spinner in the summary section

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
  - AI labels (initially null)
  - AI summary (initially null)
  - AI processed timestamp (initially null)
- **AND** returns the created post ID
- **AND** triggers async AI processing

#### Scenario: Duplicate post handling
- **WHEN** user submits a share link for an already-saved post
- **THEN** the system returns the existing post without re-downloading
