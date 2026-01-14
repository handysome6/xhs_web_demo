/**
 * AI Service - OpenRouter API integration for generating labels and summaries
 * Supports different API keys and models for video vs non-video posts
 */

// Configuration from environment variables
const CONFIG = {
  video: {
    apiKey: process.env.OPENROUTER_API_KEY_VIDEO || '',
    model: process.env.OPENROUTER_MODEL_VIDEO || 'google/gemini-flash-1.5'
  },
  image: {
    apiKey: process.env.OPENROUTER_API_KEY_IMAGE || '',
    model: process.env.OPENROUTER_MODEL_IMAGE || 'google/gemini-flash-1.5'
  }
};

const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions';

/**
 * Check if a post contains video
 */
function isVideoPost(mediaPaths) {
  return mediaPaths?.some(m => m.type === 'video') || false;
}

/**
 * Get the appropriate config based on post type
 */
function getConfig(mediaPaths) {
  return isVideoPost(mediaPaths) ? CONFIG.video : CONFIG.image;
}

/**
 * Make a request to OpenRouter API
 */
async function callOpenRouter(apiKey, model, messages) {
  const response = await fetch(OPENROUTER_API_URL, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': 'http://localhost:3000',
      'X-Title': 'XHS Post Manager'
    },
    body: JSON.stringify({
      model,
      messages
    })
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`OpenRouter API error: ${response.status} - ${error}`);
  }

  const data = await response.json();
  return data.choices?.[0]?.message?.content || '';
}

/**
 * Generate labels for a post
 */
export async function generateLabels(title, description, mediaPaths) {
  const config = getConfig(mediaPaths);

  if (!config.apiKey) {
    console.warn(`AI labels skipped: No API key configured for ${isVideoPost(mediaPaths) ? 'video' : 'image'} posts`);
    return null;
  }

  const prompt = `你是一个内容分类助手。请根据以下小红书帖子内容，生成3-5个相关的中文分类标签。

标题：${title || '无标题'}

内容：${description || '无描述'}

要求：
1. 返回3-5个标签，用逗号分隔
2. 标签应该简洁，每个2-4个字
3. 标签应该反映内容的主题、类型或领域
4. 只返回标签，不要其他解释

示例格式：美食探店,生活分享,旅行日记`;

  try {
    const response = await callOpenRouter(config.apiKey, config.model, [
      { role: 'user', content: prompt }
    ]);

    // Parse the comma-separated labels
    const labels = response
      .split(/[,，]/)
      .map(label => label.trim())
      .filter(label => label.length > 0 && label.length <= 10)
      .slice(0, 5);

    return labels.length > 0 ? labels : null;
  } catch (error) {
    console.error('Error generating labels:', error.message);
    throw error;
  }
}

/**
 * Generate summary for a post
 */
export async function generateSummary(title, description, mediaPaths) {
  const config = getConfig(mediaPaths);

  if (!config.apiKey) {
    console.warn(`AI summary skipped: No API key configured for ${isVideoPost(mediaPaths) ? 'video' : 'image'} posts`);
    return null;
  }

  const prompt = `你是一个内容摘要助手。请根据以下小红书帖子内容，生成一份摘要。

标题：${title || '无标题'}

内容：${description || '无描述'}

要求：
1. 摘要应该控制在200字以内
2. 概括帖子的主要内容, 不要包含亮点
3. 使用简洁、通顺的中文
4. 只返回摘要内容，不要其他解释
5. 必要时使用bullet points格式来组织内容`;

  try {
    const response = await callOpenRouter(config.apiKey, config.model, [
      { role: 'user', content: prompt }
    ]);

    return response.trim() || null;
  } catch (error) {
    console.error('Error generating summary:', error.message);
    throw error;
  }
}

/**
 * Process a post with AI - generate both labels and summary
 */
export async function processPost(post) {
  const { title, description, media_paths } = post;
  const config = getConfig(media_paths);

  if (!config.apiKey) {
    const postType = isVideoPost(media_paths) ? 'video' : 'image';
    console.warn(`AI processing skipped: No API key configured for ${postType} posts`);
    return { labels: null, summary: null };
  }

  console.log(`Processing post ${post.id} with model: ${config.model}`);

  const [labels, summary] = await Promise.all([
    generateLabels(title, description, media_paths).catch(err => {
      console.error('Failed to generate labels:', err.message);
      return null;
    }),
    generateSummary(title, description, media_paths).catch(err => {
      console.error('Failed to generate summary:', err.message);
      return null;
    })
  ]);

  return { labels, summary };
}

/**
 * Check if AI processing is configured
 */
export function isConfigured(mediaPaths) {
  const config = getConfig(mediaPaths);
  return !!config.apiKey;
}
