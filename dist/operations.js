export function calculate(left, operator, right) {
    let result;
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
