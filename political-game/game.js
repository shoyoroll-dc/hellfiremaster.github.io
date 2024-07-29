class Politician {
  constructor(name, leadership, support, diplomacy, reform, speech, specialAbility, majorEvents) {
      this.name = name;
      this.leadership = leadership;
      this.support = support;
      this.diplomacy = diplomacy;
      this.reform = reform;
      this.speech = speech;
      this.specialAbility = specialAbility;
      this.majorEvents = majorEvents;
  }

  showStats() {
      return `
          리더십: ${this.leadership}<br>
          정치적 지지: ${this.support}<br>
          외교력: ${this.diplomacy}<br>
          개혁 의지: ${this.reform}<br>
          연설 능력: ${this.speech}<br>
          특수 능력: ${this.specialAbility}<br>
          굵직한 사건: ${this.majorEvents.join(', ')}
      `;
  }
}

let politicians = [
  new Politician('노무현', 85, 70, 75, 90, 80, '개혁의 바람', ['탄핵 시도', '한미 FTA']),
  new Politician('박근혜', 70, 60, 65, 80, 60, '유신의 딸', ['세월호 사건', '국정농단 사건']),
  new Politician('문재인', 80, 75, 85, 80, 70, '평화의 사도', ['판문점 회담', '검찰 개혁']),
  new Politician('윤석열', 70, 65, 60, 90, 65, '검찰의 칼', ['대선 승리', '부동산 정책'])
];

let player;
let supportLevel = 50;
let experience = 0;
let level = 1;
let turn = 0;

function choosePolitician(index) {
  player = politicians[index];
  document.getElementById('politician-name').innerText = player.name;
  document.getElementById('politician-stats').innerHTML = player.showStats();
  document.getElementById('intro').style.display = 'none';
  document.getElementById('game').style.display = 'block';
  updateStats();
}

function takeAction(action) {
  turn++;
  let success;
  const randomValue = Math.floor(Math.random() * 20) - 10;
  if (action === 1) {
      success = player.reform + randomValue;
      if (success > 75) {
          supportLevel += 10;
          experience += 10;
          logEvent('경제 개혁이 성공했습니다! 지지도가 10 상승했습니다.');
      } else {
          supportLevel -= 10;
          logEvent('경제 개혁이 실패했습니다. 지지도가 10 하락했습니다.');
      }
  } else if (action === 2) {
      success = player.diplomacy + randomValue;
      if (success > 70) {
          supportLevel += 7;
          experience += 7;
          logEvent('외교 정책이 성공했습니다! 지지도가 7 상승했습니다.');
      } else {
          supportLevel -= 7;
          logEvent('외교 정책이 실패했습니다. 지지도가 7 하락했습니다.');
      }
  } else if (action === 3) {
      success = player.speech + randomValue;
      if (success > 65) {
          supportLevel += 5;
          experience += 5;
          logEvent('연설이 성공했습니다! 지지도가 5 상승했습니다.');
      } else {
          supportLevel -= 5;
          logEvent('연설이 실패했습니다. 지지도가 5 하락했습니다.');
      }
  } else if (action === 4) {
      supportLevel += 15;
      experience += 15;
      logEvent(`${player.name}의 특수 능력인 ${player.specialAbility}를 사용합니다. 지지도가 15 상승했습니다.`);
  }

  // 경험치에 따른 레벨업
  if (experience >= level * 20) {
      level++;
      experience = 0;
      logEvent('레벨 업! 현재 레벨: ' + level);
  }

  // Turn에 따른 굵직한 사건 발생
  if (turn === 3 || turn === 6) {
      const event = player.majorEvents[(turn / 3) - 1];
      logEvent('굵직한 사건 발생: ' + event);
      if (['탄핵 시도', '국정농단 사건', '세월호 사건'].includes(event)) {
          supportLevel -= 20;
          logEvent(event + ' 으로 인해 지지도가 20 하락했습니다.');
      } else if (['한미 FTA', '판문점 회담', '검찰 개혁', '대선 승리', '부동산 정책'].includes(event)) {
          supportLevel += 20;
          logEvent(event + ' 으로 인해 지지도가 20 상승했습니다.');
      }
  }

  updateStats();
  checkGameOver();
}

function logEvent(message) {
  document.getElementById('event-info').innerHTML = message;
}

function updateStats() {
  document.getElementById('support-level').innerText = '현재 지지도: ' + supportLevel;
  document.getElementById('experience-level').innerText = '경험치: ' + experience;
  document.getElementById('player-level').innerText = '레벨: ' + level;
  document.getElementById('turn-info').innerText = '현재 턴: ' + turn;
}

function checkGameOver() {
  if (supportLevel <= 0) {
      logEvent('지지도가 0 이하로 떨어졌습니다. 게임 오버.');
      document.getElementById('game').style.display = 'none';
  } else if (supportLevel >= 100) {
      logEvent('지지도가 100에 도달했습니다. 당신은 성공적인 임기를 마쳤습니다.');
      document.getElementById('game').style.display = 'none';
  }
}

function endGame() {
  logEvent('게임을 종료합니다.');
  document.getElementById('game').style.display = 'none';
}
