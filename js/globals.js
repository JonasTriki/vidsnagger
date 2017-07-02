const http = require('http');
const url = require('url');
const fs = require('fs');
const request = require('request');

exports.getUserAgent = function() {
	return "Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/47.0.2526.106 Safari/537.36";
}

exports.inBetween = function(a, b, c) {
	let startIndex = a.indexOf(b) + b.length;
	let endIndex = a.indexOf(c, startIndex);
	return a.substring(startIndex, endIndex);
}

exports.readFile = function(filePath, cb) {
    fs.readFile(filePath, "utf8", cb);
}

exports.isValidUrl = function(url) {
    let regex = /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/;
    return regex.test(url);
};

exports.getSource = function(url, cb) {
    request({url: url, followAllRedirects: true, headers: {"User-Agent": exports.getUserAgent(), "Accept": "*/*"}}, cb);
};

exports.getFileSize = function(url, cb) {
	request({url: url, followAllRedirects: true, method: "HEAD", headers: {"User-Agent": exports.getUserAgent(), "Accept": "*/*"}}, function(err, res) {
		if (err == null) {
			cb(+res.headers['content-length']); // Looks for the content-length header and returns it in bytes.
		} else {
			console.log("Error: " + err);
			cb(-1);
		}
	});
};

exports.isNumeric = function(n) {
	return /^\d+$/.test(n);
};

let binaryTypes = ["byte", "bytes", "kB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
exports.convertByte = function(bytes, decimals) {
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
};

exports.unicodeToChar = function(s) {
	return s.replace(/\\u[\dA-Fa-f]{4}/g, function(match) {
		return String.fromCharCode(parseInt(match.replace(/\\u/g, ''), 16));
	});
};

exports.spaceThousand = function(n) {
	let x = ("" + n).split(" ");
	let x1 = x[0];
	let x2 = (x.length > 1 ? " " + x[1] : "");
	let rgx = /(\d+)(\d{3})/;
	while (rgx.test(x1)) {
		x1 = x1.replace(rgx, "$1 $2");
	}
	return x1 + x2;
}

exports.secToDuration = function(sec) {
	if (sec > 60) {
		let d = new Date(sec * 1000);
		let ss = ("00" + Math.floor(d.getSeconds())).substr(-2);
		let mm = ("00" + Math.floor(d.getMinutes())).substr(-2);
		return mm + ":" + ss;
	} else {
		return Math.floor(sec) + "s";
	}
}

exports.fixFilePath = function(path) {
	let notAllowed = ["\\", "/", ":", "*", "?", '"', "<", ">", "|"];
	for (let i = 0; i < notAllowed.length; i++) {
		if (path.indexOf(notAllowed[i]) > -1) {
			path = path.replace(new RegExp("\\" + notAllowed[i], "g"), "");
		}
	}
	return path;
}

exports.circleProgress = function(circleObj, c, percent) {
    let ctx = circleObj.getContext('2d');
	let halfW = circleObj.width / 2;
    ctx.clearRect(0, 0, circleObj.width, circleObj.height);
    ctx.beginPath();
    ctx.strokeStyle = c;
    ctx.lineCap = 'square';
    ctx.closePath();
    ctx.fill();
    ctx.lineWidth = 4.0;

    let imd = ctx.getImageData(0, 0, circleObj.width, circleObj.height);
    ctx.putImageData(imd, 0, 0);
    ctx.beginPath();

    let circ = Math.PI * 2;
	let quart = Math.PI / 2;
    ctx.arc(halfW, halfW, halfW - ctx.lineWidth, -(quart), (circ * (percent / 100)) - quart, false);
    ctx.stroke();
    ctx.closePath();
}

exports.getAvgRGB = function(document, imgUrl, cb) {
	let blockSize = 5;
	let canvas = document.createElement("canvas");
	let context = canvas.getContext && canvas.getContext("2d");
	let data, width, height;
	let i = -4;
	let length;
	let rgb = {r: 0, g: 0, b: 0};
	let count = 0;
	let img = document.createElement("img");
	img.onload = function(e) {

		height = canvas.height = img.naturalHeight || img.offsetHeight || img.height;
    	width = canvas.width = img.naturalWidth || img.offsetWidth || img.width;

		context.drawImage(img, 0, 0);
		data = context.getImageData(0, 0, width, height).data;

		length = data.length;
		while ((i += blockSize * 4) < length) {
			++count;
        	rgb.r += data[i];
        	rgb.g += data[i+1];
        	rgb.b += data[i+2];
		}

		rgb.r = Math.floor(rgb.r / count);
	    rgb.g = Math.floor(rgb.g / count);
	    rgb.b = Math.floor(rgb.b / count);

	    cb(rgb);
	};
	img.crossOrigin = "";
	img.src = imgUrl;
}

exports.rgbToHex = function(rgb) {
    return "#" + ((1 << 24) + (rgb.r << 16) + (rgb.g << 8) + rgb.b).toString(16).slice(1);
}

exports.hexToRgb = function(hex) {
    let long = parseInt(hex.replace(/^#/, ""), 16);
    return { R: (long >>> 16) & 0xff, G: (long >>> 8) & 0xff, B: long & 0xff };
}

exports.changeImgColor = function(document, imgUrl, hexColor, cb) {
	let img = document.createElement("img");
	img.onload = function(e) {
		let canvas = document.createElement("canvas");
		canvas.width = img.width;
	    canvas.height = img.height;

		let ctx = canvas.getContext("2d");
	    ctx.drawImage(img, 0, 0);

	    let originalPixels = ctx.getImageData(0, 0, img.width, img.height);
	    let currentPixels = ctx.getImageData(0, 0, img.width, img.height);
		let color = this.hexToRgb(hexColor);

	    for (let i = 0; i < originalPixels.data.length; i += 4) {
	    	if (currentPixels.data[i + 3] > 0) {
	    		currentPixels.data[i] = originalPixels.data[i] / 255 * color.R;
	    		currentPixels.data[i + 1] = originalPixels.data[i + 1] / 255 * color.G;
	    		currentPixels.data[i + 2] = originalPixels.data[i + 2] / 255 * color.B;
	    	}
		}
	    ctx.clearRect(0, 0, canvas.width, canvas.height);
	    ctx.putImageData(currentPixels, 0, 0);
        cb(canvas.toDataURL("image/png"));
	}
	img.src = imgUrl;
}

exports.rgbLum = function(rgb, lum) {
	let hex = this.rgbToHex(rgb);
	// validate hex string
	hex = String(hex).replace(/[^0-9a-f]/gi, '');
	if (hex.length < 6) {
		hex = hex[0]+hex[0]+hex[1]+hex[1]+hex[2]+hex[2];
	}

	// convert to decimal and change luminosity
	let color = "#", c;
	for (let i = 0; i < 3; i++) {
		c = parseInt(hex.substr(i*2,2), 16);
		c = Math.round(Math.min(Math.max(0, c + (c * lum)), 255)).toString(16);
		color += ("00"+c).substr(c.length);
	}

	return color;
}

exports.ytSigFix = function(methodType, a, b) {
	switch (methodType) {
		case "splice":
			a.splice(0, b);
			break;
		case "reverse":
			a.reverse();
			break;
		case "modulus":
			let c = a[0];
			a[0] = a[b % a.length];
			a[b] = c;
			break;
	}
}

exports.downloadYtSig = function(sig, videoId, cb) {
	let baseRegex = /<script src="(.*?\/base.js)" name="player\/base"><\/script>/;
	let signFuncRegex = /function\([a-z]\){[a-z]\=[a-z]\.split\(""\);(.*?)return [a-z]\.join\(""\)};/;
	let _this = this;
	this.getSource("https://www.youtube.com/embed/" + videoId, function(ytErr, ytResp, ytBody) {
		let baseUrl = "https:" + ytBody.match(baseRegex)[1];

		_this.getSource(baseUrl, function(err, resp, baseBody) {

			// Start by finding the function and reading what it does.
			let signFunc = baseBody.match(signFuncRegex)[1].slice(0, -1).split(";");
			let signFuncMethods = (_this.inBetween(baseBody, "var " + signFunc[0].split(".")[0] + "={", "}};")).replace(/\s/g, "").split("},");
			let signFuncMethodTypes = {};
			for (let i = 0; i < signFuncMethods.length; i++) {
				let name = signFuncMethods[i].split(":")[0];
				if (signFuncMethods[i].indexOf("splice") > -1) {
					signFuncMethodTypes[name] = "splice";
				} else if (signFuncMethods[i].indexOf("reverse") > -1) {
					signFuncMethodTypes[name] = "reverse";
				} else if (signFuncMethods[i].indexOf("%") > -1) {
					signFuncMethodTypes[name] = "modulus";
				}
			}
			signFunc = signFunc.map(function(val) {
				let dotSplit = val.split(".");
				let method = dotSplit[1].split("(")[0];
				let methodType = signFuncMethodTypes[method];
				return {
					methodType: methodType,
					b: +_this.inBetween(dotSplit[1], "(", ")").split(",")[1]
				};
			});

            // Write data for file
            let data = "";
            for (let i = 0; i < signFunc.length; i++) {
                let a = "";
                switch (signFunc[i].methodType) {
                    case "splice":
                        a = "0";
                        break;
                    case "reverse":
                        a = "1";
                        break;
                    case "modulus":
                        a = "2";
                        break;
                }
                data += a + "_" + signFunc[i].b + ((i < signFunc.length - 1) ? "|" : "");
            }

            fs.writeFile("yt_sig", data, function(err) {
                if (err) throw err;
                cb(data);
            });
		});
	});
}

exports.decipherSignature = function(signature, videoId, cb) {

    // Check yt_sig file exsists/modified date.
	let _this = this;
    fs.stat("yt_sig", function(statsErr, stats) {
        let download = false;
        if (statsErr) {
            if (statsErr.code = "ENOENT") {

                // File does not exsist, download.
                download = true;
            }
            throw statsErr;
        } else {
            let modified = Math.floor(stats.mtime / 1000);
            let now = Date.now() / 1000;
            let day = 43200;
            download = (modified + day <= now); // Modified >= 12 hours from Date.now().
        }
        if (download) {
            _this.downloadYtSig(signature, videoId, function(yt_sig) {
                cb(_this.decipherSig(signature, yt_sig));
            });
        } else {
            _this.readFile("yt_sig", function(err, yt_sig) {
                if (err) {
                    throw err;
                } else {
                    cb(_this.decipherSig(signature, yt_sig));
                }
            });
        }
    });
}

exports.decipherSig = function(sig, yt_sig) {

    // Decipher the signature
    let signature = sig.split("");
    let ytSigSplitted = yt_sig.split("|");
    for (let i = 0; i < ytSigSplitted.length; i++) {
        let info = ytSigSplitted[i].split("_");
        let b = info[1];
        switch (info[0]) {
            case "0":
				signature.splice(0, b);
				break;
            case "1":
				signature.reverse();
				break;
            case "2":
				let c = signature[0];
				signature[0] = signature[b % signature.length];
				signature[b] = c;
				break;
        }
    }
    return signature.join("");
}
