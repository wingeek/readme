/**
 * Hook for loading config files
 */
import { useState, useEffect, useCallback } from 'react';
import { getFiles, getFileContent, FileInfo, FileContent } from '../lib/api';

export function useFiles() {
  const [files, setFiles] = useState<FileInfo[]>([]);
  const [activeFile, setActiveFile] = useState<string>('IDENTITY');
  const [fileContent, setFileContent] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load file list on mount
  useEffect(() => {
    getFiles()
      .then(setFiles)
      .catch(err => setError(err.message));
  }, []);

  // Load active file content
  const loadFile = useCallback(async (name: string) => {
    setLoading(true);
    setError(null);
    try {
      const data: FileContent = await getFileContent(name);
      setFileContent(data.content);
      setActiveFile(name);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load file');
    } finally {
      setLoading(false);
    }
  }, []);

  // Load initial file
  useEffect(() => {
    if (files.length > 0 && !activeFile) {
      loadFile(files[0].name);
    }
  }, [files, activeFile, loadFile]);

  return {
    files,
    activeFile,
    fileContent,
    loading,
    error,
    loadFile,
    setActiveFile,
  };
}
