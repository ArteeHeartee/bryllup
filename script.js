const body = document.body;

const header =
  document.querySelector("[data-header]");

const openInvitationButton =
  document.querySelector("[data-open-invitation]");

const reopenInvitationButton =
  document.querySelector("[data-reopen-invitation]");

const menuToggle =
  document.querySelector("[data-menu-toggle]");

const navigation =
  document.querySelector("[data-navigation]");

const navLinks = [
  ...document.querySelectorAll(
    ".main-navigation a"
  )
];


/*
  Åpning og lukking av invitasjonen
*/

const openInvitation = () => {

  body.classList.remove(
    "invitation-closed"
  );

  body.classList.add(
    "invitation-open"
  );

  sessionStorage.setItem(
    "weddingInvitationOpened",
    "true"
  );

};


const closeInvitation = () => {

  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });


  setTimeout(() => {

    body.classList.remove(
      "invitation-open"
    );

    body.classList.add(
      "invitation-closed"
    );

    sessionStorage.removeItem(
      "weddingInvitationOpened"
    );

  }, 350);

};


if (openInvitationButton) {

  openInvitationButton.addEventListener(
    "click",
    openInvitation
  );

}


if (reopenInvitationButton) {

  reopenInvitationButton.addEventListener(
    "click",
    closeInvitation
  );

}


/*
  Beholder invitasjonen åpen dersom
  gjesten allerede har åpnet den
  i samme nettleserøkt.
*/

const hasOpenedInvitation =
  sessionStorage.getItem(
    "weddingInvitationOpened"
  ) === "true";


if (hasOpenedInvitation) {

  body.classList.remove(
    "invitation-closed"
  );

  body.classList.add(
    "invitation-open"
  );

}


/*
  Header
*/

const updateHeader = () => {

  if (!header) {
    return;
  }

  header.classList.toggle(
    "scrolled",
    window.scrollY > 35
  );

};


window.addEventListener(
  "scroll",
  updateHeader,
  {
    passive: true
  }
);


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

  navigation.classList.remove(
    "open"
  );

  body.classList.remove(
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

      body.classList.toggle(
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
  Aktivt menypunkt
*/

const navigationSections = [
  ...document.querySelectorAll(
    "main section[id]"
  )
];


if ("IntersectionObserver" in window) {

  const sectionObserver =
    new IntersectionObserver(
      (entries) => {

        entries.forEach((entry) => {

          if (!entry.isIntersecting) {
            return;
          }

          navLinks.forEach((link) => {

            const isActive =
              link.getAttribute("href") ===
              `#${entry.target.id}`;

            link.classList.toggle(
              "active",
              isActive
            );

          });

        });

      },
      {
        rootMargin:
          "-38% 0px -54% 0px",

        threshold: 0
      }
    );


  navigationSections.forEach(
    (section) => {
      sectionObserver.observe(section);
    }
  );

}


/*
  Nedtelling til bryllupet

  Foreløpig tidspunkt:
  18. september 2027 klokken 13:00.
*/

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
  number,
  length = 2
) => {

  return String(number).padStart(
    length,
    "0"
  );

};


const updateCountdown = () => {

  if (
    !daysElement ||
    !hoursElement ||
    !minutesElement ||
    !secondsElement
  ) {
    return;
  }


  const difference =
    weddingDate.getTime() -
    Date.now();


  if (difference <= 0) {

    daysElement.textContent = "000";
    hoursElement.textContent = "00";
    minutesElement.textContent = "00";
    secondsElement.textContent = "00";

    return;
  }


  const totalSeconds =
    Math.floor(
      difference / 1000
    );


  const days =
    Math.floor(
      totalSeconds / 86400
    );


  const hours =
    Math.floor(
      (
        totalSeconds %
        86400
      ) /
      3600
    );


  const minutes =
    Math.floor(
      (
        totalSeconds %
        3600
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
  Myke innlastingsanimasjoner
*/

const revealElements = [
  ...document.querySelectorAll(
    ".reveal"
  )
];


if ("IntersectionObserver" in window) {

  const revealObserver =
    new IntersectionObserver(
      (entries, observer) => {

        entries.forEach((entry) => {

          if (!entry.isIntersecting) {
            return;
          }

          entry.target.classList.add(
            "visible"
          );

          observer.unobserve(
            entry.target
          );

        });

      },
      {
        threshold: .14
      }
    );


  revealElements.forEach(
    (element) => {
      revealObserver.observe(element);
    }
  );

} else {

  revealElements.forEach(
    (element) => {
      element.classList.add(
        "visible"
      );
    }
  );

}


updateHeader();
