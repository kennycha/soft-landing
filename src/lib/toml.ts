import * as TOML from '@iarna/toml';
import { getFontFamilyCSS, DEFAULT_FONT } from './googleFonts';

// Convert snake_case keys to camelCase recursively
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function convertSnakeToCamel(obj: any): any {
  if (Array.isArray(obj)) {
    return obj.map(convertSnakeToCamel);
  } else if (obj !== null && typeof obj === 'object') {
    return Object.keys(obj).reduce((result, key) => {
      const camelKey = key.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
      result[camelKey] = convertSnakeToCamel(obj[key]);
      return result;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    }, {} as any);
  }
  return obj;
}

export interface LandingPageConfig {
  metadata?: {
    title?: string;
    description?: string;
    favicon?: string;
  };
  theme?: {
    primaryColor?: string;
    secondaryColor?: string;
    backgroundGradient?: boolean;
    fontFamily?: string;
  };
  hero?: {
    title?: string;
    description?: string;
    mainButton?: {
      text: string;
      url: string;
    };
    subButton?: {
      text: string;
      url: string;
    };
    imageUrl?: string;
  };
  socialProof?: {
    title: string;
    logoUrls: string[];
  };
  howItWorks?: {
    title?: string;
    description?: string;
    steps?: {
      title: string;
      description: string;
    }[];
  };
  testimonials?: {
    items?: {
      quote: string;
      author: string;
      title: string;
      avatarUrl?: string;
    }[];
  };
  features?: {
    title?: string;
    subtitle?: string;
    items?: {
      title: string;
      imageUrl?: string;
    }[];
  };
  cta?: {
    title?: string;
    subtitle?: string;
    button?: {
      text: string;
      url: string;
    };
  };
  footer?: {
    logoUrl?: string;
    copyright?: string;
    text?: string;
    links?: {
      text: string;
      url: string;
    }[];
  };
}

export interface ParseResult {
  success: boolean;
  data?: LandingPageConfig;
  error?: string;
}

export function parseToml(tomlString: string): ParseResult {
  try {
    if (!tomlString.trim()) {
      return {
        success: false,
        error: 'TOML content is empty',
      };
    }

    const parsedData = TOML.parse(tomlString);
    const data = convertSnakeToCamel(parsedData) as LandingPageConfig;
    return {
      success: true,
      data,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to parse TOML',
    };
  }
}

export function getThemeColors(config?: LandingPageConfig) {
  return {
    primary: config?.theme?.primaryColor ?? '#3b82f6',
    secondary: config?.theme?.secondaryColor ?? '#64748b',
  };
}

export function getThemeStyles(config?: LandingPageConfig) {
  const fontFamily = config?.theme?.fontFamily ?? DEFAULT_FONT;

  return {
    colors: getThemeColors(config),
    fontFamily: getFontFamilyCSS(fontFamily),
    fontFamilyName: fontFamily,
  };
}
