var SPACING;
var OVERFLOW;
function setup() {
  c = createCanvas(window.innerWidth, window.innerHeight);
  c.position(0, 0);
  colorMode(HSB);
  SPACING = 50;
  OVERFLOW = -1;//Ammount of offscreen rendering done. Defaults to -1 because at some screen resolutions offscreen becomes onscreen.
}

function draw() {
  c = createCanvas(window.innerWidth, window.innerHeight);
  for(var x = OVERFLOW; x+OVERFLOW < width/SPACING; x++){
    for(var y = OVERFLOW; y+OVERFLOW < height/SPACING; y++){
      noStroke();
      fill(map(y*SPACING+x*SPACING,0,height+width, 0, 60), 255, 255, .5);
      pSize = 50 + 30*sin(x/2+y/2+millis()/1000);
      ellipse(x*SPACING,y*SPACING, pSize, pSize);
    }
  }
}