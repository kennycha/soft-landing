// 인기 Google Fonts 목록
export const POPULAR_GOOGLE_FONTS = [
  { name: 'Ubuntu', category: 'sans-serif', popular: false },
  { name: 'Inter', category: 'sans-serif', popular: true },
  { name: 'Roboto', category: 'sans-serif', popular: true },
  { name: 'Open Sans', category: 'sans-serif', popular: true },
  { name: 'Lato', category: 'sans-serif', popular: true },
  { name: 'Poppins', category: 'sans-serif', popular: true },
  { name: 'Montserrat', category: 'sans-serif', popular: true },
  { name: 'Source Sans Pro', category: 'sans-serif', popular: true },
  { name: 'Nunito', category: 'sans-serif', popular: true },
  { name: 'Raleway', category: 'sans-serif', popular: false },

  // Serif fonts
  { name: 'Playfair Display', category: 'serif', popular: true },
  { name: 'Merriweather', category: 'serif', popular: true },
  { name: 'Lora', category: 'serif', popular: false },
  { name: 'Crimson Text', category: 'serif', popular: false },
  { name: 'PT Serif', category: 'serif', popular: false },

  // Display fonts
  { name: 'Oswald', category: 'display', popular: false },
  { name: 'Dancing Script', category: 'handwriting', popular: false },
  { name: 'Pacifico', category: 'handwriting', popular: false },

  // Monospace
  { name: 'JetBrains Mono', category: 'monospace', popular: false },
  { name: 'Fira Code', category: 'monospace', popular: false },
] as const;

export type GoogleFont = (typeof POPULAR_GOOGLE_FONTS)[number];

export const DEFAULT_FONT = 'Inter';

/**
 * Google Fonts URL 생성
 */
export function getGoogleFontsUrl(fontFamily: string): string {
  const normalizedName = fontFamily.replace(/\s+/g, '+');

  // 일반적인 폰트 weight와 style 포함
  return `https://fonts.googleapis.com/css2?family=${normalizedName}:wght@300;400;500;600;700&display=swap`;
}

/**
 * 폰트 이름을 CSS font-family 형식으로 변환
 */
export function getFontFamilyCSS(fontFamily: string): string {
  const font = POPULAR_GOOGLE_FONTS.find((f) => f.name === fontFamily);

  if (!font) {
    // 기본 시스템 폰트 스택
    return `-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif`;
  }

  // Google Font + fallback
  const fallbacks = {
    'sans-serif': `'${font.name}', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif`,
    serif: `'${font.name}', Georgia, 'Times New Roman', serif`,
    monospace: `'${font.name}', 'Courier New', Consolas, Monaco, monospace`,
    display: `'${font.name}', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif`,
    handwriting: `'${font.name}', cursive`,
  };

  return fallbacks[font.category] || fallbacks['sans-serif'];
}

/**
 * 폰트가 Google Fonts에 있는지 확인
 */
export function isGoogleFont(fontFamily: string): boolean {
  return POPULAR_GOOGLE_FONTS.some((font) => font.name === fontFamily);
}

/**
 * 인기 폰트만 필터링
 */
export function getPopularFonts(): GoogleFont[] {
  return POPULAR_GOOGLE_FONTS.filter((font) => font.popular);
}

/**
 * 카테고리별 폰트 그룹핑
 */
export function getFontsByCategory() {
  return POPULAR_GOOGLE_FONTS.reduce(
    (acc, font) => {
      if (!acc[font.category]) {
        acc[font.category] = [];
      }
      acc[font.category].push(font);
      return acc;
    },
    {} as Record<string, GoogleFont[]>
  );
}
