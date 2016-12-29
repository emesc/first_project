// animated mandelbrot
// playdown on xyMin and xyMax

PFont f;
float xMin = -2.5;
float yMin = -1.75;
float xMax = 1.5;
float yMax = 1.75;
int maxIter = 0;

void setup() {
  size(420, 420);
  background(255);
  f=createFont("Arial", 10, true);
  //frameRate(2);
  loadPixels();
}

void draw() {

  maxIter++;

  float dx = (xMax - xMin) / width;
  float dy = (yMax - yMin) / height;

  float x = xMin;
  for (int i=0; i<width; i++) {
    float y = yMin;
    for (int j=0; j<height; j++) {

      float a = x;
      float b = y;
      int iter = 0;

      while (iter <= maxIter) {
        float aa = a*a;
        float bb = b*b;
        float ab2 = 2.0*a*b;
        a = aa - bb + x;
        b = ab2 + y;
        if (aa+bb >= 10) {
          break;
        }
        iter++;
      }

      pixels[i+j*width] = (iter == maxIter) ? color(0) : color(iter*maxIter % 255, iter*8 % 255, iter*8 % 255);
      y += dy;
    }
    x += dx;
  }
  updatePixels();
  
  textFont(f, 20);
  fill(255);
  text("@ maximum iteration of " + maxIter, 10, 30);
  
  if (maxIter >= 256) {
    noLoop();
  }
}
