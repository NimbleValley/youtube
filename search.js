window.addEventListener('load', (event) => {
    var key = "AIzaSyAYNCrI8eJBlx_2tXo50VCphZSjRkXErF4";
});

const searchForm = document.getElementById("search-form");
const searchTerm = document.getElementById("searchTerm");

function validateSearch() {
    if (searchTerm.value != "Video Title") {
        search();
    } else {
        alert("You cannot search this :(");
    }
}

function search() {
    fetch(url)
    .then(res => res.json())
    .then(data => {
        console.log(data);
    }).catch(err => {
        console.error('Error: ', err);
    });
}