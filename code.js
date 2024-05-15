const cards = document.querySelectorAll(".card");
const mainSound = new Audio("./sounds/Utama.mp3");
const matchingSound = new Audio("./sounds/matching.mp3");
const nonMatchingSound = new Audio("./sounds/n-matching.mp3");
const congratulationsSound = new Audio("./sounds/clap.mp3");
const gameOverSound = new Audio("./sounds/Game Over.mp3");
const clickButtonSound = new Audio("./sounds/Click Button.mp3");
const timerSound = new Audio("./sounds/Time out.mp3")
mainSound.volume = 0.3;
matchingSound.volume = 1;
nonMatchingSound.volume = 1;
congratulationsSound.volume = 1;
gameOverSound.volume = 1;
clickButtonSound.volume = 0.7;
timerSound.volume = 1;
let maxTime = 30;
let timeLeft = maxTime;
let timer;
let matched = 0;
let cardOne, cardTwo;
let disableDeck = false;
let wrongMoves = 0;
let maxWrongMoves = 10;
let wrongMovesLeftTag = document.querySelector(".moves b")
let mainSoundPlaying = false;
let refreshButton = document.querySelector(".details button");
let timeTag = document.querySelector(".time b");
let timerStarted = false;

function initTimer() {
    if (timeLeft <=0) {
        clearInterval(timer);
        showTimeUpModal();
        return;
    }
        timeLeft--;
        timeTag.innerText = timeLeft;
}

function stopTimer () {
    clearInterval(timer);
    timerStarted = false;
}

function startTimer () {
    timer = setInterval(initTimer, 1000);
    timerStarted = true;
}

function updateWrongMovesLeft() {
    wrongMovesLeftTag.innerText = maxWrongMoves - wrongMoves;
}

function flipCard({target: clickedCard}) {
    if (!timerStarted) {
        startTimer();
    }
    if (cardOne !== clickedCard && !disableDeck) {
        clickedCard.classList.add("flip");
        if (!cardOne) {
            cardOne = clickedCard;
            return;
        }
        cardTwo = clickedCard;
        disableDeck = true;
        let cardOneImg = cardOne.querySelector(".back-view img").src;
        let cardTwoImg = cardTwo.querySelector(".back-view img").src;
        matchCards(cardOneImg, cardTwoImg);
    }
}

function matchCards(img1, img2) {
    if(img1 === img2) {
        matched++;
        if(matched == 8) {
            endGame();
        }
        cardOne.removeEventListener("click", flipCard);
        cardTwo.removeEventListener("click", flipCard);
        cardOne = cardTwo = "";
        matchingSound.play();
        return disableDeck = false;
    } else {
        wrongMoves++;
        updateWrongMovesLeft();
        if (wrongMoves === maxWrongMoves) {
            endGame();
        }

        setTimeout(() => {
            cardOne.classList.add("shake");
            cardTwo.classList.add("shake");
        }, 400);

        setTimeout(() => {
            cardOne.classList.remove("shake", "flip");
            cardTwo.classList.remove("shake", "flip");
            cardOne = cardTwo = "";
            disableDeck = false;
            nonMatchingSound.play();
        }, 1000);
    }
}

function shuffleCard() {
    matched = 0;
    wrongMoves = 0;
    disableDeck = false;
    cardOne = cardTwo = "";
    timeLeft = maxTime;
    timeTag.innerText = timeLeft;
    updateWrongMovesLeft();
    clearInterval(timer);
    let arr = [1, 2, 3, 4, 5, 6, 7, 8, 1, 2, 3, 4, 5, 6, 7, 8];
    arr.sort(() => Math.random() > 0.5 ? 1 : -1);
    cards.forEach((card, i) => {
        card.classList.remove("flip");
        let imgTag = card.querySelector(".back-view img");
        imgTag.src = `images/img-${arr[i]}.png`;
        card.addEventListener("click", flipCard);
    });
}

refreshButton.addEventListener("click", () => {
    shuffleCard();
    clickButtonSound.play();
    stopTimer();
});

function showCongratulationsModal() {
    let modal = document.getElementById("congratulationsModal");
    modal.style.display = "block";
    matchingSound.pause();
}

function hideCongratulationsModal() {
    let modal = document.getElementById("congratulationsModal");
    modal.style.display = "none";
    mainSound.play();
    congratulationsSound.pause();
}

function setupCongratulationsModal() {
    let modal = document.getElementById("congratulationsModal");
    let closeButton = modal.querySelector(".congratulationsClose");
    closeButton.addEventListener("click", () => {
        hideCongratulationsModal();
        restartGame();
    });
}

function showGameOverModal() {
    let modal = document.getElementById("gameOverModal");
    modal.style.display = "block";
    nonMatchingSound.pause();
}

function hideGameOverModal() {
    let modal = document.getElementById("gameOverModal");
    modal.style.display = "none";
    mainSound.play();
    gameOverSound.pause();
}

function setupGameOverModal() {
    let modal = document.getElementById("gameOverModal");
    let closeButton = modal.querySelector(".close");
    closeButton.addEventListener("click", () => {
        hideGameOverModal();
        restartGame();
    });
}

function showTimeUpModal() {
    let modal = document.getElementById("timeUpModal");
    modal.style.display = "block";
    mainSound.pause();
    gameOverSound.play();
    stopTimer();
}

function hideTimeUpModal() {
    let modal = document.getElementById("timeUpModal");
    modal.style.display = "none";
    mainSound.play();
    gameOverSound.pause();
}

function setupTimeUpModal() {
    let modal = document.getElementById("timeUpModal");
    let closeButton = modal.querySelector(".timeUpClose");
    closeButton.addEventListener("click", () => {
        hideTimeUpModal();
        restartGame();
    });
}

function startGame() {
    document.querySelector(".container").style.display = "none";
    document.getElementById("gameArea").style.display = "block";

    var gameArea = document.getElementById("gameArea");
    gameArea.style.display = "block"

    if (!mainSoundPlaying) {
        mainSound.play();
        mainSound.loop = true;
        mainSoundPlaying = true;
    }
  }

function endGame() {
    mainSound.pause();
    stopTimer();
    if (timeLeft <= 0) {
        showTimeUpModal();
        timerSound.play();
    }
    if (matched === 8) {
        showCongratulationsModal();
        congratulationsSound.play();
    } 
    if (wrongMoves === 10) {
    showGameOverModal();
    gameOverSound.play();
    }
}

function restartGame() {
    matched = 0;
    wrongMoves = 0;
    disableDeck = false;
    cardOne = null;
    cardTwo = null;
    shuffleCard();
    timerStarted = false;
}

document.querySelector("button").addEventListener("click", () => {
    clickButtonSound.play();
});

shuffleCard();
setupCongratulationsModal();
setupGameOverModal();
setupTimeUpModal();
cards.forEach(card => {
    card.addEventListener("click", flipCard);
});
updateWrongMovesLeft();