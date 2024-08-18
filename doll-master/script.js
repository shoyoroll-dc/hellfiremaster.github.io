// PIXI.js 초기화
let app = new PIXI.Application({
    width: 600,
    height: 400,
    backgroundColor: 0x1099bb
  });
  document.getElementById('game-container').appendChild(app.view);
  
  // Claw, Toys, 그리고 Container 객체
  let claw, clawContainer, toys = [];
  let isMoving = false;
  let targetX = null;
  let collectedToysSet = new Set(); // 중복을 허용하지 않는 Set
  
  // 이모티콘 목록
  let emojiList = ["🎁", "🐻", "🐸", "🦄", "🐙"]; 
  
  // Claw Machine 초기 위치 설정
  function initGame() {
    clawContainer = new PIXI.Container();
    app.stage.addChild(clawContainer);
  
    claw = new PIXI.Graphics();
    claw.beginFill(0xff0000);
    claw.drawRect(-25, 0, 50, 10);
    claw.endFill();
    claw.y = 0;
    claw.x = app.screen.width / 2;
  
    clawContainer.addChild(claw);
  
    // 인형(이모티콘)들 배치
    for (let i = 0; i < emojiList.length; i++) {
        let toy = new PIXI.Text(emojiList[i], { fontFamily: 'Arial', fontSize: 48 });
        toy.x = 100 + i * 100;
        toy.y = 300;
        toy.anchor.set(0.5);
        toy.interactive = true;
        toy.buttonMode = true;
        toys.push(toy);
        app.stage.addChild(toy);
    }
  }
  
  // 마우스 클릭 이벤트 처리
  app.view.addEventListener('click', onClawMove);
  
  
  function onClawMove(event) {
    if (isMoving) return; // 클로우가 움직이는 동안 다른 동작을 막음
  
    // 클릭한 x 위치로 이동
    targetX = event.clientX - app.view.getBoundingClientRect().left;
    isMoving = true; // 움직임을 시작했음을 표시
  
    // 클로우가 목표 위치로 이동하도록 애니메이션
    app.ticker.add(moveClaw);
  }
  
  // 클로우 이동 함수
  function moveClaw(delta) {
    if (!isMoving || targetX === null) return;
  
    const speed = 5;
    if (Math.abs(claw.x - targetX) < speed) {
        claw.x = targetX;
        app.ticker.remove(moveClaw);
        dropClaw();
    } else {
        claw.x += claw.x < targetX ? speed : -speed;
    }
  }
  
  // 클로우 내려오기 및 인형 픽업
  function dropClaw() {
    const dropSpeed = 5;
    let originalY = claw.y;
  
    let dropTicker = app.ticker.add(() => {
        claw.y += dropSpeed;
        if (claw.y >= 300) { // 인형들이 있는 위치까지 내려옴
            app.ticker.remove(dropTicker);
            pickupToy();
            let raiseTicker = app.ticker.add(() => {
                claw.y -= dropSpeed;
                if (claw.y <= originalY) {
                    app.ticker.remove(raiseTicker);
                    resetClawPosition(); // 클로우 위치 초기화
                    isMoving = false; // 클로우가 원래 위치로 돌아온 후에야 다시 움직일 수 있음
                }
            });
        }
    });
  }
  
  // 인형 픽업 및 수집
  function pickupToy() {
    for (let toy of toys) {
        if (hitTestRectangle(claw, toy)) {
            collectToy(toy);
            break;
        }
    }
  }
  
  // 충돌 검사 함수
  function hitTestRectangle(r1, r2) {
    const r1Bounds = r1.getBounds();
    const r2Bounds = r2.getBounds();
    return r1Bounds.x + r1Bounds.width > r2Bounds.x &&
        r1Bounds.x < r2Bounds.x + r2Bounds.width &&
        r1Bounds.y + r1Bounds.height > r2Bounds.y &&
        r1Bounds.y < r2Bounds.y + r2Bounds.height;
  }
  
  // 인형 수집 함수
  function collectToy(toy) {
    if (!collectedToysSet.has(toy.text)) {
        collectedToysSet.add(toy.text);
  
        const toyElement = document.createElement('div');
        toyElement.classList.add('toy');
        toyElement.innerText = toy.text;
  
        const collectedToysContainer = document.getElementById('collected-toys');
        collectedToysContainer.appendChild(toyElement);
    }
  
    toy.visible = false;
  }
  
  // 클로우 위치 초기화 함수
  function resetClawPosition() {
    claw.x = app.screen.width / 2; // 초기 위치로 클로우를 이동
  }
  
  // 게임 초기화
  initGame();
  