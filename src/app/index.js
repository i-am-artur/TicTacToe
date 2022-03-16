import '../assets/scss/common.scss';
import {createGamePad} from './gamePad';
import {scoreboard} from './scoreboard';
import {gameOptions} from './gameOptions';
import {htmlToElement} from './helpers';

const EventBus = {
  channelOptions: {
    newGame: 'newGame',
    endGame: 'endGame'
  },
  channels: {},
  subscribe (channelName, listener) {
    if (!this.channels[channelName]) {
      this.channels[channelName] = [];
    }
    this.channels[channelName].push(listener);
  },

  publish (channelName, data) {
    const channel = this.channels[channelName];
    if (!channel || !channel.length) {
      return
    }

    channel.forEach(listener => listener(data));
  }
};

let model = {
  eventBus: EventBus,
  player1_score: 0,
  player2_score: 0,
  scoreboard_message: ''
};

document.body.appendChild(htmlToElement(`<h1 class="main-heading">Tic Tac Toe</h1>`));
document.body.appendChild(createGamePad(model));
document.body.appendChild(scoreboard(model));
document.body.appendChild(gameOptions(model));
