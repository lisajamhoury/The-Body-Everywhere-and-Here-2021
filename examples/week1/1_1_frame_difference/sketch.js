// The Body Everywhere and Here Class 1: Example 1 — Frame Difference
// https://github.com/lisajamhoury/The-Body-Everywhere-And-Here-2021/

// This example uses the webcam in p5.js to detect movement by
// finding the difference between a current webcam image frame
// and the previous frame.

// variable for my webcam video
let myVideo;

// variable for my slider
let threshSlider;

// initialize prevPixels to an empty array with []
// this is important so that we can copy into it later
let prevPixels = [];

// setup() is a p5 function
// see this example if this is new to you
// https://p5js.org/examples/structure-setup-and-draw.html
function setup() {
  
  // create a p5 canvas at the dimensions of my webcam
  createCanvas(640, 480);

  // create a p5 webcam, then hide it
  myVideo = createCapture(VIDEO);
  myVideo.size(width,height); // see p5 documentation for width, height
  myVideo.hide(); // hide the webcam which appears below the canvas by default

  // set threshold range to 0-255
  // 255 is the maximum range for the r,g,b channels of any pixels
  threshSlider = createSlider(0,255,100);
}

// draw() is a p5 function
// see this example if this is new to you
// https://p5js.org/examples/structure-setup-and-draw.html
function draw() {
  //background(220);

  // get the threshold value from the slider
  // all webcams will have some natural noise that looks like "movement"
  // the threshold tells the program what level of change we consider  movement
  const threshValue = threshSlider.value();

  // load pixels tells p5 to make the videos pixel array available at .pixels
  // see p5 documentation https://p5js.org/reference/#/p5/loadPixels
  // see Coding Train video on pixel array https://www.youtube.com/watch?v=nMUMZ5YRxHI
  myVideo.loadPixels();

  // get the current pixels from pixel array (documentation above)
  const currentPixels = myVideo.pixels;

  // go through every pixel of the video
  // y moves down from row to row
  // x moves across the row
  // think of it like a typewriter — x is typing across, y is the return to new line
  for (let y = 0; y < height; y++) {
    for (let x =0; x < width; x++) { 
      
      // get the current position (index) in the array
      // if this is new to you watch the coding train video referenced above
      const i = (y*width+x) * 4;

      // get the difference between the new last frame and the current frame
      // for each channel of the image: r, g, b, channels
      const diffR = abs(currentPixels[i+0]-prevPixels[i+0]);
      const diffG = abs(currentPixels[i+1]-prevPixels[i+1]);
      const diffB = abs(currentPixels[i+2]-prevPixels[i+2]);

      // set past pixels to current pixels
      // do this before we alter the current pixels in the coming lines of code
      prevPixels[i+0] = currentPixels[i+0];
      prevPixels[i+1] = currentPixels[i+1];
      prevPixels[i+2] = currentPixels[i+2];

      // get the average difference for the pixel from the 3 color channels
      const avgDiff = (diffR + diffG+ diffB)/3;

      // if the difference between frames is less than the threshold value
      if (avgDiff < threshValue) { 
        // turn the current pixel black
        currentPixels[i+0] = 0;
        currentPixels[i+1] = 0;
        currentPixels[i+2] = 0;
      } else { 
        // otherwise, turn it a nice red 
        // comment these three line out to show natural color of image
        currentPixels[i+0] = 100;
        currentPixels[i+1] = 100;
        currentPixels[i+2] = 255;
      }
    }
  }

  // update pixels
  // if this is not familiar watch the coding train video referenced above
  myVideo.updatePixels();

  // this is a p5 function that saves the current drawing style 
  // settings and transformations, pop() restores these settings
  // see https://p5js.org/reference/#/p5/push
  // coding train https://www.youtube.com/watch?v=o9sgjuh-CBM
  push();
  // flip the video image to be a mirror image of the user
  // translate to the right corner of the canvas
  translate(width,0);
  // flip the horizontal access with -1 scale
  scale(-1,1);
  // draw the updated video to the canvas
  image(myVideo, 0,0,width,height);
  pop();
}
