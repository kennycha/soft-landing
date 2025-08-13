import { Button } from '@/components/ui/button';
import type { LandingPageConfig } from '@/lib/toml';
import { useImageResolver } from '@/lib/imageResolver';
import { useAssetStore } from '@/lib/assetStore';
import { isUrlExternal } from '@/lib/utils';

interface HeroSectionProps {
  config: NonNullable<LandingPageConfig['hero']>;
}

export function HeroSection({ config }: HeroSectionProps) {
  const resolveImagePath = useImageResolver();
  // assets 변경을 구독하여 리렌더링 트리거
  useAssetStore((state) => state.assets);

  return (
    <section className="via-primary/5 to-secondary/10 relative flex flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-white px-6 pt-28 pb-12 text-center md:pt-40 lg:pb-26">
      <div className="relative mx-auto max-w-4xl">
        <h1 className="mb-4 text-4xl leading-tight font-bold text-gray-900 md:text-5xl lg:mb-6 lg:text-6xl">
          {config.title}
        </h1>

        {config.description && (
          <p className="mx-auto mb-4 max-w-2xl text-lg leading-relaxed text-gray-600 lg:mb-8 lg:text-2xl">
            {config.description}
          </p>
        )}

        {(config.mainButton || config.subButton) && (
          <div className="mb-12 flex flex-col justify-center gap-4 md:flex-row lg:mb-16">
            {config.mainButton && (
              <a target="_blank" href={config.mainButton.url}>
                <Button
                  size="lg"
                  className={`h-12 transform rounded-full border-0 bg-gray-800 px-8 py-3 text-base text-white shadow-lg transition-all duration-200 hover:scale-105 hover:shadow-xl lg:h-14`}
                >
                  {config.mainButton.text}
                </Button>
              </a>
            )}
            {config.subButton && (
              <a target="_blank" href={config.subButton.url}>
                <Button
                  size="lg"
                  className={`h-12 transform rounded-full border-0 bg-white px-8 py-3 text-base text-gray-800 shadow-lg transition-all duration-200 hover:scale-105 hover:shadow-xl lg:h-14`}
                >
                  {config.subButton.text}
                </Button>
              </a>
            )}
          </div>
        )}

        {config.imageUrl &&
          (isUrlExternal(config.imageUrl) ? (
            <div className="mt-8 lg:mt-12">
              <img
                src={config.imageUrl}
                alt={config.title ?? 'Hero image'}
                className="mx-auto h-auto max-w-full rounded-2xl shadow-xl"
              />
            </div>
          ) : (
            resolveImagePath(config.imageUrl) && (
              <div className="mt-8 lg:mt-12">
                <img
                  src={resolveImagePath(config.imageUrl)}
                  alt={config.title ?? 'Hero image'}
                  className="mx-auto h-auto max-w-full rounded-2xl shadow-xl"
                />
              </div>
            )
          ))}
      </div>
    </section>
  );
}
