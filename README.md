# XHS Web Demo

小红书帖子管理工具 - 保存、整理和分析你喜欢的小红书内容

## 功能特性

- ✅ 粘贴分享链接自动提取帖子内容
- ✅ 自动下载图片和视频到本地
- ✅ SQLite 数据库存储帖子信息
- ✅ 响应式网格布局展示帖子
- ✅ 支持删除帖子和关联媒体文件

## 技术栈

- **后端**: Node.js + Express
- **前端**: React + Vite
- **数据库**: SQLite
- **其他**: Axios, Cheerio

## 快速开始

### 安装依赖

```bash
# 安装后端依赖
npm install

# 安装前端依赖
cd client
npm install
cd ..
```

### 开发模式

需要开启两个终端：

**终端 1 - 启动后端服务器:**
```bash
npm run dev
```
服务器运行在 http://localhost:3000

**终端 2 - 启动前端开发服务器:**
```bash
npm run dev:client
```
前端运行在 http://localhost:5173

### 生产构建

```bash
# 构建前端
npm run build

# 启动生产服务器
NODE_ENV=production npm start
```

## 使用方法

1. 打开小红书APP，找到想要保存的帖子
2. 点击分享，复制分享链接
3. 在网页中粘贴分享文本
4. 如果需要Cookie认证，填写 xhsCookie 字段
5. 点击提交，系统自动提取并保存

## 项目结构

```
xhs_web_demo/
├── server/              # 后端代码
│   ├── db/              # 数据库层
│   ├── routes/          # API路由
│   ├── services/        # 业务逻辑
│   └── index.js         # 服务器入口
├── client/              # React前端
│   ├── src/
│   │   ├── components/  # React组件
│   │   ├── services/    # API客户端
│   │   └── App.jsx      # 主应用
├── storage/             # 媒体文件存储
│   ├── images/          # 图片
│   └── videos/          # 视频
├── openspec/            # 项目规范
└── xhs_posts.db         # SQLite数据库
```

## API 端点

- `POST /api/posts` - 创建新帖子
- `GET /api/posts` - 获取帖子列表
- `GET /api/posts/:id` - 获取单个帖子
- `DELETE /api/posts/:id` - 删除帖子
- `GET /storage/*` - 访问媒体文件

## 注意事项

- 部分小红书内容需要登录才能访问，需提供Cookie
- 媒体URL可能会过期，建议及时下载
- 本工具仅供个人学习使用

## License

MIT
