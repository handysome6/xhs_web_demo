## ADDED Requirements

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
