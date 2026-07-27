// =====================================
// NEDTELLING
// =====================================

const weddingDate = new Date("2027-09-18T00:00:00+02:00");

const daysElement = document.getElementById("days");
const hoursElement = document.getElementById("hours");
const minutesElement = document.getElementById("minutes");
const secondsElement = document.getElementById("seconds");

function updateCountdown() {
    const now = new Date();
    const difference = weddingDate - now;

    if (difference <= 0) {
        daysElement.textContent = "0";
        hoursElement.textContent = "00";
        minutesElement.textContent = "00";
        secondsElement.textContent = "00";
        return;
    }

    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((difference / (1000 * 60)) % 60);
    const seconds = Math.floor((difference / 1000) % 60);

    daysElement.textContent = days;
    hoursElement.textContent = hours.toString().padStart(2, "0");
    minutesElement.textContent = minutes.toString().padStart(2, "0");
    secondsElement.textContent = seconds.toString().padStart(2, "0");
}

updateCountdown();
setInterval(updateCountdown, 1000);


// =====================================
// NAVBAR
// =====================================

const navbar = document.querySelector(".navbar");

function updateNavbar() {
    if (window.scrollY > 60) {
        navbar.classList.add("scrolled");
    } else {
        navbar.classList.remove("scrolled");
    }
}

updateNavbar();
window.addEventListener("scroll", updateNavbar);


// =====================================
// MOBILMENY
// =====================================

const menuButton = document.querySelector(".menu-button");
const navLinks = document.querySelector(".nav-links");

menuButton.addEventListener("click", () => {

    navLinks.classList.toggle("open");

    document.body.classList.toggle("menu-open");

    const open = navLinks.classList.contains("open");

    menuButton.setAttribute("aria-expanded", open);

    menuButton.textContent = open ? "✕" : "☰";
});


// Lukk meny når man klikker på en lenke

document.querySelectorAll(".nav-links a").forEach(link => {

    link.addEventListener("click", () => {

        navLinks.classList.remove("open");

        document.body.classList.remove("menu-open");

        menuButton.textContent = "☰";

        menuButton.setAttribute("aria-expanded", "false");

    });

});


// =====================================
// AKTIV MENY
// =====================================

const sections = document.querySelectorAll("section");

const menuItems = document.querySelectorAll(".nav-links a");

window.addEventListener("scroll", () => {

    let current = "";

    sections.forEach(section => {

        const top = section.offsetTop - 120;

        if (pageYOffset >= top) {
            current = section.getAttribute("id");
        }

    });

    menuItems.forEach(item => {

        item.classList.remove("active");

        if (item.getAttribute("href") === "#" + current) {
            item.classList.add("active");
        }

    });

});
