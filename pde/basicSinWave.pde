// Starting angle
float theta = 0.0;

void setup() {
  size(900, 420);
  smooth();
}

void draw() {
  background(255);

  theta += 0.01;

  noStroke();


  float angle = theta;

  // waves
  for (int i=0; i<= 180; i++) {
    fill(i+80, i*j, i);
    //fill(i, i*2, i, 50);

    float y = sin(angle)*height/8;
    for (int j=5; j>0; j--) {
      //fill(i+80, i*j, i, 200);
      ellipse(i*5, y+height/4+20*j, j*2, j*2);
    }
    angle += 0.1;
  }
}
