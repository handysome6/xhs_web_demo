# Change: Add Core Post Storage System

## Why
The MVP requires a foundation to capture, store, and retrieve XiaoHongShu posts. Users need to paste share links, have content automatically extracted, and access saved posts later. Without this core capability, no other features (AI labeling, organization) can function.

## What Changes
- Set up monolithic project structure (Express backend + React frontend)
- Create SQLite database schema for posts and media
- Build REST API endpoints for post CRUD operations
- Integrate existing `main.js` extraction logic into the backend
- Create basic React UI for link input and post list display
- Implement media download and local storage

## Impact
- Affected specs: `post-storage` (new capability)
- Affected code:
  - `server/` - New Express backend
  - `client/` - New React frontend
  - `storage/` - Media file storage
  - `main.js` - Refactor into server service
