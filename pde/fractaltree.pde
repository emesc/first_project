float theta;

void setup(){
  size(700, 600);
  smooth();
}

void draw(){
  background(0);
  theta = map(mouseX, 0, width, 0, PI/4);
  
  translate(width/2, height);
  stroke(0);
  branch(200);
}

void branch(float len){
  float sw = map(len, 2, 120, 1, 8);
  strokeWeight(sw);
  stroke(sw*3, sw*8, sw*2);
  line(0, 0, 0, -len);
  strokeWeight(sw);
  ellipse(0, -len, 4, 4);
  
  // move to the end of that line
  translate(0, -len);
  
  len *= 0.7;
  
  if (len > 2){
    pushMatrix();
    rotate(theta);
    branch(len);
    popMatrix();
    
    pushMatrix();
    rotate(-theta);
    branch(len-10);
    popMatrix();
  }
}