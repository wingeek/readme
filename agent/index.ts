import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { config } from 'dotenv'
import { resolve } from 'path'
import chatRouter from './routes/chat'
import filesRouter from './routes/files'

// 加载根目录的 .env 文件
config({ path: resolve(import.meta.dir, '../.env') })

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
