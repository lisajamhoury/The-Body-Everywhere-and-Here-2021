// The Body Everywhere and Here Class 4: Example 3 — Video over peer connection
// https://github.com/lisajamhoury/The-Body-Everywhere-And-Here-2021/

// This example uses p5LiveMedia to send video between two peers 

// Open up two instances/tabs of the sketch for it to work

let p5lm;
let myVid;
let partnerVid = null;

function setup() {
  createCanvas(640, 480);

  // add a callback to createCapture
  // the callback is called when the stream is loaded 
  // and will make the stream available to pass to the peer connection
  myVid = createCapture(VIDEO, gotMyVideo);
  myVid.size(width,height);
  myVid.hide();
}

function gotMyVideo(stream) { 
  // create an instance of p5 live media 
  // that opens a video channel, and creates the meeting room "body-ewah-45"
  // the stream from myVid is passed into the connection 
  p5lm = new p5LiveMedia(this, "CAPTURE", stream, "body-ewah-45");
  // set a callback to call when a partner stream is received 
  p5lm.on('stream', gotPartnerStream);
}

function gotPartnerStream(stream, id) {
  // when we receive the partner stream, put in a local variable
  // and hide it
  partnerVid = stream;
  partnerVid.hide();
}

function draw() {
  // add a colored tint with transparency to the image
  tint(255,40,40,100);
  // draw my video flipped to mirror the user 
  push();
  translate(width,0);
  scale(-1,1);
  image(myVid,0,0,width,height);
  pop();

  // check that i have a partner video before continuing 
  if (partnerVid === null) return;
  // add a colored tint with transparency to the image
  tint(40,40,255,100);
  image(partnerVid,0,0,width,height);
}
