# Post Storage Capability

## ADDED Requirements

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
The system SHALL download extracted images and videos to local storage.

#### Scenario: Image download success
- **WHEN** image URLs are extracted from a post
- **THEN** the system downloads each image to `storage/images/`
- **AND** stores the local file path in the database

#### Scenario: Video download success
- **WHEN** a video URL is extracted from a post
- **THEN** the system downloads the video to `storage/videos/`
- **AND** stores the local file path in the database

#### Scenario: Download failure handling
- **WHEN** media download fails (network error, expired URL)
- **THEN** the system logs the error
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
