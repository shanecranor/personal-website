//GLOBAL VARS
let app = null;
let app2 = null;
let CRTFilter = null;
let canvas = null;
let canvas2 = null;
let app2Graphic = null;
let groundGraphic = null;
let groundLineGraphic = null;
let groundCoverGraphic = null;
let groundLineHorizonGraphic = null;
let starsGraphic = null;
let starShieldGraphic = null;
let fogGraphic = null;
let time = 0;
let width = 0;
let height = 0;
let scrollY = -100;
let oldDeltaScrollY = 0;
let deltaScrollY = 0;
let notScrollingFrames = 40;
let TOP = 0;
let nameDOM = null;
window.onload = function(){
	canvas = document.getElementById("backgroundCanvas");
	canvas2 = document.getElementById("onTopCanvas");
	document.getElementById("code").addEventListener("mouseover", mouseOverCode);
	document.getElementById("code").addEventListener("mouseout", mouseOutCode);
	init();
	app.renderer.resize(window.innerWidth, window.innerHeight);
	nameDOM = document.getElementById("mainContainer");
		document.addEventListener('wheel', doScrollAction, false);
}

function doScrollAction(event) {
	let isFirefox = typeof InstallTrigger !== 'undefined';
	event.preventDefault();
	var delta = 0;
	if (!event) event = window.event;
	// normalize the delta
	delta = -event.deltaY / 2 - (event.deltaX/2);
	if (isFirefox){
		delta*=2;
	}else{
		delta*=.5;
	}

	//calculating the next position of the object
	deltaScrollY+=delta;
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
	app2 = new PIXI.Application({
		view: canvas2,
		width: window.innerWidth,
		height: window.innerHeight,
		resolution: window.devicePixelRatio,
		autoDensity: true,
		antialias: true,
		transparent: true
	});
	width = app.screen.width;
	height = app.screen.height;
	app2Graphic = new PIXI.Graphics();
	starsGraphic = new PIXI.Graphics();
	starShieldGraphic = new PIXI.Graphics();
	groundCoverGraphic = new PIXI.Graphics();
	groundGraphic = new PIXI.Graphics();
	groundLineGraphic = new PIXI.Graphics();
	groundLineHorizonGraphic = new PIXI.Graphics();
	fogGraphic = new PIXI.Graphics();

	let reflectionFilter = new PIXI.filters.ReflectionFilter();
	reflectionFilter.alpha = [.3,.9];
	reflectionFilter.boundary = .7;
	reflectionFilter.amplitude = [1,0]
	reflectionFilter.waveLength = [1,100];
	let glowFilter = new PIXI.filters.GlowFilter();
	glowFilter.distance = 20;
	glowFilter.outerStrength = 10;
	glowFilter.color = hslToHex(.8,1,1);
	glowFilter.knockout = true;
	glowFilter.quality = .2
	let blurFilter = new PIXI.filters.BlurFilter();
	let blurFilter2 = new PIXI.filters.BlurFilter();
	let blurFilter3 = new PIXI.filters.KawaseBlurFilter(60,8,true);
	let blurFilter4 = new PIXI.filters.KawaseBlurFilter(80,8,true);
	let blurFilter5 = new PIXI.filters.KawaseBlurFilter(5,8,true);
	let glitchFilter = new PIXI.filters.GlitchFilter({
		slices: 10,
		offset: 10,
		fillMode: 2 //LOOP
	});
	CRTFilter = new PIXI.filters.CRTFilter();
	CRTFilter.curvature = 2;
	CRTFilter.vignetting = .2;
	CRTFilter.vignettingBlur = .2;
	CRTFilter.noise = .05;
	CRTFilter.noiseSize	= 1;
	CRTFilter.lineWidth = 3;
	CRTFilter.lineContrast = .05;
	blurFilter.blur = 25;
	blurFilter.quality = 5;
	blurFilter2.blur = 1;

	app.stage.padding = 300;
	fogGraphic.padding = 300;
	starShieldGraphic.filters = [blurFilter4];
	//starsGraphic.filters = [reflectionFilter];
	groundGraphic.filters = [blurFilter];
	groundLineGraphic.filters = [blurFilter2];
	fogGraphic.filters = [blurFilter3];
	groundLineHorizonGraphic.filters = [blurFilter5];

	groundGraphic.blendMode = PIXI.BLEND_MODES.ADD;
	app2Graphic.filters = [CRTFilter];
	//app2.stage.filters = [CRTFilter];
	app2.ticker.maxFPS = 90;
	app.stage.addChild(starsGraphic);
	app.stage.addChild(starShieldGraphic);
	app.stage.addChild(groundCoverGraphic);
	app.stage.addChild(groundGraphic);
	app.stage.addChild(fogGraphic);
	app.stage.addChild(groundLineGraphic);
	app.stage.addChild(groundLineHorizonGraphic);
	app2.stage.addChild(app2Graphic);
	app.ticker.maxFPS = 0;
	app.ticker.add(animationLoop);
}

function doGlitchAnimation() {
	let shudderSize = 5;
	let obj = document.getElementById("glitch-mask-left");
	let randY = shudderSize*(Math.random()-0.5);
	let randX = shudderSize*(Math.random()-0.5);
	obj.setAttribute("transform","translate("+randX+","+randY+ ")")
	obj = document.getElementById("glitch-mask-right");
	randY = shudderSize*(Math.random()-0.5);
	randX = shudderSize*(Math.random()-0.5);
	obj.setAttribute("transform","translate("+randX+","+randY+ ")")
	if(Math.random()<.9){return}

	for(let i = 0; i < 7; i++){
		let rect = document.getElementById("rect" + i);
		randX = Math.random()*60;
		randY = Math.random()*100;
		let randHeight = Math.random()*20;
		let randWidth = Math.random()*30+70
		rect.setAttribute("x",randX + "%");
		rect.setAttribute("y",randY+ "%");
		rect.setAttribute("width",randWidth + "%");
		rect.setAttribute("height",randHeight+ "%");
	}
}

function animationLoop() {
	doGlitchAnimation();
	doScrollingStuff();
	drawBottomGrid();
	drawHorizon();
	drawFog();
	generateStars(200,3);
}

function doScrollingStuff() {
	width = app.screen.width;
	height = app.screen.height;
	TOP = (height / 2) - (height / 5) - scrollY / 2;
	let isScrolling = !(oldDeltaScrollY == deltaScrollY);
	if (isScrolling){
		notScrollingFrames = 0;
	}else{
		notScrollingFrames +=1;
	}

	//if we go too far to the right, slow our delta
	if (scrollY > 200 && deltaScrollY > 0) {
		deltaScrollY *= .5;
	}
	//if we go too far to the left, slow our delta
	if (scrollY <= -width && deltaScrollY < 0) {
		deltaScrollY *=.1 ;
	}
	let TOPSPEED = 200;
	if(deltaScrollY > TOPSPEED){
		deltaScrollY*=.8
	}
	if(deltaScrollY < -TOPSPEED){
		deltaScrollY*=.8
	}
	scrollY += deltaScrollY;
	deltaScrollY *= .8;
	//if we are any bit to the right
	if (scrollY > 0) {
		deltaScrollY -= .08 * Math.abs(scrollY);
		if (scrollY < 100) {
			deltaScrollY *= .4;
		}
		if (deltaScrollY < -10) {
			deltaScrollY += 2.5;
		}
	}else {
		//if we are to to the left
		if (notScrollingFrames > 13) {
			//if we are less than half way to the next point, go back to first stop
			if (scrollY > -width / 2) {
				deltaScrollY += .05 * Math.abs(scrollY);
			} else{
				if(scrollY > -1 * width) {//if we aren't past, go towards
					deltaScrollY -= .1 * Math.abs(scrollY + width);
				}
			}
		}
		if (scrollY < -1 * (width / 2)) {
			if (scrollY < -1 * width) {
				deltaScrollY += .1 * Math.abs(scrollY + width);
			}
			if(Math.abs(scrollY + width) < 40) {
				deltaScrollY *= .4;
			}
			if(Math.abs(scrollY + width) < 200) {
				deltaScrollY *= .8;
			}
		}
	}
	oldDeltaScrollY = deltaScrollY;
	nameDOM.style.marginLeft = scrollY + "px";

}


function generateStars(num, size){
	//return
	starsGraphic.clear();
	for (var i = starsGraphic.children.length - 1; i >= 0; i--) {
		starsGraphic.removeChild(starsGraphic.children[i]);
	};
	var star1Texture = PIXI.Texture.from('img/stars-tiled.jpg');
	var starsTexture = PIXI.Texture.from('img/stars-tiled-2-min (1).png');
	r = mulberry32(6969); //seed random number gen, generate numbers by calling r()
	for(var x = scrollY/50; x < width+100; x+=(55+(r()*1))*3){
		for(var y = 0; y < height; y+=3*(95+(r()*1))){
			var s = Math.pow(r(), 500)*size*10; //math.pow makes larger stars less common
			let starX = x+r()*40;
			let starY = (((((y+r()*10)+(time)))-(TOP)) %
				(height*1))-(.3*(TOP));//Math.floor(offset*10);
			let star = null;
			//if(Math.abs(starY - height/2) > 400){
			star = new PIXI.Sprite(starsTexture);
			star.scale.set(.35);
			star.anchor.set(.8);
			star.alpha = 1;
			star.angle = r() *  360;
			star.position.x = starX;
			star.position.y = starY;
			//if(Math.abs(star.position.y - height/2) > 300) {
				//star.blendMode = PIXI.BLEND_MODES.ADD;
			//}
			starsGraphic.addChild(star);
		}
	}

	drawStarShield(width, height);
	drawGroundCover(height, width);
	//graphic.endFill();
}

function drawStarShield(width, height) {
	app2Graphic.clear();
	app2Graphic.alpha=1;
	app2Graphic.beginFill(hslToHex(0,0,.95));
	app2Graphic.drawRect(0,0,width,height);
	app2Graphic.drawRect(width-10,height-10,10,10);
	CRTFilter.seed = Math.random();
	CRTFilter.time += 0.2;
	starShieldGraphic.clear();
	starShieldGraphic.beginFill(0x000000);
	starShieldGraphic.alpha = .9
	starShieldGraphic.drawEllipse(width / 2, 6 * height / 8, width / 1.5, height / 2);
	starShieldGraphic.drawEllipse(0, 0, 1, 1);
}

function drawGroundCover(height, width) {
	groundCoverGraphic.clear();
	groundCoverGraphic.beginFill(0x000000);
	groundCoverGraphic.alpha = 1;
	groundCoverGraphic.drawRect(0, height - (TOP), width, height + 100)
}

function drawBottomGrid() {
	let XDIV = 330;
	let YDIV = 23;
	let ASPECT = 6.5;
	let SPEEDX = scrollY;
	let SPEEDY = -0.1;
	groundGraphic.clear();
	groundGraphic.alpha = 1;
	groundLineGraphic.clear();
	groundLineGraphic.alpha = 1;

	time += 0.1;
	//if()
	for (let i = 20; i > 1; i /= 2) {
		//graphic.alpha = 1/i;
		//let color = hslToHex(.82, 1, (1/i) );
		let color = hslToHex(.82, 1, (1 / i) / 4 + .75);
		//groundGraphic.lineStyle(i+.5, color, );
		groundLineGraphic.lineStyle({
			width: i + .5,
			color: color,
			alignment: 0.5,
			alpha: Math.sqrt(1 / (i*5)),
			cap: 'round',
		})
		matrixGround(XDIV, YDIV, TOP, ASPECT, SPEEDX, SPEEDY, groundLineGraphic);
	}
	groundLineGraphic.lineStyle({
		width: 2,
		color: hslToHex(.82, 1, 1),
		alignment: 0.5,
		alpha: .9,
		cap: 'round',
	})
	matrixGround(XDIV, YDIV, TOP, ASPECT, SPEEDX, SPEEDY, groundLineGraphic);

	let i = 20;
	let color = hslToHex(.82, .6, (1 / i) / 2 + .32);
	groundGraphic.lineStyle({
		width: i * 1.5,
		color: color,
		alignment: 0.5,
		alpha: 1,
		cap: 'round',
	})
	matrixGround(XDIV, YDIV, TOP, ASPECT, SPEEDX, SPEEDY, groundGraphic);
}

function drawFog() {
	fogGraphic.clear();
	fogGraphic.alpha = 1;
	fogGraphic.drawRect(0,0,1,1);
	fogGraphic.drawRect(width-1,height-1,1,1);

	let o = 40; //overlap constant
	let xOffset =scrollY/5
	fogGraphic.beginFill(hslToHex(.6,1,.4),.25);
	fogGraphic.drawEllipse(3*width/4+xOffset,height/2,
		width/3.5-xOffset,height/2);
	fogGraphic.beginFill(hslToHex(.6,1,.4),.2);
	fogGraphic.drawRect(width/2-width/o+xOffset,height/40,
		3*width/8+width/o-xOffset,height-height/20);

	fogGraphic.beginFill(hslToHex(.83,1,.4),.25);
	fogGraphic.drawEllipse(width/4-xOffset,height/2,
		width/3.5-xOffset,height/2);

	fogGraphic.beginFill(hslToHex(.83,1,.4),.2);
	fogGraphic.drawRect(width/8-xOffset,height/40,
		3*width/8+width/o-xOffset,height-height/20);
	//fogGraphic.blendMode = PIXI.BLEND_MODES.ADD;
}

function drawHorizon() {
	groundLineHorizonGraphic.clear();
	groundLineHorizonGraphic.beginFill(0xFFFFFF);
	groundLineHorizonGraphic.alpha = 1;
	groundLineHorizonGraphic.drawEllipse(width/2,height-(TOP),width/1.8,height/140);
	groundLineHorizonGraphic.drawRect(0,0,.1,.1);
	groundLineHorizonGraphic.drawRect(width,height,.1,.1);
}




function matrixGround(xdiv, ydiv, top, aspect, speedX, speedY, graphic){
	/***vertical line loop:***/
	//Calculate the extra lines needed to compensate for the X aspect not making it all the way to the edge of the canvas
	var extra = Math.abs(width - (width * aspect)) / 2;
	var timeModifierX = (speedX) % xdiv
	//loops from before 0 to cover the whole canvas, keep looping until after width for the same reason
	for(var x = (-1 * extra) + timeModifierX; x < width + extra; x += xdiv){
		//devide the x position by the aspect to simulate perspective
		//use arious maths to keep the perspective centered
		var x0 = (( x - (width/2)) / aspect) + (width/2);
		//draw vertical lines
		line(x0,	height-top, x,	height, graphic);
	}
	/***horizontal line loop:***/
	var timeModifierY = -1 * ((time * speedY) % 1);
	//doesn't loop using acual Y coordinates because we need to scale everything quadratically to emulate perspective
	for(var y = timeModifierY; y * y * ydiv / aspect < top+1; y++){
		//makes everything further away as it gets closer to the bottom of the screen
		var newY = (height-top) + (y * ydiv * (y) / aspect);
		//draw horizontal lines
		line(0, newY, width, newY, graphic)
	}
}

function line(x0,y0,x1,y1, graphic){
	graphic.moveTo(x0,y0);
	graphic.lineTo(x1,y1);
}
function sin(x){
	return Math.sin(x);
}
window.addEventListener("resize", function () {
	app2.renderer.resize(window.innerWidth, window.innerHeight);
	app.renderer.resize(window.innerWidth, window.innerHeight);
	generateStars(200,3);
});
function mouseOverCode() {
	//document.getElementById("h2Container").style.fontFamily = "Courier New,Courier,monospace";
}
function mouseOutCode() {
	//document.getElementById("h2Container").style.fontFamily = "Inter, sans-serif";
}
function mulberry32(a) {
	return function() {
		var t = a += 0x6D2B79F5;
		t = Math.imul(t ^ t >>> 15, t | 1);
		t ^= t + Math.imul(t ^ t >>> 7, t | 61);
		return ((t ^ t >>> 14) >>> 0) / 4294967296;
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