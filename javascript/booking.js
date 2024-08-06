import { STATUS_PENDING, STATUS_DECLINED, getStatus, STATUS_ACCEPTED, USER_TYPE_ARTIST } from './app-constants.js';
import { getBookingsFromDb, saveBookingInDb, listenForBookingsUpdates } from './firestore.js';
import { loggedInUser, includeHeaderFooter, gotoMyAccount, logoutUser } from "./utilities.js";

// import { bookingPendingTemplate } from '../templates/booking-cards-template.html'


const headerElement = document.querySelector('header');
const footerElement = document.querySelector('footer');

setupHeaderFooter();

let bookings = await getBookings();

const bookingsPendingContainer = document.getElementById('bookings-pending');
const bookingsAcceptedContainer = document.getElementById('bookings-accepted');

showAllBookings(bookings);

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

async function getBookings() {
    return await getBookingsFromDb(loggedInUser.uid, loggedInUser.userType);
}

function showAllBookings(bookings) {
    bookingsPendingContainer.innerHTML = '';
    bookingsAcceptedContainer.innerHTML = '';
    bookings.forEach(booking => {
        if (booking.status === STATUS_PENDING) {
            fetchAndUsePendingTemplate(booking);
            // listenForBookingUpdates(booking.booking_id);
        } else {
            fetchAndUseAcceptedTemplate(booking);
        }
    });
}

listenForBookingsUpdates(loggedInUser.uid, showNotification);

function showNotification(text) {
    new Notification('Booking Update', {
        body: text
    });
    console.log(text);
}

async function fetchAndUsePendingTemplate(pendingBooking) {
    const response = await fetch('../templates/booking-cards-template.html');
    const html = await response.text();

    // Create a temporary element to hold the HTML content
    const temp = document.createElement('div');
    temp.innerHTML = html;


    // Extract the template content
    let bookingPendingTemplate;
    let clone;
    if (loggedInUser.userType == USER_TYPE_ARTIST) {
        bookingPendingTemplate = temp.querySelector('#bookingPendingTemplateArtist');
        clone = document.importNode(bookingPendingTemplate.content, true);

        const acceptBtn = clone.querySelector('#accept-request');
        const declineBtn = clone.querySelector('#decline-request');
        acceptBtn.addEventListener('click', () => {
            pendingBooking.status = STATUS_ACCEPTED;
            updateBookingStatus(pendingBooking);
        });

        declineBtn.addEventListener('click', () => {
            pendingBooking.status = STATUS_DECLINED;
            updateBookingStatus(pendingBooking);
        });
    } else {
        bookingPendingTemplate = temp.querySelector('#bookingPendingTemplateOrganiser');
        clone = document.importNode(bookingPendingTemplate.content, true);
        const bookingItem = clone.querySelector('.pending-body');
        bookingItem.style.cursor = 'pointer';
        bookingItem.addEventListener('click', () => {
            console.log(pendingBooking.artist_id);
            let artistId = pendingBooking.artist_id;
            window.location.href = `../html/artist-portfolio.html?artist_id=${artistId}`;
        });
    }

    const hostName = clone.querySelector('#host-name');
    const eventAddress = clone.querySelector('#event-address');
    const eventDate = clone.querySelector('#event-date');
    const requestOffer = clone.querySelector('#request-offer');
    const requestStatus = clone.querySelector('#request-status');

    if (pendingBooking.host_name) {
        hostName.innerHTML = pendingBooking.host_name;
    }
    eventAddress.innerHTML = pendingBooking.event_address;
    eventDate.innerHTML = pendingBooking.event_date;
    requestOffer.textContent = pendingBooking.offer_price;
    requestStatus.textContent = getStatus(pendingBooking.status);

    bookingsPendingContainer.appendChild(clone);
}

async function updateBookingStatus(pendingBooking) {
    await saveBookingInDb(pendingBooking);
    location.reload();
}

async function fetchAndUseAcceptedTemplate(acceptedBooking) {
    const response = await fetch('../templates/booking-cards-template.html');
    const html = await response.text();

    // Create a temporary element to hold the HTML content
    const temp = document.createElement('div');
    temp.innerHTML = html;

    // Extract the template content
    const bookingAcceptedTemplate = temp.querySelector('#bookingAcceptedTemplate');
    const clone = document.importNode(bookingAcceptedTemplate.content, true);

    const hostName = clone.querySelector('#host-name');
    const eventAddress = clone.querySelector('#event-address');
    const eventDate = clone.querySelector('#event-date');
    const requestOffer = clone.querySelector('#request-offer');
    const requestStatus = clone.querySelector('#request-status');

    if (acceptedBooking.host_name) {
        hostName.innerHTML = acceptedBooking.host_name;
    }
    eventAddress.innerHTML = acceptedBooking.event_address;
    eventDate.innerHTML = acceptedBooking.event_date;
    requestOffer.textContent = acceptedBooking.offer_price;
    requestStatus.textContent = getStatus(acceptedBooking.status);

    bookingsAcceptedContainer.appendChild(clone);
}

function setupHeaderFooter() {
    includeHeaderFooter(setHeader, setFooter);
}

function setHeader(data) {
    if (headerElement) {
        headerElement.innerHTML = data;
        const title = document.getElementById('title');
        const myProfileBtn = document.getElementById('myProfile');
        const logoutBtn = document.getElementById('logoutBtn');
        const search = document.getElementById('search');
        const searchCloseBtn = document.getElementById('searchCloseBtn');

        title.textContent = 'Bookings'
        myProfileBtn.addEventListener('click', (event) => {
            event.preventDefault();
            gotoMyAccount();
        })

        logoutBtn.addEventListener('click', (event) => {
            event.preventDefault();
            logoutUser();
        })


        search.addEventListener('click', (event) => {
            event.preventDefault();
            document.body.classList.toggle("search-active");
            const searchInput = document.getElementById('search-input');
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
        })

        searchCloseBtn.addEventListener('click', (event) => {
            console.log("1==========================");
            event.preventDefault();
            document.body.classList.remove("search-active")
            console.log("==========================");
        })
    }
}

function setFooter(data) {
    if (footerElement) {
        footerElement.innerHTML = data;
    }
}