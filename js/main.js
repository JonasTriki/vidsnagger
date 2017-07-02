window.addEventListener("load", init);

let elements, curInfo, curFavicon;

function init() {

    // Load DOM elements
    elements = {};
    elements.content = document.querySelector("content");
    elements.urlDl = document.querySelector("#url-dl");
    elements.urlTitle = document.querySelector("#url-dl #intro-title");
    elements.urlBox = document.querySelector("#url-dl input");
    elements.snagItBtn = document.querySelector("#download");

    elements.downloadInfo = document.querySelector("#download-info");
    elements.viThumb = document.querySelector("#videoinfo #thumb");
	elements.viTitle = document.querySelector("#videoinfo #title");
	elements.viVssIcon = document.querySelector("#videoinfo #vssicon");
	elements.viVss = document.querySelector("#videoinfo #vss");
	elements.viDuration = document.querySelector("#videoinfo #duration");
	elements.viViews = document.querySelector("#videoinfo #viewcount");
    elements.viTableBody = document.querySelector("#qualities tbody");

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
            curInfo = null;
            curFavicon = null;

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
                        curInfo = res.data.info;
                        curFavicon = res.data.favicon;
                        showInfo();
                    } else {
                        console.log(res);
                    }
                }
            };
            req.send("url=" + url);
        }
    } else {

        // Otherwhise, TEMP.
        elements.urlBox.value = "https://www.youtube.com/watch?v=dQw4w9WgXcQ";
    }
}

function secToDuration(sec) {
	if (sec > 60) {
		let d = new Date(sec * 1000);
		let ss = ("00" + Math.floor(d.getSeconds())).substr(-2);
		let mm = ("00" + Math.floor(d.getMinutes())).substr(-2);
		return mm + ":" + ss;
	} else {
		return Math.floor(sec) + "s";
	}
}

function spaceThousand(n) {
	let x = ("" + n).split(" ");
	let x1 = x[0];
	let x2 = (x.length > 1 ? " " + x[1] : "");
	let rgx = /(\d+)(\d{3})/;
	while (rgx.test(x1)) {
		x1 = x1.replace(rgx, "$1 $2");
	}
	return x1 + x2;
}

let binaryTypes = ["byte", "bytes", "kB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
function convertByte(bytes, decimals) {
	let s = "";
	if (bytes <= 1024) {
		s = bytes + " " + binaryTypes[(bytes == 1) ? 0 : 1];
	} else if (bytes >= (Math.pow(1024, 8))) {
		s = (bytes / Math.pow(1024, 8)).toFixed(decimals) + " " + binaryTypes[9];
	} else if (bytes >= (Math.pow(1024, 7))) {
		s = (bytes / Math.pow(1024, 7)).toFixed(decimals) + " " + binaryTypes[8];
	} else if (bytes >= (Math.pow(1024, 6))) {
		s = (bytes / Math.pow(1024, 6)).toFixed(decimals) + " " + binaryTypes[7];
	} else if (bytes >= (Math.pow(1024, 5))) {
		s = (bytes / Math.pow(1024, 5)).toFixed(decimals) + " " + binaryTypes[6];
	} else if (bytes >= (Math.pow(1024, 4))) {
		s = (bytes / Math.pow(1024, 4)).toFixed(decimals) + " " + binaryTypes[5];
	} else if (bytes >= (Math.pow(1024, 3))) {
		s = (bytes / Math.pow(1024, 3)).toFixed(decimals) + " " + binaryTypes[4];
	} else if (bytes >= (Math.pow(1024, 2))) {
		s = (bytes / Math.pow(1024, 2)).toFixed(decimals) + " " + binaryTypes[3];
	} else if (bytes >= 1024) {
		s = (bytes / 1024).toFixed(decimals) + " " + binaryTypes[2];
	}
	return s;
}

function showInfo() {
    if (curInfo == undefined || curInfo == null) return;
    console.log("Showing data", curInfo);

    // Show/hide divs

    elements.urlTitle.classList.add("hidden");
    elements.content.classList.add("fs");
    elements.downloadInfo.classList.remove("hidden");

    // Set video info
    elements.viThumb.style["background-image"] = "url(" + curInfo.thumbUrl + ")";
    elements.viTitle.textContent = curInfo.title;
    elements.viVssIcon.style["background-image"] = "url(" + curFavicon + ")";
    elements.viVss.textContent = curInfo.uploader;
    elements.viDuration.textContent = secToDuration(curInfo.duration);
    if (curInfo.viewCount > -1) {
        elements.viViews.textContent = spaceThousand(curInfo.viewCount) + " views";
    } else {
        elements.viViews.textContent = "";
    }

    // Video qualities
    if (curInfo.videoQualities.length > 0) {

        // Sorts
        curInfo.videoQualities.sort(function (a, b) {

            // Descending order, 100 ... 0.
            return +(b.progScan.substring(0, b.progScan.length - 1)) - +(a.progScan.substring(0, a.progScan.length - 1));
        });

        for (let i = 0; i < curInfo.videoQualities.length; i++) {
            let q = curInfo.videoQualities[i];
            addQuality(q, false, q.isMuted);
        }
    }

    // Audio qualities
    if (curInfo.videoQualities.length > 0) {

        // Sort
        curInfo.audioQualities.sort(function (a, b) {

            // Descending order, 100 ... 0.
            return b.kbits - a.kbits;
        });

        for (let i = 0; i < curInfo.audioQualities.length; i++) {
            let q = curInfo.audioQualities[i];
            addQuality(q, true, false);
        }
    }
}

function addQuality(quality, audioOnly, videoOnly) {

    // Append a new row to the table
    let row = elements.viTableBody.insertRow();

    // File type
    row.insertCell(0).appendChild(document.createTextNode(quality.type.substring(1)));

    // Quality
    let qual = "";
    if (audioOnly) {
        qual = quality.kbits + "kb/s";
    } else {
        qual = quality.progScan + (videoOnly ? ' <b>(Video only)</b>' : "");
    }
    row.insertCell(1).innerHTML = qual;

    // File size
    row.insertCell(2).appendChild(document.createTextNode(convertByte(quality.size, 1)));

    // Download button
    let dlCell = row.insertCell(3);
    let a = document.createElement("a");
    a.className = "download-btn";
    a.href = quality.downloadUrl;
    a.download = "";
    a.textContent = "Download";
    dlCell.appendChild(a);
}

function hideInfo() {

    // Show/hide divs
    elements.content.classList.remove("fs");
    elements.downloadInfo.classList.add("hidden");
    elements.urlTitle.classList.remove("hidden");
}
