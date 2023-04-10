const questionHeader = document.getElementById("question-header");
const question = document.getElementById("question");
const userAnswer = document.getElementById("answer");
const currentScore = document.getElementById("current-score");
const resultDisplay = document.getElementById("results");
const timeElapsedDisplay = document.getElementById("time");
const start = document.getElementById("start");

let timerVar;
let totalSeconds = 0;
let expectedOutcome;
let questionNumber = 0;
let elapsedTime = "0";
let score = 0;
let incorrectAnswers = 0;
let resultDetails = [];
const currentResult = {};
let hour;
let minute;
let second;
let highscoreDisplay;
let userStatus;
let userHighscore = 0;
let userId = 'NULL';

if (document.getElementsByClassName('highscore').length) {
    highscoreDisplay = document.getElementsByClassName('highscore')[0];
    userLogin = true;

    userId = highscoreDisplay.classList[1];

    function processResponse() {
        let data = JSON.parse(this.response);
        userHighscore = data[0].highscore;
        if (userHighscore) {
            highscoreDisplay.textContent += ` ${userHighscore}`;
        } else {
            highscoreDisplay.textContent = 'Attempt the challenge to see your highscore!'
        }
    }

    let xhttp = new XMLHttpRequest();
    xhttp.addEventListener('load', processResponse);
    xhttp.open('GET',`/highscores/${userId}`);
    xhttp.send();

} else {
    highscoreDisplay = document.getElementById('anon-user')
    userLogin = false;
}

// Initialise with only start button, title, and highscore visible
questionHeader.style.cssText = userAnswer.style.cssText = userAnswer.nextElementSibling.style.cssText = 'visibility: hidden;';
question.textContent = 'Maths Challenge'

start.addEventListener('click', () => {
    totalSeconds = 0;
    expectedOutcome;
    questionNumber = 0;
    elapsedTime = "0";
    score = 0;
    incorrectAnswers = 0;
    resultDetails = [];
    currentResult.length = 0;

    start.style.cssText = highscoreDisplay.style.cssText = 'visibility: hidden;';
    questionHeader.style.cssText = question.style.cssText = userAnswer.style.cssText = userAnswer.nextElementSibling.style.cssText = '';
    userAnswer.nextElementSibling.textContent = 'Press enter to submit answer';

    userAnswer.addEventListener('keyup', checkAnswer);
    setQuestion();
    timerVar = setInterval(countTimer, 1000);
})

function countTimer() {
    ++totalSeconds;
    hour = Math.floor(totalSeconds / 3600);
    minute = Math.floor((totalSeconds - hour * 3600) / 60);
    second = totalSeconds - (hour * 3600 + minute * 60);
    if (hour < 10)
        hour = "0" + hour;
    if (minute < 10)
        minute = "0" + minute;
    if (second < 10)
        second = "0" + second;
    elapsedTime = `${hour}:${minute}:${second}`;
    timeElapsedDisplay.textContent = elapsedTime;
}

function setQuestion() {
    questionNumber++;
    let rightSide = Math.floor(Math.random() * 21);
    let leftSide = Math.floor(Math.random() * 21);
    let operationList = ["+", "-", "x", "/"];
    let operatorSelection = Math.floor(Math.random() * 4);
    let easyDivisors = [1, 2, 3, 4, 5, 6, 8, 10];

    if (operationList[operatorSelection] == "/") {
        leftSide = easyDivisors[Math.floor(Math.random() * 8)];
        rightSide = leftSide * (Math.floor(Math.random() * 15));
    }

    questionHeader.textContent = "Question " + questionNumber;
    question.textContent = rightSide + " " + operationList[operatorSelection] + " " + leftSide;

    currentResult.number = questionNumber;
    currentResult.question = question.textContent;

    switch(operationList[operatorSelection]) {
        case '+':
            expectedOutcome = rightSide + leftSide;
            break;
        case '-':
            expectedOutcome = rightSide - leftSide;
            break;
        case 'x':
            expectedOutcome = rightSide * leftSide;
            break;
        case '/':
            expectedOutcome = rightSide / leftSide;
            break;
    }

    console.log(expectedOutcome);
    currentResult.correctAnswer = expectedOutcome;
}

function checkAnswer(event) {
    if (event.keyCode == 13) {
        currentResult.givenAnswer = userAnswer.value;
        resultDetails.push(currentResult);
        if (userAnswer.value == expectedOutcome) {
            score++;
            currentScore.textContent = score + "/20";
        } else {
            incorrectAnswers++;
        }
        if (score < 20) {
            userAnswer.value = '';
            setQuestion();
        } else {
            gameWon();
        }
    }
}

function gameWon() {
    // End timer and update display on game end
    clearInterval(timerVar);
    userAnswer.value = '';
    questionHeader.textContent = 'Done!'
    question.textContent = 'You did it!'
    userAnswer.style.cssText = 'visibility: hidden';

    let totalTime = timeElapsedDisplay.textContent;

    // Show user their time and # incorrect answers
    if (totalSeconds < 60) {
        userAnswer.nextElementSibling.textContent = `You answered 20 questions correctly in ${parseInt(second)} seconds with ${incorrectAnswers} mistakes.`;
    } else if (hour == '00') {
        userAnswer.nextElementSibling.textContent = `You answered 20 questions correctly in ${parseInt(minute)} minute(s) and ${second} seconds with ${incorrectAnswers} mistakes.`;
    } else {
        userAnswer.nextElementSibling.textContent = `You answered 20 questions correctly in ${parseInt(hour)} hour(s), ${parseInt(minute)} minute(s) and ${parseInt(second)} seconds with ${incorrectAnswers} mistakes.`;
    }

    // Convert highscore and totalTime to integers for comparison
    function timeToInt(time) {
        time = time.split(':');
        return time.join();
    }

    if (userLogin) {
        if (!userHighscore) {
            // Push new highscore to database
            let xhttp = new XMLHttpRequest();
            xhttp.open("POST", `/highscores/${userId}`);
            xhttp.setRequestHeader("Content-Type", "application/json");
            xhttp.addEventListener('load', function(){
                console.log(this.response);
            });
            xhttp.send(JSON.stringify({highscore: totalTime}));
            
            highscoreDisplay.textContent = 'New high score! Can you beat it again?'
    
            userHighscore = totalTime;
        } else {
            // Compare current score to existing highscore, and push current score if it's better
            intTime = timeToInt(totalTime);
            intHighscore = timeToInt(userHighscore);
        
            if (intTime < intHighscore) {
                // Push new highscore to database
                let xhttp = new XMLHttpRequest();
                xhttp.open("POST", `/highscores/${userId}`);
                xhttp.setRequestHeader("Content-Type", "application/json");
                xhttp.addEventListener('load', function(){
                    console.log(this.response);
                });
                xhttp.send(JSON.stringify({highscore: totalTime}));
                
                highscoreDisplay.textContent = 'New high score! Can you beat it again?'
        
                userHighscore = totalTime;
            } else {
                highscoreDisplay.textContent = 'You didn\'t beat your high score. Try again?';
            }
        }
    } else {
        highscoreDisplay.innerHTML = 'Great score! <a href=\'/login\'>Login</a> to save your future scores.';
    }


    start.textContent = 'Play again?';
    start.style.cssText = highscoreDisplay.style.cssText = '';
}