const display = document.getElementById('lcd-display');
const clear = document.getElementById('clear');
const digits = document.querySelectorAll('.digit');
const operators = document.querySelectorAll('.operator');
const decimal = document.getElementById('.');
const equals = document.getElementById('=');
const allButtons = document.querySelectorAll('.btn');

const displayArray = [];
let a, b = 0;
let operand = 'default';
let prevButtonClass = '';
display.textContent = "0";

// event listener for keyboard input
document.addEventListener('keydown', (e) => {
    console.log(e.key);
    allButtons.forEach((button) => {
        // treat pressing a button as the same as clicking the relevant button
        if (button.id == e.key) {
            document.getElementById(button.id).click();
        }
    })
    // treat pressing 'enter' as pressing 'equals'
    if (e.key === 'Enter') {
        equals.click();
    }
    // if user presses backspace, remove last input digit
    if (e.key === 'Backspace') {
        if (displayArray.length > 1) {
        displayArray.pop();
        display.textContent = displayArray.join('');
        } else {
            displayArray.length = 0;
            display.textContent = "0";
        }
    }
})

// event listeners for button presses
digits.forEach((digit) => {
    digit.addEventListener('click', addDigit);
})

operators.forEach((operator) => {
    operator.addEventListener('click', setOperand);
})

clear.addEventListener('click', clearCalculator);

decimal.addEventListener('click', addDigit);

equals.addEventListener('click', evaluateEquation);

// add digit to array
function addDigit(e) {
    displayArray.push(e.target.id);
    display.textContent = displayArray.join('');
    prevButtonClass = "digit"
}

// set operand and current value
function setOperand(e) {
    // if previous input was operand, overwrite operand and return
    if (prevButtonClass == "operand") {
        operand = e.target.id;
        return;
    }
    // if there is an unevaluated equation, evaluate before setting new operand and "a"
    if (operand != 'default') {
        display.textContent = operate(a, Number(display.textContent), operand);
    }
    // set operand and "a"
    operand = e.target.id;
    a = Number(display.textContent);
    displayArray.length = 0;
    prevButtonClass = "operand";
}

// set second value and evaluate equation on equals
function evaluateEquation() {
    // set b and evaluate equation
    b = Number(display.textContent);
    display.textContent = operate(a, b, operand);
    // reset all values
    a = b = 0;
    operand = 'default';
    displayArray.length = 0;
    prevButtonClass = "equals"
}

// functional clear button
function clearCalculator() {
    switch (prevButtonClass) {
        // If clear is pressed twice consecutively, reset all values
        case "clr":
            a = b = 0;
            operand = 'default';
            break;
        // If last input was an operand, only reset the operand
        case "operand":
            operand = 'default';
            prevButtonClass = "clr"
            return;
    }
    prevButtonClass = 'clr'
    displayArray.length = 0;
    display.textContent = "0";
}

// function for operation
function operate(a, b, operand) {
    switch (operand) {
        case '+':
            return Number(a) + Number(b);
        case '-':
            return Number(a) - Number(b);
        case '/':
            if (Number(b) === 0) {
                return 'Error'
            }
            return Number(a) / Number(b);
        case '*':
            return Number(a) * Number(b);
        default:
            // if operand has not been set
            return Number(display.textContent);
    }
}