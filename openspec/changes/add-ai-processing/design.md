## Context

When a post is saved, AI processing is triggered asynchronously. Currently, there's no way for the frontend to know if AI processing is:
- Not yet started
- Currently in progress
- Completed
- Failed

This leads to poor UX when users open the detail page while processing is ongoing - they see "no data" instead of a loading indicator.

## Goals

- Track AI processing status in the database
- Show loading state on detail page while AI is processing
- Seamless experience when refreshing page or re-generating AI content
- Minimal polling overhead

## Non-Goals

- Real-time WebSocket updates (polling is sufficient for this use case)
- Complex retry mechanisms (simple manual retry is enough)

## Decisions

### Decision 1: Add `ai_status` column to track processing state

**What**: Add a new column `ai_status` with values: `'pending'`, `'processing'`, `'completed'`, `'failed'`

**Why**:
- Allows frontend to distinguish between "not processed" and "currently processing"
- Enables showing appropriate loading states
- Simple to implement and query

**Alternatives considered**:
- In-memory tracking: Rejected because status is lost on server restart
- Separate status table: Rejected as over-engineering for this use case

### Decision 2: Frontend polling while status is 'pending' or 'processing'

**What**: PostDetail component polls GET /api/posts/:id every 2 seconds while `ai_status` is not 'completed'/'failed'

**Why**:
- Simple to implement
- Works across page refreshes
- No additional infrastructure needed

**Polling strategy**:
- Start polling on mount if `ai_status` is 'pending' or 'processing'
- Stop polling when status changes to 'completed' or 'failed'
- Poll interval: 2 seconds (balance between responsiveness and server load)
- Max poll duration: 60 seconds (timeout fallback)

**Alternatives considered**:
- WebSocket: Rejected as over-engineering for infrequent updates
- Server-Sent Events: Rejected for same reason

### Decision 3: Status transitions

```
[Post Created] --> pending
pending --> processing (when AI processing starts)
processing --> completed (when AI processing succeeds)
processing --> failed (when AI processing fails)
pending/failed --> processing (when manual re-process triggered)
```

### Decision 4: Include status in API response

**What**: GET /api/posts/:id returns `ai_status` field

**Why**: Single endpoint provides all needed information, no separate status endpoint needed

## Risks / Trade-offs

| Risk | Mitigation |
|------|------------|
| Polling increases server load | 2-second interval is reasonable; max 60s timeout |
| Status stuck in 'processing' if server crashes | Frontend timeout shows "failed" state after 60s |
| Race condition on re-process | Set status to 'processing' before async call |

## Implementation Summary

### Backend
1. Add `ai_status` column with migration
2. Update `createPost` to set initial status to 'pending'
3. Update `triggerAiProcessing` to set 'processing' before and 'completed'/'failed' after
4. Update `POST /api/posts/:id/process` to set 'processing' immediately, return early, process async
5. Include `ai_status` in all post responses

### Frontend
1. Add polling logic in PostDetail when status is 'pending'/'processing'
2. Show spinner in AI sections based on `ai_status`
3. Disable re-process button while processing
4. Stop polling on completed/failed or after 60s timeout
