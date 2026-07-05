---
title: "Git 다운로드"
date: "2026.06.23"
category: "기타"
series: "깃허브 사용법"
seriesOrder: 1
tags: ["Git", "GitHub", "VSCode", "환경설정"]
summary: "버전관리가 왜 필요한지부터 Windows에서 Git + VSCode 설치까지."
notionUrl: "https://app.notion.com/p/38807509803280b49ac4dd8ba424b572"
---

## Git이 필요한 이유

코딩을 할 때 작성한 코드가 날아가지 않도록 꾸준히 저장하고 관리하는 작업이 필요합니다.
그러나 하나의 파일에 대해 수정본, 찐 수정본, 찐찐 수정본 이렇게 정리하면 나중에 버전관리가 힘들고 필요할 때 꺼내볼 때 무엇이 바뀐지 알 수 없습니다.

<div class="img-pair">
  <img src="/images/study/git-download/01-messy-files.png" alt="최종, 진짜최종, 찐최종 파일들" />
  <img src="/images/study/git-download/02-messy-folder.png" alt="수정본이 쌓여 엉망이 된 폴더" />
</div>

그래서 나온 프로그램이 버전관리 프로그램 **git**입니다. 이를 사용하면 위 사진처럼 복잡하게 파일을 저장하지 않고 아래 사진처럼 깔끔하게 정리하고 관리할 수 있습니다.

<div class="img-pair">
  <img src="/images/study/git-download/03-git-clean.png" alt="git으로 깔끔하게 관리되는 파일" />
  <img src="/images/study/git-download/04-git-graph.png" alt="git 버전 그래프" />
</div>

그러면 이제 기본적으로 필요한 소프트웨어를 깔아봅시다.

## VSCode 설치

솔직히 컴공인데 VSCode가 아직까지 안 깔려있다면 전과하라고 하고 싶지만, 가이드니까 간단하게 설명하겠습니다.

1. [code.visualstudio.com/Download](https://code.visualstudio.com/Download)에 접속하셔서 OS에 맞게 설치하면 되겠습니다.

![VSCode 다운로드 페이지](/images/study/git-download/05-vscode-install.png)
*설치 마법사가 나타나면 다음과 같이 체크하셔야 나중에 git 쓰실 때 편하고 좋습니다.*

2. 나머지 세팅은 설명하기 귀찮으니까 유튜브에 쳐서 "VSCode 기본 세팅방법"을 찾아보는 걸 추천드립니다.

## Git 설치하는 방법 💻

### Windows

[git-scm.com/install/windows](https://git-scm.com/install/windows)에 접속하여 **Click here to download**를 클릭하면 파일이 설치됩니다.

![git-scm 다운로드 페이지](/images/study/git-download/06-git-scm-download.png)

이후 NEXT 하다 보면 에디터를 선택하라는 창이 뜰 텐데, 여기서 기본 설정 말고 **VSCode로 바꿔줍시다**.

![기본 에디터를 VSCode로 변경](/images/study/git-download/07-git-editor-vscode.png)
*그 다음 나오는 초기 브랜치 이름을 묻는 창에서는 두 번째 옵션(main)으로 설정하면 됩니다. 이후 연동할 깃허브의 초기 조건이라서 그렇습니다.*

그 이후 나오는 건 기본 세팅대로 NEXT 해서 깔면 설치 완료입니다.

### Mac

> (작성 예정)
