---
title: "실습 ① ToDo App — 바이브 코딩 (Claude Code)"
date: "2026.07.03"
category: "기타"
series: "실무프로젝트 1 — 9주차 바이브 코딩"
seriesOrder: 1
tags: ["바이브코딩", "Claude Code", "JavaScript", "localStorage"]
summary: "PRD를 5단계 프롬프트로 쪼개 브라우저 할 일 앱을 점진적으로 완성. 배운 건 JS 문법이 아니라 'AI에게 일 시키는 순서'."
notionUrl: "https://app.notion.com/p/39207509803281ef922cf8680861828d"
---

> 🛠 **툴**: Claude Code (바이브 코딩) · 🧩 **언어**: 순수 HTML/CSS/JS · 💾 **저장**: localStorage · 📄 **파일**: `todo.html` 1개

## 🎯 무엇을 만들었나

브라우저에서 바로 도는 **할 일 관리 앱**. 서버 없이 파일 하나로, 새로고침해도 데이터가 안 날아간다(localStorage).

**넣은 기능**: 추가/삭제 · 완료 체크 · 카테고리(업무/개인/공부) + 색상 태그 · 필터 · 검색 · 진행률 대시보드 · 더블클릭 인라인 수정 · 다크모드 · 중복 경고 · 빈 상태 메시지

## 🧩 이 실습의 진짜 배울 점

코드 기술보다 **"큰 요구사항(PRD)을 → 작은 프롬프트로 쪼개는 법"**이 핵심. 한 방에 다 시키면 뭉개지니까, **기본 구조 → 카테고리 → 대시보드 → 고급기능** 순으로 쌓았다.

⇒ 배운 건 JS 문법이 아니라 **"AI에게 일 시키는 순서"**다.

## 🗂 데이터 구조

할 일 하나 = 객체 하나.

```javascript
{ id, text, completed, createdAt, category }
```

⇒ 이 앱의 모든 기능은 결국 **이 객체 배열을 다루는 일**이다.

## 🌊 코드 흐름 (핵심 패턴)

```text
사용자 입력 (타이핑 + 추가)
      ↓
tasks 배열에 새 객체 push
      ↓
save()   → localStorage에 통째로 저장
      ↓
render() → 배열을 보고 화면을 처음부터 다시 그림
      ↓
(삭제·완료·수정도 전부 → 배열 수정 → save → render 반복)
```

> 이게 **state(상태) → 저장 → 다시 그림** 패턴. React 같은 프레임워크의 핵심 아이디어를 순수 JS로 맛본 것.

## 🔧 함수별 역할

| 함수 | 역할 |
|---|---|
| `addTask()` | 입력값 trim → 중복 체크 → 객체 push → save → render |
| `del(id)` | `filter`로 해당 id 빼고 배열 재구성 |
| `toggle(id)` | 해당 항목 `completed` 불리언 뒤집기 |
| `edit(li, t)` | 더블클릭 → input으로 교체, Enter 저장 / ESC 취소 |
| `dashboard()` | 전체 완료율 + 카테고리별 미니바 + 오늘 추가 개수 계산 |
| `render()` | 필터+검색 적용 → 정렬(완료 아래로) → 목록 다시 그림 |
| `save()` / `load()` | localStorage와 배열·필터 동기화 |
| `ago(ts)` | 생성시간 → "3분 전" 같은 상대시간으로 변환 |

## 💻 실제 코드 뜯어보기

### 1) 상태 + 저장/불러오기

앱 전체가 **배열 하나(tasks)**를 중심으로 돌아간다.

```javascript
let tasks  = load("tasks", []);     // 할 일 배열이 유일한 '진실'(single source of truth)
let filter = load("filter", "all");

function save(){                     // 배열을 통째로 문자열로 저장
  localStorage.setItem("tasks", JSON.stringify(tasks));
  localStorage.setItem("filter", JSON.stringify(filter));
}
function load(key, def){             // 없으면 기본값(?? 로 방어)
  try{ return JSON.parse(localStorage.getItem(key)) ?? def; }
  catch{ return def; }
}
```

⇒ `JSON.stringify`로 배열→문자열, `JSON.parse`로 문자열→배열. localStorage는 **문자열만 저장**하니까 이 변환이 필수.

### 2) 추가 — addTask()

```javascript
function addTask(){
  const text = document.getElementById("text").value.trim();
  if(!text) return;                                  // 빈 입력 차단
  if(tasks.some(t => t.text===text && !t.completed)){ // 중복 경고
    if(!confirm("같은 할 일이 이미 있어요. 그래도 추가할까요?")) return;
  }
  tasks.push({ id:Date.now(), text, completed:false,
               createdAt:Date.now(),
               category:document.getElementById("cat").value });
  save(); render();                                  // ★ 항상 save → render
}
```

⇒ 모든 동작의 끝은 **`save() → render()`**. 배열만 고치고 화면은 다시 그린다.

### 3) 핵심 패턴 — render()

```javascript
function render(){
  dashboard();
  let shown = tasks
    .filter(t => filter==="all" || t.category===filter)   // 필터
    .filter(t => t.text.toLowerCase().includes(query))    // 검색
    .sort((a,b)=> (a.completed - b.completed)             // 완료는 아래로
                || (b.createdAt - a.createdAt));           // 같은 상태끼린 최신순
  // ...shown을 돌면서 <li>를 처음부터 다시 그림
}
```

> 💡 정렬 트릭: `(a.completed - b.completed) || (b.createdAt - a.createdAt)` — 불리언 뺄셈(true=1, false=0)으로 **1차 정렬**, 0이면(같으면) `||` 뒤로 넘어가 **2차 정렬**. 한 줄에 정렬 규칙 두 개.

### 4) 더블클릭 인라인 수정 — edit()

```javascript
function edit(li, t){
  const input = document.createElement("input");
  input.value = t.text;
  li.querySelector(".t").replaceWith(input); input.focus();  // span → input 교체
  const commit = ok => { if(ok){ t.text = input.value.trim() || t.text; save(); } render(); };
  input.addEventListener("keydown", e => {
    if(e.key==="Enter") commit(true);    // Enter = 저장
    if(e.key==="Escape") commit(false);  // ESC = 취소
  });
  input.addEventListener("blur", () => commit(true));  // 다른 데 클릭해도 저장
}
```

⇒ 새 창/모달 없이 **제자리에서 span을 input으로 잠깐 바꾸는** 패턴. 값 바꾸면 역시 `save → render`.

## ⭐ 변형 포인트 (이해도 테스트)

- **카테고리 하나 추가?** → `CATS` 객체에 항목 추가 + CSS에 `--색이름` 변수 추가하면 태그·필터·미니바가 따라온다.
- **완료 항목을 위로 올리려면?** → `render()`의 `a.completed - b.completed`를 뒤집기.
- **저장 끄면?** → `save()` 호출 제거 → 새로고침 시 초기화(세션용).

## ▶️ 실행 방법

`todo.html` 더블클릭 → 브라우저에서 바로 실행. 새로고침해도 데이터 유지.

## 🔎 회고 (솔직히)

- 순수 JS + localStorage만으로도 **"상태 → 저장 → 렌더" 패턴**을 체감한 게 제일 큰 수확. 나중에 React 배울 때 밑그림이 이미 여기 있음.
- 주의: 확인 없이 만들면 **`render()`가 비대해질 수 있다** — 매번 전체를 다시 그리니까. 항목 100개 넘으면 부분 갱신/가상 DOM이 필요해지는 지점.
