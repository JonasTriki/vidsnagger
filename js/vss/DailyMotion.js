const path = require('path');
const videostuff = require('../../js/videostuff');
const um = require('../../js/upm');
const globals = require("../globals");

exports.getHost = function() {
    return "http://www.dailymotion.com/";
};

exports.getFavicon = function() {
    return "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAChUlEQVRYhe2XP0wTcRTHP3fX6z+KYgtGwSL/NCFqIFFQEIiDUUc1DBKDAzLKJImjEWMQnZwMiYnooIOThjCY4CDGanDQIImxBjBQEiq2KLRwpe25aLS50v6qJR3wO/7uvXufe/feu3cSnZ90cig5l8E3HoAzT8ZulhLOTOsZsKnKSl25hboyCwd2WqgoUmnu8+GZ0NYfwCTDs+5iVEVKabexauA/QDL9dRGaTXB8j52WXTbcThMS8DmwytPxZYY/LK8vwLkGB9dOudixxejefawAz4RG+5257AMoMvS3F9FxOB9JSt5ekiTRWGll+GIxcuoOzBzg9tkizjdtErItK1SF7ISLsK3eQWdzftJruq6zEI4R0uLoemYfV6EMqApcP+00pF3XdQZeLtI7tIDXv4oiQ2OllRutLg5VWIUAhDJwYq+dUpcxpT2DQToGvuD1rwIQi8OId4UjN2d54RXrBCGAo9U2w9nHuQhXB4NJ7bWoTtfDeaHXIQRQtdX49IPvwsTia/u8nY4wE4xmB8CmGs0CoVhav6+hFISZAATDxmDVxeaUPqoCZa70NS4EMD4bMZydrM2j1Ll2gLZ6BwV2JTsAQ2NhQ0HlWWSeXNiWFKKhwsKtM4UitxabA68mNEanNOrLE3u7xm1hvMfNozdLjE5q6EDLbiut+x1pN6FfkkT/Cw6WWxi5VCJ847XU2DuTsBMKj+LXkxpdD+aJZzhq0ymjhaT/+Xc67voJR9K31+jUCjOBLM2BP3XPs0TNlWnuexYJaUYQ/2KMy48DtPTN8m0lPahwDSSTTZXYV2Jm+2aFuA7TwSjvfRGiP+PWus3Y1MSaGfNFWNJ+h/wngGwo50tpzgF+AJhhyVFCKAmMAAAAAElFTkSuQmCC";
}

exports.getId = function(url) {
    if (!globals.isValidUrl(url)) return false;
    if (url.lastIndexOf("http://", 0) === 0) {
        url = url.substring(7);
    }
    if (url.lastIndexOf("www.", 0) === 0) {
        url = url.substring(4);
    }
    if (url.indexOf("dailymotion") > -1) {
        if (url.indexOf("embed") > -1) {
            url = url.replace("dailymotion.com/embed/video/", "").split("_")[0];
        } else if (url.indexOf("video") > -1) {
            url = url.replace("dailymotion.com/video/", "").split("_")[0];
        }
    } else if (url.indexOf("dai.ly") > -1) {
        url = url.substring(7);
    }
    if (url.length == 7 || url.length == 6) {
        return url;
    } else {
        return "";
    }
};

var addQuality = function(qual, info, count, cb) {
    var quality = new videostuff.videoQuality();
    var upm = new um(qual.url);
    quality.progScan = qual.height + "p";
    quality.downloadUrl = qual.url;
    quality.type = path.extname(upm.host);

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
    globals.getSource(url, function(err, resp, body) {

        info.isValid = body.indexOf('"qualities":') > -1;
        if (info.isValid) {

            // Parse Dailymotion JSON into an array.
            var jQuals = JSON.parse('{"qualities":' + globals.inBetween(body, '"qualities":', "},").replace(/\\\//, "/") + "}}");

            // Get video info from JSON.
            globals.getSource("http://www.dailymotion.com/json/video/" + info.id, function(err, resp, body) {

                // Parse Dailymotion Video info JSON into an array.
                var jInfo = JSON.parse(body.replace(/\\\//, "/"));
                info.title = jInfo.title;
                info.duration = +jInfo.duration;
                info.thumbUrl = jInfo.thumbnail_url;
                info.uploader = jInfo.owner_fullname;
                info.viewCount = +jInfo.views_total;

                var qualities = Object.keys(jQuals.qualities);
                if (qualities.indexOf("auto") > -1) {
                    qualities.splice(qualities.indexOf("auto"), 1);
                }
                for (var i = 0; i < qualities.length; i++) {
                    var qual = jQuals.qualities[qualities[i]][0];
                    var height = qual.url.match(/(\d*?)x(\d*?)\//);
                    if (height != null) {
                        qual.height = +height[2];
                        addQuality(qual, info, qualities.length, cb);
                    }
                }
            });
        } else {
            cb(info);
        }
    });
};

exports.validateUrl = function(url) {
    return exports.getId(url) != "";
};
