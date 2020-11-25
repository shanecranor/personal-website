window.onload = function(){
	document.getElementById("code").addEventListener("mouseover", mouseOverCode);
	document.getElementById("code").addEventListener("mouseout", mouseOutCode);
	app.renderer.resize(window.innerWidth, window.innerHeight);
}
function mouseOverCode() {
	document.getElementById("h2Container").style.fontFamily = "Courier New,Courier,monospace";

}
function mouseOutCode() {
  document.getElementById("h2Container").style.fontFamily = "Inter, sans-serif";

}
const canvas = document.getElementById("backgroundCanvas");

PIXI.utils.skipHello();

const app = new PIXI.Application({
	view: canvas,
	width: window.innerWidth,
	height: window.innerHeight,
	resolution: window.devicePixelRatio,
	autoDensity: true,
	antialias: true
});
let graphic = new PIXI.Graphics();
app.stage.addChild(graphic);

app.ticker.add(animationloop);

var time = 0; //GLOBAL TIME VAR
var width = app.screen.width;
var height = app.screen.height;
generateStars(200,3);
function animationloop() {
	width = app.screen.width;
	height = app.screen.height;
	graphic.clear();
	graphic.alpha = 1;

	time += 0.1;
	//if()
	for(var i = 20; i > 1; i/=1.7){
		//graphic.alpha = 1/i;
		graphic.lineStyle(i+.5, hslToHex(.82, 1, (1/i) ));
		matrixGround(200,10,(height/2)-(height/5), 6, 6, 0,-.1);
	}

}
function generateStars(num, size){
	var star1Texture = PIXI.Texture.from('img/star1.gif');
	var starsTexture = PIXI.Texture.from('img/stars-tiled.jpg');
	r = mulberry32(223452); //seed random number gen, generate numbers by calling r()
	for(var x = 0; x < width; x+=(55+(r()*1))*3){
		for(var y = 0; y < height; y+=3*(95+(r()*1))){
		//var x = r()*width;
		//var y = r()*height;
		var s = Math.pow(r(), 500)*size+.7; //math.pow makes larger stars less common
		var star = new PIXI.Sprite(starsTexture);
		star.position.x = x+r()*40;
		star.position.y = y+r()*10;
		star.blendMode = PIXI.BLEND_MODES.ADD;
		star.scale.set(.63);
		star.anchor.set(0.5);
		star.alpha = .5;
		star.angle = r() *  360;
		app.stage.addChild(star);
		/*   //OLD circle based rendering
		graphic.lineStyle(0);
		graphic.alpha = 1;
		graphic.beginFill(0xFFFFFF);
		graphic.drawCircle(x,y,s);
		graphic.endFill();
		*/

		}
	}
	//graphic.endFill();
}

function mulberry32(a) {
    return function() {
      var t = a += 0x6D2B79F5;
      t = Math.imul(t ^ t >>> 15, t | 1);
      t ^= t + Math.imul(t ^ t >>> 7, t | 61);
      return ((t ^ t >>> 14) >>> 0) / 4294967296;
    }
}
function matrixGround(xdiv, ydiv, top, aspectX, aspectY, speedX, speedY){
	/***vertical line loop:***/
	//Calculate the extra lines needed to compensate for the X aspect not making it all the way to the edge of the canvas
	var extra = Math.abs(width - (width * aspectX)) / 2;
	var timeModifierX = (time * speedX) % xdiv

	//loops from before 0 to cover the whole canvas, keep looping until after width for the same reason
	for(var x = -1 * extra + timeModifierX; x < width + extra; x += xdiv){
		//devide the x position by the aspect to simulate perspective
		//use arious maths to keep the perspective centered
		var x0 = (( x - (width/2)) / aspectX ) + (width/2);
		//draw vertical lines
		line(x0,	height-top, x,	height);
	}
	/***horizontal line loop:***/
	var timeModifierY = -1 * ((time * speedY) % 1);
	//doesn't loop using acual Y coordinates because we need to scale everything quadratically to emulate perspective
	for(var y = timeModifierY; y * y * ydiv / aspectY < top+1; y++){
		//makes everything further away as it gets closer to the bottom of the screen
		var newY = (height-top) + (y * ydiv * (y) / aspectY);
		//draw horizontal lines
		line(0, newY, width, newY)
	}
}
function hslToHex(h, s, l) {
	var r, g, b;

	if (s == 0) {
		r = g = b = l; // achromatic
	} else {
		function hue2rgb(p, q, t) {
			if (t < 0) t += 1;
			if (t > 1) t -= 1;
			if (t < 1 / 6) return p + (q - p) * 6 * t;
			if (t < 1 / 2) return q;
			if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
			return p;
		}

		var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
		var p = 2 * l - q;

		r = hue2rgb(p, q, h + 1 / 3);
		g = hue2rgb(p, q, h);
		b = hue2rgb(p, q, h - 1 / 3);
	}

	return PIXI.utils.rgb2hex([r, g, b]);
}
function line(x0,y0,x1,y1){
	graphic.moveTo(x0,y0);
	graphic.lineTo(x1,y1);
}
function sin(x){
	return Math.sin(x);
}
window.addEventListener("resize", function () {
	app.renderer.resize(window.innerWidth, window.innerHeight);
});
