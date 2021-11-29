// The Body Everywhere and Here Class 5: Example — Multiple pose
// https://github.com/lisajamhoury/The-Body-Everywhere-And-Here-2021/

// This example allows for multiple users to interact on the same p5 canvas
// using posenet via ml5, and p5livemedia for a peer connection
// if everyone raises their hands up high they reveal a secret message!

// variable to hold all poses
let allPoses = [];

// Confidence threshold for posenet keypoints
const scoreThreshold = 0.5;

// Posenet variables
let video;
let poseNet;

// Size of joints
const size = 10;

function setup() {
  createCanvas(800, 800);
  frameRate(60);
  colorMode(HSB, 255);

  initPosenet();
  initPeer();
}

function draw() {
  // make sure we have our pose before going on
  if (allPoses.length === 0) {
    console.log('no poses, returning')
    return;
  }

  // make sure we have two poses before drawing
  if (allPoses.length < 2) {
    console.log('not enough poses, returning')
    return;
  }

  background(255, 50);
  noStroke();

  //  draw all poses
  drawAllPoses();
}

function initPosenet() {
  // Create webcam capture for posenet
  video = createCapture(VIDEO);
  video.size(width, height);
  video.hide();

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

  // Create poseNet to run on webcam and call 'modelReady' when ready
  poseNet = ml5.poseNet(video, options, modelReady);

  // Everytime we get a pose from posenet, call "getPose"
  // and pass in the results
  poseNet.on('pose', (results) => getPose(results));
}

function initPeer() {
  // create an instance of p5 Live Media with a data stream 
  p5livemedia = new p5LiveMedia(this, "DATA", null, "ewah-room-1");

  // call gotPartnerPose when we receive data from partner
  p5livemedia.on('data', getOtherPoses);
}

// When posenet model is ready, let us know!
function modelReady() {
  console.log('Model Loaded');
}

// Function to get and send pose from posenet
function getPose(poses) {
  // check the pose array
  // if my pose isn't there yet
  // make me the first user in the array
  if (allPoses.length === 0) {
    let newUser = {
      userId: 1, // give myself an arbitrary id
      pose: poses[0], // get first pose from posenet array
      color: random(0, 255), // give me a random color
    };
    allPoses.push(newUser); // add to array
  } else {
    // otherwise, update my position
    allPoses[0].pose = poses[0];
  }

  // Send my pose over peer
  p5livemedia.send(JSON.stringify(allPoses[0].pose));
  
}

function getOtherPoses(data, id) {
  // get new data from peer
  const newData = JSON.parse(data);

  let foundMatch = false;

  // see if the data is from a user that already exists
  for (let i = 0; i < allPoses.length; i++) {
    // if the user exists
    if (id === allPoses[i].userId) {
      // update their pose
      allPoses[i].pose = newData;
      // we found a match!
      foundMatch = true;
    }
  }

  // if the user doesn't exist
  if (!foundMatch) {
    // create a new user
    let newUser = {
      userId: id,
      pose: newData,
      color: random(0, 255),
    };
    // add them to the array
    allPoses.push(newUser);
  }
}

function drawAllPoses() {
  // how many poses do we have
  const numPlayers = allPoses.length;

  // how much space do they each get
  const pWidth = width / numPlayers;

  // check if everyone has their hands up!
  let handsAtTop = true;

  // double check we have poses
  if (allPoses.length > 0) {
    // go through all the poses
    for (let i = 0; i < allPoses.length; i++) {
      // ge the color
      const newColor = color(allPoses[i].color, 255, 255);

      // check that the hands are up
      // if anyone has their hands down, this becomes false
      if (handsAtTop) {
        handsAtTop = checkHands(allPoses[i].pose);
      }

      // use the user's color
      fill(newColor);
      // draw a rectanble for the pose
      rect(i * pWidth, 0, pWidth, height);

      // get the user's pose
      const currentPose = allPoses[i].pose;

      // draw the pose
      drawKeypoints(currentPose, 'white', i, numPlayers, pWidth);
    }
  }

  // if everyone has their hands up
  // tell them they did a good job!
  if (handsAtTop) {
    fill(45, 255, 255);
    rect(0, 0, width, height);
    fill(255);

    textSize(70);
    textAlign(CENTER);
    text('Wow! Great Teamwork!', width / 2, height / 2);
  }
}

function checkHands(pose) {
  // get left and right hands
  const lHandY = pose.pose.leftWrist.y;
  const rHandY = pose.pose.rightWrist.y;

  let atTop = true;

  // if either hand is not up, then hands are down
  if (lHandY > height/4 || rHandY > height/4) {
    atTop = false;
  }

  // return true or false
  return atTop;
}

// A function to draw ellipses over the detected keypoints
// Include an offset if testing by yourself
// And you want to offset one of the skeletons
function drawKeypoints(pose, clr, index, numPlayers, pWidth) {
  // rect(i * playerW, 0, playerW, height);

  const keypoints = pose.pose.keypoints;
  // Loop through all keypoints
  for (let j = 0; j < keypoints.length; j++) {
    // A keypoint is an object describing a body part (like rightArm or leftShoulder)
    const keypoint = keypoints[j];
    // Only draw an ellipse is the pose probability is bigger than 0.2
    if (keypoint.score > scoreThreshold) {
      const newX = keypoint.position.x / numPlayers + pWidth * index;
      const newY = keypoint.position.y / numPlayers;

      fill(clr);
      noStroke();
      ellipse(newX, newY, size, size);
    }
  }
}