const path = require('path');
const videostuff = require('../../js/videostuff');
const um = require('../../js/upm');
const globals = require("../globals");

exports.getHost = function() {
    return "http://www.plays.tv/";
};

exports.getFavicon = function() {
    return "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAEhElEQVR4Ae2WW2wUVRjHjyQ++OCLlxdjTHwyGh8UREm1uwKild4AQcRWwFuxiZJoYuILjLQ70Mqudnc7s7TdXugNLI0xiImCEoK1MUUSE8EYfIAQU0oNtdvrdtnt5/8/k1knsLa71cSXTvI7nc7unO93vu87M6sWj8Vj3kPTljylBx/y+oy3PD7D9PrMb7y68Sv+Dnt1M0Z4zmv8jN/J1+t3eKqMB3kvUHPBISMIerfHZ+5EgH6QWLXvgKypabBYDZ7B/4TXvYA8vTeShvdAqM/rq397hRa4A6hM3HRhWUXFrZ5q4z1McJkBCmobpXB/U5rnP2qyrj1bCwlAIUeEuCUcPLp5kSJY7i1zZptpozUnWuuPyrqPWyxKA81SCIpwrQgC5DkLijRSIluRE/nVofuBcuBg4wsvzdfN3znR+k9aZVOwTTbUtVnnGywJW6TEH0UmolKAbBBbgjgSJF2aTBK/caFAEWt4Uqu7D/W+xAleDLXL5nC7bCLBg7KxjiKtELGzUQKccqz1p8tCEZbG3SeUcLixP855Nf9dQCkOCH6EHzBoeaRLXjY65aX6DopQKJ0NilCirL49icDJAqy6yM4Iy0IRd0bczZpJogGwBEYets4sJ3q18ZBsO9BtSZRDoizcIVtCjshBeQEinLjj1A+J/l8ujFZEuidX7YswCxRxsgEa5+sPCsTBwwr724/ay3pM/ka0BxKHZTsktkYo0ulkwwYSDNB1ekB4DF0bmWo63hdDb8yw9pRwi8zVH5RA5jXFzoSJFCG1Fa298npTj7wGCWZjawNFuuQVSJQbtgQDHDp9RlKJhExNTsn1eDx17uLlsV3dx8YweYpB2ajFbFL3tgXubbuaArrxhULws7QhW8xO2dHWK2+2HIHIp7Kd2Wj4uyxlEGETHv7OFhgfn7CIT0/L5MTkzPGzP8cqm3qmkIHZ4oCTjegN25bYDYrFn6HA9+7mWIdGYwaYDYqwLE5GWBqWqqfvR7dAWkKSycTRgZ+GiwPNSW5bgnNkAyLElRFmgYtnD3S5BdgPtCvECjai5li1s3qCUjVbGUjG4xKLjckYQBlmLw0Ojdd89vUoVp1iUPuZYT+8bAE7C1Yp0o1ofKX44sjw1KKdm/T1R7SgRE/0ybXhP+TK4BUZvjo8jYyMlPqbpx77MOR8Nyu4AayXDkyuZnvT0t1Bafu2X6ZHR5MD5y/8ubOlN7ZsdzCVV23w81xgE65UGBQE3sn2pse1kNQdOzkNiZGVeyOJ5XvCvJ4zeOectF7XGMgS7MmObG/Gw+f6E1Vh7uOFBdfNCU+V+ShQigOwX8O62ZrlBPy70OAzePpuBopwcMNtWQkGFxpgnrQPYbElQDlwuIk8LXwPvryHr87/LLhufp5XZT4AlBsO/8z7tbd79PAa3FzDxyakznPHMI05rPpUvq++FKhMcMiaFe8Gblv+QfhOZGb/fKmGaDO3GVBzwSFnEGBXps4GR/OrzW2UBCobOOQMS8KgyMQ4zr8ElfxVBVSucMgZ/IAp5q9crxa8F6h/A4f/lUWBvwAftReS37KMhAAAAABJRU5ErkJggg==";
}

exports.getId = function(url) {
    if (!globals.isValidUrl(url)) return "";
	var match = url.match(/plays.tv\/video\/([A-Fa-f0-9]{18}?)/);
	if (match == null) return "";
	return match[1];
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
    globals.getSource("http://plays.tv/video/" + info.id, function(err, resp, body) {

    	info.isValid = body.indexOf("<video poster") > -1;
    	if (info.isValid) {

    		var titleTag = body.match(/<title>(.+?)<\/title>/)[1].split(" - ");
            info.uploader = titleTag[0];
    		info.title = titleTag[1];
    		var dur = body.match(/\\"duration\\">(.+?)<\\\/span>/)[1].split(":");
            info.duration = +dur[0] * 60 + +dur[1];
            info.thumbUrl = body.match(/<meta property="og:image" content="(.+?)480.jpg">/)[1] + "360.jpg";
            info.viewCount = +body.match(/views_text\\">(.+?) views/)[1].replace(/,/g, "");

            var qualities = [];
            var qualReg = /<source res=\\"(.+?)\\" src=\\"(.+?)\\".*?>/g;
            var match = qualReg.exec(body);
            while (match != null) {
                qualities.push(match);
                match = qualReg.exec(body);
            }

            for (var i = 0; i < qualities.length; i++) {
                addQuality({progScan: qualities[i][1] + "p", url: "http:" + qualities[i][2].replace(/\\\//g, "/")}, info, qualities.length, cb);
            }
    	} else {
            cb(info);
        }
    });
};

exports.validateUrl = function(url) {
    return exports.getId(url) != "";
};
