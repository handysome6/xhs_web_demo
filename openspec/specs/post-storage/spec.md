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
- **AND** returns the created post ID

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
- **WHEN** user views a post detail page
- **THEN** the system displays a labels section
- **AND** shows all AI-generated labels as visual tags/chips

#### Scenario: No labels available
- **WHEN** AI labels have not been generated for a post
- **THEN** the system displays placeholder labels
- **AND** indicates labels are pending AI processing

### Requirement: AI Summary Display
The system SHALL display an AI-generated summary for each post on the detail page.

#### Scenario: Display summary
- **WHEN** user views a post detail page
- **THEN** the system displays a summary section
- **AND** shows the AI-generated summary text

#### Scenario: No summary available
- **WHEN** AI summary has not been generated for a post
- **THEN** the system displays a placeholder message
- **AND** indicates summary is pending AI processing

