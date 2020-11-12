function add (...arg) {
    return arguments[0] + arguments[1];
}

function mul (...arg) {
    return arguments[0] * arguments[1];
}

function sub () {
    console.log (arguments);
    let a = arguments[0];
    let b = arguments[1];
    console.log (b);
    if (!b) {
        return function (a,b) {
            return a-b
        }
    }
    else {
        return a-b;
    }

}

let a = add (1,2);
let b = mul (a, 10);