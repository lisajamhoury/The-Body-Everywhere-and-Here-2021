// global variable for joints 
let joints = [];

function setup() {
  // canvas is same resolution as rgb kinect image
  createCanvas(640, 360);

  // create an instance of kinectron 
  // see https://kinectron.github.io/#/api/getting-started
  let kinectron = new Kinectron("10.18.234.182");
  kinectron.setKinectType("azure");
  kinectron.makeConnection();
  kinectron.startTrackedBodies(drawBodies);
}

// this function is called when program receives data from the kinect 
function drawBodies(bodies) { 
  // put the joints in a global function 
  joints = bodies.skeleton.joints;
}

function draw() {
  // black background 
  background(0);

  // loop through the joints 
  for (let i = 0; i < joints.length; i++ ) { 
    // get the colorX and colorY coordinates
    // scale them to the size of the canvas 
    // by default colorX and colorY will be numbers between 0-1
    const x = joints[i].colorX * width;
    const y = joints[i].colorY * height;

    // draw circles for each joint
    fill(255,50,50);
    ellipse(x,y,20);
  }
}
