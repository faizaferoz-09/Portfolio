/* =================================
   LOADER
================================= */

window.addEventListener("load", () => {

    const loader = document.getElementById("loaderScreen");

    setTimeout(() => {
        loader.classList.add("hide");
    }, 1500);

});


/* =================================
   CALCULATOR VARIABLES
================================= */

let currentInput = "";
let previousInput = "";
let operator = null;


/* =================================
   ELEMENTS
================================= */

const currentDisplay =
    document.getElementById("currentDisplay");

const previousDisplay =
    document.getElementById("previousDisplay");

const themeBtn =
    document.getElementById("themeBtn");

const historyList =
    document.getElementById("historyList");

const clearHistoryBtn =
    document.getElementById("clearHistoryBtn");


/* =================================
   UPDATE DISPLAY
================================= */

function updateDisplay() {

    currentDisplay.textContent =
        currentInput || "0";


    if (previousInput && operator) {

        previousDisplay.textContent =
            `${previousInput} ${getOperatorSymbol(operator)}`;

    } else {

        previousDisplay.textContent = "";

    }

}


/* =================================
   OPERATOR SYMBOL
================================= */

function getOperatorSymbol(operator) {

    if (operator === "*") {
        return "×";
    }

    if (operator === "/") {
        return "÷";
    }

    if (operator === "-") {
        return "−";
    }

    return operator;
}


/* =================================
   NUMBER INPUT
================================= */

function appendNumber(number) {

    /* If error is showing, start again */

    if (currentInput === "Error") {
        currentInput = "";
    }


    /* Decimal */

    if (number === ".") {

        if (currentInput.includes(".")) {
            return;
        }

        if (currentInput === "") {
            currentInput = "0.";
        } else {
            currentInput += ".";
        }

    }

    /* Normal number */

    else {

        if (currentInput === "0") {
            currentInput = number;
        } else {
            currentInput += number;
        }

    }


    updateDisplay();
}


/* =================================
   OPERATOR
================================= */

function chooseOperator(selectedOperator) {

    if (
        currentInput === "" &&
        previousInput === ""
    ) {
        return;
    }


    /* Change operator */

    if (
        currentInput === "" &&
        previousInput !== ""
    ) {

        operator = selectedOperator;

        updateDisplay();

        return;
    }


    /* Calculate previous operation */

    if (
        previousInput !== "" &&
        operator !== null
    ) {

        calculate();

    }


    previousInput = currentInput;

    currentInput = "";

    operator = selectedOperator;

    updateDisplay();
}


/* =================================
   CALCULATE
================================= */

function calculate() {

    if (
        previousInput === "" ||
        currentInput === "" ||
        operator === null
    ) {
        return;
    }


    const firstNumber =
        parseFloat(previousInput);

    const secondNumber =
        parseFloat(currentInput);

    let result;


    switch (operator) {

        case "+":

            result =
                firstNumber + secondNumber;

            break;


        case "-":

            result =
                firstNumber - secondNumber;

            break;


        case "*":

            result =
                firstNumber * secondNumber;

            break;


        case "/":

            if (secondNumber === 0) {

                currentInput = "Error";

                previousInput = "";

                operator = null;

                updateDisplay();

                return;
            }

            result =
                firstNumber / secondNumber;

            break;


        default:
            return;
    }


    /* Remove floating point issues */

    result =
        parseFloat(result.toFixed(10));


    /* Save calculation */

    const expression =
        `${firstNumber} ${getOperatorSymbol(operator)} ${secondNumber}`;


    addToHistory(
        expression,
        result
    );


    currentInput =
        result.toString();

    previousInput = "";

    operator = null;


    updateDisplay();
}


/* =================================
   CLEAR
================================= */

function clearCalculator() {

    currentInput = "";

    previousInput = "";

    operator = null;

    updateDisplay();
}


/* =================================
   DELETE
================================= */

function deleteNumber() {

    if (currentInput === "Error") {

        clearCalculator();

        return;
    }


    currentInput =
        currentInput.slice(0, -1);


    updateDisplay();
}


/* =================================
   PERCENTAGE
================================= */

function percentage() {

    if (currentInput === "") {
        return;
    }


    currentInput =
        (
            parseFloat(currentInput) / 100
        ).toString();


    updateDisplay();
}


/* =================================
   BUTTONS
================================= */


/* Number Buttons */

document
    .querySelectorAll(".number-btn")
    .forEach(button => {

        button.addEventListener("click", () => {

            appendNumber(
                button.dataset.number
            );

        });

    });


/* Operator Buttons */

document
    .querySelectorAll(".operator-btn")
    .forEach(button => {

        button.addEventListener("click", () => {

            chooseOperator(
                button.dataset.operator
            );

        });

    });


/* =================================
   ACTION BUTTONS
================================= */

document
    .querySelectorAll("[data-action]")
    .forEach(button => {

        button.addEventListener("click", () => {

            const action =
                button.dataset.action;


            if (action === "clear") {

                clearCalculator();

            }


            else if (action === "delete") {

                deleteNumber();

            }


            else if (action === "percentage") {

                percentage();

            }


            else if (action === "calculate") {

                calculate();

            }

        });

    });


/* =================================
   HISTORY
================================= */

let history = [];


function addToHistory(expression, result) {

    history.unshift({
        expression: expression,
        result: result
    });


    if (history.length > 10) {
        history.pop();
    }


    renderHistory();
}


function renderHistory() {

    if (history.length === 0) {

        historyList.innerHTML = `

            <div class="empty-history">

                <i class="fa-solid fa-calculator"></i>

                <p>No calculations yet</p>

            </div>

        `;

        return;
    }


    historyList.innerHTML = "";


    history.forEach(item => {

        const historyItem =
            document.createElement("div");


        historyItem.className =
            "history-item";


        historyItem.innerHTML = `

            <span class="history-expression">
                ${item.expression}
            </span>

            <span class="history-result">
                = ${item.result}
            </span>

        `;


        historyList.appendChild(historyItem);

    });

}


/* =================================
   CLEAR HISTORY
================================= */

clearHistoryBtn.addEventListener(
    "click",
    () => {

        history = [];

        renderHistory();

    }
);


/* =================================
   LIGHT / DARK THEME
================================= */

const themeIcon =
    themeBtn.querySelector("i");


/* Check saved theme */

const savedTheme =
    localStorage.getItem("numelleTheme");


if (savedTheme === "dark") {

    document.body.classList.add("dark-mode");

    themeIcon.classList.remove("fa-moon");

    themeIcon.classList.add("fa-sun");

}


/* Theme Button */

themeBtn.addEventListener("click", () => {

    document.body.classList.toggle("dark-mode");


    const darkMode =
        document.body.classList.contains("dark-mode");


    if (darkMode) {

        /* Dark */

        themeIcon.classList.remove("fa-moon");

        themeIcon.classList.add("fa-sun");

        localStorage.setItem(
            "numelleTheme",
            "dark"
        );

    }

    else {

        /* Light */

        themeIcon.classList.remove("fa-sun");

        themeIcon.classList.add("fa-moon");

        localStorage.setItem(
            "numelleTheme",
            "light"
        );

    }

});


/* =================================
   KEYBOARD
================================= */

document.addEventListener(
    "keydown",
    event => {

        const key = event.key;


        /* Numbers */

        if (
            (key >= "0" && key <= "9") ||
            key === "."
        ) {

            appendNumber(key);

        }


        /* Operators */

        else if (
            key === "+" ||
            key === "-" ||
            key === "*" ||
            key === "/"
        ) {

            chooseOperator(key);

        }


        /* Equal */

        else if (
            key === "Enter" ||
            key === "="
        ) {

            event.preventDefault();

            calculate();

        }


        /* Backspace */

        else if (key === "Backspace") {

            deleteNumber();

        }


        /* Escape */

        else if (key === "Escape") {

            clearCalculator();

        }


        /* Percentage */

        else if (key === "%") {

            percentage();

        }

    }
);