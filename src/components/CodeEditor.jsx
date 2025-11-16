import { useState, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import { Play, AlertCircle } from 'lucide-react';

// Map language names to Monaco editor language IDs
const getMonacoLanguage = (lang) => {
  if (!lang) return 'plaintext';

  const langLower = lang.toLowerCase();
  const languageMap = {
    'python': 'python',
    'javascript': 'javascript',
    'js': 'javascript',
    'typescript': 'typescript',
    'ts': 'typescript',
    'java': 'java',
    'cpp': 'cpp',
    'c++': 'cpp',
    'c': 'c',
    'go': 'go',
    'rust': 'rust',
    'ruby': 'ruby',
    'php': 'php',
    'swift': 'swift',
    'kotlin': 'kotlin',
    'csharp': 'csharp',
    'c#': 'csharp',
    'html': 'html',
    'css': 'css',
    'json': 'json',
    'xml': 'xml',
    'yaml': 'yaml',
    'markdown': 'markdown',
    'sql': 'sql',
    'shell': 'shell',
    'bash': 'shell',
    'plaintext': 'plaintext',
    'text': 'plaintext'
  };

  return languageMap[langLower] || 'plaintext';
};

function CodeEditor({ value, onChange, language, readOnly = false, onSubmit, isSubmitting = false }) {
  const [editorValue, setEditorValue] = useState(value || '');
  const [editorError, setEditorError] = useState(null);

  // Sync editor value with incoming value prop
  useEffect(() => {
    if (value !== undefined && value !== editorValue) {
      setEditorValue(value);
    }
  }, [value, editorValue]);

  const handleEditorChange = (newValue) => {
    setEditorValue(newValue);
    if (onChange) {
      onChange(newValue);
    }
  };

  const handleSubmit = () => {
    if (onSubmit) {
      onSubmit(editorValue);
    }
  };

  const handleEditorMount = (editor, monaco) => {
    try {
      // Editor mounted successfully
      setEditorError(null);
    } catch (error) {
      console.error('Editor mount error:', error);
      setEditorError('Failed to load code editor');
    }
  };

  const handleEditorError = (error) => {
    console.error('Editor error:', error);
    setEditorError('Code editor encountered an error');
  };

  const monacoLanguage = getMonacoLanguage(language);

  return (
    <div className="space-y-3 md:space-y-4">
      {editorError ? (
        <div className="border border-error/30 bg-error/10 rounded-xl p-6 flex items-center gap-3">
          <AlertCircle className="w-6 h-6 text-error flex-shrink-0" />
          <div>
            <p className="text-error font-medium">{editorError}</p>
            <p className="text-textSecondary text-sm mt-1">
              Please try refreshing the page or using a different browser.
            </p>
          </div>
        </div>
      ) : (
        <div className="border border-surfaceRaised rounded-xl overflow-hidden overflow-x-auto">
          <Editor
            height="400px"
            language={monacoLanguage}
            value={editorValue}
            onChange={handleEditorChange}
            onMount={handleEditorMount}
            theme="vs-dark"
            options={{
              readOnly,
              fontSize: 13,
              lineNumbers: 'on',
              minimap: { enabled: window.innerWidth > 768 },
              scrollBeyondLastLine: false,
              automaticLayout: true,
              tabSize: 2,
              wordWrap: 'on',
            }}
            loading={
              <div className="flex items-center justify-center h-full bg-surfaceRaised">
                <div className="text-textSecondary">Loading editor...</div>
              </div>
            }
          />
        </div>
      )}

      {!readOnly && onSubmit && (
        <button
          onClick={handleSubmit}
          disabled={!editorValue.trim() || isSubmitting}
          className="w-full py-2.5 md:py-3 bg-primary hover:bg-primaryHover disabled:bg-surfaceRaised disabled:text-textSecondary disabled:cursor-not-allowed text-white font-medium rounded-xl transition-all duration-200 flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-primary/30 text-sm md:text-base"
        >
          <Play className={`w-4 h-4 md:w-5 md:h-5 ${isSubmitting ? 'animate-spin' : ''}`} />
          {isSubmitting ? 'Submitting...' : 'Submit Code'}
        </button>
      )}
    </div>
  );
}

export default CodeEditor;
