/* eslint-disable @typescript-eslint/no-explicit-any */
import { createRoot } from 'react-dom/client';
import { PurePreview, type LandingPageConfig } from '../components/PurePreview';

// Mock the asset-related modules for viewer environment
import { useImageResolver, useAssetStore, mockAssetStore } from './mockAssets';

// Override the imports globally for viewer environment
(window as any).__VIEWER_ENVIRONMENT__ = true;
(window as any).__mockImageResolver = useImageResolver;
(window as any).__mockAssetStore = useAssetStore;
(window as any).__mockAssetStoreInstance = mockAssetStore;

// Extend window interface to include __CONFIG__
declare global {
  interface Window {
    __CONFIG__?: LandingPageConfig;
  }
}

// Get config from window object (injected during download)
const config = (window.__CONFIG__ ?? {}) as LandingPageConfig;

// Render the pure preview with the injected config
const container = document.getElementById('root');
if (container) {
  createRoot(container).render(<PurePreview config={config} />);
} else {
  console.error('Root element not found');
}
