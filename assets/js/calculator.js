var firstValue = null;
var secondValue = null;
var operator = null;
var result = null;
var memoryValue = null;



window.onload = function() {
    displayValues();
}




//// OPTIONS /////

var options = false;

var displayClassic = false;
var moduloMode = false;
var HHGTTG = false;

function toggleOptionsWindow() {
    optionOverlay = document.getElementById('options-overlay');

    if(options) {
        optionOverlay.style.display = 'none';
    } else {
        optionOverlay.style.display = 'flex';
    }

    options = !options;
}

function setOptionSlider(option, isActive) {
    if (isActive) {
        document.getElementById(option + '-option').classList.add('active')
    } else {
        document.getElementById(option + '-option').classList.remove('active')
    }

    if(option === 'display' && isActive) {
        document.getElementById('classic-display').style.opacity = 1;
        document.getElementById('guideline-display').style.opacity = 0;
    } else {
        document.getElementById('classic-display').style.opacity = 0;
        document.getElementById('guideline-display').style.opacity = 1;
    }
}

function toggleOption(optionToggle) {
    thisOption = optionToggle.id.split('-')[0];

    if(thisOption === 'modulo') {
        moduloMode = !moduloMode;
        setOptionSlider(thisOption, moduloMode);
    } else if (thisOption === 'display') {
        displayClassic = !displayClassic;
        setOptionSlider(thisOption, displayClassic);
    } else if (thisOption === 'hhgttg') {
        HHGTTG = !HHGTTG;
        setOptionSlider(thisOption, HHGTTG);
    }
}


//// INPUT FUNCTIONS ////

function setValue(button) {

    valueInput = button.innerHTML;

    if (result) {
        allClear();
    }

    if (operator) {
        if (secondValue) {
            secondValue += valueInput;
        } else {
            secondValue = valueInput;
        }
    } else {

        if (firstValue) {
            firstValue += valueInput;
        } else {
            firstValue = valueInput;
        }
    }

    displayValues()
}

function setOperator(button) {
    if (result || result === 0) {
        operator = button.id.split('-')[1];
        memoryValue = result;
        firstValue = result;
        secondValue = null;
        result = null;
    } else if (firstValue && secondValue) {
        solve()
        memoryValue = result;
        firstValue = result;
        secondValue = null;
        result = null;
    }

    if (firstValue) {
        operator = button.id.split('-')[1];
    }

    highlightOperator();
    displayValues();
}

function allClear() {
    firstValue = null;
    secondValue = null;
    operator = null;
    result = null;

    memoryValue = null;

    displayValues();
    highlightOperator();
}

function clearLast() {
    if (result) {
        allClear();
    } else if (secondValue) {
        secondValue = '';
    } else if (operator) {
        operator = '';
    } else if (firstValue) {
        firstValue = null;
    }

    displayValues();
    highlightOperator();
}

function backspace() {
    var currentValue = document.getElementById('classic-input-display').innerHTML;

    newValue = currentValue.substring(0, currentValue.length - 1);

    if (!result) {

        if (firstValue != secondValue) {

            if (secondValue) {
                secondValue = newValue;
            } else {
                firstValue = newValue;
            }
        } else {
            if (secondValue) {
                secondValue = newValue;
            }
        }
    }

    displayValues();
}

function percent(button) {
    if (moduloMode) {
        setOperator(button)
    } else {
        value = document.getElementById('classic-input-display').innerHTML;

        if (result) {
            result = parseFloat(result) / 100;
            firstValue = result;
        } else {
            if (firstValue && secondValue) {
                secondValue = parseFloat(secondValue) / 100;
            } else if (firstValue) {
                firstValue = parseFloat(firstValue) / 100;
            }
        }
    }

    displayValues()
}

function toFloat() {
    if (!result) {
        if (secondValue) {
            if (!secondValue.includes('.')) {
                secondValue = secondValue.toString() + '.';
            }
        } else if (operator && firstValue) {
            secondValue = '0.'
        } else if (firstValue) {
            if (!firstValue.includes('.')) {
                firstValue = firstValue.toString() + '.';
            }
        } else {
            firstValue = '0.';
        }

        displayValues();
    }
}

function solve() {
    var firstCalc = parseFloat(firstValue);
    var secondCalc = parseFloat(secondValue);

    if (operator === 'divide') {
        var newResult = firstCalc / secondCalc;
    } else if (operator === 'multiply') {
        var newResult = firstCalc * secondCalc;
    } else if (operator === 'add') {
        var newResult = firstCalc + secondCalc;
    } else if (operator === 'subtract') {
        var newResult = firstCalc - secondCalc;
    } else if (operator === 'modulo') {
        var newResult = firstCalc % secondCalc;
    }

    if (HHGTTG) {
        var newResult = 42;
    }

    if (newResult || newResult === 0) {
        memoryValue = firstValue;
        result = newResult;
        firstValue = newResult;
    }


    displayValues()
    highlightOperator('clear');
}



//// DISPLAY FUNCTIONS ////


function displayValues() {
    /// Classic Display Mode

    classicDisplay = document.getElementById('classic-input-display');

    if(result || result === 0) {
        classicDisplay.innerHTML = result;
    } else {
        if (memoryValue && secondValue) {
            classicDisplay.innerHTML = secondValue;
        } else {
            if (firstValue) {
                if (operator && secondValue) {
                    classicDisplay.innerHTML = secondValue;
                } else {
                    classicDisplay.innerHTML = firstValue;
                }
            } else {
                classicDisplay.innerHTML = '0';
            }
        }
    }


    /// Guideline Display Mode
    if(!displayClassic) {
        exprString = firstValue + ' ' + operator + ' ' + secondValue;

        if (memoryValue) {
            exprString = memoryValue + ' ' + operator + ' ' + secondValue;
        }

        if (operator) {
            exprString = exprString.replace('divide', '/')
                .replace('multiply', 'x')
                .replace("add", '+')
                .replace('subtract', '-')
                .replace('modulo', '%');
        }

        exprString = exprString.replace(/null/g, '');

        guidelineInputDisplay = document.getElementById('guideline-input-display');
        guidelineInputDisplay.innerHTML = exprString;

        guidelineResultDisplay = document.getElementById('guideline-result-display');

        if (result || result === 0) {
            guidelineResultDisplay.innerHTML = result;
        } else {
            guidelineResultDisplay.innerHTML = '';
        }
    }
}

function highlightOperator(clear) {
    allOparatorButtons = document.getElementsByClassName('operator-focus');

    while (allOparatorButtons.length) allOparatorButtons[0].classList.remove('operator-focus');

    if(operator && !clear) {
        operatorID = 'button-' + operator;
        operatorButton = document.getElementById(operatorID);
        operatorButton.classList.add('operator-focus');
    }
}