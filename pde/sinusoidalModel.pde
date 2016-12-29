float A = 3.7;
float B = 12.2;
float w = PI/6;
float phi = -(2*PI)/3;
float t = 0;
float dt = 1;
float xOffset = 10;

PFont f;

float[] data = { 0, 8.5, 9.6, 11.1, 12.9, 14.5, 15.8, 15.9, 14.9, 13.4, 11.6, 10.0, 8.7, 0 };
String[] month = {"", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "July", "Aug", "Sept", "Oct", "Nov", "Dec", ""};
size(800, 200);
background(255);
smooth();

f = createFont("Arial", 10, true);

beginShape();
for (int i=0; i<=14; i+=1) {
  stroke(0, 150, 150);
  strokeWeight(2);
  noFill();
  float seattle = (A * sin(w*t + phi)) + B; 
  float y = map(seattle, 0, 20, height, 50);
  float x = map(i, 0, 14, 0, width);
  //println (seattle);


  if (i > 0 && i < 13) {
    stroke(255, 0, 0);
    fill(255);
    ellipse(x, y, 5, 5);
    textFont(f, 14);
    fill(0);
    //text(month[i] + ':' + nf(data[i], 2, 1), x, y-xOffset);
    text(month[i], x-xOffset, y-3*xOffset);
    text(nf(data[i], 2, 1), x-xOffset, y-xOffset);
  }
  vertex(x, y);
  t += dt;
}
endShape();

