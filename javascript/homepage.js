
import {
    getUserDataById
} from '../javascript/firestore.js';

import { loggedInUser, gotoMyAccount, logoutUser, includeHomePageHeader } from "./utilities.js";

const headerElement = document.querySelector('header');
const footerElement = document.querySelector('footer');

let userData;

if (loggedInUser) {
    includeHomePageHeader(setHeader);
    userData = await getUserData(loggedInUser.uid, loggedInUser.userType);
    localStorage.setItem("user", JSON.stringify(userData));
    setDataOnUI();
}

if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('../sw.js')
        .then(registration => {
            console.log('ServiceWorker registration successful with scope: ', registration.scope);
        })
        .catch(error => {
            console.error('ServiceWorker registration failed: ', error);
        });
} else {
    console.log('Service worker is not in the navigator!');
}

function setDataOnUI() {


    const searchInput = document.getElementById('search');
    const searchButton = document.getElementById('searchBtn');

    searchButton.addEventListener('click', (event) => {
        event.preventDefault();
        const query = searchInput.value.trim();
        if (query !== '') {
            let url = `../html/search-result.html?query=${query}`;


            document.body.classList.toggle("searchactive");
            console.log(`url is: ${url}`)
            window.location = url;
        } else {
            alert('Please enter something in the search box!');
        }
    })
}



async function getUserData(userId, userType) {
    return await getUserDataById(userId, userType);
}

function setHeader(data) {
    if (headerElement) {
        headerElement.innerHTML = "";
        headerElement.innerHTML = data;
        const title = document.getElementById('title');
        const myProfileBtn = document.getElementById('myProfile');
        const logoutBtn = document.getElementById('logoutBtn');

        const navSearch = document.getElementById('nav-search');
        const searchCloseBtn = document.getElementById('searchCloseBtn');

        navSearch.addEventListener('click', (event) => {
            event.preventDefault();
            document.body.classList.toggle("search-active");
        })

        searchCloseBtn.addEventListener('click', (event) => {
            console.log("1==========================");
            event.preventDefault();
            document.body.classList.remove("search-active")
            console.log("==========================");
        })

        // title.textContent = `Welcome ${loggedInUser.fName}!`;
        myProfileBtn.addEventListener('click', (event) => {
            event.preventDefault();
            gotoMyAccount();
        })

        logoutBtn.addEventListener('click', (event) => {
            event.preventDefault();
            logoutUser();
        })
    }
}

function setFooter(data) {
    if (footerElement) {
        footerElement.innerHTML = data;
    }
}

document.addEventListener('DOMContentLoaded', function () {

});