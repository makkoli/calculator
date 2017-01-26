$(document).ready(function() {
    var calculation = []; // Holds the array for the calculation

    // Start a new calculation until equal is pressed
    // Handle adding digits
    $(".digits").on('click', function(event) {
        $("#result").html(addOperand(calculation, document.getElementById(event.target.id).getAttribute("value")));
    });

    // Handle calculator functions
    $(".operations").on('click', function(event) {
        // If equal is pressed, perform the calculation if the expression isn't malformed
        if (event.target.id == 'equal') {
            $("#result").html(performCalculation(calculation)// Else, add the new operation as long as it isn't equal
            );
        } else {
            $("#result").html(addOperation(calculation, event.target.id));
        }
    });

    // Clear the current calculation
    $("#clear").on('click', function() {
        calculation = [];
        $("#result").html('0');
    });

    // Clear last entry
    $("#clearLastEntry").on('click', function() {
        $("#result").html(clearLastEntry(calculation));
    });
});

/*
 * Updates the operands after a button was pressed
 * @calculation: calculation array holding all operands/operators
 * @value: value to be added to last operand or a new operand value
 */
function addOperand(calculation, value) {
    // Check if start of new calculation
    if (calculation.length == 0) {
        calculation.push(value// Check if its a new operand after an operation
        );
    } else if (checkOperation(calculation[calculation.length - 1])) {
        calculation.push(value);
        // Check if the first element is from a previous calculation result
        // and reset the first element to the new value if it is and it is not being
        // used in the next calculation
    } else if (typeof calculation[0] == "number" && calculation.length == 1) {
        calculation[0] =// Else, add to current operand
        value;
    } else {
        calculation[calculation.length - 1] += value;
    }

    return updateCalc(calculation);
}

/*
* Add or update an operation to the calculation
* @calculation: array of all operands/operators
* @value: operation value to add
*/
function addOperation(calculation, value) {
    // Don't add an operation if one was just added
    // Instead change the current operation
    if (checkOperation(calculation[calculation.length - 1])) {
        calculation[calculation.length - 1] =// Check if calculation is empty - add 0 then push operator if it is
        value;
    } else if (calculation.length == 0) {
        calculation.push('0');
        calculation.push(value// Else, add the new operation and start a new operand
        );
    } else {
        calculation.push(value);
    }

    return updateCalc(calculation);
}

/*
* Perform the calculation and return the result
* @calculation: calculation array holding all operands/operators
*/
function performCalculation(calculation) {
    // Need more than 1 element to do a calculation
    if (calculation.length <= 1) {
        // Need a not malformed expression
        return;
    } else if (checkOperation(calculation[calculation.length - 1])) {
        // Else, we can make something happen
        return;
    } else {
        return calculateResult(calculation);
    }
}

/*
* Calculates the result
* @calculation: array holding all calculations to be computed
*/
function calculateResult(calculation) {
    // Cycle through calculation first to get all the multiply/divide
    // Since all operators will be at odd indexes, move 2 forward every iteration
    for (var i = 0; i < calculation.length; i++) {
        if (calculation[i] == "multiply") {
            // Move back one to remove 3 items
            // Replace it with the multiplication i-1 and i+1
            calculation.splice(i - 1, 3, (+ calculation[i - 1]) * (+ calculation[i + 1]));
            // Reset i to compensate for compressing array
            i = 0;
        } else if (calculation[i] == "divide") {
            // Replace 3 items with the division of i-1 and i+1
            calculation.splice(i - 1, 3, (+ calculation[i - 1]) / (+ calculation[i + 1]));
            i = 0;
        }
    }

    // Cycle through to get all the addition and subtraction
    for (var i = 0; i < calculation.length; i++) {
        if (calculation[i] == "addition") {
            calculation.splice(i - 1, 3, (+ calculation[i - 1]) + (+ calculation[i + 1]));
            i = 0;
        } else if (calculation[i] == "subtract") {
            calculation.splice(i - 1, 3, (+ calculation[i - 1]) - (+ calculation[i + 1]));
            i = 0;
        }
    }

    // Result should be left at first index
    return calculation[0];
}

/*
* Update the calculation in the text field
* @calculation: calculation array holding operands/operators
*/
function updateCalc(calculation) {
    var calcStr = ""; // Calculation string

    // Construct the calculation
    for (var i = 0; i < calculation.length; i++) {
        // Convert operators to proper html entities
        if (checkOperation(calculation[i])) {
            calcStr += getOperationChar(calculation[i]);
        } else {
            calcStr += calculation[i];
        }
    }
    return calcStr;
}

/*
* Clears the last entry added to the calculator
* and returns updated calculation
* @calculation: array holding all current operands/operators
*/
function clearLastEntry(calculation) {
    // Remove last operation/operand
    if (calculation.length > 1) {
        calculation.pop();
        return updateCalc(calculation// Reset if last element being removed in calculation
        );
    } else if (calculation.length == 1) {
        calculation.pop();
        return// Return 0 if there is nothing in the array
        '0';
    } else {
        return '0';
    }
}

/*
* Checks if element is an operation or operand
* @operation: element to check
*/
function checkOperation(operation) {
    if (operation == 'addition' || operation == 'divide' || operation == 'subtract' || operation == 'multiply') {
        return true;
    }
    return false;
}

/*
* Converts an operation to its proper symbol
* @oper: operation to convert
*/
function getOperationChar(oper) {
    switch (oper) {
        case "addition":
            return '+';
        case "subtract":
            return '-';
        case "multiply":
            return '&#215;';
        case "divide":
            return '&#247;'
    }
}
