import { calculate, type Operator } from "./operations.js";

function getElement<T extends HTMLElement>(selector: string): T {
  const element = document.querySelector<T>(selector);

  if (element === null) {
    throw new Error(`Required page element was not found: ${selector}`);
  }

  return element;
}

const display = getElement<HTMLOutputElement>("#result");
const expression = getElement<HTMLParagraphElement>("#expression");
const keypad = getElement<HTMLDivElement>(".keypad");

let displayValue = "0";
let accumulator: number | null = null;
let pendingOperator: Operator | null = null;
let awaitingOperand = false;
let lastOperation: { operator: Operator; operand: number } | null = null;

function formatNumber(value: number): string {
  return new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 10,
  }).format(value);
}

function render(): void {
  display.textContent = displayValue;
}

function showError(): void {
  displayValue = "Error";
  accumulator = null;
  pendingOperator = null;
  awaitingOperand = true;
  lastOperation = null;
  expression.textContent = "Cannot divide by zero";
  render();
}

function reset(): void {
  displayValue = "0";
  accumulator = null;
  pendingOperator = null;
  awaitingOperand = false;
  lastOperation = null;
  expression.textContent = "Ready when you are";
  render();
}

function enterDigit(digit: string): void {
  if (displayValue === "Error") {
    reset();
  }

  if (awaitingOperand) {
    displayValue = digit;
    awaitingOperand = false;
  } else if (displayValue === "0") {
    displayValue = digit;
  } else if (displayValue.replace("-", "").replace(".", "").length < 14) {
    displayValue += digit;
  }

  lastOperation = null;
  render();
}

function enterDecimal(): void {
  if (displayValue === "Error") {
    reset();
  }

  if (awaitingOperand) {
    displayValue = "0.";
    awaitingOperand = false;
  } else if (!displayValue.includes(".")) {
    displayValue += ".";
  }

  lastOperation = null;
  render();
}

function currentNumber(): number {
  return Number(displayValue);
}

function operatorLabel(operator: Operator): string {
  switch (operator) {
    case "*":
      return "×";
    case "/":
      return "÷";
    case "-":
      return "−";
    case "+":
      return "+";
  }
}

function isOperator(value: string): value is Operator {
  return value === "+" || value === "-" || value === "*" || value === "/";
}

function chooseOperator(operator: Operator): void {
  if (displayValue === "Error") {
    reset();
  }

  const input = currentNumber();

  if (pendingOperator !== null && accumulator !== null && !awaitingOperand) {
    const intermediate = calculate(accumulator, pendingOperator, input);

    if (intermediate === null) {
      showError();
      return;
    }

    displayValue = String(intermediate);
    accumulator = intermediate;
  } else {
    accumulator = input;
  }

  pendingOperator = operator;
  awaitingOperand = true;
  lastOperation = null;
  expression.textContent = `${formatNumber(accumulator)} ${operatorLabel(operator)}`;
  render();
}

function equals(): void {
  if (displayValue === "Error") {
    return;
  }

  const operator = pendingOperator ?? lastOperation?.operator ?? null;
  const left = accumulator;
  const right =
    pendingOperator !== null
      ? currentNumber()
      : lastOperation?.operand ?? null;

  if (operator === null || left === null || right === null) {
    return;
  }

  const result = calculate(left, operator, right);

  if (result === null) {
    showError();
    return;
  }

  expression.textContent = `${formatNumber(left)} ${operatorLabel(operator)} ${formatNumber(right)} =`;
  displayValue = String(result);
  lastOperation = { operator, operand: right };
  accumulator = result;
  pendingOperator = null;
  awaitingOperand = true;
  render();
}

function toggleSign(): void {
  if (displayValue === "Error" || Number(displayValue) === 0) {
    return;
  }

  displayValue = displayValue.startsWith("-")
    ? displayValue.slice(1)
    : `-${displayValue}`;
  render();
}

function percent(): void {
  if (displayValue === "Error") {
    return;
  }

  displayValue = String(currentNumber() / 100);
  awaitingOperand = false;
  lastOperation = null;
  render();
}

function backspace(): void {
  if (displayValue === "Error") {
    reset();
    return;
  }

  if (awaitingOperand) {
    return;
  }

  displayValue = displayValue.length > 1 ? displayValue.slice(0, -1) : "0";

  if (displayValue === "-") {
    displayValue = "0";
  }

  render();
}

function handleAction(action: string | undefined): void {
  switch (action) {
    case "clear":
      reset();
      break;
    case "decimal":
      enterDecimal();
      break;
    case "equals":
      equals();
      break;
    case "sign":
      toggleSign();
      break;
    case "percent":
      percent();
      break;
    case "backspace":
      backspace();
      break;
  }
}

keypad.addEventListener("click", (event: MouseEvent) => {
  const target = event.target;

  if (!(target instanceof Element)) {
    return;
  }

  const button = target.closest<HTMLButtonElement>("button");

  if (button === null || !keypad.contains(button)) {
    return;
  }

  const digit = button.dataset.digit;
  const operator = button.dataset.operator;

  if (digit !== undefined) {
    enterDigit(digit);
  } else if (operator !== undefined && isOperator(operator)) {
    chooseOperator(operator);
  } else {
    handleAction(button.dataset.action);
  }
});

document.addEventListener("keydown", (event: KeyboardEvent) => {
  if (/^\d$/.test(event.key)) {
    enterDigit(event.key);
  } else if (event.key === "." || event.key === ",") {
    enterDecimal();
  } else if (event.key === "Enter" || event.key === "=") {
    event.preventDefault();
    equals();
  } else if (event.key === "Escape" || event.key === "Delete") {
    reset();
  } else if (event.key === "Backspace") {
    backspace();
  } else if (
    event.key === "+" ||
    event.key === "-" ||
    event.key === "*" ||
    event.key === "/"
  ) {
    chooseOperator(event.key);
  } else if (event.key === "%") {
    percent();
  }
});

render();
