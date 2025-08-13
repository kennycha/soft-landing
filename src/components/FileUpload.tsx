import { useRef, type ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { Upload } from 'lucide-react';
import json2toml from 'json2toml';

interface FileUploadProps {
  onFileLoaded: (content: string) => void;
  children?: ReactNode;
}

export function FileUpload({ onFileLoaded, children }: FileUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const text = await file.text();

    try {
      if (file.name.endsWith('.json')) {
        const jsonData = JSON.parse(text);
        const tomlContent = json2toml(jsonData);
        onFileLoaded(tomlContent);
      } else if (file.name.endsWith('.toml')) {
        onFileLoaded(text);
      } else {
        alert('Please upload a .toml or .json file');
      }
    } catch (error) {
      alert('Failed to parse file: ' + (error instanceof Error ? error.message : 'Unknown error'));
    }

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <>
      {children ? (
        <div onClick={handleFileClick}>{children}</div>
      ) : (
        <Button
          variant="outline"
          size="sm"
          onClick={handleFileClick}
          className="flex items-center gap-2"
        >
          <Upload className="h-4 w-4" />
          Import File
        </Button>
      )}
      <input
        ref={fileInputRef}
        type="file"
        accept=".toml,.json"
        onChange={handleFileChange}
        style={{ display: 'none' }}
      />
    </>
  );
}
