const colors = [
    '#26ccff',
    '#a25afd',
    '#ff5e7e',
    '#88ff5a',
    '#fcff42',
    '#ffa62d',
    '#ff36ff'
];

class Particle {
    constructor(pos, vel, size) {
        this.pos = pos;
        this.vel = vel;
        this.acc = createVector(0, 0);
        this.size = size;
        this.life = 300;
        this.lifetime = 300;  
        this.color = random(colors);
        this.rotate = random(0, Math.PI * 2)
        this.rotateSpeed = random(-0.05, 0.05)
    }
    
    draw() {
        this.rotate += this.rotateSpeed
        const currentColor = color(this.color)
        if (this.vel.y >= 0) {
            currentColor.setAlpha(this.lifetime / this.life * 100)
        }
        fill(currentColor)
        push()
        translate(this.pos.x, this.pos.y)
        rotate(this.rotate)
        const scaleX = cos(this.rotate)
        const scaleY = sin(this.rotate)
        scale(scaleX, scaleY)
        rect(0, 0, this.size, this.size * 2, 2);
        pop()
    }

    update() {
        this.vel.add(this.acc);
        this.pos.add(this.vel);
        this.acc.mult(0);
        this.lifetime--
    }

    applyForce(force) {
        this.acc.add(force);
    }

    applyFricition(friction) {
        const frictionForce = this.vel.copy().mult(-friction)
        this.applyForce(frictionForce)
    }
}

class ParticleSystem {
    constructor(numParticles, centerPos, emitRadian = {}) {
        this.particles = [];
        this.centerPos = centerPos || createVector(width / 2, height - 10)
        this.numParticles = numParticles
        this.emitRadianStart = typeof emitRadian.emitRadianStart != 'undefined'
            ? emitRadian.emitRadianStart
            : (Math.PI + Math.PI / 4)
        this.emitRadianEnd = typeof emitRadian.emitRadianEnd != 'undefined'
            ? emitRadian.emitRadianEnd
            : (Math.PI + Math.PI / 2  + Math.PI / 4)
        this.isLoop = false
        this.hasEmitted = false
        this.onceCount = numParticles
        this.emittedCount = 0
    }

    reset() {
        this.hasEmitted = false
        this.emittedCount = 0
        this.particles = []
    }

    addParticle() {
        const emitVel = p5.Vector.fromAngle(random(this.emitRadianStart, this.emitRadianEnd))
        const particle = new Particle(
            this.centerPos.copy(),
            createVector(), 
            random(4, 10),
        );
        particle.applyForce(emitVel.mult(random(5, 25)))
        this.particles.push(particle);
    }

    emit() {
        if (!this.isLoop && this.hasEmitted) {
            return
        }
        for (let i = 0; i < this.onceCount; i++) {
            this.addParticle();
        }
        this.emittedCount += this.onceCount
        if (this.emittedCount == this.numParticles) {
            this.hasEmitted = true
        }
    }

    update() {
        for (let i = 0; i < this.particles.length; i++) {
            this.particles[i].update();
        }
    }

    draw() {
        for (let i = 0; i < this.particles.length; i++) {
            this.particles[i].draw();
        }
    }

    applyForce(force) {
        for (let i = 0; i < this.particles.length; i++) {
            this.particles[i].applyForce(force);
        }
    }

    applyFriction(friction) {
        for (let i = 0; i < this.particles.length; i++) {
            const particle = this.particles[i]
            let airResistance = particle.vel.copy().mult(-friction);
            particle.applyForce(airResistance);

        }
    }

    run() {
        this.emit();
        this.checkLife();
        this.applyForce(createVector(0, 0.1));
        this.applyFriction(0.05)
        this.update();
        this.draw();
    }

    checkLife() {
        for (let i = this.particles.length - 1; i >= 0; i--) {
            if (this.particles[i].lifetime < 0) {
                this.particles.splice(i, 1);
            }
        }
    }

    isDead() {
        return this.hasEmitted && this.particles.length == 0
    }
}


let confettiGun;

function setup() {
    let canvas = createCanvas(windowWidth, document.body.scrollHeight); // 创建画布为整个窗口大小
    canvas.style('position', 'absolute'); // 设置位置为绝对
    canvas.style('top', '0'); // 设置顶部为0
    canvas.style('left', '0'); // 设置左侧为0
    canvas.style('pointer-events', 'none'); // 使画布不响应鼠标事件
    canvas.style('z-index', '9'); // 设置z-index为最高
    colorMode(HSB, 100); // 设置颜色模式为HSB
    noStroke(); // 不绘制边框
}

function draw() {
    clear(); // 清空画布
    if (confettiGun) {
        confettiGun.run(); // 更新并绘制粒子系统
        if (confettiGun.isDead()) {
            confettiGun = null; // 如果粒子系统死亡，将其设置为null
        }
    }
}

function createConfettiGun(x, y) {
    confettiGun = new ParticleSystem(100, createVector(x, y));
}

document.getElementById('like-icon').addEventListener('click', function() {
	const likeIcon = document.getElementById('like-icon');
	// 检查当前图片的src属性来判断状态
	if (likeIcon.src.includes('like.png')) { // 当前状态为未点赞
		console.log("点赞动画执行中...");
		createConfettiGun(mouseX, mouseY); // 使用当前鼠标位置创建粒子系统
	}
});
