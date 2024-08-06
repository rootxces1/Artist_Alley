// Import Firebase services from app.js
import { db } from '../app.js';
import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js';


// onAuthStateChanged(auth, user => {
//     if (user != null) {
//         console.log('logged in!');
//     } else {
//         console.log('No user');
//     }
// });


// auth.signOut()
//     .then(() => {
//         console.log('User signed out.');
//     })
//     .catch((error) => {
//         console.error('Error signing out:', error);
//     });


// // Sign-up
// document.getElementById('signup-form').addEventListener('submit', (e) => {
//     e.preventDefault();
//     const email = document.getElementById('signup-email').value;
//     const password = document.getElementById('signup-password').value;

//     auth.createUserWithEmailAndPassword(email, password)
//         .then((userCredential) => {
//             // Signed up
//             console.log('User signed up:', userCredential.user);
//         })
//         .catch((error) => {
//             console.error('Error during sign-up:', error);
//         });
// });

// // Log in
// document.getElementById('login-form').addEventListener('submit', (e) => {
//     e.preventDefault();
//     const email = document.getElementById('login-email').value;
//     const password = document.getElementById('login-password').value;

//     auth.signInWithEmailAndPassword(email, password)
//         .then((userCredential) => {
//             // Logged in
//             console.log('User logged in:', userCredential.user);
//         })
//         .catch((error) => {
//             console.error('Error during login:', error);
//         });
// });



// Create Operation
async function addDocument() {
    try {
        const docRef = await addDoc(collection(db, "users"), {
            name: "soud haroon",
            email: "soudharoon@gmail.com"
        });
        console.log("Document written with ID: ", docRef.id);
        displayMessage(`Document added with ID: ${docRef.id}`);
    } catch (error) {
        console.error("Error adding document: ", error);
        displayMessage("Error adding document");
    }
}

// Read Operation
async function getDocuments() {
    try {
        const querySnapshot = await getDocs(collection(db, "users"));
        let output = "";
        querySnapshot.forEach((doc) => {
            console.log(`${doc.id} => ${doc.data().name}, ${doc.data().email}`);
            output += `${doc.id} => ${doc.data().name}, ${doc.data().email}<br>`;
        });
        displayMessage(output);
    } catch (error) {
        console.error("Error getting documents: ", error);
        displayMessage("Error getting documents");
    }
}

// Update Operation
async function updateDocument(docId) {
    try {
        const docRef = doc(db, "users", docId);
        await updateDoc(docRef, {
            name: "Jane Doe"
        });
        console.log("Document successfully updated!");
        displayMessage("Document successfully updated!");
    } catch (error) {
        console.error("Error updating document: ", error);
        displayMessage("Error updating document");
    }
}

// Delete Operation
async function deleteDocument(docId) {
    try {
        const docRef = doc(db, "users", docId);
        await deleteDoc(docRef);
        console.log("Document successfully deleted!");
        displayMessage("Document successfully deleted!");
    } catch (error) {
        console.error("Error removing document: ", error);
        displayMessage("Error deleting document");
    }
}

// Function to display messages in the content div
function displayMessage(message) {
    document.getElementById("content").innerHTML = message;
}

// Expose functions to the global scope
window.addDocument = addDocument;
window.getDocuments = getDocuments;
window.updateDocument = updateDocument;
window.deleteDocument = deleteDocument;

console.log('Firebase loaded!');