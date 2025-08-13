import { useMemo, useEffect, useRef } from 'react';
import { parseToml, getThemeStyles, type LandingPageConfig } from '@/lib/toml';
import { getGoogleFontsUrl, isGoogleFont } from '@/lib/googleFonts';
import { HeroSection } from '@/components/sections/HeroSection';
import { SocialProofSection } from '@/components/sections/SocialProofSection';
import { HowItWorksSection } from '@/components/sections/HowItWorksSection';
import { FeaturesSection } from '@/components/sections/FeaturesSection';
import { TestimonialSection } from '@/components/sections/TestimonialSection';
import { CtaSection } from '@/components/sections/CtaSection';
import { FooterSection } from '@/components/sections/FooterSection';

export type { LandingPageConfig } from '@/lib/toml';

interface PurePreviewProps {
  config: LandingPageConfig;
}

export function PurePreview({ config }: PurePreviewProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (config && containerRef.current) {
      const themeStyles = getThemeStyles(config);

      // Apply theme colors and font to CSS custom properties
      const container = containerRef.current;
      container.style.setProperty('--primary-color', themeStyles.colors.primary);
      container.style.setProperty('--secondary-color', themeStyles.colors.secondary);
      container.style.setProperty('font-family', themeStyles.fontFamily);

      // Convert hex to RGB for alpha variants
      const hexToRgb = (hex: string) => {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result
          ? {
              r: parseInt(result[1], 16),
              g: parseInt(result[2], 16),
              b: parseInt(result[3], 16),
            }
          : null;
      };

      const primaryRgb = hexToRgb(themeStyles.colors.primary);
      const secondaryRgb = hexToRgb(themeStyles.colors.secondary);

      if (primaryRgb) {
        container.style.setProperty(
          '--primary-rgb',
          `${primaryRgb.r}, ${primaryRgb.g}, ${primaryRgb.b}`
        );
      }
      if (secondaryRgb) {
        container.style.setProperty(
          '--secondary-rgb',
          `${secondaryRgb.r}, ${secondaryRgb.g}, ${secondaryRgb.b}`
        );
      }

      // Google Fonts 동적 로딩
      if (config.theme?.fontFamily && isGoogleFont(config.theme.fontFamily)) {
        const fontUrl = getGoogleFontsUrl(config.theme.fontFamily);

        // 기존 폰트 링크 제거
        const existingLinks = document.head.querySelectorAll('link[data-google-font]');
        existingLinks.forEach((link) => link.remove());

        // 새 폰트 링크 추가
        const linkElement = document.createElement('link');
        linkElement.rel = 'stylesheet';
        linkElement.href = fontUrl;
        linkElement.setAttribute('data-google-font', 'true');
        document.head.appendChild(linkElement);
      }
    }
  }, [config]);

  const hasGradientBackground = config.theme?.backgroundGradient;
  const themeStyles = getThemeStyles(config);

  const gradientStyle = hasGradientBackground
    ? {
        background: `linear-gradient(135deg, 
          white,
          ${themeStyles.colors.primary}40, 
          ${themeStyles.colors.secondary}40, 
          ${themeStyles.colors.primary}40,
          white)`,
      }
    : {};

  return (
    <div
      ref={containerRef}
      className={`min-h-screen ${hasGradientBackground ? '' : 'bg-white'}`}
      style={gradientStyle}
    >
      {config.hero && <HeroSection config={config.hero} />}
      {config.socialProof && <SocialProofSection config={config.socialProof} />}
      {config.features && <FeaturesSection config={config.features} />}
      {config.testimonials && <TestimonialSection config={config.testimonials} />}
      {config.howItWorks && <HowItWorksSection config={config.howItWorks} />}
      {config.cta && <CtaSection config={config.cta} />}
      {config.footer && <FooterSection config={config.footer} />}
    </div>
  );
}

// Alternative interface for when using TOML string instead of parsed config
interface PurePreviewWithTomlProps {
  tomlContent: string;
}

export function PurePreviewWithToml({ tomlContent }: PurePreviewWithTomlProps) {
  const parseResult = useMemo(() => parseToml(tomlContent), [tomlContent]);

  if (!parseResult.success) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <div className="text-destructive p-6 text-center">
          <h3 className="mb-2 text-lg font-semibold">TOML Parse Error</h3>
          <p className="text-sm">{parseResult.error}</p>
        </div>
      </div>
    );
  }

  return <PurePreview config={parseResult.data!} />;
}