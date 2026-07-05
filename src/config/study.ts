// 공부기록 분류 설정.
// KNOWN에 있는 분류는 지정된 색/순서를 쓰고,
// 새 분류는 frontmatter에 이름만 쓰면 자동으로 색이 배정된다 (코드 수정 불필요).
export type CatInfo = { color: string; order: number };

const KNOWN: Record<string, CatInfo> = {
  인공지능: { color: '#bbd8e2', order: 0 },
  알고리즘: { color: '#a7be9e', order: 1 },
  기타: { color: '#f4c792', order: 99 },
};

const FALLBACK_COLORS = ['#d8b8c8', '#c9d87e', '#e9a86a', '#b8c8e2', '#e2c8b8'];

export function catInfo(name: string): CatInfo {
  if (KNOWN[name]) return KNOWN[name];
  let hash = 0;
  for (const ch of name) hash = (hash * 31 + ch.charCodeAt(0)) % 997;
  return { color: FALLBACK_COLORS[hash % FALLBACK_COLORS.length], order: 50 };
}

export function sortCategories(names: string[]): string[] {
  return [...names].sort((a, b) => catInfo(a).order - catInfo(b).order || a.localeCompare(b, 'ko'));
}
