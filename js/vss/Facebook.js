const path = require('path');
const videostuff = require('../../js/videostuff');
const um = require('../../js/upm');
const globals = require("../globals");

exports.getHost = function() {
    return "https://www.facebook.com/";
};

exports.getFavicon = function() {
    return "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAACD0lEQVRYhe2Xv2sUQRTHv/NjZ/ayFwuVhA2IIhaSUkgjKNgoKWzUwkqL5G8IVhY2itjYiXCCgqSKghYidooQsPAHKFir5AIRFKMstzPvWRx3utnN4eZ2k8J71c7Mm/l+5s17s7uCmbGTJndUHYDuPcycvjJrlGkprWJA1CTH8M6vdHxn7tXjy08yAKGNWjaMYiH15vOrQCAXy+RnC8BUBsCGUayCBqRUtQIQeVgg7rX7OSCkrl0cAKRU+DvKlcU7NArnZqdxfOYAJvZEYAa+/0jw9dsvrK6t49rtl5Ain1uVADRChRuXTuHgvt1ZKNvE5N4mpg9N4Oqt54DKyw1dhsSMsycP58Q3GpMr7B8agNnj6JH9W54//BEQYWpyV6br/sNl3F1aRpJ0d610gMCO1wPATLAmu8ziozcgNGDHulUlhIRQxRVWy62TpALKjBVm/Uar5V0gpPoncWALESD2eHrn4kCfZ/fmM+3VtXVcWFiCFPljKB0B9r7sFLz98BlMVDhWHoCLFxpkr99/2nRsW74H3n1sQ4hiqdI5IITEifM34V0KAGAivHiwkPE5duY6hOwKCqVhbASpw4oAlEJgx6FN9yjIdXI+JmxCatMHHlQVpQGkUID+k81FN7zUBjoo3nHOtyxA1TYCGAGMAPoA5Gllu0SZuJ0DYJfOO5e2i6dUZ86nXyjtzPXa4r//O/4NEnuNjMLLMTkAAAAASUVORK5CYII=";
}

exports.getId = function(url) {
    if (!globals.isValidUrl(url)) return "";
	var matches = url.match(/facebook.com\/.+?\/videos.*\/(\d+)/);
	if (matches == null) {
		matches = url.match(/facebook.com\/photo.php\?v=(\d+)/);
		if (matches == null) {
			return "";
		}
	}
	return matches[1];
};

var addQuality = function(qual, info, count, cb) {
    var quality = new videostuff.videoQuality();
    quality.progScan = qual.progScan;
    quality.downloadUrl = qual.url;
    quality.type = ".mp4"

    // Get file size
    globals.getFileSize(quality.downloadUrl, function(size) {
        quality.size = size;
        info.videoQualities.push(quality);
        if (count == info.videoQualities.length) {
            cb(info);
        }
    });
}

exports.getInfo = function(url, cb) {
    var info = new videostuff.downloadInfo();
    info.url = url;
    info.id = exports.getId(url);
    info.videoQualities = [];
    info.audioQualities = [];
    globals.getSource("https://www.facebook.com/photo.php?v=" + info.id, function(err, resp, body) {

    	info.isValid = body.indexOf('<div class="phl ptm uiInterstitialContent">') == -1;
    	if (info.isValid) {

            // Parse Facebook JSON into an array.
    		var jQuals = JSON.parse(decodeURIComponent(globals.unicodeToChar(globals.inBetween(body, '"params","', '"],["'))).replace(/\\\//g, "/")).video_data.progressive[0];
            var qCount = 1;

            // Get video info from JSON.
            console.log(info.id);
            var titleMatch = body.match(/<h2 class=\"uiHeaderTitle\".*?>(.+?)<\/h2>/);
            if (titleMatch != null) info.title = body.match(/<h2 class=\"uiHeaderTitle\".*?>(.+?)<\/h2>/)[1];
            info.duration =  -1; // ????????????????????????????????????????????
            info.thumbUrl = body.match(/background-image: url\((.+?)\);\"/)[1].replace(/\;/, "&");
            info.uploader = body.match('<div class=\"fbPhotoContributorName\" id=\"fbPhotoPageAuthorName\"><a.*?\">(.+?)<\/a><\/div>')[1];
            if (info.title == undefined) info.title = info.uploader;

            // Get view-counter.
            var vSplit = globals.inBetween(body, '<div></div><span class="fcg">', '</span>').split(/(\s+)/);
            var views = "";
            for (var i = 0; i < vSplit.length; i++) {
                if (globals.isNumeric(vSplit[i])) {
                    views += vSplit[i];
                }
            }
            info.viewCount = +views;

            // Add HD qual if it exists.
            if (jQuals.hd_src != null) {
                qCount++;
                addQuality({url:jQuals.hd_src, progScan:"720p"}, info, qCount, cb);
            }

            //SD qual, always there.
            addQuality({url:jQuals.sd_src, progScan:"240p"}, info, qCount, cb);
    	} else {
            cb(info);
        }
    });
};

exports.validateUrl = function(url) {
	return exports.getId(url) != "";
};
