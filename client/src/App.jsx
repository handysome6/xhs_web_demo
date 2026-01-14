import { useState } from 'react';
import LinkInput from './components/LinkInput';
import PostList from './components/PostList';
import './App.css';

function App() {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handlePostCreated = () => {
    // Trigger PostList refresh
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>小红书帖子管理</h1>
        <p>保存和整理你喜欢的小红书内容</p>
      </header>

      <main className="app-main">
        <LinkInput onPostCreated={handlePostCreated} />
        <PostList refreshTrigger={refreshTrigger} />
      </main>

      <footer className="app-footer">
        <p>XHS Web Demo - 小红书帖子管理工具</p>
      </footer>
    </div>
  );
}

export default App;
