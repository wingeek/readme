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
