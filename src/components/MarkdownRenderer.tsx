/**
 * Markdown 渲染组件 - 使用 md4x
 */
import { useEffect, useState } from 'react'
import { init, renderToHtml } from 'md4x/wasm'

// 初始化状态
let initPromise: Promise<void> | null = null
let isInitialized = false

function ensureInit() {
  if (!initPromise && !isInitialized) {
    initPromise = init().then(() => {
      isInitialized = true
    })
  }
  return initPromise
}

interface MarkdownRendererProps {
  content: string
  className?: string
}

export function MarkdownRenderer({ content, className = '' }: MarkdownRendererProps) {
  const [html, setHtml] = useState('')
  const [ready, setReady] = useState(false)

  // 初始化 WASM
  useEffect(() => {
    ensureInit().then(() => setReady(true))
  }, [])

  // 渲染 Markdown
  useEffect(() => {
    if (ready && content) {
      try {
        const rendered = renderToHtml(content)
        setHtml(rendered)
      } catch (err) {
        console.error('Markdown render error:', err)
        setHtml(`<pre>${content}</pre>`)
      }
    }
  }, [content, ready])

  if (!ready) {
    return <div className={className}>Loading...</div>
  }

  return (
    <div
      className={`markdown-content prose prose-sm max-w-none ${className}`}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  )
}
