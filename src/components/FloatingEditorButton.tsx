import { useEffect, useState } from 'react';
import { Edit, Download, Upload, Image } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { TomlEditor } from '@/components/TomlEditor';
import { FileUpload } from '@/components/FileUpload';
import { AssetManager } from '@/components/AssetManager';
import { parseToml } from '@/lib/toml';
import { downloadLandingPage } from '@/lib/downloadUtils';

interface FloatingEditorButtonProps {
  tomlContent: string;
  onTomlChange: (content: string) => void;
}

export function FloatingEditorButton({ tomlContent, onTomlChange }: FloatingEditorButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isAssetManagerOpen, setIsAssetManagerOpen] = useState(false);

  const handleDownload = async () => {
    const parseResult = parseToml(tomlContent);
    if (!parseResult.success || !parseResult.data) {
      alert('Please fix TOML errors before downloading');
      return;
    }

    try {
      await downloadLandingPage(parseResult.data);
    } catch (error) {
      console.error('Download failed:', error);
      
      // Show user-friendly error message
      const message = error instanceof Error ? error.message : 'Unknown error occurred';
      
      if (message.includes('Manifest not found')) {
        alert('Download requires a production build. Please run "pnpm build" first, then try again.');
      } else if (message.includes('Viewer entry not found')) {
        alert('Viewer configuration not found. Please check your build setup.');
      } else {
        alert(`Download failed: ${message}`);
      }
    }
  };

  useEffect(() => {
    if (isAssetManagerOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  }, [isAssetManagerOpen]);

  return (
    <div className="fixed right-6 bottom-6 z-50">
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button size="lg" className="h-12 w-12 rounded-full bg-gray-800 shadow-lg">
            <Edit className="h-6 w-6 text-white" />
          </Button>
        </PopoverTrigger>
        <PopoverContent
          side="top"
          className="h-[calc(100dvh-8rem)] w-[calc(100vw-2rem)] overflow-hidden rounded-xl bg-white p-0 md:h-[600px] md:w-[600px]"
          align="end"
        >
          <div className="flex h-full flex-col">
            <div className="border-b p-4">
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <h3 className="text-lg font-semibold">TOML Editor</h3>
                <div className="flex flex-wrap items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setIsAssetManagerOpen(true);
                      setIsOpen(false);
                    }}
                  >
                    <Image className="mr-2 h-4 w-4" />
                    Assets
                  </Button>
                  <FileUpload onFileLoaded={onTomlChange}>
                    <Button variant="outline" size="sm">
                      <Upload className="mr-2 h-4 w-4" />
                      Import
                    </Button>
                  </FileUpload>
                  <Button onClick={handleDownload} size="sm">
                    <Download className="mr-2 h-4 w-4" />
                    Download
                  </Button>
                </div>
              </div>
            </div>
            <div className="flex-1 p-4">
              <TomlEditor value={tomlContent} onChange={onTomlChange} />
            </div>
          </div>
        </PopoverContent>
      </Popover>

      {/* Asset Manager Modal */}
      <AssetManager
        isOpen={isAssetManagerOpen}
        onClose={() => {
          setIsAssetManagerOpen(false);
          setIsOpen(true);
        }}
      />
    </div>
  );
}
