//GLOBAL VARS
let app = null;
let canvas = null;
let groundGraphic = null;
let groundLineGraphic = null;
let groundCoverGraphic = null;
let starsGraphic = null;
let starShieldGraphic = null;
let fogGraphic = null;
let time = 0;
window.onload = function(){
	canvas = document.getElementById("backgroundCanvas");
	document.getElementById("code").addEventListener("mouseover", mouseOverCode);
	document.getElementById("code").addEventListener("mouseout", mouseOutCode);
	init();
	app.renderer.resize(window.innerWidth, window.innerHeight);

}


function init(){
	PIXI.utils.skipHello();
	app = new PIXI.Application({
		view: canvas,
		width: window.innerWidth,
		height: window.innerHeight,
		resolution: window.devicePixelRatio,
		autoDensity: true,
		antialias: true
	});
	starsGraphic = new PIXI.Graphics();
	starShieldGraphic = new PIXI.Graphics();
	groundCoverGraphic = new PIXI.Graphics();
	groundGraphic = new PIXI.Graphics();
	groundLineGraphic = new PIXI.Graphics();
	fogGraphic = new PIXI.Graphics();
	let blurFilter = new PIXI.filters.BlurFilter();
	let blurFilter2 = new PIXI.filters.BlurFilter();
	let blurFilter3 = new PIXI.filters.KawaseBlurFilter(60,10,true);
	let blurFilter4 = new PIXI.filters.KawaseBlurFilter(80,10,true);
	let glitchFilter = new PIXI.filters.GlitchFilter({
		slices: 10,
		offset: 10,
		fillMode: 2 //LOOP
	});
	let CRTFilter = new PIXI.filters.CRTFilter({
		vignetting: .1
	});
	blurFilter.blur = 25;
	blurFilter.quality = 5;
	blurFilter2.blur = 1;

	app.stage.padding = 300;
	fogGraphic.padding = 300;
	starShieldGraphic.filters = [blurFilter4];
	groundGraphic.filters = [blurFilter];
	groundLineGraphic.filters = [blurFilter2];
	fogGraphic.filters = [blurFilter3];

	//app.stage.filters = [CRTFilter];
	//groundGraphic.blendMode = PIXI.BLEND_MODES.ADD;
	app.stage.addChild(starsGraphic);
	app.stage.addChild(starShieldGraphic);
	app.stage.addChild(groundCoverGraphic);
	app.stage.addChild(groundGraphic);
	app.stage.addChild(fogGraphic);
	app.stage.addChild(groundLineGraphic);

	app.ticker.add(animationloop);

	time = 0; //GLOBAL TIME VAR

	generateStars(200,3);
}

function generateStars(num, size){
	starsGraphic.clear();
	for (var i = starsGraphic.children.length - 1; i >= 0; i--) {
		starsGraphic.removeChild(starsGraphic.children[i]);
	};
	var width = app.screen.width;
	var height = app.screen.height;
	var star1Texture = PIXI.Texture.from('img/stars-tiled.jpg');
	var starsTexture = PIXI.Texture.from('img/stars-tiled-2-min (1).png');
	r = mulberry32(6969); //seed random number gen, generate numbers by calling r()
	for(var x = 0; x < width; x+=(55+(r()*1))*3){
		for(var y = 0; y < height; y+=3*(95+(r()*1))){
			//var x = r()*width;
			//var y = r()*height;
			//var s = Math.pow(r(), 500)*size+.7; //math.pow makes larger stars less common
			;

			let starX = x+r()*40;
			let starY = y+r()*10;
			let star = null;
			//if(Math.abs(starY - height/2) > 400){
			star = new PIXI.Sprite(starsTexture);
			star.scale.set(.35);
			star.anchor.set(.8);
			star.alpha = 1;
			star.angle = r() *  360;
			star.position.x = starX;
			star.position.y = starY;
			if(r() < 0.5 && Math.abs(star.position.y - height/2) > 300) {
				star.blendMode = PIXI.BLEND_MODES.ADD;
			}

			starsGraphic.addChild(star);
			/*   //OLD circle based rendering
		graphic.lineStyle(0);
		graphic.alpha = 1;
		graphic.beginFill(0xFFFFFF);
		graphic.drawCircle(x,y,s);
		graphic.endFill();
		*/
		}
	}

	starShieldGraphic.clear();
	starShieldGraphic.beginFill(0x000000);
	starShieldGraphic.alpha = .9
	starShieldGraphic.drawEllipse(width/2,6*height/8,width/1.5,height/2);
	starShieldGraphic.drawEllipse(0,0,1,1);
	groundCoverGraphic.clear();
	groundCoverGraphic.beginFill(0x000000);
	groundCoverGraphic.alpha = 1;
	groundCoverGraphic.drawRect(0,height-((height/2)-(height/5)), width, height+100)
	//graphic.endFill();
}

function drawBottomGrid() {
	var width = app.screen.width;
	var height = app.screen.height;
	groundGraphic.clear();
	groundGraphic.alpha = 1;
	groundLineGraphic.clear();
	groundLineGraphic.alpha = 1;

	time += 0.1;
	//if()
	for (let i = 20; i > 1; i /= 2) {
		//graphic.alpha = 1/i;
		//let color = hslToHex(.82, 1, (1/i) );
		let color = hslToHex(.82, .1, (1 / i) / 2 + .5);
		//groundGraphic.lineStyle(i+.5, color, );
		groundLineGraphic.lineStyle({
			width: i + .5,
			color: color,
			alignment: 0.5,
			alpha: Math.sqrt(1 / i),
			cap: 'round',
		})
		matrixGround(300, 20, (height / 2) - (height / 5), 6, 6, 0, -.1, groundLineGraphic);
	}
	let i = 20;
	let color = hslToHex(.82, .6, (1 / i) / 2 + .32);
	groundGraphic.lineStyle({
		width: i * 1.5,
		color: color,
		alignment: 0.5,
		alpha: 1,
		cap: 'round',
	})
	matrixGround(300, 20, (height / 2) - (height / 5), 6, 6, 0, -.1, groundGraphic);
}

function drawFog() {
	var width = app.screen.width;
	var height = app.screen.height;
	fogGraphic.clear();
	fogGraphic.alpha = 1;
	let o = 40; //overlap constant
	fogGraphic.beginFill(hslToHex(.6,1,.4),.25);
	fogGraphic.drawEllipse(3*width/4,height/2, width/3.5,height/2);
	fogGraphic.beginFill(hslToHex(.6,1,.4),.2);
	fogGraphic.drawRect(width/2-width/o,height/40,3*width/8+width/o,height-height/20);

	fogGraphic.beginFill(hslToHex(.83,1,.4),.25);
	fogGraphic.drawEllipse(width/4,height/2, width/3.5,height/2);

	fogGraphic.beginFill(hslToHex(.83,1,.4),.2);
	fogGraphic.drawRect(width/8,height/40,3*width/8+width/o,height-height/20);
	//fogGraphic.blendMode = PIXI.BLEND_MODES.ADD;
}

function animationloop() {
	drawBottomGrid();
	drawFog();
}

function mulberry32(a) {
	return function() {
		var t = a += 0x6D2B79F5;
		t = Math.imul(t ^ t >>> 15, t | 1);
		t ^= t + Math.imul(t ^ t >>> 7, t | 61);
		return ((t ^ t >>> 14) >>> 0) / 4294967296;
	}
}
function matrixGround(xdiv, ydiv, top, aspectX, aspectY, speedX, speedY, graphic){
	var width = app.screen.width;
	var height = app.screen.height;
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
		line(x0,	height-top, x,	height, graphic);
	}
	/***horizontal line loop:***/
	var timeModifierY = -1 * ((time * speedY) % 1);
	//doesn't loop using acual Y coordinates because we need to scale everything quadratically to emulate perspective
	for(var y = timeModifierY; y * y * ydiv / aspectY < top+1; y++){
		//makes everything further away as it gets closer to the bottom of the screen
		var newY = (height-top) + (y * ydiv * (y) / aspectY);
		//draw horizontal lines
		line(0, newY, width, newY, graphic)
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
function line(x0,y0,x1,y1, graphic){
	graphic.moveTo(x0,y0);
	graphic.lineTo(x1,y1);
}
function sin(x){
	return Math.sin(x);
}
window.addEventListener("resize", function () {
	app.renderer.resize(window.innerWidth, window.innerHeight);
	generateStars(200,3);
});
function mouseOverCode() {
	document.getElementById("h2Container").style.fontFamily = "Courier New,Courier,monospace";

}
function mouseOutCode() {
	document.getElementById("h2Container").style.fontFamily = "Inter, sans-serif";

}