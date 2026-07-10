---
title: "벡터 ~ rank · 해 개수 도출"
date: "2026.07.10"
category: "선형대수학"
series: "인공지능을 위한 선형대수"
seriesOrder: 0
tags: ["선형대수", "rank", "null space", "사영", "벡터공간"]
summary: "벡터·행렬 언어부터 전치·내적/노름·사영, 행렬곱 4관점, 선형독립·기저, rank, null space와 네 부분공간, 그리고 Ax=b 해의 개수까지 한 흐름으로 정리."
notionUrl: "https://app.notion.com/p/39807509803281638ed0e0715b5322ad"
---

## 1. 벡터와 행렬 기초

### 벡터 = 크기 + 방향
벡터는 단순한 숫자 나열이 아니라 **크기(magnitude)** 와 **방향(direction)** 을 함께 가진 대상이다. 예를 들어 $\begin{bmatrix} 2 \\ 2 \end{bmatrix}$ 는 크기 $\sqrt{2^2 + 2^2} = \sqrt{8} = 2\sqrt{2}$ 에 방향 $\tan^{-1}(2/2) = 45^\circ$ 를 가진 화살표로 볼 수 있다.

### 기본 연산
- **덧셈·뺄셈:** 좌표평면에서 화살표를 이어붙이거나 뺀다.
- **스칼라 곱:** 화살표의 길이를 늘이거나 줄인다. 예) $2 \times \begin{bmatrix} 1 \\ 1 \end{bmatrix} = \begin{bmatrix} 2 \\ 2 \end{bmatrix}$.

![벡터 덧셈·뺄셈과 스칼라배](/images/study/linear-algebra-00-basics/vector-add-scalar.png)
*좌표평면에서 화살표를 이어붙이면 덧셈, 길이를 늘이면 스칼라배.*

### 벡터·행렬로 연립방정식 표현하기
벡터와 행렬이 좋은 건 **여러 개의 식을 한 덩어리로 묶어서 적을 수 있다**는 거다. 미지수가 2개인 연립방정식

$$
\begin{cases} 1x + 2y = 4 \\ 2x + 5y = 9 \end{cases}
$$

은 계수만 뜯어내 아래처럼 $Ax = b$ 한 줄로 압축된다:

$$
\begin{bmatrix} 1 & 2 \\ 2 & 5 \end{bmatrix}\begin{bmatrix} x \\ y \end{bmatrix} = \begin{bmatrix} 4 \\ 9 \end{bmatrix}
$$

### 구성 요소와 용어
- **행(row)** 은 가로줄, **열(column)** 은 세로줄.
- 원소 $a_{ij}$ 는 $i$행 $j$열을 가리킨다 (행이 먼저, 열이 나중). 위 행렬에서 $a_{21} = 2$.
- 세로로 세운 $\begin{bmatrix} x \\ y \end{bmatrix}$ 는 **열벡터(2×1)**, 가로로 누운 $[x\ y]$ 는 **행벡터**.
- 계수 묶음 = **행렬** $A$, 미지수 묶음 = **벡터** $x$, 우변 = **결과 벡터** $b$. 이 셋을 합치면 $Ax = b$ 가 된다.

### 여러 연립방정식을 한 번에 풀기
우변을 열로 나란히 쌓으면 **여러 개의 연립방정식을 행렬 하나로 동시에** 풀 수 있다.

- 시스템 1: $x_1 + 2y_1 = 4,\ 2x_1 + 5y_1 = 9$ → 우변 $\begin{bmatrix} 4 \\ 9 \end{bmatrix}$
- 시스템 2: $x_2 + 2y_2 = 3,\ 2x_2 + 5y_2 = 7$ → 우변 $\begin{bmatrix} 3 \\ 7 \end{bmatrix}$

계수행렬은 그대로 두고 미지수·우변만 열로 붙이면:

$$
\begin{bmatrix} 1 & 2 \\ 2 & 5 \end{bmatrix}\begin{bmatrix} x_1 & x_2 \\ y_1 & y_2 \end{bmatrix} = \begin{bmatrix} 4 & 3 \\ 9 & 7 \end{bmatrix}
$$

시스템이 2개니까 미지수 행렬과 결과 행렬은 각각 **2×2**고, 시스템이 $n$ 개면 $2\times n$ 이 된다.

![Ax=b의 구성 요소와 행·열 표기](/images/study/linear-algebra-00-basics/notation-ax-b.png)
*행렬 A · 열벡터 x · 결과 벡터 b, 그리고 원소 aᵢⱼ의 행·열 표기.*

### 행렬 곱의 크기 규칙
행렬 곱은 아무 크기끼리나 되는 게 아니다. **앞 행렬의 열 수 = 뒤 행렬의 행 수**여야 곱할 수 있고, 결과 크기는 바깥 숫자만 남는다: $(m \times k)\,(k \times n) = m \times n$ — 가운데 $k$ 가 서로 같아야 하고, 곱한 뒤엔 사라진다. 예) $4\times 3$ 과 $3\times 5$ 는 가운데 3이 맞아서 곱하면 $4\times 5$.

---

## 2. 전치(Transpose)
대각선을 축으로 행과 열을 뒤집는 것. $\begin{bmatrix} 1 \\ 2 \end{bmatrix}^T = \begin{bmatrix} 1 & 2 \end{bmatrix}$

3×3로 보면 감이 더 온다. $(i, j)$ 원소가 $(j, i)$ 자리로 가고, 대각 성분(1, 5, 9)은 제자리에 그대로 남는다:

$$
\begin{bmatrix} 1 & 2 & 3 \\ 4 & 5 & 6 \\ 7 & 8 & 9 \end{bmatrix}^T = \begin{bmatrix} 1 & 4 & 7 \\ 2 & 5 & 8 \\ 3 & 6 & 9 \end{bmatrix}
$$

첫 번째 행 $[1\ 2\ 3]$ 이 그대로 첫 번째 열로 서는 셈. 자주 쓰는 성질들:

1. $(A^T)^T = A$
2. $(A+B)^T = A^T + B^T$
3. $(AB)^T = B^T A^T$  (순서가 뒤집힌다, 주의)
4. $(cA)^T = cA^T$
5. $\det(A^T) = \det(A)$
6. $(A^T)^{-1} = (A^{-1})^T$

---

## 3. 내적(Dot product)과 노름(Norm)
내적은 두 벡터가 얼마나 같은 방향을 보는지에 대한 값: $a^T b = \|a\|\,\|b\|\cos\theta$

**방향에 따라 내적이 어떻게 변하나:** 핵심은 $\cos\theta$ 다.

![방향에 따른 내적 변화](/images/study/linear-algebra-00-basics/03-dot-direction.png)
*같은 방향이면 최대(5), 수직이면 0, 반대면 음수(−5).*

- **같은 방향** ($\theta = 0^\circ$, $\cos\theta = 1$): 내적이 **최대**.
- **비스듬하게** 걸칠수록 값이 줄어든다.
- **수직** ($\theta = 90^\circ$, $\cos\theta = 0$): 내적 **= 0** (직교).
- **반대 방향** ($\theta = 180^\circ$, $\cos\theta = -1$): 내적이 **음수로 최대**.

즉 내적은 "두 벡터가 얼마나 같은 쪽을 보는가"를 부호까지 담아 하나의 숫자로 알려준다.

여기서 크기(길이)를 재는 게 노름이다.

- **2-norm (유클리드):** $\|x\|_2 = \sqrt{x^T x}$
- **1-norm:** 성분 절댓값의 합 $\sum |x_i|$
- **p-norm:** $\|x\|_p = \left(\sum |x_i|^p\right)^{1/p}$
- **∞-norm:** $\|x\|_\infty = \max_i |x_i|$

**노름의 기하학적 의미 (단위원):** "노름 = 1인 점들"을 그려보면 노름마다 모양이 다르다.

- **2-norm:** $x^2 + y^2 = 1$, 즉 우리가 아는 **원**.
- **1-norm:** $|x| + |y| = 1$ → 45° 기울어진 **마름모**.
- **∞-norm:** $\max(|x|, |y|) = 1$ → 변이 축에 나란한 **정사각형**.

여기서 두 가지 "크기 순서"를 구별해야 한다. 둘은 서로 정반대다.

**① 노름 값의 크기** — 벡터 하나를 고정하고 계산하면: $\|x\|_1 \ge \|x\|_2 \ge \|x\|_\infty$. 예) $x = [1,\ 1]$ → 1-norm $= 2$, 2-norm $= \sqrt{2} \approx 1.41$, ∞-norm $= 1$.

**② 단위공(도형)의 크기** — ∞-norm(정사각형) > 2-norm(원) > 1-norm(마름모). 정사각형이 원을, 원이 마름모를 감싼다.

![노름별 단위원(단위공)](/images/study/linear-algebra-00-basics/04-norm-unit-balls.png)
*정사각형(∞)이 원(2)을, 원이 마름모(1)를 감싼다.*

### 정사영(projection): 벡터를 다른 벡터 위로 내리기

![벡터 a를 b 위로 정사영](/images/study/linear-algebra-00-basics/05-projection.png)
*오차 (a − proj)가 b와 직교하는 게 핵심 — 최소제곱법의 뿌리.*

목표는 $a = \begin{bmatrix} 1 \\ 3 \end{bmatrix}$ 를 $b = \begin{bmatrix} 5 \\ 1 \end{bmatrix}$ 방향 위로 내린 그림자(정사영 벡터)를 구하는 것. **(정사영된 길이) × (b 방향 단위벡터)** 로 분해하면 쉽다.

- **단위벡터:** $\hat{a} = \dfrac{a}{\|a\|} = \dfrac{a}{\sqrt{a^T a}}$ 이고, $b$ 방향 단위벡터는 $\dfrac{b}{\sqrt{b^T b}}$.
- **정사영된 길이(스칼라):** $\dfrac{a^T b}{\sqrt{b^T b}}$.
- 둘을 곱하면: $\dfrac{a^T b}{\sqrt{b^T b}} \times \dfrac{b}{\sqrt{b^T b}} = \dfrac{a^T b}{b^T b}\, b$.

같은 결과를 **직교 조건**으로도 유도할 수 있다. 정사영 벡터를 $b\hat{x}$ 라 두면, 오차 $(a - b\hat{x})$ 가 $b$ 와 직교해야 하므로:

$$
(a - b\hat{x})^T b = 0 \;\Rightarrow\; a^T b - b^T b\,\hat{x} = 0 \;\Rightarrow\; \hat{x} = \dfrac{a^T b}{b^T b}
$$

숫자로 넣어보면 $a^T b = 1\cdot 5 + 3\cdot 1 = 8$, $b^T b = 5^2 + 1^2 = 26$ 이므로 정사영 벡터는 $\dfrac{8}{26}\begin{bmatrix} 5 \\ 1 \end{bmatrix}$. 이 직교 조건이 바로 최소제곱법(least squares)의 뿌리다.

---

## 4. 행렬 곱을 보는 4가지 관점
같은 $AB$ 라도 **무엇을 기본 단위로 보느냐**에 따라 관점이 넷으로 갈린다. 결과는 전부 같다. 예: $A = \begin{bmatrix} 1 & 2 \\ 3 & 4 \end{bmatrix}$, $B = \begin{bmatrix} 5 & 6 \\ 7 & 8 \end{bmatrix}$ → $AB = \begin{bmatrix} 19 & 22 \\ 43 & 50 \end{bmatrix}$.

![행렬 곱을 보는 4가지 관점](/images/study/linear-algebra-00-basics/06-matmul-4views.png)
*내적 / rank-1 합 / 열 섞기 / 행 섞기 — 기본 단위만 다르고 결과는 같다.*

### ① 내적으로 보기
결과의 $(i,j)$ 칸 = $A$ 의 $i$행과 $B$ 의 $j$열의 내적. 예) $(1,1)$ 칸 $= [1\ 2]\cdot[5\ 7] = 5 + 14 = 19$. 학교에서 배운 방법.

### ② rank-1 행렬의 합
$A$ 의 열 하나 × $B$ 의 행 하나(세로×가로)를 여러 개 더한다: $AB = a_1 b_1^T + a_2 b_2^T + \cdots$

$a_1 b_1^T = \begin{bmatrix} 1 \\ 3 \end{bmatrix}[5\ 6] = \begin{bmatrix} 5 & 6 \\ 15 & 18 \end{bmatrix}$, $a_2 b_2^T = \begin{bmatrix} 2 \\ 4 \end{bmatrix}[7\ 8] = \begin{bmatrix} 14 & 16 \\ 28 & 32 \end{bmatrix}$ → 더하면 $\begin{bmatrix} 19 & 22 \\ 43 & 50 \end{bmatrix}$. 각 "세로×가로"가 선 하나 방향만 만드는 **rank-1 행렬**이다.

### ③ column space로 보기
$Ax = a_1 x_1 + a_2 x_2 + a_3 x_3$ — $x$ 는 "각 열을 얼마씩 섞을까"를 정하는 비율일 뿐이다. 그래서 $Ax$ 의 결과는 항상 $A$ 열들이 만드는 공간(column space) 안에만 있다. 예로 $\begin{bmatrix} 1 & 0 & 1 \\ 0 & 1 & 1 \\ 0 & 0 & 0 \end{bmatrix}$ 는 열이 셋 다 세 번째 성분이 0 → 아무리 섞어도 $z=0$ 평면을 못 벗어난다. 그래서 3×3인데도 결과는 **2차원 평면뿐**.

### ④ row space로 보기
③을 뒤집은 것. 왼쪽에서 행벡터를 곱하면 $x^T A = x_1 a_1^T + x_2 a_2^T + x_3 a_3^T$ 로 이번엔 $A$ 의 **행들**을 섞는다.

한 줄 정리: **① 칸을 내적으로 채우기, ② rank-1 조각들의 합, ③ 열 섞기 ($Ax$), ④ 행 섞기 ($x^T A$)** — 결과는 같고 기본 단위만 다르다.

---

## 5. 선형결합 · span · basis

### 선형결합(linear combination)
벡터들에 스칼라를 곱해 더한 것: $a_1 v_1 + a_2 v_2 + a_3 v_3$. 계수를 바꿔가며 만들 수 있는 결과 전체가 span이고, 이게 곧 열공간 $C(A) = \text{range}(A)$ 다.

![선형결합과 span](/images/study/linear-algebra-00-basics/07-span.png)
*계수를 바꿔 닿을 수 있는 모든 점 = span = 열공간.*

### span — 벡터들로 닿을 수 있는 모든 영역
- 서로 다른 방향의 2차원 벡터 두 개 → span은 **평면 전체(2차원)**.
- 한 직선 위에 놓인 벡터들 → 그 **직선(1차원)** 밖으로 못 나간다.
- 영벡터들뿐 → 원점 하나(0차원)밖에 못 만든다.

즉 **선형독립인 벡터가 많을수록 span이 더 높은 차원으로 넓어진다.**

### 선형독립 vs 종속
$a_1 v_1 + a_2 v_2 + \cdots = 0$ 을 만족하는 경우가 **모든 계수가 0일 때뿐**이면 **선형독립**, 0이 아닌 조합으로도 0을 만들 수 있으면 **종속**. 예) $-2\begin{bmatrix}1\\1\end{bmatrix} + 1\begin{bmatrix}2\\2\end{bmatrix} = \begin{bmatrix}0\\0\end{bmatrix}$ — 같은 방향이라 새 차원을 못 늘리니 종속.

### basis
그 공간을 이루는 **필수 구성요소** — 서로 겹치지 않는(독립) 최소한의 벡터 집합.
- $\begin{bmatrix}1\\0\end{bmatrix}, \begin{bmatrix}0\\1\end{bmatrix}$ → 독립이라 2차원 전체를 덮는 **정상 basis** ✅
- $\begin{bmatrix}1\\0\end{bmatrix}, \begin{bmatrix}2\\0\end{bmatrix}$ → 둘 다 $x$축 위(종속) → basis ❌

---

## 6. 특수한 행렬들

### 항등행렬 (identity matrix)
대각선이 전부 1이고 나머지는 0인 정사각행렬. $I_2 = \begin{bmatrix} 1 & 0 \\ 0 & 1 \end{bmatrix}$, $I_3 = \begin{bmatrix} 1 & 0 & 0 \\ 0 & 1 & 0 \\ 0 & 0 & 1 \end{bmatrix}$. 곱셈에서 **1** 역할: $AI = A$, $IA = A$.

### 역행렬 (inverse matrix)
$AA^{-1} = A^{-1}A = I$ 를 만족하는 행렬. 단, **정사각행렬에서만 정의되고 항상 존재하는 것도 아니다**(행렬식이 0이면 없음). 스칼라 $ax = b \Rightarrow x = a^{-1}b$ 처럼, $Ax = b$ 도 양변에 $A^{-1}$ 을 곱하면:

$$
A^{-1}Ax = A^{-1}b \;\Rightarrow\; Ix = A^{-1}b \;\Rightarrow\; x = A^{-1}b
$$

### 대각행렬 (diagonal matrix)
대각 성분 말고는 전부 0. $\text{diag}(\cdot)$ 표기는 방향에 따라 두 가지로 쓰인다:

- **벡터 → 대각행렬:** $\text{diag}\!\left(\begin{bmatrix} a_1 \\ a_2 \\ a_3 \end{bmatrix}\right) = \begin{bmatrix} a_1 & 0 & 0 \\ 0 & a_2 & 0 \\ 0 & 0 & a_3 \end{bmatrix}$
- **행렬 → 대각 성분 뽑기:** $\text{diag}\!\left(\begin{bmatrix} 1 & 2 & 3 \\ 4 & 5 & 6 \\ 7 & 8 & 9 \end{bmatrix}\right) = \begin{bmatrix} 1 \\ 5 \\ 9 \end{bmatrix}$
- **직사각 대각행렬:** 정사각이 아니어도 대각 위치에만 값이 있으면 된다.

### 직교행렬 (orthogonal matrix)
이름은 "직교"지만 정확히는 **열들이 orthonormal** — 서로 직교하고 각각 길이가 1 — 인 정사각행렬이다. 그러면 $Q^T Q = I$ 가 되어 $Q^T = Q^{-1}$, 즉 **전치가 곧 역행렬**이다. 역행렬 계산은 원래 비싼데 직교행렬은 전치만 하면 되니 회전변환·QR분해 등에서 자주 쓰인다. 예로 90° 회전행렬 $Q = \begin{bmatrix} 0 & -1 \\ 1 & 0 \end{bmatrix}$ 은 두 열이 서로 직교하고 길이 1이라 $Q^T Q = \begin{bmatrix} 1 & 0 \\ 0 & 1 \end{bmatrix} = I$.

---

## 7. rank
행렬이 가진 **독립인 행(또는 열)의 수**. 그리고 $\text{rank}(A) = \text{rank}(A^T)$ — 행으로 세든 열로 세든 값이 같다. = 열공간(행공간)의 차원.

- $\begin{bmatrix} 1 & 2 & 3 \\ 0 & 0 & 0 \end{bmatrix}$ → 독립 행 1개 → rank 1
- $\begin{bmatrix} 1 & 0 & 1 \\ 0 & 1 & 1 \end{bmatrix}$ → rank 2

$\min(\text{행 수, 열 수})$ 만큼 rank가 나오면 **full rank**, 그보다 작으면 **rank-deficient**.

---

## 8. Null space와 네 개의 부분공간

### null space가 뭐냐
$Ax$ 는 A의 열들을 $x$ 의 숫자만큼 섞는 것이다. 그중 **섞었더니 결과가 0이 되는 입력 $x$ 를 전부 모은 게 null space(영공간)** — $Ax = 0$ 을 만족하는 $x$ 의 집합이다.

### 예시로 직접 풀어보기
$A = \begin{bmatrix} 1 & 0 & 1 \\ 0 & 1 & 1 \end{bmatrix}$ 에서 $Ax = 0$ 을 풀면 $x_1 = -x_3,\ x_2 = -x_3$. $x_3$ 에 아무 값이나 넣을 수 있으니 $x = c\begin{bmatrix} 1 \\ 1 \\ -1 \end{bmatrix}$ (검산: 세 열 조합이 0 ✓). 즉 이 A의 null space는 $\begin{bmatrix}1\\1\\-1\end{bmatrix}$ 방향으로 뻗은 원점 지나는 **직선**이다. 자기 자신은 0이 아닌데 A를 통과하면 0으로 사라지는 이런 방향을 "죽는 방향"이라 부르면 감이 잡힌다.

### 죽는 방향이 몇 개? — 차원 공식
$m \times n$ 행렬에서 ($n$ = 열 개수, $r$ = rank):

$$
\dim N(A) = n - r, \qquad \dim N(A) + \underbrace{r}_{\text{rank}} = n
$$

말로 풀면 **열 개수 = (진짜 새 방향을 만드는 열 수 $r$) + (섞으면 0으로 죽는 방향 수 $n-r$)**. 위 예시는 $n=3, r=2$ 라 $\dim N(A) = 1$ → 아까 나온 직선(1차원)과 일치한다. 반대로 $A = \begin{bmatrix} 1 & 0 \\ 0 & 1 \\ 0 & 0 \end{bmatrix}$ 는 죽는 방향이 없어서 null space가 원점 $\{0\}$ 뿐 → $\dim N(A) = 0$.

### null space ⊥ row space, 그리고 네 부분공간
$Ax = 0$ 은 "A의 **각 행**과 $x$ 의 내적이 0"이란 뜻이다. 내적 0 = 수직이니, null space는 **row space 전체와 직교**한다. 행렬 $A$ 는 정의역 $\mathbb{R}^n$ 을 치역 $\mathbb{R}^m$ 으로 보내는 함수인데, 두 세계가 각각 방 두 개로 갈린다:

- **정의역 $\mathbb{R}^n$ (입력):** row space $\mathcal{R}(A)$ (차원 $r$) + null space $\mathcal{N}(A)$ (차원 $n-r$)
- **치역 $\mathbb{R}^m$ (출력):** column space $\mathcal{C}(A)$ (차원 $r$) + left null space $\mathcal{N}(A^T)$ (차원 $m-r$)

**left null space**는 출력 쪽에서 0이 되는 애들이다. $x^T A = 0^T$ (즉 $A^T x = 0$)를 만족하고 $\dim N_L(A) = m - r$.

### 그림으로 보는 흐름: $x = x_p + x_h$

![정의역 → 치역, 네 부분공간의 흐름](/images/study/linear-algebra-00-basics/08-four-subspaces.png)
*입력 x = xₚ(row space) + xₕ(null space). xₕ는 0으로 죽고 xₚ만 b에 도달.*

어떤 입력 $x$ 든 **row space 조각 $x_p$ 와 null space 조각 $x_h$ 로 쪼갤 수 있다**: $x = x_p + x_h$. $A$ 를 통과시키면 조각마다 운명이 갈린다:

- $x_h$ (null space 조각, "죽는 방향") → $Ax_h = 0$. 원점으로 사라진다.
- $x_p$ (row space 조각) → $Ax_p = b$. 실제로 $b$ 를 만드는 건 이 조각뿐이다.

합치면 $Ax = A(x_p + x_h) = b + 0 = b$. 즉 입력에 null space 조각이 섞여 있어도 그건 0으로 죽어 결과에 영향을 안 주고, row space 조각만 살아남아 $b$ 에 도달한다. null space(죽는 방향)가 있으면 $x_p$ 에 아무 $x_h$ 를 더해도 해라서 **해가 무한**해진다.

---

## 9. $Ax = b$ 의 해는 몇 개?
결국 rank가 다 결정한다.

| 경우 | 조건 | 해의 개수 |
|---|---|---|
| Full column rank | $r = n$ | 0개 또는 1개 |
| Full row rank | $r = m$ | 항상 존재 (정사각이면 1개, 열이 더 많으면 무한) |
| Full rank (정사각) | $r = m = n$ | 정확히 1개, $x = A^{-1}b$ |
| Rank-deficient | $r < \min(m,n)$ | $b \in C(A)$ 면 무한, 아니면 0개 |

기하로 보면: $b$ 가 열공간 $C(A)$ 라는 평면 위에 얹혀 있으면 풀리고, 그 밖으로 삐져나가면 못 푼다.

---

## 10. 연습문제 — 3×3 실수행렬의 rank

> 3×3 실수행렬 $A$ 에 대해
> **(가)** $Ax = b$ 의 해가 존재하는 $b$ 가 무수히 많다.
> **(나)** 어떤 $b$ 에 대해서는 해가 존재하지 않는다.

- **(가)** 해가 되는 $b$ 가 무수히 많다 = 열공간이 최소 1차원 이상 → **rank $\ne 0$**
- **(나)** 안 풀리는 $b$ 가 있다 = 열공간이 $\mathbb{R}^3$ 전체가 아니다 → **rank $\ne 3$**

두 조건을 합치면 **rank는 1 또는 2**. (추가 조건이 없으면 여기서 하나로 못 좁힌다 — 문제에 딸린 벡터 정보가 있으면 그걸로 1인지 2인지 갈린다.)

---

참고자료: [인공지능을 위한 선형대수 강의 플레이리스트](https://youtube.com/playlist?list=PL_iJu012NOxdZDxoGsYidMf2_bERIQaP0)
