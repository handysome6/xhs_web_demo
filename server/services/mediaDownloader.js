import axios from 'axios';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import crypto from 'crypto';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const STORAGE_DIR = path.join(__dirname, '..', '..', 'storage');
const IMAGES_DIR = path.join(STORAGE_DIR, 'images');
const VIDEOS_DIR = path.join(STORAGE_DIR, 'videos');

// Ensure storage directories exist
if (!fs.existsSync(IMAGES_DIR)) {
  fs.mkdirSync(IMAGES_DIR, { recursive: true });
}
if (!fs.existsSync(VIDEOS_DIR)) {
  fs.mkdirSync(VIDEOS_DIR, { recursive: true });
}

/**
 * Get headers for downloading media from XHS CDN
 */
function getDownloadHeaders() {
  return {
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
    'Referer': 'https://www.xiaohongshu.com/',
    'Accept': 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
    'Accept-Language': 'zh-CN,zh;q=0.9',
  };
}

/**
 * Detect if URL is a video based on content or URL pattern
 */
function isVideoUrl(url) {
  const videoPatterns = [
    /\.mp4/i,
    /\.mov/i,
    /\.avi/i,
    /\.webm/i,
    /video/i,
    /stream/i
  ];

  return videoPatterns.some(pattern => pattern.test(url));
}

/**
 * Generate unique filename based on URL
 */
function generateFilename(url, isVideo) {
  const hash = crypto.createHash('md5').update(url).digest('hex').substring(0, 12);
  const timestamp = Date.now();

  if (isVideo) {
    return `${timestamp}_${hash}.mp4`;
  } else {
    return `${timestamp}_${hash}.png`;
  }
}

/**
 * Download a single media file
 */
async function downloadFile(url, targetPath) {
  try {
    const response = await axios({
      method: 'get',
      url: url,
      responseType: 'stream',
      timeout: 30000,
      headers: getDownloadHeaders()
    });

    const writer = fs.createWriteStream(targetPath);

    response.data.pipe(writer);

    return new Promise((resolve, reject) => {
      writer.on('finish', () => resolve(targetPath));
      writer.on('error', reject);
    });
  } catch (error) {
    console.error(`Failed to download ${url}:`, error.message);
    throw error;
  }
}

/**
 * Download media files from URLs
 * @param {string[]} mediaUrls - Array of media URLs to download
 * @returns {Promise<Array<{url: string, localPath: string | null, type: string}>>}
 */
export async function downloadMedia(mediaUrls) {
  const results = [];

  for (const url of mediaUrls) {
    const isVideo = isVideoUrl(url);
    const type = isVideo ? 'video' : 'image';
    const targetDir = isVideo ? VIDEOS_DIR : IMAGES_DIR;
    const filename = generateFilename(url, isVideo);
    const targetPath = path.join(targetDir, filename);

    try {
      await downloadFile(url, targetPath);

      // Store relative path from project root
      const relativePath = path.join('storage', isVideo ? 'videos' : 'images', filename);

      results.push({
        url,
        localPath: relativePath,
        type
      });

      console.log(`Downloaded ${type}: ${filename}`);
    } catch (error) {
      // Store URL without local path if download fails
      results.push({
        url,
        localPath: null,
        type
      });

      console.error(`Failed to download ${type} from ${url}:`, error.message);
    }
  }

  return results;
}
