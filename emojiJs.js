
        // Theme Toggle
        const themeToggle = document.getElementById('themeToggle');
        const body = document.body;
        
        themeToggle.addEventListener('click', () => {
            body.classList.toggle('dark-mode');
            if (body.classList.contains('dark-mode')) {
                themeToggle.textContent = '☀️';
                localStorage.setItem('theme', 'dark');
            } else {
                themeToggle.textContent = '🌙';
                localStorage.setItem('theme', 'light');
            }
            playSound();
        });

        // Check for saved theme preference
        if (localStorage.getItem('theme') === 'dark') {
            body.classList.add('dark-mode');
            themeToggle.textContent = '☀️';
        }

        // Emoji Picker
        const emojiAvatar = document.getElementById('emojiAvatar');
        const emojiPicker = document.getElementById('emojiPicker');
        const emojiOverlay = document.getElementById('emojiOverlay');
        const emojiOptions = document.querySelectorAll('.emoji-option');

        emojiAvatar.addEventListener('click', () => {
            emojiPicker.style.display = 'flex';
            emojiOverlay.style.display = 'block';
            playSound();
        });

        emojiOverlay.addEventListener('click', () => {
            emojiPicker.style.display = 'none';
            emojiOverlay.style.display = 'none';
        });

        emojiOptions.forEach(option => {
            option.addEventListener('click', () => {
                emojiAvatar.innerHTML = option.textContent;
                emojiPicker.style.display = 'none';
                emojiOverlay.style.display = 'none';
                playSound();
            });
        });

        // Button Actions
        const createLobbyBtn = document.getElementById('createLobbyBtn');
        const quickPlayBtn = document.getElementById('quickPlayBtn');
        const loadingScreen = document.getElementById('loadingScreen');
        const clickSound = document.getElementById('clickSound');

        function playSound() {
            clickSound.currentTime = 0;
            clickSound.play();
        }

        function showLoading() {
            loadingScreen.style.display = 'flex';
            setTimeout(() => {
                loadingScreen.style.display = 'none';
                alert("Game found! Ready to play! 🎉");
            }, 2000);
        }

        createLobbyBtn.addEventListener('click', () => {
            const playerName = document.getElementById('playerName').value;
            const lobbyName = document.getElementById('lobbyName').value;
            
            if (!playerName) {
                alert("Oops! Name can't be blank! 🙈");
                return;
            }
            
            if (!lobbyName) {
                alert("Please give your lobby a fun name! 🚪");
                return;
            }
            
            playSound();
            confetti({
                particleCount: 100,
                spread: 70,
                origin: { y: 0.6 }
            });
            showLoading();
        });

        quickPlayBtn.addEventListener('click', () => {
            const playerName = document.getElementById('playerName').value;
            
            if (!playerName) {
                alert("Oops! Name can't be blank! 🙈");
                return;
            }
            
            playSound();
            confetti({
                particleCount: 150,
                spread: 100,
                origin: { y: 0.6 }
            });
            showLoading();
        });

        // Make emojis interactive
        const emojis = document.querySelectorAll('.emoji-icon, .btn-emoji');
        emojis.forEach(emoji => {
            emoji.addEventListener('mouseenter', () => {
                emoji.style.animation = 'wiggle 0.5s ease';
                setTimeout(() => {
                    emoji.style.animation = '';
                }, 500);
            });
        });