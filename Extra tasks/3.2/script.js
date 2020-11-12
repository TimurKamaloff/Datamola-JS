"use strict";

let broker = (arr) => {
    let sum = 0;
    for (let i = 0; i < arr.length-1; i++) {
        let buy = arr[i];
        let sale = arr[i+1];
        if (sale > buy) sum += (sale - buy);
    }
    console.log(sum);
    return sum;
}

broker([7,1,5,3,6,4]);
broker([1,2,3,4,5]);
broker([7,6,4,3,1]);
broker([7,1,5,3,16,4]);
broker([0,1,5,3,7,10,2]);
broker([]); // на всякий случай проверил
broker([]);
