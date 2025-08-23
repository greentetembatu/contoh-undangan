    // --- Countdown Timer ---
    const countdownElement = document.getElementById('countdown');
    const weddingDate = new Date('August 4, 2026 09:00:00').getTime(); // Sesuaikan tanggal pernikahan

    function updateCountdown() {
        const now = new Date().getTime();
        const distance = weddingDate - now;

        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        countdownElement.innerHTML = `
            <div>${days}<span>Hari</span></div>
            <div>${hours}<span>Jam</span></div>
            <div>${minutes}<span>Menit</span></div>
            <div>${seconds}<span>Detik</span></div>
        `;

        if (distance < 0) {
            clearInterval(countdownInterval);
            countdownElement.innerHTML = "<div>Sudah</div><div>Dimulai!</div>";
        }
    }

    const countdownInterval = setInterval(updateCountdown, 1000);
    updateCountdown(); // Initial call to display countdown immediately









