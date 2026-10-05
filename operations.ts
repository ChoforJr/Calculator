export type Operator = "+" | "-" | "*" | "/";

export function calculate(
  left: number,
  operator: Operator,
  right: number
): number | null {
  let result: number;

  switch (operator) {
    case "+":
      result = left + right;
      break;
    case "-":
      result = left - right;
      break;
    case "*":
      result = left * right;
      break;
    case "/":
      if (right === 0) {
        return null;
      }

      result = left / right;
      break;
  }

  return Number.isFinite(result) ? result : null;
}
