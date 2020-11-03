maxSum = (arr = []) => {
    let sum = arr[0];
    let maxEl = arr[0];
    let checkSum = arr[0];
    if (arr.every((element, index, array) => {
        return element <= 0;
    })) sum = 0; // можно прямо здесь написать return 0 для случая, когда все числа отриц., но я этого не сделал для наглядности (чтобы увидеть рез-тат в консоли)
    for (let i = 0; i < arr.length - 1; i++) {
        if (arr[i] < 0) continue
        checkSum = arr[i];
        for (let j = i + 1; j < arr.length; j++) {
            if (maxEl < arr[j]) maxEl = arr[j];
            checkSum += arr[j];
            if (checkSum > sum) sum = checkSum;
        }
    }
    return (sum > maxEl) ? sum : maxEl;
}

maxSum([-2,1,-3,4,-1,2,1,-5,4]); // 6
maxSum([5,1,2,3,4,101,-102,101,2]); // 117
maxSum([5]); // 5
maxSum([-5]); // 0
maxSum([1,998,-999,2,3,5,1000]); // 1010 => (999, -999, 1010)
maxSum([1,1,1,1,1,1]); // 6
maxSum([-1,-2,-3,-5,-6]); // 0
maxSum(); // undefined
maxSum([-1,2,3-9,11]) // 11

/////////////////////////////////////////////

maxSum2 = (arr = []) => {
    let sum = 0;
    if (arr.length === 1 && arr[0] > 0) return arr[0];
    for (let i = 0; i < arr.length; i++) {
        if (arr[i] > 0 && (arr[i] + arr[i+1]) > arr[i+1] && (arr[i] + arr[i+1]) > 0) {
            arr[i] += arr[i+1];
            arr.splice(i+1,1);
            i = -1;
        }
        for (let j = 0; j < arr.length; j++) {
            if (sum < arr[j]) sum = arr[j];
        }
    }
    console.log(sum);
    return sum;
}

maxSum2([-2,1,-3,4,-1,2,1,-5,4]); // 6
maxSum2([5,1,2,3,4,101,-102,101,2]); // 117
maxSum2([5]); // 5
maxSum2([-5]); // 0
maxSum2([1,998,-999,2,3,5,1000]); // 1010
maxSum2([1,1,1,1,1,1]); // 6
maxSum2([-1,-2,-3,-5,-6]); // 0
maxSum2(); // 0
maxSum2([-1,2,3-9,11]) // 11
