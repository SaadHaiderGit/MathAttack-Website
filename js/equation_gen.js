const genNumGen = (numbers, num_cap) => {
    //console.log("I AM HERE");
    numbers.push(Math.floor(Math.random() * num_cap));
}

//generate number for multiplication
const multNumGen = (numbers, operations, num_cap, mult_and_div_cap) => {
    numbers.push(Math.floor(Math.random() * mult_and_div_cap));
    //swap value positions (to keep questions more varied-looking), unless "/" is the previous operation
    if ((numbers.length == 2 || operations[numbers.length - 3] != "/") && Math.random() < 0.5) { 
        let x = numbers[numbers.length - 2];
        let y = numbers[numbers.length - 1];
        numbers[numbers.length - 2] = y;
        numbers[numbers.length - 1] = x;
    
    }
    else if (operations[numbers.length - 3] == "/") {
        console.log("GOT EM");
    }
}

const divNumGen = (numbers, num_cap, mult_and_div_cap) => {
    let divisors = [];
    let prev_num = Math.abs(numbers[numbers.length - 1]);
    if (prev_num == 0) {
        numbers.push(Math.floor(Math.random() * mult_and_div_cap) + 1);
        return;
    }
    //console.log(prev_num);
    for (let i = 2; i <= Math.sqrt(prev_num); i++) {
        if (prev_num % i === 0) {
            divisors.push(i);
            if (prev_num / i !== i) {
                divisors.push(prev_num / i);
            }
        }
    }
    divisors.sort((a, b) => a - b);
    if (divisors.length == 0) {
        divisors.push(1, prev_num);
    }
    console.log(divisors);
    let divisor = divisors[Math.floor(Math.random() * divisors.length)];
    numbers.push(divisor);

}

//Assign operations to an equation. Assigns *, / only once per equation (removes them from the randomizer list afterward)
const chooseOperation = (operations, operation_types) => {
    operations.push(operation_types[Math.floor(Math.random() * operation_types.length)]);
    if (operations[operations.length - 1] == "*" || operations[operations.length - 1] == "/") { 
        const index = operation_types.indexOf(operations[operations.length - 1]);
        operation_types.splice(index, 1);
    }
}


//main function
const generateEquation = (gamemode, game_type) => {

    //console.log(gamemode);
    //console.log(game_type);
    let size = 2;
                                                 
    let numbers = [];
    let operations = [];
    let operation_types =  ["+","-","*","/"];

    let num_cap = 100;
    let mult_and_div_cap = 21; 
    let equation = "";

    //if on challenge mode, randomly determine size of the operation (for standard and daily challenge)
    if (game_type == "challenge" && (Math.random() < 0.2)) {
        size = 3;
    }
    else if (game_type == "daily") {
        if (Math.random() < 0.2) { size = 5; }
        else { size = 4; }
    }


    //determine randomness of getting certain operators, based on mode/type (single-type operations always have the same operation)
    if (gamemode == "challenge" && size >= 3) {
        operation_types = ["+", "+", "-", "-", "*","/"];
    }
    else if (game_type == "medley") {
        operation_types = ["+","-","*","/"];
    }
    else if (game_type == "addition") {
        operation_types = ["+"];
    }
    else if (game_type == "subtraction") {
        operation_types = ["-"];
    }
    else if (game_type == "multiplication") {
        operation_types = ["*"];
    }
    else if (game_type == "division") {
        operation_types = ["/"];
    }
    
    
    //choose operations
    for (let i = 0; i < size - 1; i++) {
        chooseOperation(operations, operation_types);
    }
    
    //determine max values to generate, based on gamemode and operations
    if (gamemode == 'casual') {
        if (operations.includes("*") || operations.includes("/")) {
            num_cap = 21;
            mult_and_div_cap = 21; 
        }
        else {
            num_cap = 100;
        }
    }
    else if (gamemode == 'ranked') {
        if (operations.includes("*") || operations.includes("/")) {
            num_cap = 51;
            mult_and_div_cap = 21; 
        }
        else {
            num_cap = 1000;
        }
    }
    else if (size == 2) {
        if (operations.includes("*") || operations.includes("/")) {
            num_cap = 101;
            mult_and_div_cap = 21; 
        }
        else {
            num_cap = 10000;
        }
    }
    else {
        if (operations.includes("*") || operations.includes("/")) {
            num_cap = 100;
            mult_and_div_cap = 6; 
        }
        else {
            num_cap = 1000;
        }
    }
    
    //generate numbers, with respect to operations
    for (let i = 0; i < size; i++) {
        if (i-1 >= 0 && (operations[i-1] == "*" || operations[i-1] == "/")) {
            if (operations[i-1] == "*") { multNumGen(numbers, operations, num_cap, mult_and_div_cap); }
            else if (operations[i-1] == "/") { divNumGen(numbers, num_cap, mult_and_div_cap); }
        }
        else { genNumGen(numbers, num_cap); }

        if (gamemode != "casual" && (Math.random() < 0.2)) {
            numbers[i] *= -1;
        }
    }

    //force all answers for casual subtraction questions to be positive
    if (gamemode == "casual" && operations[0] == "-" && numbers[1] > numbers[0]) {
        const temp = numbers[1];
        numbers[1] = numbers[0];
        numbers[0] = temp;
    }
    

    //create and return equation string
    for (let i = 0; i < size; i++) {
        if (numbers[i] < 0) {
            equation += `(${numbers[i]})`;
        }
        else {
            equation += `${numbers[i]}`;
        }

        if (i < (size-1)) {
            equation += ` ${operations[i]} `
        }
    }

    return (equation);
}

export {generateEquation};


