import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getPost } from '../services/api';

// Fake AI labels for demonstration
const FAKE_LABELS = [
  '生活方式', '美食探店', '穿搭分享', '旅行日记', '护肤心得',
  '家居好物', '职场经验', '学习笔记', '健身打卡', '宠物日常'
];

function getRandomLabels() {
  const count = Math.floor(Math.random() * 3) + 2; // 2-4 labels
  const shuffled = [...FAKE_LABELS].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

export default function PostDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [fakeLabels] = useState(() => getRandomLabels());

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
            <span className="ai-badge">AI 生成</span>
          </div>
          <div className="labels-container">
            {fakeLabels.map((label, index) => (
              <span key={index} className="label-tag">{label}</span>
            ))}
          </div>
          <p className="ai-placeholder-note">* 标签由 AI 自动生成（演示数据）</p>
        </div>

        {/* AI Summary Section */}
        <div className="ai-section ai-summary">
          <div className="ai-section-header">
            <h3>AI 摘要</h3>
            <span className="ai-badge">AI 生成</span>
          </div>
          <div className="summary-content">
            <p>
              这是一篇关于{fakeLabels[0]}的分享。作者详细介绍了相关内容和个人体验，
              包含了{images.length}张精美图片{videos.length > 0 ? `和${videos.length}个视频` : ''}。
              内容丰富，值得收藏参考。
            </p>
          </div>
          <p className="ai-placeholder-note">* 摘要由 AI 自动生成（演示数据）</p>
        </div>

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
