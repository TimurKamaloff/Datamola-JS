
function add () {
    if (arguments.length === 1) {
        let a = arguments[0];
        return function (c) {
            return c + a;
        }
    }
    return arguments[0] + arguments[1];
}

function mul () {
    if (arguments.length === 1) {
        let a = arguments[0];
        return function (c) {
            return c * a;
        }
    }
    return arguments[0] * arguments[1];
}

function sub () {
    if (arguments.length === 1) {
        let a = arguments[0];
        return function (c) {
            return c - a;
        }
    }
    return arguments[0] - arguments[1];
}

function div () {
    if (arguments.length === 1) {
        let a = arguments[0];
        return function (c) {
            return c/a;
        }
    }
    return arguments[0]/arguments[1];
}

function pipe () {
    let argArr = arguments;
    let x;
    return function (y) {
        for (let i = 0; i < argArr.length; i++) {
            if (x === undefined) x = argArr[i](y);
            else x = argArr[i](x);
        }
        return x
    }
}

let a = add (1,2);
let b = mul (a, 10);
let sub1 = sub(1); // sub1 отнимает от любого числа единицу
let c = sub1(b); // 29
let d = mul(sub(a,1))(c); // 58
let doSmth = pipe(add(d), sub(c), mul(b), div(a)); // функция, последовательно выполняющая эти операции.
let result = doSmth(0); // (((0 + 58) - 29) * 30) / 3 = 290
let x = pipe(add(1), mul(2))(4); // 10
let y = pipe(add(1), sub(4), mul(2))(3); // 0
let z = pipe(add(1), sub(7), mul(2))(5); // -2