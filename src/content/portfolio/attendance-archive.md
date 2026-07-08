---
title: 출결기록실 — LLM 증강 출결 관리 시스템
period: "2026.07"
summary: Google Forms → Sheets → Gemini → Gmail 노코드 자동화 파이프라인의 웹 프론트엔드. 실무프로젝트 1 팀 프로젝트 (프론트엔드/팀장).
tech: ["HTML/CSS/JS", "Make.com", "Google Gemini", "Google Forms·Sheets·Gmail"]
links:
  - label: GitHub
    url: https://github.com/tacocat404/checking-attendance
order: 2
---

직원이 버튼 한 번으로 출퇴근을 기록하면, Make.com 시나리오가 **응답 감지 → 시트 기록 → Gemini 안내 문구 생성 → Gmail 자동 발송 → 로그 누적**까지 자동 처리합니다. 기존 엑셀 VBA 매크로(파일 열고 수동 실행)를 LLM 증강 자동화로 개선한 프로젝트입니다.

- 웹 4개 화면: 오늘(실시간 출퇴근 체크) · 근태 내역 · 통계 · 메일 이력
- 에디토리얼(신문 지면) 디자인 — 웜 페이퍼 + "인주 스탬프" 색감, 라이브러리 의존성 없는 순수 HTML/CSS/JS
- 개인정보 보호: 공개 주소에서는 데모 데이터만, 실데이터는 localhost에서만 표시
- 5인 팀에서 **프론트엔드 · 팀장** 담당 — 화면↔Forms/Sheets 연동, 결과물 병합·발표
