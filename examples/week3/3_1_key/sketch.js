function setup() {
  // this canvas is the resolution of the kinect rgb feed
  createCanvas(640, 360);

  // create an instance of kinectron 
  // see https://kinectron.github.io/#/api/getting-started
  let kinectron = new Kinectron("10.18.234.182"); // add the address of your kinect server here!
  kinectron.setKinectType("azure"); 
  kinectron.makeConnection();

  // start the key feed 
  // see https://kinectron.github.io/#/api/azure?id=request-a-frame
  kinectron.startKey(drawKey);
}

// this function is called when the program receives a keyimage from the kinect 
function drawKey(keyImage) { 
  // load the image, and call drawImage callback 
  // https://p5js.org/reference/#/p5/loadImage
  loadImage(keyImage.src, drawImage);
}

// draw the key image on top of a single color bg
function drawImage(img) { 
  background(255,50,255);
  image(img, 0,0,width,height);
}

// draw loop is empty 
// all drawing is triggered when the sketch 
// receives data from the kinect 
function draw() {
  // background(220);
}
