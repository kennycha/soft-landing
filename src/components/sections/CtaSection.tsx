import { Button } from '@/components/ui/button';
import type { LandingPageConfig } from '@/lib/toml';

interface CtaSectionProps {
  config: NonNullable<LandingPageConfig['cta']>;
}

export function CtaSection({ config }: CtaSectionProps) {
  return (
    <section className="bg-neutral-50 px-6 py-12 lg:py-24">
      <div className="mx-auto max-w-4xl text-center">
        <div className="rounded-3xl bg-gray-900 px-8 py-16 md:px-16">
          {config.title && (
            <h2 className="mb-6 text-3xl leading-tight font-bold text-white lg:text-5xl">
              {config.title}
            </h2>
          )}

          {config.subtitle && (
            <p className="mx-auto mb-12 max-w-2xl text-lg text-gray-300 lg:text-xl">
              {config.subtitle}
            </p>
          )}

          {config.button && (
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <a href={config.button.url} target="_blank">
                <Button
                  size="lg"
                  className={`h-12 transform rounded-full bg-white px-8 text-base font-medium text-gray-900 shadow-lg transition-all duration-200 hover:scale-105 hover:bg-gray-100 hover:shadow-xl lg:h-14`}
                >
                  {config.button.text}
                </Button>
              </a>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
