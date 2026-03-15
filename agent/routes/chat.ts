import { Hono } from 'hono'
import { chatWithZhipu } from '../services/zhipu'

const chat = new Hono()

chat.post('/', async (c) => {
  const body = await c.req.json()
  const { messages } = body

  const response = await chatWithZhipu(messages)
  return c.json({ content: response })
})

export default chat
