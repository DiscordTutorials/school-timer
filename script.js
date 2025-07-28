const targetDate = new Date('2025-09-05T07:30:00+03:00');

function updateCountdown() {
    const now = new Date();
    const difference = targetDate - now;

    if (difference <= 0) {
        document.getElementById('days').textContent = '00';
        document.getElementById('hours').textContent = '00';
        document.getElementById('minutes').textContent = '00';
        document.getElementById('seconds').textContent = '00';
        return;
    }

    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((difference % (1000 * 60)) / 1000);

    document.getElementById('days').textContent = days.toString().padStart(2, '0');
    document.getElementById('hours').textContent = hours.toString().padStart(2, '0');
    document.getElementById('minutes').textContent = minutes.toString().padStart(2, '0');
    document.getElementById('seconds').textContent = seconds.toString().padStart(2, '0');
}

const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('section');

navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href').substring(1);
        
        sections.forEach(section => {
            section.classList.add('hidden');
        });
        
        document.getElementById(targetId).classList.remove('hidden');
        
        document.getElementById(targetId).scrollIntoView({ 
            behavior: 'smooth',
            block: 'start'
        });
    });
});

let snakeCanvas = document.getElementById('snakeGame');
let snakeCtx = snakeCanvas.getContext('2d');
let snakeGameRunning = false;
let snake = [{x: 10, y: 10}];
let food = {x: 15, y: 15};
let dx = 0;
let dy = 0;

function startSnake() {
    snake = [{x: 10, y: 10}];
    food = {x: Math.floor(Math.random() * 20), y: Math.floor(Math.random() * 20)};
    dx = 1;
    dy = 0;
    snakeGameRunning = true;
    gameLoop();
}

function gameLoop() {
    if (!snakeGameRunning) return;
    
    snakeCtx.fillStyle = '#1a1a1a';
    snakeCtx.fillRect(0, 0, 300, 300);
    
    const head = {x: snake[0].x + dx, y: snake[0].y + dy};
    
    if (head.x < 0 || head.x >= 20 || head.y < 0 || head.y >= 20) {
        snakeGameRunning = false;
        alert('Game Over! Final Score: ' + (snake.length - 1));
        return;
    }
    
    for (let segment of snake) {
        if (head.x === segment.x && head.y === segment.y) {
            snakeGameRunning = false;
            alert('Game Over! Final Score: ' + (snake.length - 1));
            return;
        }
    }
    
    snake.unshift(head);
    
    if (head.x === food.x && head.y === food.y) {
        food = {x: Math.floor(Math.random() * 20), y: Math.floor(Math.random() * 20)};
    } else {
        snake.pop();
    }
    
    snakeCtx.fillStyle = '#4CAF50';
    for (let segment of snake) {
        snakeCtx.fillRect(segment.x * 15, segment.y * 15, 14, 14);
    }
    
    snakeCtx.fillStyle = '#FF5722';
    snakeCtx.fillRect(food.x * 15, food.y * 15, 14, 14);
    
    snakeCtx.fillStyle = '#ffffff';
    snakeCtx.font = '16px Inter';
    snakeCtx.textAlign = 'left';
    snakeCtx.fillText('Score: ' + (snake.length - 1), 10, 20);
    
    setTimeout(gameLoop, 100);
}

let clickCount = 0;
let clickTimes = [];

function incrementClick(event) {
    const now = Date.now();
    clickCount++;
    clickTimes.push(now);
    
    clickTimes = clickTimes.filter(time => now - time < 1000);
    
    const cps = (clickTimes.length / 1).toFixed(1);
    
    document.getElementById('clickCount').textContent = clickCount + ' clicks';
    document.getElementById('cps').textContent = cps + ' CPS';
    
    const button = event.target;
    const rect = button.getBoundingClientRect();
    const ripple = document.createElement('div');
    ripple.className = 'ripple';
    
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const size = 40;
    
    ripple.style.width = ripple.style.height = size + 'px';
    ripple.style.left = (x - size / 2) + 'px';
    ripple.style.top = (y - size / 2) + 'px';
    
    button.appendChild(ripple);
    
    setTimeout(() => ripple.remove(), 500);
}

function resetClick() {
    clickCount = 0;
    clickTimes = [];
    document.getElementById('clickCount').textContent = '0 clicks';
    document.getElementById('cps').textContent = '0.0 CPS';
}

let reactionStartTime;
let reactionTimeout;

function startReaction() {
    const box = document.getElementById('reactionBox');
    box.textContent = 'Wait...';
    box.className = 'reaction-box wait';
    
    const delay = Math.random() * 3000 + 1000;
    reactionTimeout = setTimeout(() => {
        box.textContent = 'Click now!';
        box.className = 'reaction-box ready';
        reactionStartTime = Date.now();
    }, delay);
}

document.getElementById('reactionBox').addEventListener('click', function() {
    if (reactionStartTime) {
        const reactionTime = Date.now() - reactionStartTime;
        document.getElementById('reactionTime').textContent = 'Time: ' + reactionTime + 'ms';
        this.textContent = 'Click when green!';
        this.className = 'reaction-box';
        reactionStartTime = null;
    }
    clearTimeout(reactionTimeout);
});

document.addEventListener('keydown', (e) => {
    if (!snakeGameRunning) return;
    switch (e.key.toLowerCase()) {
        case 'w':
            if (dy !== 1) { dx = 0; dy = -1; }
            break;
        case 'a':
            if (dx !== 1) { dx = -1; dy = 0; }
            break;
        case 's':
            if (dy !== -1) { dx = 0; dy = 1; }
            break;
        case 'd':
            if (dx !== -1) { dx = 1; dy = 0; }
            break;
    }
});

updateCountdown();
setInterval(updateCountdown, 1000);

const countdownItems = document.querySelectorAll('.countdown-item');
countdownItems.forEach(item => {
    item.addEventListener('mouseenter', () => {
        item.style.transform = 'translateY(-5px)';
        item.style.transition = 'transform 0.3s ease';
    });
    
    item.addEventListener('mouseleave', () => {
        item.style.transform = 'translateY(0)';
    });
});

window.startSnake = startSnake;
window.incrementClick = incrementClick;
window.resetClick = resetClick;
window.startReaction = startReaction;
