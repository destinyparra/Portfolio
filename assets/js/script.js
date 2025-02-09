'use strict';




/**
 * add event listener on multiple elements
 */

const addEventOnElements = function (elements, eventType, callback) {
    for (let i = 0, len = elements.length; i < len; i++) {
        elements[i].addEventListener(eventType, callback);
    }
}


/**
 * PRELOADER
 */

// const preloader = document.querySelector("[data-preloader]");

// window.addEventListener("DOMContentLoaded", function () {
//     preloader.classList.add("loaded");
//     document.body.classList.add("loaded");
// });


/**
 * PRELOADER
 */
window.addEventListener("DOMContentLoaded", function () {
    const preloader = document.querySelector("[data-preloader]"); // ✅ Query selector inside event listener
    if (preloader) {  // ✅ Check if preloader exists before using it
        preloader.classList.add("loaded");
    }
    document.body.classList.add("loaded");
});



/**
 * NAVBAR
 * nabar toggle for mobile
 */

const navTogglers = document.querySelectorAll("[data-nav-toggler]");
const navToggleBtn = document.querySelector("[data-nav-toggle-btn]");
const navbar = document.querySelector("[data-navbar]");
const overlay = document.querySelector("[data-overlay]");

const toggleNavbar = function () {
    navbar.classList.toggle("active");
    navToggleBtn.classList.toggle("active");
    overlay.classList.toggle("active");
    document.body.classList.toggle("nav-active");
}

addEventOnElements(navTogglers, "click", toggleNavbar);



/**
 * HEADER
 * header active when window scroll down to 100px
 */

const header = document.querySelector("[data-header]");

window.addEventListener("scroll", function () {
    if (window.scrollY >= 100) {
        header.classList.add("active");
    } else {
        header.classList.remove("active");
    }
});



/**
 * SLIDER
 */

const sliders = document.querySelectorAll("[data-slider]");

const initSlider = function (currentSlider) {

    const sliderContainer = currentSlider.querySelector("[data-slider-container]");
    const sliderPrevBtn = currentSlider.querySelector("[data-slider-prev]");
    const sliderNextBtn = currentSlider.querySelector("[data-slider-next]");

    let totalSliderVisibleItems = Number(getComputedStyle(currentSlider).getPropertyValue("--slider-items"));
    let totalSlidableItems = sliderContainer.childElementCount - totalSliderVisibleItems;

    let currentSlidePos = 0;

    const moveSliderItem = function () {
        sliderContainer.style.transform = `translateX(-${sliderContainer.children[currentSlidePos].offsetLeft}px)`;
    }

    /**
     * NEXT SLIDE
     */
    const slideNext = function () {
        const slideEnd = currentSlidePos >= totalSlidableItems;

        if (slideEnd) {
            currentSlidePos = 0;
        } else {
            currentSlidePos++;
        }

        moveSliderItem();
    }

    sliderNextBtn.addEventListener("click", slideNext);


    /**
     * PREVIOUS SLIDE
     */
    const slidePrev = function () {
        if (currentSlidePos <= 0) {
            currentSlidePos = totalSlidableItems;
        } else {
            currentSlidePos--;
        }

        moveSliderItem();
    }
    sliderPrevBtn.addEventListener("click", slidePrev);

    const dontHaveExtraItem = totalSlidableItems <= 0;
    if (dontHaveExtraItem) {
        sliderNextBtn.style.display = 'none';
        sliderPrevBtn.style.display = 'none';
    }

    /**
     * slide with [shift + mouse wheel]
     * not working on chrome
     */

    currentSlider.addEventListener("wheel", function (event) {
        if (event.shiftKey && event.deltaY > 0) slideNext();
        if (event.shiftKey && event.deltaY < 0) slidePrev();
    });

    /**
     * RESPONSIVE
     */

    window.addEventListener("resize", function () {
        totalSliderVisibleItems = Number(getComputedStyle(currentSlider).getPropertyValue
            ("--slider-items"));
        totalSlidableItems = sliderContainer.childElementCount - totalSliderVisibleItems;

        moveSliderItem();
    })
}



for (let i = 0, len = sliders.length; i < len; i++) { initSlider(sliders[i]); }



// For the hearts 
let loveCounts = {
    pspsps: 0,
    pat: 0,
    sss: 0,
};

function sendLove(type) {
    // Increment the counter
    loveCounts[type]++;
    document.getElementById(`${type}-counter`).textContent = `${loveCounts[type]} ${type}`;

    // Create the heart element
    const heart = document.createElement('span');
    heart.classList.add('heart');
    heart.textContent = '❤️';

    // Append heart to the button
    const button = document.getElementById(`${type}-button`);
    button.appendChild(heart);

    // Position the heart above the button
    heart.style.position = 'absolute';
    heart.style.left = `${button.offsetWidth / 2 - 10}px`; // Center horizontally
    heart.style.top = `-20px`; // Above the button

    // Remove the heart after animation
    heart.addEventListener('animationend', () => {
        heart.remove();
    });
}




// TYPING PAGE 
// API

const RANDOM_QUOTE_API_URL = 'https://quoteslate.vercel.app/api/quotes/random'; // API URL
const quoteDisplayElement = document.getElementById('quoteDisplay'); // Quote display element
const quoteInputElement = document.getElementById('quoteInput'); // Input field element
const timerElement = document.getElementById('timer'); // Timer element 

let timerStarted = false; // Flag to check if the timer has started
let timerInterval; // Variable to store the timer interval

quoteInputElement.addEventListener('input', () => {
    if (!timerStarted) {
        startTimer(); // Start the timer on the first input
        timerStarted = true; // Set the flag to true
    }

    const arrayQuote = quoteDisplayElement.querySelectorAll('span');
    const arrayValue = quoteInputElement.value.split(''); // Split the input value into an array of characters

    let correct = true;
    arrayQuote.forEach((characterSpan, index) => {
        const character = arrayValue[index]; // Get the character from the input value
        if (character == null) { // If the character has not been typed yet
            characterSpan.classList.remove('correct');
            characterSpan.classList.remove('incorrect');
            correct = false;
        }

        else if (character === characterSpan.innerText) {
            characterSpan.classList.add('correct');
            characterSpan.classList.remove('incorrect');

        } else { // If the character is incorrect
            characterSpan.classList.remove('correct');
            characterSpan.classList.add('incorrect');
            correct = false;
        }
    })
    if (correct) {
        renderNewQuote(); // If the input is correct, get a new quote
        timerStarted = false; // Reset the timer flag for the next quote
    }
}); // Event listener for input field

async function getRandomQuote() {
    try {
        const response = await fetch(RANDOM_QUOTE_API_URL);
        const data = await response.json();
        console.log(data); // Debugging: Check API response structure

        // Ensure correct data extraction based on API response
        return data.quote || data.content || "No quote found";
    } catch (error) {
        console.error("Error fetching quote:", error);
        return "Failed to load quote.";
    }
}

async function renderNewQuote() {
    const quote = await getRandomQuote();
    quoteDisplayElement.innerHTML = ''; // Clear the previous quote
    quote.split('').forEach(character => {
        const characterSpan = document.createElement('span');
        characterSpan.innerText = character;
        quoteDisplayElement.appendChild(characterSpan);
    });

    quoteInputElement.value = null; // Clear the input field
    timerElement.innerText = 0; // Reset the timer display
    clearInterval(timerInterval); // Clear the existing timer interval
}


let startTime; // Start time for timer
function startTimer() {
    startTime = new Date(); // Get the current time
    timerInterval = setInterval(() => {
        timerElement.innerText = getTimerTime();

    }, 1000)
}

function getTimerTime() {
    return Math.floor((new Date() - startTime) / 1000); // Calculate the time elapsed since the start time and round down
}

renderNewQuote();

/**
 * Smooth scroll to section with header offset
 */
function scrollToSection(event, sectionId) {
    event.preventDefault();
    const headerHeight = document.getElementById('header').offsetHeight;
    const section = document.getElementById(sectionId);
    const sectionPosition = section.offsetTop - headerHeight;

    window.scrollTo({
        top: sectionPosition,
        behavior: 'smooth'
    });
}




