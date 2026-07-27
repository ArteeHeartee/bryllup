const header = document.querySelector("[data-header]");

const menuToggle =
  document.querySelector("[data-menu-toggle]");

const navigation =
  document.querySelector("[data-navigation]");

const navLinks = [
  ...document.querySelectorAll(
    ".main-navigation a"
  )
];

const heroBackground =
  document.querySelector(".hero-background");


/*
  Toppmeny ved scrolling
*/

const updateHeader = () => {
  if (!header) {
    return;
  }

  header.classList.toggle(
    "scrolled",
    window.scrollY > 40
  );
};


/*
  Mobilmeny
*/

const closeMenu = () => {
  if (!menuToggle || !navigation) {
    return;
  }

  menuToggle.setAttribute(
    "aria-expanded",
    "false"
  );

  navigation.classList.remove("open");

  document.body.classList.remove(
    "menu-open"
  );
};


if (menuToggle && navigation) {

  menuToggle.addEventListener(
    "click",
    () => {

      const isOpen =
        menuToggle.getAttribute(
          "aria-expanded"
        ) === "true";

      menuToggle.setAttribute(
        "aria-expanded",
        String(!isOpen)
      );

      navigation.classList.toggle(
        "open",
        !isOpen
      );

      document.body.classList.toggle(
        "menu-open",
        !isOpen
      );

    }
  );

}


navLinks.forEach((link) => {
  link.addEventListener(
    "click",
    closeMenu
  );
});


/*
  Parallax-effekt i hero
*/

window.addEventListener(
  "scroll",
  () => {

    updateHeader();

    if (
      heroBackground &&
      window.innerWidth > 900
    ) {

      const offset = Math.min(
        window.scrollY * 0.14,
        85
      );

      heroBackground.style.transform =
        `translateY(${offset}px) scale(1.025)`;

    }

  },
  {
    passive: true
  }
);


/*
  Aktivt menypunkt
*/

const sections = [
  ...document.querySelectorAll(
    "main section[id]"
  )
];


if ("IntersectionObserver" in window) {

  const observer =
    new IntersectionObserver(
      (entries) => {

        entries.forEach((entry) => {

          if (!entry.isIntersecting) {
            return;
          }

          navLinks.forEach((link) => {

            const linkTarget =
              link.getAttribute("href");

            const sectionTarget =
              `#${entry.target.id}`;

            link.classList.toggle(
              "active",
              linkTarget === sectionTarget
            );

          });

        });

      },
      {
        rootMargin:
          "-40% 0px -50% 0px",

        threshold: 0
      }
    );


  sections.forEach((section) => {
    observer.observe(section);
  });

}


/*
  Nedtelling til bryllupet

  Dato:
  18. september 2027

  Klokkeslettet er foreløpig satt
  til klokken 13:00 norsk tid.
*/

const countdownElement =
  document.querySelector("[data-countdown]");

const daysElement =
  document.querySelector("[data-days]");

const hoursElement =
  document.querySelector("[data-hours]");

const minutesElement =
  document.querySelector("[data-minutes]");

const secondsElement =
  document.querySelector("[data-seconds]");


const weddingDate =
  new Date("2027-09-18T13:00:00+02:00");


const padNumber = (
  value,
  length = 2
) => {
  return String(value).padStart(
    length,
    "0"
  );
};


const updateCountdown = () => {

  if (
    !countdownElement ||
    !daysElement ||
    !hoursElement ||
    !minutesElement ||
    !secondsElement
  ) {
    return;
  }


  const now = new Date();

  const distance =
    weddingDate.getTime() -
    now.getTime();


  if (distance <= 0) {

    daysElement.textContent = "000";
    hoursElement.textContent = "00";
    minutesElement.textContent = "00";
    secondsElement.textContent = "00";

    return;
  }


  const totalSeconds =
    Math.floor(distance / 1000);


  const days =
    Math.floor(
      totalSeconds /
      (60 * 60 * 24)
    );


  const hours =
    Math.floor(
      (
        totalSeconds %
        (60 * 60 * 24)
      ) /
      (60 * 60)
    );


  const minutes =
    Math.floor(
      (
        totalSeconds %
        (60 * 60)
      ) /
      60
    );


  const seconds =
    totalSeconds % 60;


  daysElement.textContent =
    padNumber(days, 3);

  hoursElement.textContent =
    padNumber(hours);

  minutesElement.textContent =
    padNumber(minutes);

  secondsElement.textContent =
    padNumber(seconds);

};


updateCountdown();


setInterval(
  updateCountdown,
  1000
);


/*
  Første oppdatering av header
*/

updateHeader();
