// The Body Everywhere and Here Class 5: Example — Multiple mouse
// https://github.com/lisajamhoury/The-Body-Everywhere-And-Here-2021/

// This example allows for multiple users to interact with their mice 
// on the same p5 canvas using  p5livemedia for a peer connection

let p5livemedia;
let myMousePosition = {};
let otherUsers = [];

const size = 50;

function setup() {
  createCanvas(500, 500);
  frameRate(60); // try 30 if latency
  colorMode(HSB, 255);

  // create an instance of p5 Live Media with a data stream 
  p5livemedia = new p5LiveMedia(this, "DATA", null, "ewah-room-1");

  // call gotPartnerPose when we receive data from partner
  p5livemedia.on('data', getOtherMice);
}

function mouseMoved() {
  // get and send my mouse position over peer
  myMousePosition = { x: mouseX, y: mouseY };
  p5livemedia.send(JSON.stringify(myMousePosition));
} 

function getOtherMice(data, id) {
  // get data from peer
  const newData = JSON.parse(data);

  let foundMatch = false;

  // see if the data is from a user that already exists
  for (let i = 0; i < otherUsers.length; i++) {
    // if the user exists
    if (id === otherUsers[i].userId) {
      // update their position
      otherUsers[i].position = newData;
      
      // we found a match!
      foundMatch = true;
    }
  }

  // if the user doesn't exist
  if (!foundMatch) {
    // create a new user
    let newUser = {
      userId: id,
      position: newData,
      color: random(50, 150),
    };

    // add them to the array
    otherUsers.push(newUser);
  }
}


function draw() {
  
  // make sure we have at least one partner before drawing
  if (otherUsers.length < 1) return;

  // use some opacity on background for trails
  background(255, 50);
  noStroke();

  // draw my mouse
  fill(25, 255, 255);
  ellipse(myMousePosition.x, myMousePosition.y, size, size);

  // draw all the other mice
  for (let i = 0; i < otherUsers.length; i++) {
    fill(otherUsers[i].color, 255, 255);
    ellipse(
      otherUsers[i].position.x,
      otherUsers[i].position.y,
      size,
      size,
    );
  }
}