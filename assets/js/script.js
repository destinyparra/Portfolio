'use strict';


/**
 * add event listener on multiple elements
 */

const addEventListener = function (elements, eventType, callback) {
    for (let i = 0, len = elements.length; i < len; i++) {
        elements[i].addEventListener(eventType, callback);
    }
}





/**
 * PRELOADER
 */

const preloader = document.querySelector("[data-preloader]");

window.addEventListener("DOMContentLoaded", function () {
    preloader.classList.add("loaded");
    document.body.classList.add("loaded");
});





/**
 * NAVBAR
 * nabar toggle for mobile
 */

const navTogglers = document.querySelectorAll("[data-nav-toggler]");
const navToggleBtn = document.querySelector("[data-nav-toggle-btn]");
const navBar = document.querySelector("[data-navbar]");
const overlay = document.querySelector("[data-overlay]");


const toggleNavbar = function () {
    navBar.classList.toggle("active");
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


window.addEventListener("scroll", function* () {
    if (this.window.scrollY >= 100) {
        header.classList.add("active");
    } else {
        header.classList.remove("active");
    }
});