// Game state variables
let gameState = {
    currentRound: 1,
    totalRounds: 5,
    playerScore: 0,
    computerScore: 0,
    ties: 0,
    isGameActive: false
};

// DOM elements
const screens = {
    welcome: document.getElementById('welcome-screen'),
    setup: document.getElementById('setup-screen'),
    game: document.getElementById('game-screen'),
    results: document.getElementById('results-screen')
};

const elements = {
    startGame: document.getElementById('start-game'),
    backToWelcome: document.getElementById('back-to-welcome'),
    roundsInput: document.getElementById('rounds-input'),
    beginGame: document.getElementById('begin-game'),
    currentRound: document.getElementById('current-round'),
    totalRounds: document.getElementById('total-rounds'),
    playerScore: document.getElementById('player-score'),
    computerScore: document.getElementById('computer-score'),
    tiesScore: document.getElementById('ties-score'),
    countdown: document.getElementById('countdown'),
    playerChoiceDisplay: document.getElementById('player-choice-display'),
    computerChoiceDisplay: document.getElementById('computer-choice-display'),
    resultMessage: document.getElementById('result-message'),
    finalPlayerScore: document.getElementById('final-player-score'),
    finalComputerScore: document.getElementById('final-computer-score'),
    finalTiesScore: document.getElementById('final-ties-score'),
    winnerMessage: document.getElementById('winner-message'),
    playAgain: document.getElementById('play-again'),
    exitGame: document.getElementById('exit-game'),
    progressFill: document.getElementById('progress-fill')
};

const choiceButtons = document.querySelectorAll('.choice-btn');

// Choice mappings
const choiceIcons = {
    rock: 'fas fa-hand-rock',
    paper: 'fas fa-hand-paper',
    scissor: 'fas fa-hand-scissors'
};

const choices = ['rock', 'paper', 'scissor'];

// Initialize particles background
function createParticles() {
    const particlesContainer = document.getElementById('particles');
    const particleCount = 30;

    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.animationDelay = Math.random() * 6 + 's';
        particle.style.animationDuration = (Math.random() * 4 + 6) + 's';
        particlesContainer.appendChild(particle);
    }
}

// Screen management functions
function showScreen(screenName) {
    Object.values(screens).forEach(screen => screen.classList.remove('active'));
    screens[screenName].classList.add('active');

    // Add slide-in animation
    screens[screenName].style.animation = 'slideInFromBottom 0.6s ease-out';
}

// Progress bar update
function updateProgressBar() {
    const progress = (gameState.currentRound / gameState.totalRounds) * 100;
    elements.progressFill.style.width = progress + '%';
}

// Game logic functions
function getComputerChoice() {
    return choices[Math.floor(Math.random() * choices.length)];
}

function determineWinner(playerChoice, computerChoice) {
    if (playerChoice === computerChoice) {
        return 'tie';
    }

    if (
        (playerChoice === 'rock' && computerChoice === 'scissor') ||
        (playerChoice === 'paper' && computerChoice === 'rock') ||
        (playerChoice === 'scissor' && computerChoice === 'paper')
    ) {
        return 'win';
    }

    return 'lose';
}

function updateScoreDisplay() {
    elements.playerScore.textContent = gameState.playerScore;
    elements.computerScore.textContent = gameState.computerScore;
    elements.tiesScore.textContent = gameState.ties;
    elements.currentRound.textContent = `Round ${gameState.currentRound}`;
    elements.totalRounds.textContent = `${gameState.totalRounds}`;
    updateProgressBar();
}

function updateChoiceDisplay(element, choice, isPlayer = false) {
    element.innerHTML = `<i class="${choiceIcons[choice]}"></i>`;
    element.classList.add('active');

    // Add pulsing effect
    element.style.animation = 'resultPulse 0.6s ease-in-out';

    // Add color-specific styling
    const colorMap = {
        rock: '#ef4444',
        paper: '#10b981',
        scissor: '#f59e0b'
    };

    element.style.borderColor = colorMap[choice];
    element.style.boxShadow = `0 0 25px ${colorMap[choice]}40`;

    // Add choice-specific button highlighting if player choice
    if (isPlayer) {
        choiceButtons.forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.choice === choice) {
                btn.classList.add('active');
            }
        });
    }
}

function resetChoiceDisplays() {
    [elements.playerChoiceDisplay, elements.computerChoiceDisplay].forEach(display => {
        display.innerHTML = '<i class="fas fa-question"></i>';
        display.classList.remove('active');
        display.style.borderColor = 'rgba(139, 92, 246, 0.3)';
        display.style.boxShadow = 'none';
        display.style.animation = 'none';
    });

    // Remove active states from buttons
    choiceButtons.forEach(btn => btn.classList.remove('active'));
}

function showCountdown() {
    const countdownTexts = [
        'Choose Your Weapon in...',
        '3...',
        '2...',
        '1...',
        'SHOOT!!'
    ];
    let index = 0;

    elements.countdown.textContent = countdownTexts[index];
    elements.countdown.style.animation = 'pulse 1s ease-in-out infinite alternate';

    const countdownInterval = setInterval(() => {
        index++;
        if (index < countdownTexts.length) {
            elements.countdown.textContent = countdownTexts[index];

            // Add special effect for "SHOOT!!"
            if (index === countdownTexts.length - 1) {
                elements.countdown.style.animation = 'titleGlow 0.5s ease-in-out';
                elements.countdown.style.fontSize = '2.5rem';
            }
        } else {
            clearInterval(countdownInterval);
            elements.countdown.textContent = 'Make your choice!';
            elements.countdown.style.animation = 'pulse 2s ease-in-out infinite alternate';
            elements.countdown.style.fontSize = '2.2rem';
            enableChoiceButtons();
        }
    }, 1000);
}

function enableChoiceButtons() {
    choiceButtons.forEach(btn => {
        btn.disabled = false;
        btn.style.opacity = '1';
        btn.classList.remove('loading');
    });
    gameState.isGameActive = true;
}

function disableChoiceButtons() {
    choiceButtons.forEach(btn => {
        btn.disabled = true;
        btn.style.opacity = '0.5';
        btn.classList.add('loading');
    });
    gameState.isGameActive = false;
}

function playRound(playerChoice) {
    if (!gameState.isGameActive) return;

    disableChoiceButtons();

    // Add click feedback
    const clickedButton = document.querySelector(`[data-choice="${playerChoice}"]`);
    clickedButton.style.transform = 'scale(0.95)';
    setTimeout(() => {
        clickedButton.style.transform = '';
    }, 150);

    const computerChoice = getComputerChoice();
    const result = determineWinner(playerChoice, computerChoice);

    // Update displays with animation delay
    setTimeout(() => {
        updateChoiceDisplay(elements.playerChoiceDisplay, playerChoice, true);
    }, 200);

    setTimeout(() => {
        updateChoiceDisplay(elements.computerChoiceDisplay, computerChoice);
    }, 400);

    // Show result after choices are revealed
    setTimeout(() => {
        // Update scores
        if (result === 'win') {
            gameState.playerScore++;
            elements.resultMessage.textContent = 'YOU WIN THIS ROUND!!! 🎉';
            elements.resultMessage.style.color = '#10b981';
            elements.resultMessage.style.textShadow = '0 0 20px rgba(16, 185, 129, 0.5)';
        } else if (result === 'lose') {
            gameState.computerScore++;
            elements.resultMessage.textContent = 'YOU LOSE THIS ROUND!!! 😢';
            elements.resultMessage.style.color = '#ef4444';
            elements.resultMessage.style.textShadow = '0 0 20px rgba(239, 68, 68, 0.5)';
        } else {
            gameState.ties++;
            elements.resultMessage.textContent = 'IT\'S A TIE THIS ROUND!!! 🤝';
            elements.resultMessage.style.color = '#f59e0b';
            elements.resultMessage.style.textShadow = '0 0 20px rgba(245, 158, 11, 0.5)';
        }

        elements.resultMessage.style.animation = 'resultPulse 0.6s ease-in-out';
        updateScoreDisplay();
    }, 800);

    // Check if game is over
    setTimeout(() => {
        if (gameState.currentRound >= gameState.totalRounds) {
            endGame();
        } else {
            nextRound();
        }
    }, 3500);
}

function nextRound() {
    gameState.currentRound++;
    resetChoiceDisplays();
    elements.resultMessage.textContent = '';
    elements.resultMessage.style.animation = 'none';

    // Brief pause before next round
    setTimeout(() => {
        showCountdown();
    }, 1000);
}

function endGame() {
    // Update final scores with animation
    elements.finalPlayerScore.textContent = gameState.playerScore;
    elements.finalComputerScore.textContent = gameState.computerScore;
    elements.finalTiesScore.textContent = gameState.ties;

    // Determine overall winner with enhanced messaging
    let winnerText = '';
    let winnerColor = '';

    if (gameState.playerScore > gameState.computerScore) {
        winnerText = '🎉 VICTORY IS YOURS! 🎉';
        winnerColor = '#10b981';
        // Add confetti effect (simplified)
        createCelebration();
    } else if (gameState.computerScore > gameState.playerScore) {
        winnerText = '🤖 AI DOMINANCE! 🤖';
        winnerColor = '#ef4444';
    } else {
        winnerText = '🤝 PERFECT BALANCE! 🤝';
        winnerColor = '#f59e0b';
    }

    elements.winnerMessage.textContent = winnerText;
    elements.winnerMessage.style.color = winnerColor;
    elements.winnerMessage.style.textShadow = `0 0 30px ${winnerColor}60`;

    showScreen('results');
}

function createCelebration() {
    // Simple celebration effect
    const celebration = document.createElement('div');
    celebration.style.position = 'fixed';
    celebration.style.top = '50%';
    celebration.style.left = '50%';
    celebration.style.transform = 'translate(-50%, -50%)';
    celebration.style.fontSize = '4rem';
    celebration.style.zIndex = '1000';
    celebration.style.animation = 'bounce 2s ease-in-out';
    celebration.textContent = '🎊';
    document.body.appendChild(celebration);

    setTimeout(() => {
        document.body.removeChild(celebration);
    }, 2000);
}

function resetGame() {
    gameState = {
        currentRound: 1,
        totalRounds: 5,
        playerScore: 0,
        computerScore: 0,
        ties: 0,
        isGameActive: false
    };

    resetChoiceDisplays();
    elements.resultMessage.textContent = '';
    elements.resultMessage.style.animation = 'none';
    updateScoreDisplay();
}

// Share functions
function shareToTwitter() {
    const text = `Just played Rock Paper Scissors! Score: Me ${gameState.playerScore} - Computer ${gameState.computerScore} - Ties ${gameState.ties}`;
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
}

function copyScore() {
    const scoreText = `Rock Paper Scissors Results:\nYou: ${gameState.playerScore}\nComputer: ${gameState.computerScore}\nTies: ${gameState.ties}`;

    if (navigator.clipboard) {
        navigator.clipboard.writeText(scoreText).then(() => {
            showNotification('Score copied to clipboard!');
        });
    } else {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = scoreText;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        showNotification('Score copied to clipboard!');
    }
}

function showNotification(message) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: rgba(16, 185, 129, 0.9);
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        z-index: 1000;
        animation: slideInFromBottom 0.3s ease-out;
        backdrop-filter: blur(10px);
        border: 1px solid rgba(16, 185, 129, 0.3);
    `;
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'fadeOut 0.3s ease-out';
        setTimeout(() => {
            if (document.body.contains(notification)) {
                document.body.removeChild(notification);
            }
        }, 300);
    }, 2000);
}

// Event listeners
elements.startGame.addEventListener('click', () => {
    showScreen('setup');
});

elements.backToWelcome.addEventListener('click', () => {
    showScreen('welcome');
});

elements.beginGame.addEventListener('click', () => {
    const rounds = parseInt(elements.roundsInput.value);
    if (rounds < 1 || rounds > 20) {
        showNotification('Please enter a number between 1 and 20');
        elements.roundsInput.style.borderColor = '#ef4444';
        elements.roundsInput.style.animation = 'shake 0.5s ease-in-out';

        setTimeout(() => {
            elements.roundsInput.style.borderColor = 'rgba(6, 182, 212, 0.3)';
            elements.roundsInput.style.animation = 'none';
        }, 500);
        return;
    }

    gameState.totalRounds = rounds;
    resetGame();
    gameState.totalRounds = rounds;
    updateScoreDisplay();
    showScreen('game');

    setTimeout(() => {
        showCountdown();
    }, 1000);
});

choiceButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        const choice = btn.dataset.choice;
        playRound(choice);
    });

    // Add hover sound effect (visual feedback)
    btn.addEventListener('mouseenter', () => {
        if (!btn.disabled) {
            btn.style.transform = 'translateY(-4px) scale(1.05)';
        }
    });

    btn.addEventListener('mouseleave', () => {
        if (!btn.disabled) {
            btn.style.transform = '';
        }
    });
});

elements.playAgain.addEventListener('click', () => {
    showScreen('setup');
});

elements.exitGame.addEventListener('click', () => {
    resetGame();
    showScreen('welcome');
});

// Enhanced keyboard support
document.addEventListener('keydown', (e) => {
    if (!gameState.isGameActive) return;

    let choice = null;
    switch(e.key.toLowerCase()) {
        case 'r':
            choice = 'rock';
            break;
        case 'p':
            choice = 'paper';
            break;
        case 's':
            choice = 'scissor';
            break;
    }

    if (choice) {
        e.preventDefault();
        playRound(choice);

        // Visual feedback for keyboard input
        const button = document.querySelector(`[data-choice="${choice}"]`);
        button.style.transform = 'scale(0.95)';
        setTimeout(() => {
            button.style.transform = '';
        }, 150);
    }
});

// Input validation for rounds
elements.roundsInput.addEventListener('input', (e) => {
    const value = parseInt(e.target.value);
    if (value < 1 || value > 20) {
        e.target.style.borderColor = '#ef4444';
    } else {
        e.target.style.borderColor = 'rgba(6, 182, 212, 0.3)';
    }
});

// Initialize game
document.addEventListener('DOMContentLoaded', () => {
    showScreen('welcome');
    resetGame();
    createParticles();

    // Add fade-in animation to body
    document.body.style.opacity = '0';
    document.body.style.animation = 'fadeIn 1s ease-out forwards';
});

// Add CSS for additional animations
const additionalStyles = `
@keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
}

@keyframes fadeOut {
    from { opacity: 1; }
    to { opacity: 0; }
}

@keyframes shake {
    0%, 100% { transform: translateX(0); }
    25% { transform: translateX(-5px); }
    50% { transform: translateX(5px); }
    75% { transform: translateX(-5px); }
}
`;

// Inject additional styles
const styleSheet = document.createElement('style');
styleSheet.textContent = additionalStyles;
document.head.appendChild(styleSheet);