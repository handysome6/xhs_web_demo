import { useState } from 'react';
import { createPost } from '../services/api';

export default function LinkInput({ onPostCreated }) {
  const [shareText, setShareText] = useState('');
  const [xhsCookie, setXhsCookie] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const result = await createPost(shareText, xhsCookie);
      setSuccess(result.message);
      setShareText('');

      if (onPostCreated) {
        onPostCreated(result.post);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="link-input-container">
      <h2>添加小红书帖子</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="shareText">分享链接</label>
          <textarea
            id="shareText"
            value={shareText}
            onChange={(e) => setShareText(e.target.value)}
            placeholder="粘贴小红书分享文本（包含链接）"
            rows="4"
            required
            disabled={loading}
          />
        </div>

        <div className="form-group">
          <label htmlFor="xhsCookie">Cookie（可选）</label>
          <input
            type="text"
            id="xhsCookie"
            value={xhsCookie}
            onChange={(e) => setXhsCookie(e.target.value)}
            placeholder="如果需要登录才能访问，请填写Cookie"
            disabled={loading}
          />
        </div>

        <button type="submit" disabled={loading}>
          {loading ? '处理中...' : '提交'}
        </button>
      </form>

      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}
    </div>
  );
}
