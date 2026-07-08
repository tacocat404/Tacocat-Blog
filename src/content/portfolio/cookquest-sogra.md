---
title: "CookQuest: 요리 게이미피케이션 웹앱"
period: 2026.05 – 2026.06
summary: 자취생의 "오늘 뭐 해먹지?"를 XP·티어·스트릭 게임 퀘스트로 바꾼 SOGRA 해커톤 출품작.
tech: ["HTML/CSS", "Vanilla JS", "Web Crypto API", "localStorage"]
links:
  - label: GitHub
    url: https://github.com/tacocat404/SOGRA-hackathon
order: 3
---

요리 한 번 = 퀘스트 클리어(XP 획득), 누적 XP로 **8단계 티어**(돌멩이 → 마스터) 승급, 설거지 습관은 스트릭 달력으로 시각화. 단순 레시피 앱이 아니라 **요리 → 다음 추천 → 장보기 TODO → 다시 요리**로 이어지는 행동 유도형 게임 루프를 설계했습니다.

- 보유 재료·도구 기반 **"거의 만들 수 있는" 다음 요리 추천**, 부족한 항목만 장보기 TODO로 안내
- 레시피별 인터랙티브 조리 파이프라인: 단계별 체크리스트·타이머·XP HUD
- 백엔드 없는 정적 데모에서 가능한 보안을 집중 구현: SHA-256+salt 검증, HMAC 서명 세션, CSP·XSS-safe 렌더, 로그인 잠금
- `data → security → core(도메인) → UI` 계층으로 단일 책임 분리한 Vanilla JS 아키텍처
