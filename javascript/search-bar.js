
const searchInput = document.getElementById('search');
const searchButton = document.getElementById('searchBtn');

const navSearch = document.getElementById('nav-search');
const searchCloseBtn = document.getElementById('searchCloseBtn');

navSearch.addEventListener('click', (event) => {
    event.preventDefault();
    document.body.classList.toggle("search-active");
    // alert("Welcom from inside!")
})

searchCloseBtn.addEventListener('click', (event) => {
    console.log("1==========================");
    event.preventDefault();
    document.body.classList.remove("search-active")
    console.log("==========================");
})

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