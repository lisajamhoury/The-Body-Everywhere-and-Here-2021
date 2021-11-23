let p5livemedia; 
let myPose = [];
let partnerPose = [];

// Confidence threshold for posenet keypoints
const scoreThreshold = 0.5;

// Create an array with keypoints ordered correctly to make a shape
let myOrderedPose = [
  { part: 'leftAnkle', position: { x: null, y: null } },
  { part: 'leftKnee', position: { x: null, y: null } },
  { part: 'leftHip', position: { x: null, y: null } },
  { part: 'leftWrist', position: { x: null, y: null } },
  { part: 'leftElbow', position: { x: null, y: null } },
  { part: 'leftShoulder', position: { x: null, y: null } },
  { part: 'leftEar', position: { x: null, y: null } },
  { part: 'rightEar', position: { x: null, y: null } },
  { part: 'rightShoulder', position: { x: null, y: null } },
  { part: 'rightElbow', position: { x: null, y: null } },
  { part: 'rightWrist', position: { x: null, y: null } },
  { part: 'rightHip', position: { x: null, y: null } },
  { part: 'rightKnee', position: { x: null, y: null } },
  { part: 'rightAnkle', position: { x: null, y: null } },
];

// make a copy of ordered pose for partner 
// use spread operator to copy array
let partnerOrderedPose = [...myOrderedPose];

// color palette
const colors = {
  x: 'rgba(200, 63, 84, 0.5)',
  y: 'rgba(49, 128, 144, 0.5)',
};

function setup() {
  createCanvas(640, 480);

  // create an instance of p5 Live Media with a data stream 
  p5livemedia = new p5LiveMedia(this, "DATA", null, "ewah-room-1");
  // call gotPartnerPose when we receive data from partner
  p5livemedia.on('data', gotPartnerPose);

  // create and hide video 
  const myVid = createCapture(VIDEO);
  myVid.size(width,height);
  myVid.hide();

    // Options for posenet
  // See https://ml5js.org/reference/api-PoseNet/
  // Use these options for slower computers, esp architecture
  // const options = {
  //   architecture: 'MobileNetV1',
  //   imageScaleFactor: 0.3,
  //   outputStride: 16,
  //   flipHorizontal: true,
  //   minConfidence: 0.5,
  //   scoreThreshold: 0.5,
  //   nmsRadius: 20,
  //   detectionType: 'single',
  //   inputResolution: 513,
  //   multiplier: 0.75,
  //   quantBytes: 2,
  // };

  // Computers with more robust gpu can handle architecture 'ResNet50'
  // It is more accurate at the cost of speed
  const options = {
    architecture: 'ResNet50',
    outputStride: 32,
    detectionType: 'single',
    flipHorizontal: true,
    quantBytes: 2,
  };

  // create an instance of posenet
  const posenet = ml5.poseNet(myVid, options);
  // when we receive a pose, call gotMyPose
  posenet.on('pose', gotMyPose);

}

function gotMyPose(poses) { 
  const keypoints = poses[0];
  
  // prepare keypoints to be draw as a shape 
  orderKeypoints(keypoints, myOrderedPose)
  myPose = removeUnusedKeypoints(myOrderedPose);
  
  // send the prepared keypoints 
  p5livemedia.send(JSON.stringify(myPose));
}

function gotPartnerPose(data, id) { 

  // put partners pose in a global variable 
  partnerPose = JSON.parse(data);
}

function draw() {
  background(255);
  drawCurvedBody(myPose, colors.x);
  drawCurvedBody(partnerPose, colors.y);
}

// Put keypoints in drawing order
function orderKeypoints(pose, orderedPose) {
  // Get the keyoints from the pose
  const keypoints = pose.pose.keypoints;
  // Go through all of the keypoints
  for (let j = 0; j < keypoints.length; j++) {
    // Get the current keypoint
    const keypoint = pose.pose.keypoints[j];
    // If the keypoint confidence score is high enough
    if (keypoint.score > scoreThreshold) {
      // Go through the ordered pose array
      for (let k = 0; k < orderedPose.length; k++) {
        // Find the keypoint in the ordered pose array by name
        if (orderedPose[k].part === keypoint.part) {
          // Add the keypoint position to the ordered pose array
          orderedPose[k].position = keypoint.position;
        }
      }
    }
  }
}


// Get rid of any keypoints that are not being used
function removeUnusedKeypoints(pose) {
  // Create an array to hold the used keypoints
  let cleanPose = [];
  // Iterate through each keypoint
  for (let i = 0; i < pose.length; i++) {
    // If the position exists for the keypoint
    if (pose[i].position.x !== null) {
      // Add the position to the keypoint in the clean array
      cleanPose.push({
        position: {
          x: pose[i].position.x,
          y: pose[i].position.y,
        },
      });
    }
  }

  // Return the clean array
  return cleanPose;
}

// Draw a curved shape with the posenet points
function drawCurvedBody(pose, clr) {
  // Make sure we have points in the pose array
  if (pose.length === 0) return;

  // Use the given color to draw the pose
  fill(clr);
  stroke(clr);

  // Begin drawing the shape
  // See p5 reference https://p5js.org/reference/#/p5/beginShape
  beginShape();

  // Go through all of the keypoints in the array
  // Add 3 extra points to complete the curved shaped
  for (let i = 0; i < pose.length + 3; i++) {
    // Get the index
    let index = i;
    // If the index is beyond the length of the array
    if (i >= pose.length) {
      // Use modulo to iterate through the additional points needed to complete the curve
      index = i % pose.length;
    }
    // Add the curve vertex to the shape
    curveVertex(pose[index].position.x, pose[index].position.y);
  }
  // Close and draw the shape
  endShape();
}