const path = require('path');
const videostuff = require('../../js/videostuff');
const um = require('../../js/upm');
const globals = require("../globals");

exports.getHost = function() {
    return "https://vimeo.com/";
};

exports.getFavicon = function() {
    return "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAC80lEQVRYhcWXTUgUYRjHf+/sjK666oZaapIQmiXYxyUjTaMiCcJiiY5ll27RRTpVkEGX6NKpS9cgQjGEDhKUH6RRCmJlkR8Jopuu3+vq7s7udFBr15nR2cLmuS3zzPP/Pf/ned/dFZqmIZrmsoH7wAUgj+2NCeAlcEfzuH2Cxtls4B1QvM3CG2MYOCYB92wQB9gLNEiAxwbx9bgoAbk2AuRKNooDYDuAbDUx3ylxeqdM71yEzwsRwxwBnMtVqM1TKEwVTAU1Hn0P0jdvnG8JQJHgdomTW/uScToEoShUt/vpnlHj8tJlwYvyNGp2xZeszVMoaV3gZ1AzrL/pCApSJNqrXNw94MTpEAAkSdBQ6ozLE8Czo6k6cYBMRXC1MMlUw9SBsgwHryrSKEjRM57MltmhCGbDq13V5imcz1VMRQ5lOkyfGTpQlS3TWe0yFIfVsVTn/GG/tFuha0YlGDUWSZNFYgBH3A5kCR58W6HDpxqlcDimqysfAxx/6+fy+yXD3CG/CRkmI3g8GKR5PMxoIEpOsmCkJkPXxcEYgPX1GloyFmrxhk0BDB3QgNHAarGpoEbTuL5Aabp+riey9P0MLEZomzJ20RRgY7RM6AGKXBLJMW/LAm4W6be9YSCI8QFMAKB1UkXdUMUhYH+MC3WFSXGfAbpmVJ6PhTatbQlgPqzxYVZvY8Wa5UUuiYdlKXHPglG43ru8afeWAQDeGMyxvjgZT75Ca4ULtxK/pPX9y3wyubJjQ9A4uxUkAJVZMh3VLkuwzeNhPN1LW3YPCTjQNaMyF966ZP9ChLqegCXxhAAimvFpiI1Bf5SznUvMWwBNGADg6Q/zjf66GOFMpx/vivmt988AbT6V15P6ZWzzqVS2+X9fXtsGAHCtJ8CXte2eDmnc6FvmVIef6ZB122PD8imIDVnAnlSJseUoocSbjq/1Ny+pGgybfPEkGrb/KJUAr436XglothGg2c4/pyNAuaR53D6gAnjC/xmHd02rXPO4p34Bf5X2ZdqnsV8AAAAASUVORK5CYII=";
}

exports.getId = function(url) {
    if (!globals.isValidUrl(url)) return false;
    if (url.lastIndexOf("https://", 0) === 0) {
        url = url.substring(8);
    }
    if (url.lastIndexOf("www.", 0) === 0) {
        url = url.substring(4);
    }
    if (url.lastIndexOf("vimeo.com/", 0) === 0) {
        url = url.substring(10);
        if (url.indexOf("/") > -1) {
            var slashSplit = url.split("/");
            url = slashSplit[slashSplit.length - 1];
        }
        if (globals.isNumeric(url) && (url.length == 7 || url.length == 8 || url.length == 9)) return url;
    }
    return "";
};

var addQuality = function(qual, info, count, cb) {
    var quality = new videostuff.videoQuality();
    var upm = new um(qual.url);
    quality.progScan = qual.progScan;
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
    // "http://vimeo.com/api/v2/video/" & clip_id & ".json" <-------- get desc from there.
    globals.getSource("https://player.vimeo.com/video/" + info.id + "/config", function(err, resp, body) {
        var videoSource = body;
        if (videoSource == undefined) return;

        info.isValid = videoSource.indexOf('"request":') > -1 && videoSource.indexOf('"files":') > -1;
        if (info.isValid) {

            // Parse Vimeo JSON into an array.
            var jSource = JSON.parse(videoSource);
            console.log(jSource);

            // Get video info from JSON.
            info.title = jSource.video.title;
            info.duration = +jSource.video.duration;
            info.thumbUrl = jSource.video.thumbs.base;
            info.uploader = jSource.video.owner.name;
            info.viewCount = -1;

            for (var qi = 0, quals = jSource.request.files.progressive; qi < quals.length; qi++) {
                addQuality({url: quals[qi].url, progScan: quals[qi].quality}, info, quals.length, cb);
            }
        } else {
            cb(info);
        }
    });
};

exports.validateUrl = function(url) {
    return exports.getId(url) != "";
};
