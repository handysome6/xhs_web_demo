## MODIFIED Requirements

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
- **THEN** the system displays image thumbnails in a gallery layout
- **AND** clicking an image opens a fullscreen modal gallery

#### Scenario: Navigate images in gallery
- **WHEN** user has opened the image gallery modal
- **THEN** the system displays left and right arrow buttons for navigation
- **AND** user can click arrows to navigate between images
- **AND** user can press keyboard left/right arrow keys to navigate
- **AND** user can swipe left/right on touch devices to navigate
- **AND** the system displays current image position (e.g., "2 / 5")

#### Scenario: Close image gallery
- **WHEN** user is viewing the image gallery modal
- **THEN** user can click a close button to exit the gallery
- **AND** user can press Escape key to exit the gallery
- **AND** user can click outside the image to exit the gallery

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
