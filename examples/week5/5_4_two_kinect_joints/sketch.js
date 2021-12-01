// The Body Everywhere and Here Class 5: Example — Multiple kinectron
// https://github.com/lisajamhoury/The-Body-Everywhere-And-Here-2021/

// This example connects to two Kinects via Kinectron and 
// demonstrates a simple interaction between the two participants using joint info

let k1, k2;
let joints1 = [];
let joints2 = [];

function setup() {
  // canvas set at 16:9 ratio for drawing
  createCanvas(960, 540);

  // define kinects and their locations 
  k1 = new Kinectron("10.18.223.153")
  k2 = new Kinectron("10.18.134.167")

  // set kinect types 
  k1.setKinectType("azure");
  k2.setKinectType("azure");

  // start body tracking for each device
  k1.startTrackedBodies(gotK1);
  k2.startTrackedBodies(gotK2);

  // start the connections 
  k1.makeConnection();
  k2.makeConnection();
}

// put the joint info in a global variable 
function gotK1(bodies) { 
  joints1 = bodies.skeleton.joints;
}

// put the joint info in a global variable 
function gotK2(bodies) { 
  joints2 = bodies.skeleton.joints;
}

function draw() {
  background(0);

  // make sure we have data 
  if (joints1.length < 1 || joints2.length < 1) return;

  // get hip positioning 
  const hip1 = getHips(joints1);
  const hip2 = getHips(joints2);

  // get distance between two people's hips
  const db = abs(hip1.x-hip2.x);

  // draw the joints 
  drawJoints(joints1,db);
  drawJoints(joints2,db);
}

function drawJoints(joints,db) {
  // map the distance to size of joint
  const size = map(db, 0, width/2,2,50);
  
  // draw each joint
  for (let i =0; i < joints.length; i++ ) { 
    const x = joints[0].colorX * width; // lock the x to the hip position
    const y = joints[i].colorY * height; // use the y of individual joint 

    fill(255);
    ellipse(x,y,size);

  }
}
// returns an object with the hip position
function getHips(joints) { 
  return {
    x:joints[0].colorX * width,
    y:joints[0].colorY * height,
  }
}