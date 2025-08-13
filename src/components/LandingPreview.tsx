import { PurePreviewWithToml } from '@/components/PurePreview';

interface LandingPreviewProps {
  tomlContent: string;
}

export function LandingPreview({ tomlContent }: LandingPreviewProps) {
  return <PurePreviewWithToml tomlContent={tomlContent} />;
}
