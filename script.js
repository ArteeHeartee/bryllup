const header = document.querySelector("[data-header]");
const menuToggle = document.querySelector("[data-menu-toggle]");
const navigation = document.querySelector("[data-navigation]");
const navLinks = [...document.querySelectorAll(".main-navigation a")];
const heroBackground = document.querySelector(".hero-background");

// Header ved scrolling
const updateHeader = () => {
    if (window.scrollY > 40) {
        header.classList.add("scrolled");
    } else {
        header.classList.remove("scrolled");
    }
};

updateHeader();
window.addEventListener("scroll", updateHeader);

// Mobilmeny
if (menuToggle) {
    menuToggle.addEventListener("click", () => {
        const isOpen =
            menuToggle.getAttribute("aria-expanded") === "true";

        menuToggle.setAttribute("aria-expanded", !isOpen);
        navigation.classList.toggle("open");
        document.body.classList.toggle("menu-open");
    });
}

// Lukk meny når man klikker på et menypunkt
navLinks.forEach(link => {
    link.addEventListener("click", () => {
        navigation.classList.remove("open");
        document.body.classList.remove("menu-open");
        menuToggle.setAttribute("aria-expanded", "false");
    });
});

// Aktiv meny basert på seksjon
const sections = document.querySelectorAll("section[id]");

const observer = new IntersectionObserver(
    entries => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;

            navLinks.forEach(link => {
                link.classList.remove("active");

                if (
                    link.getAttribute("href") ===
                    "#" + entry.target.id
                ) {
                    link.classList.add("active");
                }
            });
        });
    },
    {
        rootMargin: "-40% 0px -50% 0px"
    }
);

sections.forEach(section => observer.observe(section));

// Myk parallax på hero-bildet
window.addEventListener(
    "scroll",
    () => {
        if (!heroBackground) return;

        const offset = Math.min(window.scrollY * 0.16, 90);

        heroBackground.style.transform =
            `translateY(${offset}px) scale(1.025)`;
    },
    {
        passive: true
    }
);
