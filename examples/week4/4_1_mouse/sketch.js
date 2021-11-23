// The Body Everywhere and Here Class 4: Example 1 — Mouse over peer connection
// https://github.com/lisajamhoury/The-Body-Everywhere-And-Here-2021/

// This example uses p5LiveMedia to send the mouse between two peers 
// over a peer connection 

// Open up two instances/tabs of the sketch for it to work

let p5lm;
let partnerMouse = null;

function setup() {
  createCanvas(400, 400);

  // create an instance of p5 live media 
  // that opens a data channel, and creates the meeting room "body-ewah-1"
  p5lm = new p5LiveMedia(this, "DATA", null, "body-ewah-1");
  // when data is received call gotData
  p5lm.on('data', gotData);
}

function gotData(data, id) {
  // put the data in a global variable 
  // data arrives as a string and must be parsed into JSON to be useable 
  partnerMouse = JSON.parse(data);
}

function draw() {
  background(0);

  fill('red');
  ellipse(mouseX,mouseY, 20);

  // make sure we have a partner mouse before drawing
  if (partnerMouse === null) return;
  fill('blue');
  ellipse(partnerMouse.x, partnerMouse.y, 20);
}

function mouseMoved() {
  // put the mouse position into an object
  let dataToSend = {x:mouseX, y:mouseY};

  // the sendind data must be turned into a string before sending
  p5lm.send(JSON.stringify(dataToSend));

}
