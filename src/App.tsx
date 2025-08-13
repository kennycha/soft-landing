import { useState, useEffect } from 'react';
import { LandingPreview } from '@/components/LandingPreview';
import { FloatingEditorButton } from '@/components/FloatingEditorButton';
import { INITIAL_TOML_CONTENT } from './lib/constants';
import { useAssetStore } from './lib/assetStore';

function App() {
  const [tomlContent, setTomlContent] = useState(INITIAL_TOML_CONTENT);
  const initializePublicAssets = useAssetStore((state) => state.initializePublicAssets);

  useEffect(() => {
    // Public assets 자동 로드
    initializePublicAssets();
  }, [initializePublicAssets]);

  return (
    <div className="bg-background min-h-screen">
      {/* Full-screen preview */}
      <LandingPreview tomlContent={tomlContent} />

      {/* Floating editor button */}
      <FloatingEditorButton tomlContent={tomlContent} onTomlChange={setTomlContent} />
    </div>
  );
}

export default App;
