const canvas = document.getElementById("fireworkCanvas");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let fireworks = [];
let countdownTimer = document.getElementById("countdown");
let happyNewYear = document.getElementById("happyNewYear");
let GoodLuck = document.getElementById("goodLuck"); // "今年もよろしくお願いします！"用の要素

const now = new Date();
// Set target time to next year's January 1st, 0:00:00
let targetTime = new Date(now.getFullYear() + 1, 0, 1, 0, 0, 0);

class Firework {
    constructor(x, y, targetY, color) {
        this.x = x;
        this.y = y;
        this.targetY = targetY;
        this.color = color;
        this.radius = 2;
        this.speed = 5;
        this.exploded = false;
        this.particles = [];
    }

    update() {
        if (!this.exploded) {
            this.y -= this.speed;
            if (this.y <= this.targetY) {
                this.exploded = true;
                this.createParticles();
            }
        } else {
            this.particles.forEach((particle) => particle.update());
        }
    }

    draw() {
        if (!this.exploded) {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fillStyle = this.color;
            ctx.fill();
            ctx.closePath();
        } else {
            this.particles.forEach((particle) => particle.draw());
        }
    }

    createParticles() {
        const particleCount = 50;
        for (let i = 0; i < particleCount; i++) {
            const angle = (Math.PI * 2 * i) / particleCount;
            const speed = Math.random() * 3 + 2;
            const vx = Math.cos(angle) * speed;
            const vy = Math.sin(angle) * speed;
            this.particles.push(new Particle(this.x, this.y, vx, vy, this.color));
        }
    }
}

class Particle {
    constructor(x, y, vx, vy, color) {
        this.x = x;
        this.y = y;
        this.vx = vx;
        this.vy = vy;
        this.color = color;
        this.life = Math.random() * 100 + 50;
        this.alpha = 1;
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;
        this.vy += 0.05; // Gravity effect
        this.alpha -= 0.01;
        this.life--;
    }

    draw() {
        if (this.life > 0) {
            ctx.beginPath();
            ctx.arc(this.x, this.y, 2, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${this.color}, ${this.alpha})`;
            ctx.fill();
            ctx.closePath();
        }
    }
}

function animate() {
    ctx.fillStyle = "rgba(0, 0, 0, 0.1)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    fireworks.forEach((firework, index) => {
        firework.update();
        firework.draw();
        if (firework.exploded && firework.particles.every((p) => p.life <= 0)) {
            fireworks.splice(index, 1);
        }
    });

    requestAnimationFrame(animate);
}

function launchFirework() {
    const x = Math.random() * canvas.width * 1.5 - canvas.width * 0.25;
    const y = canvas.height;
    const targetY = Math.random() * canvas.height / 2;
    const color = `${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}`;
    fireworks.push(new Firework(x, y, targetY, color));
}

function updateCountdown() {
    const now = new Date();
    let diff = targetTime - now;

    // 1月4日以降の場合、新しいターゲットタイムを設定
    if (now > targetTime && now.getMonth() === 0 && now.getDate() >= 4) {
        targetTime.setFullYear(targetTime.getFullYear() + 1);
        countdownTimer.style.display = "block";
        happyNewYear.style.display = "none"; // "Happy New Year !!"を隠す
        GoodLuck.style.display = "none"; // "今年もよろしくお願いします！"を隠す
        diff = targetTime - now; // 再計算
    }

    nowTime.style.display = "block";

    const nowTime = document.getElementById("nowTime");
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);
    const nextYear = targetTime.getFullYear();

    nowTime.textContent = `${now.getFullYear()}年${String(now.getMonth()).padStart(2, '0')}月${String(now.getDate()).padStart(2, '0')}日${String(now.getHours()).padStart(2, '0')}時${String(now.getMinutes()).padStart(2, '0')}分${String(now.getSeconds()).padStart(2, '0')}秒`;
    countdownTimer.textContent = `${nextYear}年まで: ${String(hours).padStart(2, '0')}時間${String(minutes).padStart(2, '0')}分${String(seconds).padStart(2, '0')}秒`;

    if (diff <= 0) {
        countdownTimer.style.display = "none";
        showHappyNewYear();
        launchFireworksAtMidnight();
    }
}

function showHappyNewYear() {
    happyNewYear.style.display = "block"; // Show "Happy New Year !!"
    GoodLuck.style.display = "block"; // Show "今年もよろしくお願いします！"
}

function launchFireworksAtMidnight() {
    console.log("Happy New Year!");
    console.log("今年もよろしくお願いします。");
    for (let i = 0; i < 100; i++) {
        setTimeout(() => {
            launchFirework();
        }, i * 100);
    }
}

// Update countdown every second
setInterval(updateCountdown, 1000);

// Start animation
animate();
