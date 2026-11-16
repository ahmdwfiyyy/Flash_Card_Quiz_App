interface FlashCard {
  questionText: string;
  questionAnswer: string;
}

class InvalidUserInputError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "InvalidUserInputError";
  }
}

const currentCards: FlashCard[] = [
  {
    questionText: "What does the TypeScript compiler output?",
    questionAnswer: "Plain JavaScript",
  },
  {
    questionText: "Which keyword describes the shape of an object?",
    questionAnswer: "interface",
  },
  {
    questionText: "What type does an empty array literal get with no annotation?",
    questionAnswer: "any[] (or never[] under strict mode)",
  },
];

let currentIndex: number = currentCards.length - 1;

const flashcardEl = document.getElementById("flashcard") as HTMLDivElement;
const questionEl = document.getElementById("card-question") as HTMLParagraphElement;
const answerEl = document.getElementById("card-answer") as HTMLParagraphElement;
const counterEl = document.getElementById("card-counter") as HTMLSpanElement;
const prevBtn = document.getElementById("prev-btn") as HTMLButtonElement;
const nextBtn = document.getElementById("next-btn") as HTMLButtonElement;
const deleteBtn = document.getElementById("delete-btn") as HTMLButtonElement;
const entryForm = document.getElementById("entry-form") as HTMLFormElement;
const frontText = document.getElementById("front-text") as HTMLTextAreaElement;
const backText = document.getElementById("back-text") as HTMLTextAreaElement;
const formError = document.getElementById("form-error") as HTMLParagraphElement;

function renderCard(): void {
  flashcardEl.classList.remove("flipped");

  if (currentCards.length === 0) {
    currentIndex = -1;
    questionEl.textContent = "The deck is empty. Write a card to get started.";
    answerEl.textContent = "Nothing here yet.";
    counterEl.textContent = "No cards";
    flashcardEl.classList.add("empty");
  } else {
    currentIndex = Math.min(Math.max(currentIndex, 0), currentCards.length - 1);
    const card: FlashCard = currentCards[currentIndex];
    questionEl.textContent = card.questionText;
    answerEl.textContent = card.questionAnswer;
    counterEl.textContent = `Card ${currentIndex + 1} of ${currentCards.length}`;
    flashcardEl.classList.remove("empty");
  }

  prevBtn.disabled = currentIndex <= 0;
  nextBtn.disabled = currentIndex >= currentCards.length - 1;
  deleteBtn.disabled = currentCards.length === 0;
}

function flipCard(): void {
  if (currentCards.length === 0) return;
  flashcardEl.classList.toggle("flipped");
}

function deleteCurrentCard(): void {
  if (currentCards.length === 0) return;
  currentCards.splice(currentIndex, 1);
  // Show the card that came before the removed one (or the new first card).
  currentIndex = Math.max(currentIndex - 1, 0);
  renderCard();
}

function createCard(questionText: string, questionAnswer: string): FlashCard {
  if (questionText.trim() === "" || questionAnswer.trim() === "") {
    throw new InvalidUserInputError(
      "Both sides need text. Fill in the question and the answer, then add the card."
    );
  }
  return { questionText: questionText.trim(), questionAnswer: questionAnswer.trim() };
}

function handleSubmit(event: SubmitEvent): void {
  event.preventDefault();
  formError.textContent = "";

  try {
    const newCard: FlashCard = createCard(frontText.value, backText.value);
    currentCards.push(newCard);
    currentIndex = currentCards.length - 1;
    renderCard();
    entryForm.reset();
    frontText.focus();
  } catch (error) {
    if (error instanceof InvalidUserInputError) {
      formError.textContent = error.message;
      (frontText.value.trim() === "" ? frontText : backText).focus();
    } else {
      throw error;
    }
  }
}

flashcardEl.addEventListener("click", flipCard);
flashcardEl.addEventListener("keydown", (event: KeyboardEvent) => {
  if (event.key === "Enter" || event.key === " ") {
    event.preventDefault();
    flipCard();
  }
});

prevBtn.addEventListener("click", () => {
  currentIndex--;
  renderCard();
});

nextBtn.addEventListener("click", () => {
  currentIndex++;
  renderCard();
});

deleteBtn.addEventListener("click", deleteCurrentCard);
entryForm.addEventListener("submit", handleSubmit);

renderCard();
