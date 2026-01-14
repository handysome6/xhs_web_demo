import { useState } from 'react';
import { deletePost } from '../services/api';

export default function PostCard({ post, onDelete }) {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    if (!confirm('确定要删除这个帖子吗？')) {
      return;
    }

    setLoading(true);
    try {
      await deletePost(post.id);
      if (onDelete) {
        onDelete(post.id);
      }
    } catch (error) {
      alert('删除失败: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Get first image for thumbnail
  const thumbnail = post.media_paths?.find(m => m.type === 'image');
  const mediaCount = post.media_paths?.length || 0;

  return (
    <div className="post-card">
      {thumbnail?.localPath && (
        <div className="post-thumbnail">
          <img src={`/${thumbnail.localPath}`} alt={post.title} />
          <div className="media-count-badge">{mediaCount} 个媒体</div>
        </div>
      )}

      <div className="post-content">
        <h3>{post.title || '无标题'}</h3>
        <p className="post-description">
          {post.description?.substring(0, 100)}
          {post.description?.length > 100 && '...'}
        </p>

        <div className="post-footer">
          <span className="post-date">
            {new Date(post.created_at).toLocaleDateString('zh-CN')}
          </span>
          <button
            className="delete-btn"
            onClick={handleDelete}
            disabled={loading}
          >
            {loading ? '删除中...' : '删除'}
          </button>
        </div>
      </div>
    </div>
  );
}
