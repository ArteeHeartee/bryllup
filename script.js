"use strict";


/* --------------------------------------------------
   ELEMENTER
-------------------------------------------------- */

const body = document.body;

const siteHeader = document.querySelector("[data-header]");

const openInvitationButton = document.querySelector(
  "[data-open-invitation]"
);

const reopenInvitationButton = document.querySelector(
  "[data-reopen-invitation]"
);

const menuToggle = document.querySelector(
  "[data-menu-toggle]"
);

const mainNavigation = document.querySelector(
  "[data-navigation]"
);

const navigationLinks = document.querySelectorAll(
  'a[href^="#"]'
);

const quickNavigationLinks = document.querySelectorAll(
  ".quick-navigation a"
);

const pageSections = document.querySelectorAll(
  ".page-section"
);

const revealElements = document.querySelectorAll(
  ".reveal"
);

const openRsvpButton = document.querySelector(
  "[data-open-rsvp]"
);

const rsvpModal = document.querySelector(
  "[data-rsvp-modal]"
);

const closeRsvpButtons = document.querySelectorAll(
  "[data-close-rsvp]"
);

const rsvpForm = document.querySelector(
  "[data-rsvp-form]"
);

const formStatus = document.querySelector(
  "[data-form-status]"
);

const giftLink = document.querySelector(
  "[data-gift-link]"
);


/* --------------------------------------------------
   HJELPEFUNKSJONER
-------------------------------------------------- */

function elementExists(element) {
  return element !== null;
}


function setBodyState(className, isActive) {
  body.classList.toggle(className, isActive);
}


function getHeaderHeight() {
  if (!elementExists(siteHeader)) {
    return 0;
  }

  return siteHeader.getBoundingClientRect().height;
}


function scrollToSection(sectionId, behavior = "smooth") {
  const target = document.querySelector(sectionId);

  if (!elementExists(target)) {
    return;
  }

  const headerOffset = body.classList.contains(
    "invitation-open"
  )
    ? getHeaderHeight()
    : 0;

  const targetPosition =
    target.getBoundingClientRect().top +
    window.scrollY -
    headerOffset;

  window.scrollTo({
    top: Math.max(targetPosition, 0),
    behavior
  });
}


/* --------------------------------------------------
   INVITASJON
-------------------------------------------------- */

function openInvitation() {
  if (body.classList.contains("invitation-open")) {
    return;
  }

  body.classList.remove("invitation-closed");
  body.classList.add("invitation-open");

  try {
    sessionStorage.setItem(
      "weddingInvitationOpened",
      "true"
    );
  } catch (error) {
    console.warn(
      "Kunne ikke lagre invitasjonsstatus.",
      error
    );
  }

  window.setTimeout(() => {
    body.style.overflow = "";
  }, 1250);
}


function closeInvitation() {
  closeMenu();
  closeRsvpModal();

  body.classList.remove("invitation-open");
  body.classList.add("invitation-closed");

  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });

  try {
    sessionStorage.removeItem(
      "weddingInvitationOpened"
    );
  } catch (error) {
    console.warn(
      "Kunne ikke nullstille invitasjonsstatus.",
      error
    );
  }
}


function restoreInvitationState() {
  let hasOpenedInvitation = false;

  try {
    hasOpenedInvitation =
      sessionStorage.getItem(
        "weddingInvitationOpened"
      ) === "true";
  } catch (error) {
    hasOpenedInvitation = false;
  }

  const hasSectionHash =
    window.location.hash &&
    window.location.hash !== "#invitasjon";

  if (hasOpenedInvitation || hasSectionHash) {
    body.classList.remove("invitation-closed");
    body.classList.add("invitation-open");
  }
}


if (elementExists(openInvitationButton)) {
  openInvitationButton.addEventListener(
    "click",
    openInvitation
  );
}


if (elementExists(reopenInvitationButton)) {
  reopenInvitationButton.addEventListener(
    "click",
    closeInvitation
  );
}


/* --------------------------------------------------
   MENY
-------------------------------------------------- */

function openMenu() {
  if (
    !elementExists(menuToggle) ||
    !elementExists(mainNavigation)
  ) {
    return;
  }

  mainNavigation.classList.add("open");
  menuToggle.setAttribute(
    "aria-expanded",
    "true"
  );
  menuToggle.setAttribute(
    "aria-label",
    "Lukk meny"
  );

  setBodyState("menu-open", true);
}


function closeMenu() {
  if (
    !elementExists(menuToggle) ||
    !elementExists(mainNavigation)
  ) {
    return;
  }

  mainNavigation.classList.remove("open");
  menuToggle.setAttribute(
    "aria-expanded",
    "false"
  );
  menuToggle.setAttribute(
    "aria-label",
    "Åpne meny"
  );

  setBodyState("menu-open", false);
}


function toggleMenu() {
  if (!elementExists(mainNavigation)) {
    return;
  }

  if (mainNavigation.classList.contains("open")) {
    closeMenu();
  } else {
    openMenu();
  }
}


if (elementExists(menuToggle)) {
  menuToggle.addEventListener(
    "click",
    toggleMenu
  );
}


/* --------------------------------------------------
   INTERN NAVIGASJON
-------------------------------------------------- */

navigationLinks.forEach((link) => {
  link.addEventListener("click", (event) => {
    const sectionId = link.getAttribute("href");

    if (
      !sectionId ||
      sectionId === "#" ||
      !sectionId.startsWith("#")
    ) {
      return;
    }

    const target = document.querySelector(sectionId);

    if (!elementExists(target)) {
      return;
    }

    event.preventDefault();

    if (
      !body.classList.contains(
        "invitation-open"
      )
    ) {
      openInvitation();
    }

    closeMenu();

    history.pushState(
      null,
      "",
      sectionId
    );

    window.setTimeout(() => {
      scrollToSection(sectionId);
    }, 70);
  });
});


window.addEventListener("popstate", () => {
  const sectionId =
    window.location.hash || "#invitasjon";

  scrollToSection(sectionId);
});


/* --------------------------------------------------
   AKTIV SEKSJON I NAVIGASJONEN
-------------------------------------------------- */

function updateActiveNavigation(sectionId) {
  quickNavigationLinks.forEach((link) => {
    const isActive =
      link.getAttribute("href") === sectionId;

    link.classList.toggle(
      "active",
      isActive
    );

    if (isActive) {
      link.setAttribute(
        "aria-current",
        "page"
      );
    } else {
      link.removeAttribute(
        "aria-current"
      );
    }
  });
}


if (
  "IntersectionObserver" in window &&
  pageSections.length > 0
) {
  const sectionObserver =
    new IntersectionObserver(
      (entries) => {
        const visibleEntries = entries
          .filter((entry) => entry.isIntersecting)
          .sort(
            (first, second) =>
              second.intersectionRatio -
              first.intersectionRatio
          );

        if (visibleEntries.length === 0) {
          return;
        }

        const activeSection =
          visibleEntries[0].target;

        updateActiveNavigation(
          `#${activeSection.id}`
        );
      },
      {
        root: null,
        rootMargin: "-30% 0px -50% 0px",
        threshold: [0.05, 0.25, 0.5]
      }
    );

  pageSections.forEach((section) => {
    sectionObserver.observe(section);
  });
} else {
  updateActiveNavigation(
    window.location.hash || "#invitasjon"
  );
}


/* --------------------------------------------------
   HEADER VED SCROLL
-------------------------------------------------- */

function updateHeaderAppearance() {
  if (!elementExists(siteHeader)) {
    return;
  }

  siteHeader.classList.toggle(
    "scrolled",
    window.scrollY > 20
  );
}


window.addEventListener(
  "scroll",
  updateHeaderAppearance,
  { passive: true }
);


/* --------------------------------------------------
   NEDTELLING
-------------------------------------------------- */

const weddingDate = new Date(
  "2027-09-18T13:30:00+02:00"
);

const countdownDays =
  document.querySelector("[data-days]");

const countdownHours =
  document.querySelector("[data-hours]");

const countdownMinutes =
  document.querySelector("[data-minutes]");

const countdownSeconds =
  document.querySelector("[data-seconds]");


function formatCountdownValue(
  value,
  minimumLength = 2
) {
  return String(value).padStart(
    minimumLength,
    "0"
  );
}


function updateCountdown() {
  const currentTime = new Date();
  const remainingTime =
    weddingDate.getTime() -
    currentTime.getTime();

  if (remainingTime <= 0) {
    if (elementExists(countdownDays)) {
      countdownDays.textContent = "000";
    }

    if (elementExists(countdownHours)) {
      countdownHours.textContent = "00";
    }

    if (elementExists(countdownMinutes)) {
      countdownMinutes.textContent = "00";
    }

    if (elementExists(countdownSeconds)) {
      countdownSeconds.textContent = "00";
    }

    return;
  }

  const totalSeconds = Math.floor(
    remainingTime / 1000
  );

  const days = Math.floor(
    totalSeconds / 86400
  );

  const hours = Math.floor(
    (totalSeconds % 86400) / 3600
  );

  const minutes = Math.floor(
    (totalSeconds % 3600) / 60
  );

  const seconds =
    totalSeconds % 60;

  if (elementExists(countdownDays)) {
    countdownDays.textContent =
      formatCountdownValue(days, 3);
  }

  if (elementExists(countdownHours)) {
    countdownHours.textContent =
      formatCountdownValue(hours);
  }

  if (elementExists(countdownMinutes)) {
    countdownMinutes.textContent =
      formatCountdownValue(minutes);
  }

  if (elementExists(countdownSeconds)) {
    countdownSeconds.textContent =
      formatCountdownValue(seconds);
  }
}


updateCountdown();

window.setInterval(
  updateCountdown,
  1000
);


/* --------------------------------------------------
   SCROLLANIMASJONER
-------------------------------------------------- */

if (
  "IntersectionObserver" in window &&
  revealElements.length > 0
) {
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
        threshold: 0.15,
        rootMargin: "0px 0px -40px 0px"
      }
    );

  revealElements.forEach((element) => {
    revealObserver.observe(element);
  });
} else {
  revealElements.forEach((element) => {
    element.classList.add("visible");
  });
}


/* --------------------------------------------------
   RSVP-MODAL
-------------------------------------------------- */

let elementFocusedBeforeModal = null;


function getFocusableModalElements() {
  if (!elementExists(rsvpModal)) {
    return [];
  }

  return Array.from(
    rsvpModal.querySelectorAll(
      [
        "button:not([disabled])",
        "input:not([disabled])",
        "textarea:not([disabled])",
        "select:not([disabled])",
        'a[href]:not([aria-disabled="true"])'
      ].join(",")
    )
  ).filter(
    (element) =>
      element.offsetParent !== null
  );
}


function openRsvpModal() {
  if (!elementExists(rsvpModal)) {
    return;
  }

  closeMenu();

  elementFocusedBeforeModal =
    document.activeElement;

  rsvpModal.classList.add("open");
  rsvpModal.setAttribute(
    "aria-hidden",
    "false"
  );

  setBodyState("modal-open", true);

  const focusableElements =
    getFocusableModalElements();

  const firstFormField =
    rsvpModal.querySelector(
      'input:not([type="radio"]), textarea'
    );

  window.setTimeout(() => {
    if (elementExists(firstFormField)) {
      firstFormField.focus();
    } else if (focusableElements.length > 0) {
      focusableElements[0].focus();
    }
  }, 150);
}


function closeRsvpModal() {
  if (!elementExists(rsvpModal)) {
    return;
  }

  rsvpModal.classList.remove("open");
  rsvpModal.setAttribute(
    "aria-hidden",
    "true"
  );

  setBodyState("modal-open", false);

  if (
    elementFocusedBeforeModal instanceof
    HTMLElement
  ) {
    elementFocusedBeforeModal.focus();
  }
}


if (elementExists(openRsvpButton)) {
  openRsvpButton.addEventListener(
    "click",
    openRsvpModal
  );
}


closeRsvpButtons.forEach((button) => {
  button.addEventListener(
    "click",
    closeRsvpModal
  );
});


/* --------------------------------------------------
   TASTATURNAVIGASJON
-------------------------------------------------- */

document.addEventListener(
  "keydown",
  (event) => {
    if (event.key === "Escape") {
      if (
        elementExists(rsvpModal) &&
        rsvpModal.classList.contains("open")
      ) {
        closeRsvpModal();
        return;
      }

      if (
        elementExists(mainNavigation) &&
        mainNavigation.classList.contains(
          "open"
        )
      ) {
        closeMenu();
      }

      return;
    }

    if (
      event.key !== "Tab" ||
      !elementExists(rsvpModal) ||
      !rsvpModal.classList.contains("open")
    ) {
      return;
    }

    const focusableElements =
      getFocusableModalElements();

    if (focusableElements.length === 0) {
      return;
    }

    const firstElement =
      focusableElements[0];

    const lastElement =
      focusableElements[
        focusableElements.length - 1
      ];

    if (
      event.shiftKey &&
      document.activeElement === firstElement
    ) {
      event.preventDefault();
      lastElement.focus();
    } else if (
      !event.shiftKey &&
      document.activeElement === lastElement
    ) {
      event.preventDefault();
      firstElement.focus();
    }
  }
);


/* --------------------------------------------------
   RSVP-SKJEMA
-------------------------------------------------- */

function createRsvpSummary(formData) {
  return {
    participantCount:
      formData.get("participantCount"),

    participantNames:
      formData.get("participantNames"),

    phone:
      formData.get("phone"),

    email:
      formData.get("email"),

    allergies:
      formData.get("allergies"),

    dietaryPreferences:
      formData.get(
        "dietaryPreferences"
      ),

    alcoholFree:
      formData.get("alcoholFree"),

    additionalInformation:
      formData.get(
        "additionalInformation"
      ),

    submittedAt:
      new Date().toISOString()
  };
}


if (elementExists(rsvpForm)) {
  rsvpForm.addEventListener(
    "submit",
    (event) => {
      event.preventDefault();

      if (!rsvpForm.checkValidity()) {
        rsvpForm.reportValidity();
        return;
      }

      const submitButton =
        rsvpForm.querySelector(
          'button[type="submit"]'
        );

      const formData =
        new FormData(rsvpForm);

      const rsvpSummary =
        createRsvpSummary(formData);

      if (elementExists(submitButton)) {
        submitButton.disabled = true;
        submitButton.textContent =
          "Behandler svar";
      }

      if (elementExists(formStatus)) {
        formStatus.textContent = "";
      }

      /*
        Foreløpig lagres svaret bare lokalt i
        nettleseren. Når dere velger løsning for
        mottak av svar, kan denne delen kobles til
        for eksempel Google Apps Script, Formspree
        eller en egen database.
      */

      window.setTimeout(() => {
        try {
          localStorage.setItem(
            "weddingRsvpDraft",
            JSON.stringify(rsvpSummary)
          );
        } catch (error) {
          console.warn(
            "Kunne ikke lagre RSVP lokalt.",
            error
          );
        }

        if (elementExists(formStatus)) {
          formStatus.textContent =
            "Opplysningene er registrert i denne nettleseren. Skjemaet må kobles til en mottaksløsning før publisering.";
        }

        if (elementExists(submitButton)) {
          submitButton.disabled = false;
          submitButton.textContent =
            "Send svar";
        }
      }, 650);
    }
  );
}


/* --------------------------------------------------
   GAVEØNSKER
-------------------------------------------------- */

if (elementExists(giftLink)) {
  giftLink.addEventListener(
    "click",
    (event) => {
      if (
        giftLink.getAttribute(
          "aria-disabled"
        ) === "true"
      ) {
        event.preventDefault();
      }
    }
  );
}


/* --------------------------------------------------
   OPPSTART
-------------------------------------------------- */

function initializeWebsite() {
  restoreInvitationState();
  updateHeaderAppearance();

  const currentSection =
    window.location.hash || "#invitasjon";

  updateActiveNavigation(
    currentSection
  );

  window.setTimeout(() => {
    if (
      window.location.hash &&
      body.classList.contains(
        "invitation-open"
      )
    ) {
      scrollToSection(
        window.location.hash,
        "auto"
      );
    }
  }, 60);
}


initializeWebsite();
