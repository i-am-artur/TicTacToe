import {random} from './helpers';

const PLAYER1_SYMBOL = 'X';
const PLAYER2_SYMBOL = 'O';

export function Players() {
  this.symbol = getPlayerRandomly();

  this.getPlayer2_Symbol = function () {
    return PLAYER2_SYMBOL;
  };

  this.getPlayer1_Symbol = function () {
    return PLAYER1_SYMBOL;
  };

  this.getCurrentPlayerSymbol = function () {
    return this.symbol;
  };

  this.setNextPlayerTurn = function () {
    if (this.symbol === PLAYER1_SYMBOL) {
      this.symbol = PLAYER2_SYMBOL;
    } else {
      this.symbol = PLAYER1_SYMBOL;
    }
  }
}

function getPlayerRandomly() {
  const PLAYER1 = 0;
  const PLAYER2 = 1;
  let chosenPlayer = random(PLAYER1, PLAYER2);

  if (chosenPlayer === PLAYER1) {
    return PLAYER1_SYMBOL;
  }

  return PLAYER2_SYMBOL;
}