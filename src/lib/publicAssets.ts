// Public assets configuration
// 이 파일에서 public/assets 폴더의 파일들을 정의합니다.
export const PUBLIC_ASSETS = [
  {
    name: 'favicon.ico',
    path: 'assets/favicon.ico',
    publicPath: '/soft-landing/assets/favicon.ico',
    description: 'Favicon for the landing page',
    category: 'favicon',
  },
  {
    name: 'hero_image.png',
    path: 'assets/hero_image.png',
    publicPath: '/soft-landing/assets/hero_image.png',
    description: 'Hero section demonstration image showing TOML editor and preview',
    category: 'hero',
  },
  {
    name: 'logo.png',
    path: 'assets/logo.png',
    publicPath: '/soft-landing/assets/logo.png',
    description: 'Logo for the landing page',
    category: 'logo',
  },
  {
    name: 'logo_full.png',
    path: 'assets/logo_full.png',
    publicPath: '/soft-landing/assets/logo_full.png',
    description: 'Logo with text for the landing page',
    category: 'logo',
  },
  {
    name: 'feature_item_1_image.png',
    path: 'assets/feature_item_1_image.png',
    publicPath: '/soft-landing/assets/feature_item_1_image.png',
    description: 'Easy configuration',
    category: 'features',
  },
  {
    name: 'feature_item_2_image.png',
    path: 'assets/feature_item_2_image.png',
    publicPath: '/soft-landing/assets/feature_item_2_image.png',
    description: 'Live preview',
    category: 'features',
  },
  {
    name: 'feature_item_3_image.png',
    path: 'assets/feature_item_3_image.png',
    publicPath: '/soft-landing/assets/feature_item_3_image.png',
    description: 'Export bundle',
    category: 'features',
  },
  {
    name: 'feature_item_4_image.png',
    path: 'assets/feature_item_4_image.png',
    publicPath: '/soft-landing/assets/feature_item_4_image.png',
    description: 'Theme customization',
    category: 'features',
  },
  {
    name: 'avatar.png',
    path: 'assets/avatar.png',
    publicPath: '/soft-landing/assets/avatar.png',
    description: 'Avatar',
    category: 'testimonials',
  },
] as const;

export type PublicAsset = (typeof PUBLIC_ASSETS)[number];

/**
 * Public 파일을 AssetFile 형태로 변환
 */
export async function createAssetFromPublicFile(
  publicAsset: PublicAsset
): Promise<import('./assetStore').AssetFile | null> {
  try {
    console.log(`Attempting to load public asset: ${publicAsset.publicPath}`);
    // Public 파일을 fetch로 가져오기
    const response = await fetch(publicAsset.publicPath);
    if (!response.ok) {
      console.warn(
        `Failed to load public asset: ${publicAsset.publicPath}`,
        response.status,
        response.statusText
      );
      return null;
    }

    const blob = await response.blob();

    // Blob을 File 객체로 변환
    const file = new File([blob], publicAsset.name, { type: blob.type });

    // DataURL 생성
    const dataUrl = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });

    // AssetFile 형태로 반환
    return {
      id: `public-${publicAsset.name}`,
      name: publicAsset.name,
      path: publicAsset.path,
      file,
      dataUrl,
      type: blob.type,
      size: blob.size,
      uploadedAt: new Date(),
    };
  } catch (error) {
    console.error(`Error loading public asset ${publicAsset.name}:`, error);
    return null;
  }
}

/**
 * 모든 public assets을 로드
 */
export async function loadAllPublicAssets(): Promise<import('./assetStore').AssetFile[]> {
  const promises = PUBLIC_ASSETS.map(createAssetFromPublicFile);
  const results = await Promise.all(promises);

  // null 값 필터링
  return results.filter((asset): asset is import('./assetStore').AssetFile => asset !== null);
}
