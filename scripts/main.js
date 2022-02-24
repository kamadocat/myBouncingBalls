const canvas = document.querySelector('canvas');

const ctx = canvas.getContext('2d');

const width = canvas.width = window.innerWidth;
const height = canvas.height = window.innerHeight;


function random(min, max) {
    return (Math.random()* (max - min) + min);
}

function randomRGB(min, max) {
    return `rgb(${random(min, max)}, ${random(min, max)}, ${random(min, max)})`
}

class Ball {

    constructor(x, y, velX, velY, color, size) {
        this.x = x;
        this.y = y;
        this.velX = velX;
        this.velY = velY;
        this.color = color;
        this.size = size;
        this.mass = this.size * this.size;
        this.s = null;
        this.vn = null;
        this.vn_tmp = null;
        this.vt = null;
    }


    draw() {
        ctx.beginPath();
        ctx.fillStyle = this.color;
        ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
        ctx.fill();
    }


    update() {
        if ((this.x + this.size) >= width) {
            this.velX *= -1;
            this.x = width - this.size;
        }

        if ((this.x - this.size) <= 0) {
            this.velX *= -1;
            this.x = this.size;
        }

        if ((this.y + this.size) >= height) {
            this.velY *= -1;
            this.y = height - this.size;
        }

        if ((this.y - this.size) < 0) {
            this.velY *= -1;
            this.y = this.size;
        }

        this.x += this.velX;
        this.y += this.velY;
    }


    collisionDetect() {
        for (const ball of balls) {
            if (!(this === ball)) {
                const dx = this.x - ball.x;
                const dy = this.y - ball.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                const dif = this.size + ball.size - distance;
                if (dif >= 0) {
                    const magSynthVel = (Math.sqrt(this.velX * this.velX + this.velY * this.velY));
                    const minusX = this.velX / magSynthVel;
                    const minusY = this.velY / magSynthVel;
                    this.x -= minusX * dif;
                    this.y -= minusY * dif;
                    const vecC = {x: dx / distance, y: dy / distance};
                    this.s = this.velX * vecC.x + this.velY * vecC.y;
                    ball.s = ball.velX * vecC.x + ball.velY * vecC.y;
                    this.vn = {
                        x: this.s * vecC.x,
                        y: this.s * vecC.y
                    };
                    this.vt = {
                        x: this.velX - this.vn.x,
                        y: this.velY - this.vn.y
                    };
                    ball.vn = {
                        x: ball.s * vecC.x,
                        y: ball.s * vecC.y
                    };
                    ball.vt = {
                        x: ball.velX - ball.vn.x,
                        y: ball.velY - ball.vn.y
                    };
                    this.vn_tmp = {
                        x: (this.mass * this.vn.x + ball.mass * ball.vn.x - ball.mass * (this.vn.x - ball.vn.x)) / (this.mass + ball.mass),
                        y: (this.mass * this.vn.y + ball.mass * ball.vn.y - ball.mass * (this.vn.y - ball.vn.y)) / (this.mass + ball.mass)
                    }
                    ball.vn_tmp = {
                        x: (this.mass * this.vn.x + ball.mass * ball.vn.x + this.mass * (this.vn.x - ball.vn.x)) / (this.mass + ball.mass),
                        y: (this.mass * this.vn.y + ball.mass * ball.vn.y + this.mass * (this.vn.y - ball.vn.y)) / (this.mass + ball.mass)
                    }
                    this.vn.x = this.vn_tmp.x;
                    this.vn.y = this.vn_tmp.y;
                    ball.vn.x = ball.vn_tmp.x;
                    ball.vn.y = ball.vn_tmp.y;
                    this.velX = this.vn.x + this.vt.x;
                    this.velY = this.vn.y + this.vt.y;
                    ball.velX = ball.vn.x + ball.vt.x;
                    ball.velY = ball.vn.y + ball.vt.y;
                }
            }
        }
    }
}





const balls = [];
const smax = Math.min(width, height);
const maxSize = 50 / 1500 * smax;
const minSize = 70 / 1500 * smax;
const maxSpeed = 12 / 1500 * smax;
const minSpeed = -maxSpeed;

while (balls.length < 30) {
    const size = random(minSize, maxSize);
    const ball = new Ball(
        random(0 + size, width - size),
        random(0 + size, height - size),
        random(minSpeed, maxSpeed),
        random(minSpeed, maxSpeed),
        randomRGB(130, 255),
        size
    );
    console.log(size);

    balls.push(ball)
}


function loop() {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.25)';
    ctx.fillRect(0, 0, width, height);

    for (const ball of balls) {
        ball.draw();
        ball.update();
        ball.collisionDetect();
    }

    requestAnimationFrame(loop)
}

console.log(width);
console.log(height);

loop();