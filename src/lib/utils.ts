import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function isUrlExternal(url: string) {
  return url.startsWith('http://') || url.startsWith('https://') || url.startsWith('www.');
}

// 색상의 밝기를 계산하여 텍스트 색상을 결정하는 함수
export function getContrastTextColor(hexColor: string): string {
  // hex에서 #을 제거
  const hex = hexColor.replace('#', '');

  // RGB 값으로 변환
  const r = parseInt(hex.slice(0, 2), 16);
  const g = parseInt(hex.slice(2, 4), 16);
  const b = parseInt(hex.slice(4, 6), 16);

  // 상대적 밝기 계산 (WCAG 표준)
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;

  // 밝기가 128보다 크면 어두운 회색, 작으면 흰색
  return brightness > 128 ? '#111827' : '#ffffff';
}
