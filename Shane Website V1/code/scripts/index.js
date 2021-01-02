let app = null;
let INITIALSPACING = 200;
let spacing = null;
let title = null;
let animationGraphic = null;
window.onload = function(){
    title = document.getElementById("title");
    let canvas = document.getElementById("backgroundCanvas");
    app = new PIXI.Application({
        view: canvas,
        width: window.innerWidth,
        height: window.innerHeight,
        resolution: window.devicePixelRatio,
        autoDensity: true,
        antialias: true
    });

    animationGraphic = new PIXI.Graphics();
    spacing = INITIALSPACING;
    app.ticker.add(animationLoop);


}
function line(x0,y0,x1,y1, graphic){
    graphic.moveTo(x0,y0);
    graphic.lineTo(x1,y1);
}
function animationLoop() {
    title.firstElementChild.style.letterSpacing = spacing+"px";
    if(spacing > 1)
        spacing/=1.05;
    else
        spacing = 1;
    animationGraphic.clear();
    animationGraphic.beginFill(0xFFFFFF);
    animationGraphic.lineStyle({
        width: 1,
        color: 0xFFFFFF,
        alignment: 0.5,
        alpha: 1,
        cap: 'round',
    })
    for(let i = 0; i < 100; i++)
    line(Math.random()*window.innerWidth,Math.random()*window.innerHeight,0,0,animationGraphic)
}
