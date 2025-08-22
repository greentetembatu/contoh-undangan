// Wedding Invitation Interactive Script
class WeddingInvitation {
    constructor() {
        this.targetDate = new Date('2026-01-01T00:00:00').getTime();
        this.musicPlaying = false;
        this.confettiActive = false;
        
        this.init();
    }

    init() {
        this.setupCountdown();
        this.setupEventListeners();
        this.setupCanvas();
        this.startCountdown();
    }

    setupCountdown() {
        const countdownElement = document.getElementById('countdown');
        countdownElement.innerHTML = `
            <div class="countdown-item">
                <span class="countdown-number" id="days">00</span>
                <span class="countdown-label">Hari</span>
            </div>
            <div class="countdown-item">
                <span class="countdown-number" id="hours">00</span>
                <span class="countdown-label">Jam</span>
            </div>
            <div class="countdown-item">
                <span class="countdown-number" id="minutes">00</span>
                <span class="countdown-label">Menit</span>
            </div>
            <div class="countdown-item">
                <span class="countdown-number" id="seconds">00</span>
                <span class="countdown-label">Detik</span>
            </div>
        `;
    }

    setupEventListeners() {
        // Open invitation button
        const openBtn = document.getElementById('openWebsiteBtn');
        openBtn.addEventListener('click', () => this.openInvitation());

        // Music toggle button
        const musicBtn = document.getElementById('musicButton');
        musicBtn.addEventListener('click', () => this.toggleMusic());

        // Confetti button
        const confettiBtn = document.getElementById('confettiButton');
        confettiBtn.addEventListener('click', () => this.triggerConfetti());

        // Mobile tap to open (for hero-left)
        const heroLeft = document.querySelector('.hero-left');
        heroLeft.addEventListener('click', () => this.openInvitation());
    }

    setupCanvas() {
        this.canvas = document.getElementById('fallingCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        
        this.resizeCanvas();
        window.addEventListener('resize', () => this.resizeCanvas());
    }

    resizeCanvas() {
        this.canvas.width = this.canvas.offsetWidth;
        this.canvas.height = this.canvas.offsetHeight;
    }

    startCountdown() {
        const updateCountdown = () => {
            const now = new Date().getTime();
            const distance = this.targetDate - now;

            if (distance < 0) {
                document.getElementById('countdown').innerHTML = '<p class="countdown-finished">Hari Bahagia Telah Tiba!</p>';
                return;
            }

            const days = Math.floor(distance / (1000 * 60 * 60 * 24));
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);

            document.getElementById('days').textContent = String(days).padStart(2, '0');
            document.getElementById('hours').textContent = String(hours).padStart(2, '0');
            document.getElementById('minutes').textContent = String(minutes).padStart(2, '0');
            document.getElementById('seconds').textContent = String(seconds).padStart(2, '0');
        };

        updateCountdown();
        setInterval(updateCountdown, 1000);
    }

    openInvitation() {
        const invitationContent = document.getElementById('invitationContent');
        invitationContent.classList.add('active');
        
        // Auto-play music when invitation opens
        setTimeout(() => {
            this.playMusic();
        }, 500);

        // Trigger celebratory confetti
        setTimeout(() => {
            this.triggerConfetti();
        }, 1000);
    }

    toggleMusic() {
        if (this.musicPlaying) {
            this.pauseMusic();
        } else {
            this.playMusic();
        }
    }

    playMusic() {
        const music = document.getElementById('background-music');
        const musicBtn = document.getElementById('musicButton');
        
        music.play().then(() => {
            this.musicPlaying = true;
            musicBtn.style.background = 'rgba(218, 165, 32, 0.9)';
            musicBtn.style.color = 'white';
        }).catch(error => {
            console.log('Auto-play prevented:', error);
        });
    }

    pauseMusic() {
        const music = document.getElementById('background-music');
        const musicBtn = document.getElementById('musicButton');
        
        music.pause();
        this.musicPlaying = false;
        musicBtn.style.background = 'rgba(255, 255, 255, 0.9)';
        musicBtn.style.color = 'black';
    }

    triggerConfetti() {
        this.createConfettiParticles();
        this.animateConfetti();
    }

    createConfettiParticles() {
        const colors = ['#DAA520', '#B8860B', '#CD853F', '#DEB887', '#F4A460'];
        const particleCount = 50;
        
        for (let i = 0; i < particleCount; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: -10,
                vx: (Math.random() - 0.5) * 4,
                vy: Math.random() * 3 + 2,
                color: colors[Math.floor(Math.random() * colors.length)],
                size: Math.random() * 8 + 4,
                rotation: Math.random() * 360,
                rotationSpeed: (Math.random() - 0.5) * 10,
                life: 1,
                decay: Math.random() * 0.02 + 0.01
            });
        }
    }

    animateConfetti() {
        const animate = () => {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            
            for (let i = this.particles.length - 1; i >= 0; i--) {
                const particle = this.particles[i];
                
                // Update particle position
                particle.x += particle.vx;
                particle.y += particle.vy;
                particle.rotation += particle.rotationSpeed;
                particle.life -= particle.decay;
                
                // Apply gravity
                particle.vy += 0.1;
                
                // Draw particle
                this.ctx.save();
                this.ctx.translate(particle.x, particle.y);
                this.ctx.rotate(particle.rotation * Math.PI / 180);
                this.ctx.globalAlpha = particle.life;
                this.ctx.fillStyle = particle.color;
                this.ctx.fillRect(-particle.size/2, -particle.size/2, particle.size, particle.size);
                this.ctx.restore();
                
                // Remove dead particles
                if (particle.life <= 0 || particle.y > this.canvas.height + 50) {
                    this.particles.splice(i, 1);
                }
            }
            
            if (this.particles.length > 0) {
                requestAnimationFrame(animate);
            }
        };
        
        animate();
    }

    // Heart floating animation
    createFloatingHearts() {
        const hearts = ['💖', '💕', '💗', '❤️', '💝'];
        const heart = document.createElement('div');
        heart.innerHTML = hearts[Math.floor(Math.random() * hearts.length)];
        heart.style.position = 'fixed';
        heart.style.left = Math.random() * 100 + 'vw';
        heart.style.top = '100vh';
        heart.style.fontSize = '2rem';
        heart.style.pointerEvents = 'none';
        heart.style.zIndex = '999';
        heart.style.animation = 'floatUp 6s linear forwards';
        
        document.body.appendChild(heart);
        
        setTimeout(() => {
            heart.remove();
        }, 6000);
    }

    startHeartAnimation() {
        setInterval(() => {
            this.createFloatingHearts();
        }, 3000);
    }
}

// Add CSS for heart animation
const heartAnimationCSS = `
    @keyframes floatUp {
        0% {
            transform: translateY(0) rotate(0deg);
            opacity: 1;
        }
        100% {
            transform: translateY(-110vh) rotate(360deg);
            opacity: 0;
        }
    }
`;

const style = document.createElement('style');
style.textContent = heartAnimationCSS;
document.head.appendChild(style);

// Initialize wedding invitation when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const invitation = new WeddingInvitation();
    invitation.startHeartAnimation();
})
