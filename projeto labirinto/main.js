(function(){

        
    var cnv = document.querySelector("canvas");
    var ctx = cnv.getContext("2d");
    var tileSize = 64;
    var tileSrcSize = 94;
    var SizePlayer = 96;


    var img = new Image();
        img.src = "parede.png";
        img.addEventListener("load",function(){

            requestAnimationFrame(loop,cnv);

        },false);


    var player = {

        x: tileSize + 2,
        y: tileSize + 2,
        width: 24,
        height:33,
        speed: 3,
        srcX: 0,
        srcY: SizePlayer,
        countAnim: 0



    }

    var WIDTH = cnv.width;
    var HEIGHT = cnv.height;
    var letf = 37;
    var up = 38;
    var rigth = 39;
    var down = 40;
    var mvletf = false;
    var mvup = false;
    var mvdown = false;
    var mvrigth = false;
    var walls = [];


    var maze = [

        [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
        [1,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,1],
        [1,1,1,1,0,1,1,1,1,0,1,1,1,1,1,0,1,1,0,1],
        [1,0,0,0,0,0,1,0,0,0,0,0,0,0,1,0,0,1,0,1],
        [1,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,1,0,1],
        [1,1,1,1,1,0,1,0,0,1,1,1,1,0,1,0,1,1,0,1],
        [1,0,0,0,0,0,1,0,0,1,0,0,0,0,1,0,1,0,0,1],
        [1,0,0,1,1,1,1,0,0,1,0,1,1,1,1,0,1,1,1,1],
        [1,0,0,0,0,0,0,0,0,1,0,0,0,0,1,0,0,1,0,0],
        [1,1,1,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,1],
        [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,1],
        [1,1,1,1,1,1,0,1,0,1,0,1,1,1,1,1,0,1,0,1],
        [1,0,0,0,0,1,0,1,0,1,0,0,0,0,0,1,0,1,0,1],
        [1,0,0,0,0,0,0,1,0,1,0,1,1,1,0,1,0,1,0,1],
        [1,1,0,1,1,1,0,1,0,1,0,0,0,1,0,1,0,1,0,1],
        [1,0,0,1,0,1,1,1,0,1,0,1,0,1,0,1,0,1,0,1],
        [1,0,1,1,0,0,0,0,0,1,0,1,1,1,0,1,0,1,0,1],
        [1,0,0,1,0,1,1,1,1,1,0,1,0,0,0,1,0,1,0,1],
        [1,0,0,0,0,1,0,0,0,0,0,1,0,1,0,1,0,0,0,1],
        [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]

    ]

    var T_WIDTH = maze[0].length * tileSize;
    var T_HEIGHT = maze.length * tileSize; 


    //personagem na passar do muro

    for(var row in maze){

        for(var column in maze[row]){
            var tile = maze[row][column]

            if (tile === 1) {
                
                var x = column*tileSize;
                var y = row*tileSize;

                ctx.fillRect(x,y,tileSize,tileSize);

                var wall = {

                    x: tileSize*column,
                    y: tileSize*row,
                    width: tileSize,
                    height: tileSize

                }
                walls.push(wall);

            }


        }
    }

    //camera

    var cam = {

        x: 0,
        y: 0,
        width: WIDTH, 
        height: HEIGHT,
        innerLeftBoundary: function(){

            return this.x + (this.width * 0.25);

        },
        innerTopBoundary: function(){

            return this.y + (this.height * 0.25);

        },
        innerRigthBoundary: function() {

            return this.x + (this.width * 0.75);
 
        },
        innerBottomBoundary: function(){

            return this.y + (this.height * 0.75);

        }


    }

    //funçao para o personagem nao atravessar a parede

    function blockRectangle(objA,objB){

        var distX = (objA.x + objA.width/2) - (objB.x + objB.width/2);
        var distY = (objA.y + objA.height/2) - (objB.y + objB.height/2);
        
        var sumWidth = (objA.width + objB.width)/2;
        var sumHeigth = (objA.height + objB.height)/2;

        if(Math.abs(distX) < sumWidth && Math.abs(distY) < sumHeigth){

            var overlapX = sumWidth - Math.abs(distX);
            var overlapY = sumHeigth - Math.abs(distY);

            if (overlapX > overlapY) {
                
                objA.y = distY > 0 ? objA.y + overlapY : objA.y - overlapY; 

            }else{

                objA.x = distX > 0 ? objA.x + overlapX : objA.x - overlapX;


            }

            


        }

    }



    window.addEventListener("keydown",keydownHandler,false);
    window.addEventListener("keyup",keyupHandler,false);

    function keydownHandler(e){

        var key = e.keyCode
        switch(key){
            case letf:
                mvletf = true;
                break;
            case up:
                mvup = true;
                break;
            case rigth:
                mvrigth = true; 
                break;
            case down:
                mvdown =true;
            break;

            
        }

    }


    function keyupHandler(e){

        var key = e.keyCode
        switch(key){
            case letf:
                mvletf = false;
                break;
            case up:
                mvup = false;
                break;
            case rigth:
                mvrigth = false;
                break;
            case down:
                mvdown = false;
            break;

            
        }

    }


    function update(){

        //movimentacao

        if(mvletf && !mvrigth){

            player.x -= player.speed
            player.srcY = tileSrcSize + (player.height * 2)


        }else if (mvrigth && !mvletf) {
            
            player.x += player.speed
            player.srcY = tileSrcSize + (player.height * 3)


        }

        if (mvup && !mvdown) {
            
            player.y -= player.speed
            player.srcY = tileSrcSize + (player.height * 1)

        } else if (mvdown && !mvup){
            
            player.y += player.speed
            player.srcY = tileSrcSize + (player.height * 0)

        }


        if(mvrigth || mvup || mvdown || mvletf){

            if(player.countAnim>=40){

                player.countAnim=0;

            }
            
            player.countAnim++
            player.srcX = Math.floor(player.countAnim/5)*player.width   
            

        }else{

            player.srcX = 0;
            player.countAnim = 0;

        }

        //parede

        for(var i in walls){

            var wall = walls[i];
            blockRectangle(player,wall);

        }

        //atualizacao da movimenta da camera

        if(player.x < cam.innerLeftBoundary()){

            cam.x = player.x - (cam.width * 0.25);

        }

        if(player.y < cam.innerTopBoundary()){

            cam.y = player.y - (cam.height * 0.25);

        }

        if(player.x + player.width > cam.innerRigthBoundary()){

            cam.x = player.x + player.width - (cam.width * 0.75);

        }

        if(player.y + player.height > cam.innerBottomBoundary()){

            cam.y = player.y + player.height - (cam.height * 0.75);

        }
        
        //fazer a camera nao mostra o lado de fora do labirinto
        cam.x = Math.max(0,Math.min(T_WIDTH - cam.width,cam.x));
        cam.y = Math.max(0,Math.min(T_HEIGHT - cam.height,cam.y));

        if (maze[row] == player.x && maze[column] == player.y) {
            
            alert("risos")

        }


    }


    //Renderizar a imagem
    function render() {


        ctx.clearRect(0,0,WIDTH,HEIGHT);
        ctx.save();
        ctx.translate(-cam.x, -cam.y);
        for(var row in maze){
            for(var column in maze[row]){
                var tile = maze[row][column];

                var x = column*tileSize;
                var y = row*tileSize;
                
                ctx.drawImage(

                    img,
                    tile * tileSrcSize,0,tileSrcSize,tileSrcSize,
                    x,y,tileSize,tileSize

                );
            }
        }
        
        
        ctx.drawImage(

            img,
            player.srcX,player.srcY,player.width,player.height,
            player.x,player.y,player.width,player.height

        )
        ctx.restore();


    }






    function loop() {
        
        update();
        render();
        requestAnimationFrame(loop,cnv);

    }

   
}())