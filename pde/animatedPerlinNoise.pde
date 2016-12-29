float dt;

void setup() {
  size(640, 360, P2D);
  colorMode(HSB, 100);
  dt = 0.0;
  loadPixels();
}

void draw() {
  dt += 0.05;

  for (int x=0; x<width; x++) {
    for (int y=0; y<height; y++) {

      noiseDetail(3, 0.5);
      float bright = map(noise(float(x)/100.0, float(y)/100.0, dt/1.0), 0, 6, 0, 255);
      pixels[x+y*width] = color(bright*3, bright*2, bright+20);
      
    }
  }
  updatePixels();
}
