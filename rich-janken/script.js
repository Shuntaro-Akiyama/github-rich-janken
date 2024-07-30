// 現在のラウンド数を追跡する変数
let currentRound = 0;
// プレイヤーのスコアを追跡する変数
let playerScore = 0;
// CPUのスコアを追跡する変数
let cpuScore = 0;
// キックまたはセーブの方向の選択肢を定義する配列
const directions = ['左', '左上', '上', '右上', '右', '正面'];
// プレイヤーが選択した方向を保存する変数
let playerDirection = null;
// プレイヤーのターンかどうかを示すフラグ
let isPlayerTurn = false;
// CPUが選択した方向を保存する変数
let cpuDirection = null;
// プレイヤーがキッカーかどうかを示すフラグ
let isPlayerKicker = true;

// キーパーの初期位置を定義するオブジェクト
const initialKeeperPosition = { left: 170, top: 150 };
// ボールの初期位置を定義するオブジェクト
const initialBallPosition = { left: 190, bottom: 40 };
// ボールのサイズを定義するオブジェクト
const ballSize = { width: 20, height: 20 };

// 各方向に対するキーパーとボールの位置を定義するオブジェクト
const positionMap = {
    '正面': { keeper: { left: 0, top: 0 }, ball: { left: 10, top: 40 } },
    '上': { keeper: { left: 0, top: -50 }, ball: { left: 0, top: 150 } },
    '左上': { keeper: { left: -90, top: -50 }, ball: { left: -120, top: 150 } },
    '右上': { keeper: { left: 90, top: -50 }, ball: { left: 120, top: 150 } },
    '左': { keeper: { left: -120, top: 0 }, ball: { left: -120, top: 40 } },
    '右': { keeper: { left: 120, top: 0 }, ball: { left: 120, top: 40 } }
};

// ゲームを開始する関数
function startGame() {
    // ラウンド数、スコア、プレイヤーの役割をリセット
    currentRound = 0;
    playerScore = 0;
    cpuScore = 0;
    isPlayerKicker = true;
    // スコア表示を更新
    updateScoreDisplay();
    // キーパーとボールの位置をリセット
    resetPositions();
    // 結果表示をクリア
    document.getElementById('result').textContent = '';
    // リスタートボタンを非表示に
    document.getElementById('restart-button').style.display = 'none';
    // 次のターンを開始
    nextTurn();
}

// 次のターンを処理する関数
function nextTurn() {
    // 10ラウンド終了したらゲーム終了
    if (currentRound >= 10) {
        endGame();
        return;
    }

    // プレイヤーのターンに設定
    isPlayerTurn = true;
    if (isPlayerKicker) {
        // プレイヤーがキッカーの場合、方向選択ボタンを表示
        document.getElementById('direction-buttons').style.display = 'block';
        alert(`ラウンド ${Math.floor(currentRound / 2) + 1}: キックの方向を選んでください`);
    } else {
        // プレイヤーがキーパーの場合、CPUの方向をランダムに選択
        cpuDirection = directions[Math.floor(Math.random() * directions.length)];
        document.getElementById('direction-buttons').style.display = 'block';
        alert(`ラウンド ${Math.floor(currentRound / 2) + 1}: キーパーの方向を選んでください`);
    }
}

// プレイヤーが方向を選択したときに呼び出される関数
function selectDirection(direction) {
    // プレイヤーのターンでなければ何もしない
    if (!isPlayerTurn) return;
    // プレイヤーの選択した方向を保存
    playerDirection = direction;
    // 方向選択ボタンを非表示に
    document.getElementById('direction-buttons').style.display = 'none';
    // ターンの処理を開始
    processTurn();
}

// ターンの処理を行う関数
function processTurn() {
    // プレイヤーのターンを終了
    isPlayerTurn = false;
    let attackDirection, defenseDirection;
    if (isPlayerKicker) {
        // プレイヤーがキッカーの場合
        attackDirection = playerDirection;
        defenseDirection = directions[Math.floor(Math.random() * directions.length)];
    } else {
        // プレイヤーがキーパーの場合
        attackDirection = cpuDirection;
        defenseDirection = playerDirection;
    }

    // 結果を計算
    const result = calculateResult(attackDirection, defenseDirection);
    // スコアを更新
    updateScore(result.isGoal, isPlayerKicker ? 'player' : 'cpu');
    // ラウンド数を増やす
    currentRound++;

    // ショットのアニメーションを実行
    animateShot(attackDirection, defenseDirection, result);

    // 結果表示と次のターンの準備
    setTimeout(() => {
        let resultText = result.isGoal ? 'ゴール' : (result.isMissed ? '枠外' : 'セーブ');
        alert(`キッカー: ${attackDirection}\nキーパー: ${defenseDirection}\n結果: ${resultText}`);
        resetPositions();
        isPlayerKicker = !isPlayerKicker;
        nextTurn();
    }, 2500);
}

// 結果を計算する関数
function calculateResult(attackDirection, defenseDirection) {
    if (attackDirection === defenseDirection) {
        // 方向が同じ場合はセーブ
        return { isGoal: false, isMissed: false, isSaved: true };
    } else {
        if (Math.random() < 0.75) {
            // 75%の確率でゴール
            return { isGoal: true, isMissed: false, isSaved: false };
        } else {
            // 25%の確率で枠外
            return { isGoal: false, isMissed: true, isSaved: false };
        }
    }
}

// スコアを更新する関数
function updateScore(isGoal, turn) {
    if (turn === 'player') {
        // プレイヤーのターンの場合
        if (isGoal) playerScore++;
        document.getElementById(`player-${Math.floor(currentRound / 2) + 1}`).textContent = isGoal ? '○' : '×';
    } else {
        // CPUのターンの場合
        if (isGoal) cpuScore++;
        document.getElementById(`cpu-${Math.floor(currentRound / 2) + 1}`).textContent = isGoal ? '○' : '×';
    }
}

// スコア表示を更新する関数
function updateScoreDisplay() {
    for (let i = 1; i <= 5; i++) {
        // プレイヤーとCPUのスコア表示をクリア
        document.getElementById(`player-${i}`).textContent = '';
        document.getElementById(`cpu-${i}`).textContent = '';
    }
}

// ショットのアニメーションを実行する関数
function animateShot(attackDirection, defenseDirection, result) {
    const keeper = document.getElementById('keeper');
    const ball = document.getElementById('ball');

    // ボールを表示
    ball.style.display = 'block';

    const keeperPos = positionMap[defenseDirection].keeper;
    let ballPos;
    if (result.isMissed) {
        // 枠外の場合、ボールの位置を固定
        ballPos = { left: 0, top: 200 };
    } else {
        // それ以外の場合、攻撃方向に応じたボールの位置を設定
        ballPos = positionMap[attackDirection].ball;
    }

    // キーパーとボールの位置を更新
    setTimeout(() => {
        keeper.style.left = (initialKeeperPosition.left + keeperPos.left) + 'px';
        keeper.style.top = (initialKeeperPosition.top + keeperPos.top) + 'px';

        ball.style.left = (initialBallPosition.left + ballPos.left) + 'px';
        ball.style.bottom = (initialBallPosition.bottom + ballPos.top) + 'px';

        // セーブの場合、ボールをキーパーの前面に
        if (result.isSaved) {
            ball.style.zIndex = '4';
            keeper.style.zIndex = '3';
        } else {
            ball.style.zIndex = '3';
            keeper.style.zIndex = '4';
        }
    }, 500);
}

// キーパーとボールの位置をリセットする関数
function resetPositions() {
    const keeper = document.getElementById('keeper');
    const ball = document.getElementById('ball');

    keeper.style.left = initialKeeperPosition.left + 'px';
    keeper.style.top = initialKeeperPosition.top + 'px';
    
    ball.style.left = initialBallPosition.left + 'px';
    ball.style.bottom = initialBallPosition.bottom + 'px';
    ball.style.display = 'none';
}

// ゲーム終了時の処理を行う関数
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

// DOMの読み込みが完了したら実行される関数
document.addEventListener('DOMContentLoaded', () => {
    const keeper = document.getElementById('keeper');
    const kicker = document.getElementById('kicker');
    const ball = document.getElementById('ball');

    // キーパー、キッカー、ボールの初期位置を設定
    keeper.style.left = initialKeeperPosition.left + 'px';
    keeper.style.top = initialKeeperPosition.top + 'px';

    kicker.style.left = '170px';
    kicker.style.bottom = '0px';

    ball.style.left = initialBallPosition.left + 'px';
    ball.style.bottom = initialBallPosition.bottom + 'px';

    // ゲームを開始
    startGame();
});