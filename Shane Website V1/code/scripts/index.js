let app = null;
let INITIALSPACING = 200;
let spacing = null;
let title = null;
window.onload = function(){
    title = document.getElementById("title");
    app = new PIXI.Application({
        //view: canvas,
        //width: window.innerWidth,
        //height: window.innerHeight,
        //resolution: window.devicePixelRatio,
        //autoDensity: true,
        antialias: true
    });
    spacing = INITIALSPACING;
    app.ticker.add(animationLoop);
}

function animationLoop() {
    title.firstElementChild.style.letterSpacing = spacing+"px";
    if(spacing > 1)
        spacing/=1.05;

}
