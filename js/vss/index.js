let list = [];

require("fs").readdirSync(__dirname + "/").forEach(function(file) {
    if (file.match(/.+\.js/g) !== null && file !== "index.js") {
        let name = file.replace(".js", "");
        exports[name] = require("./" + file);
        list.push(name);
    }
});

exports.list = list;