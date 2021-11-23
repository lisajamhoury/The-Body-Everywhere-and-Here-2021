// The Body Everywhere and Here Class 4: Example 2 — Posenet over peer connection
// https://github.com/lisajamhoury/The-Body-Everywhere-And-Here-2021/

// This example uses p5LiveMedia to send posenet data between two peers 
// over a peer connection 

// Open up two instances/tabs of the sketch for it to work
// Note! It may be hard to see one of the poses if you are 
// running both instances on your computer as the poses will 
// be drawn directly on top of each other 
// Try drawing the joint ellipses at different colors/sizes/opacities 
// to be able to see both poses

let p5lm;
let partnerPose = [];
let myPose = [];

function setup() {
  createCanvas(640, 480);

  const myVid = createCapture(VIDEO);
  myVid.size(width,height);
  myVid.hide();

  // create an instance of p5 live media 
  // that opens a data channel, and creates the meeting room "body-ewah-45"
  p5lm = new p5LiveMedia(this, "DATA", null, "body-ewah-45");
  // set callback for when data is received
  p5lm.on('data', gotPartnerPose);

  // create an instance with posenet 
  const posenet = ml5.poseNet(myVid);
  // set callback for when pose is received
  posenet.on('pose', gotMyPose);
}

function gotMyPose(poses) {
  // make sure there is a pose before continuing
  if (poses.length === 0) return;
  // get the keypoints 
  myPose = poses[0].pose.keypoints;
  // the sendind data must be turned into a string before sending
  p5lm.send(JSON.stringify(myPose));
}

function gotPartnerPose(data, id) {
  // put the data in a global variable 
  // data arrives as a string and must be parsed into JSON to be useable 
  partnerPose = JSON.parse(data);
}

function draw() {
  background(0);

  // draw my pose
  fill('red');
  for (let i = 0; i < myPose.length; i++) { 
    const x = myPose[i].position.x;
    const y = myPose[i].position.y;
    ellipse(x,y, 20);
  }
  
  // draw partner pose 
  fill('blue');
  for (let i = 0; i < partnerPose.length; i++) { 
    const x = partnerPose[i].position.x;
    const y = partnerPose[i].position.y;
    ellipse(x,y, 20);
  }
}
