import { useState, useEffect } from 'react';
import { getPosts } from '../services/api';
import PostCard from './PostCard';

export default function PostList({ refreshTrigger }) {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [total, setTotal] = useState(0);

  const loadPosts = async () => {
    setLoading(true);
    setError('');

    try {
      const data = await getPosts(50, 0);
      setPosts(data.posts);
      setTotal(data.total);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPosts();
  }, [refreshTrigger]);

  const handleDelete = (postId) => {
    setPosts(posts.filter(p => p.id !== postId));
    setTotal(total - 1);
  };

  if (loading) {
    return <div className="loading">加载中...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  if (posts.length === 0) {
    return (
      <div className="empty-state">
        <p>还没有保存的帖子</p>
        <p>在上方添加小红书链接开始吧！</p>
      </div>
    );
  }

  return (
    <div className="post-list-container">
      <h2>我的帖子 ({total})</h2>
      <div className="post-grid">
        {posts.map(post => (
          <PostCard
            key={post.id}
            post={post}
            onDelete={handleDelete}
          />
        ))}
      </div>
    </div>
  );
}
