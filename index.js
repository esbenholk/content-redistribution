const PORT = process.env.PORT || 8080;
const PORT2 = "localhost:8080";
const express = require("express");
const app = express();
const compression = require("compression");
const databaseActions = require("./utils/db.js");
const multer = require("multer");
const uidSafe = require("uid-safe");
const path = require("path");
const s3 = require("./s3");
const { s3Url } = require("./config.json");
const server = require("http").Server(app);
const io = require("socket.io")(server, { origins: PORT2 });

app.use(compression());
app.use(express.static("./public"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
if (process.env.NODE_ENV != "production") {
    app.use(
        "/bundle.js",
        require("http-proxy-middleware")({
            target: "http://localhost:8081/"
        })
    );
} else {
    app.use("/bundle.js", (req, res) => res.sendFile(`${__dirname}/bundle.js`));
}

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "https://s3.amazonaws.com");
    next();
});

const diskStorage = multer.diskStorage({
    destination: function(req, file, callback) {
        callback(null, __dirname + "/uploads");
    },
    filename: function(req, file, callback) {
        uidSafe(24).then(function(uid) {
            callback(null, uid + path.extname(file.originalname));
        });
    }
});
const uploader = multer({
    storage: diskStorage,
    limits: {
        fileSize: 2097152
    }
});

app.post("/uploadfile", uploader.single("file"), s3.upload, (req, res) => {
    const imageURL = `${s3Url}/${req.file.filename}`;
    console.log("this is the image url address created with aws", imageURL);
    databaseActions
        .upload(imageURL)
        .then(result => {
            console.log("file put into database", result);
            io.sockets.emit("new_imagefile_added", {
                image: result.rows[0]
            });
            res.redirect("/");
        })
        .catch(console.log("error: can not put file in database"));
});
app.post("/uploadimageurl", (req, res) => {
    console.log("this is the image url uploaded manually", req.body.imageurl);
    databaseActions
        .upload(req.body.imageurl)
        .then(result => {
            console.log("url put into database", result);
            res.redirect("/");
        })
        .catch(console.log("error: can not put url in database"));
});

app.get("*", function(req, res) {
    res.sendFile(__dirname + "/index.html");
});

server.listen(PORT, function() {
    console.log("I'm listening.");
});

io.on("connection", function() {
    console.log("created socket connection");
    databaseActions
        .getImages()
        .then(result => {
            console.log("have images from database", result.rows);
            io.sockets.emit("images_for_5thdimension", {
                images: result.rows
            });
        })
        .catch("error: unable to get imageurls from database");
});
