import { firebase } from '../app.js';

import {
    collection,
    query,
    where,
    getDocs,
    getFirestore,
    doc,
    setDoc,
    updateDoc,
    addDoc,
    getDoc,
    arrayUnion,
    onSnapshot
} from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js';

import {
    USER_TYPE_ARTIST,
    USER_TYPE_ORGANISER,
    ARTIST_TABLE,
    ORGANISER_TABLE,
    TABLE_USER_TYPE,
    TABLE_BOOKINGS,
    TABLE_CHAT,
    TABLE_NOTIFICATIONS
} from '../javascript/app-constants.js';

const firestore = getFirestore(firebase);

async function saveUserDataInDb(user) {
    await saveUserTypeInDb(user);
    let table;
    if (user.userType == USER_TYPE_ARTIST) {
        table = ARTIST_TABLE;
    } else if (user.userType == USER_TYPE_ORGANISER) {
        table = ORGANISER_TABLE;
    }
    try {
        if (table) {
            const ref = doc(firestore, table, user.uid);
            await setDoc(ref, user);
            // localStorage.setItem('user', JSON.stringify(user));
        }
    } catch (error) {
        console.error(error);
    }
}

async function saveUserTypeInDb(user) {
    try {
        const ref = doc(firestore, TABLE_USER_TYPE, user.uid);
        let userTypeObject = {
            userType: user.userType
        }
        await setDoc(ref, userTypeObject);
    } catch (error) {
        console.error(error);
    }
}

async function saveBookingInDb(booking) {
    try {
        const ref = doc(firestore, TABLE_BOOKINGS, booking.booking_id);
        await setDoc(ref, booking);
        console.log('============= Booking added successfully! ============');
        return true
    } catch (error) {
        console.error(error)
        return false
    }
}

function listenForBookingsUpdates(loggedInUserId, showNotification) {
    const notificationRef = collection(firestore, TABLE_NOTIFICATIONS);
  
    onSnapshot(notificationRef, (snapshot) => {
      snapshot.docChanges().forEach((change) => {
        if (change.type === 'added' || change.type === 'modified' || change.type === 'removed') {
          let notifications = change.doc.data();
          
        }
      });
    });
  }

async function getUserDataById(userId, userType) {
    let table;
    if (userType == USER_TYPE_ARTIST) {
        table = ARTIST_TABLE;
    } else if (userType == USER_TYPE_ORGANISER) {
        table = ORGANISER_TABLE;
    }
    try {
        if (table) {
            const userRef = doc(firestore, table, userId);
            const userDoc = await getDoc(userRef);
            if (userDoc.exists()) {
                return userDoc.data();
            } else {
                console.log('No such user');
                return null;
            }
        }
    } catch (error) {
        console.error(error);
        return null;
    }
}

async function getUserTypeDataById(userId) {
    const userRef = doc(firestore, TABLE_USER_TYPE, userId);
    const userDoc = await getDoc(userRef);
    if (userDoc.exists()) {
        return userDoc.data();
    }
}

async function getBookingsFromDb(uid, userType) {
    let bookings = [];
    // const bookingRef = doc(firestore, TABLE_BOOKINGS);
    let key = '';
    if (userType == USER_TYPE_ARTIST) {
        key = 'artist_id';
    } else {
        key = 'host_id';
    }
    const q = query(collection(firestore, TABLE_BOOKINGS), where(key, "==", uid));

    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
        bookings.push(doc.data());
    });
    return bookings;
}

async function getChatData(chatId) {
    const chatRef = doc(firestore, TABLE_CHAT, chatId);
    const chatDoc = await getDoc(chatRef);
    if (chatDoc.exists()) {
        return chatDoc.data().messages;
    }
}

async function saveChatItem(chatItem, chatId) {
    try {
        const ref = doc(firestore, TABLE_CHAT, chatId);
        // await setDoc(ref, chatItem);
        await setDoc(ref, {
            messages: arrayUnion(chatItem)
        });
        console.log('============= Chat added successfully! ============');
    } catch (error) {
        console.error(error)
    }
}

async function updateChatItem(chatItem, chatId) {
    try {
        const ref = doc(firestore, TABLE_CHAT, chatId);
        // await setDoc(ref, chatItem);
        await updateDoc(ref, {
            messages: arrayUnion(chatItem),
        });
        console.log('============= Chat updated successfully! ============');
    } catch (error) {
        console.error(error)
    }
}

function listenForChatUpdates(chatId, onUpdate) {
    const chatRef = doc(firestore, TABLE_CHAT, chatId);

    // Set up real-time listener
    const unsubscribe = onSnapshot(chatRef, snapshot => {
        if (snapshot.exists()) {
            const messages = snapshot.data().messages;
            console.log('Data updated!');
            onUpdate(messages); // Call callback with updated messages
        } else {
            console.log('Chat document does not exist');
        }
    });

    // Return the unsubscribe function to detach the listener when needed
    return unsubscribe;
}

async function getSearchResults(searchInput) {
    let filteredArtists = [];
    const q = query(collection(firestore, ARTIST_TABLE), where('category','==', searchInput));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((artist) => {
        filteredArtists.push(artist.data());
    })
    return filteredArtists;
}


export {
    saveUserDataInDb,
    saveBookingInDb,
    listenForBookingsUpdates,
    getUserDataById,
    getUserTypeDataById,
    getBookingsFromDb,
    getChatData,
    saveChatItem,
    updateChatItem,
    listenForChatUpdates,
    getSearchResults
}