'use strict'
const MINE = '💣'
const EMPTY = ''
const MARK = '📍'
/////////////////////////////////////////////////////////////////////
////MODAL:
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
    gGame.isOn = true
    gBoard = buildBoard()
    renderBoard(gBoard)
    randPosMin(gBoard, gLevel1.mines)
    setMinesNegsCount(gBoard)
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
    const cell = gBoard[i][j]
    if (cell.isMin) {
        alert('you losed')
        for (var i = 0; i < gBoard.length; i++) {
            for (var j = 0; j < gBoard[0].length; j++) {
                if (gBoard[i][j].isMin) {
                    gBoard[i][j].isShown = true
                }
            }
        }
    }
    else {
        cell.isShown = true
        gGame.shownCount++
    }

    renderBoard(gBoard)
    checkGameOver(i, j)


}
////////////////////////////////////////////////////////////////////////////////


function onCellMarked(event, i, j) {
    event.preventDefault()
    const cell = gBoard[i][j]
    cell.isMarked = true
    gGame.markedCount++
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
        return
    }
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[0].length; j++) {
            if (gGame.shownCount === gBoard.length * gBoard.length - 1) {
                console.log('win');
            }
        }
    }
}

///////////////////////////////////////////////////////////////////
function expandShown(board, elCELL, i, j) {

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
function getRandomInt(min, max) {
    const minCeiled = Math.ceil(min);
    const maxFloored = Math.floor(max);
    return Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled); // The maximum is exclusive and the minimum is inclusive
}

