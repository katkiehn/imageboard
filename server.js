const path = require("path");
const express = require("express");
const app = express();
const db = require("./db");
const { uploader } = require("./middleware");
const s3 = require("./s3");

app.use(express.static(path.join(__dirname, "public")));
app.use(express.static(path.join(__dirname, "uploads")));
app.use(express.json());
//api is a prefix to separate endpoints that are used for programatic handling not for presentation, i.e. they return json
app.get("/api/images", (req, res) => {
    // req.query is my query string converted into object, thnaks to express

    if (req.query.last_id) {
        db.getMoreImages(req.query.last_id).then((images) => {
            res.json(images);
        });
    } else {
        db.getImages().then((images) => {
            res.json(images);
        });
    }
});

// uploader is our multer  middleware,
app.post("/api/images", uploader.single("photo"), s3.upload, (req, res) => {
    // 'respond to the client- success/failure'; req.file is created by Multer if upload worked
    if (req.file) {
        db.insertImage(
            `https://s3.amazonaws.com/${s3.S3_BUCKET}/${req.file.filename}`,
            req.body.title,
            req.body.description,
            req.body.username
        )
            .then((imageObj) => {
                res.json({
                    success: true,
                    message: "File uploaded",
                    image: imageObj,
                });
            })
            .catch((err) => {
                res.status(500);
                res.json({
                    success: false,
                    message: "File upload failed",
                });
            });
    } else {
        res.status(500);
        res.json({
            success: false,
            message: "File upload failed",
        });
    }
});

app.delete("/api/images/:id", (req, res) => {
    // I can access id in my path parameter(everything after ":")object, i.e. id
    db.deleteImage(req.params.id)
        .then(() => {
            res.send();
        })
        .catch((err) => {
            res.status(500).send();
        });
});

// rest api conventions: get the comments belonging to a specific imageId of the images resource;
//  api prefix to differentiate betweens client side routes and api routes
app.get("/api/images/:imageId/comments", (req, res) => {
    db.getComments(req.params.imageId)
        .then((comments) => {
            res.json(comments);
        })
        .catch((err) => {
            res.status(500).send();
            console.log("get comments error", err);
        });
});
// rest api conventions: same path as in our get handler, because we are adding a comment to a specific image resource
app.post("/api/images/:imageId/comments", (req, res) => {
    console.log(req.body);
    db.insertComment(req.body.comment, req.body.username, req.params.imageId)
        .then((newComment) => {
            // json does a 200 status by default
            res.json(newComment);
        })
        .catch((err) => {
            console.log(err);
            res.status(500);
            res.json({
                success: false,
                message:
                    "Sorry mate, there was an issue adding your comment. Please try again!",
            });
        });
});

// has to come last, after other get requests;
// any other endpoint has to come before because otherwise this "wild card" will be used
app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"));
});

app.listen(process.env.IMAGEBOARD_PORT || 3002, () =>
    console.log(`I'm listening.`)
);
