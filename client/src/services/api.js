const API_BASE = '/api';

export async function createPost(shareText, xhsCookie = '') {
  const response = await fetch(`${API_BASE}/posts`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ shareText, xhsCookie })
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || '创建帖子失败');
  }

  return response.json();
}

export async function getPosts(limit = 20, offset = 0) {
  const response = await fetch(`${API_BASE}/posts?limit=${limit}&offset=${offset}`);

  if (!response.ok) {
    throw new Error('获取帖子列表失败');
  }

  return response.json();
}

export async function getPost(id) {
  const response = await fetch(`${API_BASE}/posts/${id}`);

  if (!response.ok) {
    throw new Error('获取帖子失败');
  }

  return response.json();
}

export async function deletePost(id) {
  const response = await fetch(`${API_BASE}/posts/${id}`, {
    method: 'DELETE'
  });

  if (!response.ok) {
    throw new Error('删除帖子失败');
  }

  return response.json();
}

export async function processPostWithAI(id) {
  const response = await fetch(`${API_BASE}/posts/${id}/process`, {
    method: 'POST'
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'AI处理失败');
  }

  return response.json();
}
