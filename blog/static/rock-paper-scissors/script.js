const rockPaperScissors = ['rock', 'paper', 'scissors'];
const startButton = document.querySelector('.start');
const playerButtons = document.querySelectorAll('.playerinput');
const computerButtons = document.querySelectorAll('.computerchoice');
const result = document.querySelector('#results');
const scoreDisplay = document.getElementById('score');
const iconAttButton = document.getElementById('icon-attribution-button');
const iconAttDiv = document.getElementById('icon-popup');

let outcome;
let computerScore;
let playerScore;

startNewGame();

iconAttButton.addEventListener('click', displayAttribution);

playerButtons.forEach(function (button) {
    button.addEventListener('click', playRound);
});

startButton.addEventListener('click', startNewGame);

function playRound() {
    resetButtonsDisplay();
    // get user's selection, randomly select computer's selection
    let playerSelection = this.id;
    let playerButton = document.getElementById(this.id);
    let computerSelection = rockPaperScissors[(Math.floor(Math.random() * 3))];
    let computerButton = document.getElementById(`computer-${computerSelection}`);

    // darken background colour and bold text of selections
    computerButton.style.cssText = 'background: var(--alt-text);';
    computerButton.nextElementSibling.style.cssText = 'font-weight: 1000; color: var(--alt-text);';
    playerButton.style.cssText = 'background: var(--alt-text);';
    playerButton.nextElementSibling.style.cssText = 'font-weight: 1000; color: var(--alt-text);';

    // determine whether outcome was win, draw, or lose
    if (computerSelection == playerSelection) {
        result.textContent = `It's a draw! Try again...`;
        outcome = 'draw'
    }
    else if ((playerSelection == 'rock' && computerSelection == 'paper') ||
        (playerSelection == 'paper' && computerSelection == 'scissors') ||
        (playerSelection == 'scissors' && computerSelection == 'rock')) {
        result.textContent = `The computer wins this round...`;
        outcome = 'computer'
    } else {
        result.textContent = `You win this round!`;
        outcome = 'player'
    }

    if (outcome == 'computer') {
        computerScore++;
    } else if (outcome == 'player') {
        playerScore++;
    }

    // Update score display
    scoreDisplay.textContent = `${playerScore} - ${computerScore}`

    // If either player has enough points to win the game, display the result, end the game, and allow player to start a new game
    if ((playerScore == 5) || (computerScore == 5)) {
        if (playerScore > computerScore) {
            result.textContent = ` You won the game!`
        } else {
            result.textContent = ` You lost the game!`
        }
        startButton.style.cssText = 'visibility: visible;';
        playerButtons.forEach(function (button) {
            button.removeEventListener('click', playRound);
        });
    }

    return;
}

function startNewGame() {
    // Hide start button and add event listeners to user buttons
    startButton.style.cssText = 'visibility: hidden;';
    playerButtons.forEach(function (button) {
        button.addEventListener('click', playRound);
    });
    
    // Reset display elements and scores
    resetButtonsDisplay();

    scoreDisplay.textContent = '0 - 0';

    computerScore = 0;
    playerScore = 0;

    result.textContent = 'Play rock, paper, or scissors to begin...';
}

function resetButtonsDisplay() {
    computerButtons.forEach((button) => {
        button.style.cssText = 'background: var(--alt-background-color);';
        button.nextElementSibling.style.cssText = 'font-weight: normal;';
    })

    playerButtons.forEach((button) => {
        button.style.cssText = 'background: var(--alt-background-color);';
        button.nextElementSibling.style.cssText = 'font-weight: normal;';
    })
    return;
}

function displayAttribution() {
    iconAttDiv.classList.toggle('hidden');
}