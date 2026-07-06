# 404 Tacocat OS — 작업 규칙

## 작업 로그 (필수)
- **모든 작업(코딩/기획/배포/콘텐츠)이 끝나면 반드시 `docs/DEVLOG.md`에 항목을 추가한다.**
- 형식: 날짜 섹션 아래 `### [태그] 제목` — 태그는 `[기획]` / `[구현]` / `[배포]` / `[콘텐츠]` / `[자동화]` 중 선택.
- 내용: **사용자 프롬프트(요약)** + **Claude의 변경사항** + (있으면) **다음 단계**.
- 사용자가 따로 말하지 않아도 자동으로 기록한다.

## 운영 방식
- 운영자는 비개발자 — 코드는 Claude 전담, 운영자는 콘텐츠만 작성.
- 계정 로그인·CLI 설치는 사용자가 직접. Claude는 push/배포 같은 기계적 단계만.
- `git push` = Vercel 자동 배포 (GitHub: tacocat404/Tacocat-Blog, main 브랜치).

## 기술 주의사항
- ⚠️ **PowerShell로 한글 파일 텍스트 치환 금지** (인코딩 깨짐) — Edit/Write 도구 사용.
- 코드 구조: 클라이언트 JS=`src/scripts/desktop.ts`, 아이콘=`src/config/icons.ts`, CSS=`src/styles/`(base/os/wallpaper/prose 4분할, pixel.css가 허브).
- 콘텐츠 추가법은 `docs/CONTENT-GUIDE.md`, 노션 동기화 절차는 `docs/STUDY-SYNC.md` 필독.
- 노션 이미지는 1시간 임시 URL — 반드시 다운로드해서 `public/images/study/<슬러그>/`에 저장.
- 언어는 한국어 단일 (영어 버전 제거됨 — 되살리지 말 것).
