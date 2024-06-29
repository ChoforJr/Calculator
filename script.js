
const add = function(a,b) {
    let firstInput = Number(a);
    let secondInput = Number(b);
	return firstInput + secondInput;
};

const subtract = function(a,b) {
    let firstInput = Number(a);
    let secondInput = Number(b);
	return firstInput - secondInput;
};

const multiply = function(a,b) {
    let firstInput = Number(a);
    let secondInput = Number(b);
	return firstInput * secondInput;
};

const divide = function (a,b){
    let firstInput = Number(a);
    let secondInput = Number(b);
    if (firstInput==0){
        return "Invalid";
    }
    return firstInput / secondInput;
}

const buttonArea = document.querySelector(".buttonArea");

let operator = document.querySelector("#operator");

let fInput = document.querySelector("#fInput");
let sInput = document.querySelector("#sInput");
let result = document.querySelector("#result");

document.querySelectorAll('.digits').forEach((button) => {
    button.addEventListener('click', btnAction);
});function btnAction(event) {
    const btn = event.target;
    if (event.shiftKey) fInput.textContent += btn.innerText;
    if (event.ctrlKey) sInput.textContent += btn.innerText;
}

document.querySelectorAll('.signs').forEach((button) => {
    button.addEventListener('click', btnSignsAction);
});function btnSignsAction(event) {
    const btn = event.target;
    operator.textContent = btn.innerText;
}

let equalTo = document.querySelector('#equalTo');
equalTo.addEventListener('click', () =>{
    if (operator.textContent == '+'){
        result.textContent= add(fInput.textContent,sInput.textContent);
    } else if (operator.textContent == '-'){
        result.textContent= subtract(fInput.textContent,sInput.textContent);
    } else if (operator.textContent == 'x'){
        result.textContent= multiply(fInput.textContent,sInput.textContent);
    } else if (operator.textContent == '÷'){
        result.textContent= divide(fInput.textContent,sInput.textContent);
    }
});

let clear = document.querySelector('#clear');
clear.addEventListener('click', () =>{
    fInput.textContent = '';
    sInput.textContent = '';
    result.textContent = '';
});
