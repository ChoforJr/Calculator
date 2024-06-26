
const add = function(a,b) {
	return a + b;
};

const subtract = function(a,b) {
	return a - b;
};

const multiply = function(a,b) {
    return a * b;
};

const divide = function (a,b){
    if (a==0){
        return "You can't divide by 0";
    }
    return a/b;
}

const digits = document.querySelector(".digits");
