import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize database
const dbPath = path.join(__dirname, '..', '..', 'xhs_posts.db');
const db = new Database(dbPath);

// Create posts table
db.exec(`
  CREATE TABLE IF NOT EXISTS posts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    url TEXT NOT NULL UNIQUE,
    title TEXT,
    description TEXT,
    media_paths TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

// Migration: Add AI columns if they don't exist
const tableInfo = db.pragma('table_info(posts)');
const columns = tableInfo.map(col => col.name);

if (!columns.includes('ai_labels')) {
  db.exec('ALTER TABLE posts ADD COLUMN ai_labels TEXT');
  console.log('Added ai_labels column to posts table');
}

if (!columns.includes('ai_summary')) {
  db.exec('ALTER TABLE posts ADD COLUMN ai_summary TEXT');
  console.log('Added ai_summary column to posts table');
}

if (!columns.includes('ai_processed_at')) {
  db.exec('ALTER TABLE posts ADD COLUMN ai_processed_at DATETIME');
  console.log('Added ai_processed_at column to posts table');
}

// Database access functions

/**
 * Create a new post
 */
export function createPost({ url, title, description, mediaPaths }) {
  const stmt = db.prepare(`
    INSERT INTO posts (url, title, description, media_paths)
    VALUES (?, ?, ?, ?)
  `);

  const info = stmt.run(
    url,
    title,
    description,
    JSON.stringify(mediaPaths || [])
  );

  return findById(info.lastInsertRowid);
}

/**
 * Find post by ID
 */
export function findById(id) {
  const stmt = db.prepare('SELECT * FROM posts WHERE id = ?');
  const post = stmt.get(id);

  if (post) {
    if (post.media_paths) {
      post.media_paths = JSON.parse(post.media_paths);
    }
    if (post.ai_labels) {
      post.ai_labels = JSON.parse(post.ai_labels);
    }
  }

  return post;
}

/**
 * Find post by URL
 */
export function findByUrl(url) {
  const stmt = db.prepare('SELECT * FROM posts WHERE url = ?');
  const post = stmt.get(url);

  if (post) {
    if (post.media_paths) {
      post.media_paths = JSON.parse(post.media_paths);
    }
    if (post.ai_labels) {
      post.ai_labels = JSON.parse(post.ai_labels);
    }
  }

  return post;
}

/**
 * Find all posts with pagination
 */
export function findAll({ limit = 20, offset = 0 } = {}) {
  const stmt = db.prepare(`
    SELECT * FROM posts
    ORDER BY created_at DESC
    LIMIT ? OFFSET ?
  `);

  const posts = stmt.all(limit, offset);

  return posts.map(post => {
    if (post.media_paths) {
      post.media_paths = JSON.parse(post.media_paths);
    }
    if (post.ai_labels) {
      post.ai_labels = JSON.parse(post.ai_labels);
    }
    return post;
  });
}

/**
 * Count total posts
 */
export function countPosts() {
  const stmt = db.prepare('SELECT COUNT(*) as count FROM posts');
  return stmt.get().count;
}

/**
 * Delete post by ID
 */
export function deletePost(id) {
  const stmt = db.prepare('DELETE FROM posts WHERE id = ?');
  const info = stmt.run(id);
  return info.changes > 0;
}

/**
 * Update AI processing results for a post
 */
export function updateAiResults(id, { labels, summary }) {
  const stmt = db.prepare(`
    UPDATE posts
    SET ai_labels = ?, ai_summary = ?, ai_processed_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `);

  stmt.run(JSON.stringify(labels || []), summary || null, id);
  return findById(id);
}

export default db;
