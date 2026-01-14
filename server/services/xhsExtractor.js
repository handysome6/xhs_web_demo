import axios from 'axios';
import * as cheerio from 'cheerio';

async function getHeaders() {
  return {
    "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
    "accept-language": "zh-CN,zh;q=0.9",
    "cache-control": "no-cache",
    "pragma": "no-cache",
    "sec-ch-ua": "\"Google Chrome\";v=\"119\", \"Chromium\";v=\"119\", \"Not?A_Brand\";v=\"24\"",
    "sec-ch-ua-mobile": "?0",
    "sec-ch-ua-platform": "\"macOS\"",
    "sec-fetch-dest": "document",
    "sec-fetch-mode": "navigate",
    "sec-fetch-site": "none",
    "sec-fetch-user": "?1",
    "upgrade-insecure-requests": "1",
    "user-agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
  };
}

async function getFullURL(shortURLWithText) {
  const headers = await getHeaders();
  // 正则表达式提取url
  const urlRegex = /(http[s]?:\/\/[^\s，]+)/;
  const match = shortURLWithText.match(urlRegex);

  if (!match || !match[0]) {
    throw new Error('未找到有效的URL');
  }

  const shortURL = match[0];

  try {
    const response = await axios.get(shortURL, {
      headers,
      maxRedirects: 0
    });
    return shortURL;
  } catch (error) {
    if (error.response && error.response.headers.location) {
      return error.response.headers.location;
    }
    throw error;
  }
}

async function findDom(htmlContent) {
  const $ = cheerio.load(htmlContent);

  let initialStateScript;
  $('script').each((index, script) => {
    const scriptContent = $(script).html();
    if (scriptContent && scriptContent.includes('window.__INITIAL_STATE__')) {
      initialStateScript = scriptContent;
    }
  });

  // 提取window.__INITIAL_STATE__的值
  let initialState;
  if (initialStateScript) {
    const startIndex = initialStateScript.indexOf('{');
    const endIndex = initialStateScript.lastIndexOf('}');

    if (startIndex !== -1 && endIndex !== -1) {
      const jsonString = initialStateScript.substring(startIndex, endIndex + 1);
      const unescapedString = jsonString.replace(/\\u([\d\w]{4})/gi, (match, grp) => String.fromCharCode(parseInt(grp, 16)));
      initialState = eval('(' + unescapedString + ')');
    }
  }
  return initialState;
}

async function extractPostContent(fullUrl, xhsCookie) {
  const headers = await getHeaders();
  if (xhsCookie) {
    headers['cookie'] = xhsCookie;
  }

  const response = await axios.get(fullUrl, {
    headers
  });

  const responseData = response.data;
  const resultObj = await findDom(responseData);

  if (!resultObj || !resultObj.note) {
    throw new Error('无法解析页面内容，可能需要登录');
  }

  let note = null;
  let imageList = [];

  try {
    note = resultObj.note.noteDetailMap[resultObj.note.firstNoteId].note;
    imageList = note?.imageList || [];
  } catch (error) {
    console.log(error);
    throw new Error('无法获取笔记信息');
  }

  // Extract title and description
  const title = note?.title || '';
  const description = note?.desc || '';

  // Extract image URLs - keep full URL with format suffix
  let imageUrls = [];
  imageList.forEach((item) => {
    try {
      let originalUrl = item.infoList?.[0]?.url;
      if (originalUrl) {
        // Ensure HTTPS protocol
        if (originalUrl.startsWith('http://')) {
          originalUrl = originalUrl.replace('http://', 'https://');
        }
        // Keep full URL including !suffix (required by CDN)
        imageUrls.push(originalUrl);
      }
    } catch (error) {
      console.log('Failed to extract image URL:', error);
    }
  });

  // Extract live photo videos
  imageList.forEach((item) => {
    try {
      const livePhotoVideoUrl = item?.stream?.h264?.[0]?.masterUrl;
      if (livePhotoVideoUrl) {
        imageUrls.push(livePhotoVideoUrl);
      }
    } catch (error) {
      console.log(error);
    }
  });

  // Extract video URL
  let videoUrl = null;
  try {
    const media = note.video.media;
    const streamType = media.video.streamTypes[0];
    Object.entries(media.stream).forEach(([key, value]) => {
      if (value.length > 0 && value[0].streamType === streamType) {
        videoUrl = value[0].masterUrl;
      }
    });
  } catch (error) {
    // No video in this post
  }

  const mediaUrls = [...imageUrls];
  if (videoUrl) {
    mediaUrls.push(videoUrl);
  }

  if (mediaUrls.length === 0) {
    throw new Error('不包含图片或视频');
  }

  return {
    title,
    description,
    mediaUrls,
    fullUrl
  };
}

/**
 * Extract XHS post content from share text
 * @param {string} shareText - Share text containing XHS URL
 * @param {string} xhsCookie - Optional XHS cookie for authentication
 * @returns {Promise<{title: string, description: string, mediaUrls: string[], fullUrl: string}>}
 */
export async function extractPost(shareText, xhsCookie) {
  if (!shareText) {
    throw new Error('缺少shareText参数');
  }

  console.log(`shareText->${shareText}`);
  const fullUrl = await getFullURL(shareText);
  console.log(`fullUrl->${fullUrl}`);

  const result = await extractPostContent(fullUrl, xhsCookie);
  return result;
}
