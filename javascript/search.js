// var fireLink = "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

import { firebase, db } from "../app.js";
import { collection, getDocs, addDoc, updateDoc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
const currentUser = JSON.parse(localStorage.getItem("user"));

// Load templates from a separate HTML file
async function loadTemplates() {
    const response = await fetch('../templates/userProfile-template.html');
    const text = await response.text();
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = text;
    document.body.appendChild(tempDiv);
}

document.addEventListener('DOMContentLoaded', function () {
    const searchButton = document.getElementById('searchButton');
    if (!searchButton) {
        console.error('Search button not found in the document.');
        return;
    }

    searchButton.addEventListener('click', async function () {
        const searchInput = document.getElementById('searchInput').value.trim();

        if (searchInput !== '') {
            await searchArtists(searchInput);
        } else {
            alert('Please enter a search query.');
        }
    });
});

async function searchArtists(search) {
    let resultList = [];
    let results = [];
    try {
        const querySnapshot = await getDocs(collection(db, "artists"));
        querySnapshot.forEach((doc) => {
            resultList.push(doc.data());
        });

        console.log("============ search results  ==================");
        resultList.forEach((element) => {
            if (element.genre === search) {
                results.push(element);
            }
        });
        renderArtistResults(results);
        // console.log("All documents:", resultList); // Logging all documents in the array
    } catch (error) {
        console.log('Error while getting search results:', error);
    }
}

function renderArtistResults(artistResults) {
    const template = document.getElementById('artist-result-template');
    const container = document.getElementById('searchResults');

    // Clear the container
    container.innerHTML = '';

    // Create document fragment to minimize reflows
    const fragment = document.createDocumentFragment();
    try {
        artistResults.forEach(artist => {
            const clone = template.content.cloneNode(true);
            // 
            // console.log('Soud look art id:' + artist.uid);
            const artistItem = clone.querySelector('.artist-item');
            artistItem.setAttribute('artist-uid', artist.uid);
            // 
            clone.querySelector('.artist-name').textContent = artist.fName + " " + artist.lName;
            clone.querySelector('.artist-phone').textContent = artist.phone;
            clone.querySelector('.stage-name').textContent = artist.stageName;
            // 
            fragment.appendChild(clone);
        });
    } catch (error) {
        console.log("error while adding data in template: " + error);
    }
    //
    container.appendChild(fragment);
}

// View profile
function veiwPortfolio(artist_id) {
    console.log(artist_id);
    let url = `../html/artist-portfolio.html?artist_id=${artist_id}`;
    window.location = url;
}

// Making an demo request ===========//
export async function sendOffer(artist_id, address, date, offerPrice) {
    console.log(`art id : ` + artist_id);
    console.log(`address : ` + address);
    console.log(`date : ` + date);
    console.log(`offer : ` + offerPrice);
    try {
        console.log('from artist profile artist id: ', artist_id);
        const docRef = await addDoc(collection(db, "request"), {
            host_id: currentUser.uid,
            name: currentUser.fName + " " + currentUser.lName,
            email: currentUser.email,
            artist_id: artist_id,
            phone: currentUser.phone,
            business_name: currentUser.org_name,
            offer: offerPrice,
            address: address,
            req_date: date,
            response: "pending",
        });
        const docID = docRef.id;

        await updateDoc(docRef, {
            uid: docID,
        });

        alert('Offer send successfully!');
        console.log("request created and id updated!");
        // console.log("Document written with ID: ", docID);
    } catch (error) {
        console.error("Error adding document: ", error);
    }
}

window.sendUserOffer = sendOffer;
window.veiwPortfolio = veiwPortfolio;
loadTemplates();