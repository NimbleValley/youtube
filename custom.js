const keys = ["AIzaSyAYNCrI8eJBlx_2tXo50VCphZSjRkXErF4", "AIzaSyB6hVYRqFlkAvPGYmrKaQ-DlIdK8GMAOuw", "AIzaSyDTue0cZa34nSVirfAyOMQPJhzOeynXZio", "AIzaSyCsOdYt7b-QJTkavtD3gG4URBvXnkHSw18"];
var keyIndex = 0;

gapi.load("client", loadClient);

function loadClient() {
    gapi.client.setApiKey(keys[keyIndex]);
    return gapi.client.load("https://www.googleapis.com/discovery/v1/apis/youtube/v3/rest")
        .then(function () { console.log("GAPI client loaded for API"); },
            function (err) { console.error("Error loading GAPI client for API", err); });
}

const ytForm = document.getElementById('search-form');
const keywordInput = document.getElementById('searchTerm');
const videoList = document.getElementById("video-list-container");
const videoPlayer = document.getElementById("video");
const videoContainer = document.getElementById("video-player");

const videoPlayerContainer = document.getElementById('video-player-container');

hideVideo();

var pageToken = '';

ytForm.addEventListener('submit', e => {
    e.preventDefault();
    execute();
});

function paginate(e, obj) {
    e.preventDefault();
    pageToken = obj.getAttribute('data-id');
    execute();
}

// Make sure the client is loaded before calling this method.
function execute() {
    const searchString = keywordInput.value;
    const maxresult = 10;
    const orderby = "relevance";

    var arr_search = {
        "part": 'snippet',
        "type": 'video',
        "order": orderby,
        "maxResults": maxresult,
        "q": searchString
    };

    if (pageToken != '') {
        arr_search.pageToken = pageToken;
    }

    return gapi.client.youtube.search.list(arr_search)
        .then(function (response) {
            // Handle the results here (response.result has the parsed body).
            const listItems = response.result.items;
            if (listItems) {
                let output = '<h4>Videos</h4><ul>';

                listItems.forEach(item => {
                    const videoId = item.id.videoId;
                    const videoTitle = item.snippet.title;
                    const channelTitle = item.snippet.channelTitle;
                    const dimension = item;
                    console.log(dimension);
                    output += `
                    <li><a onclick="showVideo('${videoId}')"><img src="http://i3.ytimg.com/vi/${videoId}/hqdefault.jpg" /></a><p><strong>${channelTitle}</strong> - ${videoTitle}</p></li>
                `;
                });
                output += '</ul>';

                if (response.result.prevPageToken) {
                    output += `<br><a class="paginate" href="#" data-id="${response.result.prevPageToken}" onclick="paginate(event, this)">Prev</a>`;
                }

                if (response.result.nextPageToken) {
                    output += `<a href="#" class="paginate" data-id="${response.result.nextPageToken}" onclick="paginate(event, this)">Next</a>`;
                }

                // Output list
                videoList.innerHTML = output;
            }
        },
            function (error) { 
            console.error("Execute error", error);
            if(error.status == 403) {
                keyIndex ++;
                alert("Error 403: Server is full, taking you to server " + (keyIndex + 1));
                gapi.load("client", loadClient);
            }
        });
}

function showVideo(data) {
    videoPlayerContainer.style.display = "block";
    document.body.style.overflow = "hidden";

    videoContainer.innerHTML = `<iframe id="video" src="https://www.youtube-nocookie.com/embed/${data}" title="Video" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>`;

}

function hideVideo() {
    videoPlayerContainer.style.display = "none";
    document.body.style.overflow = "auto";
}
