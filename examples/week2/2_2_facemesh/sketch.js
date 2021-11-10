let myVid; 
let predictions = [];

function setup() {
  createCanvas(640, 480);

  // create and hide webcam 
  myVid = createCapture(VIDEO);
  myVid.size(width, height);
  myVid.hide();

  // create an instance of facemesh 
  const facemesh = ml5.facemesh(myVid, modelLoaded);

  // when we receive a prediction, call gotFace
  facemesh.on('predict', (results) => gotFace(results));
}

function modelLoaded() {
  console.log('loaded');

}

function gotFace(results) { 
  // put the predictions in a global variable 
  predictions = results; 

}

function drawFace() {
  // predictions[0].annotations.silhouette[0][0]

  // iterate through all the predictions — there will be one per detected face 
  for (let i = 0; i < predictions.length; i++ ) { 
    // get keypoints from annotations 
    const sil = predictions[i].annotations.leftEyebrowUpper;
    const sil2 = predictions[i].annotations.rightEyebrowUpper;

    // draw the points of the left eyebrow
    for (let j =0; j< sil.length; j++) { 
      const [x,y] = sil[j];
      // shorthand for ... 
      // const x = sil[j][0];
      // const y = sil[j][1];
      
      fill('white');
      noStroke();
      ellipse(x,y,10);

    }

    // draw the points of the right eyebrow 
    for (let j =0; j< sil.length; j++) { 
      const [x,y] = sil2[j];
      // const x = sil[j][0];
      // const y = sil[j][1];
      
      fill('white');
      noStroke();
      ellipse(x,y,10);

    }
  }

} 

function draw() {
  background(0,1);
  // image(myVid, 0,0,width, height);
  drawFace();
}
