const calculator = {
    displayValue: '0',
    firstOperand: null,
    waitingForSecondOperand: false,
    operator: null,
    memory: null,
    onRecallMemory: false
}

function updateDisplay() {
    const operator = document.getElementById('oprScreen')
    const display = document.getElementById('calcScreen')
    operator.value = calculator.operator
    display.value = calculator.displayValue
}

function inputDigit(digit) {
    const {displayValue, waitingForSecondOperand} = calculator

    if (waitingForSecondOperand === true) {
        calculator.displayValue = digit
        calculator.waitingForSecondOperand = false
    } else {
        calculator.displayValue = (displayValue === '0') ? digit : displayValue + digit
    }

    updateDisplay()
}

function inputDecimal(dot) {
    if (!calculator.displayValue.includes(dot)) {
        calculator.displayValue += dot
    }

    updateDisplay()
}

function handleOperator(nextOperator) {
    const {firstOperand, displayValue, operator} = calculator
    let inputValue = parseFloat(displayValue)

    if (firstOperand == null && !isNaN(inputValue)) {
        calculator.firstOperand = inputValue
    } else if (operator && calculator.waitingForSecondOperand) {
        if (nextOperator == '√') {
            inputValue = Math.sqrt(inputValue)
        } else if (nextOperator == '±') {
            inputValue *= (-1)
            calculator.displayValue = `${inputValue}`
        } else {
            calculator.operator = nextOperator
        }
    } else if (operator) {
        
        if (nextOperator == '%') {
            inputValue /= 100
        } else if (nextOperator == '√') {
            inputValue = Math.sqrt(inputValue)
        } else if (nextOperator == '±') {
            inputValue *= (-1)
            calculator.displayValue = `-${displayValue}`
        }

        const result = calculate(firstOperand, inputValue, operator)
        calculator.displayValue = `${parseFloat(result.toFixed(7))}`
        calculator.firstOperand = result
    }

    if (nextOperator != '%' || nextOperator != '±') {
        calculator.operator = nextOperator
    }
    
    calculator.waitingForSecondOperand = true
    updateDisplay()
}

function calculate(firstOperand, secondOperand = null, operator) {
    switch (operator) {
        case '+' : return firstOperand + secondOperand
        case '-' : return firstOperand - secondOperand
        case '×' : return firstOperand * secondOperand
        case '/' : return firstOperand / secondOperand
        default : return secondOperand
    }
}

function resetCalculator() {
    calculator.displayValue = '0'
    calculator.firstOperand = null
    calculator.waitingForSecondOperand = false
    calculator.operator = null

    updateDisplay()
}

function handleEqual() {
    const {firstOperand, displayValue, operator} = calculator
    const inputValue = parseFloat(displayValue)

    if (operator && !calculator.waitingForSecondOperand)  {
        const result = calculate(firstOperand, inputValue, operator)
        calculator.displayValue = `${parseFloat(result.toFixed(7))}`
        calculator.firstOperand = null
        calculator.operator = null
        calculator.waitingForSecondOperand = false

        updateDisplay()
    }
}

function recallMemory(value) {
    
    let {displayValue, memory, onRecallMemory} = calculator
    
    switch (value) {
        case 'RM': {
            if ((displayValue == '0' && memory) || onRecallMemory) {
                if (onRecallMemory) {
                    calculator.memory = null
                    calculator.operator = null
                    calculator.onRecallMemory = false
                    updateDisplay()
                    return
                }
                calculator.displayValue = `${memory}`
                calculator.operator = value
                calculator.onRecallMemory = true
                updateDisplay()
            }
        }; break;
        case 'M+': {
            calculator.memory = parseFloat(displayValue)
            calculator.operator = value
            updateDisplay()
        }; break;
        case 'M-': {
            calculator.memory = null
            calculator.operator = null
            updateDisplay()
        }
    }
}

function someClear() {
    calculator.displayValue = '0'
    updateDisplay()
}


document.querySelector('.calculator-keys').addEventListener('click', (event) => {
    const {target} = event

    if (!target.matches('button')) {
        return
    } else if (target.classList.contains('some-clear')) {
        someClear()
        return
    } else if (target.classList.contains('memory')) {
        recallMemory(target.value)
        return
    } else if (target.classList.contains('operator')) {
        handleOperator(target.value)
        return
    } else if (target.classList.contains('decimal')) {
        inputDecimal(target.value)
        return
    } else if (target.classList.contains('all-clear')) {
        resetCalculator()
        return
    } else if (target.classList.contains('equal-sign')) {
        handleEqual()
        return
    } else {
        inputDigit(target.value)
    }
})