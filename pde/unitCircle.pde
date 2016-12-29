PFont f;

int d = 200;
float angle = 0;

void setup() {
  size(900, 420);
  smooth();
  f = createFont("Georgia", 16, true);
}

void draw() {
  background(255);		 
  stroke(0);
  noFill();
  ellipse(width/2, height/2, d, d);
  line(width/2, 7*height/8, width/2, height/8);
  line(width/4, height/2, 3*width/4, height/2);

  // find the position of the object
  float x = d/2 * cos(angle);
  float y = d/2 * sin(angle);		 

  stroke(0);
  fill(angle);

  line(width/2, height/2, 1.5*x+width/2, 1.5*y+height/2);
  ellipse(x+width/2, y+height/2, 8, 8);

  line(1.5*x+width/2, 1.5*y+height/2, 1.5*x+width/2, 1.5*y+height/2);

  // slowly increment the angle
  angle += 0.01;

  textFont(f, 16);
  fill(x+y, x, y);
  text("y", width/2, height-30);
  text("x", 3*width/4+10, height/2);
  text("P(x, y) = P(cos(angle), sin(angle))", x+width/2, y+height/2);
  textFont(f, 10);
  text("radius, r = 1", width/2+20, height/2-5);		

  // show x
  textFont(f, 15); 
  stroke(100, 200, 150);
  strokeWeight(2);
  line(width/2, 10, width/2+x, 10);
  ellipse(width/2+x, 10, 8, 8)
  text("x = " + round(x), width/2, 30);

  // show y
  line(width/5+10, height/2, width/5+10, height/2+y);
  ellipse(width/5+10, height/2+y, 8, 8);
  text("y = " + round(y), width/8, height/2);
}