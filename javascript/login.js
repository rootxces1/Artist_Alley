import {
    loginWithEmailAndPassword
} from './firebase-auth.js';

import {
    getUserTypeDataById
} from '../javascript/firestore.js';

const loginBtn = document.getElementById('loginBtn');
const signupBtn = document.getElementById('signupBtn');

loginBtn.addEventListener('click', async function (event) {
    try {
        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;

        let result = await loginWithEmailAndPassword(email, password);
        if (result) {
            gotoHomepage(result);
        } else {
            alert("wrong credentials!");
        }

    } catch (error) {
        console.log(error);
    }
});

signupBtn.addEventListener('click', async function (event) {
    try {
        console.log('inside signup flow')
        window.location.href = '../html/signup.html';
    } catch (error) {
        console.error(error);
    }
})

async function gotoHomepage(result) {
    await setUserType(result);
    window.location.replace("homepage.html");
}

async function setUserType(result) {
    let userData = await getUserTypeDataById(result.user.uid);
    let user = {
        uid: result.user.uid,
        email: result.user.email
    };
    user.userType = userData.userType;
    localStorage.setItem("user", JSON.stringify(user));
}