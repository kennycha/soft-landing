import { Editor } from '@monaco-editor/react';
import { Card } from '@/components/ui/card';

interface TomlEditorProps {
  value: string;
  onChange: (value: string) => void;
}

export function TomlEditor({ value, onChange }: TomlEditorProps) {
  const handleEditorChange = (val: string | undefined) => {
    onChange(val || '');
  };

  return (
    <Card className="h-full overflow-hidden p-0">
      <Editor
        height="100%"
        defaultLanguage="toml"
        value={value}
        onChange={handleEditorChange}
        theme="vs-dark"
        options={{
          minimap: { enabled: false },
          fontSize: 14,
          lineNumbers: 'on',
          automaticLayout: true,
          scrollBeyondLastLine: false,
          wordWrap: 'on',
          wrappingIndent: 'indent',
        }}
      />
    </Card>
  );
}
