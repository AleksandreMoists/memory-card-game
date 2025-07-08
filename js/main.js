const navMemoryLink = document.getElementById('nav-memory')
const navShellLink = document.getElementById('nav-shell')

// Game containers
const memoryGameContainer = document.getElementById('memory-game-container')
const shellGameContainer = document.getElementById('shell-game-container')

// Header and mobile views
const header = document.querySelector('header')
const burgerMenuButton = document.querySelector('.burger-menu-button')
const mobileNav = document.getElementById('mobile-nav')

// Difficulty Controls
const difficultyContainer = document.querySelector('.difficulty-selector');
const difficultyButtons = document.querySelectorAll('.difficulty-btn');

// Shared Buttons
const mainActionButton = document.getElementById('main-action-button'); // The button that says "Restart"

let currentGame = 'memory'; // Default game is memory
let currentDifficulty = 'easy'; // Default difficulty is easy

burgerMenuButton.addEventListener('click', () => {
    mobileNav.classList.toggle('active');
    header.classList.toggle('active');
    burgerMenuButton.classList.toggle('active');
})

// Sticky header functionality
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) { 
        header.classList.add('sticky');
    } else {
        header.classList.remove('sticky');
    }
});


function switchGame(game) {
    currentGame = game;
    if (game === 'memory') {
        memoryGameContainer.classList.remove('hidden');
        shellGameContainer.classList.add('hidden');
        
        navMemoryLink.classList.add('active');
        navShellLink.classList.remove('active');
        
        mainActionButton.textContent = 'Restart Game';
        
        // Initialize or restart the memory game
        initMemoryGame(currentDifficulty); // This function is defined in memory-game.js
    } else if (game === 'shell') {
        memoryGameContainer.classList.add('hidden');
        shellGameContainer.classList.remove('hidden');
        
        navMemoryLink.classList.remove('active');
        navShellLink.classList.add('active');
        
        mainActionButton.textContent = 'Start Game';
        
        initShellGame(currentDifficulty); // This function is defined in shell-game.js
    }
}

// Event listeners for navigation links
navMemoryLink.addEventListener('click', (e) => {
    e.preventDefault();
    switchGame('memory');
});

navShellLink.addEventListener('click', (e) => {
    e.preventDefault();
    switchGame('shell');
});

// Dificulty managment
difficultyButtons.forEach(button => {
    button.addEventListener('click', () => {
        currentDifficulty = button.dataset.difficulty; // e.g., <button data-difficulty="easy">EASY</button>
        
        difficultyButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        
        if (currentGame === 'memory') {
            initMemoryGame(currentDifficulty);
        } else if (currentGame === 'shell') {
            initShellGame(currentDifficulty);
        }
    });
});

// Main action button functionality
mainActionButton.addEventListener('click', () => {
    if (currentGame === 'memory') {
        initMemoryGame(currentDifficulty);
    } else if (currentGame === 'shell') {
        initShellGame(currentDifficulty);
    }
});

function initializeApp() {
    switchGame('memory'); // Start with the memory game by default
    difficultyButtons.forEach(button => {
        button.classList.remove('active'); // Remove active class from all buttons
    });
    document.querySelector(`.difficulty-btn[data-difficulty="${currentDifficulty}"]`).classList.add('active'); // Set the default difficulty button as active
}

// Initialize the app when the page loads
document.addEventListener('DOMContentLoaded', initializeApp);
