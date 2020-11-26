let gameDiv = document.getElementById('game-div');
let field = document.getElementById('field');
let myClickedArr = []; // ходы пользователя
let compClicked = []; // ходы компа
let accessMoves = ['0','1','2','3','4','5','6','7','8'];
let isEnded = false;
let winningCombination = [];
function handleClick (event) {
    let target = event.target; 
    let targetDataset = target.dataset.x;
    if (target.tagName !== 'TD') {
        return;
    }
    if (isEnded) {
        alert('Начните новую игру');
        return;
    }
    if (!myClickedArr.includes(targetDataset)) {
        let index = accessMoves.indexOf(target.dataset.x);
        if (accessMoves.indexOf(target.dataset.x) === -1) {
            return
        }
        myClickedArr.push(accessMoves.splice(index, 1)[0]);
        target.innerHTML = '<img src="src/krest.png">';
        checkMove(myClickedArr.length);
        if (isEnded) {
            return;
        }
        compMove();
        checkMove(myClickedArr.length);
        return;
    }
};
function newGame () {
    gameDiv.innerHTML = field.innerHTML.replace('<table>', '<table id="field">'); 
    myClickedArr = [];
    compClicked = [];
    winningCombination = [];
    accessMoves = ['0','1','2','3','4','5','6','7','8'];
    isEnded = false;
}
function compMove () {
    let index = Math.round(Math.random()*accessMoves.length);
    let numb = accessMoves[index];
    while(!numb) {
        index = Math.round(Math.random()*accessMoves.length);
        numb = accessMoves[index];
    }
    compClicked.push(accessMoves.splice(index, 1)[0]);
    document.getElementsByTagName('td')[numb].innerHTML = '<img src="src/nolik.png">';
}
function blind () {
    if (isEnded) {
        for (let i = 0; i < winningCombination.length; i++) {
            if (document.getElementsByTagName('td')[winningCombination[i]].style.backgroundColor == 'rgb(196, 196, 196)') {
                document.getElementsByTagName('td')[winningCombination[i]].style.backgroundColor = 'white';
            } else {
                document.getElementsByTagName('td')[winningCombination[i]].style.backgroundColor = '#c4c4c4';
            }
        }
        setTimeout(blind, 700);
    }
}
function gameOver(isWinner) {
    setTimeout(blind, 0);
    let newGameBtn = document.createElement('button');
    let winner = document.createElement('div');
    if (isWinner) {
        winner.innerHTML = 'Вы выиграли!'
    }
    else if (isWinner === false) {
        winner.innerHTML = 'Вы проиграли!'
    }
    else {
        winner.innerHTML = 'Ничья!'
    }
    newGameBtn.innerHTML = 'Начать новую игру'
    newGameBtn.addEventListener('click', newGame);
    document.querySelector('#game-div').appendChild(newGameBtn);
    document.querySelector('#game-div').appendChild(winner);
}
function checkMove (length) {
    if (length === 5) {
        isEnded = true;
        switch (checkWin()) {
            case true : {
                gameOver(true);
                return;
            }
            case false : {
                gameOver(false);
                return;
            }
            case undefined : {
                gameOver();
                return;
            }
            default : {
                
            }
        }
    }
    if (length >= 3) {
        switch (checkWin()) {
            case true : {
                gameOver(true);
                return;
            }
            case false : {
                gameOver(false);
                return;
            }
        }
    }
}
function checkWin () {
    if (myClickedArr.includes('0') && myClickedArr.includes('1') && myClickedArr.includes('2')) {
        isEnded = true;
        winningCombination = ['0', '1', '2'];
        return true;
    }
    if (myClickedArr.includes('3') && myClickedArr.includes('4') && myClickedArr.includes('5')) {
        isEnded = true;
        winningCombination = ['3', '4', '5'];
        return true;
    }
    if (myClickedArr.includes('6') && myClickedArr.includes('7') && myClickedArr.includes('8')) {
        isEnded = true;
        winningCombination = ['6', '7', '8'];
        return true;
    }
    if (myClickedArr.includes('0') && myClickedArr.includes('3') && myClickedArr.includes('6')) {
        isEnded = true;
        winningCombination = ['3', '0', '6'];
        return true;
    }
    if (myClickedArr.includes('1') && myClickedArr.includes('4') && myClickedArr.includes('7')) {
        isEnded = true;
        winningCombination = ['1', '4', '7'];
        return true;
    }
    if (myClickedArr.includes('2') && myClickedArr.includes('5') && myClickedArr.includes('8')) {
        isEnded = true;
        winningCombination = ['2', '8', '5'];
        return true;
    }
    if (myClickedArr.includes('0') && myClickedArr.includes('4') && myClickedArr.includes('8')) {
        isEnded = true;
        winningCombination = ['0', '4', '8'];
        return true;
    }
    if (myClickedArr.includes('2') && myClickedArr.includes('4') && myClickedArr.includes('6')) {
        isEnded = true;
        winningCombination = ['2', '4', '6'];
        return true;
    }

    if (compClicked.includes('0') && compClicked.includes('1') && compClicked.includes('2')) {
        isEnded = true;
        winningCombination = ['0', '1', '2'];
        return false;
    }
    if (compClicked.includes('3') && compClicked.includes('4') && compClicked.includes('5')) {
        isEnded = true;
        winningCombination = ['3', '4', '5'];
        return false;
    }
    if (compClicked.includes('6') && compClicked.includes('7') && compClicked.includes('8')) {
        isEnded = true;
        winningCombination = ['6', '7', '8'];
        return false;
    }
    if (compClicked.includes('0') && compClicked.includes('3') && compClicked.includes('6')) {
        isEnded = true;
        winningCombination = ['3', '0', '6'];
        return false;
    }
    if (compClicked.includes('1') && compClicked.includes('4') && compClicked.includes('7')) {
        isEnded = true;
        winningCombination = ['1', '4', '7'];
        return false;
    }
    if (compClicked.includes('2') && compClicked.includes('5') && compClicked.includes('8')) {
        isEnded = true;
        winningCombination = ['2', '8', '5'];
        return false;
    }
    if (compClicked.includes('0') && compClicked.includes('4') && compClicked.includes('8')) {
        isEnded = true;
        winningCombination = ['0', '4', '8'];
        return false;
    }
    if (compClicked.includes('2') && compClicked.includes('4') && compClicked.includes('6')) {
        isEnded = true;
        winningCombination = ['2', '4', '6'];
        return false;
    }
    return;
}
gameDiv.addEventListener('click', handleClick);
newGame(); 




