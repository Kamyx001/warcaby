import { Bord } from "./engine.js";
import { whitePawn, blackPawn } from "./textures.js";
import {Player} from "./player.js";
import {clicking} from "./inputs.js";

const canvas = document.querySelector('#canvas');
const ctx = canvas.getContext('2d');
const game = {
  hoveredTile: {
    x: 0,
    y: 0
  },
  whoseTurn: "white",
  players: [],
  size: {
    width: 496,
    height: 496,
  },
  blockedTurn: false,
  highlightedTiles: [],
  board:  null,
  init() {
    console.log('init');
    canvas.setAttribute('height', this.size.width );
    canvas.setAttribute('width', this.size.height );
    this.board = new Bord();
    this.players.push(new Player('white'));
    this.players.push(new Player('black'));
  },
  nextTurn() {
    if (this.whoseTurn === 'white') {
      this.whoseTurn = 'black';
    }else if (this.whoseTurn ==='black') {
      this.whoseTurn = 'white';
    }
  }
}
let allLoaded = 0;
whitePawn.onload = () => {
  allLoaded += 1;
  if (allLoaded >= 2) {
    game.init();
  }
}
blackPawn.onload = () => {
  allLoaded += 1;
  if (allLoaded >= 2) {
    game.init();
  }
}

window.md = {
  game: game
}
export { game, ctx }