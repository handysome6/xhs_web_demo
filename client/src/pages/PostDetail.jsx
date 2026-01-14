import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getPost, processPostWithAI } from '../services/api';

export default function PostDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    async function fetchPost() {
      try {
        setLoading(true);
        const data = await getPost(id);
        setPost(data.post);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchPost();
  }, [id]);

  const handleProcessAI = async () => {
    try {
      setProcessing(true);
      const data = await processPostWithAI(id);
      setPost(data.post);
    } catch (err) {
      alert('AI处理失败: ' + err.message);
    } finally {
      setProcessing(false);
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
          {processing ? (
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
              <p>暂无 AI 标签</p>
              <button
                className="process-btn"
                onClick={handleProcessAI}
                disabled={processing}
              >
                生成 AI 标签
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
          {processing ? (
            <div className="ai-loading">
              <span className="spinner"></span> AI 处理中...
            </div>
          ) : post.ai_summary ? (
            <div className="summary-content">
              <p>{post.ai_summary}</p>
            </div>
          ) : (
            <div className="ai-not-processed">
              <p>暂无 AI 摘要</p>
              {!post.ai_labels?.length && (
                <button
                  className="process-btn"
                  onClick={handleProcessAI}
                  disabled={processing}
                >
                  生成 AI 摘要
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
              disabled={processing}
            >
              {processing ? '处理中...' : '重新生成 AI 内容'}
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
