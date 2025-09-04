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
        const particleCount = 500;
        
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
        heart.style.animation = 'floatUp 12s linear forwards'; //kecepatan love
        
        document.body.appendChild(heart);
        
        setTimeout(() => {
            heart.remove();
        }, 12000);
    }

    startHeartAnimation() {
        setInterval(() => {
            this.createFloatingHearts();
        }, 1000); //banyaknya love
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
    
    // Initialize additional functionality
    initializeSectionAnimations();
    initializeNavigation();
    initializeForms();
    initializeWishesDisplay();
    initializeCopyFunctions();
});







// Section Animation Observer
function initializeSectionAnimations() {
    const observerOptions = {
        threshold: 0.0,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Saat elemen masuk ke viewport, tambahkan kelas animasi
                entry.target.classList.add('fade-in-up');
                
                // Animate children elements
                const fromLeft = entry.target.querySelectorAll('.from-left');
                const fromRight = entry.target.querySelectorAll('.from-right');
                
                setTimeout(() => {
                    fromLeft.forEach(el => el.classList.add('animate'));
                }, 400);
                
                setTimeout(() => {
                    fromRight.forEach(el => el.classList.add('animate'));
                }, 800);
            } else {
                // Jika elemen keluar dari viewport, hapus kelas animasi
                entry.target.classList.remove('fade-in-up');
                
                // Hapus juga kelas animasi dari elemen anak-anak
                entry.target.querySelectorAll('.from-left').forEach(el => el.classList.remove('animate'));
                entry.target.querySelectorAll('.from-right').forEach(el => el.classList.remove('animate'));
            }
        });
    }, observerOptions);

    // Observe all sections with hidden-item class
    document.querySelectorAll('.hidden-item').forEach(section => {
        observer.observe(section);
    });
}

// Navigation functionality
function initializeNavigation() {
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);
            
            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}


















document.addEventListener('DOMContentLoaded', function() {
    // Fungsi untuk mengontrol animasi fade-in
    function setupIntersectionObserver() {
        const sections = document.querySelectorAll('.hidden-item');
        const observerOptions = {
            threshold: 0.1
        };

        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        sections.forEach(section => {
            observer.observe(section);
        });
    }





























    
    // Fungsi untuk menangani formulir RSVP (tanpa perubahan)
    function handleRsvpForm() {
        const rsvpForm = document.getElementById('rsvp-form');
        const rsvpMessage = document.getElementById('rsvp-message');

        if (!rsvpForm) return;

        rsvpForm.addEventListener('submit', function(event) {
            event.preventDefault();
            const name = document.getElementById('rsvp-name').value;
            const attendance = document.getElementById('rsvp-attendance').value;
            const guests = document.getElementById('rsvp-guests').value;
            console.log("RSVP Submission:", { name, attendance, guests });

            if (name && attendance) {
                rsvpMessage.textContent = 'Terima kasih atas konfirmasinya! Kami akan menantikan kehadiran Anda.';
                rsvpMessage.className = 'message success';
                rsvpForm.reset();
            } else {
                rsvpMessage.textContent = 'Mohon lengkapi semua data yang diperlukan.';
                rsvpMessage.className = 'message error';
            }
        });
    }

    // Array untuk menyimpan data ucapan (contoh data)
    let wishes = [
        { name: "Ahmad", message: "Semoga menjadi keluarga yang sakinah, mawaddah, warahmah.", timestamp: new Date('2025-08-01T10:00:00') },
        { name: "Siti", message: "Selamat menempuh hidup baru. Semoga langgeng sampai maut memisahkan.", timestamp: new Date('2025-08-01T10:05:00') },
        { name: "Fatimah", message: "Semoga pernikahan kalian selalu diberkahi Allah SWT.", timestamp: new Date('2025-08-01T10:15:00') },
        { name: "Budi", message: "Happy wedding! Semoga cinta kalian abadi.", timestamp: new Date('2025-08-01T10:20:00') },
        { name: "Dewi", message: "Semoga menjadi pasangan yang selalu harmonis dan penuh cinta.", timestamp: new Date('2025-08-01T10:30:00') },
        { name: "Rizky", message: "Semoga cepat dapat momongan dan menjadi orang tua yang baik.", timestamp: new Date('2025-08-01T11:00:00') },
        { name: "Putri", message: "Selamat menempuh hidup baru, semoga selalu dalam lindungan Allah SWT.", timestamp: new Date('2025-08-01T11:25:00') },
        { name: "Joko", message: "Barakallah, semoga samawa ya. Aamiin.", timestamp: new Date('2025-08-01T11:40:00') },
        { name: "Maria", message: "Semoga selalu romantis dan kompak sampai kakek nenek.", timestamp: new Date('2025-08-01T12:00:00') },
        { name: "Leo", message: "Happy wedding! Semoga semua impian kalian tercapai. Congrats!", timestamp: new Date('2025-08-01T12:15:00') },
        { name: "Siti", message: "Selamat menempuh hidup baru. Semoga langgeng sampai maut memisahkan.", timestamp: new Date('2025-08-01T10:05:00') },
        { name: "Fatimah", message: "Semoga pernikahan kalian selalu diberkahi Allah SWT.", timestamp: new Date('2025-08-01T10:15:00') },
        { name: "Budi", message: "Happy wedding! Semoga cinta kalian abadi.", timestamp: new Date('2025-08-01T10:20:00') },
        { name: "Dewi", message: "Semoga menjadi pasangan yang selalu harmonis dan penuh cinta.", timestamp: new Date('2025-08-01T10:30:00') },
        { name: "Rizky", message: "Semoga cepat dapat momongan dan menjadi orang tua yang baik.", timestamp: new Date('2025-08-01T11:00:00') },
        { name: "Putri", message: "Selamat menempuh hidup baru, semoga selalu dalam lindungan Allah SWT.", timestamp: new Date('2025-08-01T11:25:00') },
        { name: "Joko", message: "Barakallah, semoga samawa ya. Aamiin.", timestamp: new Date('2025-08-01T11:40:00') },
        { name: "Maria", message: "Semoga selalu romantis dan kompak sampai kakek nenek.", timestamp: new Date('2025-08-01T12:00:00') },
        { name: "Leo", message: "Happy wedding! Semoga semua impian kalian tercapai. Congrats!", timestamp: new Date('2025-08-01T12:15:00') },
        { name: "Kiki", message: "Sakinah, mawaddah, warahmah. Doa terbaik untuk kalian berdua.", timestamp: new Date('2025-08-01T12:30:00') }
    ];

    const wishesPerPage = 5;
    let currentPage = 1;

    // Fungsi untuk memformat tanggal dan waktu
    function formatTimestamp(timestamp) {
        const options = {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
        };
        return timestamp.toLocaleDateString('id-ID', options);
    }

    // Fungsi untuk menampilkan ucapan berdasarkan halaman
    function displayWishes(page) {
        const wishesContainer = document.getElementById('current-wish-container');
        if (!wishesContainer) return;

        wishesContainer.innerHTML = '';
        const start = (page - 1) * wishesPerPage;
        const end = start + wishesPerPage;
        const paginatedWishes = wishes.slice(start, end);

        if (paginatedWishes.length === 0) {
            wishesContainer.innerHTML = '<p style="text-align:center;">Belum ada ucapan.</p>';
            return;
        }

        paginatedWishes.forEach(wish => {
            const wishItem = document.createElement('div');
            wishItem.classList.add('wish-item');
            wishItem.innerHTML = `
                <p class="wish-name">${wish.name}</p>
                <p class="wish-date">${formatTimestamp(wish.timestamp)}</p>
                <p class="wish-message">${wish.message}</p>
            `;
            wishesContainer.appendChild(wishItem);
        });
    }
    
    // --- FUNGSI BARU UNTUK PAGINATION ---
    function setupNavigationButtons() {
        const totalPages = Math.ceil(wishes.length / wishesPerPage);
        const wishesDisplayArea = document.querySelector('.wishes-display-area');

        // Hapus tombol-tombol navigasi lama jika ada
        const oldNavButtons = wishesDisplayArea.querySelector('.nav-buttons');
        if (oldNavButtons) {
            oldNavButtons.remove();
        }
        
        // Buat container baru untuk tombol navigasi
        const navContainer = document.createElement('div');
        navContainer.classList.add('nav-buttons');

        // Buat tombol "Sebelumnya"
        if (currentPage > 1) {
            const prevButton = document.createElement('button');
            prevButton.classList.add('page-nav-button', 'prev-button');
            prevButton.textContent = 'Sebelumnya';
            prevButton.addEventListener('click', () => {
                currentPage--;
                displayWishes(currentPage);
                setupNavigationButtons();
            });
            navContainer.appendChild(prevButton);
        }

        // Buat tombol "Selanjutnya"
        if (currentPage < totalPages) {
            const nextButton = document.createElement('button');
            nextButton.classList.add('page-nav-button', 'next-button');
            nextButton.textContent = 'Selanjutnya';
            nextButton.addEventListener('click', () => {
                currentPage++;
                displayWishes(currentPage);
                setupNavigationButtons();
            });
            navContainer.appendChild(nextButton);
        }

        if (navContainer.children.length > 0) {
            wishesDisplayArea.appendChild(navContainer);
        }
    }

    // Fungsi untuk menangani formulir ucapan
    function handleWishesForm() {
        const wishesForm = document.getElementById('wishes-form');
        const wishesMessage = document.getElementById('wishes-message');

        if (!wishesForm) return;

        wishesForm.addEventListener('submit', function(event) {
            event.preventDefault();

            const name = document.getElementById('wisher-name').value;
            const message = document.getElementById('wisher-message').value;

            if (name && message) {
                const newWish = {
                    name,
                    message,
                    timestamp: new Date()
                };
                wishes.unshift(newWish);

                wishesMessage.textContent = 'Terima kasih, ucapan Anda telah terkirim!';
                wishesMessage.className = 'message success';
                wishesForm.reset();

                currentPage = 1;
                displayWishes(currentPage);
                setupNavigationButtons(); // Panggil fungsi baru
            } else {
                wishesMessage.textContent = 'Mohon lengkapi semua data.';
                wishesMessage.className = 'message error';
            }
        });
    }
    
    // Inisialisasi semua fungsi saat halaman dimuat
    setupIntersectionObserver();
    handleRsvpForm();
    handleWishesForm();
    displayWishes(currentPage);
    setupNavigationButtons(); // Panggil fungsi baru
});





document.addEventListener('DOMContentLoaded', function() {
    // Fungsi untuk menyalin teks ke clipboard
    window.copyToClipboard = async function(elementId, buttonElement) {
        const element = document.getElementById(elementId);
        const textToCopy = element.textContent;
        const copyMessageElement = buttonElement.nextElementSibling;

        try {
            await navigator.clipboard.writeText(textToCopy.trim());
            
            // Tampilkan pesan "Disalin!"
            copyMessageElement.style.display = 'block';
            setTimeout(() => {
                copyMessageElement.style.display = 'none';
            }, 2000); // Pesan akan hilang setelah 2 detik

        } catch (err) {
            console.error('Gagal menyalin teks: ', err);
            // Anda bisa menambahkan fallback atau pesan error di sini
        }
    };

    // Fungsi untuk menyalin alamat ke clipboard
    window.copyAddress = async function(buttonElement) {
        const addressElement = document.getElementById('gift-address-info');
        const textToCopy = addressElement.innerText.trim();
        const copyMessageElement = buttonElement.nextElementSibling;

        try {
            await navigator.clipboard.writeText(textToCopy);
            
            // Tampilkan pesan "Disalin!"
            copyMessageElement.style.display = 'block';
            setTimeout(() => {
                copyMessageElement.style.display = 'none';
            }, 2000); // Pesan akan hilang setelah 2 detik
            
        } catch (err) {
            console.error('Gagal menyalin alamat: ', err);
            // Anda bisa menambahkan fallback atau pesan error di sini
        }
    };
});






















