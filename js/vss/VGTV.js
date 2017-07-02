const path = require('path');
const videostuff = require('../../js/videostuff');
const globals = require("../globals");

exports.getHost = function() {
    return "http://www.vgtv.no/";
};

exports.getFavicon = function() {
    return "data:image/png;base64,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";
}

exports.getId = function(url) {
	if (!globals.isValidUrl(url)) return "";
	if (url.lastIndexOf("http://", 0) === 0) {
        url = url.substring(7);
    }
    if (url.lastIndexOf("www.", 0) === 0) {
        url = url.substring(4);
    }
    var videoId = "";
    if (url.lastIndexOf("vgtv.", 0) === 0) {
		if (url.lastIndexOf("vgtv.no/?id=", 0) === 0) {
			videoId = url.replace(/vgtv\.no\/\?id=/, "");
		} else if (url.lastIndexOf("vgtv.no/#!id=", 0) === 0) {
			videoId = url.replace(/vgtv.no\/#!id=/, "");
		} else if (url.lastIndexOf("vgtv.no/#!/video/", 0) === 0) {
			videoId = url.replace(/vgtv.no\/#!\/video\//, "").split("/")[0];
		} else {
			return "";
		}
    } else {
    	return "";
    }
    if (globals.isNumeric(videoId)) {
    	return videoId;
    } else {
    	return "";
    }
};

var tsGotten = 0;
var getTsList = function(tsUrl, info, tsI, cb) {
    globals.getSource(tsUrl, function(err, resp, body) {
        tsGotten++;
        var ts = body.split("\n");
        for (var i = ts.length - 1; i >= 0; i--) {
            if (ts[i] == "" || ts[i].lastIndexOf("#", 0) === 0) {
                ts.splice(i, 1);
            }
        }
        info.multiQualities[tsI].qs = ts;
        if (tsGotten == info.multiQualities.length) {
            tsGotten = 0;
            cb(info);
        }
    });
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

exports.getInfo = function(url, cb) {
    var info = new videostuff.downloadInfo();
    info.url = url;
    info.id = exports.getId(url);
    info.videoQualities = [];
    info.audioQualities = [];
    info.multiQualities = [];
    globals.getSource("http://svp.vg.no/svp/api/v1/vgtv/assets/" + info.id + "?additional=settings|chapters|cuePoints|externalId|barrels|externalCategoryId|nextAsset&appName=vgtv-website", function(err, resp, body) {
    	var jInfo = JSON.parse(body);

    	info.isValid = jInfo.status == "active";
    	if (info.isValid) {

            // Get video info from JSON.
            info.title = jInfo.title;
            info.duration =  Math.floor(jInfo.duration / 1000);
            info.thumbUrl = jInfo.images.main + "?t[]=281x158q80";
            info.uploader = "VG";
            info.viewCount = jInfo.displays;

            // Check if VoD or livestream.
            if (jInfo.streamType == "vod") {
                info.multiQualities = null;

                // VoD, download normally.
                var mp4Split = jInfo.streamUrls.mp4.split("/");
                var dlUrl = jInfo.streamUrls.mp4.substring(jInfo.streamUrls.mp4.indexOf(mp4Split[mp4Split.length - 1]), 0);

                // Get quals
                var qualsSplit = jInfo.streamUrls.hls.split("/");
                qualsSplit = qualsSplit[qualsSplit.length - 2].split(",");

                var qualities = [];
                for (var qi = 0; qi < qualsSplit.length; qi++) {
                    if (qualsSplit[qi] != "") {
                        if (globals.isNumeric(qualsSplit[qi][0])) {
                            qualities.push(qualsSplit[qi]);
                        }
                    }
                }

                for (var i = 0; i < qualities.length; i++) {
                    addQuality({url: dlUrl + qualities[i] + ".mp4", progScan: qualities[i].split("_")[1] + "p"}, info, qualities.length, cb);
                }
            } else if (jInfo.streamType = "wasLive") {

                // VoD from livestream, combine TS files to one and convert to mp4 with ffmpeg.
                tsGotten = 0;
                globals.getSource(jInfo.streamUrls.hls, function(err2, resp2, hls) {
                    var qInfos = hls.split("\n");

                    // Remove first and last entry, they are not needed.
                    qInfos.shift();
                    qInfos.pop();
                    for (var qii = 0; qii < qInfos.length; qii++) {
                        if (qInfos[qii] == "") continue;
                        if (qInfos[qii].lastIndexOf("#EXT-X-STREAM-INF", 0) === 0) {
                            info.multiQualities.push({audioOnly: true, linkType: ".ts", type: ".mp4"});
                            var infoParts = qInfos[qii].split(",").map(function(obj) { return obj.split("="); });
                            var bw = 0;
                            for (var ip = 0; ip < infoParts.length; ip++) {
                                if (infoParts[ip][0] == "BANDWIDTH") {
                                    bw = +infoParts[ip][1];
                                }
                                if (infoParts[ip][0] == "RESOLUTION") {
                                   info.multiQualities[info.multiQualities.length - 1].audioOnly = false;
                                   info.multiQualities[info.multiQualities.length - 1].progScan = infoParts[ip][1].split("x")[1] + "p";
                                }
                            }
                            if (info.multiQualities[info.multiQualities.length - 1].audioOnly) {
                                info.multiQualities[info.multiQualities.length - 1].kbits = bw / 1000;
                            }
                            qii++; // Next line contains the m4u8 link, goto it.
                            if (qInfos[qii].lastIndexOf("http://", 0) === 0) {
                                getTsList(qInfos[qii], info, info.multiQualities.length - 1, cb);
                            }
                        }
                    }
                });
            }
    	} else {
            cb(info);
        }
    });
};

exports.validateUrl = function(url) {
	return exports.getId(url) != "";
};
