window.addEventListener("load", init);

let elements;

function init() {

    // Load DOM elements
    elements = {};
    elements.urlDl = document.querySelector("#url-dl");
    elements.urlBox = document.querySelector("#url-dl input");
    elements.snagItBtn = document.querySelector("#download");

    // Events
    elements.urlBox.addEventListener("keypress", (e) => {
        if ((e.which || e.keyCode) === 13) submitQuery(elements.urlBox.value);
    });
    elements.snagItBtn.addEventListener("click", () => {
        submitQuery(elements.urlBox.value);
    });

    checkUrlParams(); // Check for url parameter
}

function submitQuery(url) {
    window.location.href = "?url=" + encodeURIComponent(url);
}

function checkUrlParams() {

    // Look for 'url' parameter
    if (location.search.indexOf("url") > -1 && location.search.indexOf("=") > -1) {
        let params = location.search.substring(1).split("&");
        let url = "";
        for (let i = 0; i < params.length; i++) {
            let split = params[i].split("=");
            if (split[0] == "url") {
                url = decodeURIComponent(split[1]);
                break;
            }
        }
        if (url != undefined && url != "") {
            elements.urlBox.value = url;

            // Create POST request and send it!
            let req;
            if (window.XMLHttpRequest) {
                req = new XMLHttpRequest();
            } else if (window.ActiveXObject) {
                req = new ActiveXObject("Microsoft.XMLHTTP");
            }
            req.open("POST", "/", true);
            req.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
            req.onreadystatechange = function() {
                if (req.readyState === 4 && req.status == 200) {
                    let res = JSON.parse(req.responseText);
                    if (res.status == "ok") {
                        console.log(res.data);
                    } else {
                        console.log(res);
                    }
                }
            };
            req.send("url=" + url);
        }
    } else {

        // Otherwhise, TEMP.
        elements.urlBox.value = "https://www.youtube.com/watch?v=KL2xcq0zEbA&t=2s";
    }
}
