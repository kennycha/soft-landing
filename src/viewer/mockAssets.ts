// Mock implementations for viewer environment
export function useImageResolver() {
  return (url: string) => url; // Simply return the URL as-is in viewer environment
}

export function useAssetStore() {
  return []; // Return empty array for assets subscription
}

export const mockAssetStore = {
  getState: () => ({ assets: [] }),
  subscribe: () => () => {}, // No-op unsubscribe function
};