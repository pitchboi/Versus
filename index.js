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
const elCategory = document.getElementById("category");
const elGoButton = document.getElementById("goButton");

const cssRoot = document.querySelector(":root");
const cssRootStyle = getComputedStyle(cssRoot);

const listRappers = `Pop Smoke
Kid Cudi
Big Sean
Don Toliver
The Weeknd
Nas
Juice WRLD
Rick Ross
Childish Gambino
Logic
Denzel Curry
Pusha T
Migos
Young Thug
Frank Ocean
Tory Lanez
Bryson Tiller
The Game
Lil Baby
Eminem
Tyler, the Creator
Chris Brown
Future
NAV
B.o.B
Gorillaz
21 Savage
Nicki Minaj
Travis Scott
Meek Mill
Lil Wayne
Joey Bada$$
Gunna
Usher
Cardi B
PARTYNEXTDOOR
Wiz Khalifa
Russ
Chance the Rapper
Jack Harlow
Drake
Lil Uzi Vert
T-Pain
Roddy Ricch
A Boogie wit da Hoodie
Trey Songz
Post Malone
J. Cole
Mac Miller
Gang Starr
Lupe Fiasco
Kendrick Lamar
Tech N9ne
Gucci Mane
A$AP Rocky
Lil Nas X
XXXTENTACION
Yelawolf
Kanye West
Trippie Redd
JAY-Z`
const listCarBrands = `Toyota
Honda
Chevrolet
Ford
Mercedes-Benz
Jeep
BMW
Porsche
Subaru
Nissan
Cadillac
Volkswagen
Lexus
Audi
Ferrari
Volvo
Jaguar
GMC
Buick
Acura
Bentley
Dodge
Hyundai
Lincoln
Mazda
Land Rover
Tesla
Kia
Chrysler
Pontiac
Infiniti
Mitsubishi
Oldsmobile
Maserati
Aston Martin
Fiat
Mini
Alfa Romeo
Saab
Suzuki`

hideElement(elArena);
hideElement(elEfficiency);

elCategory.value = "";

function changeButtonColor(state, object) {
    let color;

    switch (state) {
        case "hover":
            color = cssRootStyle.getPropertyValue('--button-color-hover');
            break;
        case "click":
            color = cssRootStyle.getPropertyValue('--button-color-click');
            break;
        default:
            color = cssRootStyle.getPropertyValue('--button-color-normal');
            break;
    }

    switch (object) {
        case "goButton":
            cssRoot.style.setProperty('--goButton-color-current', color)
            break;
        case "firstButton":
            cssRoot.style.setProperty('--firstButton-color-current', color)
            break;
        case "secondButton":
            cssRoot.style.setProperty('--secondButton-color-current', color)
            break;
    }
}

function changeInput() {
    switch (elCategory.value) {
        case "rappers":
            elTextInput.value = listRappers;
            break;
        case "carBrands":
            elTextInput.value = listCarBrands;
            break;
        case "custom":
            elTextInput.value = "";
            break;
        default: // blank
            elTextInput.value = "";
            break;
    }
}

function startGame() {
    if (!readInput()) {
        alert("You need to enter at least 2 items in the box");
        return;
    }
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

    // Check amount of items
    if (inputArray.length < 2) { // Need at least 2 items
        return false;
    } else {
        return true; // Good to go!
    }
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