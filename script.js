// Wheel configuration
const segments = [
    { label: 'Xm6', displayLabel: 'Xm6', color: '#ff6b6b' },
    { label: 'I guess we are going on a date', displayLabel: 'Date', color: '#4ecdc4' }
];
const wheelCanvas = document.getElementById('wheelCanvas');
const ctx = wheelCanvas.getContext('2d');
const spinBtn = document.getElementById('spinBtn');
const result = document.getElementById('result');
const wheelRadius = wheelCanvas.width / 2;
let isSpinning = false;
let currentAngle = 0;
let spinCount = 0; // Track number of spins

function drawWheel(angle = 0) {
    ctx.clearRect(0, 0, wheelCanvas.width, wheelCanvas.height);
    const numSegments = segments.length;
    const arcSize = (2 * Math.PI) / numSegments;
    for (let i = 0; i < numSegments; i++) {
        // Draw segment
        const startAngle = angle + i * arcSize;
        const endAngle = startAngle + arcSize;
        ctx.beginPath();
        ctx.moveTo(wheelRadius, wheelRadius);
        ctx.arc(wheelRadius, wheelRadius, wheelRadius - 8, startAngle, endAngle);
        ctx.closePath();
        ctx.fillStyle = segments[i].color;
        ctx.fill();
        // Draw text
        ctx.save();
        ctx.translate(wheelRadius, wheelRadius);
        ctx.rotate(startAngle + arcSize / 2);
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.font = 'bold 22px Montserrat, sans-serif';
        ctx.fillStyle = '#fff';
        ctx.shadowColor = 'rgba(0,0,0,0.3)';
        ctx.shadowBlur = 4;
        ctx.fillText(segments[i].displayLabel, wheelRadius * 0.6, 0);
        ctx.restore();
    }
    // Draw center circle for aesthetics
    ctx.beginPath();
    ctx.arc(wheelRadius, wheelRadius, 40, 0, 2 * Math.PI);
    ctx.fillStyle = '#fff';
    ctx.shadowBlur = 0;
    ctx.fill();
    ctx.font = 'bold 18px Montserrat, sans-serif';
    ctx.fillStyle = '#232526';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('SPIN', wheelRadius, wheelRadius);
}

drawWheel();

function spinWheel() {
    if (isSpinning) return;
    isSpinning = true;
    result.textContent = '';
    spinBtn.disabled = true;

    // Determine winner based on spin count
    let winnerIndex;
    if (spinCount < 2) {
        // First two spins always land on date
        winnerIndex = segments.findIndex(segment => segment.label === 'I guess we are going on a date');
    } else {
        // After two spins, 50/50 chance
        winnerIndex = Math.random() < 0.5 ? 
            segments.findIndex(segment => segment.label === 'Xm6') :
            segments.findIndex(segment => segment.label === 'I guess we are going on a date');
    }
    
    spinCount++; // Increment spin count

    const numSegments = segments.length;
    const arcSize = 360 / numSegments;
    // The pointer is at 270deg (top). Calculate the angle to land the winner at the pointer.
    const targetAngle = 360 * 5 + (270 - winnerIndex * arcSize - arcSize / 2); // 5 full spins + winner
    const startAngle = currentAngle;
    const endAngle = targetAngle;
    const duration = 4000;
    const startTime = performance.now();

    function animate(now) {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        // Ease out cubic
        const ease = 1 - Math.pow(1 - progress, 3);
        const angle = startAngle + (endAngle - startAngle) * ease;
        drawWheel((angle * Math.PI) / 180);
        if (progress < 1) {
            requestAnimationFrame(animate);
        } else {
            currentAngle = endAngle % 360;
            isSpinning = false;
            spinBtn.disabled = false;
            result.textContent = `${segments[winnerIndex].label}`;
        }
    }
    requestAnimationFrame(animate);
}

spinBtn.addEventListener('click', spinWheel); 
