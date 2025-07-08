// Memory Game JavaScript
let memoryCards = [];
let gameBoard = [];
let flippedCards = [];
let matchedPairs = 0;
let moves = 0;
let gameStarted = false;

// Difficulty settings
const difficultySettings = {
    easy: 4,   // 4 pairs = 8 cards
    medium: 6, // 6 pairs = 12 cards
    hard: 8    // 8 pairs = 16 cards
};

// Fetch memory cards data
async function fetchMemoryCards() {
    try {
        const response = await fetch('./data/memory-cards.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        memoryCards = await response.json();
        console.log('Memory cards loaded:', memoryCards);
        return memoryCards;
    } catch (error) {
        console.error('Error fetching memory cards:', error);
        return [];
    }
}

// Initialize the memory game
async function initMemoryGame(difficulty = 'medium') {
    console.log(`Initializing Memory Game with difficulty: ${difficulty}`);
    await fetchMemoryCards();
    if (memoryCards.length > 0) {
        setupGame(difficulty);
    } else {
        console.error('No memory cards available to start the game');
    }
}

// Setup the game board
function setupGame(difficulty = 'medium') {
    const numPairs = difficultySettings[difficulty];
    
    // Take a slice of the full card deck
    const gameCards = memoryCards.slice(0, numPairs);
    
    // Create pairs from the sliced deck
    gameBoard = [...gameCards, ...gameCards];
    
    // Shuffle the cards
    shuffleArray(gameBoard);
    
    // Reset game state
    flippedCards = [];
    matchedPairs = 0;
    moves = 0;
    gameStarted = false;
    
    // Set difficulty data attribute for CSS styling
    const gameContainer = document.getElementById('memory-game-container');
    if (gameContainer) {
        gameContainer.dataset.difficulty = difficulty;
    }
    
    // Render the game board
    renderGameBoard();
}

// Shuffle array function
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

// Render the game board
function renderGameBoard() {
    const gameContainer = document.getElementById('memory-game-container');
    if (!gameContainer) {
        console.error('Game container not found');
        return;
    }
    
    gameContainer.innerHTML = '';
    
    gameBoard.forEach((card, index) => {
        const cardElement = document.createElement('div');
        cardElement.className = 'memory-card';
        cardElement.dataset.index = index;
        cardElement.dataset.name = card.name;
        
        cardElement.innerHTML = `
            <div class="card-inner">
                <div class="card-front">
                    <span>?</span>
                </div>
                <div class="card-back">
                    <img src="${card.image}" alt="${card.name}">
                </div>
            </div>
        `;
        
        cardElement.addEventListener('click', () => flipCard(index));
        gameContainer.appendChild(cardElement);
    });
}

// Flip card function
function flipCard(index) {
    if (flippedCards.length >= 2 || flippedCards.includes(index)) {
        return;
    }
    
    if (!gameStarted) {
        gameStarted = true;
        startTimer();
    }
    
    const cardElement = document.querySelector(`[data-index="${index}"]`);
    cardElement.classList.add('flipped');
    flippedCards.push(index);
    
    if (flippedCards.length === 2) {
        moves++;
        updateMoves();
        checkMatch();
    }
}

// Check if two flipped cards match
function checkMatch() {
    const [firstIndex, secondIndex] = flippedCards;
    const firstCard = gameBoard[firstIndex];
    const secondCard = gameBoard[secondIndex];
    
    if (firstCard.name === secondCard.name) {
        // Match found
        matchedPairs++;
        flippedCards = [];
        
        // Add matched class to cards
        document.querySelector(`[data-index="${firstIndex}"]`).classList.add('matched');
        document.querySelector(`[data-index="${secondIndex}"]`).classList.add('matched');
        
        // Check if game is complete
        if (matchedPairs === gameBoard.length / 2) {
            endGame();
        }
    } else {
        // No match, flip cards back after delay
        setTimeout(() => {
            document.querySelector(`[data-index="${firstIndex}"]`).classList.remove('flipped');
            document.querySelector(`[data-index="${secondIndex}"]`).classList.remove('flipped');
            flippedCards = [];
        }, 1000);
    }
}

// Timer functions
let gameTimer;
let gameTime = 0;

function startTimer() {
    gameTimer = setInterval(() => {
        gameTime++;
        updateTimer();
    }, 1000);
}

function updateTimer() {
    const minutes = Math.floor(gameTime / 60);
    const seconds = gameTime % 60;
    const timerElement = document.getElementById('score-count');
    if (timerElement) {
        timerElement.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
}

function updateMoves() {
    const movesElement = document.getElementById('tries-count');
    if (movesElement) {
        movesElement.textContent = moves;
    }
}

// End game function
function endGame() {
    clearInterval(gameTimer);
    setTimeout(() => {
        alert(`Congratulations! You completed the game in ${moves} moves and ${Math.floor(gameTime / 60)}:${(gameTime % 60).toString().padStart(2, '0')}!`);
    }, 500);
}

// Reset game function
function resetGame() {
    clearInterval(gameTimer);
    gameTime = 0;
    updateTimer();
    updateMoves();
    setupGame();
}

