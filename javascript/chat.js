import { loggedInUser, includeHeaderFooter, gotoMyAccount, logoutUser } from "./utilities.js";
import { getUserDataById, saveUserDataInDb, getChatData, saveChatItem, updateChatItem, listenForChatUpdates } from './firestore.js';
import { USER_TYPE_ARTIST } from './app-constants.js';

const params = new URLSearchParams(window.location.search);
const artist_id = params.get('artist_id');

const chatListDiv = document.getElementById('chat-list');
const chatScreenDiv = document.getElementById('chat-view');
const headerElement = document.querySelector('header');
const footerElement = document.querySelector('footer');

setupHeaderFooter();
// Load the previous chat on the left panel, if exist
await initUI();

// If the user is coming from the artists profile then create a chatId, compare it with existing chats for the loggedInUser
// if found, open the chat box of that particular id
// else add that id to myChat and also to the artist's myChat and then open the chat box
if (artist_id) {
    const chatId = `${loggedInUser.uid}_${artist_id}`;
    let chatExists = false;
    if (loggedInUser.myChat) {
        console.log('myChat exists for the loggedin user');
        loggedInUser.myChat.forEach(chat => {
            if (chat.id === chatId) {
                chatExists = true
            }
        });
        if (chatExists) {
            loadConversation(chatId);
        } else {
            console.log('The key is there, but no data is inside the myChat array!');
            await startANewChat(chatId, artist_id);
        }
    } else {
        console.log('No chat found. Go ahead create a new one with this id: ' + chatId);
        await startANewChat(chatId, artist_id);
    }

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

async function initUI() {
    if (loggedInUser.myChat) {
        let currentHighlight = null;
        loggedInUser.myChat.forEach(chat => {
            const otherUser = document.createElement('p');
            if (loggedInUser.userType == USER_TYPE_ARTIST) {
                otherUser.textContent = chat.organiser_name;
            } else {
                otherUser.textContent = chat.artist_name;
            }
            otherUser.addEventListener('click', () => {
                if (currentHighlight) {
                    console.log('highlight removing...')
                    currentHighlight.classList.remove('highlight');
                }
                otherUser.classList.add('highlight');
                currentHighlight = otherUser;
                loadConversation(chat.id);
            })
            chatListDiv.appendChild(otherUser);
        });
    } else {
        console.log("No prev chat for you!");
    }
}

async function startANewChat(chatId, artist_id) {
    let prevChat;
    let artist_data = await getArtistData(artist_id, USER_TYPE_ARTIST);
    if (loggedInUser.myChat) {
        prevChat = loggedInUser.myChat;
    } else {
        prevChat = [];
    }
    const newChat = {
        id: chatId,
        organiser_name: `${loggedInUser.fName} ${loggedInUser.lName}`,
        artist_name: `${artist_data.fName} ${artist_data.lName}`
    }
    prevChat.push(newChat);
    loggedInUser.myChat = prevChat;
    // Update chat data for Organiser User
    await updateUserData(loggedInUser);
    localStorage.setItem('user', JSON.stringify(loggedInUser));


    // Update the same for the Artist User
    let artistAllChat;
    if (artist_data.myChat) {
        artistAllChat = artist_data.myChat;
    } else {
        artistAllChat = [];
    }
    artistAllChat.push(newChat);
    artist_data.myChat = artistAllChat;
    await updateUserData(artist_data);

    const itemDiv = document.createElement('div');
    const newChatWrapper = document.createElement('p');
    newChatWrapper.textContent = newChat.chatName;
    if (loggedInUser.userType == USER_TYPE_ARTIST) {
        newChatWrapper.textContent = newChat.organiser_name;
    } else {
        newChatWrapper.textContent = newChat.artist_name;
    }
    itemDiv.appendChild(newChatWrapper);
    itemDiv.addEventListener('click', () => {
        loadConversation(chatId);
        newChatWrapper.classList.toggle('highlight');
    })
    chatListDiv.appendChild(itemDiv);
}

async function updateUserData(user) {
    await saveUserDataInDb(user);
}

async function getArtistData(userId, userType) {
    return await getUserDataById(userId, userType);
}

async function loadConversation(chatId) {
    chatScreenDiv.innerHTML = '';

    let isNewChat = true;

    // LOAD THE CHAT TEMPLATE
    const response = await fetch('../templates/chat-template.html');
    const html = await response.text();

    // Create a temporary element to hold the HTML content
    const temp = document.createElement('div');
    temp.innerHTML = html;

    // Extract the template content
    const chatTemplate = temp.querySelector('#chatTemplate');
    const clone = document.importNode(chatTemplate.content, true);

    const chatScreen = clone.querySelector('#chat-screen');
    const messageInput = clone.querySelector('#message-input');
    const sendButton = clone.querySelector('#send-button');

    let messages = await getChatData(chatId);
    console.log("I've got some data: " + messages);
    if (messages) {
        isNewChat = false;
        showMessagesOnUI(messages, chatScreen);
    }

    listenForChatUpdates(chatId, (updatedMessages) => {
        showMessagesOnUI(updatedMessages, chatScreen)
    });

    sendButton.addEventListener('click', () => {
        console.log('event listener added')

        let msg = messageInput.value.trim();
        if (msg !== '') {
            let chatItem = {
                id: chatId,
                senderId: loggedInUser.uid,
                receiverId: artist_id,
                text: msg
            }
            if (isNewChat) {
                saveNewConversation(chatItem, chatId);
            } else {
                updateConversation(chatItem, chatId);
            }
            messageInput.value = '';
        }
    });

    chatScreenDiv.appendChild(clone);
}

async function saveNewConversation(chatItem, chatId) {
    await saveChatItem(chatItem, chatId);
    loadConversation(chatId);

    console.log('message sent successfully!');
}

async function updateConversation(chatItem, chatId) {
    await updateChatItem(chatItem, chatId);
    loadConversation(chatId);

    console.log('message sent successfully!');
}

function showMessagesOnUI(messages, chatScreen) {
    chatScreen.innerHTML = '';
    messages.forEach(item => {
        const messageItem = document.createElement('p');
        messageItem.textContent = item.text;
        if (item.senderId === loggedInUser.uid) {
            messageItem.id = 'sender-view';
        } else {
            messageItem.id = 'receiver-view';
        }
        chatScreen.appendChild(messageItem);
    });
}

// HEADER & FOOTER DATA =========================================================================================

function setupHeaderFooter() {
    includeHeaderFooter(setHeader, setFooter);
}

function setHeader(data) {
    if (headerElement) {
        headerElement.innerHTML = data;
        const myProfileBtn = document.getElementById('myProfile');
        const logoutBtn = document.getElementById('logoutBtn');
        const search = document.getElementById('search');
        const searchCloseBtn = document.getElementById('searchCloseBtn');

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