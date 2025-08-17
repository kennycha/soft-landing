import { useRef, type ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { Upload } from 'lucide-react';

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

    if (!file.name.endsWith('.toml')) {
      alert('Please upload a .toml file');
      return;
    }

    try {
      const text = await file.text();
      onFileLoaded(text);
    } catch (error) {
      alert('Failed to read file: ' + (error instanceof Error ? error.message : 'Unknown error'));
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
        accept=".toml"
        onChange={handleFileChange}
        style={{ display: 'none' }}
      />
    </>
  );
}
