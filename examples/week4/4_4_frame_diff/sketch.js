// The Body Everywhere and Here Class 4: Example 4 — Frame differencing over peer connection
// https://github.com/lisajamhoury/The-Body-Everywhere-And-Here-2021/

// This example uses p5LiveMedia to send a canvas between two peers 

// Open up two instances/tabs of the sketch for it to work

let p5lm;
let myVid;
let partnerVid = null;
let threshSlider;
let pastPix = [];
let pGraphic; 

function setup() {
  createCanvas(640, 480);

  // create an external graphics buffer at same size as canvas 
  pGraphic = createGraphics(width,height);
  // create an instance of p5 live media 
  // that streams the external graphics buffer to room "body-ewah-45"
  p5lm = new p5LiveMedia(this, "CANVAS", pGraphic, "body-ewah-45");
  // set a callback for when we receive a stream
  p5lm.on('stream', gotPartnerStream);

  // create and hide webcam
  myVid = createCapture(VIDEO);
  myVid.size(width,height);
  myVid.hide();

  // create a slider for background thresholding 
  threshSlider = createSlider(0,255,35);
}

function gotPartnerStream(stream, id) {
  // put the partner stread into a global variable to use later
  partnerVid = stream;
  partnerVid.hide();
}

function draw() {
  // load my video pixels 
  myVid.loadPixels();
  const myPixels = myVid.pixels;
  // get the threshold value
  const threshValue = threshSlider.value();

  // iterate through all the pixels 
  // if this doesn't feel familiar look back at class 1
  for (let y =0; y<height; y++ ) { 
    for (let x=0; x < width; x++) { 
      const i = (y*width+x)*4;

      // get the difference between past and current frame
      const diffR = abs(myPixels[i+0]-pastPix[i+0]);
      const diffG = abs(myPixels[i+1]-pastPix[i+1]);
      const diffB = abs(myPixels[i+2]-pastPix[i+2]);

      const avgDiff = (diffR+diffG+diffB)/3;

      // set the past pixels to the current pixels
      // we use this to compare previous and current frames
      pastPix[i+0] = myPixels[i+0];
      pastPix[i+1] = myPixels[i+1];
      pastPix[i+2] = myPixels[i+2];

      // if the average difference is less than the threshold 
      if (avgDiff < threshValue){ 

        // turn the pixel white 
        myPixels[i+0] = 255;
        myPixels[i+1] = 255;
        myPixels[i+2] = 255;
      }
    }    
  }

  // update my webcam pixels 
  myVid.updatePixels();

  // add a white transparent tint to the image
  tint(255,255,255,100);
  // draw my differenced image to the external graphics buffer 
  // THIS IS A REALLY IMPORTANT STEP! 
  // drawing to external graphics makes sure that 
  // we don't share our parners image back with them
  pGraphic.image(myVid,0,0,width,height);
  // draw the external graphics to the canvas 
  // flip the image to make sure image is mirrored
  push();
  translate(width,0);
  scale(-1,1);
  image(pGraphic,0,0,width,height);
  pop();

  // check that i have a partner video before returning 
  if (partnerVid === null) return;

  // draw partner vid with transparent white tint 
  tint(255,255,255,100);
  image(partnerVid,0,0,width,height);
  

}
