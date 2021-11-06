var fft
var particles = []

function setup() {
  createCanvas(windowWidth, windowHeight);
  angleMode(DEGREES)
  mic = new p5.AudioIn();
  mic.start();
  fft = new p5.FFT();
  fft.setInput(mic);
}

function draw () {
  background(0)
  stroke(255)
  strokeWeight(3)
  noFill()

  translate(width / 2, height / 2)

  fft.analyze()
  amp = fft.getEnergy(20, 200)

  var wave = fft.waveform()
  
  for (var t = -1; t <= 1; t += 2) {
    beginShape()
    for(var i = 0; i <= 180; i += 0.5) {
      var index = floor(map(i, 0, 180, 0, wave.length - 1))
      
      var r = map(wave[index], -1, 1, 150, 350) //150 & 350 are the maximum and minimum radius 

      var x = r * sin(i) * t
      var y = r * cos(i)
      vertex(x,y)
    }
  endShape()
  }

  var p = new Particle()
  particles.push(p)


  for (var i = particles.length - 1; i >= 0; i--) {
    if(!particles[i].edges()) {
      particles[i].update(amp > 230) //adjust according to song
      particles[i].show()
    } else {
      particles.splice(i, 1)
    }

  }

}

class Particle {
  constructor() {
    this.pos = p5.Vector.random2D().mult(250) //average of the max and minimum radius 
    this.vel = createVector(0, 0)
    this.acc = this.pos.copy().mult(random(0.0001, 0.00001)) //acceleration of particles

    this.w = random(3, 5) //size of the particles
  }
  update(cond) {
    this.vel.add(this.acc)
    this.pos.add(this.vel)
    if (cond) {
      this.pos.add(this.vel)
      this.pos.add(this.vel)
      this.pos.add(this.vel)
    }
  }
  edges() {
    if (this.pos.x < -width / 2 || this.pos.x > width / 2 ||
      this.pos.y < -height / 2 || this.pos.y > height / 2) {
        return true
      } else {
        return false 
      }
  }
  show() {
    noStroke()
    fill(255)
    ellipse(this.pos.x, this.pos.y, this.w)
  }
}