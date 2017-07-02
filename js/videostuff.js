exports.videoQuality = function(size, type, downloadUrl, progScan) {
    this.size = size;
    this.type = type;
    this.downloadUrl = downloadUrl;
    this.progScan = progScan;
    this.isMuted = false;
}

exports.audioQuality = function(size, type, downloadUrl, kbits) {
    this.size = size;
    this.type = type;
    this.downloadUrl = downloadUrl;
    this.kbits = kbits;
}

exports.downloadInfo = function(url, id, shortUrl, thumbUrl, isValid, title, uploader, desc, viewCount, duration, videoQualities, audioQualities, multiQualities) {
    this.url = url;
    this.id = id;
    this.thumbUrl = thumbUrl;
    this.isValid = isValid;
    this.title = title;
    this.uploader = uploader;
    this.viewCount = viewCount;
    this.duration = duration;
    this.videoQualities = videoQualities;
    this.audioQualities = audioQualities;
    this.multiQualities = multiQualities;
}