const path = require('path');
const videostuff = require('../../js/videostuff');
const um = require('../../js/upm');
const globals = require("../globals");
const crypto = require('crypto');

exports.getHost = function() {
    return "http://www.wat.tv/";
};

exports.getFavicon = function() {
    return "data:image/png;base64,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";
}

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

var hashCode = function(s) {
    return crypto.createHash("md5").update(s).digest("hex");
}

var getToken = function(id) {
    var watKey = "9b673b13fa4682ed14c3cfa5af5310274b514c4133e9b3a81e6e3aba009l2564";
    var hexTime = (+(Date.now() / 1000 | 0)).toString(16);
    if (hexTime.length < 8) hexTime = "0" + hexTime;

    // Return MD5 hash code + hextime = token.
    return hashCode(watKey + id + hexTime) + "/" + hexTime;
}

exports.getInfo = function(url, cb) {
    var info = new videostuff.downloadInfo();
    info.url = url;
    info.videoQualities = [];
    info.audioQualities = [];
    globals.getSource(url, function(err, resp, body) {

        var idMatch = body.match(/<meta name.*?content=\".*?embedframe\/\d*nIc0K11(\d*)\">/);
        info.isValid = idMatch != null;
        if (info.isValid) {

            info.id = +idMatch[1];
            globals.getSource("http://www.wat.tv/interface/contentv3/" + info.id, function(err, resp, body) {

                var jInfo = JSON.parse(body.replace(/\\\//g, "/")).media;
                info.thumbUrl = jInfo.preview;
                info.title = jInfo.title;
                info.uploader = jInfo.owner;
                info.viewCount = jInfo.views;
                info.duration = jInfo.files[0].duration;

                // Country variable to overwrite our own country if needed
                var country = (jInfo.geolockSyndicated ? "&country=FR" : "");
                var qCount = 1;

                // Check if video is HD
                if (jInfo.files[0].hasHD) {
                    qCount++;
                    var token = getToken("/webhd/" + info.id);
                    var dlUrl = "http://www.wat.tv/get/webhd/" + info.id + "?token=" + token + country + "&getURL=1";
                    globals.getSource(dlUrl, function(err, resp, body) {
                        addQuality({url: body, progScan: jInfo.height + "p"}, info, qCount, cb);
                    });
                }

                // Add SD quality
                var token = getToken("/web/" + info.id);
                var dlUrl = "http://www.wat.tv/get/web/" + info.id + "?token=" + token + country + "&getURL=1";
                globals.getSource(dlUrl, function(err, resp, body) {
                    console.log(body);
                    addQuality({url: body, progScan: "360p"}, info, qCount, cb);
                });
            });
        } else {
            cb(info);
        }
    });
};

exports.validateUrl = function(url) {
    if (!globals.isValidUrl(url)) return "";
    var matches = url.match(/wat.tv\/video\/.*?[\w-]*?_.*?_\.html/);
    return matches != null;
};
