let inputString = "";
let inputArray = [];
let arenaArray = [];
let resultArray = [];
let tempArray = [];
let round = 0;
let iteration = 0;
let efficiency = 0;
let matches = 1;
let firstButtonNumber = 0;
let secondButtonNumber = 0;

const elUl = document.getElementById("testList");
const elFirstButton = document.getElementById("firstButton");
const elSecondButton = document.getElementById("secondButton");
const elArena = document.getElementById("arena-el");
const elInput = document.getElementById("input-el");
const elTextInput = document.getElementById("textInput");
const elEfficiency = document.getElementById("efficiency");

const cssRoot = document.querySelector(":root");
const cssRootStyle = getComputedStyle(cssRoot);

hideElement(elArena);
hideElement(elEfficiency);

function startGame() {
    readInput();
    createArena();
    nextMatch();
    hideElement(elInput);
    //hideElement(elUl);
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
    }
    elUl.innerHTML += `<li>-------------------</li>`
    for (i = 0; i < resultArray.length; i++) {
        elUl.innerHTML += `<li>${inputArray[i]}: ${tempArray[i]}</li>`;
    }*/

    // Check if first and second numbers are unequal, and as long as all items on list are 'in play', the matchup can be skipped because the answer is already known
    if (tempArray[firstButtonNumber] !== tempArray[secondButtonNumber]) {
    //if (tempArray[firstButtonNumber] !== tempArray[secondButtonNumber]) {
        if (round === arenaArray.length) {
            endGame(); // End the game, rounds are all done!
        } else {
            nextMatch(); // Run this procedure again
        }
    }
}

function clickButton(buttonNumber) {
    if (buttonNumber === 1) { // First button
        resultArray[secondButtonNumber] = resultArray[firstButtonNumber] - 1;
        for (i = 0; i < resultArray.length; i++) {
            if (tempArray[i] <= resultArray[secondButtonNumber]) {
                resultArray[i] = tempArray[i] - 1;
            }
        }
    } else {
        resultArray[secondButtonNumber] = resultArray[firstButtonNumber] + 1;
        for (i = 0; i < resultArray.length; i++) {
            if (tempArray[i] >= resultArray[secondButtonNumber]) {
                resultArray[i] = tempArray[i] + 1;
            }
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
        if (i === 0) {
            elUl.innerHTML += `<li id="winner">${i + 1}. ${resultArray[i][1]}</li>`;
        } else {
            elUl.innerHTML += `<li>${i + 1}. ${resultArray[i][1]}</li>`;
        }
    }
    efficiency = 100 - (matches / arenaArray.length * 100)
    elEfficiency.textContent = Math.floor(efficiency).toString() + "% Efficiency";
    showElement(elUl);
    showElement(elEfficiency);

    if (efficiency > 0) {
        cssRoot.style.setProperty('--efficiency-color', 'lightgreen');
    } else {
        cssRoot.style.setProperty('--efficiency-color', 'red');
    }
}