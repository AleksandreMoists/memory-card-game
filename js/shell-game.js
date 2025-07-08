// Shell Game JavaScript
let shellCards = [];
let currentShellItem = null;
let correctCup = null;
let gameInProgress = false;
let shellMoves = 0;
let shellDifficulty = 'easy';

// Difficulty settings
const shellDifficultySettings = {
    easy: {
        cups: 3,
        shuffleMoves: 10,
        shuffleSpeed: 300
    },
    medium: {
        cups: 4,
        shuffleMoves: 15,
        shuffleSpeed: 250
    },
    hard: {
        cups: 5,
        shuffleMoves: 20,
        shuffleSpeed: 200
    }
};

// Fetch memory cards data for shell game
async function fetchShellCards() {
    try {
        const response = await fetch('./data/memory-cards.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        shellCards = await response.json();
        console.log('Shell game cards loaded:', shellCards);
        return shellCards;
    } catch (error) {
        console.error('Error fetching shell cards:', error);
        return [];
    }
}

// Initialize shell game (called from main.js)
async function initShellGame(difficulty = 'easy') {
    shellDifficulty = difficulty;
    await fetchShellCards();
    
    if (shellCards.length > 0) {
        setupShellGame();
    } else {
        console.error('No cards available for shell game');
    }
}

// Setup the shell game
function setupShellGame() {
    gameInProgress = false;
    shellMoves = 0;
    
    // Select random item to hide
    currentShellItem = shellCards[Math.floor(Math.random() * shellCards.length)];
    
    // Get difficulty settings
    const settings = shellDifficultySettings[shellDifficulty];
    
    // Render the game
    renderShellGame(settings.cups);
    
    // Update UI
    updateShellGameUI();
}

// Render shell game interface
function renderShellGame(numCups) {
    const shellContainer = document.getElementById('shell-game-container');
    if (!shellContainer) {
        console.error('Shell game container not found');
        return;
    }
    
    shellContainer.innerHTML = `
        <div class="shell-game-info">
            <h2>Find the ${currentShellItem.name.toUpperCase()}!</h2>
            <div class="shell-stats">
                <div class="shell-stat">
                    <label>Attempts:</label>
                    <span id="shell-moves">0</span>
                </div>
                <div class="shell-stat">
                    <label>Difficulty:</label>
                    <span id="shell-difficulty">${shellDifficulty.toUpperCase()}</span>
                </div>
            </div>
        </div>
        
        <div class="shell-item-display">
            <div class="hidden-item">
                <img src="${currentShellItem.image}" alt="${currentShellItem.name}">
                <p>Remember this ${currentShellItem.name}!</p>
            </div>
        </div>
        
        <div class="shell-cups-container">
            <div class="shell-cups" id="shell-cups">
                ${generateCups(numCups)}
            </div>
        </div>
        
        <div class="shell-controls">
            <button id="start-shell-game" class="game-button">Start Game</button>
            <button id="restart-shell-game" class="game-button">New Game</button>
        </div>
        
        <div class="shell-message" id="shell-message"></div>
    `;
    
    // Set up event listeners
    setupShellEventListeners();
}

// Generate cups HTML
function generateCups(numCups) {
    let cupsHTML = '';
    for (let i = 0; i < numCups; i++) {
        cupsHTML += `
            <div class="shell-cup" data-cup="${i}">
                <div class="cup-top"></div>
                <div class="cup-body"></div>
                <div class="cup-item hidden">
                    <img src="${currentShellItem.image}" alt="${currentShellItem.name}">
                </div>
            </div>
        `;
    }
    return cupsHTML;
}

// Setup event listeners for shell game
function setupShellEventListeners() {
    const startButton = document.getElementById('start-shell-game');
    const restartButton = document.getElementById('restart-shell-game');
    const cups = document.querySelectorAll('.shell-cup');
    
    if (startButton) {
        startButton.addEventListener('click', startShellGame);
    }
    
    if (restartButton) {
        restartButton.addEventListener('click', setupShellGame);
    }
    
    cups.forEach(cup => {
        cup.addEventListener('click', () => {
            if (!gameInProgress) {
                handleCupClick(parseInt(cup.dataset.cup));
            }
        });
    });
}

// Start the shell game
function startShellGame() {
    if (gameInProgress) return;
    
    gameInProgress = true;
    const settings = shellDifficultySettings[shellDifficulty];
    
    // Place item under random cup
    correctCup = Math.floor(Math.random() * settings.cups);
    
    // Hide the item display
    const itemDisplay = document.querySelector('.shell-item-display');
    if (itemDisplay) {
        itemDisplay.classList.add('hidden');
    }
    
    // Show item under correct cup
    const cups = document.querySelectorAll('.shell-cup');
    cups[correctCup].querySelector('.cup-item').classList.remove('hidden');
    
    // Start shuffling animation
    shuffleCups(settings.shuffleMoves, settings.shuffleSpeed);
    
    // Update UI
    document.getElementById('start-shell-game').disabled = true;
    updateShellMessage('Watch carefully! The shuffling is starting...');
}

// Shuffle cups animation
function shuffleCups(moves, speed) {
    let currentMoves = 0;
    
    const shuffleInterval = setInterval(() => {
        if (currentMoves >= moves) {
            clearInterval(shuffleInterval);
            gameInProgress = false;
            updateShellMessage('Find the ' + currentShellItem.name + '! Click on a cup.');
            document.getElementById('start-shell-game').disabled = false;
            return;
        }
        
        // Animate random cup swaps
        const cups = document.querySelectorAll('.shell-cup');
        const cup1 = Math.floor(Math.random() * cups.length);
        let cup2 = Math.floor(Math.random() * cups.length);
        while (cup2 === cup1) {
            cup2 = Math.floor(Math.random() * cups.length);
        }
        
        // Visual swap animation
        swapCups(cup1, cup2);
        
        // Update correct cup position if it was involved in swap
        if (correctCup === cup1) {
            correctCup = cup2;
        } else if (correctCup === cup2) {
            correctCup = cup1;
        }
        
        currentMoves++;
    }, speed);
}

// Swap two cups visually
function swapCups(index1, index2) {
    const cups = document.querySelectorAll('.shell-cup');
    const cup1 = cups[index1];
    const cup2 = cups[index2];
    
    // Add swap animation class
    cup1.classList.add('swapping');
    cup2.classList.add('swapping');
    
    // Remove animation class after animation
    setTimeout(() => {
        cup1.classList.remove('swapping');
        cup2.classList.remove('swapping');
    }, 200);
}

// Handle cup click
function handleCupClick(cupIndex) {
    if (gameInProgress) return;
    
    shellMoves++;
    updateShellGameUI();
    
    // Reveal all cups
    const cups = document.querySelectorAll('.shell-cup');
    cups.forEach((cup, index) => {
        if (index === correctCup) {
            cup.classList.add('correct');
            cup.querySelector('.cup-item').classList.remove('hidden');
        } else {
            cup.classList.add('incorrect');
        }
    });
    
    // Check if correct
    if (cupIndex === correctCup) {
        updateShellMessage(`🎉 Correct! You found the ${currentShellItem.name} in ${shellMoves} attempt${shellMoves === 1 ? '' : 's'}!`);
        
        // Auto-restart after delay
        setTimeout(() => {
            setupShellGame();
        }, 3000);
    } else {
        updateShellMessage(`❌ Wrong! The ${currentShellItem.name} was under cup ${correctCup + 1}. Try again!`);
        
        // Auto-restart after delay
        setTimeout(() => {
            setupShellGame();
        }, 3000);
    }
}

// Update shell game UI
function updateShellGameUI() {
    const movesElement = document.getElementById('shell-moves');
    const difficultyElement = document.getElementById('shell-difficulty');
    
    if (movesElement) {
        movesElement.textContent = shellMoves;
    }
    
    if (difficultyElement) {
        difficultyElement.textContent = shellDifficulty.toUpperCase();
    }
}

// Update shell game message
function updateShellMessage(message) {
    const messageElement = document.getElementById('shell-message');
    if (messageElement) {
        messageElement.textContent = message;
    }
}

// Initialize shell game when called from main.js
if (typeof initShellGame === 'function') {
    // Function is already defined above
} else {
    console.error('initShellGame function not properly defined');
}