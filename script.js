// Smooth scrolling to section anchors
const smoothScroll = function(target, duration) {
  const targetElement = document.querySelector(target);
  const targetPosition = targetElement.getBoundingClientRect().top;
  const startPosition = window.pageYOffset;
  const distance = targetPosition - startPosition;
  let startTime = null;

  const animation = function(currentTime) {
    if (startTime === null) {
      startTime = currentTime;
    }
    const timeElapsed = currentTime - startTime;
    const run = ease(timeElapsed, startPosition, distance, duration);
    window.scrollTo(0, run);
    if (timeElapsed < duration) {
      requestAnimationFrame(animation);
    }
  };

  const ease = function(t, b, c, d) {
    t /= d / 2;
    if (t < 1) return c / 2 * t * t + b;
    t--;
    return -c / 2 * (t * (t - 2) - 1) + b;
  };

  requestAnimationFrame(animation);
};

const links = document.querySelectorAll('nav a');
links.forEach(link => {
  link.addEventListener('click', function(e) {
    e.preventDefault();
    const section = this.getAttribute('href');
    smoothScroll(section, 1000);
  });
});

// Show/hide mobile menu
const menuBtn = document.querySelector('.menu-btn');
const mobileNav = document.querySelector('nav ul');

let menuOpen = false;
menuBtn.addEventListener('click', function() {
  if (!menuOpen) {
    menuBtn.classList.add('open');
    mobileNav.classList.add('open');
    menuOpen = true;
  } else {
    menuBtn.classList.remove('open');
    mobileNav.classList.remove('open');
    menuOpen = false;
  }
});


// Toggle project details
const projectBtns = document.querySelectorAll('.project-btn');
projectBtns.forEach(btn => {
  btn.addEventListener('click', function() {
    const projectDetails = this.nextElementSibling;
    projectDetails.classList.toggle('open');
  });
});
