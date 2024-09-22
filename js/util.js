'use strict'

function createMat(ROWS, COLS) {
    const mat = []
    for (var i = 0; i < ROWS; i++) {
        const row = []
        for (var j = 0; j < COLS; j++) {
            row.push('')
        }
        mat.push(row)
    }
    return mat
}

//////////////////////////////////////////////////////////////////////


function countNeighbors(rowIdx, colIdx, mat) {
    var neighborsCount = 0
    for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
        if (i < 0 || i >= mat.length) continue
        for (var j = colIdx - 1; j <= colIdx + 1; j++) {
            if (j < 0 || j >= mat[i].length) continue
            if (i === rowIdx && j === colIdx) continue
            if (mat[i][j] === LIFE) neighborsCount++
        }
    }
    return neighborsCount
}

////////////////////////////////////////////////////////////////////

function getRandomInt(min, max) {
    const minCeiled = Math.ceil(min);
    const maxFloored = Math.floor(max);
    return Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled); // The maximum is exclusive and the minimum is inclusive
  }
  

  //////////////////////////////////////////////////////////////////

  function getEmptyPos() {
    var emptyPoses = []
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[0].length; j++) {
            var currCell = gBoard[i][j]
            if (!currCell.gameElemnt && currCell.type !== WALL) {
                emptyPoses.push({ i: i, j: j })
            }
        }
    }
    if (!emptyPoses.length) return null
    var randomIdx = getRandomInt(0, emptyPoses.length)

    return emptyPoses[randomIdx]
}
///////////////////////////////////////////////////////////////////////////