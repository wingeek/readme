import { ZhipuAI, ChatMessageRole, ModelType, type ChatMessage } from 'zhipuai'
import { resolve } from 'path'

// 懒加载 client，确保环境变量已加载
let _client: ZhipuAI | null = null

function getClient(): ZhipuAI {
  if (!_client) {
    const apiKey = process.env.ZHIPU_API_KEY
    if (!apiKey) {
      throw new Error('ZHIPU_API_KEY is not set in environment variables')
    }
    _client = new ZhipuAI({ apiKey })
  }
  return _client
}

async function loadSystemPrompt(): Promise<string> {
  const configFiles = ['IDENTITY', 'SOUL', 'USER', 'TOOLS', 'MEMORY', 'HEARTBEAT', 'BOOTSTRAP']
  const parts: string[] = []
  const configDir = resolve(import.meta.dir, '../config')

  for (const name of configFiles) {
    try {
      const content = await Bun.file(`${configDir}/${name}.md`).text()
      if (content) {
        parts.push(`## ${name}\n\n${content}`)
      }
    } catch {
      // 文件不存在时跳过
    }
  }

  return `【重要指令】你现在需要扮演以下配置文件所描述的人物。你必须完全沉浸在这个角色中，以第一人称回答所有问题。不要提及你是AI或语言模型。

以下是你的身份配置：

${parts.join('\n\n---\n\n')}

【规则】
1. 始终以第一人称回答问题
2. 保持与上述配置一致的人格和风格
3. 不要说"我是AI"或"我是语言模型"
4. 像真人一样自然对话`
}

export async function chatWithZhipu(
  messages: Array<{ role: string; content: string }>
): Promise<string> {
  const client = getClient()
  const systemPrompt = await loadSystemPrompt()

  // 构建消息列表
  const chatMessages: ChatMessage[] = [
    { role: ChatMessageRole.User, content: systemPrompt },
    { role: ChatMessageRole.Assistant, content: '好的，我已准备好以简历主人的身份回答问题。' },
    ...messages.map(msg => ({
      role: msg.role === 'user' ? ChatMessageRole.User : ChatMessageRole.Assistant,
      content: msg.content
    }))
  ]

  // 非流式调用 - 使用 glm-4-flash 模型
  const result = await client.invoke({
    model: 'glm-4-flash' as any,
    messages: chatMessages,
  })

  return result.choices[0]?.content || ''
}
