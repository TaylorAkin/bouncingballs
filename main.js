// setup canvas

var canvas = document.querySelector('canvas');
var ctx = canvas.getContext('2d');

var width = canvas.width = window.innerWidth;
var height = canvas.height = window.innerHeight;

// function to generate random number

function random(min, max) {
  var num = Math.floor(Math.random() * (max - min)) + min;
  return num;

}

// define Shape constructor

function Shape(x, y, velX, velY, exists) {
  this.x = x;
  this.y = y;
  this.velX = velX;
  this.velY = velY;
  this.exists = exists;

}

// define Ball constructor

function Ball(x, y, velX, velY, color, size, exists) {
  //reference to the shape constructor function
  Shape.call(this, x, y, velX, velY, exists);
  this.color = color;
  this.size = size;
}


//re-defining ball prototype to Shape prototype. Prototype-inherits chain. includes the methods(functions)
// In this case we are using it to create a new object 
// and make it the value of Shape.prototype. The new object has Shape.prototype as its prototype and will 
// therefore inherit, if and when needed, all the methods available on Shape.prototype.
Ball.prototype = Object.create(Shape.prototype);


//setting the ball.prototype's constructor property equal to Ball()
//       Object.defineProperty(obj, prop, descriptor)
// ParametersSection
// obj
// The object on which to define the property.
// prop
// The name or Symbol of the property to be defined or modified.
// descriptor
// The descriptor for the property being defined or modified.

Object.defineProperty(Ball.prototype, 'constructor', {
  value: Ball,
  enumerable: false, // so that it does not appear in 'for in' loop
  writable: true
});


//define Evil Circle

function EvilCircle(x, y, exists) {
  Shape.call(this, x, y, 20, 20, exists);

  this.color = 'orange';
  this.size = 20;

}


EvilCircle.prototype = Object.create(Shape.prototype);

Object.defineProperty(EvilCircle.prototype, 'constructor', {
  value: EvilCircle,
  enumerable: false, // so that it does not appear in 'for in' loop
  writable: true

});

//defining EvilCircle() methods
//draw
EvilCircle.prototype.draw = function () {
  ctx.beginPath();
  ctx.strokeStyle = this.color;
  ctx.arc(this.x, this.y, this.size, 0, 30 * Math.PI);
  ctx.stroke();
};



//define EvilCircle checkBounds()
//we want to instead change the value of x/y so the evil circle is bounced back onto the screen slightly.
//  Adding or subtracting (as appropriate) the evil circle's size property would make sense.

EvilCircle.prototype.checkBounds = function() {
  if ((this.x + this.size) >= width) {
    this.x -= (this.size);
  }

  if ((this.x - this.size) <= 0) {
    this.x += (this.size);
  }

  if ((this.y + this.size) >= height) {
    this.y -= (this.size);
  }

  if ((this.y - this.size) <= 0) {
    this.y += (this.size);
  }
};

//setControls function to move evil circle with keyboard clicks
EvilCircle.prototype.setControls = function() {
  var _this = this;
  window.onkeydown = function (e) {
    if (e.keyCode === 65) {
      _this.x -= _this.velX;
    } else if (e.keyCode === 68) {
      _this.x += _this.velX;
    } else if (e.keyCode === 87) {
      _this.y -= _this.velY;
    } else if (e.keyCode === 83) {
      _this.y += _this.velY;
    }
  }
}

//setting the collisionDetect for the evilCircle

EvilCircle.prototype.collisionDetect = function () {
  for (var j = 0; j < balls.length; j++) {
    if (balls[j].exists) {
      var dx = this.x - balls[j].x;
      var dy = this.y - balls[j].y;
      var distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < this.size + balls[j].size) {
        // balls[j].color = this.color = 'rgb(' + random(0, 255) + ',' + random(0, 255) + ',' + random(0, 255) + ')';
        balls[j].exists = false;
      }
    }
  }
};




// define ball draw method

Ball.prototype.draw = function () {
  ctx.beginPath();
  ctx.fillStyle = this.color;
  ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
  ctx.fill();
};




// define ball update method
//represents sides of canvas

Ball.prototype.update = function () {
  if ((this.x + this.size) >= width) {
    this.velX = -(this.velX);
  }

  if ((this.x - this.size) <= 0) {
    this.velX = -(this.velX);
  }

  if ((this.y + this.size) >= height) {
    this.velY = -(this.velY);
  }

  if ((this.y - this.size) <= 0) {
    this.velY = -(this.velY);
  }

  this.x += this.velX;
  this.y += this.velY;
};

// define ball collision detection

Ball.prototype.collisionDetect = function () {
  for (var j = 0; j < balls.length; j++) {
    if (this != balls[j]) {
      var dx = this.x - balls[j].x;
      var dy = this.y - balls[j].y;
      var distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < this.size + balls[j].size) {
        balls[j].color = this.color = 'rgb(' + random(0, 255) + ',' + random(0, 255) + ',' + random(0, 255) + ')';
      }
    }
  }
};

// define array to store balls and populate it

var balls = [];

while (balls.length < 25) {
  var size = random(1, 10);
  var ball = new Ball(
    // ball position always drawn at least one ball width
    // away from the adge of the canvas, to avoid drawing errors
    random(0 + size, width - size),
    random(0 + size, height - size),
    random(-3, 3),
    random(-2, 2),
    'rgb(' + random(0, 255) + ',' + random(0, 255) + ',' + random(0, 255) + ')',
    size,
    true
  );
  balls.push(ball);
}

// define loop that keeps drawing the scene constantly


var evilcircle = new EvilCircle(50, 200, true);
evilcircle.setControls();




function loop() {
  ctx.fillStyle = 'rgba(0,0,0,0.25)';
  ctx.fillRect(0, 0, width, height);

  for (var i = 0; i < balls.length; i++) {

    if (balls[i].exists) {
      balls[i].draw();
      balls[i].update();
      balls[i].collisionDetect();
    }
  }
evilcircle.draw();
evilcircle.checkBounds();
evilcircle.collisionDetect();


    requestAnimationFrame(loop);
  }



  loop();