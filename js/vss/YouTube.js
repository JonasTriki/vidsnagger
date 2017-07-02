const videostuff = require('../../js/videostuff');
const um = require('../../js/upm');
const globals = require("../globals");

var decodeSource = function(s) {
    s = s.replace(/2525/g, "");
    s = s.replace(/%253A/g, ":");
    s = s.replace(/%252F/g, "/");
    s = s.replace(/%253F/g, "?");
    s = s.replace(/%253D/g, "=");
    s = s.replace(/%252C/g, ",");
    s = s.replace(/%2526/g, "&");
    s = s.replace(/%253B/g, ";");
    s = decodeURIComponent(decodeURIComponent(s));
    s = globals.unicodeToChar(s);
    return s;
}

exports.getHost = function() {
    return "https://www.youtube.com/";
}

exports.getFavicon = function() {
    return "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAMAAABEpIrGAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAACT1BMVEUAAADlLSjnLSjjLCbCGR7AGB2+Fhm/FxvkLSfkLSfkLSflLSflLSflLSflLSflLSflLSflLSflLSflLSflLSfjLCbjLCfkLCfkLCfkLCfkLCfkLCfkLCfkLCfkLCfkLCfkLCfkLCfhKybiKybiKybgKibhKibfKSXfKSXdKSXbJyTbKCXbJSLaJyThU1Hofn3cNzXZJCHYJiTla2n9+fnzzs7icnHZMS/XJSPjaWj+/Pz79/fsv7/eZmXXLSziaWj17u7msrHbXVzWKyvhaGfw5ubgkJDUKyvgZ2f77OzqoKDXR0fRIyTfZmf88PDsqanZTU7QIiLOICHdZmf+/Pz88/PtsLHZUlTPIiPMHyHaXF7utLTZWVrNIyXLHiDNJijMJCbJHSDHHB/GGx/GGx/EGh7EGh7DGh7CGR7CGR7CGR7BGB7BGB7BGB3BGB3BGB3BGB3BGB3BGB3BGB3BGB3BGB3BGB3BGB3BGB3BGB3BGB3BGB3BGB3BGB7AGB3AGB3AGB3AGB3AFx3AFx3AFx3AFx3AFx3AFx3AFx3AFx3AFx3AFx3AFx3AFx3AFx3AFx3AFx3AGB3AGB3AGB3kLCfiKybhKibfKSXdKSXbJyTbJiPaJyTZJCLaJiPYJiTYIiDYIyHYJSPXJSPWIR/////WIiDXJCLVJCPUIB/+///VIyPTIyLTHx77/f3TIiLRIiLRHh7QISHPHR7PHx/OICHNHB3NHR/OHyHMHyHMHB7MHiDLHiDLHSDKGx3JHSDJHB/HHB/GGx/EGh7CGR7BGB1IOdxgAAAAlHRSTlMAAAAAAAAAAAwdKTM8Q0hNUlZXWVoKY7ze5+zw9Pb5+/3+BYD4OuaF/rrT/v7l+vX6/vL8/Pj2+vv8/v349vv8/fj3/Pz88vj8+vb4/fz79vf9+/z9/Pb3/PL69fb85Pz707qE/jrlBH73Clyx1ubr8PP19/r7/f78+PbcumIIGCYxOkBFSk9SVVhaWVZRTEdBJxsLbcgJpAAAAQFJREFUGBnNwc8qRVEYxuH3961v7W2i5BKUyzExRpIoiSMjFyEyoOQYqVOG7ouBifw550PZ6yxqG5/n0QxA0FBRVN4iSItUjiWdRuWJJThSn7MIlhmo33m4gfpZmA34x8AcVFxwEPoNT6YOiUv2J6oly2kqf7nOTapka3yqaQ5zHg7bOS8aRiq4et9TvgJ2x+qYV7Kk9+39lIatT6nA9e0mA64fbirIku5p2ZqoYHVLHW75tsFYxa23rg4tsMZErqL1nNQhsx6hpEr2lFRsKtBvyTFV0B8Yd/zjDjdQPwszG9FrZIbvUFuRHmzsvETEPDxeI+UTKoKPDDzHAhzzqhnwCZIlT6Ea/PCeAAAAAElFTkSuQmCC";
}

exports.getId = function(url) {
    if (!globals.isValidUrl(url)) return false;
    if (url.lastIndexOf("https://", 0) === 0) {
        url = url.substring(8);
    }
    if (url.lastIndexOf("www.", 0) === 0) {
        url = url.substring(4);
    }
    var videoId = "";
    if (url.lastIndexOf("youtube.", 0) === 0) {
        if (url.indexOf("/") > -1) {
            var p = url.split("/")[1];
            if (p.lastIndexOf("watch?v=", 0) === 0 || p.lastIndexOf("watch#v=", 0) === 0) {
                // watch?v=XHH6NMyxjuU or watch#v=XHH6NMyxjuU
                videoId = p.substring(8).split("&")[0];
            } else if (p == "v" || p == "embed") {
                // v/XHH6NMyxjuU
                videoId = url.split("/")[2];
            } else {
                // watch?something=blabla&featured=blabla&v=XHH6NMyxjuU
                var paraSplit = url.split("&");
                for (i = 0; i < paraSplit.length; i++) {
                    if (paraSplit[i].lastIndexOf("v=", 0) === 0) {
                        videoId = paraSplit[i].substring(2);
                    }
                }
            }
        }
    } else if (url.lastIndexOf("youtu.be", 0) === 0) {
        videoId = url.split("/")[1];
    }
    if (videoId.length == 11) {
        return videoId;
    } else {
        return "";
    }
}

var getiTagInfo = function(itag) {
    switch(itag) {
        case "5":
            return "240p|flv";
            break;
        case "6":
            return "270p|flv";
            break;
        case "13":
            return "176p|3gp";
            break;
        case "17":
            return "144p|3gp";
            break;
        case "18":
            return "360p|mp4";
            break;
        case "22":
            return "720p|mp4";
            break;
        case "34":
            return "360p|flv";
            break;
        case "35":
            return "480p|flv";
            break;
        case "36":
            return "240p|3gp";
            break;
        case "37":
            return "1080p|mp4";
            break;
        case "38":
            return "3072p|mp4";
            break;
        case "43":
            return "360p|webm";
            break;
        case "44":
            return "480p|webm";
            break;
        case "45":
            return "720p|webm";
            break;
        case "46":
            return "1080p|webm";
            break;
        case "82":
            return "360p 3D|mp4";
            break;
        case "83":
            return "240p 3D|mp4";
            break;
        case "84":
            return "720p 3D|mp4";
            break;
        case "85":
            return "1080p 3D|mp4";
            break;
        case "100":
            return "360p 3D|webm";
            break;
        case "101":
            return "360p 3D|webm";
            break;
        case "102":
            return "720p 3D|webm";
            break;

        // DASH

        case "133":
            return "240p|mp4|v";
            break;
        case "134":
            return "360p|mp4|v";
            break;
        case "135":
            return "480p|mp4|v";
            break;
        case "136":
            return "720p|mp4|v";
            break;
        case "137":
            return "1080p|mp4|v";
            break;
        case "138":
            return "2160p|mp4|v";
            break;
        case "160":
            return "144p|mp4|v";
            break;
        case "242":
            return "240p|webm|v";
            break;
        case "243":
            return "360p|webm|v";
            break;
        case "244":
            return "480p|webm|v";
            break;
        case "247":
            return "720p|webm|v";
            break;
        case "248":
            return "1080p|webm|v";
            break;
        case "264":
            return "1440p|mp4|v";
            break;
        case "266":
            return "2160p|mp4|v";
            break;
        case "271":
            return "1440p|webm|v";
            break;
        case "272":
            return "2160p|webm|v";
            break;
        case "278":
            return "144p|webm|v";
            break;
        case "298":
            return "360p|mp4|v";
            break;
        case "299":
            return "480p|mp4|v";
            break;
        case "302":
            return "360p|webm|v";
            break;
        case "303":
            return "480p|webm|v";
            break;
        case "308":
            return "1440p|webm|v";
            break;
        case "313":
            return "2160p|webm|v";
            break;
        case "315":
            return "2160p|webm|v";
            break;

        // DASH - audio only.

        case "139":
            return "48|m4a|a";
            break;
        case "140":
            return "128|m4a|a";
            break;
        case "141":
            return "256|m4a|a";
            break;
        case "171":
            return "128|webm|a";
            break;
        case "172":
            return "192|webm|a";
            break;
        case "249":
            return "48|webm|a";
            break;
        case "250":
            return "64|webm|a";
            break;
        case "251":
            return "160|webm|a";
            break;

        // Anything else?
        default:
            return "0p";
            break;
    }
}

var addQuality = function(dlUrl, info, count, cb) {
    var upm = new um(dlUrl);

	// Remove xtags
	upm.removeArg("xtags");

    // Gotta decypher the signature to continue downloading the url.
	let sArg = upm.getArgs()["s"];
    if (sArg != null) {
		globals.decipherSignature(sArg, info.id, function(newSig) {
			upm.removeArg("s");
			upm.addArg("signature", newSig);
        	addQualityOk(upm.getUrl(), upm, info, count, cb);
		});
    } else {
        addQualityOk(upm.getUrl(), upm, info, count, cb);
    }
}

var addQualityOk = function(dlUrl, upm, info, count, cb) {
    var quality = new videostuff.videoQuality();
    var isAudio = false;
    var itag = upm.getArgs()["itag"];
    var itagInfo = getiTagInfo(itag).split("|");

    if (itagInfo.length ==  2) {
        quality.progScan = itagInfo[0];
    } else if (itagInfo.length ==  3) {
        if (itagInfo[2] == "a") {
            isAudio = true;
            quality = new videostuff.audioQuality();
            quality.kbits = itagInfo[0];
        } else if (itagInfo[2] == "v") {
            quality.onlyVideo = true;
            quality.isMuted = true;
            quality.progScan = itagInfo[0];
        }
    }
    quality.type = "." + itagInfo[1];

    info.duration = Math.floor(upm.getArgs()["dur"]);
    globals.getFileSize(dlUrl, function(size) {
        quality.downloadUrl = dlUrl;
        quality.size = size;

        if (!isAudio) {
            info.videoQualities.push(quality);
        } else {
            info.audioQualities.push(quality);
        }
        if (count == (info.videoQualities.length + info.audioQualities.length)) {
            cb(info); // Callback the info var with audio/video qualities.
        }
    });
}

var addNextRegex = /(.*?),([a-zA-Z]+?=.*)/;
var getQuals = function(map, source) {
    var urlMap = decodeURIComponent(decodeURIComponent(new RegExp(map + "=([^&]+)", "g").exec(source)[1]));
    if (urlMap.lastIndexOf("url=", 0) === 0) {
        urlMap = "&" + urlMap; // Starts with "url=", add '&' so it gets added to array.
    }
    let urlSplit = urlMap.split("&url=");
    let addToNext = "";
    let quals = [];
    for (let i = 0; i < urlSplit.length; i++) {
        let curUrl = urlSplit[i];
        let addNext = curUrl.match(addNextRegex);
        if (curUrl.indexOf("videoplayback") == -1) {
            addToNext = "&" + curUrl;
        } else if (addNext != null) {
            quals.push(addNext[1] + addToNext);
            addToNext = "&" + addNext[2];
        } else {
            quals.push(curUrl + addToNext);
            addToNext = "";
        }
    }
    return quals;
}

exports.getInfo = function(url, cb) {
    var info = new videostuff.downloadInfo();
    info.url = url;
    info.id = exports.getId(url);
    info.videoQualities = [];
    info.audioQualities = [];
    globals.getSource("http://www.youtube.com/get_video_info?video_id=" + info.id + "&asv=3&el=detailpage&hl=en_US&sts", function(err, resp, body) {
        var videoSource = body;
        if (videoSource == undefined) return;

        //console.log("s: " + videoSource);
        var streamMaps = ["url_encoded_fmt_stream_map", "adaptive_fmts"];
        info.isValid = videoSource.indexOf(streamMaps[0]) > -1;
        if (info.isValid) {
            info.thumbUrl = "http://img.youtube.com/vi/" + info.id + "/default.jpg";
            info.title = decodeURIComponent(/title=([^&]+)/g.exec(videoSource)[1]).replace(/\\\//g, "/").replace(/\+/g, " ");
            info.uploader = decodeURIComponent(/author=([^&]+)/g.exec(videoSource)[1]).replace(/\\\//g, "/").replace(/\+/g, " ");
            info.viewCount = decodeURIComponent(/view_count=(\d*)/g.exec(videoSource)[1]);

            // Add qualities from the stream maps.
            var qualities = [];
            for(var sm = 0; sm < streamMaps.length; sm++) {
                var map = streamMaps[sm];
                if (sm == 0 || videoSource.indexOf(map) > -1) {
                    Array.prototype.push.apply(qualities, getQuals(map, videoSource)); // += the array.
                }
            }

            // Interate through the qualities and add em!
            for (var i = 0; i < qualities.length; i++) {
                addQuality(qualities[i], info, qualities.length, cb);
            }
        } else {
            cb(info);
        }
    });
}

exports.validateUrl = function(url) {
    return exports.getId(url) != "";
}
