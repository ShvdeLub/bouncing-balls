const canvas = document.querySelector("canvas");
const para = document.querySelector("#para");
const ctx = canvas.getContext("2d");
const width = (canvas.width = window.innerWidth);
const height = (canvas.height = window.innerHeight);

let counter;

// function to generate random number

function random(min, max) {
  const num = Math.floor(Math.random() * (max - min + 1)) + min;
  return num;
}

// function to generate random color

function randomRGB() {
  return `rgb(${random(0, 255)},${random(0, 255)},${random(0, 255)})`;
}

function Shape(x, y, velX, velY, exists) {
  this.x = x;
  this.y = y;
  this.velX = velX;
  this.velY = velY;
  this.exists = exists;
}

function Ball(x, y, velX, velY, exists, color, size) {
  Shape.call(this, x, y, velX, velY, exists);
  this.color = color;
  this.size = size;
}

function EvilCircle(x, y, exists) {
  Shape.call(this, x, y, 20, 20, exists);
  this.color = "white";
  this.size = 10;
}

Ball.prototype = Object.create(Shape.prototype);
Ball.prototype.constructor = Ball;

EvilCircle.prototype = Object.create(Shape.prototype);
EvilCircle.prototype.constructor = EvilCircle;

EvilCircle.prototype.draw = function () {
  ctx.beginPath();
  ctx.lineWidth = 3;
  ctx.strokeStyle = this.color;
  ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
  ctx.stroke();
};

EvilCircle.prototype.checkBounds = function () {
  if (this.x + this.size >= width) {
    this.velX = -this.size;
  }

  if (this.x - this.size <= 0) {
    this.velX = -this.size;
  }

  if (this.y + this.size >= height) {
    this.velY = -this.size;
  }

  if (this.y - this.size <= 0) {
    this.velY = -this.size;
  }
};

EvilCircle.prototype.setControls = function () {
  let _this = this;
  window.onkeydown = function (e) {
    if (e.keyCode === 81) {
      //q
      _this.x -= _this.velX;
    } else if (e.keyCode === 68) {
      // d
      _this.x += _this.velX;
    } else if (e.keyCode === 90) {
      //z
      _this.y -= _this.velY;
    } else if (e.keyCode === 83) {
      //s
      _this.y += _this.velY;
    }

    else if(e.keycode === 81 && e.keycode === 90) {
      _this.x -= _this.velX;
      _this.y -= _this.velY;      
    }

    else if(e.keycode === 68 && e.keycode === 90) {
      _this.x += _this.velX;
      _this.y -= _this.velY;      
    }
    else if(e.keycode === 68 && e.keycode === 83) {
      _this.x += _this.velX;
      _this.y += _this.velY;      
    }
    else if(e.keycode === 81 && e.keycode === 83) {
      _this.x -= _this.velX;
      _this.y += _this.velY;      
    }


  };
};

EvilCircle.prototype.collisionDetect = function () {
  for (let j = 0; j < balls.length; j++) {
    if (balls[j].exists === true) {
      const dx = this.x - balls[j].x;
      const dy = this.y - balls[j].y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < this.size + balls[j].size) {
        balls[j].exists = this.exists = false;
        //delete balls[i]
        counter += 1;
      }
    }
  }
};

Ball.prototype.draw = function () {
  ctx.beginPath();
  ctx.fillStyle = this.color;
  ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
  ctx.fill();
};

Ball.prototype.update = function () {
  if (this.x + this.size >= width) {
    this.velX = -this.velX;
  }

  if (this.x - this.size <= 0) {
    this.velX = -this.velX;
  }

  if (this.y + this.size >= height) {
    this.velY = -this.velY;
  }

  if (this.y - this.size <= 0) {
    this.velY = -this.velY;
  }

  this.x += this.velX;
  this.y += this.velY;
};

Ball.prototype.collisionDetect = function () {
  for (let j = 0; j < balls.length; j++) {
    if (!(this === balls[j])) {
      const dx = this.x - balls[j].x;
      const dy = this.y - balls[j].y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < this.size + balls[j].size) {
        balls[j].color = this.color =
          "rgb(" +
          random(0, 255) +
          "," +
          random(0, 255) +
          "," +
          random(0, 255) +
          ")";
      }
    }
  }
};

let balls = [];

while (balls.length < 30) {
  let size = random(10, 20);
  let ball = new Ball(
    // ball position always drawn at least one ball width
    // away from the edge of the canvas, to avoid drawing errors
    random(0 + size, width - size),
    random(0 + size, height - size),
    random(-7, 7),
    random(-7, 7),
    true,
    "rgb(" + random(0, 255) + "," + random(0, 255) + "," + random(0, 255) + ")",
    size
  );

  balls.push(ball);
}

let targeter = new EvilCircle(width / 2, height / 2, true);
targeter.setControls();
counter = 0;

function loop() {
  ctx.fillStyle = "rgb(0, 0, 0, 0.2)";
  ctx.fillRect(0, 0, width, height);

  for (let i = 0; i < balls.length; i++) {
    if (balls[i].exists === true) {
      balls[i].draw();
      balls[i].update();
      balls[i].collisionDetect();
    }
  }
  targeter.draw();
  targeter.checkBounds();
  targeter.collisionDetect();
  requestAnimationFrame(loop);
  para.innerHTML = "counter: " + counter;
}
loop();
