function setup() {
  // set the canvas at the resolution of the kinect depth feed 
  createCanvas(640, 576);

  // create an instance of kinectron 
  // see https://kinectron.github.io/#/api/getting-started
  let kinectron = new Kinectron("10.18.234.182");
  kinectron.setKinectType("azure");
  kinectron.makeConnection();
  // start depth feed 
  // see https://kinectron.github.io/#/api/azure?id=request-a-frame
  kinectron.startDepth(drawDepth);
}

// this function is called when the program receives a depth image from the kinect 
function drawDepth(depthImage) { 
  // load the image, and call drawImage callback 
  // https://p5js.org/reference/#/p5/loadImage
  loadImage(depthImage.src, drawImage);
}

// this function is called with the image is loaded
function drawImage(img) { 
  // load the depth image pixels 
  img.loadPixels();
  // put them in a variable 
  const depthPix = img.pixels; 
  
  // load the pixels from the canvas 
  loadPixels();

  // loop through all the pixels 
  for (let y = 0; y < height; y++) { 
    for (let x =0; x < width; x++) { 

      // get index for the r value of the current pixel
      const i = (y*width+x) * 4;

      // the depth value is equal to the value of the 
      // r, g, or b values in the depth image 
      // so we'll use the r value to get the depth value
      const depthVal = depthPix[i]; // 0-255 

      // map the depth value, which is from 0-255
      // to a number between 0-1
      const mappedVal = map(depthVal,0,255,0,1);

      // use the mapped depth value as the hue value in HSV color 
      // convert the HSV color to RGB to use in the pixel array
      // using HSV color allows us to move smoothly through a color gradient of hues 
      const newClr = HSVtoRGB(mappedVal,1.0,1.0);

      // put the new color in the canvas pixel array 
      pixels[i+0] = newClr.r;
      pixels[i+1] = newClr.g;
      pixels[i+2] = newClr.b;
      pixels[i+3] = 255; // set opacity to fully opaque




    }
  }

  // update the pixel array 
 updatePixels();
}

// nothing happpens in the draw loop
// all action happens when the sketch 
// receives data from the kinect 
function draw() {
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
