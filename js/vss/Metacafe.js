const path = require('path');
const videostuff = require('../../js/videostuff');
const um = require('../../js/upm');
const globals = require("../globals");

exports.getHost = function() {
    return "http://www.metacafe.com/";
};

exports.getFavicon = function() {
    return "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAEcElEQVRYhcWXXWwVRRTH/2dm9vPetrdQqBRbeWgDjRqjaAg1JAKKJlhCpD6o4cEYDC9tDA9EMJgbIXxogh8BTHzU4BPqmyaYgCiSYJGYmFCJPECIQBGkH9zdu7szc3y4bSj2VkGv7T/ZZDdn9pzfnP/MZJeYGTMpMaPV/1eAnQ82x28tfHzGAGLo5RZix4wBMNtnPI+eGN3ZMWf6AYoLfMviKZWTUHCennaAshssy/uiBRnDGPvctAOwtT1QBJNaSIHlw8X7Z00fQHGBb6xYzalFqhlBoAqutKumDaDs+kvzoZifZrcdcD3TBsAWPVAEO/ZsUgsAT05lQ20B+jo8C36W01uzTw0jyMkGOYUNNQUo3yO7cp5qS3Vl/jQeIICmsKGmAMxYB4dgGJACcGQFwaQWYgobagbwa1+HZ5i7OWW4kmA0fks0H/UdUdkNOdlQbTfUDKB1rlya91VbklkoV4AFHyFQkSTdsqKKDWr8ZmRX5+z6OuDSteG4BS13V71+kJlyL0ISGKh4TvRl8MaZb+Mdndc8h5pMZgHiFUPFBYVC8fzQJAAFatej/EGTX1gUZ6VRjOW6E1EUWss0vxwbuJIQR3o4OxteKLUvW5zbYA8J19kYRwZBqBo59lcC+GwSQLjlzMnhYvtLge/uDxqdVUgMWDMm9q9qcQCARKq5svhcAavNV3rAbUNT+jLV0R7EvJHGBjOjZyIAVfskS3Z1vkag3a5HXhzbSXEC4HsCEFXoAoEoi5+PD85a4YXYaOfEne7DyTE/5zaDgaikrYVqyW/9efC2DkyUt2XgvWh753eC8FGQl4+kkYEZ4xAEGGuzKObDTJwIQR65PAxiI4Ugm5gyhuQJ6dp3855Hf5znh/zVUZ+NbHcaZeznSGmZzQUwOGUHxnVxU2vQPDe/23VEHywQJRZCAEKSJYMvLovShrbXL9y4tmTJ+oBIRgYxBFvl2UdDR24mItzU5jTK4h1jwFKw8BUVImVONR3r7/9HgHFF2xeuVY484PpiXrlkwACCQCJNzVVjqffmp4Uo16Q/DkO/EZmGBWNEV8b5QiAQBEgJEGEkTg8qR20Ov/7+0h0DAMD1Yse99YFzwPFEtylbJJoRugJQBC31nouHww+bh9ztXkjrb44VH1cgBKy1lxLi3sKR/s8n5r1jgHEluzo3CaKdjiO8KDaQAvByClqbH8285IVkf9P6fCi2jWgDjHVAszl/XXPXfd+euvzXfHd9EnpbBvZmqVmWZfqnsE6BAESjGipQi2lILNEZsSBCTkoUVGWNZ4wG5Yq0Wr5/dRSHb57tv3K11JWUzD7XEwgDifhGOpwM+KfIN69ACowYfXxI630A0Oj7jb6htTUDAIDWvRdjb+uZ3iSx6zLwMBw+rk/UtTeG3vzRJH3/ytVoZeHoD72xsd2pMYOC+dVqee56DVTTaHHhIr/ADaOHCmuUS7/UHzn5ycT4ucceaJ2d994WzNsavjl97raXmblm1+9ruur+dkzX5HhNOvBfNON/x38CmURQU3z1b4UAAAAASUVORK5CYII=";
}

exports.getId = function(url) {
    if (!globals.isValidUrl(url)) return "";
    var matches = url.match(/metacafe.com\/(watch|w|embed)\/(\d{7,8})($|\/.*)/);
    if (matches == null) return "";
    return +matches[2];
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
    globals.getSource("http://www.metacafe.com/watch/" + info.id, function(err, resp, body) {

        info.isValid = body.indexOf("MessageErrMsg") == -1;
        if (info.isValid) {

            var jInfo = JSON.parse(globals.inBetween(body, "flashVarsCache = ", "};") + "}");

            // Fix some properties (they're url encoded for whatever reason)
            jInfo.mediaData = JSON.parse(decodeURIComponent(jInfo.mediaData));
            jInfo.title = decodeURIComponent(jInfo.title);

            // Set standard info stuff..
            info.thumbUrl = globals.inBetween(body, '<link rel="image_src" href="', '" />');
            info.title = jInfo.title;
            info.uploader = jInfo.nickName;
            info.viewCount = +globals.inBetween(body, '<h2 id="Views">', "</h2>").split(" <small>")[0].replace(/\s/g, "").replace(/,|\./g, "");
            info.duration = +jInfo.duration;

            // Loop through all available qualities and add them.
            for (var i = 0, quals = Object.keys(jInfo.mediaData); i < quals.length; i++) {
                var qName = quals[i];
                var qual = jInfo.mediaData[qName];
                var dlURl = qual.mediaURL + "?" + qual.access[0].key + "=" + qual.access[0].value;
                addQuality({url: dlURl, progScan: (qName == "MP4" ? "360p" : "720p")}, info, quals.length, cb);
            }
        } else {
            cb(info);
        }
    });
};

exports.validateUrl = function(url) {
    return exports.getId(url) != "";
};
