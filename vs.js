const path = require("path");
const express = require("express");
const cors = require("cors");
const logger = require("morgan");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const expressValidator = require("express-validator");
const vss = require("./js/vss");

const app = express();
const http = require("http");
const port = 8081;
const server = http.Server(app).listen(port);
console.log("VidSnagger server running.");

app.use(logger("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(expressValidator({
    customValidators: {
        isValidUrl: function(url) {
            if (url === undefined) {
                return false;
            }

            // Loop through video sharing sites and validate
            //url = decodeURIComponent(url);
            for (let i = 0; i < vss.list.length; i++) {
                let s = vss[vss.list[i]];
                if (s.validateUrl(url)) {
                    return true;
                }
            }
            return false;
        }
    }
}));
app.use(cookieParser());
app.use(cors());

app.use(express.static("./"));
app.post("/", function(req, res, next) {

    // Validate url query
    req.checkBody("url", "Invalid url").isValidUrl();
    let errors = req.validationErrors();
    if (errors) {
        res.send({status: "Invalid url", data: ""});
        return;
    }
    let url = req.body.url;

    res.send({status: "ok", data: url});
});
