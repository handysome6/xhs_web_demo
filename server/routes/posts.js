import express from 'express';
import { extractPost } from '../services/xhsExtractor.js';
import { downloadMedia } from '../services/mediaDownloader.js';
import { processPost } from '../services/aiService.js';
import * as db from '../db/database.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

/**
 * Trigger AI processing for a post (async, non-blocking)
 */
async function triggerAiProcessing(postId) {
  try {
    const post = db.findById(postId);
    if (!post) {
      console.error(`AI processing: Post ${postId} not found`);
      return;
    }

    console.log(`Starting AI processing for post ${postId}...`);
    const { labels, summary } = await processPost(post);

    if (labels || summary) {
      db.updateAiResults(postId, { labels, summary });
      console.log(`AI processing completed for post ${postId}`);
    } else {
      console.log(`AI processing skipped for post ${postId} (no API key or no results)`);
    }
  } catch (error) {
    console.error(`AI processing failed for post ${postId}:`, error.message);
  }
}

/**
 * POST /api/posts - Create a new post from share link
 */
router.post('/', async (req, res) => {
  try {
    const { shareText, xhsCookie } = req.body;

    if (!shareText) {
      return res.status(400).json({ error: '缺少shareText参数' });
    }

    // Extract post content
    const { title, description, mediaUrls, fullUrl } = await extractPost(shareText, xhsCookie);

    // Check if post already exists
    const existingPost = db.findByUrl(fullUrl);
    if (existingPost) {
      return res.json({
        message: '该帖子已存在',
        post: existingPost
      });
    }

    // Download media files (pass cookie for authenticated access)
    const mediaResults = await downloadMedia(mediaUrls, xhsCookie);

    // Create post in database
    const post = db.createPost({
      url: fullUrl,
      title,
      description,
      mediaPaths: mediaResults
    });

    // Trigger AI processing asynchronously (non-blocking)
    triggerAiProcessing(post.id);

    res.status(201).json({
      message: '帖子保存成功',
      post
    });
  } catch (error) {
    console.error('Error creating post:', error);
    res.status(500).json({
      error: error.message || '创建帖子失败'
    });
  }
});

/**
 * GET /api/posts - List all posts with pagination
 */
router.get('/', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 20;
    const offset = parseInt(req.query.offset) || 0;

    const posts = db.findAll({ limit, offset });
    const total = db.countPosts();

    res.json({
      posts,
      total,
      limit,
      offset
    });
  } catch (error) {
    console.error('Error fetching posts:', error);
    res.status(500).json({
      error: '获取帖子列表失败'
    });
  }
});

/**
 * GET /api/posts/:id - Get single post by ID
 */
router.get('/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const post = db.findById(id);

    if (!post) {
      return res.status(404).json({
        error: '帖子不存在'
      });
    }

    res.json({ post });
  } catch (error) {
    console.error('Error fetching post:', error);
    res.status(500).json({
      error: '获取帖子失败'
    });
  }
});

/**
 * POST /api/posts/:id/process - Manually trigger AI processing
 */
router.post('/:id/process', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const post = db.findById(id);

    if (!post) {
      return res.status(404).json({
        error: '帖子不存在'
      });
    }

    console.log(`Manual AI processing triggered for post ${id}`);
    const { labels, summary } = await processPost(post);

    if (labels || summary) {
      const updatedPost = db.updateAiResults(id, { labels, summary });
      res.json({
        message: 'AI处理完成',
        post: updatedPost
      });
    } else {
      res.json({
        message: 'AI处理跳过（未配置API密钥或无结果）',
        post
      });
    }
  } catch (error) {
    console.error('Error processing post with AI:', error);
    res.status(500).json({
      error: 'AI处理失败: ' + error.message
    });
  }
});

/**
 * DELETE /api/posts/:id - Delete post and associated media
 */
router.delete('/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const post = db.findById(id);

    if (!post) {
      return res.status(404).json({
        error: '帖子不存在'
      });
    }

    // Delete media files
    if (post.media_paths && Array.isArray(post.media_paths)) {
      const projectRoot = path.join(__dirname, '..', '..');

      for (const media of post.media_paths) {
        if (media.localPath) {
          const filePath = path.join(projectRoot, media.localPath);
          try {
            if (fs.existsSync(filePath)) {
              fs.unlinkSync(filePath);
              console.log(`Deleted file: ${media.localPath}`);
            }
          } catch (error) {
            console.error(`Failed to delete file ${media.localPath}:`, error);
          }
        }
      }
    }

    // Delete from database
    db.deletePost(id);

    res.json({
      message: '帖子删除成功'
    });
  } catch (error) {
    console.error('Error deleting post:', error);
    res.status(500).json({
      error: '删除帖子失败'
    });
  }
});

export default router;
