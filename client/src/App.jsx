import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import PostDetail from './pages/PostDetail';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <div className="app">
        <header className="app-header">
          <h1>小红书帖子管理</h1>
          <p>保存和整理你喜欢的小红书内容</p>
        </header>

        <main className="app-main">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/posts/:id" element={<PostDetail />} />
          </Routes>
        </main>

        <footer className="app-footer">
          <p>XHS Web Demo - 小红书帖子管理工具</p>
        </footer>
      </div>
    </BrowserRouter>
  );
}

export default App;
