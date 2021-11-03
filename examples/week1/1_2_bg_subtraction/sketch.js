// The Body Everywhere and Here Class 1: Example 2 — Background Subtraction
// https://github.com/lisajamhoury/The-Body-Everywhere-And-Here-2021/

// Using the webcam in p5.js, this example removes the background of a
// video by finding the difference between the current webcam image frame
// and a background image that is set by the user

// Click "set background" button to set the background

// variable for my webcam video
let myVideo;
// variables for the cat image
let catImage;
let catPixels = [];

// initialize to an empty array with []
// this is important so that we can copy into it later
let bgPixels = [];

// variable for my slider
let threshSlider;

// preload() is a p5 function
// see p5 preload documentation if this is new to you
// https://p5js.org/reference/#/p5/preload
function preload() {
  // load my image into p5
  catImage = loadImage(
    "https://raw.githubusercontent.com/lisajamhoury/The-Body-Everywhere-and-Here-2021/main/examples/assets/cat.jpg"
  );
}

function setup() {
  // create a p5 canvas at the dimensions of my webcam
  createCanvas(640, 480);

  // load pixels tells p5 to make the image or video pixel array available at .pixels
  // see p5 documentation https://p5js.org/reference/#/p5/loadPixels
  // see Coding Train video on pixel array https://www.youtube.com/watch?v=nMUMZ5YRxHI
  catImage.loadPixels();
  // use the spread operator to copy the pixel array into a different array
  // for more on the spread operator
  // see https://www.samanthaming.com/tidbits/35-es6-way-to-clone-an-array/#why-can-t-i-use-to-copy-an-array
  // and https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax
  catPixels = [...catImage.pixels];

  // set threshold range to 0-255, default value is 100
  // 255 is the maximum range for the r,g,b channels of any pixels
  threshSlider = createSlider(0, 255, 100);

  // create a button that says 'set bg'
  const bgButton = createButton("Set BG");
  // when the button is pressed run setBG() function
  bgButton.mousePressed(setBG);

  // create a p5 webcam, then hide it
  myVideo = createCapture(VIDEO);
  myVideo.size(width, height); // video size is same as canvas
  myVideo.hide();
}

// this saves the current webcam video frame
// to the background pixel array
function setBG() {
  console.log("setting bg!!");

  // see above documentation on loadPixels
  myVideo.loadPixels();
  // see documentation above on spread operator
  bgPixels = [...myVideo.pixels];
}

function draw() {
  // background(220);

  // get the threshold value from the slider
  // all webcams will have some natural noise that looks like "movement"
  // the threshold tells the program what level of change we consider movement
  const threshValue = threshSlider.value();

  // see above documentation on loadPixels
  myVideo.loadPixels();

  // get the current pixels from pixel array (documentation above)
  const currentPixels = myVideo.pixels;

  // go through every pixel of the video
  // y moves down from row to row
  // x moves across the row
  // think of it like a typewriter — x is typing across, y is the return to new line
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      // get the current position (index) in the array
      // if this is new to you watch the coding train video referenced above
      const i = (y * width + x) * 4;

      // get the difference between the saved background frame and the current frame
      // for each channel of the image: r, g, b, channels
      const diffR = abs(currentPixels[i + 0] - bgPixels[i + 0]);
      const diffG = abs(currentPixels[i + 1] - bgPixels[i + 1]);
      const diffB = abs(currentPixels[i + 2] - bgPixels[i + 2]);

      // get the average difference for the pixel from the 3 color channels

      const avgDiff = (diffR + diffB + diffG) / 3;

      // if the difference between frames is less than the threshold value
      if (avgDiff < threshValue) {
        // turn the pixel black
        currentPixels[i + 0] = 0;
        currentPixels[i + 1] = 0;
        currentPixels[i + 2] = 0;
      } else {
        // otherwise, show me the cat!!!
        // get the corresponding pixels from the catPixels array
        currentPixels[i + 0] = catPixels[i + 0];
        currentPixels[i + 1] = catPixels[i + 1];
        currentPixels[i + 2] = catPixels[i + 2];
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
  translate(width, 0);
  // flip the horizontal access with -1 scale
  scale(-1, 1);
  // draw the updated video to the canvas
  image(myVideo, 0, 0, width, height);
  pop();
}
