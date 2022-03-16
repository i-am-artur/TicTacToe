import {htmlToElement} from './helpers';

export function gameOptions(model) {

  let gameOptionsElement = htmlToElement(`
    <section class="game-options" aria-label="game options">
      <button class="btn" id="ResetGame">Clear</button>
      <button class="btn" id="NewGame">New Game</button>
    </section>`);

  gameOptionsElement.addEventListener('click', event => {
    let clickedButton = event.target;

    if(clickedButton.id === 'ResetGame') {
      model.player1_score = 0;
      model.player2_score = 0;
      model.scoreboard_message = '';
      model.eventBus.publish(model.eventBus.channelOptions.newGame);

    }else if(clickedButton.id === 'NewGame') {
      model.scoreboard_message = '';
      model.eventBus.publish(model.eventBus.channelOptions.newGame);
    }
  });

  return gameOptionsElement;
}

