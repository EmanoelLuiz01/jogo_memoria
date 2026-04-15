let cards = [];
let firstCard = null;
let secondCard = null;
let lockBoard = false;

let errors = 0;
let hits = 0;
let time = 0;
let timerInterval;
let totalCards = 0;

const board = document.getElementById("board");

function showLevels() {
  document.getElementById("menu").classList.add("hidden");
  document.getElementById("levels").classList.remove("hidden");
}

function startGame(total) {
  document.getElementById("levels").classList.add("hidden");
  document.getElementById("game").classList.remove("hidden");

  totalCards = total;
  resetStats();
  createCards(totalCards);
  createBoard(totalCards);
  startTimer();
}

function createCards(total) {
  let selected = heroes.slice(0, total / 2);
  cards = [...selected, ...selected];

  for (let i = cards.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    [cards[i], cards[j]] = [cards[j], cards[i]];
  }
}

function createBoard(total) {
  board.innerHTML = "";

  let size = Math.sqrt(total);
  board.style.gridTemplateColumns = `repeat(${size}, 70px)`;

  cards.forEach(symbol => {
    const card = document.createElement("div");
    card.classList.add("card");
    card.dataset.symbol = symbol;

    card.addEventListener("click", () => flipCard(card));
    board.appendChild(card);
  });
}

function flipCard(card) {
  if (lockBoard || card.classList.contains("flipped")) return;

  card.textContent = card.dataset.symbol;
  card.classList.add("flipped");

  if (!firstCard) {
    firstCard = card;
  } else {
    secondCard = card;
    lockBoard = true;

    if (firstCard.dataset.symbol === secondCard.dataset.symbol) {
      hits++;
      updateScore();
      if (checkGameEnd()) {
        endGame();
      } else {
        resetTurn();
      }
    } else {
      errors++;
      updateScore();

      setTimeout(() => {
        firstCard.textContent = "";
        secondCard.textContent = "";
        firstCard.classList.remove("flipped");
        secondCard.classList.remove("flipped");
        resetTurn();
      }, 800);
    }
  }
}

function resetTurn() {
  firstCard = null;
  secondCard = null;
  lockBoard = false;
}

function updateScore() {
  document.getElementById("score").innerText =
    `Erros: ${errors} | Acertos: ${hits}`;
}

function resetStats() {
  errors = 0;
  hits = 0;
  time = 0;
  updateScore();
  document.getElementById("timer").innerText = "Tempo: 0s";
}

function startTimer() {
  clearInterval(timerInterval);
  timerInterval = setInterval(() => {
    time++;
    document.getElementById("timer").innerText = `Tempo: ${time}s`;
  }, 1000);
}

function checkGameEnd() {
  return hits * 2 === totalCards;
}

function endGame() {
  clearInterval(timerInterval);
  lockBoard = true;
  setTimeout(() => {
    alert(`\n🎉 Parabéns! Você venceu!\n\nErros: ${errors}\nTempo: ${time}s`);
  }, 500);
}

function goToMenu() {
  clearInterval(timerInterval);
  document.getElementById("game").classList.add("hidden");
  document.getElementById("menu").classList.remove("hidden");
}
