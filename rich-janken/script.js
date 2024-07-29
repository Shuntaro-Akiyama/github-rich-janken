let currentRound = 0;
let playerScore = 0;
let cpuScore = 0;
const directions = ['左', '左上', '上', '右上', '右', '正面'];
let playerDirection = null;
let isPlayerTurn = false;
let cpuDirection = null;
let isPlayerKicker = true;

const initialKeeperPosition = { left: 170, top: 150 };
const initialBallPosition = { left: 190, bottom: 40 };
const ballSize = { width: 20, height: 20 };

const positionMap = {
    '正面': { keeper: { left: 0, top: 0 }, ball: { left: 10, top: 40 } },
    '上': { keeper: { left: 0, top: -50 }, ball: { left: 0, top: 150 } },
    '左上': { keeper: { left: -90, top: -50 }, ball: { left: -120, top: 150 } },
    '右上': { keeper: { left: 90, top: -50 }, ball: { left: 120, top: 150 } },
    '左': { keeper: { left: -120, top: 0 }, ball: { left: -120, top: 40 } },
    '右': { keeper: { left: 120, top: 0 }, ball: { left: 120, top: 40 } }
};

function startGame() {
    currentRound = 0;
    playerScore = 0;
    cpuScore = 0;
    isPlayerKicker = true;
    updateScoreDisplay();
    resetPositions();
    document.getElementById('result').textContent = '';
    document.getElementById('restart-button').style.display = 'none';
    nextTurn();
}

function nextTurn() {
    if (currentRound >= 10) {
        endGame();
        return;
    }

    isPlayerTurn = true;
    if (isPlayerKicker) {
        document.getElementById('direction-buttons').style.display = 'block';
        alert(`ラウンド ${Math.floor(currentRound / 2) + 1}: キックの方向を選んでください`);
    } else {
        cpuDirection = directions[Math.floor(Math.random() * directions.length)];
        document.getElementById('direction-buttons').style.display = 'block';
        alert(`ラウンド ${Math.floor(currentRound / 2) + 1}: キーパーの方向を選んでください`);
    }
}

function selectDirection(direction) {
    if (!isPlayerTurn) return;
    playerDirection = direction;
    document.getElementById('direction-buttons').style.display = 'none';
    processTurn();
}

function processTurn() {
    isPlayerTurn = false;
    let attackDirection, defenseDirection;
    if (isPlayerKicker) {
        attackDirection = playerDirection;
        defenseDirection = directions[Math.floor(Math.random() * directions.length)];
    } else {
        attackDirection = cpuDirection;
        defenseDirection = playerDirection;
    }

    const result = calculateResult(attackDirection, defenseDirection);
    updateScore(result.isGoal, isPlayerKicker ? 'player' : 'cpu');
    currentRound++;

    animateShot(attackDirection, defenseDirection, result);

    setTimeout(() => {
        let resultText = result.isGoal ? 'ゴール' : (result.isMissed ? '枠外' : 'セーブ');
        alert(`キッカー: ${attackDirection}\nキーパー: ${defenseDirection}\n結果: ${resultText}`);
        resetPositions();
        isPlayerKicker = !isPlayerKicker;
        nextTurn();
    }, 2500);
}

function calculateResult(attackDirection, defenseDirection) {
    if (attackDirection === defenseDirection) {
        return { isGoal: false, isMissed: false, isSaved: true };
    } else {
        if (Math.random() < 0.75) {
            return { isGoal: true, isMissed: false, isSaved: false };
        } else {
            return { isGoal: false, isMissed: true, isSaved: false };
        }
    }
}

function updateScore(isGoal, turn) {
    if (turn === 'player') {
        if (isGoal) playerScore++;
        document.getElementById(`player-${Math.floor(currentRound / 2) + 1}`).textContent = isGoal ? '○' : '×';
    } else {
        if (isGoal) cpuScore++;
        document.getElementById(`cpu-${Math.floor(currentRound / 2) + 1}`).textContent = isGoal ? '○' : '×';
    }
}

function updateScoreDisplay() {
    for (let i = 1; i <= 5; i++) {
        document.getElementById(`player-${i}`).textContent = '';
        document.getElementById(`cpu-${i}`).textContent = '';
    }
}

function animateShot(attackDirection, defenseDirection, result) {
    const keeper = document.getElementById('keeper');
    const ball = document.getElementById('ball');

    ball.style.display = 'block';

    const keeperPos = positionMap[defenseDirection].keeper;
    let ballPos;
    if (result.isMissed) {
        ballPos = { left: 0, top: 200 };
    } else {
        ballPos = positionMap[attackDirection].ball;
    }

    setTimeout(() => {
        keeper.style.left = (initialKeeperPosition.left + keeperPos.left) + 'px';
        keeper.style.top = (initialKeeperPosition.top + keeperPos.top) + 'px';

        ball.style.left = (initialBallPosition.left + ballPos.left) + 'px';
        ball.style.bottom = (initialBallPosition.bottom + ballPos.top) + 'px';

        if (result.isSaved) {
            ball.style.zIndex = '4';
            keeper.style.zIndex = '3';
        } else {
            ball.style.zIndex = '3';
            keeper.style.zIndex = '4';
        }
    }, 500);
}

function resetPositions() {
    const keeper = document.getElementById('keeper');
    const ball = document.getElementById('ball');

    keeper.style.left = initialKeeperPosition.left + 'px';
    keeper.style.top = initialKeeperPosition.top + 'px';
    
    ball.style.left = initialBallPosition.left + 'px';
    ball.style.bottom = initialBallPosition.bottom + 'px';
    ball.style.display = 'none';
}

function endGame() {
    let resultMessage;
    if (playerScore > cpuScore) {
        resultMessage = 'プレイヤーの勝利！';
    } else if (playerScore < cpuScore) {
        resultMessage = 'CPUの勝利！';
    } else {
        resultMessage = '引き分け！';
    }
    document.getElementById('result').textContent = `ゲーム終了 - ${resultMessage}`;
    document.getElementById('direction-buttons').style.display = 'none';
    document.getElementById('restart-button').style.display = 'block';
}

document.addEventListener('DOMContentLoaded', () => {
    const keeper = document.getElementById('keeper');
    const kicker = document.getElementById('kicker');
    const ball = document.getElementById('ball');

    keeper.style.left = initialKeeperPosition.left + 'px';
    keeper.style.top = initialKeeperPosition.top + 'px';

    kicker.style.left = '170px';
    kicker.style.bottom = '0px';

    ball.style.left = initialBallPosition.left + 'px';
    ball.style.bottom = initialBallPosition.bottom + 'px';

    startGame();
});