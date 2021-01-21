//GLOBAL VARS
let bloom = null;
let lighten = null;
let areHovering;
let app = null;
let app2 = null;
let CRT = null;
let fpsBelowThreshold = 0;
let fpsAboveThreshold = 0;
let graphicsQuality = 0;
let canvas = null; let canvas2 = null;
let app2Graphic = null; let groundGraphic = null; let groundLineGraphic = null; let groundCoverGraphic = null; let groundLineHorizonGraphic = null; let starsGraphic = null; let starShieldGraphic = null; let fogGraphic = null;
let blur = null;
let time = 0;
let width = 0; let height = 0;
let scrollY = -20; let oldDeltaScrollY = 0; let deltaScrollY = 0;
let notScrollingFrames = 40;
let TOP = 0;
let nameDOM = null;
window.onload = function(){
	let name = document.getElementById("name");
	name.addEventListener("mouseenter", function(){areHovering = true})
	name.addEventListener("mouseleave", function(){areHovering = false})
	let bio = document.getElementById("bioFrame");
	name.addEventListener("click", function(event){deltaScrollY =-120;});
	bio.addEventListener("click", function(event){deltaScrollY = 120;});
	canvas = document.getElementById("backgroundCanvas");
	canvas2 = document.getElementById("onTopCanvas");
	document.getElementById("code").addEventListener("mouseover", mouseOverCode);
	document.getElementById("code").addEventListener("mouseout", mouseOutCode);
	init();
	app.renderer.resize(window.innerWidth, window.innerHeight);
	nameDOM = document.getElementById("mainContainer");
	document.addEventListener('wheel', function(event) {
		let isFirefox = typeof InstallTrigger !== 'undefined';
		let delta = 0;
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
	}, false);
}

function initFilters() {
	lighten = new PIXI.filters.AdjustmentFilter();
	lighten.brightness = 1.2;
	let blurFilter = new PIXI.filters.BlurFilter();
	blurFilter.blur = 25; blurFilter.quality = 5;
	let blurFilter2 = new PIXI.filters.BlurFilter();
	blurFilter2.blur = 1; blurFilter2.quality = 2;
	let blurFilter3 = new PIXI.filters.KawaseBlurFilter(60, 8, true);
	let blurFilter4 = new PIXI.filters.KawaseBlurFilter(80, 8, true);
	let blurFilter5 = new PIXI.filters.KawaseBlurFilter(5, 8, true);
	blur = new PIXI.filters.KawaseBlurFilter(0, 3, true);
	bloom = new PIXI.filters.AdvancedBloomFilter();
	bloom.threshold =0; bloom.bloomScale = .3; bloom.brightness = .9; bloom.blur = 0; bloom.quality = 5;
	CRT = new PIXI.filters.CRTFilter();
	CRT.curvature = 2; CRT.vignetting = .2; CRT.vignettingBlur = .2; CRT.noise = .1; CRT.noiseSize = 3; CRT.lineWidth = 3; CRT.lineContrast = .05;
	starShieldGraphic.filters = [blurFilter4];
	groundGraphic.filters = [blurFilter];
	groundLineGraphic.filters = [blurFilter2];
	fogGraphic.filters = [blurFilter3];
	groundLineHorizonGraphic.filters = [blurFilter5];
	groundGraphic.blendMode = PIXI.BLEND_MODES.ADD;
	app2Graphic.filters = [CRT];
}

function initGraphics() {
	app2Graphic = new PIXI.Graphics();
	starsGraphic = new PIXI.Graphics();
	starShieldGraphic = new PIXI.Graphics();
	groundCoverGraphic = new PIXI.Graphics();
	groundGraphic = new PIXI.Graphics();
	groundLineGraphic = new PIXI.Graphics();
	groundLineHorizonGraphic = new PIXI.Graphics();
	fogGraphic = new PIXI.Graphics();
	fogGraphic.padding = 300;
}

function init(){
	PIXI.utils.skipHello();
	app = new PIXI.Application({
		view: canvas,
		width: window.innerWidth,
		height: window.innerHeight,
		resolution: window.devicePixelRatio,
		autoDensity: true,
		antialias: false
	});
	app2 = new PIXI.Application({
		view: canvas2,
		width: window.innerWidth,
		height: window.innerHeight,
		resolution: window.devicePixelRatio,
		autoDensity: true,
		antialias: false,
		transparent: true
	});
	width = app.screen.width;
	height = app.screen.height;

	initGraphics();
	initFilters();

	//app2.ticker.maxFPS = 90;
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

function animateCRT() {
	CRT.seed = Math.random();
	CRT.time += 0.2*(60/app.ticker.FPS);
}

function animationLoop() {
	if(app.ticker.FPS < 24){
		fpsBelowThreshold++;
	}
	if(app.ticker.FPS > 50){
		fpsAboveThreshold++;
	}
	if(fpsBelowThreshold > 10){
		fpsBelowThreshold = 0;
		graphicsQuality--;
	}
	if(fpsAboveThreshold > 70){
		fpsAboveThreshold = 0;
		graphicsQuality++;
	}
	animateCRT();
	if(areHovering) {
		doGlitchAnimation();
	}
	doScrollingStuff();
	drawBottomGrid();
	drawHorizon();
	drawFog();
	generateStars(200,3);
}

function doScrollingStuff() {
	width = app.screen.width;
	height = app.screen.height;
	if(width > 800){
		document.getElementById("bioContents").style.width = "40vw"
		document.getElementById("flexBio").style.flexDirection = "row-reverse";
	}else{
		document.getElementById("bioContents").style.width = "80vw"
		document.getElementById("flexBio").style.flexDirection = "column-reverse";
	}
	TOP = ((height / 2) - (height / 5)) - (scrollY)*(height/width);
	let isScrolling = !(oldDeltaScrollY == deltaScrollY);
	let startScroll = scrollY;
	if (isScrolling){
		notScrollingFrames = 0;
	}else{
		notScrollingFrames +=1;
	}
	let smoothness = 230;
	if(notScrollingFrames > 0){
		let smoothOffset = ((smoothness - Math.min(notScrollingFrames, smoothness)) / smoothness)/10;
		if(-scrollY < width/2) {
			scrollY *= (0.9+smoothOffset);
		}else{
			let dis = scrollY + width;
			scrollY -= dis*(.1-smoothOffset);
		}
	}
	scrollY += deltaScrollY*60/app.ticker.FPS;
	deltaScrollY *= .9; //* Math.max(1, app.ticker.FPS/60);
	if(scrollY > 0){
		scrollY = 0;
	}
	if(scrollY < -width){
		scrollY = -width;
	}
	oldDeltaScrollY = deltaScrollY;
	//console.log(app.ticker.FPS + " " + graphicsQuality)
	let endScroll = scrollY;
	let isNotScrolling = Math.abs(startScroll-endScroll) < 1
	if(graphicsQuality >= 3 ){
		bloom.quality = 5;
		if(!isNotScrolling){
			for(let j = 0; j < document.querySelectorAll("u").length; j++) {
				document.querySelectorAll("u")[j].style.filter = "url(#filterNoGlitch) drop-shadow(0px 0px 9px rgba(255,255,255,.1))"
			}
		}
		app.stage.filters = [bloom];
		if(areHovering) {
			document.getElementById("name").style.filter = "url(#filter) drop-shadow(0px 0px 20px rgba(255,255,255,.2))";
		}else {
			document.getElementById("name").style.filter = "url(#filterNoGlitch) drop-shadow(0px 0px 20px rgba(255,255,255,.2))";
		}
	} else if(graphicsQuality >= 2){
		if(isNotScrolling){
			if(areHovering) {
				document.getElementById("name").style.filter = "url(#filter) drop-shadow(0px 0px 20px rgba(255,255,255,.2))";
			}else {
				document.getElementById("name").style.filter = "url(#filterNoGlitch) drop-shadow(0px 0px 20px rgba(255,255,255,.2))";
			}
		}else{
			document.getElementById("name").style.filter = "drop-shadow(0px 0px 20px rgba(255,255,255,.2))";
		}
	} else if(graphicsQuality >= 1){
		if(isNotScrolling){
			if(areHovering) {
				document.getElementById("name").style.filter = "url(#filter) drop-shadow(0px 0px 20px rgba(255,255,255,.2))";
			}else {
				document.getElementById("name").style.filter = "drop-shadow(0px 0px 20px rgba(255,255,255,.2))";
			}
		}else{
			document.getElementById("name").style.filter = "drop-shadow(0px 0px 20px rgba(255,255,255,.2))";
		}
	} else if(graphicsQuality >= 0){

		for(let j = 0; j < document.querySelectorAll("U").length; j++) {
			document.querySelectorAll("u")[j].style.removeProperty('filter');
		}
		if(isNotScrolling){
			if(areHovering) {
				document.getElementById("name").style.filter = "drop-shadow(0px 0px 20px rgba(255,255,255,.2))";
			}else {
				document.getElementById("name").style.filter = "";
			}
		}else{
			document.getElementById("name").style.filter = "";
		}
	} else if(graphicsQuality >= -1){
		bloom.quality = 0;
	}else{

		app.resolution = window.devicePixelRatio/(graphicsQuality/-1);
		app.stage.filters = [lighten];
	}
	if(window.safari !== undefined){
		document.getElementById("name").style.filter = "";
		for(let j = 0; j < document.querySelectorAll("u").length; j++) {
			document.querySelectorAll("u")[j].style.filter = '';
		}
	}
	nameDOM.style.transform = "translate("+Math.ceil(scrollY) + "px, 0px)";
	lighten.alpha = 1 - ((Math.pow(Math.abs(scrollY/width),3))*.8);
	lighten.contrast = 1-((Math.pow(Math.abs(scrollY/width),5))*.2)
	bloom.brightness =  .9 - (Math.pow(Math.abs(scrollY/width),3));
	bloom.blur = (Math.pow(Math.abs(scrollY/width),2))*.3

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