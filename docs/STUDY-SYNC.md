# 노션 → 공부기록 동기화 워크플로우 (Claude 작업 매뉴얼)

> 사용자가 노션에 공부기록을 쓰면, Claude가 이 문서의 절차대로 블로그 글로 변환한다.
> 사용법: 사용자가 "이 페이지 블로그에 올려줘" + 노션 URL(또는 페이지 이름)을 주면 시작.

## 1. 노션에서 읽기
- `notion-fetch`로 페이지 전체를 가져온다. (URL이 없으면 `notion-search`로 제목 검색)
- 페이지가 하위 페이지들을 갖고 있으면(예: 주차 → 실습①②③) 각 하위 페이지를 **개별 포스트**로 만든다.

## 2. 분류 결정 (frontmatter `category`)
- **인공지능** — ML/DL 강의·논문 리뷰, LG Aimers 계열
- **알고리즘** — 자료구조·알고리즘 문제·이론
- **기타** — 바이브코딩 실습, VBA, 도구 사용법 등
- 새 분류가 필요하면 그냥 새 이름을 쓴다 (자동으로 목록에 생김). 단, 색을 지정하고 싶으면 `src/config/study.ts`의 `KNOWN`에 추가.

## 3. 시리즈 판단
- 노션에서 상위 페이지가 시리즈(강의 제목, "실무프로젝트 1" 등)면:
  - `series`: 시리즈 이름 (예: "Tabular ML: Classical → Foundation Models")
  - `seriesOrder`: #번호 또는 주차·실습 번호
- 단발 글이면 둘 다 생략.

## 4. 파일 생성
- 위치: `src/content/study/<슬러그>.md` — 슬러그는 영문 케밥케이스 (예: `vibe-coding-todo-app`)
- frontmatter 템플릿:
```yaml
---
title: "제목"
date: "YYYY.MM.DD"        # 반드시 따옴표!
category: "인공지능"
series: "시리즈명"          # 없으면 생략
seriesOrder: 4             # 없으면 생략
tags: ["태그1", "태그2"]
summary: "한 줄 요약 (목록·SEO에 씀)"
notionUrl: "https://app.notion.com/p/..."   # 원본 추적용
---
```

## 5. 본문 변환 규칙
- 노션 헤딩 → `##`/`###` 유지. "⇒ 한줄요약" 스타일은 그대로 살린다 (사용자 글 특유의 리듬).
- 노션 `<table>` → 마크다운 표.
- 코드 블록 → ```언어 펜스 유지 (Shiki가 하이라이팅, 프레임은 CSS가 자동).
- 콜아웃(> 💡) → 인용문으로.
- 6단계 템플릿 글(실습)은 구조 그대로: 프롬프트/결과/코드흐름/함수역할/변형포인트⭐/회고.

## 6. 이미지(짤·스크린샷) 처리 — 중요
노션 이미지 URL은 **1시간짜리 임시 링크**라 그대로 쓰면 깨진다. 반드시 다운로드:
1. `notion-download-attachment` 도구(있으면) 또는 PowerShell `Invoke-WebRequest -Uri <url> -OutFile <path>`로 다운로드.
2. 저장 위치: `src/assets/study/<슬러그>/<번호-설명>.png` — **src/assets에 둬야 Astro가 빌드 때 WebP 변환 + width/height 자동 삽입** (public에 두면 원본 PNG가 그대로 나가서 무겁고 로드 시 레이아웃이 밀린다).
3. 마크다운: `![캡션 설명](../../assets/study/<슬러그>/01-result.png)` — **콘텐츠 파일 기준 상대경로**. 캡션은 이미지 다음 줄에 `*이탤릭*`으로 쓰면 자동 캡션 스타일.
4. 예외: 마크다운이 아닌 raw HTML `<img>`(예: `.img-pair` 2단 배치)는 Astro가 최적화하지 못한다 → 이때만 `public/images/study/<슬러그>/`에 두고 `/images/...` 절대경로 사용.
5. 첨부파일(다운로드용 원본)은 계속 `public/attachments/<슬러그>/` — 원본 그대로 제공이 목적이라 최적화 대상이 아니다.

## 7. 검증 & 발행
1. `npm run check` (0 에러 확인)
2. `npm run build` (통과 확인)
3. 미리보기로 목록 창 + 글 페이지 확인
4. `docs/DEVLOG.md`에 `[콘텐츠]` 태그로 기록
5. `git add → commit → push` (push하면 Vercel 자동 배포)

## 참고: 화면 구조
- 공부기록 창 = 분류별 목록 (`Desktop.astro`의 studyGroups)
- 글 페이지 = `/study/<슬러그>/` — 레트로 브라우저 프레임 (`src/pages/study/[slug].astro`)
- 목록/본문 스타일 = `src/styles/pixel.css`의 `.cat-group`/`.prose` 섹션
