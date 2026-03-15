# 交互式 Agent 简历 - 实施计划

## Context

构建一个基于 OpenClaw 7 配置文件理念的交互式 Agent 简历应用。访客可以与代表简历主人的 AI 进行对话，AI 基于 7 个配置文件（IDENTITY、SOUL、USER、TOOLS、MEMORY、HEARTBEAT、BOOTSTRAP）来回答问题，形成具有一致人格和身份的对话体验。

**核心价值**：将传统静态简历转变为可交互的"数字分身"，访客可以通过对话了解简历主人的背景、技能、价值观等。

## Requirements Summary

- **应用类型**：交互式 Agent 简历
- **前端技术**：Vite + React 19 + Tailwind CSS v4 + Motion
- **后端技术**：Bun + Hono（轻量高性能）
- **AI 提供商**：Google Gemini（已配置 @google/genai）
- **核心功能**：
  1. 对话功能（流式响应）
  2. 7 个配置文件预览
  3. 对话历史（localStorage）
  4. 主题切换（亮/暗）

## Current State

项目已初始化，前端 UI 框架已完成：
- ✅ Vite + React 配置
- ✅ Tailwind CSS v4 主题系统
- ✅ 侧边栏导航（7个配置文件）
- ✅ 主内容区域布局
- ✅ 底部命令栏（输入框）
- ⏳ 聊天功能（待实现）
- ⏳ 配置文件加载（当前硬编码）
- ⏳ 后端 API（待实现）

## Architecture

```
┌─────────────────────────────────────────────────────┐
│              Vite Dev Server (前端开发)              │
│              Bun + Hono (后端服务)                   │
│                                                     │
│  ┌─────────────────────────────────────────────┐    │
│  │ React Frontend (src/)                       │    │
│  │ - App.tsx (主布局)                          │    │
│  │ - components/ (待创建)                      │    │
│  │   - ChatBox.tsx                            │    │
│  │   - FileViewer.tsx                         │    │
│  │   - ThemeToggle.tsx                        │    │
│  └─────────────────────────────────────────────┘    │
│                      │                              │
│                      ▼                              │
│  ┌─────────────────────────────────────────────┐    │
│  │ Bun + Hono Backend (server/)                │    │
│  │ - GET /api/files → 配置文件列表/内容        │    │
│  │ - POST /api/chat → AI 对话 (流式)          │    │
│  └─────────────────────────────────────────────┘    │
│                      │                              │
│                      ▼                              │
│  ┌─────────────────────────────────────────────┐    │
│  │ Google Gemini AI                            │    │
│  │ - 已配置 @google/genai                     │    │
│  │ - 使用 7 个配置文件作为 system prompt      │    │
│  └─────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────┘
```

## File Structure

```
readme/
├── src/                        # React 前端
│   ├── main.tsx               # 入口
│   ├── App.tsx                # 主应用组件（已有）
│   ├── index.css              # Tailwind 样式（已有）
│   ├── components/            # 待创建
│   │   ├── ChatBox.tsx        # 对话组件
│   │   ├── FileViewer.tsx     # 文件预览组件
│   │   ├── MessageItem.tsx    # 消息项组件
│   │   └── ThemeToggle.tsx    # 主题切换组件
│   ├── hooks/                 # 自定义 Hooks
│   │   ├── useChat.ts         # 聊天逻辑
│   │   └── useFiles.ts        # 文件加载
│   └── lib/                   # 工具函数
│       ├── api.ts             # API 客户端
│       └── storage.ts         # localStorage
├── agent/                      # Bun + Hono 后端 + 配置文件
│   ├── index.ts               # Hono 服务入口
│   ├── routes/
│   │   ├── chat.ts            # 聊天 API
│   │   └── files.ts           # 文件 API
│   ├── services/
│   │   └── gemini.ts          # Gemini AI 服务
│   ├── config/                # 7 个配置文件
│   │   ├── IDENTITY.md
│   │   ├── SOUL.md
│   │   ├── USER.md
│   │   ├── TOOLS.md
│   │   ├── MEMORY.md
│   │   ├── HEARTBEAT.md
│   │   └── BOOTSTRAP.md
│   └── package.json           # 后端依赖
├── public/                     # 静态资源
├── index.html                  # HTML 入口（已有）
├── vite.config.ts              # Vite 配置（已有）
├── package.json                # 前端依赖（已有）
├── tsconfig.json               # TS 配置（已有）
├── .env                        # 环境变量
└── .env.example                # 环境变量示例
```

## Implementation Steps

### Step 1: 创建配置文件目录和示例文件
```bash
mkdir -p config
```

创建 7 个配置文件（IDENTITY.md, SOUL.md 等）

### Step 2: 创建 Bun + Hono 后端

#### 创建 agent 目录结构
```bash
mkdir -p agent/routes agent/services agent/config
cd agent
bun init
bun add hono
```

#### `agent/index.ts`
```typescript
import { Hono } from 'hono'
import { cors } from 'hono/cors'
import chatRouter from './routes/chat'
import filesRouter from './routes/files'

const app = new Hono()

// CORS 配置
app.use('/*', cors())

// API 路由
app.route('/api/chat', chatRouter)
app.route('/api/files', filesRouter)

// 健康检查
app.get('/api/health', (c) => c.json({ status: 'ok' }))

export default {
  port: process.env.PORT || 3001,
  fetch: app.fetch,
}
```

#### `agent/routes/files.ts`
```typescript
import { Hono } from 'hono'

const files = new Hono()
const CONFIG_DIR = './config'  // 相对于 agent 目录

// 获取配置文件列表
files.get('/', async (c) => {
  const configFiles = ['IDENTITY', 'SOUL', 'USER', 'TOOLS', 'MEMORY', 'HEARTBEAT', 'BOOTSTRAP']
  const list = []

  for (const name of configFiles) {
    try {
      await Bun.file(`${CONFIG_DIR}/${name}.md`).text()
      list.push({ name, path: `/api/files/${name}` })
    } catch {
      // 文件不存在时跳过
    }
  }

  return c.json(list)
})

// 获取单个文件内容
files.get('/:name', async (c) => {
  const name = c.req.param('name').toUpperCase()
  try {
    const content = await Bun.file(`${CONFIG_DIR}/${name}.md`).text()
    return c.json({ name, content })
  } catch {
    return c.json({ error: 'File not found' }, 404)
  }
})

export default files
```

#### `agent/routes/chat.ts`
```typescript
import { Hono } from 'hono'
import { streamSSE } from 'hono/streaming'
import { chatWithGemini } from '../services/gemini'

const chat = new Hono()

chat.post('/', async (c) => {
  const body = await c.req.json()
  const { messages, stream = true } = body

  if (stream) {
    return streamSSE(c, async (stream) => {
      for await (const chunk of chatWithGemini(messages)) {
        await stream.writeSSE({
          data: JSON.stringify({ content: chunk })
        })
      }
      await stream.writeSSE({ data: '[DONE]' })
    })
  }

  // 非流式响应
  const response = await chatWithGemini(messages, false)
  return c.json({ content: response })
})

export default chat
```

#### `agent/services/gemini.ts`
```typescript
import { GoogleGenAI } from '@google/genai'

const genAI = new GoogleGenAI(process.env.GEMINI_API_KEY || '')

async function loadSystemPrompt(): Promise<string> {
  const configFiles = ['IDENTITY', 'SOUL', 'USER', 'TOOLS', 'MEMORY', 'HEARTBEAT', 'BOOTSTRAP']
  const parts: string[] = []

  for (const name of configFiles) {
    try {
      const content = await Bun.file(`./config/${name}.md`).text()
      parts.push(`## ${name}\n\n${content}`)
    } catch {
      // 文件不存在时跳过
    }
  }

  return `你是一个基于以下配置文件的 AI Agent，代表简历主人回答问题：

${parts.join('\n\n---\n\n')}

请基于以上配置文件的内容，以第一人称回答用户的问题。保持一致的人格和风格。`
}

export async function* chatWithGemini(
  messages: Array<{ role: string; content: string }>,
  stream = true
): AsyncGenerator<string> {
  const systemPrompt = await loadSystemPrompt()

  const contents = messages.map(msg => ({
    role: msg.role === 'user' ? 'user' : 'model',
    parts: [{ text: msg.content }]
  }))

  const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' })

  if (stream) {
    const result = await model.generateContentStream({
      contents,
      systemInstruction: systemPrompt
    })

    for await (const chunk of result.stream) {
      const text = chunk.text()
      if (text) yield text
    }
  } else {
    const result = await model.generateContent({
      contents,
      systemInstruction: systemPrompt
    })
    return result.response.text()
  }
}
```

### Step 3: 创建 7 个配置文件

在 `agent/config/` 目录下创建：
- IDENTITY.md
- SOUL.md
- USER.md
- TOOLS.md
- MEMORY.md
- HEARTBEAT.md
- BOOTSTRAP.md

### Step 3: 修改 Vite 配置支持代理

#### `vite.config.ts` 添加代理
```typescript
server: {
  proxy: {
    '/api': 'http://localhost:3001'
  }
}
```

### Step 4: 重构 React 组件

#### 修改 `src/App.tsx`
- 拆分现有代码为独立组件
- 添加状态管理（当前 tab, 聊天消息等）

#### 创建 `src/components/ChatBox.tsx`
- 聊天消息列表
- 输入框和发送逻辑
- 流式响应处理

#### 创建 `src/components/FileViewer.tsx`
- 从 API 加载配置文件内容
- Markdown 渲染

#### 创建 `src/components/MessageItem.tsx`
- 单条消息显示
- 用户/AI 消息样式区分

#### 创建 `src/components/ThemeToggle.tsx`
- 亮/暗主题切换
- 保存偏好到 localStorage

### Step 5: 创建自定义 Hooks

#### `src/hooks/useChat.ts`
```typescript
export function useChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = async (content: string) => {
    // 调用 /api/chat
    // 处理流式响应
  };

  return { messages, isLoading, sendMessage };
}
```

#### `src/hooks/useFiles.ts`
```typescript
export function useFiles() {
  const [files, setFiles] = useState<FileInfo[]>([]);
  const [activeFile, setActiveFile] = useState<string>('IDENTITY');

  const loadFile = async (name: string) => {
    // 调用 /api/files/:name
  };

  return { files, activeFile, loadFile, setActiveFile };
}
```

### Step 7: 更新 package.json 脚本

#### 根目录 `package.json`
```json
{
  "scripts": {
    "dev": "vite --port=3000 --host=0.0.0.0",
    "dev:agent": "cd agent && bun run --watch index.ts",
    "dev:all": "concurrently \"bun run dev:agent\" \"bun run dev\"",
    "build": "vite build",
    "start": "cd agent && bun run index.ts"
  }
}
```

#### `agent/package.json`
```json
{
  "name": "agent-resume-server",
  "type": "module",
  "scripts": {
    "dev": "bun run --watch index.ts",
    "start": "bun run index.ts"
  },
  "dependencies": {
    "hono": "^4.0.0",
    "@google/genai": "^1.29.0"
  }
}
```

### Step 7: 添加暗色主题支持

在 `src/index.css` 中添加暗色主题变量：
```css
@media (prefers-color-scheme: dark) {
  @theme {
    --color-background: #0f1419;
    --color-surface: #1a1f25;
    /* ... 其他暗色变量 */
  }
}
```

## API Specification

### 1. 聊天 API

**Endpoint**: `POST /api/chat`

**Request**:
```json
{
  "messages": [
    {"role": "user", "content": "请介绍一下你自己"}
  ],
  "stream": true
}
```

**Response (Streaming)**:
```
data: {"content":"你"}
data: {"content":"好"}
data: [DONE]
```

### 2. 配置文件 API

**获取文件列表**: `GET /api/files`

**Response**:
```json
[
  {"name": "IDENTITY", "path": "/api/files/IDENTITY"},
  {"name": "SOUL", "path": "/api/files/SOUL"},
  ...
]
```

**获取文件内容**: `GET /api/files/:name`

**Response**:
```json
{
  "name": "IDENTITY",
  "content": "# Identity\n\n..."
}
```

## UI/UX Design

### 布局（使用 Tailwind）
- **桌面端**：`flex` 左侧文件预览，右侧对话区域
- **移动端**：Tab 切换文件预览和对话
- 使用 `dark:` 前缀实现暗色主题

### Tailwind Dark Mode
```html
<html class="dark">
  <!-- dark mode content -->
</html>
```
- 使用 `class` 策略切换主题
- 保存偏好到 localStorage

### 交互
- 对话支持 Enter 发送
- 流式响应显示打字效果
- 消息支持复制功能

## Verification

1. **安装依赖**：
   ```bash
   # 前端依赖
   bun install

   # 后端依赖
   cd agent && bun install
   ```

2. **启动开发服务**：
   ```bash
   # 方式1：分别启动
   bun run dev           # 前端 (localhost:3000)
   bun run dev:agent     # 后端 (localhost:3001)

   # 方式2：同时启动
   bun run dev:all
   ```

3. **功能测试**：
   - 访问 `http://localhost:3000` 验证页面加载
   - 测试 7 个配置文件的切换和显示
   - 测试对话功能
   - 测试流式响应显示
   - 测试主题切换
   - 测试对话历史保存/加载

4. **API 测试**：
   ```bash
   # 获取文件列表
   curl http://localhost:3001/api/files

   # 获取单个文件
   curl http://localhost:3001/api/files/IDENTITY

   # 聊天测试
   curl -X POST http://localhost:3001/api/chat \
     -H "Content-Type: application/json" \
     -d '{"messages":[{"role":"user","content":"你好"}]}'
   ```

5. **兼容性测试**：
   - Chrome/Firefox/Safari 最新版
   - 移动端浏览器
   - 不同屏幕尺寸

6. **部署测试**：
   - 前端：构建后部署到静态托管
   - 后端：部署到 VPS / Cloud Run / Serverless
   - 验证前后端通信正常

## Critical Files to Create

### Frontend (React)
| File | Purpose |
|------|---------|
| `src/components/ChatBox.tsx` | 对话组件 |
| `src/components/FileViewer.tsx` | 文件预览组件 |
| `src/components/MessageItem.tsx` | 消息项组件 |
| `src/components/ThemeToggle.tsx` | 主题切换组件 |
| `src/hooks/useChat.ts` | 聊天逻辑 Hook |
| `src/hooks/useFiles.ts` | 文件加载 Hook |
| `src/lib/api.ts` | API 客户端 |

### Backend (agent/ - Bun + Hono)
| File | Purpose |
|------|---------|
| `agent/index.ts` | Hono 服务入口 |
| `agent/routes/chat.ts` | 聊天 API 路由 |
| `agent/routes/files.ts` | 配置文件 API |
| `agent/services/gemini.ts` | Gemini AI 服务 |

### Config Files (agent/config/)
| File | Purpose |
|------|---------|
| `agent/config/IDENTITY.md` | 身份配置 |
| `agent/config/SOUL.md` | 灵魂/性格配置 |
| `agent/config/USER.md` | 服务对象配置 |
| `agent/config/TOOLS.md` | 能力配置 |
| `agent/config/MEMORY.md` | 记忆配置 |
| `agent/config/HEARTBEAT.md` | 工作节奏配置 |
| `agent/config/BOOTSTRAP.md` | 启动配置 |

## Dependencies

### Frontend (根目录 - 已安装)
- **Vite** - 构建工具
- **React 19** - UI 框架
- **Tailwind CSS v4** - 样式
- **Lucide React** - 图标
- **Motion** - 动画

### Backend (agent/ - 需安装)
- **Bun** - 运行时环境
- **Hono** - 轻量级 Web 框架
- **@google/genai** - Gemini AI SDK

## Notes

- 前端使用 Vite + React（已有基础框架）
- 后端使用 Bun + Hono（在 `agent/` 目录）
- 配置文件放在 `agent/config/` 目录
- AI 使用 Google Gemini
- 前端通过 Vite 代理连接后端 (localhost:3001)
- 支持 `bun run dev:all` 同时启动前后端
