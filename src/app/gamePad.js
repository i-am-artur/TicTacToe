// import {htmlToElement, addClassToElement, getCssVariable} from './helpers';
import {htmlToElement, addClassToElement} from './helpers';
import {Players} from './players';

// const QUANTITY_ROWS_AND_COLS = getCssVariable('quantityRowsAndColumns');
const QUANTITY_ROWS_AND_COLS = 3;
let model = null;

export function createGamePad(modelArg) {
  model = modelArg;
  let gamepad = buildGamePad();

  let commonData = {
    gameOver: false,
    players: new Players(),
    gamepad: gamepad
  };

  gamepad.addEventListener('click', event => cellCLicked(event, commonData));

  let newGameEvent = () => startNewGame(commonData);
  model.eventBus.subscribe(model.eventBus.channelOptions.newGame, newGameEvent);

  // if(gamepad.innerHTML === '') {
  //   location.reload();
  // }

  return gamepad;
}

function startNewGame(commonData) {
  let playerSymbolsOnBoard = getAllCells(commonData.gamepad, 'player-symbol');
  playerSymbolsOnBoard.forEach(symbol => symbol.remove());

  commonData.gameOver = false;

  let redLines = getAllCells(commonData.gamepad, 'red-line_horizontal');
  redLines.forEach(redLine => redLine.classList.remove('red-line_horizontal'));
  redLines = getAllCells(commonData.gamepad, 'red-line_vertical');
  redLines.forEach(redLine => redLine.classList.remove('red-line_vertical'));
  redLines = getAllCells(commonData.gamepad, 'red-line_topToBottom');
  redLines.forEach(redLine => redLine.classList.remove('red-line_topToBottom'));
  redLines = getAllCells(commonData.gamepad, 'red-line_bottomToTop');
  redLines.forEach(redLine => redLine.classList.remove('red-line_bottomToTop'));
}

function buildGamePad() {
  const LAST_COL_OR_ROW = (QUANTITY_ROWS_AND_COLS - 1).toString();

  let gamepad = htmlToElement(`<section class="gamepad" aria-label="gamepad"></section>`);

  for (let row = 0; row < QUANTITY_ROWS_AND_COLS; row++) {
    let gamepad_row = htmlToElement(`<div class="gamepad__row"></div>`);

    for (let column = 0; column < QUANTITY_ROWS_AND_COLS; column++) {
      let cell = htmlToElement(`<div class="cell" data-col="${column}" data-row="${row}"></div>`);
      if(cell.dataset.col !== LAST_COL_OR_ROW) {
        addClassToElement(cell, 'cell_right-boarder');
      }
      if(cell.dataset.row !== LAST_COL_OR_ROW) {
        addClassToElement(cell, 'cell_bottom-border');
      }
      let redLine = htmlToElement(`<div class="red-line" data-row="${row}" data-col="${column}"></div>`);
      cell.appendChild(redLine);

      gamepad_row.appendChild(cell);
    }
    gamepad.appendChild(gamepad_row);
  }

  return gamepad;
}

function cellCLicked(event, commonData) {
  let clickedCell = event.target;
  let { gameOver, players } = commonData;

  if(!gameOver && isCell(clickedCell) && clickedCell.innerText === '') {
    clickedCell.innerHTML = `
      <span class="player-symbol">${players.getCurrentPlayerSymbol()}</span>`
      + clickedCell.innerHTML;

    let isWin = getIsWin(clickedCell, commonData);
    if (isWin.status || getIsDraw(commonData.gamepad)) {
      commonData.gameOver = true;
      displayGameResult(isWin,commonData);

    } else {
      players.setNextPlayerTurn();
    }
  }
}

function displayGameResult(isWin, commonData) {
  let { players } = commonData;

  if(isWin.status){
    if(players.getCurrentPlayerSymbol() === players.getPlayer1_Symbol()) {
      model.player1_score++;
      model.scoreboard_message = 'Player 1 won!';
    }else {
      model.player2_score++;
      model.scoreboard_message = 'Player 2 won!';
    }
  }else {
    model.player1_score++;
    model.player2_score++;
    model.scoreboard_message = 'Draw!';
  }

  model.eventBus.publish(model.eventBus.channelOptions.endGame);
}

function getIsDraw(gamepad) {
  let allCells = getAllCells(gamepad, 'cell');
  return allCells.every(cell => cell.innerText !== '');
}

function getAllCells(gamepad, className) {
  return Array.from(gamepad.querySelectorAll(`.${className}`));
}

function getIsWin(cell, commonData) {
  let gamepad = commonData.gamepad;

  if(isHorizontalSymbolsSame(cell, gamepad)){
    let redLines = getElementsInOneLine(gamepad, 'red-line', 'row', cell.dataset.row);
    redLines.forEach(line => addClassToElement(line, 'red-line_horizontal'));

    return {status: true, line: 'horizontal'};

  }else if(isVerticalSymbolsSame(cell, gamepad)) {
    let redLines = getElementsInOneLine(gamepad, 'red-line', 'col', cell.dataset.col);
    redLines.forEach(line => addClassToElement(line, 'red-line_vertical'));

    return {status: true, line: 'vertical'};

  }else if(isDiagnolSymbolsSameFromTopToBottom(gamepad)){
    let redDiagnolCellsFromTopToBottom = getDiagnolRedLineCellsFromTopToBottom(gamepad);
    redDiagnolCellsFromTopToBottom.forEach(cell => addClassToElement(cell, 'red-line_topToBottom'));

    return {status: true, line: 'TopToBottom'};

  }else if(isDiagnolSymbolsSameFromBottomToTop(gamepad)){
    let redDiagnolCellsFromBottomToTop = getDiagnolRedLineCellsFromBottomToTop(gamepad);
    redDiagnolCellsFromBottomToTop.forEach(cell => addClassToElement(cell, 'red-line_bottomToTop'));

    return {status: true, line: 'BottomToTop'};
  }

  return {status: false, line: ''};
}

function getElementsInOneLine(gamepad, typeOfElement, colOrRowString, colOrRowNumber) {
  return Array.from(gamepad.querySelectorAll(`.${typeOfElement}[data-${colOrRowString}='${colOrRowNumber}']`));
}

function isVerticalSymbolsSame(cell, gamepad) {
  let verticalCells = Array.from(getElementsInOneLine(gamepad, 'cell', 'col', cell.dataset.col));
  return isCellsValueSame(verticalCells);
}

function isHorizontalSymbolsSame(cell, gamepad) {
  let horizontalCells = Array.from(getElementsInOneLine(gamepad, 'cell', 'row', cell.dataset.row));
  return isCellsValueSame(horizontalCells);
}

function isDiagnolSymbolsSameFromTopToBottom(gamepad) {
  let diagnolCellFromTopToBottom = [];
  for(let rowAndCol=0; rowAndCol < QUANTITY_ROWS_AND_COLS; rowAndCol++) {
    let cell = gamepad.querySelector(`[data-row='${rowAndCol}'][data-col='${rowAndCol}']`);
    diagnolCellFromTopToBottom.push(cell);
  }

  return isCellsValueSame(diagnolCellFromTopToBottom);
}

function getDiagnolRedLineCellsFromTopToBottom(gamepad) {
  let redLineDiagnolCellsFromTopToBottom =[];
  for(let rowAndCol=0; rowAndCol < QUANTITY_ROWS_AND_COLS; rowAndCol++) {
    let cell = gamepad.querySelector(`.red-line[data-row='${rowAndCol}'][data-col='${rowAndCol}']`);
    redLineDiagnolCellsFromTopToBottom.push(cell);
  }

  return redLineDiagnolCellsFromTopToBottom;
}

function isDiagnolSymbolsSameFromBottomToTop(gamepad) {
  let diagnolCellFromBottomToTop = [];
  for(let row=QUANTITY_ROWS_AND_COLS-1, col=0; row >= 0 && col < QUANTITY_ROWS_AND_COLS; row--, col++) {
    let cell = gamepad.querySelector(`[data-row='${row}'][data-col='${col}']`);
    diagnolCellFromBottomToTop.push(cell);
  }

  return isCellsValueSame(diagnolCellFromBottomToTop);
}

function getDiagnolRedLineCellsFromBottomToTop(gamepad) {
  let redLineDiagnolCellsFromBottomToTop =[];
  for(let row=QUANTITY_ROWS_AND_COLS-1, col=0; row >= 0 && col < QUANTITY_ROWS_AND_COLS; row--, col++) {
    let cell = gamepad.querySelector(`.red-line[data-row='${row}'][data-col='${col}']`);
    redLineDiagnolCellsFromBottomToTop.push(cell);
  }

  return redLineDiagnolCellsFromBottomToTop;
}

function isCellsValueSame(cells) {
  return cells.every(cell => cell.innerText === cells[0].innerText && cell.innerText !== '');
}

function isCell(target) {
  return target.className.includes('cell');
}