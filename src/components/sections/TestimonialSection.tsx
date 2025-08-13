import { useState } from 'react';
import type { LandingPageConfig } from '@/lib/toml';
import { useImageResolver } from '@/lib/imageResolver';
import { cn, isUrlExternal } from '@/lib/utils';
import { useAssetStore } from '@/lib/assetStore';

interface TestimonialSectionProps {
  config: NonNullable<LandingPageConfig['testimonials']>;
}

export function TestimonialSection({ config }: TestimonialSectionProps) {
  const resolveImagePath = useImageResolver();
  // assets 변경을 구독하여 리렌더링 트리거
  useAssetStore((state) => state.assets);

  const [currentIndex, setCurrentIndex] = useState(0);

  if (!config.items || config.items.length === 0) {
    return null;
  }

  const totalItems = config.items.length;

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % totalItems);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + totalItems) % totalItems);
  };

  const currentItem = config.items[currentIndex];

  if (!currentItem) {
    return null;
  }

  return (
    <section className="px-6 py-12 lg:py-20">
      <div className="mx-auto max-w-6xl">
        <div className="relative">
          {/* Single Testimonial Display */}
          <div className="mx-auto max-w-4xl">
            <div className="rounded-2xl border border-white/20 bg-white/60 p-12 text-center shadow-lg backdrop-blur-sm">
              <blockquote className="mb-4 text-xl leading-relaxed font-medium text-gray-800 italic md:mb-8 md:text-2xl">
                "{currentItem.quote}"
              </blockquote>

              <div className="flex items-center justify-center gap-4">
                {currentItem.avatarUrl &&
                  (isUrlExternal(currentItem.avatarUrl) ? (
                    <img
                      src={currentItem.avatarUrl}
                      alt={currentItem.author}
                      className="size-10 rounded-full object-cover md:size-12"
                    />
                  ) : resolveImagePath(currentItem.avatarUrl) ? (
                    <img
                      src={resolveImagePath(currentItem.avatarUrl)}
                      alt={currentItem.author}
                      className="size-10 rounded-full object-cover md:size-12"
                    />
                  ) : (
                    <div className="text-md flex size-10 items-center justify-center rounded-full bg-gradient-to-br from-green-400 to-blue-500 font-semibold text-white md:size-12 md:text-lg">
                      {currentItem.author.charAt(0)}
                    </div>
                  ))}

                <div className="flex flex-col items-start">
                  <p className="text-md font-semibold text-gray-900 md:text-lg">
                    {currentItem.author}
                  </p>
                  <p className="md:text-md text-sm text-gray-600">{currentItem.title}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Buttons - Only show if more than 1 testimonial */}
          {totalItems > 1 && (
            <>
              {/* Previous Button */}
              <button
                onClick={prevSlide}
                className="absolute top-1/2 left-0 -translate-y-1/2 rounded-full border border-gray-200 bg-white/80 p-3 shadow-lg transition-all duration-200 hover:bg-white hover:shadow-xl"
                aria-label="Previous testimonial"
              >
                <svg
                  className="h-6 w-6 text-gray-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>

              {/* Next Button */}
              <button
                onClick={nextSlide}
                className="absolute top-1/2 right-0 -translate-y-1/2 rounded-full border border-gray-200 bg-white/80 p-3 shadow-lg transition-all duration-200 hover:bg-white hover:shadow-xl"
                aria-label="Next testimonial"
              >
                <svg
                  className="h-6 w-6 text-gray-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>

              {/* Page Indicators */}
              <div className="mt-8 flex justify-center gap-2">
                {Array.from({ length: totalItems }, (_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentIndex(index)}
                    className={cn(
                      'h-3 w-3 rounded-full transition-all duration-200',
                      currentIndex === index ? 'bg-green-600' : 'bg-gray-300 hover:bg-gray-400'
                    )}
                    aria-label={`Go to testimonial ${index + 1}`}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
