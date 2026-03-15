/**
 * API Client for backend communication
 */

const API_BASE = '/api';

export interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export interface FileInfo {
  name: string;
  path: string;
}

export interface FileContent {
  name: string;
  content: string;
}

/**
 * Get list of available config files
 */
export async function getFiles(): Promise<FileInfo[]> {
  const res = await fetch(`${API_BASE}/files`);
  if (!res.ok) throw new Error('Failed to fetch files');
  return res.json();
}

/**
 * Get content of a specific file
 */
export async function getFileContent(name: string): Promise<FileContent> {
  const res = await fetch(`${API_BASE}/files/${name}`);
  if (!res.ok) throw new Error('Failed to fetch file content');
  return res.json();
}

/**
 * Send chat message and get response
 */
export async function sendChat(messages: Message[]): Promise<string> {
  const res = await fetch(`${API_BASE}/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ messages }),
  });

  if (!res.ok) throw new Error('Failed to send message');

  const data = await res.json();
  return data.content;
}
