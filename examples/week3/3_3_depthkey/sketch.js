// global variable to hold depth values 
let depthVals = [];

function setup() {
  // set canvas at raw depth resolution 
  createCanvas(320, 288);

  // create an instance of kinectron 
  // see https://kinectron.github.io/#/api/getting-started
  let kinectron = new Kinectron("10.18.234.182");
  kinectron.setKinectType("azure");
  kinectron.makeConnection();
  kinectron.startDepthKey(drawDepth);
}

// this function is called when depth key data is received from kinect 
function drawDepth(depthValues) { 
  
  // put the received depth values in a global variable 
  // rather than an image, we receive an array of values 
  // depth values in depth key array are 16-bit depth values 
  depthVals = depthValues;
}


function draw() {  
  // load canvas pixels 
  loadPixels();

  // loop through all the depth values 
  for(let i =0; i < depthVals.length; i++) { 

      // the depth values are measured in mms and will be 
      // approximately 0-4000
      const depthVal = depthVals[i]; 

      // map the depth val to 0-1 
      const mappedVal = map(depthVal,500,2000,0,1);

      // use the mapped depth value as the hue value 
      // in hsv color 
      const newClr = HSVtoRGB(mappedVal,1.0,1.0);

      // multiply the index by 4 to use the new color 
      // in the pixel array 
      const index = i*4;

      // put the new color in the canvas pixel array 
      pixels[index+0] = newClr.r;
      pixels[index+1] = newClr.g;
      pixels[index+2] = newClr.b;
      pixels[index+3] = 255;
  }

// update the pixel array 
 updatePixels();



}

// https://stackoverflow.com/questions/17242144/javascript-convert-hsb-hsv-color-to-rgb-accurately/54024653
/* accepts parameters
 * h  Object = {h:x, s:y, v:z}
 * OR 
 * h, s, v
*/
function HSVtoRGB(h, s, v) {
  var r, g, b, i, f, p, q, t;
  if (arguments.length === 1) {
      s = h.s, v = h.v, h = h.h;
  }
  i = Math.floor(h * 6);
  f = h * 6 - i;
  p = v * (1 - s);
  q = v * (1 - f * s);
  t = v * (1 - (1 - f) * s);
  switch (i % 6) {
      case 0: r = v, g = t, b = p; break;
      case 1: r = q, g = v, b = p; break;
      case 2: r = p, g = v, b = t; break;
      case 3: r = p, g = q, b = v; break;
      case 4: r = t, g = p, b = v; break;
      case 5: r = v, g = p, b = q; break;
  }
  return {
      r: Math.round(r * 255),
      g: Math.round(g * 255),
      b: Math.round(b * 255)
  };
}
