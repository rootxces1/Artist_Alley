import { firebase } from '../app.js';
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-storage.js";

import { loggedInUser } from "./utilities.js";

const firebaseStorage = getStorage(firebase);

export {
    uploadProfileImage, uploadPortfolioImages
}

async function uploadProfileImage(file) {
    const storageRef = ref(firebaseStorage, 'profile-picture/' + loggedInUser.uid + "-pic");
    await uploadBytes(storageRef, file);

    const downloadURL = await getDownloadURL(storageRef);

    loggedInUser.profile_image = downloadURL;
    localStorage.setItem("user", JSON.stringify(loggedInUser));

    console.log('User image uploaded! and image URL is: ' + downloadURL);
}

async function uploadPortfolioImages(files) {
    try {
        const urls = [];
        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            const storageRef = ref(firebaseStorage, `images/${loggedInUser.uid}/image${i+1}`);
            await uploadBytes(storageRef, file);
            const downloadURL = await getDownloadURL(storageRef);
            urls.push(downloadURL);
        }
        loggedInUser.portfolio_images = urls;
        localStorage.setItem("user", JSON.stringify(loggedInUser));
    } catch (error) {
        console.error('Error uploading images and saving URLs:', error);
    }
}