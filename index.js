let inputString = "";
let inputArray = [];
let arenaArray = [];
let resultArray = [];
let round = 0;
let firstButtonNumber = 0;
let secondButtonNumber = 0;
let allInPlay = false;

const elUl = document.getElementById("testList");
const elFirstButton = document.getElementById("firstButton");
const elSecondButton = document.getElementById("secondButton");
const elArena = document.getElementById("arena-el");
const elInput = document.getElementById("input-el");
const elTextInput = document.getElementById("textInput");

hideElement(elArena);
//readInput();
//createArena();
//nextMatch();

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
    //inputString = "Love" + "\n" + "Dying to Know" + "\n" + "Amnesia" + "\n" + "Christmas Eve" + "\n" + "Babysit" + "\n" + "MOTS";
    /*inputString += "lost souls (feat. Brent Faiyaz)" + "\n"
    inputString += "hooligan" + "\n"
    inputString += "no sense" + "\n"
    inputString += "a life of pain" + "\n"
    inputString += "killstreaks (feat. Don Toliver & Pinkpatheress)" + "\n"
    inputString += "patience interlude" + "\n"
    inputString += "naked freestyle" + "\n"
    inputString += "fine china" + "\n"
    inputString += "highway 95" + "\n"
    inputString += "bank account (feat. Lil Uzi Vert)"*/
    inputString = elTextInput.value
    inputArray = inputString.split("\n");
}

function createArena() {
    for (i = 0; i < inputArray.length - 1; i++) { // Don't need to run the last row, it's redundant
        for (j = i + 1; j < inputArray.length; j++) {
            arenaArray.push([i, j]);
        }
        resultArray.push(0); // Make entry in result array
    }
    resultArray.push(0); // Make final entry in result array (since the loop stops 1 short of total entries)
}

function nextMatch() {
    // Set values and labels for buttons for the next matchup
    firstButtonNumber = arenaArray[round][0];
    secondButtonNumber = arenaArray[round][1];
    elFirstButton.textContent = inputArray[firstButtonNumber];
    elSecondButton.textContent = inputArray[secondButtonNumber];

    // Bump the round number up to reflect what round we're on (starts at 1, not 0)
    round += 1;

    // Check if all items have been tested at least once, and if so, all are 'in play'
    if (round === inputArray.length) {
        allInPlay = true;
    }

    // Check if first and second numbers are unequal, and as long as all items on list are 'in play', the matchup can be skipped because the answer is already known
    if (resultArray[firstButtonNumber] !== resultArray[secondButtonNumber] && allInPlay) {
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
    let otherOtherTemp = 0;
    /*if (buttonNumber === 1) { // First button
        if (resultArray[firstButtonNumber] - 1 < resultArray[secondButtonNumber] - 1) {
            resultArray[secondButtonNumber] = resultArray[firstButtonNumber] - 1;
            temp = resultArray[secondButtonNumber];
        } else {
            resultArray[secondButtonNumber] = resultArray[secondButtonNumber] - 1;
            temp = resultArray[secondButtonNumber] + 1;
        }
        otherTemp = secondButtonNumber;
    } else { // Second button
        resultArray[firstButtonNumber] = Math.min(resultArray[firstButtonNumber] - 1, resultArray[secondButtonNumber] - 1);
        otherTemp = firstButtonNumber;
        temp = resultArray[firstButtonNumber] + 1;
    }*/
    if (buttonNumber === 1) { // First button
        if (resultArray[firstButtonNumber] - 1 < resultArray[secondButtonNumber] - 1) {
            resultArray[secondButtonNumber] = resultArray[firstButtonNumber] - 1;
            temp = resultArray[secondButtonNumber];
        } else {
            resultArray[secondButtonNumber] = resultArray[secondButtonNumber] - 1;
            temp = resultArray[secondButtonNumber] + 1;
        }
        otherTemp = secondButtonNumber;
    } else { // Second button
        if (resultArray[secondButtonNumber] - 1 < resultArray[firstButtonNumber] - 1) {
            resultArray[firstButtonNumber] = resultArray[secondButtonNumber] - 1;
            temp = resultArray[firstButtonNumber];
        } else {
            resultArray[firstButtonNumber] = resultArray[firstButtonNumber] - 1;
            temp = resultArray[firstButtonNumber] + 1;
        }
        otherTemp = firstButtonNumber;
    }

    // Bump lower losers down a peg
    for (i = 0; i < resultArray.length; i++) {
        if (resultArray[i] < temp && i !== otherTemp) {
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
    //elUl.innerHTML = "";
    for (i = 0; i < resultArray.length; i++) {
        /*elUl.innerHTML += `<li>${i + 1}. ${inputArray[i]}</li>`;*/
        elUl.innerHTML += `<li>${i + 1}: ${resultArray[i][1]}</li>`;
    }
}