class Calculator {
  constructor(previousOperandTextElement, currentOperandTextElement) {
    this.previousOperandTextElement = previousOperandTextElement;
    this.currentOperandTextElement = currentOperandTextElement;
    this.readyToReset = false;
    this.clear();
  }

  //   clear everything and display 0 at current operand
  clear() {
    this.previousOperand = '';
    this.currentOperand = '';
    this.operation = undefined;
  }

  //   delete last input from current operand
  delete() {
    this.currentOperand = this.currentOperand.toString().slice(0, -1);
  }

  //   add number or decimal to end of current operand
  appendNumber(number) {
    //check if decimal already exists within the current operand when input is decimal
    if (number === '.' && this.currentOperand.includes('.')) return;
    this.currentOperand = this.currentOperand.toString() + number.toString();
  }

  //   choose operation to undergo
  chooseOperation(operation) {
    if (this.currentOperand === '') return; //check for value before operation
    if (this.previousOperand !== '') {
      //compute and display at previous operand
      this.compute();
    }
    this.operation = operation;
    this.previousOperand = this.currentOperand;
    this.currentOperand = '';
  }

  //   calculation
  compute() {
    let computation;
    const previous = parseFloat(this.previousOperand);
    const current = parseFloat(this.currentOperand);
    if (isNaN(previous) || isNaN(current)) return; //check if either operand is empty
    switch (this.operation) {
      case '+':
        computation = previous + current;
        break;
      case '-':
        computation = previous - current;
        break;
      case '×':
        computation = previous * current;
        break;
      case '÷':
        computation = previous / current;
        break;
      default:
        return;
    }
    this.currentOperand = computation;
    this.previousOperand = '';
    this.operation = undefined;
    this.readyToReset = true;
  }

  getDisplay(number) {
    const stringNumber = number.toString();
    const integerDigits = parseFloat(stringNumber.split('.')[0]);
    const decimalDigits = stringNumber.split('.')[1];
    let integerDisplay;
    //check if is a number
    if (isNaN(integerDigits)) integerDisplay = '0';
    else integerDisplay = integerDigits.toLocaleString('en', { maximumFractionDigits: 0 }); //format to comma after 3 integer and minimum 0 decimal
    // check presence of decimals
    if (decimalDigits != null) {
      return `${integerDisplay}.${decimalDigits}`; //decimal
    } else return integerDisplay; //no decimal
  }

  updateDisplay() {
    this.currentOperandTextElement.innerText = this.getDisplay(this.currentOperand);
    //check if there is operation
    if (this.operation != null)
      //operation
      this.previousOperandTextElement.innerText = `${this.getDisplay(this.previousOperand)} ${this.operation}`;
    else this.previousOperandTextElement.innerText = ''; //no operation
  }
}

const numberButtons = document.querySelectorAll('[data-number]');
const operationButtons = document.querySelectorAll('[data-operation]');
const equalsButton = document.querySelector('[data-equals]');
const deleteButton = document.querySelector('[data-delete]');
const allClearButton = document.querySelector('[data-all-clear]');
const previousOperandTextElement = document.querySelector('[data-previous-operand]');
const currentOperandTextElement = document.querySelector('[data-current-operand]');

const calculator = new Calculator(previousOperandTextElement, currentOperandTextElement);

numberButtons.forEach((button) => {
  button.addEventListener('click', () => {
    if (calculator.currentOperand !== '' && calculator.previousOperand === '' && calculator.readyToReset) {
      calculator.currentOperand = '';
      calculator.readyToReset = false;
    }
    calculator.appendNumber(button.innerText);
    calculator.updateDisplay();
  });
});

operationButtons.forEach((button) => {
  button.addEventListener('click', () => {
    calculator.chooseOperation(button.innerText);
    calculator.updateDisplay();
  });
});

equalsButton.addEventListener('click', (button) => {
  calculator.compute();
  calculator.updateDisplay();
});

deleteButton.addEventListener('click', (button) => {
  calculator.delete();
  calculator.updateDisplay();
});

allClearButton.addEventListener('click', (button) => {
  calculator.clear();
  calculator.updateDisplay();
});
