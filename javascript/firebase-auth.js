import { firebase } from "../app.js";
import {
    getAuth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

const auth = getAuth(firebase);

async function signupWithEmailAndPassword(email, password) {
    try {
        let result = await createUserWithEmailAndPassword(auth, email, password);
        if (result) {
            return result;
        } else {
            console.log("Error in the auth.js file " + error);
        }
    } catch (error) {
        console.log("Error in the auth.js file " + error);
    }
}

async function loginWithEmailAndPassword(email, password) {
    try {
        let userCredential = await signInWithEmailAndPassword(auth, email, password);
        if (userCredential) {
            return userCredential;
        } else {
            console.log("credential after login are empty in auth.js ");
        }
    } catch (error) {
        console.log("Error in login in auth.js " + error);
    }
}

async function logout(callbackSuccess) {
    return signOut(auth)
        .then(() => {
            callbackSuccess();
            localStorage.clear();
        })
        .catch((error) => {
            console.error(error);
        });
}

export {
    signupWithEmailAndPassword,
    loginWithEmailAndPassword,
    logout
}