import {htmlToElement} from './helpers';

let model = null;

export function scoreboard(modelArg) {
  model = modelArg;
  let eventBus = model.eventBus;

  let scoreBoardElement = htmlToElement(`
    <section class="scoreboard" aria-label="scoreboard">
      <div>Player1: <span id="Player1-Score">0</span></div>
      <div>Player2: <span id="Player2-Score">0</span></div>
      <div class="scoreboard__message"></div>
    </section>`);


  let updateEvent = () => update(scoreBoardElement);
  eventBus.subscribe(eventBus.channelOptions.newGame, updateEvent);
  eventBus.subscribe(eventBus.channelOptions.endGame, updateEvent);

  return scoreBoardElement;
}

function update(scoreboard) {
  scoreboard.querySelector('#Player1-Score').innerText = model.player1_score;
  scoreboard.querySelector('#Player2-Score').innerText = model.player2_score;
  scoreboard.querySelector('.scoreboard__message').innerText = model.scoreboard_message;
}
