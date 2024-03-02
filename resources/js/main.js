// Initialize variables
const flashcards = document.querySelector("#flashcards");
const card = document.querySelector("#card");
const front = document.querySelector(".front");
const back = document.querySelector(".back");
const next = document.querySelector("#next");
const prev = document.querySelector("#prev");
const count = document.querySelector("#count");
const datapoints = "./resources/js/data.json";
const prompts = [];
let current = 0;
let flipped = false;

// Block display until the page can be rendered prettily
flashcards.style.display = "none";

// Fetch data from JSON file
fetch(datapoints)
  .then(blob => {
    if (!blob.ok) {
      throw new Error(`Network response was not ok: ${blob.status} - ${blob.statusText}`);
    }
    return blob.json();
  })
  .then(data => {
    if (!Array.isArray(data)) {
      throw new Error('Invalid JSON format: data is not an array.');
    }
    prompts.push(...data);
    buildIndex();
    buildNextCard();

    // Use setTimeout to display the cards after the context has rendered
    setTimeout(() => {
      flashcards.style.display = "flex";
    }, 0);
  })
  .catch(error => {
    console.error(`An error occurred while fetching or processing the JSON data: ${error.message}`);
  });

// Build the index of prompts
function buildIndex() {
  const list = document.createElement("ol");
  for (const i of prompts.sort()) {
    const item = document.createElement("li");
    item.innerHTML = `<div onclick="resetCurrent(${prompts.indexOf(i)})">${i.prompt}</div>`;
    list.appendChild(item);
  }
  document.getElementById("index").appendChild(list);
  toggleActiveLink(1);
}

// Toggle active index link
function toggleActiveLink(index) {
  const indexItems = document.querySelectorAll("#index li");
  indexItems.forEach((item, i) => {
    if (i === (index - 1)) {
      item.classList.add("active-link");
    } else {
      item.classList.remove("active-link");
    }
  });
}

// Function to reset the current card
function resetCurrent(index) {
  if (typeof index !== 'undefined') {
    current = index;
    getNextCard();
    toggleActiveLink(current);
    prev.disabled = false;
    next.disabled = false;
  }
}

// Build the next card
function buildNextCard() {
  front.innerHTML = `<p>${prompts[current].prompt}</p>`;
  back.innerHTML = `<p>${prompts[current].answer}</p><p><a href="${prompts[current].link}" target="_blank">reference</a></p>`;
  count.innerHTML = `<p>${current + 1} / ${prompts.length}</p>`;
  current++;
}

function flipCard() {
  flipped = !flipped;
  if (flipped) {
    card.classList.add("flipped");
  } else {
    card.classList.remove("flipped");
  }
}

// Get the next card
function getNextCard() {
  if (current < prompts.length) {
    if (flipped) {
      // Flip the card back to the front first
      flipCard();
      setTimeout(buildNextCard, 500); // Delay navigation until after the flip 
    } else {
      buildNextCard();
    }
    prev.disabled = false;
    next.disabled = false;
    toggleActiveLink(current);
  } else {
    next.disabled = true;
  }
}

// Get the previous card
function getPrevCard() {
  if (current > 1) {
    if (flipped) {
      // Flip the card back to the front first
      flipCard();
      setTimeout(buildPrevCard, 500); // Delay navigation until after the flip
    } else {
      buildPrevCard();
    }
    toggleActiveLink(current);
    prev.disabled = false;
    next.disabled = false;
  } else {
    prev.disabled = true;
  }
}

// Build the previous card
function buildPrevCard() {
  front.innerHTML = `<p>${prompts[current - 2].prompt}</p>`;
  back.innerHTML = `<p>${prompts[current - 2].answer}</p><p><a href="${prompts[current - 2].link}" target="_blank">reference</a></p>`;
  count.innerHTML = `<p>${current - 1} / ${prompts.length}</p>`;
  current--;
}

// Toggle the card's facing side (front/back)
function toggleFacing(e) {
  // Check if the clicked element is an anchor (link) within the back of the card
  if (e.target.tagName === 'A' && e.target.closest('.back')) {
    // Do nothing and let the link be followed
  } else {
    // Toggle the card's facing side
    flipped = !flipped;
    if (flipped) {
      this.classList.add("flipped");
    } else {
      this.classList.remove("flipped");
    }
  }
}

// Event listeners
card.addEventListener("click", toggleFacing);
next.addEventListener("click", getNextCard);
prev.addEventListener("click", getPrevCard);

// Get the current year
const currentYear = new Date().getFullYear();

// Update the content of the currentYear span
document.getElementById("currentYear").textContent = currentYear;
