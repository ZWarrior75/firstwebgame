///
var canvas = window.document.createElement("canvas");
canvas.style = "width: 100%; height: 100%";
window.document.body.appendChild(canvas);
var ctx = canvas.getContext('2d');


var activeKeys = {};

window.document.addEventListener('keydown', function(e) {   
    activeKeys[e.key] = 1;
});

window.document.addEventListener('keyup', function(e) {   
    
    activeKeys[e.key] = 0;
});

var imgPlayer = new Image();
imgPlayer.src = 'Player.png';
var imgEnnemy = new Image();
imgEnnemy.src = 'Ennemy.png';
var imgTir = new Image();
imgTir.src = 'Tir.png';

//

var x = 90;
var y = 135;
var actifT = [];
var timeStart = window.performance.now();
var timeLastT = 0;
var actifM = [];
var moveM = 10;

var monstreNum = 20;

function inputHandle(timeDelta) {
    
    if (activeKeys["d"]) { 
        //aller a droite
        x = x + 5;
        if (x > 285){
            x = 285;
        }
    }
    
    if (activeKeys["q"]) { 
        //aller a gauche
        x = x - 5;
        if (x < -5) {
            x = -5;
        }
    }
    var timeNow = window.performance.now();
    if (activeKeys[" "] && (timeNow - timeLastT > 175 )) {
        timeLastT = timeNow;
        //tirer
        var tir = {
            xT: x + 5,
            yT: y 
        };
        actifT.push(tir);
    }

}

function drawCube(xCube,yCube,wCube,hCube,color) { 
    
    ctx.fillStyle = color;
    ctx.fillRect(
        xCube,
        yCube,
        wCube,
        hCube);
    
}         

function drawSprite(img, xCube, yCube, wCube, hCube, color) {
    ctx.drawImage(img, xCube, yCube, wCube, hCube);
}



// logique jeu
var timeLastM = 0;

function valueInRange(value, min, max) { 
    return value <= max && value >= min;
}

function collision(x1, y1, w1, h1, x2, y2, w2, h2) { 
    return (valueInRange(x1 + w1, x2, x2 + w2) || valueInRange(x1, x2, x2 + w2))
        &&
        (valueInRange(y1 + h1, y2, y2 + h2) || valueInRange(y1, y2, y2 + h2));
}

function update() { 
    // tir
    for (var i = 0; i < actifT.length; i++) {
        var tir = actifT[i];
        tir.yT = tir.yT - 5;
        if (tir.yT < -15) {
            actifT.splice(i, 1);
        }
    }
    // monstre
    
    for (var i = 0; i < actifM.length; i++) {

        var monstre = actifM[i];
        monstre.xMCol = monstre.xM;
        monstre.wMCol = 10;
    }

    var timeNow = window.performance.now();
    if (timeNow - timeLastM > 1000) {
        timeLastM = timeNow;
        // Déplacement 
        
        // detection bordure rebond 285
        var rebondM = false;
        for (var i = 0; i < actifM.length; i++) {
            var monstre = actifM[i];
        
            if (monstre.xM + moveM > 285 || (monstre.xM + moveM < -5)) {
                rebondM = true;
                moveM *= -1;
                break;
            }
        }

        // deplacement
        for (var i = 0; i < actifM.length; i++) {
            var monstre = actifM[i];
            
            monstre.xM = monstre.xM + moveM;
            monstre.wMCol = monstre.wMCol + 10;
            if (rebondM) {
                monstre.yM += 10;
            }
           
                 
        }
    }
    
    for (var i = 0; i < actifM.length; i++) {
        var monstre = actifM[i];        

        for (var p = 0; p < actifT.length; p++) {
            var tir = actifT[p];
            
            var xT = tir.xT;
            var yT = tir.yT;

            //drawCube (xT,      yT,     10,    10 + 5, "orange");
            
            if (collision(xT,              yT,              10,            10 + 5,
                          monstre.xMCol,   monstre.yM,      monstre.wMCol, 10     )) {
                    // explosion
                    
                    actifT.splice(p, 1);
                    actifM.splice(i, 1);
            }
        }

    }
    //drawCube(xMCol, yM, wMCol, 10, "blue");
    
}
    
// dessin
function draw(time) {


    // joueur
    drawSprite(imgPlayer,
         x,
         y,
        10,
        10, "red");
    
    // tir
    for (var i = 0; i < actifT.length; i++) {
        var tir = actifT[i];
        drawSprite(imgTir,
            tir.xT,
            tir.yT,
            2,
            10, "white");
    }

    // monstre
    for (var i = 0; i < actifM.length; i++) {
        var monstre = actifM[i];
        drawSprite(imgEnnemy,
            0 + monstre.xM,
            0 + monstre.yM,
            10,
            10, "green");
    }
}

function clearFrame(){
    ctx.clearRect(0, 0, 1000, 10000);
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, 1000, 10000);
}

var timelastGame = 0;
function gameLoop(timeDelta) { 
    var timeNow = window.performance.now();
    if (timeNow - timelastGame > 0) {
        
        clearFrame();
        timelastGame = timeNow;
        inputHandle(timeDelta);
        update(timeDelta);
        draw(timeDelta);
    }

}

function render() {    
    var timeCurrent = window.performance.now();
    timeDelta = timeCurrent - timeStart;
    gameLoop(timeDelta);
    window.requestAnimationFrame(render, canvas)
}


function begin() {
    // setup de la scene de jeu
    for (var i = 0; i < 7; i++) {// nb lignes
        for (var j = 0; j < 20; j++) { // nb colonnes
            var monstre = {
                xM: j * (10 + 2),
                yM: i * (10 + 2)
            };
            actifM.push(monstre);
        }
    }
    // on lance le jeu  
    // en demandant au browser de dessiner a chaque frame 
    render();
}

begin();