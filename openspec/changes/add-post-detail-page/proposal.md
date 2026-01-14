# Change: Add Post Detail Page

## Why
Currently, users can only view posts as cards in a grid layout with truncated content. Users need a dedicated detail page to view the full post content including all images, videos, and AI-generated insights.

## What Changes
- Add a new detail page component accessible by clicking on a post card
- Display full post content: title, complete description text, all images, and videos
- Add AI-generated labels section (placeholder with fake labels for now)
- Add AI summary region (placeholder for future AI integration)
- Add navigation back to post list
- Update routing to support `/posts/:id` path

## Impact
- Affected specs: `post-storage`
- Affected code:
  - `client/src/App.jsx` - Add routing
  - `client/src/components/PostCard.jsx` - Add click navigation
  - `client/src/pages/PostDetail.jsx` - New page component (to be created)
  - `client/src/App.css` - Add detail page styles
