'use strict';

const btnScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');
const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');

const tabs = document.querySelectorAll('.operations__tab');
const tabsContainer = document.querySelector('.operations__tab-container');
const tabsContent = document.querySelectorAll('.operations__content');

const nav = document.querySelector('.nav');
///////////////////////////////////////
// Modal window

const openModal = function (e) {
  e.preventDefault();

  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

btnsOpenModal.forEach(btn => btn.addEventListener('click', openModal));

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

/////////////////////////////////////////////////
// Button scrolling

btnScrollTo.addEventListener('click', function (e) {
  section1.scrollIntoView({ behavior: 'smooth' });
});

/////////////////////////////////////////////////
// page navigation

// this is not a clean solution and it is  unefficient because we are adding the function to each element of nav__link, and if we have like a 10,000 element then we would be creating 10,000 copies of the function which would impact the performence:

// document.querySelectorAll('.nav__link').forEach(function (el) {
//   el.addEventListener('click', function (e) {
//     e.preventDefault();
//     const id = this.getAttribute('href');
//     console.log(id);
//     document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
//   });
// });

// the better solution is to use event delegation:by putting the event listener on a common perent of all the elements we are interested in:

// 1. add event listener to common parent element
// 2. determine what element originated the event
document.querySelector('.nav__links').addEventListener('click', function (e) {
  e.preventDefault();

  // matching strategy
  if (e.target.classList.contains('nav__link')) {
    const id = e.target.getAttribute('href');
    console.log(id);
    document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
  }
});
// event delegation is extremly usefull for elements that do not exist the first time we load a page and are dynamically created with JS code

// Tabbed component
tabsContainer.addEventListener('click', function (e) {
  const clicked = e.target.closest('.operations__tab'); // it will allow us to select the button either if we clicked on the span element or the button itself, because it will always give us the closest element with the "operations__content" class
  console.log(clicked);

  // Guard Clause: immidiatelly finish the function when we have null if we clicked the areas between the buttons
  if (!clicked) return;

  // remove active classes
  tabs.forEach(t => t.classList.remove('operations__tab--active'));
  tabsContent.forEach(c => c.classList.remove('operations__content--active'));

  // activate tab
  clicked.classList.add('operations__tab--active');

  // activate content area
  document.querySelector(`.operations__content--${clicked.dataset.tab}`).classList.add('operations__content--active');
});

// menu fade animation
const handleHover = function (e) {
  if (e.target.classList.contains('nav__link')) {
    const link = e.target;
    const siblings = link.closest('.nav').querySelectorAll('.nav__link');
    const logo = link.closest('.nav').querySelector('img');

    siblings.forEach(el => {
      if (el !== link) el.style.opacity = this;
    });
    logo.style.opacity = this;
  }
};

// passing an "argument" into handler
nav.addEventListener('mouseover', handleHover.bind(0.5)); // this will work because bind returns a new function, the value of 0.5 will be replaced by the "this" inside the function
nav.addEventListener('mouseout', handleHover.bind(1));

// sticky navigation
/*
const initialCoords = section1.getBoundingClientRect();

window.addEventListener('scroll', function () {
  console.log(window.scrollY);

  if (window.scrollY > initialCoords.top) nav.classList.add('sticky');
  else nav.classList.remove('sticky');
});
*/

// sticky navigation: intersction observer API

/*
example: 

const obsCallback = function (entries, observer) {
  entries.forEach(entry => {
    console.log(entry);
  });
}; // this callback function will get called each time that the observed element is intersecting with the root element at the threshold that we defined. For the first example whenever the target (sections1) is intersecting with the root (the entire viewport) at a threshold of 10% this will function will be called

const obsOptions = {
  root: null, // the element that is the target (section1) is intersecting with; in this case it is "null" which represents the entire viewport
  threshold: [0, 0.2], // the percentage of intersection at which the observer callback will be called. it is possible to have multiple thresholds and store them in an array

  // the first value "0" means that the callback will trigger each time that the target element moves completely out f the view and also as soon as it enters the view (will be called when moving into the view and moving out of the view). same thing for the 20% (0.2)
};

const observer = new IntersectionObserver(obsCallback, obsOptions);
observer.observe(section1);
*/

const header = document.querySelector('.header');
const navHeight = nav.getBoundingClientRect().height;

const stickyNav = function (entries) {
  const [entry] = entries;
  // console.log(entry);

  if (!entry.isIntersecting) nav.classList.add('sticky');
  else nav.classList.remove('sticky');
};

const headerObserver = new IntersectionObserver(stickyNav, {
  root: null,
  threshold: 0,
  rootMargin: `-${navHeight}px`, // a box of 90 pixels that will be applied outside of our target element (header) a hieght of the header
});
headerObserver.observe(header);

// Reveal Sections
const allSections = document.querySelectorAll('.section');

const revealSection = function (entries, observer) {
  const [entry] = entries;
  // console.log(entry);
  if (!entry.isIntersecting) return;

  entry.target.classList.remove('section--hidden');
  observer.unobserve(entry.target);
};

const sectionObserver = new IntersectionObserver(revealSection, {
  root: null,
  threshold: 0.15,
});

allSections.forEach(function (section) {
  sectionObserver.observe(section);
  // section.classList.add('section--hidden');
});

// lazy loading images
const imgTargets = document.querySelectorAll('img[data-src]');

const loadImg = function (entries, observer) {
  const [entry] = entries;

  if (!entry.isIntersecting) return;

  // Replace src with data-src
  entry.target.src = entry.target.dataset.src;

  entry.target.addEventListener('load', function () {
    // remove the blured filter
    entry.target.classList.remove('lazy-img');
  });

  observer.unobserve(entry.target);
};

const imgObserver = new IntersectionObserver(loadImg, {
  root: null,
  threshold: 0,
  rootMargin: '200px',
});

imgTargets.forEach(img => imgObserver.observe(img));

// slider

const slider = function () {
  const slides = document.querySelectorAll('.slide');
  const btnLeft = document.querySelector('.slider__btn--left');
  const btnRight = document.querySelector('.slider__btn--right');
  const dotContainer = document.querySelector('.dots');

  let curSlide = 0;
  const maxSlide = slides.length;

  // functions
  const createDots = function () {
    slides.forEach(function (_, i) {
      dotContainer.insertAdjacentHTML('beforeend', `<button class = "dots__dot" data-slide="${i}"></button>`);
    });
  };

  const activateDot = function (slide) {
    document.querySelectorAll('.dots__dot').forEach(dot => dot.classList.remove('dots__dot--active'));

    document.querySelector(`.dots__dot[data-slide="${slide}"]`).classList.add('dots__dot--active');
  };

  const goToSlide = function (slide) {
    slides.forEach((s, i) => (s.style.transform = `translateX(${100 * (i - slide)}%)`));
  };

  // Next slide
  const nextSlide = function () {
    if (curSlide == maxSlide - 1) {
      curSlide = 0;
    } else {
      curSlide++;
    }

    goToSlide(curSlide);
    // curSlide = 1: -100%, 0%, 100%, 200%

    activateDot(curSlide);
  };

  // Previous slide
  const prevSlide = function () {
    if (curSlide === 0) {
      curSlide = maxSlide - 1;
    } else {
      curSlide--;
    }

    goToSlide(curSlide);
    // curSlide = 1: -100%, 0%, 100%, 200%

    activateDot(curSlide);
  };

  const init = function () {
    goToSlide(0);
    createDots();
    activateDot(0);
  };
  init();

  // event handlers
  btnRight.addEventListener('click', nextSlide);
  btnLeft.addEventListener('click', prevSlide);

  document.addEventListener('keydown', function (e) {
    console.log(e);
    if (e.key == 'ArrowLeft') prevSlide();
    e.key === 'ArrowRight' && nextSlide(); // the right button but with the short cicruiting method instead of the if()
  });

  dotContainer.addEventListener('click', function (e) {
    if (e.target.classList.contains('dots__dot')) {
      const { slide } = e.target.dataset;
      goToSlide(slide);

      activateDot(slide);
    }
  });
};
slider();
/////////////////////////////////////////////////
/////////////////////////////////////////////////
/////////////////////////////////////////////////

// Selecting elements

/*
console.log(document.documentElement); // selecting the entire html document: if we want to apply a specific css style to the entire page we always have to use"documentElement"
console.log(document.head); // selecting the head of the html document
console.log(document.body); // selecting the body

const header = document.querySelector('.header'); // selecting the frist header element
const allSections = document.querySelectorAll('.section'); // selecting all the section elements and store them in a nodeList
console.log(allSections);

document.getElementById('section--1');

const allButtons = document.getElementsByTagName('button'); // selecting all the button elements and store them in an HTMLCollection (also called a life-collection), which means if the DOM changes then this collection will change automatically (which is not the case for the previous nodeList), which helps with deleting element from the DOM programmatically not just manually by using this Collection
console.log(allButtons);

console.log(document.getElementsByClassName('btn')); // also returns a life HTMLCollection like getElementsByTagName

// Creating and inserting elements

const message = document.createElement('div'); // create and store a DOM element
message.classList.add('cookie-message');
// message.textContent = 'We use cookies for improved functionality and analytics.';
message.innerHTML = 'We use cookies for improved functionality and analytics. <button class = "btn btn--close-cookie"> Got It! </button>';

header.prepend(message); // prepend adds an element as a FIRST child
header.append(message); // append adds an element as a LAST child (but in this case it just moved it because it was already inserted by the prepend method)

// the message is inserted once because its a live HTML element living in the DOM that's why it can't be in multiple places at the same time
// we can use the prepend and append methods not only to insert elements but also to move them

// if we want to add more than one copy of an element we need to clone it first with cloneNode(true)
// header.append(message.cloneNode(true));

// header.before(message); // .before adds the element BEFORE the header (or the elment we are working on) which makes the elements siblings
header.after(message); // .after adds the element AFTER the header (or the elment we are working on) which makes the elements siblings

// Delete elements
document.querySelector('.btn--close-cookie').addEventListener('click', function () {
  message.remove();
  // message.parentElement.removeChild(message); // this is the old way to remove an element (using DOM traversing)
});

// Styles
message.style.backgroundColor = '#37383d';
message.style.width = '120%';

console.log(message.style.height); // it won't work because it is not an inline that we set ourselves, so it only works for inline styles that we set their values ourselves
console.log(message.style.backgroundColor); // we get a value because we set manually the value of the style outselves above
console.log(message.style.width); // we get a value because we set manually the value of the style outselves above
console.log(getComputedStyle(message).color); // we can get the value of a style we haven't manually set by using the getComputedStyle method
console.log(getComputedStyle(message).height); // it will give 50px

message.style.height = Number.parseFloat(getComputedStyle(message).height, 10) + 30 + 'px'; // we used parseFloat because the getComputed returns string that we need to convert it to a float in order to add it to the value 30 (the "10" is to precise the base of the float)
console.log(getComputedStyle(message).height); // it will give 80px

document.documentElement.style.setProperty('--color-primary', 'orangered'); // change the value of a property that was set in the style file using its name and the new value

// Attributes
const logo = document.querySelector('.nav__logo');
// we can access ONLY standard properties on that object (for example for images we have alt and src), and if we try to create a new property and then call it, it won't work
console.log(logo.alt);
console.log(logo.className);

// Non-standard properties
console.log(logo.designer);
// we can use the getAttribute to get the non-standard properties of elements like the example bellow:
console.log(logo.getAttribute('designer'));

// we can set the attributes
logo.alt = 'Beautiful minimalist logo';

// we can create new attributes from JS using setAttribute
logo.setAttribute('company', 'Bankist');

console.log(logo.src); // this will return the absolute version of the image path
console.log(logo.getAttribute('src')); // we can use the getAttribute to get the relative version of an image or a link path
const link = document.querySelector('.nav__link--btn');
console.log(link.href);
console.log(link.getAttribute('href'));

// Data attributes: they have to start with the word "data"
console.log(logo.dataset.versionNumber); // we need to transform the attribute into KAMEL case: version-number ---> versionNumber

// Classes
logo.classList.add('c', 'j');
logo.classList.remove('c', 'j');
logo.classList.toggle('c');
logo.classList.contains('c'); // not "includes" like it is called in arrays

// don't use this because it will overide all the existent classes, and allow us to put only 1 class on an element
logo.className = 'jonas';
*/

/////////////////////////////////////////////////

// adding smooth transition to a section of the page
/*
const btnScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');

btnScrollTo.addEventListener('click', function (e) {
  // the old way: manually calculating the offset and the scroll position

  // const s1coords = section1.getBoundingClientRect(); // gets the position (coordinates) of the element
  // console.log(s1coords); // DOMRect {x: , y: , width: , height: , top...}, the x is mesured from the left and the y is mesured from the top

  // console.log(e.target.getBoundingClientRect()); // the e.target used to refere to the current element we clicked

  // console.log('Current scroll (X/Y)', window.pageXOffset, window.pageYOffset); // get how much we scrolled from the top and the left

  // console.log('height/width viewport', document.documentElement.clientHeight, document.documentElement.clientWidth);

  // Scrolling
  // window.scrollTo(s1coords.left + window.pageXOffset, s1coords.top + window.pageYOffset); // we added the + window.pag.... to determine the absolute position of the element relative to the document (the entire page)

  // window.scrollTo({ left: s1coords.left + window.pageXOffset, top: s1coords.top + window.pageYOffset, behavior: 'smooth' }); // add a smooth transition by making it in an object and adding " behavior: 'smooth' "

  // the modern way: using the scrollIntoView method
  section1.scrollIntoView({ behavior: 'smooth' });
});

const h1 = document.querySelector('h1');

const alertH1 = function (e) {
  alert('addEventListener: Great! You are reading the heading :D');

  // h1.removeEventListener('mouseenter', alertH1); // this makes it that we only listen for the event once
};

// mouseenter works like a hover in css, it fires up when the mouse enters a certain element
h1.addEventListener('mouseenter', alertH1);

setTimeout(() => h1.removeEventListener('mouseenter', alertH1), 3000); // remove the eventListener after 3 seconds

// h1.onmouseenter = function (e) {
//   alert('addEventListener: Great! You are reading the heading :D');
// };
*/

/////////////////////////////////////////////////

// Event propagation practice
/*
// rgb(255,255,255)
const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1) + min);
const randomColor = () => `rgb(${randomInt(0, 255)}, ${randomInt(0, 255)}, ${randomInt(0, 255)})`;
console.log(randomColor());

document.querySelector('.nav__link').addEventListener('click', function (e) {
  this.style.backgroundColor = randomColor();
  console.log('LINK', e.target, e.currentTarget);

  // Stop propagation
  // e.stopPropagation();
});

document.querySelector('.nav__links').addEventListener('click', function (e) {
  this.style.backgroundColor = randomColor();
  console.log('CONTAINER', e.target, e.currentTarget);
});

document.querySelector('.nav').addEventListener('click', function (e) {
  this.style.backgroundColor = randomColor();
  console.log('NAV', e.target, e.currentTarget);
});
*/

/////////////////////////////////////////////////

// DOM traversing
/*
const h1 = document.querySelector('h1');

// going downwards: selecting child
console.log(h1.querySelectorAll('.highlight'));
console.log(h1.childNodes);
console.log(h1.children);
h1.firstElementChild.style.color = 'white';
h1.lastElementChild.style.color = 'orangered';

// going upwards: selecting parents
console.log(h1.parentNode);
console.log(h1.parentElement);

// the method closest works almost as an opposite to querysSelector; both receive a query string as an input, querySelector finds children no matter how deep is the Dom tree, while the closest method finds parents no matter how far up the Dom tree
h1.closest('.header').style.background = 'var(--gradient-secondary)';
h1.closest('h1').style.background = 'var(--gradient-primary)';

// going sideways: selecting siblings
console.log(h1.previousElementSibling); // null because it doesn't have a previous sibling
console.log(h1.nextElementSibling);

console.log(h1.previousSibling);
console.log(h1.nextSibling);

console.log(h1.parentElement.children); // get all of the siblings including h1 itself
[...h1.parentElement.children].forEach(function (el) {
  if (el !== h1) el.style.transform = 'scale(0.5)';
});
*/

document.addEventListener('DOMContentLoaded', function (e) {
  console.log('HTML parsed and DOM tree built', e);
});

window.addEventListener('load', function (e) {
  console.log('Page fully loaded', e);
});

// this doesn't work for Opera browser, but it works for the Chrome
window.addEventListener('beforeunload', function (e) {
  e.preventDefault();
  console.log(e);
  e.returnValue = '';
});
