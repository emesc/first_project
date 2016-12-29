void setup(){
  size(500, 500);
}

void draw(){
  background(255);
  int side = 300;
  drawSquare(width/2, height/2, side);
  noLoop();
}

void drawSquare(float x, float y, float s){
  stroke(50, 58, 70);
  noFill();
  rectMode(CENTER);
  rect(x, y, s, s);
  
  if(s>150){
    drawSquare(x+s/2, y+s/2, s/2);
    drawSquare(x-s/2, y-s/2, s/2);
    drawSquare(x+s/2, y-s/2, s/2);
    drawSquare(x-s/2, y+s/2, s/2);
  }
}