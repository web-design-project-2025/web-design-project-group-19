// The following functions was generated with the help of GitHub Copilot and then manually reviewed and adapted for this project.


// Select elements
const prevButton = document.querySelector(".rotation-button-left");
const nextButton = document.querySelector(".rotation-button-right");
const membersWheel = document.querySelector(".popular-members-wheel");

// Adjust this value based on the width of your profile cards
const scrollStep = 300;

// Scroll to the left
prevButton.addEventListener("click", () => {
    if (membersWheel.scrollLeft === 0) {
       const lastCard = membersWheel.lastElementChild;
       membersWheel.Prepend(lastCard);
       membersWheel.scrollLeft += lastCard.offsetWidth +10;
    }
  membersWheel.scrollBy({
    left: -scrollStep,
    behavior: "smooth",
  });
});

// Scroll to the right
nextButton.addEventListener("click", () => {
    const maxScrollLeft = membersWheel.scrollWidth - membersWheel.clientWidth;
    if (membersWheel.scrollLeft >= maxScrollLeft) {
       const firstCard = membersWheel.firstElementChild;
       membersWheel.append(firstCard);
       membersWheel.scrollLeft -= firstCard.offsetWidth +10;
    }
  membersWheel.scrollBy({
    left: scrollStep,
    behavior: "smooth",
  });
});