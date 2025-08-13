import type { LandingPageConfig } from '@/lib/toml';
import { useImageResolver } from '@/lib/imageResolver';
import { useAssetStore } from '@/lib/assetStore';
import { isUrlExternal } from '@/lib/utils';

interface SocialProofSectionProps {
  config: NonNullable<LandingPageConfig['socialProof']>;
}

export function SocialProofSection({ config }: SocialProofSectionProps) {
  const resolveImagePath = useImageResolver();
  // assets 변경을 구독하여 리렌더링 트리거
  useAssetStore((state) => state.assets);

  return (
    <section className="overflow-hidden bg-white py-8 lg:py-16">
      <div className="mx-auto max-w-3xl text-center">
        <p className="text-md mb-6 px-6 font-medium text-gray-500 md:mb-12">{config.title}</p>

        <div className="relative">
          {/* 첫 번째 줄 - 왼쪽으로 흐름 */}
          <div className="relative overflow-hidden">
            <div className="animate-marquee flex items-center gap-8">
              {/* 첫 번째 세트 */}
              {config.logoUrls.map((logoUrl, index) => {
                // External URL 처리: https://, http://, www.로 시작하면 그대로 사용
                const isExternalUrl = isUrlExternal(logoUrl);
                const imagePath = isExternalUrl ? logoUrl : resolveImagePath(logoUrl);

                return imagePath ? (
                  <img
                    key={`first-set-${index}`}
                    src={imagePath}
                    alt={`Logo ${index + 1}`}
                    width={240}
                    height={120}
                    className="w-40 flex-shrink-0 opacity-60 grayscale transition-opacity hover:opacity-80 hover:grayscale-0 md:w-48"
                  />
                ) : (
                  <div
                    key={`first-set-${index}`}
                    className="flex-shrink-0 text-xl font-bold whitespace-nowrap text-gray-400 transition-colors hover:text-gray-600 md:text-2xl"
                  >
                    Logo {index + 1}
                  </div>
                );
              })}
              {/* 두 번째 세트 (연속성을 위한 복사) */}
              {config.logoUrls.map((logoUrl, index) => {
                // External URL 처리: https://, http://, www.로 시작하면 그대로 사용
                const isExternalUrl =
                  logoUrl.startsWith('https://') ||
                  logoUrl.startsWith('http://') ||
                  logoUrl.startsWith('www.');
                const imagePath = isExternalUrl ? logoUrl : resolveImagePath(logoUrl);

                return imagePath ? (
                  <img
                    key={`first-copy-${index}`}
                    src={imagePath}
                    alt={`Logo ${index + 1}`}
                    width={240}
                    height={120}
                    className="w-40 flex-shrink-0 opacity-60 grayscale transition-opacity hover:opacity-80 hover:grayscale-0 md:w-48"
                  />
                ) : (
                  <div
                    key={`first-copy-${index}`}
                    className="flex-shrink-0 text-xl font-bold whitespace-nowrap text-gray-400 transition-colors hover:text-gray-600 md:text-2xl"
                  >
                    Logo {index + 1}
                  </div>
                );
              })}
            </div>
            {/* Left fade overlay */}
            <div className="pointer-events-none absolute top-0 left-0 z-10 h-full w-20 bg-gradient-to-r from-white via-white/80 to-transparent"></div>
            {/* Right fade overlay */}
            <div className="pointer-events-none absolute top-0 right-0 z-10 h-full w-20 bg-gradient-to-l from-white via-white/80 to-transparent"></div>
          </div>

          {/* 두 번째 줄 - 오른쪽으로 흐름 */}
          <div className="relative mt-4 overflow-hidden md:mt-8">
            <div className="animate-marquee-reverse flex items-center gap-8">
              {/* 첫 번째 세트 */}
              {config.logoUrls.map((logoUrl, index) => {
                // External URL 처리: https://, http://, www.로 시작하면 그대로 사용
                const isExternalUrl =
                  logoUrl.startsWith('https://') ||
                  logoUrl.startsWith('http://') ||
                  logoUrl.startsWith('www.');
                const imagePath = isExternalUrl ? logoUrl : resolveImagePath(logoUrl);

                return imagePath ? (
                  <img
                    key={`second-set-${index}`}
                    src={imagePath}
                    alt={`Logo ${index + 1}`}
                    width={240}
                    height={120}
                    className="w-40 flex-shrink-0 opacity-60 grayscale transition-opacity hover:opacity-80 hover:grayscale-0 md:w-48"
                  />
                ) : (
                  <div
                    key={`second-set-${index}`}
                    className="flex-shrink-0 text-xl font-bold whitespace-nowrap text-gray-400 transition-colors hover:text-gray-600 md:text-2xl"
                  >
                    Logo {index + 1}
                  </div>
                );
              })}
              {/* 두 번째 세트 (연속성을 위한 복사) */}
              {config.logoUrls.map((logoUrl, index) => {
                const imagePath = resolveImagePath(logoUrl);
                return imagePath ? (
                  <img
                    key={`second-copy-${index}`}
                    src={imagePath}
                    alt={`Logo ${index + 1}`}
                    width={240}
                    height={120}
                    className="w-40 flex-shrink-0 opacity-60 grayscale transition-opacity hover:opacity-80 hover:grayscale-0 md:w-48"
                  />
                ) : (
                  <div
                    key={`second-copy-${index}`}
                    className="flex-shrink-0 text-xl font-bold whitespace-nowrap text-gray-400 transition-colors hover:text-gray-600 md:text-2xl"
                  >
                    Logo {index + 1}
                  </div>
                );
              })}
            </div>
            {/* Left fade overlay */}
            <div className="pointer-events-none absolute top-0 left-0 z-10 h-full w-20 translate-x-[-5px] bg-gradient-to-r from-white via-white/80 to-transparent"></div>
            {/* Right fade overlay */}
            <div className="pointer-events-none absolute top-0 right-0 z-10 h-full w-20 translate-x-[5px] bg-gradient-to-l from-white via-white/80 to-transparent"></div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes marquee {
          0% {
            transform: translateX(0%);
          }
          100% {
            transform: translateX(-50%);
          }
        }

        @keyframes marquee-reverse {
          0% {
            transform: translateX(-50%);
          }
          100% {
            transform: translateX(0%);
          }
        }

        .animate-marquee {
          animation: marquee 30s linear infinite;
        }

        .animate-marquee-reverse {
          animation: marquee-reverse 30s linear infinite;
        }
      `}</style>
    </section>
  );
}
