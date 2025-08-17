import { create } from 'zustand';
import { loadAllPublicAssets } from './publicAssets';

export interface AssetFile {
  id: string;
  name: string;
  path: string; // 상대경로 (예: "assets/hero-image.png")
  file: File;
  dataUrl: string; // 미리보기용 base64 URL
  type: string; // MIME type
  size: number; // 파일 크기 (bytes)
  uploadedAt: Date;
}

interface AssetState {
  assets: AssetFile[];
  isUploading: boolean;
  isInitialized: boolean;

  // Actions
  addAsset: (file: File) => Promise<AssetFile>;
  removeAsset: (id: string) => void;
  getAssetByPath: (path: string) => AssetFile | undefined;
  getAllAssets: () => AssetFile[];
  clearAssets: () => void;
  setUploading: (isUploading: boolean) => void;
  initializePublicAssets: () => Promise<void>;

  // Path resolver
  resolveImagePath: (path: string) => string;
}

const generateAssetPath = (fileName: string, existingAssets: AssetFile[]): string => {
  // 안전한 파일명 생성
  const baseName = fileName.replace(/[^a-zA-Z0-9.-]/g, '-').toLowerCase();
  let safeName = baseName;
  let counter = 1;

  // 중복된 이름이 있는지 확인하고 숫자 접미사 추가
  while (existingAssets.some((asset) => asset.name === safeName)) {
    const nameWithoutExt = baseName.replace(/\.[^/.]+$/, '');
    const ext = baseName.match(/\.[^/.]+$/)?.[0] ?? '';
    safeName = `${nameWithoutExt}-${counter}${ext}`;
    counter += 1;
  }

  return `assets/${safeName}`;
};

const fileToDataUrl = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

export const useAssetStore = create<AssetState>((set, get) => ({
  assets: [],
  isUploading: false,
  isInitialized: false,

  addAsset: async (file: File): Promise<AssetFile> => {
    set({ isUploading: true });

    try {
      const currentAssets = get().assets;

      // 중복된 이름이 있는지 확인
      if (currentAssets.some((asset) => asset.name === file.name)) {
        set({ isUploading: false });
        throw new Error(
          `Asset with name "${file.name}" already exists. Please rename the file or remove the existing asset first.`
        );
      }

      const dataUrl = await fileToDataUrl(file);
      const assetFile: AssetFile = {
        id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        name: file.name,
        path: generateAssetPath(file.name, currentAssets),
        file,
        dataUrl,
        type: file.type,
        size: file.size,
        uploadedAt: new Date(),
      };

      set((state) => ({
        assets: [...state.assets, assetFile],
        isUploading: false,
      }));

      return assetFile;
    } catch (error) {
      set({ isUploading: false });
      throw error;
    }
  },

  removeAsset: (id: string) => {
    set((state) => ({
      assets: state.assets.filter((asset) => asset.id !== id),
    }));
  },

  getAssetByPath: (path: string): AssetFile | undefined => {
    return get().assets.find((asset) => asset.path === path);
  },

  getAllAssets: () => {
    return get().assets;
  },

  clearAssets: () => {
    set({ assets: [] });
  },

  setUploading: (isUploading: boolean) => {
    set({ isUploading });
  },

  initializePublicAssets: async () => {
    const state = get();
    if (state.isInitialized) return;

    try {
      const publicAssets = await loadAllPublicAssets();
      set((currentState) => ({
        assets: [...publicAssets, ...currentState.assets],
        isInitialized: true,
      }));
    } catch (error) {
      console.error('Failed to load public assets:', error);
      set({ isInitialized: true });
    }
  },

  resolveImagePath: (path: string): string => {
    // Check if we're in viewer environment - return path as-is
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if (typeof window !== 'undefined' && (window as any).__VIEWER_ENVIRONMENT__) {
      return path;
    }

    // TOML에서 상대경로로 지정된 이미지를 실제 URL로 변환
    if (!path) return '';

    // 이미 절대 URL인 경우 (http:// 또는 https://)
    if (path.startsWith('http://') || path.startsWith('https://')) {
      return path;
    }

    // 절대 경로인 경우 (public 폴더의 파일들)
    if (path.startsWith('/')) {
      return path;
    }

    // 상대경로인 경우 업로드된 에셋에서 찾기
    const asset = get().getAssetByPath(path);
    if (asset) {
      return asset.dataUrl;
    }

    return '';
  },
}));
