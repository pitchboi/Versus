let inputString = "";
let inputArray = [];
let arenaArray = [];
let resultArray = [];
let tempArray = [];
let round = 0;
let iteration = 0;
let matches = 1;
let firstButtonNumber = 0;
let secondButtonNumber = 0;

const elUl = document.getElementById("testList");
const elFirstButton = document.getElementById("firstButton");
const elSecondButton = document.getElementById("secondButton");
const elArena = document.getElementById("arena-el");
const elInput = document.getElementById("input-el");
const elTextInput = document.getElementById("textInput");

hideElement(elArena);

function startGame() {
    readInput();
    createArena();
    nextMatch();
    hideElement(elInput);
    showElement(elArena);
}

function hideElement(element) {
    element.style.display = "none";
}

function showElement(element) {
    element.style.display = "block";
}

function readInput() {
    // Reset array
    inputArray.length = 0;

    // Assign string and array
    inputString = elTextInput.value;
    inputArray = inputString.split("\n");

    // Filter array
    inputArray = inputArray.filter(item => item.trim().length > 0);
}

function createArena() {
    for (i = 0; i < inputArray.length - 1; i++) { // Don't need to run the last row, it's redundant
        for (j = i + 1; j < inputArray.length; j++) {
            arenaArray.push([i, j]);
        }
        resultArray.push(0); // Make entry in result array
    }
    resultArray.push(0); // Make final entry in result array (since the loop stops 1 short of total entries)
    tempArray = JSON.parse(JSON.stringify(resultArray));
}

function nextMatch() {
    // Set values and labels for buttons for the next matchup
    firstButtonNumber = arenaArray[round][0];
    secondButtonNumber = arenaArray[round][1];
    elFirstButton.textContent = inputArray[firstButtonNumber];
    elSecondButton.textContent = inputArray[secondButtonNumber];

    // Check if part of a new iteration
    if (firstButtonNumber !== iteration) {
        iteration += 1;
        tempArray = JSON.parse(JSON.stringify(resultArray));
    }

    // Bump the round number up to reflect what round we're on (starts at 1, not 0)
    round += 1;

    // Display test totals **************************************** FOR DEBUG ****************************************
    /*elUl.innerHTML = "";
    for (i = 0; i < resultArray.length; i++) {
        elUl.innerHTML += `<li>${inputArray[i]}: ${resultArray[i]}</li>`;
    }*/
    /*elUl.innerHTML += `<li>-------------------</li>`
    for (i = 0; i < resultArray.length; i++) {
        elUl.innerHTML += `<li>${inputArray[i]}: ${tempArray[i]}</li>`;
    }*/

    // Check if first and second numbers are unequal, and as long as all items on list are 'in play', the matchup can be skipped because the answer is already known
    if (tempArray[firstButtonNumber] !== tempArray[secondButtonNumber]) {
        if (round === arenaArray.length) {
            endGame(); // End the game, rounds are all done!
        } else {
            nextMatch(); // Run this procedure again
        }
    }
}

function clickButton(buttonNumber) {
    // Deduct one point from the loser's slot in the result array
    let temp = 0;
    let otherTemp = 0;

    if (buttonNumber === 1) { // First button
        resultArray[secondButtonNumber] = resultArray[firstButtonNumber] - 1;
        temp = resultArray[secondButtonNumber];
        otherTemp = secondButtonNumber;
    } else { // Second button
        resultArray[firstButtonNumber] = resultArray[secondButtonNumber] - 1;
        temp = resultArray[firstButtonNumber];
        otherTemp = firstButtonNumber;
    }

    // Bump lower losers down a peg
    for (i = 0; i < resultArray.length; i++) {
        if (tempArray[i] <= temp && i !== otherTemp) {
            resultArray[i] -= 1;
        }
    }

    // Check if the game should keep going or not
    if (round === arenaArray.length) { // Game has ended because it has reached a coordinate outside of the array of matches
        // End the game
        endGame();
    } else { // Keep going
        // Generate next match
        nextMatch();
    }

    matches += 1;
}

function endGame() {
    // Hide the arena (buttons)
    elArena.style.display = "none";

    // Give results array a 2nd dimension to correspond with track names
    for (i = 0; i < resultArray.length; i++) {
        resultArray[i] = [resultArray[i],inputArray[i]];
    }

    // Sort the results array to see winning order
    resultArray.sort(function(a,b) {return b[0]-a[0]});
    elUl.innerHTML = "";
    for (i = 0; i < resultArray.length; i++) {
        /*elUl.innerHTML += `<li>${i + 1}. ${inputArray[i]}</li>`;*/
        elUl.innerHTML += `<li>${i + 1}. ${resultArray[i][1]}</li>`;
    }
}