import { loggedInUser, includeHeaderFooter, gotoMyAccount, logoutUser } from "./utilities.js";

import { uploadProfileImage } from "./firebase-storage.js";
import { saveUserDataInDb, getUserDataById } from "./firestore.js";


const headerElement = document.querySelector('header');
const footerElement = document.querySelector('footer');
setupHeaderFooter();

const editBtn = document.getElementById('editProfile');
const name = document.getElementById('name');
const profilePic = document.getElementById('profile-image');
const summary = document.getElementById('summary');
const role = document.getElementById('role');
const phone = document.getElementById('phone');
const address = document.getElementById('address');

setUserDataOnUI();

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

async function setUserDataOnUI() {
    const user = await getUserDataById(loggedInUser.uid, loggedInUser.userType);

    if (user) {
        if (user.profile_image) {
            profilePic.src = user.profile_image;
        }
        if (user.fName) {
            if (user.lName) {
                name.textContent = `${user.fName} ${user.lName}`;
            } else {
                name.textContent = user.fName;
            }
        }
        if (user.summary) {
            summary.textContent = user.summary;
        }
        if (user.role) {
            role.textContent = user.role;
        }
        if (user.phone) {
            phone.textContent = user.phone;
        }
        if (user.address) {
            address.textContent = user.address;
        }
    }

    editBtn.addEventListener('click', (event) => {
        event.preventDefault();
        window.location = '../html/edit-account-organiser.html';
    })
}

// HEADER & FOOTER DATA =========================================================================================

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
        try {
            // title.textContent = `${loggedInUser.fName} ${loggedInUser.lName}`
        } catch (error) {
            console.error(error);
        }

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


// const userAvatar = document.getElementById('profile-image');
// const firstName = document.getElementById('fName');
// const lastName = document.getElementById('lName');
// const orgName = document.getElementById('orgName');
// const role = document.getElementById('role');
// const address = document.getElementById('address');
// const summary = document.getElementById('summary');

// const saveBtn = document.getElementById('saveBtn');

// const video = document.getElementById('webcam');
// const canvas = document.getElementById('canvas');
// const captureButton = document.getElementById('capture');
// let stream;



// // Capture the image
// captureButton.addEventListener('click', () => {
//     const context = canvas.getContext('2d');
//     context.drawImage(video, 0, 0, canvas.width, canvas.height);
//     const dataUrl = canvas.toDataURL('image/png');
//     uploadProfileImage(dataUrlToFile(dataUrl, 'profile'));
//     userAvatar.src = dataUrl;

//     stopCamera();
// });

// startCameraBtn.addEventListener('click', () => {
//     startCamera();
// });

// saveBtn.addEventListener('click', (event) => {
//     event.preventDefault();
//     loggedInUser.fName = firstName.value;
//     loggedInUser.lName = lastName.value;
//     loggedInUser.org_name = orgName.value;
//     loggedInUser.role = role.value;
//     loggedInUser.summary = summary.value;

//     updateUserData(loggedInUser);
// });

// async function updateUserData(user) {
//     await saveUserDataInDb(user);
//     window.location.replace("homepage.html");
// }

// function startCamera() {
//     cameraDiv.style.display = 'block';
//     video.style.display = 'block';
//     captureButton.style.display = 'block';
//     navigator.mediaDevices.getUserMedia({ video: true })
//         .then(mediaStream => {
//             stream = mediaStream;
//             video.srcObject = stream;
//         })
//         .catch(error => {
//             console.error('Error accessing the webcam:', error);
//         });
// }

// function stopCamera() {
//     // Stop the webcam stream
//     stream.getTracks().forEach(track => track.stop());

//     // Hide the video element and display the canvas
//     video.style.display = 'none';
//     canvas.style.display = 'none';
//     captureButton.style.display = 'none';
//     cameraDiv.style.display = 'none';
//     stream = null;

// }