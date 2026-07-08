// 데스크톱 OS 클라이언트 로직.
// 구역: 부팅 → 창 관리(열기/닫기/최소화/포커스) → 시작 메뉴 → Esc → 드래그 → 시계 → 계절 배경.
// 마크업은 Desktop.astro, 스타일은 src/styles/os.css 참고.

/* ===== 부팅 화면: 첫 방문에만 재생 (재방문·모션 최소화 시 스킵) ===== */
const boot = document.getElementById("boot");
const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
const removeBoot = () => {
  try { sessionStorage.setItem("booted", "1"); } catch {}
  // 숨기는 대신 DOM에서 제거 — 부팅 애니메이션/노드 메모리 해제
  boot?.remove();
};
let booted = false;
try { booted = !!sessionStorage.getItem("booted"); } catch {}
if (boot) {
  if (booted || reducedMotion) {
    boot.remove();
  } else {
    const bar = boot.querySelector<HTMLElement>(".boot-bar > i");
    let p = 0;
    const tick = setInterval(() => {
      p += 20;
      if (bar) bar.style.width = Math.min(p, 100) + "%";
      if (p >= 100) clearInterval(tick);
    }, 220);
    setTimeout(removeBoot, 1600);
    boot.addEventListener("click", removeBoot);
    window.addEventListener("keydown", removeBoot, { once: true });
  }
}

/* ===== 창 관리 ===== */
const taskItems = document.getElementById("task-items")!;
let z = 10;

// 접근성: 창 = dialog, 포커스 가능
document.querySelectorAll<HTMLElement>(".window").forEach((w) => {
  w.setAttribute("role", "dialog");
  w.setAttribute("aria-label", w.querySelector(".titlebar .t")?.textContent ?? "");
  w.tabIndex = -1;
});

const setActive = (win: HTMLElement | null) => {
  document.querySelectorAll(".window.open").forEach((w) => w.classList.add("inactive"));
  if (win) win.classList.remove("inactive");
  document.querySelectorAll<HTMLElement>(".task-btn").forEach((b) =>
    b.classList.toggle("active", !!win && b.dataset.app === win.dataset.app)
  );
};

const focusWin = (win: HTMLElement) => {
  // z-index가 무한히 커지지 않게 주기적으로 재정규화
  if (z > 200) {
    const opens = [...document.querySelectorAll<HTMLElement>(".window")]
      .sort((a, b) => +(a.style.zIndex || 0) - +(b.style.zIndex || 0));
    z = 10;
    opens.forEach((w) => (w.style.zIndex = String(++z)));
  }
  win.style.zIndex = String(++z);
  setActive(win);
};

const makeTaskBtn = (win: HTMLElement) => {
  const name = win.dataset.app!;
  if (taskItems.querySelector(`.task-btn[data-app="${name}"]`)) return;
  const btn = document.createElement("button");
  btn.className = "task-btn";
  btn.dataset.app = name;
  const icon = win.querySelector(".titlebar .ico")!.innerHTML;
  const title = win.querySelector(".titlebar .t")!.textContent;
  btn.innerHTML = `<span class="ti">${icon}</span>${title}`;
  btn.addEventListener("click", () => {
    const active = win.classList.contains("open") && !win.classList.contains("inactive");
    if (active) {
      win.classList.remove("open"); // 최소화
      setActive(null);
    } else {
      win.classList.add("open");
      focusWin(win);
    }
  });
  taskItems.appendChild(btn);
};

const openApp = (name: string) => {
  const win = document.querySelector<HTMLElement>(`.window[data-app="${name}"]`);
  if (!win) return;
  win.classList.remove("closing");
  win.classList.add("open");
  // 좁은 화면에서 기본 위치(left 130~250px)가 오른쪽으로 삐져나가면 뷰포트 안으로 클램프
  if (!matchMedia("(max-width: 640px)").matches) {
    const r = win.getBoundingClientRect();
    if (r.right > innerWidth - 8) {
      win.style.left = Math.max(8, innerWidth - r.width - 8) + "px";
    }
  }
  makeTaskBtn(win);
  focusWin(win);
  win.focus({ preventScroll: true });
  toggleMenu(false);
};

const closeApp = (win: HTMLElement) => {
  taskItems.querySelector(`.task-btn[data-app="${win.dataset.app}"]`)?.remove();
  setActive(null);
  win.classList.add("closing");
  win.addEventListener("animationend", function h(ev) {
    if (ev.animationName !== "winclose") return;
    win.classList.remove("open", "closing");
    win.removeEventListener("animationend", h);
  });
  // 접근성: 닫힌 뒤 키보드 포커스를 그 창을 여는 바탕화면 아이콘으로 되돌린다
  document
    .querySelector<HTMLElement>(`.icon[data-open="${win.dataset.app}"]`)
    ?.focus({ preventScroll: true });
};

document.querySelectorAll<HTMLElement>(".window").forEach((win) =>
  win.addEventListener("mousedown", () => focusWin(win))
);
document.querySelectorAll<HTMLElement>("[data-open]").forEach((el) =>
  el.addEventListener("click", () => openApp(el.dataset.open!))
);
document.querySelectorAll<HTMLElement>("[data-close]").forEach((el) =>
  el.addEventListener("click", (e) => {
    e.stopPropagation();
    closeApp(el.closest(".window") as HTMLElement);
  })
);

/* ===== 시작 메뉴 ===== */
const startBtn = document.getElementById("start-btn")!;
const startMenu = document.getElementById("start-menu")!;
function toggleMenu(open: boolean) {
  startMenu.classList.toggle("open", open);
  startBtn.setAttribute("aria-expanded", String(open));
}
startBtn.addEventListener("click", (e) => {
  e.stopPropagation();
  toggleMenu(!startMenu.classList.contains("open"));
});
document.addEventListener("click", () => toggleMenu(false));

/* ===== Esc: 시작 메뉴 → 최상단 창 순으로 닫기 ===== */
window.addEventListener("keydown", (e) => {
  if (e.key !== "Escape") return;
  if (startMenu.classList.contains("open")) return toggleMenu(false);
  const wins = [...document.querySelectorAll<HTMLElement>(".window.open:not(.closing)")];
  if (!wins.length) return;
  const top = wins.reduce((a, b) => (+(a.style.zIndex || 0) > +(b.style.zIndex || 0) ? a : b));
  closeApp(top);
});

/* ===== 창 드래그 (포인터 이벤트 = 마우스+터치, 화면 밖 이탈 방지) ===== */
document.querySelectorAll<HTMLElement>(".window .titlebar").forEach((bar) => {
  bar.addEventListener("pointerdown", (e) => {
    if ((e.target as HTMLElement).closest("[data-close]")) return;
    if (matchMedia("(max-width: 640px)").matches) return;
    const win = bar.closest(".window") as HTMLElement;
    focusWin(win);
    const r = win.getBoundingClientRect();
    const dx = e.clientX - r.left;
    const dy = e.clientY - r.top;
    try { bar.setPointerCapture(e.pointerId); } catch {}
    // pointermove는 프레임보다 자주 발생(고주사율 마우스) → rAF로 프레임당 1회만 스타일 반영
    let raf = 0;
    let lastX = e.clientX, lastY = e.clientY;
    const paint = () => {
      raf = 0;
      const w = win.offsetWidth;
      win.style.left = Math.min(Math.max(lastX - dx, 64 - w), innerWidth - 64) + "px";
      win.style.top = Math.min(Math.max(lastY - dy, 26), innerHeight - 80) + "px";
    };
    const move = (ev: PointerEvent) => {
      lastX = ev.clientX; lastY = ev.clientY;
      if (!raf) raf = requestAnimationFrame(paint);
    };
    const up = () => {
      if (raf) cancelAnimationFrame(raf);
      bar.removeEventListener("pointermove", move);
      bar.removeEventListener("pointerup", up);
      bar.removeEventListener("pointercancel", up);
    };
    bar.addEventListener("pointermove", move);
    bar.addEventListener("pointerup", up);
    bar.addEventListener("pointercancel", up);
  });
});

/* ===== 시계 (날짜 + 요일 + 시:분) ===== */
const DAYS = ["일", "월", "화", "수", "목", "금", "토"];
const pad = (n: number) => String(n).padStart(2, "0");
const updateClock = () => {
  const d = new Date();
  const s = `${pad(d.getMonth() + 1)}.${pad(d.getDate())} (${DAYS[d.getDay()]}) ${pad(d.getHours())}:${pad(d.getMinutes())}`;
  const top = document.getElementById("clock-top");
  const bottom = document.getElementById("clock-bottom");
  if (top) top.textContent = s;
  if (bottom) bottom.textContent = s;
};
// 표시 단위가 '분'이므로 10초 폴링 대신 다음 분 경계에 맞춰 갱신
const tickClock = () => {
  updateClock();
  setTimeout(tickClock, 60000 - (Date.now() % 60000) + 50);
};
tickClock();

/* ===== 딥링크: /?open=study → 해당 창 자동 오픈 (글 페이지의 '뒤로' 버튼용) ===== */
const openParam = new URLSearchParams(location.search).get("open");
if (openParam) openApp(openParam);

/* ===== 계절 배경 (북반구 기준, ?season= 으로 미리보기) ===== */
const seasonOf = (m: number) =>
  m >= 3 && m <= 5 ? "spring" :
  m >= 6 && m <= 8 ? "summer" :
  m >= 9 && m <= 11 ? "autumn" : "winter";
const season =
  new URLSearchParams(location.search).get("season") ?? seasonOf(new Date().getMonth() + 1);
document.body.dataset.season = season;
document.querySelectorAll<HTMLElement>(".wp").forEach((w) => {
  if (w.dataset.wp === season) w.classList.add("active");
  else w.remove(); // 메모리: 안 쓰는 계절의 DOM(수십 개 입자 포함)을 제거
});

/* ===== 메모리: 탭이 안 보일 때 배경 애니메이션 일시정지 ===== */
document.addEventListener("visibilitychange", () => {
  document.body.classList.toggle("bg-paused", document.hidden);
});
