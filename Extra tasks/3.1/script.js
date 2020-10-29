maxSum = (arr = []) => {
    let sum = arr[0];
    if (arr.every((element, index, array) => {
        return element <= 0;
    })) sum = 0; // можно прямо здесь написать return 0 для случая, когда все числа отриц., но я этого не сделал для наглядности (чтобы увидеть рез-тат в консоли)
    let checkSum = arr[0];
    let arrRes = []; // чисто для себя сделал массив с макс суммой, чтоб наглядно видеть ошибку если что
    for (let i = 0; i < arr.length - 1; i++) {
        if (arr[i] < 0) continue
        checkSum = arr[i];
        for (let j = i + 1; j < arr.length; j++) {
            checkSum += arr[j];
            if (checkSum > sum) {
                sum = checkSum;
                arrRes = arr.slice(i,j+1) 
            }    
        }
    }
    console.log(sum);
    console.log(arrRes);
    return sum;
}

maxSum([-2,1,-3,4,-1,2,1,-5,4]);
maxSum([5,1,2,3,4,101,-102,101,2]);
maxSum([5]);
maxSum([-5]);
maxSum([1,998,-999,2,3,5,1000]);
maxSum([1,1,1,1,1,1]);
maxSum([-1,-2,-3,-5,-6]);
maxSum(); 
