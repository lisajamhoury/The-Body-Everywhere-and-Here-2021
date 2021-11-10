let myVid;
let preds = [];
let pg;

function setup() {
  createCanvas(640, 480);
  // make sure pixel density is the same on the canvas and the graphics 
  // see documentation https://p5js.org/reference/#/p5/pixelDensity
  pixelDensity(1);
  
  // create and hide webcam 
  myVid = createCapture(VIDEO);
  myVid.size(width, height);
  myVid.hide();
  
  // create an external graphics buffer 
  // see https://p5js.org/reference/#/p5/createGraphics
  pg = createGraphics(width,height); 
  
  // create instance of facemesh
  const facemesh = ml5.facemesh(myVid);
  
  // when we receive a prediction, call gotFace
  facemesh.on('predict', (results) => gotFace(results));
}

function gotFace(results) {
  // put the results in a global variable
  preds = results; 
}

function draw() {
  background(255,0);
  updateFace();

  // draw the offscreen graphics buffer to the canvas 
  image(pg, 0,0, width, height);
}

function updateFace() {
  
    // make sure we have predictions before continuing 
    if (preds.length < 1) return;
  
    // get the silhouette of the face 
    const sil = preds[0].annotations['silhouette'];

    // set background and fill color for on external graphics 
    pg.background(255);
    pg.fill(0);  
    pg.noStroke();

    // begin drawing curved shape 
    // see https://p5js.org/reference/#/p5/beginShape
    pg.beginShape();

    // Go through all of the keypoints in the silhouette array
    // Add 3 extra points to complete the curved shaped
    for (let i = 0; i < sil.length + 3; i++) {
      // Get the index
      let index = i;
      // If the index is beyond the length of the array
      if (i >= sil.length) {
        // Use modulo to iterate through the additional points needed to complete the curve
        index = i % sil.length;
      }

      // get x,y,z coordinettes of the point
      const [x, y, z] = sil[index];
      // Add the curve vertex to the shape
      pg.curveVertex(x, y);
    }
    // Close and draw the shape
    pg.endShape();
    
    // load pixels of webcam 
    myVid.loadPixels();

    // load pixels of offscreen graphics 
    pg.loadPixels();

    // loop through all the pixels 
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        let i = (width * y + x) * 4; // get index of red pixel
        
        // if the pixel is black then we know it is part of the face 
        // as we put a black fill on the face above
        if (pg.pixels[i +0] === 0) {
          
          // make this pixel the color from the webcam
          pg.pixels[i + 0] = myVid.pixels[i + 0];
          pg.pixels[i + 1] = myVid.pixels[i + 1];
          pg.pixels[i + 2] = myVid.pixels[i + 2];
          pg.pixels[i+3] = 255;

          // also get the values for the 
          // the pixels before and after to avoid border
          pg.pixels[i - 4] = myVid.pixels[i - 4];
          pg.pixels[i - 3] = myVid.pixels[i - 3];
          pg.pixels[i - 2] = myVid.pixels[i - 2];

          pg.pixels[i - 8] = myVid.pixels[i - 8];
          pg.pixels[i - 7] = myVid.pixels[i - 7];
          pg.pixels[i - 6] = myVid.pixels[i - 6];

          pg.pixels[i + 4] = myVid.pixels[i + 4];
          pg.pixels[i + 5] = myVid.pixels[i + 5];
          pg.pixels[i + 6] = myVid.pixels[i + 6];

          pg.pixels[i + 8] = myVid.pixels[i + 8];
          pg.pixels[i + 9] = myVid.pixels[i + 9];
          pg.pixels[i + 10] = myVid.pixels[i + 10];
        }
      }
    }

    // update the offscreen graphics pixels
    pg.updatePixels();  
} 