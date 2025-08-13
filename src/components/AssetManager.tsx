import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from '@/components/ui/button';
import { useAssetStore, type AssetFile } from '@/lib/assetStore';
import { Upload, X, Image, FileText, Copy, Check } from 'lucide-react';

interface AssetManagerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AssetManager({ isOpen, onClose }: AssetManagerProps) {
  const { assets, isUploading, addAsset, removeAsset } = useAssetStore();
  const [copiedPath, setCopiedPath] = useState<string | null>(null);

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      for (const file of acceptedFiles) {
        try {
          await addAsset(file);
        } catch (error) {
          console.error('Failed to upload asset:', error);
          alert(
            `Failed to upload ${file.name}: ${
              error instanceof Error ? error.message : 'Unknown error'
            }`
          );
        }
      }
    },
    [addAsset]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.svg', '.webp'],
    },
    multiple: true,
  });

  const copyToClipboard = async (path: string) => {
    try {
      await navigator.clipboard.writeText(path);
      setCopiedPath(path);
      setTimeout(() => setCopiedPath(null), 2000);
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div className="grid max-h-[80vh] w-full max-w-4xl grid-rows-[auto_1fr_auto] overflow-hidden rounded-xl bg-white shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b p-3 md:p-6">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Asset Manager</h2>
            <p className="mt-1 text-sm text-gray-600">
              Upload images to use in your TOML configuration
            </p>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose} className="hover:bg-gray-100">
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Upload Area */}
        <div className="overflow-y-auto border-b p-3 md:p-6">
          <div
            {...getRootProps()}
            className={`rounded-xl border-2 border-dashed p-8 text-center transition-colors ${
              isDragActive ? 'border-primary bg-primary/5' : 'border-gray-300 hover:border-gray-400'
            }`}
          >
            <input {...getInputProps()} />
            <div className="flex flex-col items-center gap-2 md:gap-4">
              <div className="flex size-10 items-center justify-center rounded-full bg-gray-100 md:size-12">
                <Upload className="h-6 w-6 text-gray-600" />
              </div>
              <div>
                <p className="mb-2 text-base font-medium text-gray-900 md:text-lg">
                  {isDragActive ? 'Drop files here' : 'Upload images'}
                </p>
                <p className="text-sm text-gray-600">
                  Drag and drop images here, or click to browse
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Asset List */}
        <div className="h-[240px] overflow-y-auto p-3 md:p-6">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-medium text-gray-900">Uploaded Assets ({assets.length})</h3>
            {isUploading && <div className="text-primary text-sm">Uploading...</div>}
          </div>

          {assets.length === 0 ? (
            <div className="py-8 text-center text-gray-500">
              <Image className="mx-auto mb-4 h-12 w-12 opacity-40" />
              <p>No assets uploaded yet</p>
              <p className="mt-1 text-sm">Upload images to get started</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {assets.map((asset) => (
                <AssetCard
                  key={asset.id}
                  asset={asset}
                  onRemove={removeAsset}
                  onCopyPath={copyToClipboard}
                  isCopied={copiedPath === asset.path}
                />
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t bg-gray-50 px-3 py-2 md:px-6">
          <div className="flex items-center justify-between">
            <div className="text-xs text-gray-600 md:text-sm">
              Use the relative path in your TOML configuration:
              <code className="ml-2 rounded bg-gray-200 px-2 py-0.5 font-mono text-xs md:py-1 md:text-sm">
                image = "assets/filename.png"
              </code>
            </div>
            <Button onClick={onClose}>Done</Button>
          </div>
        </div>
      </div>
    </div>
  );
}

interface AssetCardProps {
  asset: AssetFile;
  onRemove: (id: string) => void;
  onCopyPath: (path: string) => void;
  isCopied: boolean;
}

function AssetCard({ asset, onRemove, onCopyPath, isCopied }: AssetCardProps) {
  const isImage = asset.type.startsWith('image/');

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="rounded-xl border bg-white p-4 transition-shadow hover:shadow-md">
      <div className="flex items-start gap-3">
        {/* Preview */}
        <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg bg-gray-100">
          {isImage ? (
            <img src={asset.dataUrl} alt={asset.name} className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <FileText className="h-6 w-6 text-gray-400" />
            </div>
          )}
        </div>

        {/* Info */}
        <div className="min-w-0 flex-1">
          <h4 className="truncate font-medium text-gray-900" title={asset.name}>
            {asset.name}
          </h4>
          <p className="mt-1 text-xs text-gray-500">
            {formatFileSize(asset.size)} • {asset.type}
          </p>
          <div className="mt-2 flex items-center gap-2">
            <code className="flex-1 truncate rounded bg-gray-100 px-2 py-1 font-mono text-xs text-gray-700">
              {asset.path}
            </code>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => onCopyPath(asset.path)}
              className="h-6 w-6 p-1"
              title="Copy path"
            >
              {isCopied ? (
                <Check className="h-3 w-3 text-green-600" />
              ) : (
                <Copy className="h-3 w-3" />
              )}
            </Button>
          </div>
        </div>

        {/* Actions */}
        <Button
          size="sm"
          variant="ghost"
          onClick={() => onRemove(asset.id)}
          className="h-6 w-6 p-1 text-red-500 hover:bg-red-50 hover:text-red-700"
          title="Remove asset"
        >
          <X className="h-3 w-3" />
        </Button>
      </div>
    </div>
  );
}
