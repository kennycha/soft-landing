import type { LandingPageConfig } from '@/lib/toml';
import { useImageResolver } from '@/lib/imageResolver';
import { useAssetStore } from '@/lib/assetStore';
import { isUrlExternal } from '@/lib/utils';

interface FooterSectionProps {
  config: NonNullable<LandingPageConfig['footer']>;
}

export function FooterSection({ config }: FooterSectionProps) {
  const resolveImagePath = useImageResolver();
  // assets 변경을 구독하여 리렌더링 트리거
  useAssetStore((state) => state.assets);

  return (
    <footer className="bg-neutral-50 px-6 py-16">
      <div className="mx-auto max-w-4xl">
        <div className="flex flex-col space-y-8 md:flex-row md:items-start md:justify-between md:space-y-0">
          <div className="flex flex-col items-start gap-0 md:gap-8">
            {config.logoUrl &&
              (isUrlExternal(config.logoUrl) ? (
                <div className="mb-4">
                  <img src={config.logoUrl} alt="Logo" className="h-8" />
                </div>
              ) : (
                resolveImagePath(config.logoUrl) && (
                  <div className="mb-4">
                    <img src={resolveImagePath(config.logoUrl)} alt="Logo" className="h-8" />
                  </div>
                )
              ))}
            <div>
              {config.copyright && <p className="text-md text-gray-500">{config.copyright}</p>}
              {config.text && <p className="text-md mt-1 text-gray-500">{config.text}</p>}
            </div>
          </div>

          {config.links && config.links.length > 0 && (
            <div className="grid grid-cols-2 gap-x-12 gap-y-2 text-left">
              {config.links.map((link, index) => (
                <a
                  key={index}
                  href={link.url}
                  className="text-md text-gray-600 transition-colors hover:text-gray-900"
                >
                  {link.text}
                </a>
              ))}
            </div>
          )}
        </div>
      </div>
    </footer>
  );
}
