# 404 Tacocat OS — 이어가기 프롬프트 (HANDOFF)

> **사용법**: 새 대화를 열고 이 파일 내용 전체를 복사해 첫 메시지로 붙여넣으세요.
> (`C:\기미주\Blog` 폴더에서 대화를 시작하면 CLAUDE.md·메모리가 자동 로드되므로 "하던 거 이어서"만 해도 되지만, 이 파일은 전체 상태를 명시한 안전판입니다.)

---

너는 내 블로그 프로젝트 "404 Tacocat OS"를 이어서 작업해야 해. 아래 상태를 읽고 그대로 이어가줘.

## 🎯 프로젝트
- **404 Tacocat OS**: 레트로 데스크톱 OS 컨셉 픽셀아트 포트폴리오 블로그
- 위치 `C:\기미주\Blog` / GitHub `tacocat404/Tacocat-Blog` (main) / Astro 5 + 마크다운
- **프로덕션**: https://tacocat-blog-xpsx.vercel.app (구 tacocat-blog.vercel.app은 폐기됨)
- `git push` = Vercel 자동 배포. gh CLI는 tacocat404 계정으로 로그인돼 있음 (repo/workflow 스코프)
- 운영자는 **비개발자**: 코드는 Claude 전담, 계정 로그인/설치만 사용자가 직접

## ✅ 완료된 것
- **OS UI 전체**: 부팅(첫 방문만)/드래그 창/작업표시줄/시작메뉴/Esc/날짜시계, 사계절 픽셀 배경(`?season=` 미리보기)
- **공부기록 시스템**: 분류/시리즈 그룹핑, `/study/슬러그/` 레트로 브라우저 프레임
- **KaTeX 수식**: remark-math + rehype-katex, 글 페이지에서만 KaTeX CSS 조건부 로드 (`Base.astro`의 `math` prop)
- **첨부파일 기능**: study frontmatter `attachments`(label/file/kind: image|pdf) → 본문 아래 썸네일 그리드 + 라이트박스(미리보기/다운로드). **기능은 완성, 아직 쓰는 글 없음**
- **콘텐츠**:
  - 노션 동기화 4건: ToDo App, Tabular ML #4, Git 다운로드, **선형대수 #0** (`linear-algebra-00-basics.md`, 분류 "선형대수학" #c8bce0, 시리즈 "인공지능을 위한 선형대수")
  - 선형대수 글에 노션 손필기 이미지 8장 반영 완료 (`public/images/study/linear-algebra-00-basics/`) — §3 내적 이미지는 최신본으로 교체됨
  - 포트폴리오 실제 3건: 블로그 자체 / 출결기록실(checking-attendance) / CookQuest(SOGRA-hackathon)
- **보안**: `vercel.json` 헤더(CSP·XFO·nosniff·HSTS 등) 프로덕션 적용 확인됨
- **성능/폴리싱**: 시계 분 경계 갱신, 드래그 rAF 스로틀, z-index 재정규화, 창 뷰포트 클램프, 아이콘 눌림 촉감, focus-visible, ::selection, reduced-motion 게이트
- SEO/접근성/CI/404페이지/타이포(본문 Pretendard + UI Galmuri), **한국어 단일** (영어 제거됨, 되살리지 말 것)
- 코드 구조: 클라이언트 JS=`src/scripts/desktop.ts`, 아이콘=`src/config/icons.ts`, CSS=`src/styles/`(base/os/wallpaper/prose, pixel.css 허브)

## ⏳ 다음 할 일
1. **선형대수 글 후속**:
   - 손필기 스캔 원본을 첨부(다운로드)로도 제공하려면 → `public/attachments/linear-algebra-basics/`에 파일 저장 + frontmatter `attachments` 채우면 하단 첨부 섹션 자동 활성화
   - 노션 §10(연습문제) 끝에 §3와 **완전 동일한 중복 이미지**가 붙어 있음 → 사용자가 노션에서 올바른 그림으로 바꾸면 반영
   - 시리즈 다음 글(#1~)이 노션에 올라오면 같은 절차로 동기화 (docs/STUDY-SYNC.md)
2. 사용자가 내용 주면: About 연락처/자기소개, 시리즈 이전/다음 버튼, 포트폴리오 개별 상세 페이지
3. 수상/활동 섹션 실제 콘텐츠 채우기 (아직 예시 데이터)
4. 도메인 404tacocatblog.com 구매 (Vercel에 이름만 등록됨)

## 📏 규칙 (CLAUDE.md에도 있음 — 자동 적용)
- 모든 작업 후 `docs/DEVLOG.md`에 `[기획]/[구현]/[배포]/[콘텐츠]/[자동화]` 태그로 기록 (말 안 해도 자동)
- ⚠️ PowerShell로 한글 파일 텍스트 치환 금지(인코딩 깨짐) — Edit/Write 도구 사용
- **노션 이미지는 임시 URL(5분~1시간 만료)** — fetch 직후 바로 다운로드해서 `public/images/study/<슬러그>/`에 저장. 받은 뒤 **이미지를 실제로 열어 내용↔캡션 일치 검수** (순서 뒤바뀜/중복 사례 있었음)
- 콘텐츠 추가법 `docs/CONTENT-GUIDE.md`, 노션 동기화 `docs/STUDY-SYNC.md` 참고
- frontmatter 날짜·"2026.07" 같은 값은 반드시 따옴표 (숫자 오해 방지)
- 프리뷰 도구가 뷰포트 0/스크린샷 멈춤 증상 가끔 있음 → 서버 재시작 or 텍스트 검증으로 대체
- git `index.lock` 잔존 에러 시: git 프로세스 없는 것 확인 후 lock 삭제하고 재시도
- 배포 검증: push 후 프로덕션 URL을 폴링해 실제 반영 확인까지가 한 사이클

## 📌 노션 참고
- 워크스페이스 "야르하게살자" > "인공지능을 위한 선형대수" (상위 페이지 `395075098032804d97dcf08c2a7fa6a4`)
- 첫 글 원본: `39807509803281638ed0e0715b5322ad` (벡터~rank,해 개수 도출)

모든 작업은 push 완료 상태 (이 파일이 커밋된 시점 = 최신, 작업 트리 깨끗). `git log --oneline -5`로 최근 이력 확인 가능.
이 상태에서 이어서 작업해줘.
