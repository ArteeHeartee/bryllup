const weddingDate = new Date("2027-09-18T00:00:00+02:00");

const daysElement = document.getElementById("days");
const hoursElement = document.getElementById("hours");
const minutesElement = document.getElementById("minutes");
const secondsElement = document.getElementById("seconds");

function updateCountdown() {
  const now = new Date();
  const timeRemaining = weddingDate - now;

  if (timeRemaining <= 0) {
    daysElement.textContent = "0";
    hoursElement.textContent = "0";
    minutesElement.textContent = "0";
    secondsElement.textContent = "0";
    return;
  }

  const days = Math.floor(timeRemaining / (1000 * 60 * 60 * 24));
  const hours = Math.floor(
    (timeRemaining / (1000 * 60 * 60)) % 24
  );
  const minutes = Math.floor(
    (timeRemaining / (1000 * 60)) % 60
  );
  const seconds = Math.floor(
    (timeRemaining / 1000) % 60
  );

  daysElement.textContent = days;
  hoursElement.textContent = hours.toString().padStart(2, "0");
  minutesElement.textContent = minutes.toString().padStart(2, "0");
  secondsElement.textContent = seconds.toString().padStart(2, "0");
}

updateCountdown();
setInterval(updateCountdown, 1000);

const menuButton = document.querySelector(".menu-button");
const navLinks = document.querySelector(".nav-links");
const navigationLinks = document.querySelectorAll(".nav-links a");

function closeMenu() {
  navLinks.classList.remove("open");
  document.body.classList.remove("menu-open");
  menuButton.setAttribute("aria-expanded", "false");
  menuButton.textContent = "☰";
}

menuButton.addEventListener("click", () => {
  const menuIsOpen = navLinks.classList.toggle("open");

  document.body.classList.toggle("menu-open", menuIsOpen);
  menuButton.setAttribute("aria-expanded", menuIsOpen.toString());
  menuButton.textContent = menuIsOpen ? "×" : "☰";
});

navigationLinks.forEach((link) => {
  link.addEventListener("click", closeMenu);
});

window.addEventListener("resize", () => {
  if (window.innerWidth > 900) {
    closeMenu();
  }
});
