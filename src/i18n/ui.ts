// 화면에 보이는 모든 UI 문구(한/영). 콘텐츠가 아니라 '껍데기' 문구다.
export const languages = ['ko', 'en'] as const;
export type Lang = (typeof languages)[number];

export const ui = {
  ko: {
    osName: '404 Tacocat OS',
    boot: '부팅 중...',
    bootHint: '아무 키나 누르거나 클릭하세요',
    start: '시작',
    apps: {
      portfolio: '포트폴리오',
      awards: '수상',
      activities: '활동',
      study: '공부기록',
      about: 'About',
    },
    close: '닫기',
    detail: '자세히',
    period: '기간',
    org: '주최',
    role: '역할',
    date: '날짜',
    rank: '결과',
    tech: '사용 기술',
    tags: '태그',
    langToggle: 'EN',
    emptyAbout:
      '안녕하세요! 여기에 자기소개가 들어갑니다. 사진, 연락처, SNS 링크도 넣을 수 있어요.',
  },
  en: {
    osName: '404 Tacocat OS',
    boot: 'Booting...',
    bootHint: 'Press any key or click',
    start: 'Start',
    apps: {
      portfolio: 'Portfolio',
      awards: 'Awards',
      activities: 'Activities',
      study: 'Study Log',
      about: 'About',
    },
    close: 'Close',
    detail: 'Details',
    period: 'Period',
    org: 'Organizer',
    role: 'Role',
    date: 'Date',
    rank: 'Result',
    tech: 'Tech',
    tags: 'Tags',
    langToggle: '한',
    emptyAbout:
      'Hi! Your introduction goes here. You can add a photo, contact, and social links too.',
  },
} as const;

export function t(lang: Lang) {
  return ui[lang];
}
