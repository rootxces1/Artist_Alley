import {
    signupWithEmailAndPassword
} from './firebase-auth.js';

import {
    USER_TYPE_ARTIST,
    USER_TYPE_ORGANISER
} from '../javascript/app-constants.js';

import {
    saveUserDataInDb
} from '../javascript/firestore.js';

const statusBox = document.getElementById('status');

const submitBtn = document.getElementById('submitBtn');
submitBtn.addEventListener('click', async function (event) {
    event.preventDefault();
    try {
        statusBox.style.display = 'none';

        const firstName = document.getElementById('fName').value;
        const lastName = document.getElementById('lName').value;
        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;
        const confirmPass = document.getElementById("confirmPass").value;
        const userType = document.getElementById('userType').value;
        if (userType === '') {
            statusBox.innerHTML = 'Required fields missing!';
            statusBox.style.display = 'block';
        } else {
            if (password != '' && password === confirmPass) {
                let result = await signupWithEmailAndPassword(email, password)
                if (result) {
                    gotoHomepage(result.user, firstName, lastName, userType);
                } else {
                    alert("Oops, something went wrong!");
                }
            } else {
                statusBox.innerHTML = 'Required fields missing!';
                statusBox.style.display = 'block';
            }
        }
    } catch (error) {
        console.log(error);
        statusBox.innerHTML = error;
        statusBox.style.display = 'block';
    }
});

async function gotoHomepage(loggedInUser, firstName, lastName, userType) {
    let user = {
        fName: firstName,
        lName: lastName,
        uid: loggedInUser.uid,
        email: loggedInUser.email,
        userType: userType,
        isProfileComplete: false
    };
    // store this user info in appropriate userType table in db
    await saveUser(user);
    // store this user data in the local storage
    localStorage.setItem("user", JSON.stringify(user));
    // go to the appropriate user type profile page
    if(user.userType == USER_TYPE_ARTIST) {
        window.location.replace("edit-account-artist.html");
    } else {
        window.location.replace("edit-account-organiser.html");
    }
}

async function saveUser(user) {
    let location = '';
    if (user.userType == USER_TYPE_ARTIST) {
        location = 'artists';
    } else if (user.userType == USER_TYPE_ORGANISER) {
        location = 'organiser';
    }
    if (location) {
        await saveUserDataInDb(user);
    }
}