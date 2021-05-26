import { game, ctx } from "./main.js";
import {Pawn} from "./pawn.js";

const tileConfig = {
  size: 62
}

class Tile {
  constructor(type, { posX, posY }) {
    if(type == "rgba(112,60,11,1)"){
      this.isBlack = true;
    }else{
      this.isBlack = false;
    }
    this.pawnPlace = null;
    this.isEmpty = true;
    this.tileType = type;
    this.jumpedTile = null;
    this.canMove = false;
    this.beingCaptured = false;
    this.whichPawnCanMove = {};
    this.logicalPos = {
      x: posX,
      y: posY
    }
  }
  update() {
    ctx.fillStyle = this.tileType;
    const physicalPos = this.physicalPos;
    ctx.clearRect( physicalPos.x, physicalPos.y, tileConfig.size, tileConfig.size );
    ctx.fillRect( physicalPos.x, physicalPos.y, tileConfig.size, tileConfig.size );
    if(this.isHovered){
      ctx.fillStyle = 'rgba(0, 0, 0, 0.3)'
      ctx.fillRect( physicalPos.x, physicalPos.y, tileConfig.size, tileConfig.size);
    }
    if(this.canMove == true){
      ctx.fillStyle = 'rgba(0, 255, 0, 0.4)'
      ctx.fillRect( physicalPos.x, physicalPos.y, tileConfig.size, tileConfig.size);
    }
    if(this.beingCaptured == true){
      ctx.fillStyle = 'rgba(255, 0, 0, 0.4)'
      ctx.fillRect( physicalPos.x, physicalPos.y, tileConfig.size, tileConfig.size);
    }
    if(this.pawnPlace != null){
      this.pawnPlace.draw();
    }
  }
  get physicalPos() {
    return {x: this.logicalPos.x * tileConfig.size, y: this.logicalPos.y * tileConfig.size }
  }
  addPawn(type){
    if(!type){
      return false;
    }
    this.pawnPlace = new Pawn(type, {x: this.logicalPos.x, y: this.logicalPos.y } );
  }
}


let isBlack = false;

class Bord {
  constructor() {
    this.board = [];
    for (let x = 0; x <= 8; x++) {
      this.board[x] = [];
      for (let y = 0; y <= 8; y++) {
        if (isBlack == true) {
          this.board[x][y] = new Tile("rgba(112,60,11,1)", {posX: x, posY: y});
          this.board[x][y].addPawn(this.whichPawn(x, y));
          isBlack = false;
        } else {
          this.board[x][y] = new Tile('rgba(255,252,221,1)', {posX: x, posY: y});
          isBlack = true;
        }
        this.board[x][y].update();
      }
    }
  }

  whichPawn(x, y){
    if(y < 3){
      return "black";
    }
    if(y > 4){
      return "white";
    }
  }
}
export {Bord, tileConfig}