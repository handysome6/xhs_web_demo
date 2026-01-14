# Design: Core Post Storage System

## Context
This system extracts and stores content from XiaoHongShu (小红书) posts. XHS uses a CDN infrastructure with specific requirements for accessing media files that were discovered during implementation.

## External Dependencies

### XiaoHongShu CDN Infrastructure

XHS uses multiple CDN endpoints with different access requirements:

| CDN Endpoint | Purpose | Access Requirements |
|--------------|---------|---------------------|
| `sns-webpic-qc.xhscdn.com` | Image hosting (SNS CDN) | HTTPS, Referer, format suffix |
| `ci.xiaohongshu.com` | Alternative image CDN | Requires authentication tokens (not usable for direct download) |
| Video stream URLs | Video hosting | Direct access via `masterUrl` |

### Key Technical Decisions

#### 1. Image URL Handling

**Decision**: Use original SNS CDN URLs directly, preserving the format suffix.

**Rationale**:
- XHS image URLs contain a format suffix after `!` (e.g., `!nd_dft_wlteh_webp_3`)
- This suffix specifies image format/quality and is **required** by the CDN
- Stripping the suffix results in 403 Forbidden errors
- The alternative `ci.xiaohongshu.com` endpoint requires different authentication and returns 500 errors

**Implementation**:
```javascript
// Correct: Keep full URL with suffix
imageUrls.push(originalUrl);  // e.g., https://sns-webpic-qc.xhscdn.com/.../image!nd_dft_wlteh_webp_3

// Wrong: Stripping suffix causes 403
const cleanUrl = originalUrl.split('!')[0];  // Breaks CDN access
```

#### 2. Protocol Requirement

**Decision**: Enforce HTTPS for all CDN requests.

**Rationale**:
- XHS CDN blocks HTTP requests with 403 errors
- Original URLs from page extraction may use HTTP
- Must convert to HTTPS before downloading

**Implementation**:
```javascript
if (originalUrl.startsWith('http://')) {
  originalUrl = originalUrl.replace('http://', 'https://');
}
```

#### 3. Required HTTP Headers

**Decision**: Include browser-like headers with optional cookie support.

**Rationale**:
- CDN validates Referer header to prevent hotlinking
- User-Agent helps pass bot detection
- Some content may require authentication via cookies

**Implementation**:
```javascript
const headers = {
  'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36...',
  'Referer': 'https://www.xiaohongshu.com/',
  'Accept': 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
  'Accept-Language': 'zh-CN,zh;q=0.9',
};
if (cookie) {
  headers['Cookie'] = cookie;
}
```

#### 4. Video URL Handling

**Decision**: Use `masterUrl` directly without modification.

**Rationale**:
- Video URLs from XHS API (`item.stream.h264[0].masterUrl`) contain embedded authentication
- These URLs work without additional headers or modifications
- No transformation needed

## Risks / Trade-offs

| Risk | Mitigation |
|------|------------|
| URL tokens may expire | Download immediately after extraction |
| CDN may change URL format | Monitor for errors, update regex if needed |
| Rate limiting | Add delays between requests if needed |
| Cookie expiration | User must provide fresh cookies when needed |

## File References

- Image URL extraction: `server/services/xhsExtractor.js` (lines 106-122)
- Media download with headers: `server/services/mediaDownloader.js` (lines 22-36, 69-81)
- Cookie passthrough: `server/routes/posts.js` (line 38)
