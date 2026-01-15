# Change: Update Image Gallery with Navigation

## Why
Currently, images on the post detail page are displayed in a static grid layout. Users cannot view images in full screen or easily navigate between them. This is a poor experience for posts with multiple images.

## What Changes
- Add a fullscreen/modal image gallery that opens when clicking an image
- Implement left/right arrow navigation (both clickable buttons and keyboard support)
- Add swipe gesture support for touch devices
- Show image counter (e.g., "2 / 5") in gallery view
- Add close button to exit gallery

## Impact
- Affected specs: `post-storage` (Post Detail View requirement)
- Affected code:
  - `client/src/pages/PostDetail.jsx` - Update image display and add gallery component
  - `client/src/App.css` - Add gallery modal styles
