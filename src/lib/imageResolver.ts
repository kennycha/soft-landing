import { useAssetStore } from './assetStore';

/**
 * Hook for resolving image paths in components
 *
 * Usage:
 * const resolveImagePath = useImageResolver();
 * const imageUrl = resolveImagePath(config.hero.image);
 */
export function useImageResolver() {
  const resolveImagePath = useAssetStore((state) => state.resolveImagePath);

  // Check if we're in viewer environment
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  if (typeof window !== 'undefined' && (window as any).__VIEWER_ENVIRONMENT__) {
    return (url: string) => url; // Simply return the URL as-is in viewer environment
  }

  return resolveImagePath;
}

/**
 * Utility function to get all image paths from TOML config
 * Used for validation and asset checking
 */
export function extractImagePaths(config: unknown): string[] {
  const paths: string[] = [];

  function traverse(obj: unknown) {
    if (typeof obj !== 'object' || obj === null) {
      return;
    }

    for (const [key, value] of Object.entries(obj)) {
      // Look for common image property names
      if (
        (key === 'image' ||
          key === 'imageUrl' ||
          key === 'avatarUrl' ||
          key === 'logoUrl' ||
          key === 'favicon' || // Added favicon
          key.endsWith('Image') ||
          key.endsWith('Url')) &&
        typeof value === 'string' &&
        value.trim()
      ) {
        paths.push(value.trim());
      } else if (Array.isArray(value)) {
        // Handle arrays (like logoUrls)
        for (const item of value) {
          if (typeof item === 'string' && item.trim()) {
            paths.push(item.trim());
          } else if (typeof item === 'object') {
            traverse(item);
          }
        }
      } else if (typeof value === 'object') {
        traverse(value);
      }
    }
  }

  traverse(config);
  return [...new Set(paths)]; // Remove duplicates
}
