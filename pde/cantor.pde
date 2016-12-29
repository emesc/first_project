void setup() {
  size(640, 320);
  background(255);
  noLoop();
}

void draw() {
  cantor(30, height-30, 580);
}

void cantor(float x, float y, float len) {

  float h = 40;
  
  stroke(x%255, y%255, len%255);
  fill(x*h%255, y*h%255, len*h%255);

  if (len >= 0.25) {
    rect(x, y, len, h/3);
    y -= h;
    
    cantor(x, y, len/3);
    cantor(x+len*2/3, y, len/3);
  }
}