# SPEC-1-soft-landing

## Background

`soft-landing`는 개발자가 간단한 TOML 구성 파일을 입력하면 즉시 랜딩 페이지를 생성해 주는 웹 기반 툴입니다. 이 프로젝트는 2025년 인기 있는 100개 이상의 개발 도구 랜딩 페이지를 분석한 결과를 바탕으로, 개발자 친화적인 UX와 최적의 디자인 패턴을 결합하여 다음과 같은 특징을 제공합니다:

- **구성 중심**: TOML 구조만 정의하면, Hero 섹션, 기능 리스트, CTA 버튼, 고객 로고, 푸터 등의 주요 영역을 자동 생성
- **실시간 미리보기**: 우측 상단의 TOML 에디터에서 구성 파일이 유효할 때만 변경사항을 좌측 화면에 즉시 반영
- **JSON 임포트**: 사용자가 JSON 파일을 업로드하면 TOML로 자동 변환되어 에디터에 로드 가능

## Requirements

아래는 초기 가정에 따른 요구사항 목록입니다. MoSCoW 방법론에 따라 정리했습니다. 수정 및 추가를 부탁드립니다:

- **Must have**
  - TOML 기반 구성 파싱 및 랜더링
  - **실시간 미리보기**: TOML 파일 유효성 검사 후에만 좌측 화면에 결과를 실시간 반영
  - 완성물 다운로드(HTML, JS, CSS, assets 포함 ZIP)
  - JSON 임포트 및 TOML 변환
- **Should have**
  - 테마(색상, 폰트) 커스터마이징
- **Could have**
  - 레이아웃 템플릿 선택 기능
  - 다국어 지원(번역 파일 로드)
- **Won't have**
  - 사용자 계정 및 저장 기능(1.0 버전 제외)

위 요구사항에 대해 추가, 삭제, 우선순위 변경 등이 있으면 알려주세요.

## Method

### 1. Hosting 환경

- **정적 호스팅**: GitHub Pages를 사용하여 `soft-landing` 웹 앱을 정적 사이트로 배포
- **백엔드 서비스 불필요**: 클라우드 파일 서버를 제공하지 않으며, 사용자는 다운로드한 결과물을 S3 등 별도 서비스에 업로드하여 배포

### 2. 프론트엔드 TOML 파싱 및 렌더링

- **클라이언트 사이드 파싱**: 브라우저에서 직접 TOML을 파싱하기 위해 JavaScript TOML 라이브러리(e.g. `@iarna/toml`) 사용
- **렌더링**: React + Shadcn/ui 컴포넌트로 Hero, Features, CTA, Footer 등을 동적으로 생성
- **실시간 미리보기**: 에디터에서 TOML이 유효할 때만 파싱 후 React 상태(state)를 업데이트하여 즉시 반영

### 3. JSON 임포트 워크플로우

- 사용자가 JSON 파일을 업로드하면, 클라이언트 사이드에서 JSON을 TOML로 변환 후 에디터에 로드

### 4. 차기 단계 1: 멀티페이지 지원 (유료 기능)

- **Multiple Pages**: 1페이지 랜딩페이지는 무료로 제공, 여러 페이지로 구성된 사이트는 유료 기능으로 제공
- **네비게이션**: 페이지 간 네비게이션 메뉴 및 라우팅 지원
- **페이지 구성**: About, Pricing, Blog 등 추가 페이지 템플릿 제공
- **결제 시스템**: 유료 기능 이용을 위한 간단한 결제 연동

### 5. 차기 단계 2: 파일 서버 구축 (옵션)

_독립적인 부가 프로젝트로 분리하여 개발_

- **파일 서버 구축**: 집에 있는 노트북에 오픈소스 Copyparty(https://github.com/9001/copyparty)를 설치하여, 빌드 결과물을 호스팅하는 로컬 파일 서버 운영

> 위 파일 서버 구축은 `soft-landing`의 핵심 기능과는 별도로 독립된 부가 프로젝트로 관리됩니다.

## Configuration Structure

### Theme Colors

TOML 구성 파일에는 최소한의 테마 색상 구성을 지원합니다:

```toml
[theme]
# 주요 브랜드 색상 (버튼, 링크, 강조 요소)
primary_color = "#3b82f6"    # 기본값: 파란색

# 보조 색상 (배경, 카드, 보조 요소)
secondary_color = "#64748b"  # 기본값: 회색

[site]
title = "My Landing Page"
description = "A beautiful landing page"

[hero]
# ... 나머지 구성
```

이 테마 색상들은 CSS 커스텀 속성으로 적용되어 전체 랜딩 페이지의 색상 체계를 일관성 있게 유지합니다.

## Implementation

1. **프로젝트 초기화**
   - Vite + React + TypeScript 템플릿 생성
   - Tailwind CSS 및 shadcn/ui 설치 및 설정

2. **TOML 에디터 통합**
   - Monaco Editor(Electron 버전 아닌 웹용) 혹은 CodeMirror 6 선택
   - TOML 문법 하이라이트 및 유효성 검사 기능 추가

3. **클라이언트 사이드 파싱 & 렌더링**
   - `@iarna/toml` 라이브러리로 TOML을 JavaScript 객체로 파싱
   - React Context/API로 파싱 결과를 전역 상태에 저장
   - shadcn/ui 컴포넌트(Hero, FeatureList, CTA, Footer 등) 구현 및 상태 바인딩

4. **실시간 미리보기 구현**
   - 에디터 입력(onChange) → TOML 유효성 검사 → 파싱 → 렌더링 트리거
   - 파싱 에러 발생 시 에디터 언더라인 및 오류 메시지 표시, 미리보기 유지

5. **JSON 임포트 기능**
   - File API로 JSON 파일 읽기
   - `json2toml` 등의 라이브러리로 변환 후 에디터에 로드

6. **다운로드 패키지 생성**
   - `html-webpack-plugin` 또는 커스텀 번들러 로직으로 최종 HTML, JS, CSS를 생성
   - assets 폴더(로고, 이미지) 포함
   - JSZip 라이브러리로 ZIP 파일로 묶어 다운로드 링크 생성

## Milestones

| Milestone           | Description                                   | Due Date   |
| ------------------- | --------------------------------------------- | ---------- |
| 프로젝트 셋업       | Vite+React 환경 구축, Tailwind/shadcn/ui 설정 | 2025-08-15 |
| 에디터 및 파싱 구현 | TOML 에디터 + 유효성 검사, 파싱 → 렌더링 연동 | 2025-08-25 |
| JSON 임포트 & 변환  | JSON 업로드 → TOML 변환 기능 완성             | 2025-09-01 |
| 다운로드 기능       | ZIP 생성 및 다운로드 흐름 구현                | 2025-09-10 |
| MVP 릴리스          | 핵심 기능 통합 테스트 및 GitHub Pages 배포    | 2025-09-15 |

## Gathering Results

- **기능 검증**: 사용자가 다양한 TOML 예시를 적용하여 의도한 랜딩 페이지가 생성되는지 확인
- **성능 측정**: 대용량 TOML(수백 라인) 파싱 및 렌더링 시 지연 시간 측정(<200ms 목표)
- **UI/UX 피드백**: 초기 사용자(개발자) 대상 사용성 테스트 실시 후 개선 목록 정리
