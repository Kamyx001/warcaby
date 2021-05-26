import {tileConfig} from './engine.js';
import {game} from './main.js';

const canvas = document.querySelector('canvas');

let howManyJumps = 0;

export const clicking = {   
    onClick: (event) => {
        const logicalPosition = {x:Math.floor(event.offsetX/tileConfig.size), y:Math.floor(event.offsetY/tileConfig.size)};
        const board = game.board.board;
        if(board[logicalPosition.x])if(board[logicalPosition.x][logicalPosition.y]){
            const currentTile = board[logicalPosition.x][logicalPosition.y];
            if(currentTile.canMove == true){
                const lastPawnPosition = board[currentTile.whichPawnCanMove.posX][currentTile.whichPawnCanMove.posY];
                const pawnType = lastPawnPosition.pawnPlace.type;
                lastPawnPosition.pawnPlace = null;
                lastPawnPosition.update();
                currentTile.addPawn(pawnType)
                clearPossibleMoves();
                toggleTurn();
                if(currentTile.jumpedTile){
                    howManyJumps++;
                    game.blockedTurn = true;
                    const jumpedTile = board[currentTile.jumpedTile.posX][currentTile.jumpedTile.posY];
                    jumpedTile.pawnPlace = null;
                    jumpedTile.update();
                    currentTile.jumpedTile = null;
                    if(showPossibleMoves(logicalPosition.x, logicalPosition.y, pawnType) == false){
                        if(howManyJumps == 2 || howManyJumps == 4 || howManyJumps == 6){
                            toggleTurn();
                        }
                        clearPossibleMoves();
                        game.blockedTurn = false;
                        console.log(game.whoseTurn);
                    }
                    
                }
                return;
            }
            if(currentTile.pawnPlace != null && game.blockedTurn == false){
                const pawnType = currentTile.pawnPlace.type;
                if(pawnType == game.whoseTurn){
                    clearPossibleMoves();
                    showPossibleMoves(logicalPosition.x, logicalPosition.y, pawnType);
                } 
            }
        }
    },
    getMousePos: (event) => {
        const rect = canvas.getBoundingClientRect();
        const mousePos = {
            x: Math.floor((event.clientX - rect.left)/tileConfig.size),
            y: Math.floor((event.clientY - rect.top)/tileConfig.size)
        }
        if(game.board.board[mousePos.x])if(game.board.board[mousePos.x][mousePos.y]){
            game.board.board[game.hoveredTile.x][game.hoveredTile.y].isHovered = null;
            game.board.board[game.hoveredTile.x][game.hoveredTile.y].update();
            game.board.board[mousePos.x][mousePos.y].isHovered = true;
            game.board.board[mousePos.x][mousePos.y].update();
            game.hoveredTile = {x:mousePos.x, y:mousePos.y};
        }
    }   
};


canvas.addEventListener('click', clicking.onClick);
window.addEventListener('mousemove', clicking.getMousePos);

const showPossibleMoves = (x, y, pawnType) => {
    let isJumpPossible = false;
    for(let posX = x-1;posX <= x+1; posX++){
        for(let posY = y-1;posY <= y+1; posY++){
            try {
                const tile = game.board.board[posX][posY]
                if(tile.isBlack == true && tile.pawnPlace == null){
                    if(pawnType == "white") if(tile.logicalPos.y<y){
                        tile.canMove = true;
                        game.highlightedTiles.push({posX: posX, posY: posY});
                        tile.whichPawnCanMove = {posX:x, posY:y};
                    }
                    if(pawnType == "black") if(tile.logicalPos.y>y){
                        tile.canMove = true;
                        game.highlightedTiles.push({posX: posX, posY: posY});
                        tile.whichPawnCanMove = {posX:x, posY:y};
                    }
                }
                if(tile.pawnPlace !== null && tile.pawnPlace.type !== game.board.board[x][y].pawnPlace.type){
                    if(canCapture({pawnX:x, pawnY:y}, {opponentsPawnX:posX,opponentsPawnY:posY}) == true) isJumpPossible = true;
                }
                tile.update();
            }catch(e){
            }
        }
    }
    return isJumpPossible;
}

const clearPossibleMoves = ()=> {
    const board = game.board.board;
    game.highlightedTiles.forEach(tile => {
        board[tile.posX][tile.posY].canMove = false;
        board[tile.posX][tile.posY].beingCaptured = false;
        board[tile.posX][tile.posY].update();
    })
    game.highlightedTiles = [];
}

const canCapture = ({pawnX, pawnY}, {opponentsPawnX, opponentsPawnY})=> {
    console.log(opponentsPawnX, opponentsPawnY)
    if(pawnX>opponentsPawnX){//jest na lewo
        if(pawnY>opponentsPawnY){//jest u góry
            if(canJump({deltaX:-2, deltaY:-2}, {pawnX:pawnX, pawnY:pawnY}) == true) return true;
        }else{//jest u dołu
            if(canJump({deltaX:-2, deltaY:2}, {pawnX:pawnX, pawnY:pawnY}) == true) return true;            
        }
    }else{//jest na prawo
        if(pawnY>opponentsPawnY){//jest u góry
            if(canJump({deltaX:2, deltaY:-2}, {pawnX:pawnX, pawnY:pawnY}) == true) return true;
        }else{//jest u dołu
            if(canJump({deltaX:2, deltaY:2}, {pawnX:pawnX, pawnY:pawnY}) == true) return true;
        }
    }
    return "can not jump"
}

const canJump = ({deltaX, deltaY}, {pawnX, pawnY}) => {
    const tileToJumpTo = game.board.board[pawnX+deltaX][pawnY+deltaY];
    if(!tileToJumpTo.pawnPlace){
        tileToJumpTo.canMove = true;
        tileToJumpTo.whichPawnCanMove = {posX:pawnX, posY:pawnY};
        game.highlightedTiles.push({posX: pawnX+deltaX, posY: pawnY+deltaY});
        game.highlightedTiles.push({posX: pawnX+deltaX/2, posY: pawnY+deltaY/2});
        tileToJumpTo.update();
        const tileBeingCaptured = game.board.board[pawnX+deltaX/2][pawnY+deltaY/2];
        tileBeingCaptured.beingCaptured = true;
        tileBeingCaptured.update();
        tileToJumpTo.jumpedTile = {posX: pawnX+deltaX/2, posY: pawnY+deltaY/2};
        return true;
    }
}

const turnPlace = document.querySelector('#turn');

turnPlace.innerText = "Biały"

const toggleTurn = ()=>{
    if(game.whoseTurn == "white"){
        turnPlace.innerText = "Czarny";
        game.whoseTurn = "black";
        howManyJumps = 1;
    }else{
        turnPlace.innerText = "Biały";
        game.whoseTurn = "white";
        howManyJumps = 1;
    }
}