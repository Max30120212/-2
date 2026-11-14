document.addEventListener('DOMContentLoaded', () => {
    const menuScreen = document.getElementById('menu-screen');
    const guessScreen = document.getElementById('guess-screen');
    const rpsScreen = document.getElementById('rps-screen');

    const toGuessBtn = document.getElementById('to-guess-game');
    const toRpsBtn = document.getElementById('to-rps-game');
    const backToMenu1 = document.getElementById('back-to-menu-1');
    const backToMenu2 = document.getElementById('back-to-menu-2');

    let userName = localStorage.getItem('gameUserName') || '';

    function askUserName() {
        while (!userName || userName.trim() === '') {
            userName = prompt('Будь ласка, введіть своє ім\'я для початку гри:');
            if (userName) {
                userName = userName.trim();
            }
        }
        localStorage.setItem('gameUserName', userName);
        updatePlayerGreeting();
    }

    function updatePlayerGreeting() {
        const greetingElem = document.getElementById('player-name-display');
        if (greetingElem) {
            greetingElem.textContent = `Гравець: ${userName}`;
        }
    }

    askUserName();

    const savedBgColor = localStorage.getItem('gameBgColor');
    if (savedBgColor) {
        document.body.style.backgroundColor = savedBgColor;
    }

    const bgPicker = document.getElementById('bg-color-picker');
    if (bgPicker) {
        if (savedBgColor) {
            bgPicker.value = savedBgColor;
        }
        bgPicker.addEventListener('input', (e) => {
            const color = e.target.value;
            document.body.style.backgroundColor = color;
            localStorage.setItem('gameBgColor', color);
        });
    }

    if (toGuessBtn) {
        toGuessBtn.addEventListener('click', () => {
            if (!userName) askUserName();
            menuScreen.classList.add('hidden');
            guessScreen.classList.remove('hidden');
            if (userInput) userInput.focus(); 
        });
    }

    if (toRpsBtn) {
        toRpsBtn.addEventListener('click', () => {
            if (!userName) askUserName();
            menuScreen.classList.add('hidden');
            rpsScreen.classList.remove('hidden');
        });
    }

    if (backToMenu1) {
        backToMenu1.addEventListener('click', () => {
            guessScreen.classList.add('hidden');
            menuScreen.classList.remove('hidden');
            restartGame();
        });
    }

    if (backToMenu2) {
        backToMenu2.addEventListener('click', () => {
            rpsScreen.classList.add('hidden');
            menuScreen.classList.remove('hidden');
        });
    }

    let secretNumber = Math.floor(Math.random() * 100) + 1;
    let attemptsCount = 0;

    const userInput = document.getElementById('user-input');
    const guessBtn = document.getElementById('guess-btn');
    const message = document.getElementById('message');
    const attemptsDisplay = document.getElementById('attempts');
    const restartBtn = document.getElementById('restart-btn');

    let bestScoreDisplay = document.getElementById('best-score');
    if (!bestScoreDisplay) {
        const statsContainer = document.querySelector('.stats');
        if (statsContainer) {
            const bestScoreElem = document.createElement('div');
            bestScoreElem.style.marginTop = '5px';
            bestScoreElem.innerHTML = 'Найкращий результат: <strong id="best-score">-</strong>';
            statsContainer.appendChild(bestScoreElem);
            bestScoreDisplay = document.getElementById('best-score');
        }
    }

    let bestScore = localStorage.getItem('guessBestScore') || null;
    if (bestScore && bestScoreDisplay) {
        bestScoreDisplay.textContent = bestScore;
    }

    function handleGuess() {
        if (!userInput) return;
        const userValue = Number(userInput.value);

        if (!userInput.value || userValue < 1 || userValue > 100) {
            if (message) {
                message.textContent = `⚠️ ${userName}, введіть число від 1 до 100!`;
                message.style.color = '#d97706';
            }
            return;
        }

        attemptsCount++;
        if (attemptsDisplay) attemptsDisplay.textContent = attemptsCount;

        if (userValue === secretNumber) {
            if (message) {
                message.textContent = `🎉 Вітаю, ${userName}! Ви вгадали число за ${attemptsCount} спроб!`;
                message.style.color = '#059669';
            }
            
            if (!bestScore || attemptsCount < Number(bestScore)) {
                bestScore = attemptsCount;
                localStorage.setItem('guessBestScore', bestScore);
                if (bestScoreDisplay) {
                    bestScoreDisplay.textContent = bestScore;
                }
                if (message) message.textContent += ' 🏆 Новий рекорд!';
            }

            finishGame();
        } else if (userValue < secretNumber) {
            if (message) {
                message.textContent = '📈 Загадане число більше!';
                message.style.color = '#dc2626';
            }
        } else {
            if (message) {
                message.textContent = '📉 Загадане число менше!';
                message.style.color = '#dc2626';
            }
        }

        userInput.value = '';
        userInput.focus();
    }

    function finishGame() {
        if (userInput) userInput.disabled = true;
        if (guessBtn) guessBtn.disabled = true;
        if (restartBtn) restartBtn.classList.remove('hidden');
    }

    function restartGame() {
        secretNumber = Math.floor(Math.random() * 100) + 1;
        attemptsCount = 0;
        if (attemptsDisplay) attemptsDisplay.textContent = '0';
        if (message) message.textContent = '';
        
        if (userInput) {
            userInput.disabled = false;
            userInput.value = '';
            userInput.focus();
        }
        if (guessBtn) guessBtn.disabled = false;
        if (restartBtn) restartBtn.classList.add('hidden');
    }

    if (guessBtn) guessBtn.addEventListener('click', handleGuess);

    if (userInput) {
        userInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                handleGuess();
            }
        });
    }

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && guessScreen && !guessScreen.classList.contains('hidden')) {
            restartGame();
        }
    });

    if (restartBtn) restartBtn.addEventListener('click', restartGame);

    const rpsChoices = document.querySelectorAll('.rps-choice');
    const rpsMessage = document.getElementById('rps-message');
    const playerChoiceDisplay = document.getElementById('player-choice');
    const computerChoiceDisplay = document.getElementById('computer-choice');

    const choices = ['камінь', 'ножиці', 'папір'];

    rpsChoices.forEach(button => {
        button.addEventListener('click', () => {
            const playerChoice = button.getAttribute('data-choice');
            const computerChoice = choices[Math.floor(Math.random() * choices.length)];

            if (playerChoiceDisplay) playerChoiceDisplay.textContent = playerChoice;
            if (computerChoiceDisplay) computerChoiceDisplay.textContent = computerChoice;

            if (playerChoice === computerChoice) {
                if (rpsMessage) {
                    rpsMessage.textContent = `🤝 Нічия, ${userName}!`;
                    rpsMessage.style.color = '#d97706';
                }
            } else if (
                (playerChoice === 'камінь' && computerChoice === 'ножиці') ||
                (playerChoice === 'ножиці' && computerChoice === 'папір') ||
                (playerChoice === 'папір' && computerChoice === 'камінь')
            ) {
                if (rpsMessage) {
                    rpsMessage.textContent = `🎉 ${userName}, ти переміг!`;
                    rpsMessage.style.color = '#059669';
                }
            } else {
                if (rpsMessage) {
                    rpsMessage.textContent = '💻 Комп\'ютер переміг!';
                    rpsMessage.style.color = '#dc2626';
                }
            }
        });
    });
});