---
title: "이진 탐색, 반으로 쪼개면 빨라진다"
date: "2026.06.15"
category: "알고리즘"
tags: ["이진탐색", "시간복잡도", "예시글"]
summary: "(예시 글) 정렬된 배열에서 O(log n)으로 값을 찾는 이진 탐색 정리."
---

> (예시 글) 알고리즘 분류가 어떻게 보이는지 확인용. 실제 공부 글로 교체하면 됩니다.

## 핵심 아이디어

정렬돼 있다는 성질을 이용해 **매번 탐색 범위를 절반으로** 줄인다. 1024개짜리 배열도 10번이면 끝 — O(log n).

![마스코트도 반씩 쪼개서 찾는 중](/mascot.svg)

## 코드

```javascript
function binarySearch(arr, target) {
  let lo = 0, hi = arr.length - 1;
  while (lo <= hi) {
    const mid = (lo + hi) >> 1;        // 가운데
    if (arr[mid] === target) return mid;
    if (arr[mid] < target) lo = mid + 1; // 오른쪽 절반
    else hi = mid - 1;                   // 왼쪽 절반
  }
  return -1; // 없음
}
```

## 자주 하는 실수

| 실수 | 결과 |
|---|---|
| `lo < hi`로 조건을 쓰면 | 마지막 원소를 못 볼 수 있음 |
| `mid = (lo+hi)/2` 소수점 | 인덱스가 실수가 됨 — 정수 나눗셈 필요 |
| 정렬 안 된 배열에 사용 | 결과가 그냥 틀림 (전제조건!) |

## ⭐ 변형 포인트

- **처음 등장하는 위치**를 찾으려면? → 값을 찾아도 멈추지 않고 `hi = mid - 1`로 왼쪽을 계속 탐색 (lower bound).
- 재귀로 바꾸면? → 종료 조건 `lo > hi`, 호출마다 범위 절반.
