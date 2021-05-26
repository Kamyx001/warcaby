import {ctx} from "./main.js";
import {whitePawn, blackPawn} from "./textures.js";
import {tileConfig} from "./engine.js";


class Pawn{
    constructor(type, {x, y}){
        this.logicalPosition = {x: x, y: y};
        this.type = type;
    }

    move(x, y){
        
    }

    draw(){
        if(this.type == "white"){
            ctx.drawImage(whitePawn, this.logicalPosition.x*tileConfig.size, this.logicalPosition.y*tileConfig.size);
        }else if(this.type == "black"){
            ctx.drawImage(blackPawn, this.logicalPosition.x*tileConfig.size, this.logicalPosition.y*tileConfig.size);
        }
    }
}

export{Pawn};