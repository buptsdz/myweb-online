// 定义粒子的颜色数组
const colors = [
    '#26ccff',  // 浅蓝色
    '#a25afd',  // 紫色
    '#ff5e7e',  // 粉红色
    '#88ff5a',  // 浅绿色
    '#fcff42',  // 黄色
    '#ffa62d',  // 橙色
    '#ff36ff'   // 粉紫色
];

/**
 * 粒子类：表示一个独立的粒子对象
 */
class Particle {
    /**
     * 构造函数：初始化粒子的属性
     * @param {Vector} pos - 粒子的初始位置
     * @param {Vector} vel - 粒子的初始速度
     * @param {number} size - 粒子的大小
     */
    constructor(pos, vel, size) {
        this.pos = pos;         // 位置向量
        this.vel = vel;         // 速度向量
        this.acc = createVector(0, 0);  // 加速度向量，初始为0
        this.size = size;       // 粒子大小
        this.life = 270;        // 粒子总生命值
        this.lifetime = 270;    // 当前剩余生命值
        this.color = random(colors);  // 随机选择一个颜色
        this.rotate = random(0, Math.PI * 2)  // 初始旋转角度
        this.rotateSpeed = random(-0.05, 0.05)  // 旋转速度
    }
    
    /**
     * 绘制粒子
     */
    draw() {
        this.rotate += this.rotateSpeed  // 更新旋转角度
        const currentColor = color(this.color)
        // 如果粒子向下运动，根据生命值设置透明度
        if (this.vel.y >= 0) {
            currentColor.setAlpha(this.lifetime / this.life * 100)
        }
        fill(currentColor)
        // 保存当前绘图状态
        push()
        translate(this.pos.x, this.pos.y)  // 移动到粒子位置
        rotate(this.rotate)  // 应用旋转
        // 计算缩放因子
        const scaleX = cos(this.rotate)
        const scaleY = sin(this.rotate)
        scale(scaleX, scaleY)
        // 绘制矩形粒子，带圆角
        rect(0, 0, this.size, this.size * 2, 2);
        // 恢复绘图状态
        pop()
    }

    /**
     * 更新粒子状态
     */
    update() {
        this.vel.add(this.acc);  // 速度加上加速度
        this.pos.add(this.vel);  // 位置加上速度
        this.acc.mult(0);        // 重置加速度
        this.lifetime--          // 生命值递减
    }

    /**
     * 为粒子施加力
     * @param {Vector} force - 要施加的力
     */
    applyForce(force) {
        this.acc.add(force);
    }

    /**
     * 为粒子施加摩擦力
     * @param {number} friction - 摩擦系数
     */
    applyFricition(friction) {
        const frictionForce = this.vel.copy().mult(-friction)
        this.applyForce(frictionForce)
    }
}

/**
 * 粒子系统类：管理多个粒子的生成和更新
 */
class ParticleSystem {
    /**
     * 构造函数：初始化粒子系统
     * @param {number} numParticles - 粒子总数
     * @param {Vector} centerPos - 发射中心位置
     * @param {Object} emitRadian - 发射角度范围
     */
    constructor(numParticles, centerPos, emitRadian = {}) {
        this.particles = [];     // 粒子数组
        this.centerPos = centerPos || createVector(width / 2, height - 10)  // 发射位置
        this.numParticles = numParticles  // 粒子总数
        // 设置发射角度范围，默认为向上的扇形区域
        this.emitRadianStart = typeof emitRadian.emitRadianStart != 'undefined'
            ? emitRadian.emitRadianStart
            : (Math.PI + Math.PI / 4)
        this.emitRadianEnd = typeof emitRadian.emitRadianEnd != 'undefined'
            ? emitRadian.emitRadianEnd
            : (Math.PI + Math.PI / 2  + Math.PI / 4)
        this.isLoop = false     // 是否循环发射
        this.hasEmitted = false // 是否已经发射完成
        this.onceCount = numParticles  // 单次发射数量
        this.emittedCount = 0   // 已发射的粒子数量
    }

    /**
     * 重置粒子系统状态
     */
    reset() {
        this.hasEmitted = false
        this.emittedCount = 0
        this.particles = []
    }

    /**
     * 添加一个新粒子
     */
    addParticle() {
        // 随机生成发射角度
        const emitVel = p5.Vector.fromAngle(random(this.emitRadianStart, this.emitRadianEnd))
        // 创建新粒子
        const particle = new Particle(
            this.centerPos.copy(),
            createVector(), 
            random(4, 10),
        );
        // 施加初始速度
        particle.applyForce(emitVel.mult(random(6, 25)))
        this.particles.push(particle);
    }

    /**
     * 发射粒子
     */
    emit() {
        // 如果不是循环模式且已经发射完成，则返回
        if (!this.isLoop && this.hasEmitted) {
            return
        }
        // 发射指定数量的粒子
        for (let i = 0; i < this.onceCount; i++) {
            this.addParticle();
        }
        this.emittedCount += this.onceCount
        // 检查是否达到总数限制
        if (this.emittedCount == this.numParticles) {
            this.hasEmitted = true
        }
    }

    /**
     * 更新所有粒子的状态
     */
    update() {
        for (let i = 0; i < this.particles.length; i++) {
            this.particles[i].update();
        }
    }

    /**
     * 绘制所有粒子
     */
    draw() {
        for (let i = 0; i < this.particles.length; i++) {
            this.particles[i].draw();
        }
    }

    /**
     * 为所有粒子施加力
     * @param {Vector} force - 要施加的力
     */
    applyForce(force) {
        for (let i = 0; i < this.particles.length; i++) {
            this.particles[i].applyForce(force);
        }
    }

    /**
     * 为所有粒子施加摩擦力
     * @param {number} friction - 摩擦系数
     */
    applyFriction(friction) {
        for (let i = 0; i < this.particles.length; i++) {
            const particle = this.particles[i]
            let airResistance = particle.vel.copy().mult(-friction);
            particle.applyForce(airResistance);
        }
    }

    /**
     * 运行粒子系统的主循环
     */
    run() {
        this.emit();            // 发射新粒子
        this.checkLife();       // 检查粒子生命值
        this.applyForce(createVector(0, 0.1));  // 施加重力
        this.applyFriction(0.05)  // 施加空气阻力
        this.update();          // 更新粒子状态
        this.draw();            // 绘制粒子
    }

    /**
     * 检查并移除寿命耗尽的粒子
     */
    checkLife() {
        for (let i = this.particles.length - 1; i >= 0; i--) {
            if (this.particles[i].lifetime < 0) {
                this.particles.splice(i, 1);
            }
        }
    }

    /**
     * 检查粒子系统是否已经结束
     * @returns {boolean} 是否已经结束
     */
    isDead() {
        return this.hasEmitted && this.particles.length == 0
    }
}

// 全局变量：存储当前的粒子系统
let confettiGun;

/**
 * p5.js的设置函数：初始化画布和绘图设置
 */
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

/**
 * p5.js的绘制函数：持续执行的主循环
 */
function draw() {
    clear(); // 清空画布
    if (confettiGun) {
        confettiGun.run(); // 更新并绘制粒子系统
        if (confettiGun.isDead()) {
            confettiGun = null; // 如果粒子系统死亡，将其设置为null
        }
    }
}

/**
 * 创建新的粒子系统
 * @param {number} x - 发射位置的x坐标
 * @param {number} y - 发射位置的y坐标
 */
function createConfettiGun(x, y) {
    confettiGun = new ParticleSystem(100, createVector(x, y));
}

// 为点赞图标添加点击事件监听器
document.getElementById('like-icon').addEventListener('click', function() {
    const likeIcon = document.getElementById('like-icon');
    // 检查当前图片的src属性来判断状态
    if (likeIcon.src.includes('like.png')) { // 当前状态为未点赞
        console.log("点赞动画执行中...");
        createConfettiGun(mouseX, mouseY); // 使用当前鼠标位置创建粒子系统
    }
});