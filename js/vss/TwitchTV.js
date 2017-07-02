const path = require('path');
const videostuff = require('../../js/videostuff');
const um = require('../../js/upm');
const globals = require("../globals");

exports.getHost = function() {
    return "http://www.twitch.tv/";
};

exports.getFavicon = function() {
    return "data:image/png;base64,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";
}

exports.getId = function(url) {
	if (!globals.isValidUrl(url)) return "";
	var matches = url.match(/twitch.tv\/.*?\/(.*?)\/(\d+)/);
	if (matches == null) return "";
	return (matches[1] == "b" ? "a" : matches[1]) + matches[2];
};

var qsGotten = 0;
var getQsList = function(qsUrl, qsBase, info, qsI, cb) {
    globals.getSource(qsUrl, function(err, resp, body) {
        qsGotten++;
        var qs = body.split("\n");
        for (var i = qs.length - 1; i >= 0; i--) {
            if (qs[i] == "" || qs[i].startsWith("#")) {
                qs.splice(i, 1);
            } else {
            	qs[i] = qsBase + "/" + qs[i];
            }
        }
        info.multiQualities[qsI].qs = qs;
        if (qsGotten == info.multiQualities.length) {
            qsGotten = 0;
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
    globals.getSource("http://api.twitch.tv/kraken/videos/" + info.id + "?on_site=1", function(err, resp, body) {
    	info.isValid = body.indexOf("error") == -1;

    	if (info.isValid) {
    		var jInfo = JSON.parse(body);

	        info.thumbUrl = jInfo.preview;
	        info.title = jInfo.title;
	        info.uploader = jInfo.channel.display_name;
	        info.viewCount = +jInfo.views;
	        info.duration = +jInfo.length;

	        //Check what type of VoD we have.
	        if (info.id[0] == "v") {
	        	globals.getSource("https://api.twitch.tv/api/vods/" + info.id.substring(1) + "/access_token?as3=t", function(err, resp, body) {
	        		var jPInfo = JSON.parse(body);
	        		var playlistUrl = "http://usher.twitch.tv/vod/" + info.id.substring(1) + "?nauthsig=" + jPInfo.sig + "&player=twitchweb&nauth=" + jPInfo.token.replace(/\\\"/g, '"') + "&allow_source=true&allow_spectre=true";
	        		globals.getSource(playlistUrl, function(err2, resp2, hls) {
	        			var qInfos = hls.split("\n");

	                    // Remove first and last entry, they are not needed.
	                    qInfos.shift();
	                    qInfos.pop();
	                    for (var qii = 0; qii < qInfos.length; qii++) {
	                        if (qInfos[qii] == "") continue;
	                        if (qInfos[qii].lastIndexOf("#EXT-X-MEDIA", 0) === 0) {
	                            info.multiQualities.push({type: ".flv", linkType: ".flv"});
	                            var mediaParts = qInfos[qii].split(",").map(function(obj) { return obj.split("="); });
	                            var qName = "";
	                            for (var ip = 0; ip < mediaParts.length; ip++) {
	                                if (mediaParts[ip][0] == "NAME") {
	                                   qName = mediaParts[ip][1].substring(1, mediaParts[ip][1].length - 1);
	                                   break;
	                                }
	                            }
	                            qii++; // Next line contains the stream info, go to it.
	                            var infoParts = qInfos[qii].split(",").map(function(obj) { return obj.split("="); });
	                            for (var ip = 0; ip < infoParts.length; ip++) {
	                                if (infoParts[ip][0] == "RESOLUTION") {
	                                	if (qName == "Source") {
	                                		info.multiQualities[info.multiQualities.length - 1].progScan = qName;
	                                	} else {
	                                		info.multiQualities[info.multiQualities.length - 1].progScan = infoParts[ip][1].substring(1, infoParts[ip][1].length - 1).split("x")[1] + "p";
	                                	}
	                                }
	                            }

	                            qii++; // Next line contains the m3u8 link, go to it.
	                            if (!qInfos[qii].startsWith("#")) {
	                                getQsList(qInfos[qii], path.parse(qInfos[qii]).dir, info, info.multiQualities.length - 1, cb);
	                            }
	                        }
	                    }
	        		});
	        	});
	        } else {

	        	// Raw flv files.
	        	globals.getSource("https://api.twitch.tv/api/videos/" + info.id, function(err, resp, body) {
	        		var jQuals = JSON.parse(body);
	        		for (var i = 0, keys = Object.keys(jQuals.chunks); i < keys.length; i++) {
	        			info.multiQualities.push({type: ".flv", progScan: (keys[i] == "live" ? "Source" : keys[i]), qs: jQuals.chunks[keys[i]].map(function(obj) { return obj.url; })});
	        		}
	        		cb(info);
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
