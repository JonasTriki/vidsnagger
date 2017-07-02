const path = require('path');
const videostuff = require('../../js/videostuff');
const um = require('../../js/upm');
const globals = require("../globals");
//const cryptoJS = require('node-cryptojs-aes').CryptoJS;

exports.getHost = function() {
    return "http://www.veoh.com/";
};

exports.getFavicon = function() {
    return "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAACXBIWXMAAAsTAAALEwEAmpwYAAAKT2lDQ1BQaG90b3Nob3AgSUNDIHByb2ZpbGUAAHjanVNnVFPpFj333vRCS4iAlEtvUhUIIFJCi4AUkSYqIQkQSoghodkVUcERRUUEG8igiAOOjoCMFVEsDIoK2AfkIaKOg6OIisr74Xuja9a89+bN/rXXPues852zzwfACAyWSDNRNYAMqUIeEeCDx8TG4eQuQIEKJHAAEAizZCFz/SMBAPh+PDwrIsAHvgABeNMLCADATZvAMByH/w/qQplcAYCEAcB0kThLCIAUAEB6jkKmAEBGAYCdmCZTAKAEAGDLY2LjAFAtAGAnf+bTAICd+Jl7AQBblCEVAaCRACATZYhEAGg7AKzPVopFAFgwABRmS8Q5ANgtADBJV2ZIALC3AMDOEAuyAAgMADBRiIUpAAR7AGDIIyN4AISZABRG8lc88SuuEOcqAAB4mbI8uSQ5RYFbCC1xB1dXLh4ozkkXKxQ2YQJhmkAuwnmZGTKBNA/g88wAAKCRFRHgg/P9eM4Ors7ONo62Dl8t6r8G/yJiYuP+5c+rcEAAAOF0ftH+LC+zGoA7BoBt/qIl7gRoXgugdfeLZrIPQLUAoOnaV/Nw+H48PEWhkLnZ2eXk5NhKxEJbYcpXff5nwl/AV/1s+X48/Pf14L7iJIEyXYFHBPjgwsz0TKUcz5IJhGLc5o9H/LcL//wd0yLESWK5WCoU41EScY5EmozzMqUiiUKSKcUl0v9k4t8s+wM+3zUAsGo+AXuRLahdYwP2SycQWHTA4vcAAPK7b8HUKAgDgGiD4c93/+8//UegJQCAZkmScQAAXkQkLlTKsz/HCAAARKCBKrBBG/TBGCzABhzBBdzBC/xgNoRCJMTCQhBCCmSAHHJgKayCQiiGzbAdKmAv1EAdNMBRaIaTcA4uwlW4Dj1wD/phCJ7BKLyBCQRByAgTYSHaiAFiilgjjggXmYX4IcFIBBKLJCDJiBRRIkuRNUgxUopUIFVIHfI9cgI5h1xGupE7yAAygvyGvEcxlIGyUT3UDLVDuag3GoRGogvQZHQxmo8WoJvQcrQaPYw2oefQq2gP2o8+Q8cwwOgYBzPEbDAuxsNCsTgsCZNjy7EirAyrxhqwVqwDu4n1Y8+xdwQSgUXACTYEd0IgYR5BSFhMWE7YSKggHCQ0EdoJNwkDhFHCJyKTqEu0JroR+cQYYjIxh1hILCPWEo8TLxB7iEPENyQSiUMyJ7mQAkmxpFTSEtJG0m5SI+ksqZs0SBojk8naZGuyBzmULCAryIXkneTD5DPkG+Qh8lsKnWJAcaT4U+IoUspqShnlEOU05QZlmDJBVaOaUt2ooVQRNY9aQq2htlKvUYeoEzR1mjnNgxZJS6WtopXTGmgXaPdpr+h0uhHdlR5Ol9BX0svpR+iX6AP0dwwNhhWDx4hnKBmbGAcYZxl3GK+YTKYZ04sZx1QwNzHrmOeZD5lvVVgqtip8FZHKCpVKlSaVGyovVKmqpqreqgtV81XLVI+pXlN9rkZVM1PjqQnUlqtVqp1Q61MbU2epO6iHqmeob1Q/pH5Z/YkGWcNMw09DpFGgsV/jvMYgC2MZs3gsIWsNq4Z1gTXEJrHN2Xx2KruY/R27iz2qqaE5QzNKM1ezUvOUZj8H45hx+Jx0TgnnKKeX836K3hTvKeIpG6Y0TLkxZVxrqpaXllirSKtRq0frvTau7aedpr1Fu1n7gQ5Bx0onXCdHZ4/OBZ3nU9lT3acKpxZNPTr1ri6qa6UbobtEd79up+6Ynr5egJ5Mb6feeb3n+hx9L/1U/W36p/VHDFgGswwkBtsMzhg8xTVxbzwdL8fb8VFDXcNAQ6VhlWGX4YSRudE8o9VGjUYPjGnGXOMk423GbcajJgYmISZLTepN7ppSTbmmKaY7TDtMx83MzaLN1pk1mz0x1zLnm+eb15vft2BaeFostqi2uGVJsuRaplnutrxuhVo5WaVYVVpds0atna0l1rutu6cRp7lOk06rntZnw7Dxtsm2qbcZsOXYBtuutm22fWFnYhdnt8Wuw+6TvZN9un2N/T0HDYfZDqsdWh1+c7RyFDpWOt6azpzuP33F9JbpL2dYzxDP2DPjthPLKcRpnVOb00dnF2e5c4PziIuJS4LLLpc+Lpsbxt3IveRKdPVxXeF60vWdm7Obwu2o26/uNu5p7ofcn8w0nymeWTNz0MPIQ+BR5dE/C5+VMGvfrH5PQ0+BZ7XnIy9jL5FXrdewt6V3qvdh7xc+9j5yn+M+4zw33jLeWV/MN8C3yLfLT8Nvnl+F30N/I/9k/3r/0QCngCUBZwOJgUGBWwL7+Hp8Ib+OPzrbZfay2e1BjKC5QRVBj4KtguXBrSFoyOyQrSH355jOkc5pDoVQfujW0Adh5mGLw34MJ4WHhVeGP45wiFga0TGXNXfR3ENz30T6RJZE3ptnMU85ry1KNSo+qi5qPNo3ujS6P8YuZlnM1VidWElsSxw5LiquNm5svt/87fOH4p3iC+N7F5gvyF1weaHOwvSFpxapLhIsOpZATIhOOJTwQRAqqBaMJfITdyWOCnnCHcJnIi/RNtGI2ENcKh5O8kgqTXqS7JG8NXkkxTOlLOW5hCepkLxMDUzdmzqeFpp2IG0yPTq9MYOSkZBxQqohTZO2Z+pn5mZ2y6xlhbL+xW6Lty8elQfJa7OQrAVZLQq2QqboVFoo1yoHsmdlV2a/zYnKOZarnivN7cyzytuQN5zvn//tEsIS4ZK2pYZLVy0dWOa9rGo5sjxxedsK4xUFK4ZWBqw8uIq2Km3VT6vtV5eufr0mek1rgV7ByoLBtQFr6wtVCuWFfevc1+1dT1gvWd+1YfqGnRs+FYmKrhTbF5cVf9go3HjlG4dvyr+Z3JS0qavEuWTPZtJm6ebeLZ5bDpaql+aXDm4N2dq0Dd9WtO319kXbL5fNKNu7g7ZDuaO/PLi8ZafJzs07P1SkVPRU+lQ27tLdtWHX+G7R7ht7vPY07NXbW7z3/T7JvttVAVVN1WbVZftJ+7P3P66Jqun4lvttXa1ObXHtxwPSA/0HIw6217nU1R3SPVRSj9Yr60cOxx++/p3vdy0NNg1VjZzG4iNwRHnk6fcJ3/ceDTradox7rOEH0x92HWcdL2pCmvKaRptTmvtbYlu6T8w+0dbq3nr8R9sfD5w0PFl5SvNUyWna6YLTk2fyz4ydlZ19fi753GDborZ752PO32oPb++6EHTh0kX/i+c7vDvOXPK4dPKy2+UTV7hXmq86X23qdOo8/pPTT8e7nLuarrlca7nuer21e2b36RueN87d9L158Rb/1tWeOT3dvfN6b/fF9/XfFt1+cif9zsu72Xcn7q28T7xf9EDtQdlD3YfVP1v+3Njv3H9qwHeg89HcR/cGhYPP/pH1jw9DBY+Zj8uGDYbrnjg+OTniP3L96fynQ89kzyaeF/6i/suuFxYvfvjV69fO0ZjRoZfyl5O/bXyl/erA6xmv28bCxh6+yXgzMV70VvvtwXfcdx3vo98PT+R8IH8o/2j5sfVT0Kf7kxmTk/8EA5jz/GMzLdsAAAAgY0hSTQAAeiUAAICDAAD5/wAAgOkAAHUwAADqYAAAOpgAABdvkl/FRgAABlBJREFUeNq0l01sXUcVx39nZu5933lxYjufjoJTkiYtsUSloAZagiiqhKKyABZIkdhBWhZVYVEpEkItbFjAAikqFTsECKlIJVSqgApoCjSFhtRpS9p8EpLGzYft2H5+z+/de2cOi/vsOE5au0k40pHe1Zs5H/85539mhJ+9zQ2ieu23CAQFrz3ALqw8UHDyydiajU5YDpCFMNHxnE2y8AbKX4G/YOQqRm60tUBk0QC8bsPIN/pK9kvrqm5jb9FSiwwFA6Zr0KvS8TCZZlyeCVyYzs5OtP3vUJ7FyrFbCyCoA/luf8U+dm9P3Lum7Ci53EAgB0XnjIAR5hKeTgMXWp63xjujky2/H+H7GPFLDyAN98SReea+VYUHttRjIoFOUHzXo3JzkW6SVoTYCDM+8PZ4wvCVzisEfRRnji0eQBq2LSvZFz6zpjQ4ULG0A6RBET6aKFAwQmTgxGTKqxfbZ5Is7Maad+avM6gyp2m4u16yLz08UB5cX3U0MyW7BeezaCRBmcmUu5fHPLy+NFhw5g/4sGW+TzO3I2hUKMgvHlxbXLuiYGil4Rqst6EBaKaBddWInauLA0bk53l9zSHQrSjhqftXle5bX45oZXrbjmfVdI+jlQa2LIsY6ivsQPnebCEZAuC5d6AWP/7xWsRM1i3vO6iieY5pgE/0xPSU7RN43ZoHgOIK5omhlXHZGMEDInLH1YiQKFScYfuKQgUrj8/WQP/6qvtyf8mRBM1b9UNUBDINTGWeTBdfv3BvojBQjegp26/gWWmw8sVNtaheMHlhGj5cM1XWViIeWlvFiNJMPZbF982qD0otEu6qRSsRvmBiaz7XVzIUnRBZwRmwco3ZTDfyWU18oK/o+Na2Ph7d2ks9tkykWV5Q89aZBWoNOAOxFcpW6C0YsLLLGWH78FhCMw30xJaCzQORBdStc90qc727c1WVDdWYn74zyr+vtuktWorWXM+Ueo2606C0Ms/pKc/JqRRnzZCLDavOTWeMNDPqsaEaGaqRULRC0RoiAWcF182kmQamKoFMFSfC+krMk0Or+eWpMQ78d5KCNQhCppAFJfFK2ystrzTTQCNVGl2OKRr6nTNSLiJ4lEaqTCaeoDqHgBHJYex+j3c8Rmw+MLsI1SLD3q19tDJh3+uXKNq86oMqYRY+AUNuq2gNFkhUay4yYAGLzKNcmWvjfL9eN6H1A6ZRIw1YAWcEZwSZZ1MWzAkj4D04J9KKjNR1UWbPpeKVgrt+OpyfTth3+BLPn51iRdFiZfHpYQTSQMNZ4UpsWaO6tCETG4iMEJncyetXWnzntYscGZuhv+SIjKBLMGYEWnDZgbxZtGb7UgMoWaXq8j741ekJnvrXJabSwMdq8XVHuBieOSllw66ZhoOry3aPqrKUIFYUDe+3Uh77+wVeHmkCMFBxLDUBAGMEr8pM4g+6aeFFa6RREKllyqKzv9zthPPTTeqxITaCftSLihUut7PRTlv/6HQyHZko2QOb6vGeJAtLMlK0Qj023IoYBGtgvB2eU8u4S840eR9+dNeK+KvLrSkkXvl/SskJIy0/dbHlf4IVHGMdJhrJ8H/6C/vvX1/+dif1+AC3dA9bBPvYCCrKyYn0xz7x72INjraHTDjZyPZt9uGhwaLb3sqUgN6xGBRwktP7q1eTQyPT2Q8wBkRw9BbACr6Zdf5xprln+abqnwarUd906vF6+0AoEIlQjoXDo8m5IycbX2fGz70RhB8eyVfOeEgDvRvKQ1/bXn9hcy0amPFKEnQJnX1zxzlvCLEVDo0mp35zeHx3cnr6eD7Z8v8d3cmEE4gco+dbRw84eeSRe+rP7lhZ2KGqtLLZR8nSClTIp2c1FmYUfn+h/cqLb03sTS60jlNxs5fgbgALKcoaVBn+7dnmg8cvtZ/evbm2d/PyaFlIA53uI2X+s+y6rZIXWtFCYg1HRztjzx+b2n+0lT1dVjzW3ACluxlPliMhiaTz0qGxJ0+8N/PrT2+qfHPnxsrurcuidbEIRnR+Evl9DwgBmkEZvpqef/lM48Df3p16ZvpU61hlVx/FJNC4yTm6m0EYui0TFS3vnWu98dxkuvfN6azfJOHzn9pQ+exgxQ31FMwqA3XyqTYx2vYXjzfS4X+ebR5sOfPnkROTo4wnULQ4Ix9I1f8bAC383gB1AhDLAAAAAElFTkSuQmCC";
}

exports.getId = function(url) {
    if (!globals.isValidUrl(url)) return false;
    var matches = url.match(/veoh.com\/watch\/(v([a-z]|[A-Z]|[0-9]){16})/);
    if (matches != null) {
        return matches[1];
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

/*var decodeCt = function(s) {
    var key = cryptoJS.enc.Hex.parse("8694dfcdd864caaac8902d7ebd04edae");
    var iv = cryptoJS.enc.Hex.parse("ff57cec30aeea89a0f50db4164a1da72");
    var data = cryptoJS.enc.Base64.parse(s);
    var decrypted = cryptoJS.AES.decrypt(data, key, {iv: iv, padding: cryptoJS.pad.Pkcs7, mode: cryptoJS.mode.CBC});
    return cryptoJS.enc.Hex.stringify(decrypted);
}*/

exports.getInfo = function(url, cb) {
    var info = new videostuff.downloadInfo();
    info.url = url;
    info.id = exports.getId(url);
    info.videoQualities = [];
    info.audioQualities = [];
    globals.getSource(url, function(err, resp, body) {

        info.isValid = body.indexOf("veoh-video-player-error veoh-video-player") == -1 && body.indexOf("videoDetailsJSON") > -1;
        if (info.isValid) {

            // Fix raw data
            var raw = globals.inBetween(body, "videoDetailsJSON = '", "}';").replace(/\\\//g, "/") + "}";
            if (raw.indexOf("\\") > -1) {
                var slashRegex = /\\(.)/g;
                var sMatch;
                var slashes = [];
                while (sMatch = slashRegex.exec(body)) { slashes.push(sMatch[1]); }
                for (var i = 0; i < slashes.length; i++) {
                    if (slashes[i] != '"') {
                        raw = raw.replace("\\" + slashes[i], slashes[i]);
                    }
                }
            }
            var jInfo = JSON.parse(raw);
            console.log(jInfo);

            info.thumbUrl = "http://ll-images.veoh.com/media/w120/" + jInfo.highResImage.split("imageId=")[1];
            info.title = jInfo.title;
            info.uploader = jInfo.username;
            info.viewCount = +jInfo.views;
            info.duration = jInfo.length;

            /*var token = decodeCt(jInfo.downloadUrlToken);
            console.log(token);*/



        } else {
            cb(info);
        }
    });
};

exports.validateUrl = function(url) {
    return exports.getId(url) != "";
};
