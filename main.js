'use strict'
const MINE = '💣'
const EMPTY = ''
const MARK = '📍'


const TIMER_INTERVAL = 31
const INITIAL_TIMER_TEXT = '00:00.000'

/////////////////////////////////////////////////////////////////////

////MODAL:
var gTimerIntrval // holds the interval
var gStartTime // holds the curr time
var gStart=0
var gBoard
var gLevel1 = {
    size: 4,
    mines: 2
}
var gGame = {
    isOn: false,
    shownCount: 0,
    markedCount: 0,
    secsPassed: 0
}
var gMarkedMinsCount = 0
/////////////////////////////////////////////////////////////////////


function onInit() {
    clearInterval(gTimerIntrval)
    
    var elTimer = document.querySelector('.timer')
    elTimer.innerText = INITIAL_TIMER_TEXT
    var elshownCount=document.querySelector('.shown-count')
    elshownCount.innerHTML=0
    gMarkedMinsCount = 0
    var elmarkedCount=document.querySelector('.marked-count')
    elmarkedCount.innerHTML=0
    
    
    gGame.isOn = true
    gBoard = buildBoard()
    renderBoard(gBoard)
    
}
////////////////////////////////////////////////////////////////////
function buildBoard() {
    const ROWS = 4
    const COLS = 4
    const board = []
    for (var i = 0; i < ROWS; i++) {
        board[i] = []
        for (var j = 0; j < COLS; j++) {
            board[i][j] = {
                minesAroundCount: 0,
                isShown: false,
                isMin: false,
                isMarked: false
            }
        }
    }
    return board
}
//////////////////////////////////////////////////////////////////////

function renderBoard(board) {
    var strHtml = ''
    for (var i = 0; i < board.length; i++) {
        strHtml += '<tr>'
        for (var j = 0; j < board[0].length; j++) {
            const currCell = board[i][j]
            var cellClass = getClassName({ i: i, j: j })
            strHtml += `<td class="cell ${cellClass}"onclick="onCellClicked(${i},${j})"oncontextmenu="onCellMarked(event, ${i}, ${j})" >`
            if (currCell.isShown) {
                if (currCell.isMin) {
                    strHtml += MINE
                } else {
                    strHtml += board[i][j].minesAroundCount
                }
            } else if (board[i][j].isMarked) {
                strHtml += MARK
            } else {
                strHtml += EMPTY
            }

            strHtml += '</td>'
        }
        strHtml += '</tr>'
    }
    var elBoard = document.querySelector('.board')
    elBoard.innerHTML = strHtml
}
///////////////////////////////////////////////////////////////////////

function setMinesNegsCount(board) {
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[0].length; j++) {
            board[i][j].minesAroundCount = countNeighbors(i, j, board)

        }
    }
}
////////////////////////////////////////////////////////////////////////////////
function onCellClicked(i, j) {
    if (gStart === 0) {
        randPosMin(gBoard, gLevel1.mines)
        setMinesNegsCount(gBoard)
        gStart++
    }

    const cell = gBoard[i][j]
    if (cell.isMin) {
        console.log('losed');
        clearInterval(gTimerIntrval)
        for (var x = 0; x < gBoard.length; x++) {
            for (var y = 0; y < gBoard[0].length; y++) {
                if (gBoard[x][y].isMin) {
                    gBoard[x][y].isShown = true
                }
            }
        }
    }
    else {
        if (gGame.shownCount === 0) {
            startTimer()
        }
        cell.isShown = true
        gGame.shownCount++
        var elshownCount=document.querySelector('.shown-count')
    elshownCount.innerHTML=gGame.shownCount
        expandShown(gBoard, i, j)
    }
    checkGameOver(i, j)
    renderBoard(gBoard)


}


////////////////////////////////////////////////////////////////////////////////


function onCellMarked(event, i, j) {
    event.preventDefault()
    const cell = gBoard[i][j]
    cell.isMarked = !cell.isMarked
    gGame.markedCount += cell.isMarked ? 1 : -1
    var elmarkedCount=document.querySelector('.marked-count')
    elmarkedCount.innerHTML=gGame.markedCount

    checkGameOver(i, j)
    renderBoard(gBoard)
}

////////////////////////////////////////////////////////////////////////////////
function checkGameOver(i, j) {
    if (gBoard[i][j].isMarked && gBoard[i][j].isMin) {
        gMarkedMinsCount++
    }
    if (gMarkedMinsCount === gLevel1.mines) {
        gGame.isOn = false
        console.log('win');
        clearInterval(gTimerIntrval)
        return
    }
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[0].length; j++) {
            if (gGame.shownCount === gBoard.length * gBoard.length - gLevel1.mines) {
                console.log('win');
                clearInterval(gTimerIntrval)
            }
        }
    }
}

// ///////////////////////////////////////////////////////////////////
function expandShown(board, i, j) {

    if (board[i][j].minesAroundCount === 0) {
        board[i][j].isShown = true;
        for (var x = i - 1; x <= i + 1; x++) {
            for (var y = j - 1; y <= j + 1; y++) {
                if (x < 0 || x >= board.length || y < 0 || y >= board[x].length) continue;
                if (!board[x][y].isShown) {
                    if (board[x][y].minesAroundCount === 0) {
                        board[i][j].isShown = true
                        gGame.shownCount++
                        var elshownCount=document.querySelector('.shown-count')
                        elshownCount.innerHTML=gGame.shownCount
                    
                        console.log(gGame.shownCount);

                        expandShown(board, x, y)
                    }
                }
            }
        }
    }
}




///////////////////////////////////////////////////////////////////
function getClassName(location) {
    const getClassName = `cell-${location.i}-${location.j}`
    return getClassName
}
//////////////////////////////////////////////////////////////////////

function countNeighbors(rowIdx, colIdx, mat) {
    var neighborsCount = 0
    for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
        if (i < 0 || i >= mat.length) continue
        for (var j = colIdx - 1; j <= colIdx + 1; j++) {
            if (j < 0 || j >= mat[i].length) continue
            if (i === rowIdx && j === colIdx) continue
            if (mat[i][j].isMin) neighborsCount++
        }
    }
    return neighborsCount
}
/////////////////////////////////////////////////////////////////////
function randPosMin(board, minesCount) {
    var randPosMin = 0
    while (randPosMin < minesCount) {
        const i = getRandomInt(0, gLevel1.size)
        const j = getRandomInt(0, gLevel1.size)
        if (!board[i][j].isMin) {
            board[i][j].isMin = true
            randPosMin++
        }
    }
}
/////////////////////////////////////////////////////////////////////
function startTimer() {

    console.log('טיימר התחיל');
    gStartTime = Date.now()


    gTimerIntrval = setInterval(() => {


        const delta = Date.now() - gStartTime
        const formattedTime = formatTime(delta)

        const elTimer = document.querySelector('.timer')
        elTimer.innerText = formattedTime

    }, TIMER_INTERVAL)
}

/////////////////////////////////////////////////////////////////////

function formatTime(ms) {
    var minutes = Math.floor(ms / 60000);
    var seconds = Math.floor((ms % 60000) / 1000);
    var milliseconds = ms % 1000


    return `${padTime(minutes)}:${padTime(seconds)}.${padMiliseconds(milliseconds)}`
}

/////////////////////////////////////////////////////////////////////

function padTime(val) {
    return String(val).padStart(2, '0')
}

/////////////////////////////////////////////////////////////////////

function padMiliseconds(ms) {
    return String(ms).padStart(3, '0')
}



/////////////////////////////////////////////////////////////////////
function getRandomInt(min, max) {
    const minCeiled = Math.ceil(min);
    const maxFloored = Math.floor(max);
    return Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled); // The maximum is exclusive and the minimum is inclusive
}

