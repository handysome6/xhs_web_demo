import { useState } from 'react';
import LinkInput from '../components/LinkInput';
import PostList from '../components/PostList';

export default function HomePage() {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handlePostCreated = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <>
      <LinkInput onPostCreated={handlePostCreated} />
      <PostList refreshTrigger={refreshTrigger} />
    </>
  );
}
