'use strict'
const MINE = '💣'
const EMPTY = ''
const MARK = '📍'
const life = '❤️'
const BROKENLIFE = '💔'
const NORMAL = '😄'
const LOSE = '🤕'
const win = '🤩'
const USEHELP = '🪫'
const UNUSEHELP = '💡'
const TIMER_INTERVAL = 31
const INITIAL_TIMER_TEXT = '00:00.000'

/////////////////////////////////////////////////////////////////////

////MODAL:
var gTimerIntrval // holds the interval
var gStartTime // holds the curr time
var gStart = 0
var gBoard
var gLife = 3
//LEVELS:
var gLevel1 = {
    size: 4,
    mines: 2
};

var gLevel2 = {
    size: 8,
    mines: 14
};

var gLevel3 = {
    size: 12,
    mines: 32
};

var gGame = {
    isOn: false,
    shownCount: 0,
    markedCount: 0,
    secsPassed: 0
}
var gMarkedMinsCount = 0
var gUseHelp=false
var gUseHelpCount=0
/////////////////////////////////////////////////////////////////////
var gLevel=1
function onInit() {
    clearInterval(gTimerIntrval)
    var elLife = document.querySelector('.life')
    elLife.innerHTML = life + life + life
    var elTimer = document.querySelector('.timer')
    elTimer.innerText = INITIAL_TIMER_TEXT
    gGame.shownCount = 0
    var elshownCount = document.querySelector('.shown-count')
    elshownCount.innerHTML = 0
    gMarkedMinsCount = 0
    var elmarkedCount = document.querySelector('.marked-count')
    elmarkedCount.innerHTML = 0
    gGame.markedCount = 0
    var elRestartBtn = document.querySelector('.restart-btn')
    elRestartBtn.innerHTML = NORMAL
    gStart = 0
    gUseHelpCount=0
    var elUseHlep=document.querySelector('.use-hlep')
    elUseHlep.innerHTML=UNUSEHELP+UNUSEHELP+UNUSEHELP
    gGame.isOn = true
gBoard = selectLevel(gLevel);
    renderBoard(gBoard)

}
////////////////////////////////////////////////////////////////////
function buildBoard(size, minesCount) {
    const board = []
    for (var i = 0; i < size; i++) {
        board[i] = []
        for (var j = 0; j < size; j++) {
            board[i][j] = {
                minesAroundCount: 0,
                isShown: false,
                isMin: false,
                isMarked: false
            }
        }
    }
    if (gStart === 0) {
        randPosMin(board, minesCount)
        setMinesNegsCount(board)
        gStart++
    }

    return board
}

//////////////////////////////////////////////////////////////////////

function renderBoard(board) {
    var elBoard = document.querySelector('.board')
    elBoard.style.gridTemplateColumns = `repeat(${board.length}, 80px)`
    elBoard.style.gridTemplateRows = `repeat(${board.length}, 80px)`

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
    
   if(gUseHelp) {
    gUseHelpCount++
    useHelp(i,j)
gGame.shownCount--
var elshownCount = document.querySelector('.shown-count')
elshownCount.innerHTML = gGame.shownCount
}
    const cell = gBoard[i][j]
    if (cell.isMin) {
        alert('YOU BLEW UP')
        gLife--
        if (gLife === 2) {
            var elLife = document.querySelector('.life')
            elLife.innerHTML = life + life + BROKENLIFE
        }
        if (gLife === 1) {
            var elLife = document.querySelector('.life')
            elLife.innerHTML = life + BROKENLIFE + BROKENLIFE

        }


        if (gLife === 0) {
            var elRestartBtn = document.querySelector('.restart-btn')
            elRestartBtn.innerHTML = LOSE

            clearInterval(gTimerIntrval)
            for (var x = 0; x < gBoard.length; x++) {
                for (var y = 0; y < gBoard[0].length; y++) {
                    if (gBoard[x][y].isMin) {
                        gBoard[x][y].isShown = true
                    }
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
        var elshownCount = document.querySelector('.shown-count')
        elshownCount.innerHTML = gGame.shownCount
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
    var elmarkedCount = document.querySelector('.marked-count')
    elmarkedCount.innerHTML = gGame.markedCount

    checkGameOver(i, j)
    renderBoard(gBoard)
}

////////////////////////////////////////////////////////////////////////////////
function checkGameOver(i, j) {
    if (gBoard[i][j].isMarked && gBoard[i][j].isMin) {
        gMarkedMinsCount++
    }
    if (gMarkedMinsCount === gBoard.mines) {
        gGame.isOn = false
        console.log('win')
        alert('YOU WIN!!')

        var elRestartBtn = document.querySelector('.restart-btn')
        elRestartBtn.innerHTML = win

        clearInterval(gTimerIntrval)
        return
    }
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[0].length; j++) {
            if (gGame.shownCount === gBoard.length * gBoard.length - gLevel1.mines) {
                console.log('win')
                alert('YOU WIN!!')
                var elRestartBtn = document.querySelector('.restart-btn')
                elRestartBtn.innerHTML = win
                clearInterval(gTimerIntrval)
            }
        }
    }
    
}

// ///////////////////////////////////////////////////////////////////
function expandShown(board, i, j) {

    if (board[i][j].minesAroundCount === 0) {
        board[i][j].isShown = true
        for (var x = i - 1; x <= i + 1; x++) {
            for (var y = j - 1; y <= j + 1; y++) {
                if (x < 0 || x >= board.length || y < 0 || y >= board[x].length) continue;
                if (!board[x][y].isShown) {
                    if (board[x][y].minesAroundCount === 0) {
                        board[i][j].isShown = true
                        gGame.shownCount++
                        var elshownCount = document.querySelector('.shown-count')
                        elshownCount.innerHTML = gGame.shownCount

                        console.log(gGame.shownCount)

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
    const size = board.length
    if (size === 0) return
    while (randPosMin < minesCount) {
        const i = getRandomInt(0,size)
        const j = getRandomInt(0,size)
        if (!board[i][j].isMin) {
            board[i][j].isMin = true
            randPosMin++
        }
    }
}
/////////////////////////////////////////////////////////////////////
function startTimer() {

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


function restartBtn() {
    onInit()
}
/////////////////////////////////////////////////////////////////////
function getRandomInt(min, max) {
    const minCeiled = Math.ceil(min);
    const maxFloored = Math.floor(max);
    return Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled); // The maximum is exclusive and the minimum is inclusive
}
/////////////////////////////////////////////////////////////////////

//BONUS:

function useHelp(i, j) {
    if(gUseHelp>3)return
if(gUseHelpCount===1){
    var elUseHlep=document.querySelector('.use-hlep')
    elUseHlep.innerHTML=UNUSEHELP+UNUSEHELP+USEHELP
}
if(gUseHelpCount===2){
    var elUseHlep=document.querySelector('.use-hlep')
    elUseHlep.innerHTML=UNUSEHELP+USEHELP+USEHELP
}
if(gUseHelpCount===3){
    var elUseHlep=document.querySelector('.use-hlep')
    elUseHlep.innerHTML=USEHELP+USEHELP+USEHELP
}
    gUseHelp=true
var helpNeighbor=[]
    for (var x = i - 1; x <= i + 1; x++) {
        for (var y = j - 1; y <= j + 1; y++) {
            if (x >= 0 && x < gBoard.length && y >= 0 && y < gBoard[0].length&&!gBoard[x][y].isShown) {
                        gBoard[x][y].isShown = true
                        helpNeighbor.push({x,y})
                    }
                }
            }
            renderBoard(gBoard)
            setTimeout(() => {
                helpNeighbor.forEach(({x,y})=>(gBoard[x][y].isShown=false))
                renderBoard(gBoard)
                gUseHelp=false
            }, 1500)
            
            
}
/////////////////////////////////////////////////////////////////////

function setLevel(level) {
    gLevel = level
    onInit()
}
/////////////////////////////////////////////////////////////////////

function selectLevel(level) {
    switch(level) {
        case 1:
            gLevel=1
            return buildBoard(gLevel1.size, gLevel1.mines)
        case 2:
            gLevel=2
            return buildBoard(gLevel2.size, gLevel2.mines)
        case 3:
            gLevel=3
            return buildBoard(gLevel3.size, gLevel3.mines)
        default:
            console.error('Invalid level:', level)
            return []
    }
}



