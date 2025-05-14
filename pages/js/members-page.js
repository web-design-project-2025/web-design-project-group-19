// Select elements
const prevButton = document.querySelector(".rotation-button-left");
const nextButton = document.querySelector(".rotation-button-right");
const membersWheel = document.querySelector(".popular-members-wheel");

// Adjust this value based on the width of your profile cards
const scrollStep = 300;

// Scroll to the left
prevButton.addEventListener("click", () => {
  membersWheel.scrollBy({
    left: -scrollStep,
    behavior: "smooth",
  });
});

// Scroll to the right
nextButton.addEventListener("click", () => {
  membersWheel.scrollBy({
    left: scrollStep,
    behavior: "smooth",
  });
});