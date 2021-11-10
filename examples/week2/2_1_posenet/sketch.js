let myVid; 
let poses = [];
let smoothPoints = [];

function setup() {
  createCanvas(640, 480);

  // create an array of 17 keypoints
  for ( let i = 0; i < 17; i++) {
    smoothPoints.push(new Keypoint());
  }

  // create and hide webcam
  myVid = createCapture(VIDEO);
  myVid.size(width, height);
  myVid.hide();

  // posenet options 
  // use 'MobileNetV1' for slower computers
  const options = {
    flipHorizontal: true,
    architecture: 'ResNet50',
  }

  // create an instance of posenet, call modelLoaded on model load
  const poseNet = ml5.poseNet(myVid, options, modelLoaded);

  // everytime we receive a pose, call gotPoses 
  poseNet.on('pose', (results) => gotPoses(results));
}

function modelLoaded() {
  console.log('loaded!');

}

function gotPoses(results) {
  // put the results in a global variable 
  poses = results;
}

function drawPose() {
  // poses[0].pose.keypoints[0].position.x

  // loop through the poses, there is one pose for each person detected
  for (let i =0; i < poses.length; i++) { 
    // get the keypoints from the detected pose
    const keypoints = poses[i].pose.keypoints;

    // loop throuh keypoints 
    for (let j = 0; j < keypoints.length; j++ ) { 
      const x = keypoints[j].position.x;
      const y = keypoints[j].position.y;

      // update the keypoints and smooth them
      smoothPoints[j].update(x,y);

      // draw the smoothed points 
      fill('white');
      ellipse(smoothPoints[j].x,smoothPoints[j].y,20);

    }
  }
}

function draw() {
  background(220);

  // draw the image
  push();
  translate(width, 0);
  scale(-1,1);
  image(myVid, 0,0,width, height);
  pop();

  // draw the keypoints 
  drawPose();
}

// a class to smooth the keypoints 
class Keypoint {

  constructor() {
    this.x = null;
    this.y = null;
    this.pastX = [];
    this.pastY = [];
    this.smoothAmount = 5; // set smoothing amount here 

  } 

  update(x,y) { 
    this.pastX.push(x);
    this.pastY.push(y);

    let xSum = 0;
    let ySum = 0;

    // add together all of the x / y values 
    for (let i = 0; i < this.pastX.length; i++) { 
      xSum+=this.pastX[i];
      ySum+=this.pastY[i];
    }

    // find the average smoothed x/y values 
    this.x = xSum / this.pastX.length;
    this.y = ySum / this.pastY.length;

    // remove old x values 
    if (this.pastX.length >= this.smoothAmount) { 
      this.pastX.shift();
    }

    // remove old y values
    if (this.pastY.length >= this.smoothAmount) { 
      this.pastY.shift();
    }

  }
}