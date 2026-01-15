import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Markdown from 'react-markdown';
import { getPost, processPostWithAI } from '../services/api';

const POLL_INTERVAL = 2000; // 2 seconds
const POLL_TIMEOUT = 60000; // 60 seconds

export default function PostDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const pollStartTime = useRef(null);
  const pollTimer = useRef(null);

  // Check if AI is currently processing
  const isAiProcessing = post?.ai_status === 'pending' || post?.ai_status === 'processing';

  // Fetch post data
  const fetchPost = useCallback(async () => {
    try {
      const data = await getPost(id);
      setPost(data.post);
      return data.post;
    } catch (err) {
      setError(err.message);
      return null;
    }
  }, [id]);

  // Start polling for AI status updates
  const startPolling = useCallback(() => {
    if (pollTimer.current) return; // Already polling

    pollStartTime.current = Date.now();
    console.log('Starting AI status polling...');

    const poll = async () => {
      // Check timeout
      if (Date.now() - pollStartTime.current > POLL_TIMEOUT) {
        console.log('Polling timeout reached');
        stopPolling();
        return;
      }

      const updatedPost = await fetchPost();

      // Stop polling if status changed to completed or failed
      if (updatedPost && (updatedPost.ai_status === 'completed' || updatedPost.ai_status === 'failed')) {
        console.log(`AI processing ${updatedPost.ai_status}`);
        stopPolling();
        return;
      }

      // Continue polling
      pollTimer.current = setTimeout(poll, POLL_INTERVAL);
    };

    pollTimer.current = setTimeout(poll, POLL_INTERVAL);
  }, [fetchPost]);

  // Stop polling
  const stopPolling = useCallback(() => {
    if (pollTimer.current) {
      clearTimeout(pollTimer.current);
      pollTimer.current = null;
      pollStartTime.current = null;
      console.log('Stopped AI status polling');
    }
  }, []);

  // Initial fetch
  useEffect(() => {
    async function init() {
      setLoading(true);
      const fetchedPost = await fetchPost();
      setLoading(false);

      // Start polling if AI is processing
      if (fetchedPost && (fetchedPost.ai_status === 'pending' || fetchedPost.ai_status === 'processing')) {
        startPolling();
      }
    }
    init();

    // Cleanup on unmount
    return () => stopPolling();
  }, [id, fetchPost, startPolling, stopPolling]);

  // Handle manual AI processing trigger
  const handleProcessAI = async () => {
    try {
      const data = await processPostWithAI(id);
      setPost(data.post);

      // Start polling since processing is now async
      startPolling();
    } catch (err) {
      alert('AI处理触发失败: ' + err.message);
    }
  };

  if (loading) {
    return (
      <div className="detail-loading">
        <p>加载中...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="detail-error">
        <h2>加载失败</h2>
        <p>{error}</p>
        <button onClick={() => navigate('/')}>返回首页</button>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="detail-error">
        <h2>帖子不存在</h2>
        <p>找不到该帖子，可能已被删除</p>
        <button onClick={() => navigate('/')}>返回首页</button>
      </div>
    );
  }

  const images = post.media_paths?.filter(m => m.type === 'image') || [];
  const videos = post.media_paths?.filter(m => m.type === 'video') || [];
  const hasAiData = post.ai_labels?.length > 0 || post.ai_summary;
  const aiStatus = post.ai_status || 'pending';

  return (
    <div className="post-detail">
      <button className="back-button" onClick={() => navigate('/')}>
        ← 返回列表
      </button>

      <div className="detail-content">
        <h1 className="detail-title">{post.title || '无标题'}</h1>

        <div className="detail-meta">
          <span className="detail-date">
            保存于 {new Date(post.created_at).toLocaleDateString('zh-CN', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </span>
          <span className="detail-media-count">
            {images.length} 张图片 · {videos.length} 个视频
          </span>
        </div>

        {/* AI Labels Section */}
        <div className="ai-section ai-labels">
          <div className="ai-section-header">
            <h3>AI 标签</h3>
            {post.ai_labels?.length > 0 && <span className="ai-badge">AI 生成</span>}
          </div>
          {isAiProcessing ? (
            <div className="ai-loading">
              <span className="spinner"></span> AI 处理中...
            </div>
          ) : post.ai_labels?.length > 0 ? (
            <div className="labels-container">
              {post.ai_labels.map((label, index) => (
                <span key={index} className="label-tag">{label}</span>
              ))}
            </div>
          ) : (
            <div className="ai-not-processed">
              <p>{aiStatus === 'failed' ? 'AI 处理失败' : '暂无 AI 标签'}</p>
              <button
                className="process-btn"
                onClick={handleProcessAI}
                disabled={isAiProcessing}
              >
                {aiStatus === 'failed' ? '重试' : '生成 AI 标签'}
              </button>
            </div>
          )}
        </div>

        {/* AI Summary Section */}
        <div className="ai-section ai-summary">
          <div className="ai-section-header">
            <h3>AI 摘要</h3>
            {post.ai_summary && <span className="ai-badge">AI 生成</span>}
          </div>
          {isAiProcessing ? (
            <div className="ai-loading">
              <span className="spinner"></span> AI 处理中...
            </div>
          ) : post.ai_summary ? (
            <div className="summary-content markdown-content">
              <Markdown>{post.ai_summary}</Markdown>
            </div>
          ) : (
            <div className="ai-not-processed">
              <p>{aiStatus === 'failed' ? 'AI 处理失败' : '暂无 AI 摘要'}</p>
              {!post.ai_labels?.length && (
                <button
                  className="process-btn"
                  onClick={handleProcessAI}
                  disabled={isAiProcessing}
                >
                  {aiStatus === 'failed' ? '重试' : '生成 AI 摘要'}
                </button>
              )}
            </div>
          )}
        </div>

        {/* Re-process button if already has AI data */}
        {hasAiData && (
          <div className="ai-reprocess">
            <button
              className="reprocess-btn"
              onClick={handleProcessAI}
              disabled={isAiProcessing}
            >
              {isAiProcessing ? '处理中...' : '重新生成 AI 内容'}
            </button>
          </div>
        )}

        {/* Description */}
        <div className="detail-description">
          <h3>原文内容</h3>
          <p>{post.description || '暂无描述'}</p>
        </div>

        {/* Image Gallery */}
        {images.length > 0 && (
          <div className="detail-gallery">
            <h3>图片 ({images.length})</h3>
            <div className="gallery-grid">
              {images.map((img, index) => (
                <div key={index} className="gallery-item">
                  <img src={`/${img.localPath}`} alt={`图片 ${index + 1}`} />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Video Player */}
        {videos.length > 0 && (
          <div className="detail-videos">
            <h3>视频 ({videos.length})</h3>
            <div className="videos-container">
              {videos.map((video, index) => (
                <div key={index} className="video-item">
                  <video controls>
                    <source src={`/${video.localPath}`} type="video/mp4" />
                    您的浏览器不支持视频播放
                  </video>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
