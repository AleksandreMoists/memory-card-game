
const shellGameArea = document.getElementById('shell-game-area');
const shellGameMessage = document.getElementById('shell-game-message');

let cups = [];
let ball = null;
let winningCupIndex = -1;
let isShuffling = false;
let canGuess = false;


function setGameDifficulty(difficulty) {
    // We can add difficulty logic later (more cups, faster speed)
    console.log("Setting Shell Game difficulty to:", difficulty);
}

function initShellGame(difficulty) {
    setGameDifficulty(difficulty);
    resetShellGame();
}

function resetShellGame() {
    shellGameArea.innerHTML = ''; // Clear previous game
    cups = [];
    ball = null;
    isShuffling = false;
    canGuess = false;
    winningCupIndex = -1;
    shellGameMessage.textContent = 'Click "Start Shuffle" to begin!';

    // Create the cups
    const numCups = 3;
    for (let i = 0; i < numCups; i++) {
        const cup = document.createElement('div');
        cup.className = 'shell-cup';
        cup.dataset.index = i;
        // Position the cups initially - center them in the container
        cup.style.left = `${100 + i * 150}px`; // Adjust positioning as needed
        shellGameArea.appendChild(cup);
        cups.push(cup);

        cup.addEventListener('click', handleCupClick);
    }
}

function setDifficultyButtonsDisabled(disabled) {
    document.querySelectorAll('.difficulty-btn').forEach(btn => {
        btn.disabled = disabled;
        if (disabled) {
            btn.classList.add('disabled');
        } else {
            btn.classList.remove('disabled');
        }
    });
}

async function startShellShuffle() {
    if (isShuffling) return;
    
    // Reset the game state first
    resetShellGame();

    // Disable difficulty switching while the game is in progress
    setDifficultyButtonsDisabled(true);
    
    isShuffling = true;
    canGuess = false;
    shellGameMessage.textContent = 'Watch carefully...';

    // 1. Create the ball
    ball = document.createElement('div');
    ball.className = 'shell-ball';
    ball.style.opacity = '1'; // Make sure ball is visible when showing
    
    // 2. Pick a random winning cup
    winningCupIndex = Math.floor(Math.random() * cups.length);
    const winningCup = cups[winningCupIndex];
    
    // 3. Position the ball under the winning cup
    const cupLeft = parseInt(winningCup.style.left);
    ball.style.left = `${cupLeft + 40}px`; // Center the ball under the cup
    shellGameArea.appendChild(ball);

    // 4. Lift the cup to show the ball
    await sleep(500);
    winningCup.classList.add('lifted');
    
    // 5. Lower the cup to hide the ball
    await sleep(1500);
    winningCup.classList.remove('lifted');
    ball.style.opacity = '0'; // Hide the ball during shuffle

    // 6. Start the shuffle animation
    await sleep(500);
    await shuffleAnimation();

    // 7. Allow the user to guess
    shellGameMessage.textContent = 'Where is the ball? Make your guess!';
    isShuffling = false;
    canGuess = true;

    // Re-enable difficulty buttons after the round ends
    setDifficultyButtonsDisabled(false);
}

function handleCupClick(event) {
    if (!canGuess) return;
    
    canGuess = false; // Prevent more clicks
    const clickedCup = event.currentTarget;
    const clickedIndex = parseInt(clickedCup.dataset.index);

    // Lift the chosen cup first
    clickedCup.classList.add('lifted');

    if (clickedIndex === winningCupIndex) {
        // Ball is already positioned correctly under the winning cup
        ball.style.opacity = 1;
        shellGameMessage.textContent = 'Correct! You win!';
        // Optional: Add a winning glow effect
    } else {
        shellGameMessage.textContent = 'Wrong! Try again.';
        // Also lift the correct cup to show the user where it was
        cups[winningCupIndex].classList.add('lifted');
        // Make sure ball is visible under the correct cup
        ball.style.opacity = 1;
    }
}

async function shuffleAnimation() {
    // Perform a series of random swaps
    for (let i = 0; i < 10; i++) { // 10 shuffles
        // Pick two different random cups to swap
        const index1 = Math.floor(Math.random() * cups.length);
        let index2 = Math.floor(Math.random() * cups.length);
        while (index1 === index2) {
            index2 = Math.floor(Math.random() * cups.length);
        }

        // Get the cup elements
        const cup1 = cups[index1];
        const cup2 = cups[index2];

        // Swap their 'left' style property
        const pos1 = cup1.style.left;
        const pos2 = cup2.style.left;
        cup1.style.left = pos2;
        cup2.style.left = pos1;
        
        // Update winning cup index if one of the swapped cups was the winning one
        if (index1 === winningCupIndex) {
            winningCupIndex = index2;
        } else if (index2 === winningCupIndex) {
            winningCupIndex = index1;
        }
        
        // Update ball position to follow the winning cup (even though it's hidden)
        if (ball) {
            const currentWinningCup = cups[winningCupIndex];
            const currentCupLeft = parseInt(currentWinningCup.style.left);
            ball.style.left = `${currentCupLeft + 40}px`;
        }
        
        // Wait for the CSS transition to finish before the next swap
        await sleep(500);
    }
}

// A helper function to create delays
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Initialize the shell game when the page loads
document.addEventListener('DOMContentLoaded', function() {
    const startShuffleBtn = document.getElementById('start-shuffle-btn');
    if (startShuffleBtn) {
        startShuffleBtn.addEventListener('click', startShellShuffle);
    }
    
    // Initialize the game
    resetShellGame();
});